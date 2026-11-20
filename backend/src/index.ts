import type { Core } from '@strapi/strapi';

// What anonymous website visitors may do. Everything else stays admin-only.
const PUBLIC_PERMISSIONS: Record<string, string[]> = {
  'api::job.job': ['find', 'findOne'],
  'api::company.company': ['find', 'findOne'],
  'api::industry.industry': ['find', 'findOne'],
  'api::application.application': ['create'],
  'api::inquiry.inquiry': ['create'],
};

const INDUSTRIES = [
  { name: 'IT & Telecommunications', slug: 'it-telecommunications', description: 'Software development, infrastructure and IT services.' },
  { name: 'Banking & Financial Services', slug: 'banking-financial-services', description: 'Fintech, corporate banking, insurance and asset management.' },
  { name: 'Industrial & Logistics', slug: 'industrial-logistics', description: 'Production engineering, supply chain and logistics.' },
  { name: 'Consumer Goods & Healthcare', slug: 'consumer-goods-healthcare', description: 'Product development, sales and healthcare solutions.' },
  { name: 'Real Estate & Hospitality', slug: 'real-estate-hospitality', description: 'Property, construction projects and hospitality operations.' },
  { name: 'Corporate & Professional Services', slug: 'corporate-professional-services', description: 'Consulting, legal, advisory and governance.' },
];

async function grantPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
    for (const action of actions) {
      const name = `${uid}.${action}`;
      const exists = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: name, role: publicRole.id } });
      if (!exists) {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .create({ data: { action: name, role: publicRole.id } });
      }
    }
  }
}

async function seedIndustries(strapi: Core.Strapi) {
  const docs = strapi.documents('api::industry.industry');
  if ((await docs.count({})) > 0) return;
  for (const data of INDUSTRIES) await docs.create({ data });
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicPermissions(strapi);
    await seedIndustries(strapi);
  },
};
