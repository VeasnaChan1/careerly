import prisma from "../db/prisma.js";
import { imageKit } from "../config/imageKit.js";
import fs from "fs";
import * as resumeRepository from "../repositories/resumeRepository.js";

// POST /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, template } = req.body;

    const newResume = await resumeRepository.createResume(userId, title, template);

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
      resumeId: newResume.id
    });
  } catch (error) {
    console.error("Create resume error:", error);
    return res.status(400).json({
      message: error.message
    });
  }
};

// DELETE /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deleted = await resumeRepository.deleteResume(resumeId, userId);

    if (deleted === 0) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to delete it"
      });
    }

    // Background ImageKit cleanup if configured
    if (imageKit && imageKit.assets) {
      imageKit.assets
        .list({
          searchQuery: `name = "resume-${resumeId}.jpg" OR name LIKE "resume-${resumeId}_%"`
        })
        .then((files) => {
          if (files && files.length > 0) {
            files.forEach((file) => {
              imageKit.deleteFile(file.fileId).catch(() => {});
            });
          }
        })
        .catch(() => {});
    }

    return res.status(200).json({
      message: "Resume deleted successfully"
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(400).json({
      message: error.message
    });
  }
};

// GET /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await resumeRepository.getResumeById(resumeId, userId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to view it"
      });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      resume
    });
  } catch (error) {
    console.error("Get resume error:", error);
    return res.status(400).json({
      message: error.message
    });
  }
};

// GET /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await resumeRepository.getPublicResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to view it"
      });
    }

    return res.status(200).json({
      message: "Resume is Public successfully",
      data: resume
    });
  } catch (error) {
    console.error("Get public resume error:", error);
    return res.status(400).json({
      message: error.message
    });
  }
};

// POST /api/resumes/duplicate/:resumeId
export const duplicateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const original = await resumeRepository.getResumeById(resumeId, userId);
    if (!original) {
      return res.status(404).json({
        message: "Original resume not found or you are not authorized to duplicate it"
      });
    }

    const newTitle = `${original.title || "Untitled Resume"} (Copy)`;

    const duplicated = await prisma.$transaction(async (tx) => {
      const newResume = await tx.resume.create({
        data: {
          user_id: userId,
          title: newTitle,
          template: original.template || "classic",
          accent_color: original.accent_color || "#3B82F6",
          professional_summary: original.professional_summary || "",
          is_public: false
        }
      });

      if (original.personal_info) {
        await tx.personalInfo.create({
          data: {
            resume_id: newResume.id,
            full_name: original.personal_info.full_name || "",
            profession: original.personal_info.profession || "",
            email: original.personal_info.email || "",
            phone: original.personal_info.phone || "",
            location: original.personal_info.location || "",
            linkedin: original.personal_info.linkedin || "",
            website: original.personal_info.website || "",
            image_url: original.personal_info.image_url || ""
          }
        });
      }

      if (original.experiences && original.experiences.length > 0) {
        await tx.experience.createMany({
          data: original.experiences.map((exp, idx) => ({
            resume_id: newResume.id,
            position: exp.position !== undefined ? exp.position : idx,
            company: exp.company || "",
            job_title: exp.job_title || "",
            start_date: exp.start_date || "",
            end_date: exp.end_date || "",
            is_current: !!exp.is_current,
            description: exp.description || ""
          }))
        });
      }

      if (original.education && original.education.length > 0) {
        await tx.education.createMany({
          data: original.education.map((edu, idx) => ({
            resume_id: newResume.id,
            position: edu.position !== undefined ? edu.position : idx,
            institution: edu.institution || "",
            degree: edu.degree || "",
            field: edu.field || "",
            graduation_date: edu.graduation_date || "",
            gpa: edu.gpa || ""
          }))
        });
      }

      if (original.projects && original.projects.length > 0) {
        await tx.project.createMany({
          data: original.projects.map((proj, idx) => ({
            resume_id: newResume.id,
            position: proj.position !== undefined ? proj.position : idx,
            name: proj.name || "",
            type: proj.type || "",
            description: proj.description || ""
          }))
        });
      }

      if (original.skills && original.skills.length > 0) {
        await tx.skill.createMany({
          data: original.skills.map((sk) => ({
            resume_id: newResume.id,
            skill_name: typeof sk === "string" ? sk : sk.skill_name || "",
            proficiency: (typeof sk === "object" && sk.proficiency) || "intermediate"
          }))
        });
      }

      return newResume;
    });

    const fullResume = await resumeRepository.getResumeById(duplicated.id, userId);

    return res.status(201).json({
      message: "Resume duplicated successfully",
      resume: fullResume,
      resumeId: fullResume.id
    });
  } catch (error) {
    console.error("Duplicate resume error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};

// PUT /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    const data = typeof resumeData === "string" ? JSON.parse(resumeData) : resumeData || {};

    if (data.public !== undefined) {
      data.is_public = data.public;
    }

    if (image) {
      const stream = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: stream,
        fileName: `resume-${resumeId}.jpg`,
        folder: "user-resume",
        useUniqueFileName: false,
        transformation: {
          pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : "")
        }
      });

      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      if (!data.personal_info) data.personal_info = {};
      data.personal_info.image_url = response.url;
    }

    await prisma.$transaction(async (tx) => {
      await resumeRepository.updateResumeFields(resumeId, userId, data, tx);

      if (data.personal_info) {
        await resumeRepository.upsertPersonalInfo(resumeId, data.personal_info, tx);
      }

      if (data.experience !== undefined || data.experiences !== undefined) {
        await resumeRepository.replaceExperiences(resumeId, data.experience || data.experiences, tx);
      }

      if (data.education !== undefined) {
        await resumeRepository.replaceEducation(resumeId, data.education, tx);
      }

      if (data.project !== undefined || data.projects !== undefined) {
        await resumeRepository.replaceProjects(resumeId, data.project || data.projects, tx);
      }

      if (data.skills !== undefined) {
        await resumeRepository.replaceSkills(resumeId, data.skills, tx);
      }
    });

    const updatedResume = await resumeRepository.getResumeById(resumeId, userId);

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    console.error("Update resume error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};
