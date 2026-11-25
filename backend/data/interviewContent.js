// ============================================================
// CAREERLY Interview Preparation & Practice Content
// High-yield interview questions, STAR method guides, and tips
// tailored for Cambodian university students, fresh grads & career switchers.
// ============================================================

export const interviewCategories = [
  {
    id: "behavioral",
    name: "Behavioral & STAR",
    tagline: "Past behavior predicts future performance",
    description: "Real-world situations where you demonstrated teamwork, problem-solving, leadership, and resilience.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    id: "technical",
    name: "Technical & Problem Solving",
    tagline: "Concepts, debugging & engineering thinking",
    description: "Core technical fundamentals, code quality, debugging strategies, APIs, and modern development workflows.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "general",
    name: "Background & Cultural Fit",
    tagline: "Motivation, strengths & values",
    description: "Foundational questions about your background, career vision, workplace habits, and team alignment.",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    id: "career-growth",
    name: "Fresh Grad & Career Switcher",
    tagline: "Translating potential into impact",
    description: "Overcoming lack of formal experience, explaining career pivots, coursework projects, and rapid self-learning.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    id: "questions-to-ask",
    name: "Questions to Ask Interviewers",
    tagline: "Interview the hiring team back",
    description: "Strategic questions to evaluate team culture, engineering mentorship, 90-day expectations, and growth opportunities.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200"
  }
];

export const interviewGuide = {
  title: "Careerly Master Interview Guide",
  subtitle: "Everything you need to turn interview anxiety into confident, compelling English answers.",
  instructions: [
    {
      step: 1,
      title: "Research the Company & Role",
      description: "Spend 20 minutes studying the company's product, recent news in Cambodia or regionally, and the exact tools listed on the job description. Mention at least one specific feature or initiative in your answers."
    },
    {
      step: 2,
      title: "Structure Every Story with STAR",
      description: "Do not tell rambling stories. Structure every behavioral answer into Situation (10%), Task (10%), Action (60%), and Result (20%). Interviewers score highest when you emphasize the specific actions you personally took."
    },
    {
      step: 3,
      title: "Rehearse Out Loud in English",
      description: "Reading answers silently in your head feels easy; speaking them out loud uses different muscle memory. Practice speaking your answers aloud at a moderate pace (120–140 words per minute)."
    },
    {
      step: 4,
      title: "Prepare 2-3 Reverse Questions",
      description: "Never say 'No, I don't have any questions' at the end. Asking thoughtful questions proves curiosity and professional engagement."
    }
  ],
  starMethod: {
    title: "The STAR Framework",
    overview: "The industry standard formula used by top tech companies, banks, and multinational agencies to evaluate candidate answers.",
    components: [
      {
        letter: "S",
        phase: "Situation",
        targetPercent: "15%",
        explanation: "Set the context briefly. Where were you working or studying, who was involved, and what was the initial setup?",
        example: "During our final semester capstone project at university, our 4-person team had 8 weeks to build an e-commerce web platform."
      },
      {
        letter: "T",
        phase: "Task",
        targetPercent: "15%",
        explanation: "Define the specific challenge, deadline, or deliverable that you were personally responsible for solving.",
        example: "Two weeks before the demo deadline, our team lost a teammate, leaving the payment gateway and authentication modules unbuilt."
      },
      {
        letter: "A",
        phase: "Action",
        targetPercent: "50%",
        explanation: "The core of your answer. Walk through the exact steps YOU executed: research, code written, teamwork, communication, or tools chosen.",
        example: "I volunteered to take on the auth module. I researched JWT best practices, documented the API endpoints in Postman, and set up daily 15-minute syncs with my remaining partner to unblock dependencies."
      },
      {
        letter: "R",
        phase: "Result",
        targetPercent: "20%",
        explanation: "Share the concrete outcome, metric, or lesson learned. Highlight what succeeded and how it impacted the team.",
        example: "We delivered the working demo 2 days ahead of schedule, secured an A grade from our professors, and the codebase had zero breaking bugs during live testing."
      }
    ]
  },
  englishTips: [
    {
      title: "Slow Down Your Pacing",
      tip: "When nervous, non-native English speakers often rush. Take a 2-second breath before answering. Speaking at a steady, intentional pace sounds much more senior and articulate."
    },
    {
      title: "Use Clean Transition Signposts",
      tip: "Guide the interviewer's ears with phrases like: 'First, I analyzed the problem...', 'Next, my team decided to...', and 'Ultimately, the result was...'"
    },
    {
      title: "Embrace 'I' Instead of Only 'We'",
      tip: "Cambodian culture values modesty and team solidarity ('We did this'). While team credit is good, interviewers are hiring YOU. Make sure you highlight: 'My specific contribution was...'"
    },
    {
      title: "Clarify When Unsure",
      tip: "Never guess what the interviewer asked if you didn't catch an English word or accent. Politeness is appreciated: 'Could you please clarify what you mean by X?' or 'Just to confirm, are you asking about...?'"
    }
  ],
  checklists: {
    inPerson: [
      "Bring 2-3 clean printed copies of your English CV in a professional folder.",
      "Arrive at the office lobby 10–15 minutes early (never 30 minutes early, never 1 minute late).",
      "Offer a firm, respectful handshake or greeting with polite eye contact and a gentle smile.",
      "Wear business-casual or formal professional attire (clean collared shirt or blazer)."
    ],
    online: [
      "Test your microphone, camera, and headphones 30 minutes before on Zoom/Google Meet.",
      "Position your laptop camera at eye level (elevate with books if needed) so you look directly at the interviewer.",
      "Ensure bright lighting in front of your face (facing a window or desk lamp), never behind you.",
      "Keep a glass of water, your CV, and a blank notebook with pen nearby."
    ]
  }
};

