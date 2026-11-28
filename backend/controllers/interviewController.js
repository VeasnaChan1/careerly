import prisma from "../db/prisma.js";
import {
  interviewQuestions,
  interviewGuide,
  interviewCategories
} from "../data/interviewContent.js";

// GET /api/interview/questions
export const getInterviewQuestions = async (req, res) => {
  try {
    const { category, difficulty, search, job_role } = req.query;

    let dbQuestions = [];
    try {
      const whereClause = {
        is_practice: true
      };

      if (category && category !== "all") {
        whereClause.category = {
          equals: category,
          mode: "insensitive"
        };
      }

      if (difficulty && difficulty !== "all") {
        whereClause.difficulty = {
          equals: difficulty,
          mode: "insensitive"
        };
      }

      if (search && search.trim()) {
        const queryTerm = search.trim();
        whereClause.OR = [
          { question: { contains: queryTerm, mode: "insensitive" } },
          { suggested_answer: { contains: queryTerm, mode: "insensitive" } },
          { job_role: { contains: queryTerm, mode: "insensitive" } },
          { tips: { contains: queryTerm, mode: "insensitive" } }
        ];
      }

      dbQuestions = await prisma.interviewQuestion.findMany({
        where: whereClause,
        orderBy: [{ difficulty: "asc" }, { created_at: "asc" }]
      });
    } catch (dbErr) {
      console.warn("DB query for interview questions fallback to static data:", dbErr.message);
    }

    // If database returned results, use them; otherwise fallback to static curated list
    let questions = dbQuestions && dbQuestions.length > 0 ? dbQuestions : interviewQuestions;

    // Apply filtering if using fallback static list
    if (questions === interviewQuestions) {
      if (category && category !== "all") {
        questions = questions.filter(
          (q) => q.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (difficulty && difficulty !== "all") {
        questions = questions.filter(
          (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
      }
      if (search && search.trim()) {
        const qLower = search.trim().toLowerCase();
        questions = questions.filter(
          (q) =>
            q.question.toLowerCase().includes(qLower) ||
            (q.suggested_answer && q.suggested_answer.toLowerCase().includes(qLower)) ||
            (q.job_role && q.job_role.toLowerCase().includes(qLower)) ||
            (q.tips && q.tips.toLowerCase().includes(qLower))
        );
      }
    }

    // Compute category counts
    const countsByCategory = {};
    interviewCategories.forEach((cat) => {
      countsByCategory[cat.id] = 0;
    });

    const allQuestions = dbQuestions.length > 0 ? dbQuestions : interviewQuestions;
    allQuestions.forEach((q) => {
      const cat = (q.category || "general").toLowerCase();
      countsByCategory[cat] = (countsByCategory[cat] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      total: questions.length,
      countsByCategory,
      questions
    });
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while retrieving interview questions."
    });
  }
};

// GET /api/interview/questions/:id
export const getInterviewQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    let question = null;
    try {
      question = await prisma.interviewQuestion.findUnique({
        where: { id }
      });
    } catch (dbErr) {
      console.warn("DB lookup error, checking static data:", dbErr.message);
    }

    if (!question) {
      question = interviewQuestions.find((q) => q.id === id);
    }

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Interview question not found"
      });
    }

    return res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    console.error("Error fetching question details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the question."
    });
  }
};

// GET /api/interview/categories
export const getInterviewCategories = async (req, res) => {
  try {
    let allQuestions = [];
    try {
      allQuestions = await prisma.interviewQuestion.findMany({
        where: { is_practice: true },
        select: { category: true, difficulty: true }
      });
    } catch (e) {
      allQuestions = interviewQuestions;
    }

    if (!allQuestions.length) allQuestions = interviewQuestions;

    const counts = {};
    allQuestions.forEach((q) => {
      const cat = (q.category || "general").toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const categoriesWithCount = interviewCategories.map((cat) => ({
      ...cat,
      count: counts[cat.id] || 0
    }));

    return res.status(200).json({
      success: true,
      totalQuestions: allQuestions.length,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories."
    });
  }
};

// GET /api/interview/guide
export const getInterviewGuide = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      guide: interviewGuide
    });
  } catch (error) {
    console.error("Error fetching interview guide:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the interview guide."
    });
  }
};
