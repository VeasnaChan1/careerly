import { randomUUID } from 'crypto';
import prisma from '../db/prisma.js';

// [title, company, location, job_type, salary_range, contact_email, job_url]
const rows = [
  ['Frontend Developer', 'Canadia Tech', 'Phnom Penh', 'full-time', '$600 - $900', 'hr@canadiatech.com', null],
  ['Backend Developer', 'Wing Digital', 'Phnom Penh', 'full-time', '$700 - $1,100', null, 'https://example.com/jobs/wing-backend'],
  ['UI/UX Designer', 'Smart Axiata', 'Phnom Penh', 'full-time', '$500 - $800', 'careers@smartdemo.com', null],
  ['Junior React Developer', 'Sala Studio', 'Siem Reap', 'internship', '$150 - $250', 'intern@salastudio.com', null],
  ['Data Analyst', 'ABA Analytics', 'Phnom Penh', 'full-time', '$650 - $1,000', null, 'https://example.com/jobs/aba-data'],
  ['QA Engineer', 'Pi Pay Labs', 'Phnom Penh', 'full-time', '$500 - $850', 'qa@pipaydemo.com', null],
  ['Digital Marketing Executive', 'Angkor Media', 'Phnom Penh', 'full-time', '$400 - $700', 'jobs@angkormedia.com', null],
  ['Project Manager', 'Mekong Software', 'Phnom Penh', 'full-time', '$1,000 - $1,600', null, 'https://example.com/jobs/mekong-pm'],
  ['Mobile Developer (Flutter)', 'Khmer Apps', 'Phnom Penh', 'full-time', '$700 - $1,200', 'hr@khmerapps.com', 'https://example.com/jobs/khmer-flutter'],
  ['Customer Support Officer', 'Tonle Cloud', 'Battambang', 'part-time', '$250 - $400', 'support@tonledemo.com', null],
  ['DevOps Engineer', 'Bayon Systems', 'Phnom Penh', 'full-time', '$1,000 - $1,800', null, 'https://example.com/jobs/bayon-devops'],
  ['Graphic Designer', 'Lotus Creative', 'Phnom Penh', 'contract', '$300 - $600', 'design@lotusdemo.com', null],
  ['Content Writer', 'Kampot Media', 'Kampot', 'part-time', '$200 - $350', 'write@kampotdemo.com', null],
  ['Business Analyst', 'Rithy Group', 'Phnom Penh', 'full-time', '$800 - $1,300', null, 'https://example.com/jobs/rithy-ba'],
  ['Full Stack Developer', 'Techo Labs', 'Phnom Penh', 'full-time', '$900 - $1,500', 'dev@techodemo.com', 'https://example.com/jobs/techo-fullstack'],
  ['HR Assistant', 'Sokha Corp', 'Phnom Penh', 'full-time', '$350 - $550', 'hr@sokhademo.com', null],
  ['IT Support Technician', 'Delta Networks', 'Siem Reap', 'full-time', '$300 - $500', null, 'https://example.com/jobs/delta-it'],
  ['Social Media Manager', 'Pursat Brands', 'Phnom Penh', 'contract', '$450 - $750', 'social@pursatdemo.com', null],
  ['Accountant', 'Mony Trading', 'Phnom Penh', 'full-time', '$500 - $800', 'finance@monydemo.com', null],
  ['Manager Assistant', 'Wangli Group', 'Phnom Penh', 'full-time', '$400 - $600', null, null] // no contact: tests the empty state
];

const jobs = rows.map(([title, company, location, job_type, salary_range, contact_email, job_url]) => ({
  id: randomUUID(),
  user_id: null,
  title,
  company,
  location,
  job_type,
  salary_range,
  description: `${company} is hiring a ${title}. You will work with a friendly team on real projects and grow your skills.`,
  requirements: `- Relevant experience or training for ${title}\n- Good English communication\n- Team player with a willingness to learn`,
  contact_email,
  job_url,
  status: 'open'
}));

try {
  // Only delete earlier seed jobs (they have no user), so real data is safe
  await prisma.job.deleteMany({ where: { user_id: null } });
  await prisma.job.createMany({ data: jobs });
  console.log(`Seeded ${jobs.length} jobs`);
} catch (e) {
  console.error(e.message);
} finally {
  await prisma.$disconnect();
}