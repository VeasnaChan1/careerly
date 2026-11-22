import prisma from "../db/prisma.js";
import { interviewQuestions } from "../data/interviewContent.js";

export async function seedInterviewQuestions() {
  console.log("🌱 Seeding Interview Practice Questions...");

  try {
    // 1. Fetch all existing practice questions in a single query
    const existingList = await prisma.interviewQuestion.findMany({
      where: { is_practice: true },
      select: { id: true, question: true }
    });

    const existingMap = new Map();
    existingList.forEach((item) => {
      existingMap.set(item.question.trim().toLowerCase(), item.id);
    });

    const toCreate = [];
    for (const q of interviewQuestions) {
      const qKey = q.question.trim().toLowerCase();
      if (!existingMap.has(qKey)) {
        toCreate.push({
          category: q.category,
          difficulty: q.difficulty,
          job_role: q.job_role,
          question: q.question,
          suggested_answer: q.suggested_answer,
          why_asked: q.why_asked,
          tips: q.tips,
          is_practice: true
        });
      }
    }

    if (toCreate.length > 0) {
      await prisma.interviewQuestion.createMany({
        data: toCreate,
        skipDuplicates: true
      });
    }

    console.log(
      `✅ Interview Questions Ready: ${toCreate.length} new created, ${existingList.length} already exist (Total: ${interviewQuestions.length})`
    );
    return { success: true, created: toCreate.length, existing: existingList.length };
  } catch (error) {
    console.error("❌ Error seeding interview questions:", error.message);
    return { success: false, error: error.message };
  }
}
