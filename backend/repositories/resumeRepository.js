import prisma from "../db/prisma.js";

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
    return await client.personalInfo.upsert({
      where: { resume_id: resumeId },
      create: {
        resume_id: resumeId,
        full_name: info.full_name || "",
        profession: info.profession || "",
        email: info.email || "",
        phone: info.phone || "",
        location: info.location || "",
        linkedin: info.linkedin || "",
        website: info.website || "",
        image_url: info.image_url || ""
      },
      update: {
        ...(info.full_name !== undefined && { full_name: info.full_name }),
        ...(info.profession !== undefined && { profession: info.profession }),
        ...(info.email !== undefined && { email: info.email }),
        ...(info.phone !== undefined && { phone: info.phone }),
        ...(info.location !== undefined && { location: info.location }),
        ...(info.linkedin !== undefined && { linkedin: info.linkedin }),
        ...(info.website !== undefined && { website: info.website }),
        ...(info.image_url !== undefined && { image_url: info.image_url })
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
        position: exp.position !== undefined ? (typeof exp.position === "number" ? exp.position : index) : index,
        company: exp.company || "",
        job_title: exp.job_title || (typeof exp.position === "string" ? exp.position : "") || "",
        start_date: exp.start_date || "",
        end_date: exp.end_date || "",
        is_current: !!exp.is_current,
        description: exp.description || ""
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
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        graduation_date: edu.graduation_date || "",
        gpa: edu.gpa || ""
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
        name: proj.name || "",
        type: proj.type || "",
        description: proj.description || ""
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
        skill_name: typeof sk === "string" ? sk : sk.skill_name || "",
        proficiency: (typeof sk === "object" && sk.proficiency) || "intermediate"
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
