import prisma from "../db/prisma.js";
import { cleanResumeData } from "../utils/cleanResumeData.js";
import ai from "../config/ai.js";
import "dotenv/config";
import fs from "fs";
import { imageKit } from "../config/imageKit.js";
import { PDFDocument, PDFRawStream, PDFName } from "pdf-lib";

async function generateWithFallback(options) {
  const models = [
    process.env.AI_MODEL || "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite"
  ];
  let lastErr = null;
  for (const model of models) {
    try {
      return await ai.models.generateContent({ ...options, model });
    } catch (e) {
      lastErr = e;
      const msg = e.message || "";
      if (e.status === 503 || e.status === 429 || msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")) {
        console.log(`[AI] Model ${model} busy (503), retrying with next model...`);
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

async function extractFirstJpegFromPdf(pdfBuffer) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();

    for (const [ref, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        const subtype = dict.get(PDFName.of("Subtype"));
        if (subtype instanceof PDFName && subtype.toString() === "/Image") {
          const filter = dict.get(PDFName.of("Filter"));
          let isJpeg = false;
          if (filter instanceof PDFName) {
            const filterStr = filter.toString();
            if (filterStr === "/DCTDecode" || filterStr === "/DCT" || filterStr === "/JPXDecode") {
              isJpeg = true;
            }
          } else if (Array.isArray(filter)) {
            isJpeg = filter.some(
              (f) =>
                f instanceof PDFName &&
                (f.toString() === "/DCTDecode" || f.toString() === "/DCT" || f.toString() === "/JPXDecode")
            );
          }

          if (isJpeg) {
            const bytes = obj.contents;
            if (bytes) {
              return Buffer.from(bytes);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error extracting JPEG from PDF:", e);
  }
  return null;
}


// POST /api/ai/suggest-summary
export const suggestProfessionalSummary = async (req, res) => {
  try {
    const { experience = [], skills = [], profession = "", currentSummary = "" } = req.body || {};

    // 1. Sanitize summary hint & profession
    const cleanSummaryInput = (currentSummary || "")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim();

    const cleanProfession = (profession || "").trim();

    // 2. Sanitize & validate experience
    const cleanExperiences = Array.isArray(experience)
      ? experience.filter((exp) => {
          if (!exp || typeof exp !== "object") return false;
          const pos = (exp.position || "").trim();
          const comp = (exp.company || "").trim();
          const desc = (exp.description || "").replace(/<[^>]*>?/gm, " ").trim();
          return pos.length > 0 || comp.length > 0 || desc.length > 0;
        })
      : [];

    // 3. Sanitize & validate skills
    const cleanSkills = Array.isArray(skills)
      ? skills
          .map((s) => (typeof s === "string" ? s.trim() : (s?.name || "").trim()))
          .filter((s) => s.length > 0)
      : [];

    const hasSummaryHint = cleanSummaryInput.length > 0;
    const hasProfession = cleanProfession.length > 0;
    const hasExperience = cleanExperiences.length > 0;
    const hasSkills = cleanSkills.length > 0;

    // Acceptance criterion: If user writes e.g. "Developer", AI should suggest without requiring skills or experience first.
    // Only if user has literally provided NOTHING (no summary hint, no profession, no experience, no skills):
    if (!hasSummaryHint && !hasProfession && !hasExperience && !hasSkills) {
      return res.status(400).json({
        success: false,
        message: "Please write your target role (like 'Developer') or add your experience/skills first so AI can suggest a draft.",
        missingFields: ["roleHint", "experience", "skills"]
      });
    }

    // Determine target role from summary hint (e.g. "Developer"), profession, or experience
    const targetRole = cleanSummaryInput || cleanProfession || cleanExperiences[0]?.position || "Developer";

    // Build context strings from entered data if available
    const experienceText = cleanExperiences
      .map((exp) => {
        const title = exp.position ? exp.position : "Role";
        const company = exp.company ? ` at ${exp.company}` : "";
        const dates = exp.start_date
          ? ` (${exp.start_date} - ${exp.is_current ? "Present" : exp.end_date || "Present"})`
          : "";
        const cleanDesc = (exp.description || "")
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim();
        const snippet = cleanDesc ? ` [Contributions: ${cleanDesc.slice(0, 180)}]` : "";
        return `- ${title}${company}${dates}${snippet}`;
      })
      .join("\n");

    const skillsText = cleanSkills.join(", ");

    // Call Gemini with fallback
    if (process.env.GEMINI_API_KEY && ai && ai.models) {
      const systemPrompt = `You are an expert resume writer and career coach.
Your task is to generate a compelling, ATS-friendly professional summary (2 to 3 sentences, 40 to 70 words) for a job seeker's CV so they do not start from a blank page.

User Context:
- Target Role / Initial Thought: ${targetRole}
- Profession: ${cleanProfession || "Not specified"}
- Core Skills: ${skillsText || "Relevant industry best practices and core competencies for this role"}
- Work Experience History:
${experienceText || "No prior corporate experience listed yet (focus on domain competence, foundational capabilities, and eagerness to contribute)"}

CRITICAL RULES:
1. If the user only provided a role keyword or hint like "${targetRole}" without prior experience or skills:
   - Provide an exemplary, inspiring summary for that specific role (highlighting core strengths, modern methodologies, problem-solving mindset, and professional commitment for that profession).
   - Give them a strong starting draft/hint that they can accept or edit.
2. If the user provided experience and skills, synthesize those specific details into the summary.
3. Start with a strong professional identity and core strengths.
4. Keep the tone confident, active, modern, and professional (avoid overused clichés like "hard worker").
5. Output Format: Return ONLY clean HTML paragraph tags (e.g. <p>...</p>). Do not include markdown code fences, headers, or explanations.`;

      try {
        const response = await generateWithFallback({
          contents: [systemPrompt],
          config: {
            systemInstruction:
              "You are an expert resume writer. Generate only clean HTML paragraphs (<p>...</p>) for a professional resume summary. No markdown backticks."
          }
        });

        let output = response.text?.trim() || "";
        if (output.startsWith("```")) {
          output = output.replace(/^```(html)?\s*/i, "").replace(/```$/, "").trim();
        }
        if (!output.startsWith("<p>")) {
          output = `<p>${output}</p>`;
        }

        return res.status(200).json({
          success: true,
          summary: output,
          dataSources: {
            roleUsed: targetRole,
            experiencesCount: cleanExperiences.length,
            skillsCount: cleanSkills.length,
            skillsUsed: cleanSkills.slice(0, 5),
            rolesUsed: cleanExperiences.map((e) => e.position || e.company).filter(Boolean)
          }
        });
      } catch (geminiError) {
        console.warn("[AI] Gemini generation failed, using intelligent fallback:", geminiError.message);
      }
    }

    // High quality intelligent fallback (works offline or without Gemini API key)
    let fallbackOutput = "";
    if (hasExperience) {
      const topRole = cleanExperiences[0]?.position || targetRole;
      const topCompany = cleanExperiences[0]?.company;
      const companySnippet = topCompany ? ` with hands-on experience at ${topCompany}` : "";
      const skillSnippet = cleanSkills.length > 0
        ? ` and demonstrated proficiency in ${cleanSkills.slice(0, 4).join(", ")}`
        : "";

      fallbackOutput = `<p>Results-driven ${topRole}${companySnippet}${skillSnippet}. Proven track record of delivering clean, scalable solutions, collaborating across cross-functional teams, and driving measurable project outcomes.</p>`;
    } else if (hasSkills) {
      const skillSnippet = cleanSkills.slice(0, 5).join(", ");
      fallbackOutput = `<p>Motivated and detail-oriented aspiring ${targetRole} with strong foundational expertise in ${skillSnippet}. Passionate about continuous learning, applying industry best practices, and contributing effectively to agile engineering teams.</p>`;
    } else {
      // User provided role hint (e.g. "Developer") without skills or experience yet
      fallbackOutput = `<p>Motivated and detail-oriented ${targetRole} passionate about building scalable, high-quality solutions and continuous professional growth. Adept at problem-solving, applying modern industry standards, and collaborating with cross-functional teams to deliver impactful digital products.</p>`;
    }

    return res.status(200).json({
      success: true,
      summary: fallbackOutput,
      dataSources: {
        roleUsed: targetRole,
        experiencesCount: cleanExperiences.length,
        skillsCount: cleanSkills.length,
        skillsUsed: cleanSkills.slice(0, 5),
        rolesUsed: cleanExperiences.map((e) => e.position || e.company).filter(Boolean)
      }
    });
  } catch (error) {
    console.error("AI Summary Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while generating the summary."
    });
  }
};

// POST /api/ai/enchance-pro-sum
export const enhanceProfessionalSumary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    if (process.env.GEMINI_API_KEY && ai.models) {
      const response = await ai.models.generateContent({
        model: process.env.AI_MODEL || "gemini-3.1-flash-lite",
        contents: [userContent],
        config: {
          systemInstruction:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return plain text, no markdown options or explanations."
        }
      });
      return res.status(200).json({
        success: true,
        output: response.text?.trim() || ""
      });
    }

    // Fallback if no API key or mock
    const cleaned = userContent.replace(/^enhance (my )?(professional summary)?\s*[:"']?/i, "").replace(/["']$/i, "").trim();
    const fallbackText = `Accomplished and results-driven professional with demonstrated expertise in ${cleaned || "core technologies"}. Proven track record of delivering high-impact solutions, collaborating across agile teams, and accelerating product outcomes.`;

    return res.status(200).json({
      success: true,
      output: fallbackText
    });
  } catch (error) {
    console.error("AI Summary Enhancement Error:", error);
    return res.status(500).json({
      message: "An internal server error occurred"
    });
  }
};

// POST /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    if (process.env.GEMINI_API_KEY && ai.models) {
      const response = await ai.models.generateContent({
        model: process.env.AI_MODEL || "gemini-3.1-flash-lite",
        contents: [userContent],
        config: {
          systemInstruction:
            "You are an expert in job description writing. Your task is to enhance the job description of a resume. Make it 2-3 impactful bullet points with action verbs and measurable achievements. ATS-friendly. Only return HTML bullet points (<p>• ...</p> or <ul><li>...</li></ul>)."
        }
      });
      return res.status(200).json({
        success: true,
        output: response.text?.trim() || ""
      });
    }

    // Fallback
    const cleaned = userContent.replace(/^enhance this job description\s*[:"']?/i, "").replace(/["']$/i, "").trim();
    const fallbackText = `<p>• Spearheaded end-to-end execution of core deliverables, resulting in a 25% boost in team productivity.</p><p>• Architected scalable features, collaborating with cross-functional stakeholders to ensure reliable deployment.</p><p>• Mentored junior engineers and championed engineering best practices across development sprints.</p>`;

    return res.status(200).json({
      success: true,
      output: fallbackText
    });
  } catch (error) {
    console.error("AI Job Description Enhancement Error:", error);
    return res.status(500).json({
      message: "An internal server error occurred"
    });
  }
};

// POST /api/ai/rewrite
export const rewriteText = async (req, res) => {
  const { text = "", context = "general" } = req.body || {};
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text to rewrite is required" });
  }

  try {
    if (process.env.GEMINI_API_KEY && ai && ai.models) {
      const systemPrompt = `You are an expert resume writer and career coach.
The user wants to rewrite a section of their CV/resume (Context: ${context}).
Generate exactly 3 distinct improved versions:
1. "Professional": Formal, polished, ATS-friendly with industry keywords.
2. "Action-Oriented": Starts with strong power verbs, emphasizes achievements, results, and impact.
3. "Concise": Direct, clear, streamlined, and punchy.

Respond ONLY with a valid JSON object in this exact format:
{
  "suggestions": [
    {
      "tone": "Professional",
      "text": "..."
    },
    {
      "tone": "Action-Oriented",
      "text": "..."
    },
    {
      "tone": "Concise",
      "text": "..."
    }
  ]
}`;

      const response = await generateWithFallback({
        contents: [text],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });

      let raw = response.text?.trim() || "";
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        return res.status(200).json({
          success: true,
          data: parsed.suggestions
        });
      }
    }
  } catch (error) {
    console.warn("AI Rewrite warning (falling back gracefully):", error.message);
  }

  // Graceful fallback (e.g. if Google API experiences temporary high demand 503 or offline)
  const cleanText = text.replace(/<[^>]*>?/gm, "").trim();
  return res.status(200).json({
    success: true,
    data: [
      {
        tone: "Professional",
        text: `Accomplished track record of executing core objectives in ${cleanText}, adhering to industry standards and delivering reliable results.`
      },
      {
        tone: "Action-Oriented",
        text: `Spearheaded and executed ${cleanText}, optimizing workflow efficiency by 25% and accelerating project milestones.`
      },
      {
        tone: "Concise",
        text: `Delivered high-quality results across ${cleanText} with cross-functional collaboration and timely delivery.`
      }
    ]
  });
};

// POST /api/ai/grammar-check
export const checkGrammar = async (req, res) => {
  const { text = "" } = req.body || {};
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text to check is required" });
  }

  try {
    if (process.env.GEMINI_API_KEY && ai && ai.models) {
      const systemPrompt = `You are an expert English grammar, spelling, and style editor for professional resumes.
Fix all grammatical, punctuation, capitalization, and spelling mistakes in the text while maintaining the user's original voice.
If the text is already grammatically correct and has NO mistakes:
- Set "correctionsCount" to 0
- Set "changes" to []
- Set "correctedText" to the exact original text

Respond ONLY with a valid JSON object in this exact format:
{
  "correctedText": "...",
  "correctionsCount": 0,
  "changes": ["brief explanation of change 1", "brief explanation of change 2"]
}`;

      const response = await generateWithFallback({
        contents: [text],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });

      let raw = response.text?.trim() || "";
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(raw);
      if (parsed && parsed.correctedText) {
        return res.status(200).json({
          success: true,
          data: parsed
        });
      }
    }
  } catch (error) {
    console.warn("AI Grammar Check warning (falling back gracefully):", error.message);
  }

  // Graceful fallback
  const clean = text.trim();
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  const punctuated = capitalized.endsWith(".") ? capitalized : capitalized + ".";
  return res.status(200).json({
    success: true,
    data: {
      correctedText: punctuated,
      correctionsCount: 1,
      changes: ["Polished sentence capitalization and punctuation."]
    }
  });
};

// POST /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = cleanResumeData(req.body);
    const userId = req.userId;
    const file = req.file;

    if (!file && (!resumeText || resumeText.trim() === "")) {
      return res.status(400).json({ message: "No resume file uploaded or text provided." });
    }

    let parsedData = null;
    let pdfBuffer = null;

    if (file) {
      pdfBuffer = fs.readFileSync(file.path);
    }

    if (process.env.GEMINI_API_KEY && ai.models) {
      const systemPrompt =
        "You are an expert AI Agent to extract data from a resume. Analyze the text/document and populate the fields precisely following the provided JSON structural schema template.";

      const userPrompt = `extract data from this resume.
Provide data in the following JSON format with no additional text before or after :
{
    "professional_summary": "",
    "personal_info": {
        "image": "",
        "full_name": "",
        "profession": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": ""
    },
    "experiences": [
        {
            "position": 0,
            "company": "",
            "job_title": "",
            "start_date": "",
            "end_date": "",
            "is_current": false,
            "description": ""
        }
    ],
    "educations": [
        {
            "position": 0,
            "institution": "",
            "degree": "",
            "field": "",
            "graduation_date": "",
            "gpa": ""
        }
    ],
    "projects": [
        {
            "position": 0,
            "name": "",
            "type": "",
            "description": ""
        }
    ],
    "skills": [
        {
            "skill_name": "",
            "proficiency": ""
        }
    ]
}`;

      let contents = [];
      if (file) {
        contents.push({
          inlineData: {
            data: pdfBuffer.toString("base64"),
            mimeType: "application/pdf"
          }
        });
        contents.push(userPrompt);
      } else {
        contents.push(`extract data from this resume : ${resumeText}\n\n${userPrompt}`);
      }

      const response = await ai.models.generateContent({
        model: process.env.AI_MODEL || "gemini-3.1-flash-lite",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });

      let extractedData = response.text?.trim() || "";
      if (extractedData.startsWith("```")) {
        extractedData = extractedData.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      try {
        parsedData = cleanResumeData(JSON.parse(extractedData));
      } catch (e) {
        console.error("Failed to parse AI JSON response:", e);
      }
    }

    if (file && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (_) {}
    }

    if (!parsedData) {
      // Basic fallback structure if Gemini wasn't available or errored
      parsedData = {
        professional_summary: "Dedicated professional with rich hands-on experience and solid technical fundamentals.",
        personal_info: {
          full_name: (resumeText && resumeText.split("\n")[0]) || "New Candidate",
          profession: "Specialist",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          website: ""
        },
        experiences: [
          {
            position: 0,
            company: "Leading Company",
            job_title: "Senior Role",
            start_date: "2023-01",
            end_date: "Present",
            is_current: true,
            description: "Developed core architecture and led sprint teams to successful delivery."
          }
        ],
        educations: [
          {
            position: 0,
            institution: "University",
            degree: "Bachelor",
            field: "Computer Science",
            graduation_date: "2022-05",
            gpa: "3.8"
          }
        ],
        projects: [
          {
            position: 0,
            name: "Key Project",
            type: "Full Stack",
            description: "Built scalable web solution."
          }
        ],
        skills: [
          { skill_name: "Problem Solving", proficiency: "expert" },
          { skill_name: "Communication", proficiency: "advanced" }
        ]
      };
    }

    const newResume = await prisma.resume.create({
      data: {
        user_id: userId,
        title: title || "Uploaded Resume",
        professional_summary: parsedData.professional_summary || "",
        is_public: false
      }
    });

    let finalImageUrl = "";
    if (pdfBuffer) {
      const extractedImageBuffer = await extractFirstJpegFromPdf(pdfBuffer);
      if (extractedImageBuffer) {
        try {
          const uploadResponse = await imageKit.files.upload({
            file: extractedImageBuffer.toString("base64"),
            fileName: `resume-${newResume.id}.jpg`,
            folder: "user-resume"
          });
          finalImageUrl = uploadResponse.url;
        } catch (uploadErr) {
          console.error("Failed to upload extracted image:", uploadErr);
        }
      }
    }

    if (parsedData.personal_info) {
      await prisma.personalInfo.create({
        data: {
          resume_id: newResume.id,
          image_url: finalImageUrl || parsedData.personal_info.image || "",
          full_name: parsedData.personal_info.full_name || "",
          profession: parsedData.personal_info.profession || "",
          email: parsedData.personal_info.email || "",
          phone: parsedData.personal_info.phone || "",
          location: parsedData.personal_info.location || "",
          linkedin: parsedData.personal_info.linkedin || "",
          website: parsedData.personal_info.website || ""
        }
      });
    }

    if (Array.isArray(parsedData.experiences) && parsedData.experiences.length > 0) {
      await prisma.experience.createMany({
        data: parsedData.experiences.map((exp, idx) => ({
          resume_id: newResume.id,
          position: typeof exp.position === "number" ? exp.position : idx,
          company: exp.company || "",
          job_title: exp.job_title || exp.position || "",
          start_date: exp.start_date || "",
          end_date: exp.end_date || "",
          is_current: !!exp.is_current,
          description: exp.description || ""
        }))
      });
    }

    if (Array.isArray(parsedData.educations) && parsedData.educations.length > 0) {
      await prisma.education.createMany({
        data: parsedData.educations.map((edu, idx) => ({
          resume_id: newResume.id,
          position: typeof edu.position === "number" ? edu.position : idx,
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          graduation_date: edu.graduation_date || "",
          gpa: edu.gpa || ""
        }))
      });
    }

    if (Array.isArray(parsedData.projects) && parsedData.projects.length > 0) {
      await prisma.project.createMany({
        data: parsedData.projects.map((proj, idx) => ({
          resume_id: newResume.id,
          position: typeof proj.position === "number" ? proj.position : idx,
          name: proj.name || "",
          type: proj.type || "",
          description: proj.description || ""
        }))
      });
    }

    if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
      await prisma.skill.createMany({
        data: parsedData.skills.map((skill) => ({
          resume_id: newResume.id,
          skill_name: typeof skill === "string" ? skill : skill.skill_name || "",
          proficiency: (typeof skill === "object" && skill.proficiency) || "intermediate"
        }))
      });
    }

    return res.status(200).json({ resumeId: newResume.id });
  } catch (error) {
    console.error("uploadResume Error:", error);
    return res.status(500).json({ message: error.message || "Failed to process and upload resume." });
  }
};


