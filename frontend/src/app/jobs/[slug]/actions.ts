'use server';

import { STRAPI_URL } from '@/lib/strapi';

export type ApplyState = { ok: boolean; message: string } | null;

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? '').trim().slice(0, max);

export async function apply(_prev: ApplyState, fd: FormData): Promise<ApplyState> {
  const data = {
    job: text(fd, 'job', 64),
    fullName: text(fd, 'fullName', 120),
    email: text(fd, 'email', 200),
    phone: text(fd, 'phone', 30),
    linkedin: text(fd, 'linkedin', 300),
    coverLetter: text(fd, 'coverLetter', 5000),
    consent: fd.get('consent') === 'on',
  };

  if (!data.fullName) return { ok: false, message: 'Please enter your full name.' };
  if (!EMAIL.test(data.email)) return { ok: false, message: 'Please enter a valid email address.' };
  if (data.linkedin && !/^https?:\/\//i.test(data.linkedin)) return { ok: false, message: 'LinkedIn must be a full link starting with https://' };
  if (!data.consent) return { ok: false, message: 'Please agree to the privacy terms.' };

  const cv = fd.get('cv');
  if (!(cv instanceof File) || cv.size === 0) return { ok: false, message: 'Please attach your CV.' };
  if (cv.size > MAX_CV_BYTES) return { ok: false, message: 'CV must be 5 MB or smaller.' };
  if (!CV_TYPES.has(cv.type)) return { ok: false, message: 'CV must be a PDF or Word file.' };

  const body = new FormData();
  body.append('data', JSON.stringify(data));
  body.append('files.cv', cv, cv.name);

  try {
    const res = await fetch(`${STRAPI_URL}/api/applications`, { method: 'POST', body });
    if (!res.ok) {
      console.error('Application failed', res.status, await res.text());
      return { ok: false, message: 'Something went wrong. Please try again.' };
    }
  } catch (e) {
    console.error('Application failed', e);
    return { ok: false, message: 'We could not reach the server. Please try again.' };
  }
  return { ok: true, message: 'Thank you! Your application has been sent. Our team will contact you soon.' };
}
