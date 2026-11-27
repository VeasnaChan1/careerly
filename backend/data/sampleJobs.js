// Mock/fallback job opportunities covering external apply URLs, direct emails,
// both channels, and missing contact info so all states can be tested cleanly.
export const sampleJobs = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    title: 'Frontend Developer (React)',
    company: 'Canadia Tech',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$600 - $900',
    description:
      'Canadia Tech is looking for a Frontend Developer to build fast, accessible web interfaces with React and Tailwind CSS. You will collaborate closely with product designers and backend engineers on customer-facing banking and fintech tools.',
    requirements:
      '- 1+ year of experience with React and modern JavaScript (ES6+)\n- Strong understanding of responsive CSS and Tailwind CSS\n- Experience consuming REST APIs and handling loading/error states\n- Good English communication and teamwork skills',
    contact_email: 'hr@canadiatech.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-20T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    title: 'Backend Developer (Node.js)',
    company: 'Wing Digital',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$700 - $1,100',
    description:
      'Join Wing Digital as a Backend Developer to design scalable APIs and microservices using Node.js, Express, and PostgreSQL. You will help power digital payment workflows used by thousands of users every day.',
    requirements:
      '- Solid experience with Node.js and Express\n- Hands-on experience with PostgreSQL and Prisma or SQL\n- Familiarity with JWT authentication and REST API design\n- Strong debugging and problem-solving mindset',
    contact_email: null,
    job_url: 'https://example.com/jobs/wing-backend',
    status: 'open',
    created_at: '2026-11-19T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    title: 'UI/UX Designer',
    company: 'Smart Axiata',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$500 - $800',
    description:
      'Smart Axiata is hiring a UI/UX Designer to craft intuitive mobile and web experiences. You will conduct user interviews, build Figma prototypes, and partner with engineering teams to ship polished products.',
    requirements:
      '- Portfolio demonstrating user-centered web or mobile UI/UX design\n- Proficiency in Figma and component design systems\n- Understanding of accessibility and responsive layouts\n- Ability to iterate quickly from user feedback',
    contact_email: 'careers@smartdemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-18T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    title: 'Junior React Developer',
    company: 'Sala Studio',
    location: 'Siem Reap',
    job_type: 'internship',
    salary_range: '$150 - $250',
    description:
      'Sala Studio offers a hands-on Junior React Developer internship for students and fresh graduates eager to learn real-world web development in an encouraging mentorship environment.',
    requirements:
      '- Basic knowledge of HTML, CSS, JavaScript, and React\n- Git and GitHub fundamentals\n- Enthusiasm to learn and accept code reviews\n- Based in Siem Reap or open to hybrid collaboration',
    contact_email: 'intern@salastudio.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-17T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111105',
    title: 'Data Analyst',
    company: 'ABA Analytics',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$650 - $1,000',
    description:
      'ABA Analytics is seeking a Data Analyst to transform business and product metrics into clear dashboards and actionable insights for leadership.',
    requirements:
      '- Strong SQL querying skills and spreadsheet modeling\n- Experience with BI tools such as Power BI, Tableau, or Looker Studio\n- Basic Python or R for data cleaning is a plus\n- Attention to detail and clear written reporting',
    contact_email: null,
    job_url: 'https://example.com/jobs/aba-data',
    status: 'open',
    created_at: '2026-11-16T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111106',
    title: 'QA Engineer',
    company: 'Pi Pay Labs',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$500 - $850',
    description:
      'Pi Pay Labs is looking for a QA Engineer to write test plans, execute regression suites, and automate end-to-end flows across web and mobile releases.',
    requirements:
      '- Experience with manual testing and bug reporting (Jira)\n- Familiarity with API testing (Postman) and Playwright/Cypress\n- Understanding of SDLC and agile sprint workflows',
    contact_email: 'qa@pipaydemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-15T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111107',
    title: 'Digital Marketing Executive',
    company: 'Angkor Media',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$400 - $700',
    description:
      'Angkor Media is hiring a Digital Marketing Executive to plan and optimize social campaigns, SEO content, and paid acquisition funnels for local brands.',
    requirements:
      '- Experience managing Facebook, TikTok, and Google Ads campaigns\n- Strong copywriting skills in Khmer and English\n- Comfort analyzing campaign ROI and conversion metrics',
    contact_email: 'jobs@angkormedia.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-14T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111108',
    title: 'Project Manager',
    company: 'Mekong Software',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$1,000 - $1,600',
    description:
      'Mekong Software needs an experienced Project Manager to coordinate delivery timelines, facilitate agile ceremonies, and communicate clearly with international clients.',
    requirements:
      '- 2+ years managing software delivery teams\n- Strong familiarity with Scrum/Kanban and Jira\n- Excellent stakeholder communication and risk management',
    contact_email: null,
    job_url: 'https://example.com/jobs/mekong-pm',
    status: 'open',
    created_at: '2026-11-13T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111109',
    title: 'Mobile Developer (Flutter)',
    company: 'Khmer Apps',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$700 - $1,200',
    description:
      'Khmer Apps is building next-generation consumer mobile applications in Flutter. You will own feature modules from UI implementation to Play Store / App Store release.',
    requirements:
      '- Experience building and shipping Flutter/Dart apps\n- Familiarity with state management (Bloc, Riverpod, or Provider)\n- Experience integrating REST APIs and push notifications',
    contact_email: 'hr@khmerapps.com',
    job_url: 'https://example.com/jobs/khmer-flutter',
    status: 'open',
    created_at: '2026-11-12T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111110',
    title: 'Customer Support Officer',
    company: 'Tonle Cloud',
    location: 'Battambang',
    job_type: 'part-time',
    salary_range: '$250 - $400',
    description:
      'Tonle Cloud is seeking a friendly Customer Support Officer to assist users via chat and email, troubleshoot common account questions, and document feedback.',
    requirements:
      '- Clear, empathetic written and spoken communication\n- Comfortable using helpdesk and CRM tools\n- Reliable internet connection and customer-first attitude',
    contact_email: 'support@tonledemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-11T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'DevOps Engineer',
    company: 'Bayon Systems',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$1,000 - $1,800',
    description:
      'Bayon Systems is hiring a DevOps Engineer to manage CI/CD pipelines, containerized workloads, and monitoring across cloud environments.',
    requirements:
      '- Experience with Docker, Linux administration, and GitHub Actions\n- Familiarity with AWS or GCP infrastructure\n- Knowledge of observability tools and security best practices',
    contact_email: null,
    job_url: 'https://example.com/jobs/bayon-devops',
    status: 'open',
    created_at: '2026-11-10T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111112',
    title: 'Graphic Designer',
    company: 'Lotus Creative',
    location: 'Phnom Penh',
    job_type: 'contract',
    salary_range: '$300 - $600',
    description:
      'Lotus Creative is looking for a contract Graphic Designer to produce brand visuals, social media graphics, and print collateral for client campaigns.',
    requirements:
      '- Proficiency in Adobe Illustrator and Photoshop (or Figma)\n- Strong sense of typography, color, and layout\n- Portfolio of commercial or personal design work',
    contact_email: 'design@lotusdemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-09T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111113',
    title: 'Content Writer',
    company: 'Kampot Media',
    location: 'Kampot',
    job_type: 'part-time',
    salary_range: '$200 - $350',
    description:
      'Kampot Media is looking for a creative Content Writer to research and write engaging blog posts, newsletters, and career guides.',
    requirements:
      '- Strong writing and editing skills in English or Khmer\n- Ability to meet weekly publishing deadlines\n- Basic SEO writing familiarity is a bonus',
    contact_email: 'write@kampotdemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-08T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111114',
    title: 'Business Analyst',
    company: 'Rithy Group',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$800 - $1,300',
    description:
      'Rithy Group is seeking a Business Analyst to gather requirements from stakeholders, map workflows, and write clear specifications for engineering teams.',
    requirements:
      '- Experience writing user stories, acceptance criteria, and process diagrams\n- Analytical mindset with strong facilitation skills\n- Previous work in banking, logistics, or SaaS preferred',
    contact_email: null,
    job_url: 'https://example.com/jobs/rithy-ba',
    status: 'open',
    created_at: '2026-11-07T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111115',
    title: 'Full Stack Developer',
    company: 'Techo Labs',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$900 - $1,500',
    description:
      'Techo Labs is hiring a Full Stack Developer to build end-to-end product features using React, Node.js, and PostgreSQL in a fast-paced startup team.',
    requirements:
      '- 2+ years building full-stack web applications\n- Experience with React, Node.js, and relational databases\n- Ownership mindset from architecture to deployment',
    contact_email: 'dev@techodemo.com',
    job_url: 'https://example.com/jobs/techo-fullstack',
    status: 'open',
    created_at: '2026-11-06T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111116',
    title: 'HR Assistant',
    company: 'Sokha Corp',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$350 - $550',
    description:
      'Sokha Corp is looking for an organized HR Assistant to support candidate screening, interview scheduling, and onboarding documentation.',
    requirements:
      '- Bachelor degree in HR, Business Administration, or related field\n- Strong organizational and interpersonal skills\n- Familiarity with Google Workspace or MS Office',
    contact_email: 'hr@sokhademo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-05T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111117',
    title: 'IT Support Technician',
    company: 'Delta Networks',
    location: 'Siem Reap',
    job_type: 'full-time',
    salary_range: '$300 - $500',
    description:
      'Delta Networks is hiring an IT Support Technician to maintain office hardware, troubleshoot network issues, and assist staff with software setup.',
    requirements:
      '- Practical knowledge of Windows, macOS, and basic TCP/IP networking\n- Patience and clear troubleshooting habits\n- Relevant IT diploma or certifications',
    contact_email: null,
    job_url: 'https://example.com/jobs/delta-it',
    status: 'open',
    created_at: '2026-11-04T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111118',
    title: 'Social Media Manager',
    company: 'Pursat Brands',
    location: 'Phnom Penh',
    job_type: 'contract',
    salary_range: '$450 - $750',
    description:
      'Pursat Brands is seeking a Social Media Manager to plan monthly content calendars, coordinate short-form video shoots, and grow community engagement.',
    requirements:
      '- Proven experience growing brand accounts on TikTok, Instagram, and Facebook\n- Strong visual taste and trend awareness\n- Ability to track engagement metrics and iterate',
    contact_email: 'social@pursatdemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-03T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111119',
    title: 'Accountant',
    company: 'Mony Trading',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$500 - $800',
    description:
      'Mony Trading is looking for an Accountant to manage daily bookkeeping, monthly financial statements, and tax filings in compliance with local regulations.',
    requirements:
      '- Bachelor degree in Accounting or Finance\n- Experience with QuickBooks or Xero and Excel\n- High accuracy and integrity',
    contact_email: 'finance@monydemo.com',
    job_url: null,
    status: 'open',
    created_at: '2026-11-02T08:00:00.000Z'
  },
  {
    id: '11111111-1111-4111-8111-111111111120',
    title: 'Manager Assistant',
    company: 'Wangli Group',
    location: 'Phnom Penh',
    job_type: 'full-time',
    salary_range: '$400 - $600',
    description:
      'Wangli Group is looking for a proactive Manager Assistant to help coordinate executive schedules, meeting notes, and internal operations.',
    requirements:
      '- Strong communication and time-management skills\n- Proficiency in Word, Excel, and presentation tools\n- Discretion and attention to detail',
    contact_email: null,
    job_url: null,
    status: 'open',
    created_at: '2026-11-01T08:00:00.000Z'
  }
];