export const interviewTips = {
  title: "Essential Interview Checklist & Confidence Tips",
  subtitle: "Short, confidence-building steps before, during, and after your interview to turn anxiety into composure.",
  stages: [
    {
      id: "before",
      name: "Before the Interview",
      subtitle: "Preparation & Mindset (1 week to morning of)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      confidenceBooster: "They reviewed your CV and chose to invite you. You already qualify — the interview is simply to meet the person behind the paper.",
      items: [
        {
          id: "before-research-company",
          title: "Research Company & Role Basics",
          description: "Learn their mission, main products, and recent milestones. Identifying 1-2 reasons why you want to work there transforms nervousness into authentic enthusiasm.",
          category: "preparation",
          timeframe: "2-3 days before",
          format: "both"
        },
        {
          id: "before-review-cv",
          title: "Know Your CV & Key Projects",
          description: "Re-read your CV line-by-line. Pick 2-3 projects you are proud of so you can explain your individual contributions with confidence.",
          category: "preparation",
          timeframe: "1-2 days before",
          format: "both"
        },
        {
          id: "before-prepare-star",
          title: "Rehearse 2-3 STAR Stories",
          description: "Structure real examples using Situation, Task, Action (60%), and Result. Having go-to stories for challenges, teamwork, and leadership prevents freezing.",
          category: "practice",
          timeframe: "2 days before",
          format: "both"
        },
        {
          id: "before-prepare-questions",
          title: "Prepare 2-3 Strategic Questions",
          description: "Draft questions about team expectations, engineering culture, or 90-day goals. Remember: interviews are a mutual conversation, not a one-way test.",
          category: "preparation",
          timeframe: "1 day before",
          format: "both"
        },
        {
          id: "before-attire-logistics",
          title: "Check Tech Setup & Travel Route",
          description: "In-person: iron clean professional attire and plan to arrive 10-15 minutes early. Online: test camera, microphone, stable Wi-Fi, and quiet lighting.",
          category: "logistics",
          timeframe: "Evening before",
          format: "both"
        },
        {
          id: "before-rest-mindset",
          title: "Rest & Grounding Breath",
          description: "Sleep 7-8 hours. On interview morning, hydrate, take 3 slow belly breaths, and remind yourself: they invited you because you belong in the room.",
          category: "mindset",
          timeframe: "Morning of",
          format: "both"
        }
      ]
    },
    {
      id: "during",
      name: "During the Interview",
      subtitle: "Presence, Delivery & Communication",
      badgeColor: "bg-[#FFF3EB] text-[#F46200] border-[#FAD7C0]",
      confidenceBooster: "Silence is thinking, not stumbling. A calm 2-second breath before answering projects maturity and keeps your English steady.",
      items: [
        {
          id: "during-first-impression",
          title: "Warm Greeting & Confident Posture",
          description: "Smile warmly, greet the interviewers by name, and sit upright with relaxed shoulders. On video calls, look into the camera lens to project natural eye contact.",
          category: "presence",
          timeframe: "First 60s",
          format: "both"
        },
        {
          id: "during-pacing-breath",
          title: "Pause 2 Seconds Before Answering",
          description: "Take a calm 2-second breath before answering each question. Pausing shows senior composure and gives you space to organize your thoughts in English.",
          category: "communication",
          timeframe: "Throughout",
          format: "both"
        },
        {
          id: "during-star-structure",
          title: "Anchor Answers with STAR Method",
          description: "Keep background brief (~25%). Focus 60% of your response on the specific actions YOU executed, and conclude with the tangible result.",
          category: "structure",
          timeframe: "Behavioral",
          format: "both"
        },
        {
          id: "during-clarify-honesty",
          title: "Ask for Clarification Without Fear",
          description: "If an English term or question is unclear, ask politely: 'Could you please clarify what you mean by X?' Asking shows active listening and maturity.",
          category: "communication",
          timeframe: "When needed",
          format: "both"
        },
        {
          id: "during-honest-problem-solving",
          title: "Handle Unknowns with Curiosity",
          description: "If you don't know an answer, don't guess blindly. Say: 'I haven't used that tool directly yet, but here is how I would approach investigating and solving it.'",
          category: "mindset",
          timeframe: "Technical",
          format: "both"
        },
        {
          id: "during-ask-questions",
          title: "Ask Your Prepared Questions",
          description: "When invited at the end, ask your prepared questions. Asking thoughtful questions demonstrates ambition, engagement, and genuine interest in the team.",
          category: "engagement",
          timeframe: "Final 10m",
          format: "both"
        }
      ]
    },
    {
      id: "after",
      name: "After the Interview",
      subtitle: "Follow-Up, Reflection & Momentum",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      confidenceBooster: "Every interview makes you stronger. Celebrate your courage for stepping up, and let the process unfold while keeping your search momentum.",
      items: [
        {
          id: "after-closing-thanks",
          title: "Warm Closing & Clarify Next Steps",
          description: "Warmly thank the interviewers for their time, express enthusiasm for the role, and ask: 'What are the expected next steps in your hiring process?'",
          category: "closing",
          timeframe: "Wrap-up",
          format: "both"
        },
        {
          id: "after-write-notes",
          title: "5-Minute Immediate Reflection Notes",
          description: "While details are fresh, jot down the questions asked, what went well, and areas to polish. Every interview makes you a sharper, stronger candidate.",
          category: "reflection",
          timeframe: "Within 30m",
          format: "both"
        },
        {
          id: "after-thank-you-email",
          title: "Send a 24-Hour Thank-You Email",
          description: "Send a concise 3-4 sentence thank-you note referencing one specific discussion topic from the call. Use our built-in copyable email template.",
          category: "followup",
          timeframe: "Within 24h",
          format: "both"
        },
        {
          id: "after-celebrate-effort",
          title: "Celebrate Your Effort & Courage",
          description: "Take a moment to acknowledge your hard work. Interviewing in a professional setting takes courage—be proud of showing up and presenting your story.",
          category: "mindset",
          timeframe: "Same day",
          format: "both"
        },
        {
          id: "after-keep-momentum",
          title: "Maintain Search Momentum",
          description: "Never pause your job search for a single employer until an official offer letter is signed. Keep applying, networking, and practicing.",
          category: "mindset",
          timeframe: "Ongoing",
          format: "both"
        }
      ]
    }
  ],
  thankYouTemplate: {
    subject: "Thank you - [Your Name] - [Position Title] Interview",
    body: "Dear [Interviewer Name],\n\nThank you very much for your time today to discuss the [Position Title] role at [Company Name]. I really enjoyed learning more about [specific topic or challenge discussed, e.g. the team's upcoming dashboard redesign].\n\nOur conversation reinforced my enthusiasm for the position, and I am confident that my experience with [1-2 key skills, e.g. React and API integration] will allow me to contribute positively to the team.\n\nPlease let me know if you need any additional samples or information. I look forward to hearing about the next steps.\n\nWarm regards,\n[Your Name]\n[Your Phone Number] | [Your LinkedIn]"
  }
};

