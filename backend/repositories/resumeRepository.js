import prisma from "../db/prisma.js";
import { cleanNullBytes } from "../utils/sanitize.js";

const resumeIncludeRelations = {
  personal_info: true,
  experiences: {
    orderBy: { position: "asc" }
  },
  education: {
    orderBy: { position: "asc" }
  },
  projects: {
    orderBy: { position: "asc" }
  },
  skills: true
};

export async function createResume(userId, title, template) {
  try {
    return await prisma.resume.create({
      data: {
        user_id: userId,
        title: title || "Untitled Resume",
        template: template || "classic"
      },
      include: resumeIncludeRelations
    });
  } catch (error) {
    console.error("Repository error creating resume:", error);
    throw error;
  }
}

export async function deleteResume(resumeId, userId) {
  try {
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        user_id: userId
      }
    });

    if (!resume) {
      return 0;
    }

    await prisma.resume.delete({
      where: { id: resumeId }
    });

    return 1;
  } catch (error) {
    console.error("Repository error deleting resume:", error);
    throw error;
  }
}

export async function getResumeById(resumeId, userId) {
  try {
    return await prisma.resume.findFirst({
      where: {
        id: resumeId,
        user_id: userId
      },
      include: resumeIncludeRelations
    });
  } catch (error) {
    console.error("Repository error fetching resume by id:", error);
    throw error;
  }
}

export async function getPublicResumeById(resumeId) {
  try {
    return await prisma.resume.findFirst({
      where: {
        id: resumeId,
        is_public: true
      },
      include: resumeIncludeRelations
    });
  } catch (error) {
    console.error("Repository error fetching public resume:", error);
    throw error;
  }
}

export async function getUserResumes(userId) {
  try {
    return await prisma.resume.findMany({
      where: {
        user_id: userId
      },
      include: resumeIncludeRelations,
      orderBy: {
        updated_at: "desc"
      }
    });
  } catch (error) {
    console.error("Repository error fetching user resumes:", error);
    throw error;
  }
}

export async function updateResumeFields(resumeId, userId, resumeFields, client = prisma) {
  try {
    const dataToUpdate = {};
    if (resumeFields.title !== undefined) dataToUpdate.title = resumeFields.title;
    if (resumeFields.is_public !== undefined) dataToUpdate.is_public = resumeFields.is_public;
    if (resumeFields.public !== undefined) dataToUpdate.is_public = resumeFields.public;
    if (resumeFields.public_slug !== undefined) dataToUpdate.public_slug = resumeFields.public_slug;
    if (resumeFields.template !== undefined) dataToUpdate.template = resumeFields.template;
    if (resumeFields.accent_color !== undefined) dataToUpdate.accent_color = resumeFields.accent_color;
    if (resumeFields.professional_summary !== undefined) dataToUpdate.professional_summary = resumeFields.professional_summary;

    return await client.resume.update({
      where: { id: resumeId },
      data: dataToUpdate
    });
  } catch (error) {
    console.error("Repository error updating resume fields:", error);
    throw error;
  }
}

export async function upsertPersonalInfo(resumeId, info, client = prisma) {
  try {
    const clean = cleanNullBytes(info || {});
    return await client.personalInfo.upsert({
      where: { resume_id: resumeId },
      create: {
        resume_id: resumeId,
        full_name: clean.full_name || "",
        profession: clean.profession || "",
        email: clean.email || "",
        phone: clean.phone || "",
        location: clean.location || "",
        linkedin: clean.linkedin || "",
        website: clean.website || "",
        image_url: clean.image_url || ""
      },
      update: {
        ...(clean.full_name !== undefined && { full_name: clean.full_name }),
        ...(clean.profession !== undefined && { profession: clean.profession }),
        ...(clean.email !== undefined && { email: clean.email }),
        ...(clean.phone !== undefined && { phone: clean.phone }),
        ...(clean.location !== undefined && { location: clean.location }),
        ...(clean.linkedin !== undefined && { linkedin: clean.linkedin }),
        ...(clean.website !== undefined && { website: clean.website }),
        ...(clean.image_url !== undefined && { image_url: clean.image_url })
      }
    });
  } catch (error) {
    console.error("Repository error upserting personal info:", error);
    throw error;
  }
}

export async function replaceExperiences(resumeId, experiences, client = prisma) {
  try {
    await client.experience.deleteMany({
      where: { resume_id: resumeId }
    });

    if (experiences && experiences.length > 0) {
      const records = experiences.map((exp, index) => ({
        resume_id: resumeId,
        position: typeof exp.position === "number" ? exp.position : (parseInt(exp.position, 10) || index),
        company: cleanNullBytes(exp.company) || "",
        job_title: cleanNullBytes(exp.job_title || (typeof exp.position === "string" ? exp.position : "")) || "",
        start_date: cleanNullBytes(exp.start_date) || "",
        end_date: cleanNullBytes(exp.end_date) || "",
        is_current: !!exp.is_current,
        description: cleanNullBytes(exp.description) || ""
      }));

      await client.experience.createMany({
        data: records
      });
    }
  } catch (error) {
    console.error("Repository error replacing experiences:", error);
    throw error;
  }
}

export async function replaceEducation(resumeId, educations, client = prisma) {
  try {
    await client.education.deleteMany({
      where: { resume_id: resumeId }
    });

    if (educations && educations.length > 0) {
      const records = educations.map((edu, index) => ({
        resume_id: resumeId,
        position: typeof edu.position === "number" ? edu.position : index,
        institution: cleanNullBytes(edu.institution) || "",
        degree: cleanNullBytes(edu.degree) || "",
        field: cleanNullBytes(edu.field) || "",
        graduation_date: cleanNullBytes(edu.graduation_date) || "",
        gpa: cleanNullBytes(edu.gpa) || ""
      }));

      await client.education.createMany({
        data: records
      });
    }
  } catch (error) {
    console.error("Repository error replacing education:", error);
    throw error;
  }
}

export async function replaceProjects(resumeId, projects, client = prisma) {
  try {
    await client.project.deleteMany({
      where: { resume_id: resumeId }
    });

    if (projects && projects.length > 0) {
      const records = projects.map((proj, index) => ({
        resume_id: resumeId,
        position: typeof proj.position === "number" ? proj.position : index,
        name: cleanNullBytes(proj.name) || "",
        type: cleanNullBytes(proj.type) || "",
        description: cleanNullBytes(proj.description) || ""
      }));

      await client.project.createMany({
        data: records
      });
    }
  } catch (error) {
    console.error("Repository error replacing projects:", error);
    throw error;
  }
}

export async function replaceSkills(resumeId, skills, client = prisma) {
  try {
    await client.skill.deleteMany({
      where: { resume_id: resumeId }
    });

    if (skills && skills.length > 0) {
      const records = skills.map(sk => ({
        resume_id: resumeId,
        skill_name: cleanNullBytes(typeof sk === "string" ? sk : sk.skill_name || ""),
        proficiency: cleanNullBytes((typeof sk === "object" && sk.proficiency) || "intermediate")
      }));

      await client.skill.createMany({
        data: records
      });
    }
  } catch (error) {
    console.error("Repository error replacing skills:", error);
    throw error;
  }
}
