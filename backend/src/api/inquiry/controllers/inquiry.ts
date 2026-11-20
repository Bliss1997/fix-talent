import { factories } from '@strapi/strapi';

// Public employer inquiries. Only visitor-provided fields are stored;
// status and notes are set by the team in the admin panel.
const ALLOWED = ['companyName', 'contactName', 'email', 'phone', 'service', 'message', 'consent'] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default factories.createCoreController('api::inquiry.inquiry', ({ strapi }) => ({
  async create(ctx) {
    const raw = (ctx.request.body as { data?: unknown } | undefined)?.data;
    if (!raw || typeof raw !== 'object') return ctx.badRequest('Missing data');

    const src = raw as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const key of ALLOWED) if (key in src) data[key] = src[key];

    if (data.consent !== true) return ctx.badRequest('Consent is required');
    if (typeof data.email !== 'string' || !EMAIL.test(data.email)) return ctx.badRequest('A valid email is required');

    try {
      const doc = await strapi.documents('api::inquiry.inquiry').create({ data: data as never });
      // Do not echo the stored record back to an anonymous visitor.
      return { data: { documentId: doc.documentId }, meta: {} };
    } catch (err) {
      return ctx.badRequest(err instanceof Error ? err.message : 'Invalid inquiry');
    }
  },
}));