export const interviewQuestions = [
  // ----------------------------------------------------
  // 1. BEHAVIORAL & STAR (6 questions)
  // ----------------------------------------------------
  {
    id: "q-behav-1",
    category: "behavioral",
    difficulty: "Medium",
    job_role: "General / Software Engineer",
    question: "Tell me about a time you faced a difficult challenge or roadblock on a project. How did you resolve it?",
    why_asked: "Interviewers want to see how you respond under pressure, whether you troubleshoot independently before asking for help, and if you take ownership of outcomes.",
    suggested_answer: "<p><strong>Situation:</strong> While developing our university graduation project, our team integrated a third-party SMS verification API that suddenly experienced 40% delivery failure rates during user testing.</p><p><strong>Task:</strong> As the frontend and integration lead, I needed to identify the failure point and prevent users from getting permanently stuck on registration.</p><p><strong>Action:</strong> I first inspected our server logs and simulated requests with Postman to confirm the vendor's gateway was timing out. Seeing the vendor was unstable, I implemented an exponential backoff retry mechanism and designed a fallback verification route using email OTP so user onboarding was never blocked. I also communicated the status daily to my team lead.</p><p><strong>Result:</strong> Registration completion rate immediately jumped back to 98%, and we launched our beta without a single user lockout complaint.</p>",
    tips: "Structure: Situation -> Task -> Action -> Result. Avoid saying 'everything went smoothly'; real challenges show authentic growth."
  },
  {
    id: "q-behav-2",
    category: "behavioral",
    difficulty: "Medium",
    job_role: "General / Team Roles",
    question: "Describe a situation where you had a disagreement or conflict with a teammate or peer. How did you handle it?",
    why_asked: "Evaluates emotional intelligence, constructive communication, and whether you put project goals ahead of personal ego.",
    suggested_answer: "<p><strong>Situation:</strong> On an agile software project, a fellow developer and I strongly disagreed on state management. He advocated for Redux Toolkit, while I argued for React Context to avoid boilerplate for our lightweight app.</p><p><strong>Task:</strong> We needed to reach a consensus quickly so the rest of the sprint wouldn't stall.</p><p><strong>Action:</strong> Instead of debating emotionally in group chat, I scheduled a 20-minute 1-on-1 call. We mapped out our app's next 6-month roadmap. I realized that although Context was simpler today, our planned real-time notifications and payment modules would indeed benefit from Redux's predictable state flow. I acknowledged his point, agreed on Redux, and volunteered to draft the initial boilerplate slice.</p><p><strong>Result:</strong> We aligned in under 30 minutes, met our sprint milestone, and established a collaborative relationship where we regularly pair-programmed.</p>",
    tips: "Never blame your teammate. Focus on objective criteria (project requirements, data, user impact) and a respectful resolution."
  },
  {
    id: "q-behav-3",
    category: "behavioral",
    difficulty: "Hard",
    job_role: "General / Junior Talent",
    question: "Tell me about a time you made a mistake or failed to meet a goal. What happened, and what did you learn?",
    why_asked: "Tests accountability, honesty, and whether you learn from setbacks or make excuses.",
    suggested_answer: "<p><strong>Situation:</strong> During an internship sprint, I was tasked with deploying an update to our staging database schema. I forgot to test the migration script against a replica of production data first.</p><p><strong>Task:</strong> The migration failed midway, locking tables and temporarily blocking QA engineers from testing features.</p><p><strong>Action:</strong> I took immediate ownership rather than hiding it. I notified my senior engineer in our Slack channel, explained what went wrong, and ran our pre-written rollback script to restore normal staging state within 15 minutes. Afterwards, I created a written pre-migration checklist and automated a dry-run check in our CI/CD pipeline.</p><p><strong>Result:</strong> We never had an untracked migration error again, and my mentor commended my transparency and preventive fix.</p>",
    tips: "Pick a genuine mistake that you resolved quickly. Focus 80% of your time on the immediate corrective action and permanent systemic learning."
  },
  {
    id: "q-behav-4",
    category: "behavioral",
    difficulty: "Medium",
    job_role: "General / Junior & Mid",
    question: "How do you prioritize your work when faced with multiple competing deadlines?",
    why_asked: "Checks time management, organizational skills, and whether you proactively communicate capacity bottlenecks.",
    suggested_answer: "<p><strong>Situation:</strong> During mid-term exam week, I had two major deliverables due on the same Friday: building a client dashboard component for an internship and submitting a 20-page group capstone report.</p><p><strong>Task:</strong> Both carried high stakes, and I had only 3 available evenings.</p><p><strong>Action:</strong> I used the Eisenhower Matrix to categorize tasks by urgency and impact. I communicated early with my internship mentor on Tuesday morning, outlining my progress and confirming which dashboard sub-features were critical for Friday's sprint review versus which could roll into Monday. At university, I delegated the formatting and bibliography to teammates while I finalized the core engineering analysis.</p><p><strong>Result:</strong> I delivered the mission-critical dashboard slice on time with zero bugs, scored an A- on the report, and avoided last-minute burnout through early communication.</p>",
    tips: "Mention specific prioritization tools (e.g. Eisenhower Matrix, Kanban, Trello, calendar time-blocking) and proactive communication."
  },
  {
    id: "q-behav-5",
    category: "behavioral",
    difficulty: "Medium",
    job_role: "General / Tech & Business",
    question: "Describe a time you had to adapt quickly to a sudden change in project scope or requirements.",
    why_asked: "Assesses agility, open-mindedness, and emotional composure in dynamic startup or corporate environments.",
    suggested_answer: "<p><strong>Situation:</strong> Two weeks into a month-long web portal project, our client decided they needed bilingual Khmer and English language support, which was not in the original sprint scope.</p><p><strong>Task:</strong> We had to integrate localization across 12 pages without pushing back our client delivery date.</p><p><strong>Action:</strong> Rather than pushing back stubbornly, I researched existing open-source libraries (i18next). I refactored our hardcoded text strings into clean JSON translation dictionaries, creating a simple spreadsheet where our non-technical client could review and verify Khmer translations in parallel while I coded the language toggle switcher.</p><p><strong>Result:</strong> We delivered the bilingual application on the original deadline date, and the client was so pleased that they retained our agency for phase two.</p>",
    tips: "Highlight flexible problem-solving and finding win-win solutions instead of complaining about scope changes."
  },
  {
    id: "q-behav-6",
    category: "behavioral",
    difficulty: "Easy",
    job_role: "General / All Roles",
    question: "Tell me about an accomplishment or project you are most proud of, and why.",
    why_asked: "Reveals what motivates you, what you consider high-quality work, and how you articulate passion for your craft.",
    suggested_answer: "<p><strong>Situation:</strong> I wanted to solve a real everyday problem in Cambodia: university students struggled to find reliable English resume templates that matched local hiring standards.</p><p><strong>Task:</strong> I set out to build a fully responsive web application from scratch that allowed users to type their info, preview live A4 print layouts, and download ATS-compliant PDFs.</p><p><strong>Action:</strong> Over 6 weeks of evening coding, I learned React 19, Tailwind CSS, and client-side PDF generation. I interviewed 8 fellow students to test the UI, iteratively simplified the form steps, and implemented real-time local storage so users never lost their typing progress if their browser refreshed.</p><p><strong>Result:</strong> The platform was used by over 60 peers in our university department to format their real CVs for internships, which showed me the true power of building software with user empathy.</p>",
    tips: "Connect your accomplishment to real human impact or user feedback, not just lines of code written."
  },

  // ----------------------------------------------------
  // 2. TECHNICAL & PROBLEM SOLVING (6 questions)
  // ----------------------------------------------------
  {
    id: "q-tech-1",
    category: "technical",
    difficulty: "Medium",
    job_role: "Frontend / Software Engineer",
    question: "How do you approach debugging an unfamiliar bug or error in production code?",
    why_asked: "Evaluates systematic analytical thinking, tool proficiency (DevTools, logs), and staying calm without guessing blindly.",
    suggested_answer: "<p>My debugging process follows a 4-step systematic approach:</p><ol><li><strong>Reproduce:</strong> I isolate the minimal steps required to consistently trigger the error locally or on staging.</li><li><strong>Inspect & Trace:</strong> I check browser DevTools (Console and Network tabs) and backend application logs to read the exact stack trace, error code, and payload.</li><li><strong>Hypothesize & Bisect:</strong> I form a testable hypothesis. If it's a regression, I use Git bisect or compare recent commits to see what changed in the codebase.</li><li><strong>Fix & Prevent:</strong> Once identified, I implement the fix and write a regression unit test so that this specific bug can never silently return in future sprints.</li></ol>",
    tips: "Emphasize that you don't just 'change code until it works'. Highlight logging, reproducible tests, and permanent prevention."
  },
  {
    id: "q-tech-2",
    category: "technical",
    difficulty: "Easy",
    job_role: "Software / Web Developer",
    question: "Explain what a RESTful API is and how HTTP methods work to a non-technical person.",
    why_asked: "Tests your ability to explain complex technical concepts in plain, accessible English—crucial for team communication.",
    suggested_answer: "<p>Think of a RESTful API like a waiter in a restaurant. You are the customer (the web browser), and the kitchen is the database containing all the food (information). You cannot walk straight into the kitchen, so you use the waiter (the API) to communicate your order.</p><p>HTTP methods are the standard requests you tell the waiter:</p><ul><li><strong>GET:</strong> 'Please bring me the menu' (reading or fetching data).</li><li><strong>POST:</strong> 'Here is my new order' (creating new data).</li><li><strong>PUT / PATCH:</strong> 'Please modify my existing order' (updating data).</li><li><strong>DELETE:</strong> 'Please cancel my order' (removing data).</li></ul><p>The waiter delivers your request to the kitchen and returns with a standard status code—like 200 OK when your meal arrives successfully.</p>",
    tips: "Use clear analogies (waiter/kitchen or postal service). Avoid jargon until after you've established the metaphor."
  },
  {
    id: "q-tech-3",
    category: "technical",
    difficulty: "Medium",
    job_role: "Frontend / Full-Stack",
    question: "What is the difference between synchronous and asynchronous code in JavaScript, and how do Promises/async-await help?",
    why_asked: "Checks foundational understanding of the JavaScript event loop, single-threaded concurrency, and network requests.",
    suggested_answer: "<p><strong>Synchronous code</strong> executes sequentially line-by-line; each statement must complete before the next one starts. If a line involves a heavy calculation, it blocks everything else on the thread, freezing the UI.</p><p><strong>Asynchronous code</strong> allows time-consuming tasks—like fetching data from a database or API—to run in the background while the browser continues rendering and responding to user clicks.</p><p>Initially, asynchronous JS relied on callbacks, which led to messy 'callback hell'. <strong>Promises</strong> introduced cleaner chaining with <code>.then()</code> and <code>.catch()</code>. Modern <strong>async/await</strong> is syntactic sugar on top of Promises that allows asynchronous code to read linearly like synchronous code with familiar <code>try/catch</code> error handling.</p>",
    tips: "Mention the event loop, non-blocking I/O, and give a real-world example like <code>fetch()</code> or reading a file."
  },
  {
    id: "q-tech-4",
    category: "technical",
    difficulty: "Medium",
    job_role: "Software Engineer",
    question: "How do you ensure the code you write is clean, maintainable, and well-tested before committing?",
    why_asked: "Checks software engineering hygiene, self-discipline, and respect for team collaboration.",
    suggested_answer: "<p>I follow five core practices before opening a pull request:</p><ol><li><strong>Self-Review & Diff Check:</strong> I review my own Git diff locally using <code>git diff</code> or VS Code to catch leftover console logs, commented-out dead code, and unintended formatting changes.</li><li><strong>Meaningful Naming:</strong> I ensure functions and variables describe intent clearly (e.g. <code>hasValidSession</code> rather than <code>flag1</code>).</li><li><strong>Single Responsibility:</strong> I break bloated components or functions into modular, reusable helpers.</li><li><strong>Linting & Formatting:</strong> I run ESLint and Prettier so code style matches team conventions automatically.</li><li><strong>Automated & Manual Verification:</strong> I run automated unit tests and test the feature manually against edge cases (e.g. slow network, empty states, and special characters).</li></ol>",
    tips: "Mentioning that you review your own PR before requesting senior peer review demonstrates strong maturity."
  },
  {
    id: "q-tech-5",
    category: "technical",
    difficulty: "Hard",
    job_role: "Frontend / Web Developer",
    question: "Walk me through how you optimize web application performance and initial page load speed.",
    why_asked: "Tests understanding of Core Web Vitals, asset bundling, responsive rendering, and browser mechanics.",
    suggested_answer: "<p>I optimize web performance across network, assets, and runtime:</p><ul><li><strong>Asset Optimization:</strong> Compressing images into modern formats like WebP or compressed JPEG, serving appropriate sizes, and lazy-loading off-screen images with <code>loading='lazy'</code>.</li><li><strong>Bundle Splitting:</strong> Using dynamic <code>import()</code> and code-splitting so users only download the JavaScript needed for their active route rather than a monolithic 2MB bundle.</li><li><strong>Caching & CDN:</strong> Setting optimal Cache-Control headers and serving static assets over a Content Delivery Network.</li><li><strong>Reducing Re-renders:</strong> In React, memoizing expensive computations with <code>useMemo</code>, debouncing rapid inputs, and avoiding unnecessary state lifting.</li><li><strong>Measurement:</strong> Using Chrome Lighthouse and Performance DevTools to track First Contentful Paint (FCP) and Largest Contentful Paint (LCP).</li></ul>",
    tips: "Always start with measurement (Lighthouse/DevTools). Optimizing blindly without profiling is a common red flag."
  },
  {
    id: "q-tech-6",
    category: "technical",
    difficulty: "Medium",
    job_role: "Full-Stack / Backend",
    question: "What are the core differences between SQL and NoSQL databases, and when would you choose one over the other?",
    why_asked: "Assesses data modeling maturity, ACID transactions, and structural architectural choices.",
    suggested_answer: "<p><strong>SQL databases</strong> (like PostgreSQL and MySQL) are relational, table-based, and enforce strict structured schemas. They excel at complex multi-table joins, relational integrity, and strict ACID transactions (e.g. banking, financial transactions, order processing).</p><p><strong>NoSQL databases</strong> (like MongoDB) are non-relational, document- or key-value-based, and have dynamic schemas. They excel at rapid prototyping, horizontal scaling across clusters, and handling unstructured or fast-changing data structures.</p><p>For a platform like Careerly with clear relational links (Users have many Resumes, Resumes have many Experiences and Skills), a relational SQL database like PostgreSQL is ideal because data integrity and cascading deletes prevent orphaned records.</p>",
    tips: "Ground your answer in real examples. Mention ACID vs. BASE, schema flexibility vs. relational integrity."
  },

  // ----------------------------------------------------
  // 3. BACKGROUND & CULTURAL FIT (5 questions)
  // ----------------------------------------------------
  {
    id: "q-gen-1",
    category: "general",
    difficulty: "Easy",
    job_role: "General / All Candidates",
    question: "Tell me about yourself and walk me through your background.",
    why_asked: "Usually the first question in every interview. Sets the tone, tests conciseness, and checks your personal career elevator pitch.",
    suggested_answer: "<p>'I am a Junior Frontend Developer and recent Computer Science graduate passionate about building clean, human-centered web applications. Over the past year, I have built responsive applications using React, JavaScript, and Tailwind CSS—including a live English CV platform that helped over 60 university peers format their resumes.</p><p>Through my coursework and project work, I have gained hands-on experience integrating RESTful APIs, writing clean modular code, and collaborating using Git in agile sprints. What excites me about your team is your focus on building modern digital products for the local market, and I am eager to contribute my frontend engineering skills while continuing to learn from your senior engineers.'</p>",
    tips: "Use the Present -> Past -> Future formula. Keep it under 90 seconds. Do not re-read your entire CV; summarize your highlights and bridge to why you want THIS job."
  },
  {
    id: "q-gen-2",
    category: "general",
    difficulty: "Easy",
    job_role: "General / All Candidates",
    question: "Why do you want to work at our company specifically?",
    why_asked: "Checks whether you researched the company or just applied to 50 jobs with the exact same generic template.",
    suggested_answer: "<p>'I have been following your company's growth in Cambodia, particularly how you modernized your digital banking mobile app last quarter to improve accessibility for young users.</p><p>'As a developer who values clean UI and performance, your engineering blog posts on microservices and continuous deployment resonated with me. I want to work in an environment where engineering excellence and user empathy are prioritized, and I know I can bring high energy, strong foundational React skills, and a fast-learning mindset to your frontend team.'</p>",
    tips: "Mention something specific: a product feature, recent news, the company mission, or their tech stack. Flattery without specifics sounds fake."
  },
  {
    id: "q-gen-3",
    category: "general",
    difficulty: "Medium",
    job_role: "General / All Candidates",
    question: "What is your greatest strength, and what is one real weakness you are actively working to improve?",
    why_asked: "Tests authentic self-awareness. Avoid humble-brags like 'I am too much of a perfectionist' or 'I work too hard'.",
    suggested_answer: "<p><strong>My greatest strength</strong> is my tenacity when troubleshooting complex problems. When encountering an unfamiliar bug or API failure, I methodically isolate the variables, read documentation thoroughly, and persist until I find the root cause rather than patching symptoms.</p><p><strong>An area I am actively improving</strong> is delegating and asking for help earlier. In university projects, I sometimes spent hours trying to solve an environment configuration issue on my own before asking a senior peer, which slowed me down. Recently, I adopted a 45-minute rule: if I cannot make measurable progress on an edge-case block after 45 minutes of thorough debugging and research, I prepare a concise summary of what I tried and reach out to a mentor. This has significantly accelerated my velocity.</p>",
    tips: "Formula for weakness: State a genuine technical/workflow weakness + explain the concrete system/habit you are using right now to overcome it."
  },
  {
    id: "q-gen-4",
    category: "general",
    difficulty: "Easy",
    job_role: "General / All Candidates",
    question: "Where do you see yourself professionally in the next 3 to 5 years?",
    why_asked: "Checks ambition, stability, realistic career planning, and whether the company aligns with your long-term roadmap.",
    suggested_answer: "<p>'In the next 3 to 5 years, my goal is to evolve into a proficient, senior full-stack engineer who not only writes robust code but also contributes to system architecture decisions and mentors incoming junior developers.</p><p>'In the first two years, I want to master your codebase, take end-to-end ownership of core feature modules, and deepen my understanding of backend scalability and automated testing. Long-term, I want to stay committed to a high-performing team where I can grow with the company as it expands regionally.'</p>",
    tips: "Show realistic progression: Master your current role first -> take on larger architectural responsibilities -> mentor others."
  },
  {
    id: "q-gen-5",
    category: "general",
    difficulty: "Easy",
    job_role: "General / Tech & Creative",
    question: "How do you stay updated with industry trends and new technologies outside of work?",
    why_asked: "Checks genuine intellectual curiosity and passion for learning in a fast-evolving industry.",
    suggested_answer: "<p>'I dedicate 30 to 45 minutes every morning to continuous learning. I follow engineering newsletters like TLDR and JavaScript Weekly, and I regularly read technical breakdown articles on Hacker News and Dev.to.</p><p>'Additionally, whenever a major framework update is released (like React 19 or Tailwind v4), I build a small weekend prototype to test the new features hands-on rather than just reading about them. I also participate in local tech meetups and developer community groups in Phnom Penh to exchange ideas with other engineers.'</p>",
    tips: "Name specific podcasts, newsletters, documentation, or local communities you actually follow."
  },

  // ----------------------------------------------------
  // 4. FRESH GRADUATE & CAREER SWITCHER (5 questions)
  // ----------------------------------------------------
  {
    id: "q-growth-1",
    category: "career-growth",
    difficulty: "Hard",
    job_role: "Fresh Graduate / Intern",
    question: "You have limited formal work experience on your CV. Why should we hire you over candidates with more years of experience?",
    why_asked: "A classic pressure question for junior talent. Tests confidence, humility, hunger, and proof of fast execution.",
    suggested_answer: "<p>'While I may have fewer years on paper, I bring three distinct advantages: fresh knowledge of modern tools, zero legacy habits to unlearn, and high hunger to deliver value.</p><p>'Because I learned web development recently, I was trained on modern best practices—clean React hooks, Tailwind utility workflows, and RESTful API architecture. Furthermore, my university and independent project work proved that I don't wait to be told what to do; I built a full-stack platform used by 60 real peers from scratch.</p><p>'You are getting someone who is energetic, humble, deeply coachable, and eager to master your specific tech stack rapidly.'</p>",
    tips: "Never apologize for being a fresh graduate! Reframe junior status as an asset: adaptable, eager, unburdened by bad legacy habits, and fast-learning."
  },
  {
    id: "q-growth-2",
    category: "career-growth",
    difficulty: "Medium",
    job_role: "Career Switcher / Transition",
    question: "Why are you switching careers into software development/tech, and how do your previous experiences transfer?",
    why_asked: "Validates that your pivot is intentional and thoughtful, not an impulsive whim, and checks for transferable soft skills.",
    suggested_answer: "<p>'In my previous role in customer operations and sales, I discovered that my favorite part of the job was finding inefficiencies and automating repetitive spreadsheets. I realized I wanted to build the digital tools that solve problems rather than just use them.</p><p>'Over the past 9 months, I completed intensive full-stack coursework, dedicating over 400 hours to building practical JavaScript and React applications.</p><p>'My non-traditional background is a strength: having worked directly with clients, I possess deep empathy for end-user frustrations, clear communication skills, and commercial awareness that purely technical candidates sometimes lack. I write code with the real user always in mind.'</p>",
    tips: "Highlight your bridge story: Problem observed in previous field -> sparked passion for tech -> dedicated self-study -> valuable transferable strengths."
  },
  {
    id: "q-growth-3",
    category: "career-growth",
    difficulty: "Medium",
    job_role: "Junior / Self-Taught",
    question: "Tell me about a project you built from scratch outside of classroom assignments or school requirements.",
    why_asked: "Differentiates passive students from self-driven builders who code out of intrinsic curiosity.",
    suggested_answer: "<p><strong>Situation:</strong> I noticed my study group struggled to track shared expenses and group coursework milestones in a single chat room.</p><p><strong>Task:</strong> As an unprompted personal challenge, I decided to build a lightweight collaborative web app with authentication and live progress tracking.</p><p><strong>Action:</strong> I set up a Node.js Express backend with PostgreSQL using Prisma ORM, and paired it with a Vite React frontend. I handled user password hashing with bcrypt, JWT authorization tokens, and responsive mobile-first Tailwind design so peers could access it on their phones.</p><p><strong>Result:</strong> Over 15 classmates used it during finals week. Experiencing the full development lifecycle—from schema design to deployment on Render—taught me more practical lessons than any textbook exam.</p>",
    tips: "Show that you pushed past theoretical tutorials into real deployments with live users."
  },
  {
    id: "q-growth-4",
    category: "career-growth",
    difficulty: "Medium",
    job_role: "All Junior Roles",
    question: "Tell me about the fastest you had to learn a completely new library, framework, or tool to finish a task.",
    why_asked: "In tech, tools change every 2 years. Interviewers care far more about your velocity of learning than your existing static knowledge.",
    suggested_answer: "<p><strong>Situation:</strong> During a 48-hour student hackathon, our project required interactive chart visualizations, but neither my partner nor I had ever used Chart.js or Recharts before.</p><p><strong>Task:</strong> We needed to render 4 interactive analytics graphs before the judging presentation in under 12 hours.</p><p><strong>Action:</strong> Instead of watching long 2-hour video tutorials, I jumped directly into the official documentation and GitHub example sandboxes. I built a tiny throwaway prototype in 45 minutes to test passing props to the chart components. Once I verified the data structure, I integrated it into our main dashboard and created mock JSON datasets to verify responsiveness.</p><p><strong>Result:</strong> We delivered full interactive charts with smooth hover tooltips during our pitch, and our team placed in the top 3 finalists for technical execution.</p>",
    tips: "Explain HOW you learn quickly: reading docs, building minimal throwaway prototypes, and avoiding tutorial paralysis."
  },
  {
    id: "q-growth-5",
    category: "career-growth",
    difficulty: "Easy",
    job_role: "Fresh Graduate",
    question: "What was the most challenging coursework or capstone project in your studies, and how did you approach it?",
    why_asked: "Evaluates stamina on long-horizon projects and how you handle academic ambiguity.",
    suggested_answer: "<p><strong>Situation:</strong> Our 4th-year Systems Analysis and Database Design capstone required analyzing a local retail pharmacy's inventory management and building a relational database system from scratch.</p><p><strong>Task:</strong> The pharmacy had no written technical documentation; all records were handwritten receipts and disorganized Excel files.</p><p><strong>Action:</strong> I scheduled in-person interviews with the head pharmacist to map out their exact business processes. I normalized the data into 3rd Normal Form (3NF) to eliminate duplication, wrote SQL stored procedures for low-stock alerts, and built a clean React web frontend for the staff.</p><p><strong>Result:</strong> The pharmacy owner praised the prototype, and our capstone received a 95% grade from the department faculty panel.</p>",
    tips: "Emphasize translating messy real-world user requirements into clean technical architecture."
  },

  // ----------------------------------------------------
  // 5. QUESTIONS TO ASK THE INTERVIEWER (4 strategic questions)
  // ----------------------------------------------------
  {
    id: "q-ask-1",
    category: "questions-to-ask",
    difficulty: "Easy",
    job_role: "General / Reverse Interview",
    question: "What does success look like in the first 90 days for someone joining this role?",
    why_asked: "Shows the hiring manager that you are results-oriented, proactive, and want to hit the ground running with clear measurable goals.",
    suggested_answer: "<p><em>'If I am fortunate enough to join your team, what concrete milestones or achievements would make you say after 90 days: 'We made the absolute right hire'?'</em></p><p><strong>Why this works:</strong> It prompts the interviewer to visualize you succeeding in the role and gives you the exact scorecard you need to prepare for during onboarding.</p>",
    tips: "Listen closely to their answer; note down their key expectations and reference them in your follow-up thank-you email."
  },
  {
    id: "q-ask-2",
    category: "questions-to-ask",
    difficulty: "Easy",
    job_role: "Software / Engineering",
    question: "How does the team approach code reviews, technical debt, and engineering mentorship for junior developers?",
    why_asked: "Helps you evaluate whether this company is a supportive environment for your personal engineering growth or an unguided silo.",
    suggested_answer: "<p><em>'Could you share how your engineering team structures code reviews and mentorship? For example, do junior engineers pair-program with seniors or have dedicated sprint feedback sessions?'</em></p><p><strong>Why this works:</strong> High-performing engineering teams love answering this question because it shows you care about code quality, constructive peer critique, and continuous learning.</p>",
    tips: "Notice if the interviewer is proud of their review culture or hesitant; an environment with zero code reviews is a warning sign for junior growth."
  },
  {
    id: "q-ask-3",
    category: "questions-to-ask",
    difficulty: "Medium",
    job_role: "General / Tech & Product",
    question: "What are the biggest challenges or priorities your department is currently tackling this quarter?",
    why_asked: "Demonstrates strategic business awareness and interest in company objectives beyond just daily task tickets.",
    suggested_answer: "<p><em>'What is the most critical challenge or technical hurdle your engineering team is actively solving over the next 3 to 6 months?'</em></p><p><strong>Why this works:</strong> It turns the interview into a collaborative dialogue between professional peers rather than an interrogation.</p>",
    tips: "If you have experience with their challenge (e.g. database migrations or performance), you can offer a brief supportive thought."
  },
  {
    id: "q-ask-4",
    category: "questions-to-ask",
    difficulty: "Easy",
    job_role: "General / Team Culture",
    question: "What do you personally enjoy most about working at this company?",
    why_asked: "A warm, human question that lets the interviewer share their personal experience, creating authentic rapport and connection.",
    suggested_answer: "<p><em>'You have been with the company for [X years/months]—what is something you personally value most about the culture and team dynamic here every day?'</em></p><p><strong>Why this works:</strong> People love talking about their positive experiences. It leaves the interviewer with warm, favorable emotional recall about your conversation.</p>",
    tips: "Use a warm, genuine tone and smile. Look the interviewer in the eye as they answer."
  }
];
