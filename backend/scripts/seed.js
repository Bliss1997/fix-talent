'use strict';

// Fills Strapi with SAMPLE companies and jobs (fictional data for demo/testing).
// Run: npm run seed   (safe to run again: skips if sample companies already exist)

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const p = (text) => ({ type: 'paragraph', children: [{ type: 'text', text }] });
const ul = (items) => ({
  type: 'list',
  format: 'unordered',
  children: items.map((text) => ({ type: 'list-item', children: [{ type: 'text', text }] })),
});

const COMPANIES = [
  { name: 'Lotus Fintech', slug: 'lotus-fintech', location: 'Ho Chi Minh City', website: 'https://example.com/lotus', about: 'Digital payments and lending platform serving 2 million users across Vietnam.' },
  { name: 'Mekong Logistics', slug: 'mekong-logistics', location: 'Da Nang', website: 'https://example.com/mekong', about: 'Warehousing and last-mile delivery for e-commerce and retail brands.' },
  { name: 'Sen Retail Group', slug: 'sen-retail-group', location: 'Ha Noi', website: 'https://example.com/sen', about: 'Consumer goods and retail chain with 120 stores nationwide.' },
  { name: 'Bamboo Software', slug: 'bamboo-software', location: 'Ho Chi Minh City', website: 'https://example.com/bamboo', about: 'Software outsourcing company building web and mobile products for clients in Japan and Europe.' },
  { name: 'An Phat Bank', slug: 'an-phat-bank', location: 'Ha Noi', website: 'https://example.com/anphat', about: 'Commercial bank focused on SME and digital banking.' },
];

const JOBS = [
  { title: 'Senior Backend Engineer (Node.js)', company: 'lotus-fintech', industry: 'it-telecommunications', location: 'Ho Chi Minh City', workMode: 'Hybrid', employmentType: 'Full-time', level: 'Senior', salaryMin: 45000000, salaryMax: 70000000, featured: true,
    summary: 'Build and scale payment APIs used by millions of customers.',
    desc: 'Join the core payments team to design, build and run high-traffic APIs.',
    req: ['5+ years of backend development', 'Strong Node.js and TypeScript', 'PostgreSQL and Redis', 'Experience with payment or banking systems is a plus'],
    ben: ['13th month salary and performance bonus', 'Premium health insurance', '2 days work from home per week'] },
  { title: 'Product Designer (UI/UX)', company: 'bamboo-software', industry: 'it-telecommunications', location: 'Ho Chi Minh City', workMode: 'Remote', employmentType: 'Full-time', level: 'Mid', salaryMin: 25000000, salaryMax: 40000000, featured: true,
    summary: 'Design web and mobile products for international clients.',
    desc: 'Work with product managers and engineers to turn ideas into clear, usable interfaces.',
    req: ['3+ years in product design', 'Strong Figma skills', 'A portfolio of shipped products', 'Good English communication'],
    ben: ['Fully remote', 'Laptop and home-office budget', 'Yearly training budget'] },
  { title: 'QA Automation Lead', company: 'bamboo-software', industry: 'it-telecommunications', location: 'Da Nang', workMode: 'On-site', employmentType: 'Full-time', level: 'Lead', salaryNegotiable: true,
    summary: 'Lead a team of 6 QA engineers and own test automation.',
    desc: 'Set the testing strategy and build automated test suites for client projects.',
    req: ['5+ years in QA, 2+ years leading a team', 'Playwright or Selenium', 'CI/CD experience'],
    ben: ['Leadership allowance', 'Annual company trip', 'Health insurance for family'] },
  { title: 'Credit Risk Analyst', company: 'an-phat-bank', industry: 'banking-financial-services', location: 'Ha Noi', workMode: 'On-site', employmentType: 'Full-time', level: 'Mid', salaryMin: 20000000, salaryMax: 32000000,
    summary: 'Assess SME loan applications and build risk models.',
    desc: 'Analyse financial statements and data to support lending decisions.',
    req: ['Degree in Finance, Economics or Statistics', '2+ years in credit risk', 'Excel and SQL; Python is a plus'],
    ben: ['Preferential loan rates for staff', 'Clear promotion path', '14 days annual leave'] },
  { title: 'Warehouse Operations Supervisor', company: 'mekong-logistics', industry: 'industrial-logistics', location: 'Da Nang', workMode: 'On-site', employmentType: 'Full-time', level: 'Mid', salaryMin: 15000000, salaryMax: 22000000,
    summary: 'Run daily operations of a 10,000 m² fulfilment centre.',
    desc: 'Manage shift teams, inventory accuracy and on-time dispatch.',
    req: ['3+ years in warehouse operations', 'Experience with WMS software', 'Able to work shifts'],
    ben: ['Shift and overtime allowance', 'Meals provided', 'Social insurance on full salary'] },
  { title: 'Supply Chain Planner', company: 'mekong-logistics', industry: 'industrial-logistics', location: 'Ho Chi Minh City', workMode: 'Hybrid', employmentType: 'Contract', level: 'Junior', salaryMin: 12000000, salaryMax: 18000000,
    summary: '12-month contract planning stock and delivery routes.',
    desc: 'Forecast demand and plan inventory for key retail clients.',
    req: ['1+ year in planning or logistics', 'Strong Excel', 'Detail-oriented'],
    ben: ['Possible conversion to permanent', 'Hybrid working', 'Training provided'] },
  { title: 'Key Account Manager (FMCG)', company: 'sen-retail-group', industry: 'consumer-goods-healthcare', location: 'Ha Noi', workMode: 'On-site', employmentType: 'Full-time', level: 'Senior', salaryMin: 30000000, salaryMax: 45000000, featured: true,
    summary: 'Grow sales with major supermarket and convenience chains.',
    desc: 'Own relationships and annual plans with top retail partners in the North.',
    req: ['4+ years in FMCG key account sales', 'Strong negotiation skills', 'Network with modern trade channels'],
    ben: ['Sales commission', 'Company car allowance', 'Health insurance'] },
  { title: 'HR Business Partner', company: 'sen-retail-group', industry: 'corporate-professional-services', location: 'Ha Noi', workMode: 'Hybrid', employmentType: 'Full-time', level: 'Senior', salaryNegotiable: true,
    summary: 'Partner with store managers on hiring, performance and culture.',
    desc: 'Support 40 stores in the North with people strategy and employee relations.',
    req: ['5+ years in HR, 2+ as HRBP', 'Knowledge of Vietnam labour law', 'Retail experience is a plus'],
    ben: ['Hybrid working', 'Learning budget', 'Staff discount'] },
  { title: 'Marketing Intern', company: 'lotus-fintech', industry: 'banking-financial-services', location: 'Ho Chi Minh City', workMode: 'On-site', employmentType: 'Internship', level: 'Intern', salaryMin: 4000000, salaryMax: 5000000,
    summary: '6-month internship in digital marketing.',
    desc: 'Help plan social media content and campaigns for a fast-growing fintech app.',
    req: ['Final-year student in Marketing or Communications', 'Creative and good at writing', 'Canva or Adobe tools'],
    ben: ['Monthly allowance', 'Mentoring', 'Chance of full-time offer'] },
  { title: 'Hotel Front Office Manager', company: 'sen-retail-group', industry: 'real-estate-hospitality', location: 'Da Nang', workMode: 'On-site', employmentType: 'Full-time', level: 'Manager', salaryMin: 25000000, salaryMax: 35000000,
    summary: 'Lead the front office team at a 4-star beach resort.',
    desc: 'Make sure every guest has a smooth check-in, stay and check-out.',
    req: ['4+ years in hotel front office, 2+ as supervisor', 'Fluent English', 'Opera PMS experience'],
    ben: ['Accommodation support', 'Service charge', 'Meals on duty'] },
];

