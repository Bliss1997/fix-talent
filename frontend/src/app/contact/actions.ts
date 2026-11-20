'use server';

import { STRAPI_URL } from '@/lib/strapi';

export type ContactState = { ok: boolean; message: string } | null;

const SERVICES = ['Recruitment', 'Staffing', 'HR Solutions', 'Not sure yet'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? '').trim().slice(0, max);

export async function sendInquiry(_prev: ContactState, fd: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (text(fd, 'website', 200)) return { ok: true, message: 'Thank you! We will contact you within one business day.' };

  const data = {
    companyName: text(fd, 'companyName', 160),
    contactName: text(fd, 'contactName', 120),
    email: text(fd, 'email', 200),
    phone: text(fd, 'phone', 30),
    service: text(fd, 'service', 40),
    message: text(fd, 'message', 3000),
    consent: fd.get('consent') === 'on',
  };

  if (!data.companyName) return { ok: false, message: 'Please enter your company name.' };
  if (!data.contactName) return { ok: false, message: 'Please enter your name.' };
  if (!EMAIL.test(data.email)) return { ok: false, message: 'Please enter a valid email address.' };
  if (!SERVICES.includes(data.service)) return { ok: false, message: 'Please choose a service.' };
  if (data.message.length < 10) return { ok: false, message: 'Please tell us a little more about what you need.' };
  if (!data.consent) return { ok: false, message: 'Please agree to the privacy terms.' };

  try {
    const res = await fetch(`${STRAPI_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      console.error('Inquiry failed', res.status, await res.text());
      return { ok: false, message: 'Something went wrong. Please try again.' };
    }
  } catch (e) {
    console.error('Inquiry failed', e);
    return { ok: false, message: 'We could not reach the server. Please try again.' };
  }
  return { ok: true, message: 'Thank you! We will contact you within one business day.' };
}