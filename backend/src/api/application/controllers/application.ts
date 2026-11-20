import { factories } from '@strapi/strapi';

// Public job applications.
// Accepts JSON ({ data: {...} }) or multipart (field "data" = JSON string, file field "cv").
// Only candidate-provided fields are stored; status and notes are set by recruiters in the admin panel.
const ALLOWED = ['fullName', 'email', 'phone', 'linkedin', 'coverLetter', 'job', 'consent'] as const;

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const CV_EXT = /\.(pdf|docx?)$/i;

type UploadedFile = {
  size: number;
  mimetype?: string;
  type?: string;
  originalFilename?: string;
  name?: string;
  filepath?: string;
};

export default factories.createCoreController('api::application.application', ({ strapi }) => ({
  async create(ctx) {
    const body = (ctx.request.body ?? {}) as Record<string, unknown>;
    const raw = typeof body.data === 'string' ? safeParse(body.data) : body.data;
    if (!raw || typeof raw !== 'object') return ctx.badRequest('Missing data');

    const data: Record<string, unknown> = {};
    for (const key of ALLOWED) if (key in (raw as object)) data[key] = (raw as Record<string, unknown>)[key];

    if (data.consent !== true) return ctx.badRequest('Consent is required');
    if (typeof data.fullName !== 'string' || !data.fullName.trim()) return ctx.badRequest('Full name is required');
    if (typeof data.email !== 'string') return ctx.badRequest('Email is required');

    // Only allow applying to a job that exists and is published.
    if (data.job !== undefined) {
      if (typeof data.job !== 'string') return ctx.badRequest('Invalid job');
      const job = await strapi.documents('api::job.job').findOne({ documentId: data.job, status: 'published' });
      if (!job) return ctx.badRequest('This job is no longer open');
    }

    const files = (ctx.request as unknown as { files?: Record<string, UploadedFile | UploadedFile[]> }).files ?? {};
    const extra = Object.keys(files).filter((k) => k !== 'cv');
    if (extra.length) return ctx.badRequest('Unexpected file field');

    let cv: { id: number } | undefined;
    const cvField = files.cv;
    if (cvField) {
      if (Array.isArray(cvField)) return ctx.badRequest('Only one CV file is allowed');
      const mime = cvField.mimetype ?? cvField.type ?? '';
      const name = cvField.originalFilename ?? cvField.name ?? '';
      if (cvField.size > MAX_CV_BYTES) return ctx.badRequest('CV must be 5 MB or smaller');
      if (!CV_MIME.has(mime) || !CV_EXT.test(name)) return ctx.badRequest('CV must be a PDF or Word file');

      [cv] = await strapi.plugin('upload').service('upload').upload({ data: {}, files: cvField });
    }

    try {
      const doc = await strapi.documents('api::application.application').create({
        data: { ...data, ...(cv ? { cv: cv.id } : {}) } as never,
      });
      // Do not echo the stored record back to an anonymous visitor.
      return { data: { documentId: doc.documentId }, meta: {} };
    } catch (err) {
      // Validation failed: remove the orphaned CV so stray uploads do not pile up.
      if (cv) await strapi.plugin('upload').service('upload').remove(cv).catch(() => undefined);
      const message = err instanceof Error ? err.message : 'Invalid application';
      return ctx.badRequest(message);
    }
  },
}));

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