async function seed(app) {
  const companies = app.documents('api::company.company');
  const industries = app.documents('api::industry.industry');
  const jobs = app.documents('api::job.job');

  if ((await companies.count({ filters: { slug: { $in: COMPANIES.map((c) => c.slug) } } })) > 0) {
    console.log('Sample data already exists. Nothing to do.');
    return;
  }

  const companyIds = {};
  for (const c of COMPANIES) {
    const doc = await companies.create({
      data: { name: c.name, slug: c.slug, location: c.location, website: c.website, description: [p(c.about)] },
    });
    companyIds[c.slug] = doc.documentId;
  }

  const industryIds = {};
  for (const i of await industries.findMany({ limit: 100 })) industryIds[i.slug] = i.documentId;

  const in60days = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
  for (const j of JOBS) {
    await jobs.create({
      status: 'published',
      data: {
        title: j.title,
        slug: j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        company: companyIds[j.company],
        industry: industryIds[j.industry],
        location: j.location,
        workMode: j.workMode,
        employmentType: j.employmentType,
        level: j.level,
        salaryMin: j.salaryMin ?? null,
        salaryMax: j.salaryMax ?? null,
        salaryCurrency: 'VND',
        salaryNegotiable: !!j.salaryNegotiable,
        summary: j.summary,
        description: [p(j.desc)],
        requirements: [ul(j.req)],
        benefits: [ul(j.ben)],
        deadline: in60days,
        featured: !!j.featured,
      },
    });
  }
  console.log(`Created ${COMPANIES.length} companies and ${JOBS.length} published jobs.`);
}

(async () => {
  const ctx = await compileStrapi();
  const app = await createStrapi(ctx).load();
  app.log.level = 'error';
  try {
    await seed(app);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
})();
