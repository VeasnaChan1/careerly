# SCRUM-102 — Interview Questions and Sample Answers Plan

Parent story: SCRUM-56 — Practice interview questions  
Prepared: 24 November 2026  
Status: Planning complete; content preparation has not started.

## Goal

Prepare a reviewed question bank for Careerly covering General, Behavioral,
Technical, and Questions to Ask Employers. Each question must have a useful
sample answer or guidance before it is handed over for implementation.

This commit delivers the plan only. It does not add the question bank, application
code, API endpoints, database changes, UI, or AI integration.

## Proposed deliverable

Start with **20 entries: five per category**. This is a proposed working target,
not a quantity stated in the Jira description. Keep the first release suitable
for students and early-career applicants. Label technical questions as software
development topics so their audience is clear.

| Category | Topics to cover | Answer approach |
| --- | --- | --- |
| General | Introduction, strengths, improvement areas, motivation, career goals | Short illustrative answers that applicants can adapt to their own experience. |
| Behavioral | Teamwork, conflict, problem solving, deadlines, learning from mistakes | Use STAR: Situation, Task, Action, Result; include realistic university or project examples. |
| Technical | HTTP/API basics, SQL joins, Git collaboration, debugging, authentication basics | Explain the concept accurately, give a small example, and identify the technical subject. |
| Questions to Ask Employers | First-month expectations, onboarding, teamwork, feedback, hiring next steps | Explain why to ask and what to listen for; the employer's response cannot be supplied in advance. |

## Content structure

Use the same fields for every entry so later integration is straightforward.

| Field | Purpose |
| --- | --- |
| `id` | Stable unique identifier, such as `general-001`. |
| `category` | One of `general`, `behavioral`, `technical`, `employer`. |
| `question` | Clear question wording. |
| `guidance` | What the question explores and how to approach it. |
| `sampleAnswer` | Illustrative applicant answer; use `null` for employer questions. |
| `tips` | Two or three practical reminders. |
| `difficulty` | Start with `beginner`. |
| `tags` | Relevant audience or topic, such as `early-career`, `sql`, or `git`. |

## Work steps — when content preparation starts

1. **Confirm the content scope.** Agree on the proposed count and software-focused
   technical topics with the story owner. Resolve changes before drafting.
2. **Draft the questions.** Write five distinct questions per category. Avoid
   questions that repeat the same skill or rely on confidential personal details.
3. **Write answers and guidance.** Keep each entry concise. Use STAR for behavioral
   examples and explanations plus examples for technical questions. For employer
   questions, supply purpose and listening guidance instead of a fictional reply.
4. **Review the content.** Check clarity, grammar, relevance, category assignment,
   and factual accuracy. Verify technical explanations against official
   documentation when drafting. Have a teammate review the full bank and resolve
   corrections. Example experiences must be clearly illustrative; encourage users
   to replace them with their own facts.
5. **Prepare the handoff.** Put the reviewed entries in the proposed
   `backend/data/interviewQuestions.js` module as static data. Match its export
   convention with the developer implementing the read endpoints. No database or
   runtime AI generation is needed for this curated content subtask.
6. **Validate and record evidence.** Check the count per category, unique IDs,
   allowed categories, required fields, and useful guidance for every entry.
   Record the reviewer and resolved feedback in the eventual content PR.

AI is optional for drafting during the future content work. A person must review
every entry before acceptance; browsing the final bank should not require AI.

## Completion checklist for SCRUM-102

- [ ] Content count and technical audience are agreed.
- [ ] All four categories contain the agreed number of distinct questions.
- [ ] Every applicant question has guidance and a reviewed sample answer.
- [ ] Every employer question explains its purpose and what to listen for.
- [ ] Behavioral examples follow STAR and suit early-career applicants.
- [ ] Technical explanations have been checked for accuracy.
- [ ] All entries follow the agreed structure and have unique, stable IDs.
- [ ] A teammate has reviewed the content and corrections are resolved.
- [ ] The reviewed bank is committed and ready for the UI/API subtasks.

## Git and Jira progress

Keep work on the current SCRUM-102 branch and use commits that describe the work
actually completed:

- Planning commit now: `docs(SCRUM-102): plan interview question content preparation`
- Future content commit: `docs(SCRUM-102): add reviewed interview question bank`
- Future review corrections, if needed: `docs(SCRUM-102): refine answers after content review`

Only the planning commit is intended now. A commit records progress; it does not
by itself meet this subtask's completion criteria. Keep SCRUM-102 in To Do or In
Progress according to the team's workflow until the content checklist is complete.

Suggested Jira progress note:

> Prepared the content plan for all four interview categories, including the
> proposed question count, entry structure, review steps, and completion criteria.
> Questions and sample answers are not yet prepared; no feature code was changed.
