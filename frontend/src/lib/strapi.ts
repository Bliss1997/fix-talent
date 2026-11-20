import 'server-only';
import { cacheLife } from 'next/cache';

export const STRAPI_URL = (process.env.STRAPI_URL ?? 'http://127.0.0.1:1337').replace(/\/$/, '');

export type Block =
  | { type: 'paragraph'; children: Inline[] }
  | { type: 'heading'; level: number; children: Inline[] }
  | { type: 'list'; format: 'ordered' | 'unordered'; children: { type: 'list-item'; children: Inline[] }[] }
  | { type: string; children?: unknown[] };
export type Inline = { type: 'text'; text: string; bold?: boolean; italic?: boolean } | { type: 'link'; url: string; children: Inline[] };

export type Media = { url: string; alternativeText?: string | null };
export type Industry = { documentId: string; name: string; slug: string; description?: string | null };
export type Company = {
  documentId: string; name: string; slug: string; location?: string | null; website?: string | null;
  description?: Block[] | null; logo?: Media | null;
};
export type Job = {
  documentId: string; title: string; slug: string; location: string; workMode: string; employmentType: string;
  level?: string | null; salaryMin?: number | null; salaryMax?: number | null; salaryCurrency?: string | null;
  salaryNegotiable?: boolean | null; summary?: string | null; description?: Block[] | null;
  requirements?: Block[] | null; benefits?: Block[] | null; deadline?: string | null; featured?: boolean | null;
  publishedAt?: string; company?: Company | null; industry?: Industry | null;
};
type List<T> = { data: T[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } };

// Cached for about a minute so new or edited jobs in Strapi show up quickly.
async function fetchJson(path: string, query: string) {
  'use cache';
  cacheLife('minutes');
  const res = await fetch(`${STRAPI_URL}/api/${path}?${query}`);
  if (!res.ok) throw new Error(`Strapi ${path} failed: ${res.status}`);
  return res.json();
}

async function get<T>(path: string, params: URLSearchParams): Promise<T> {
  return (await fetchJson(path, params.toString())) as T;
}

export const LOCATIONS = ['Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Other'];
export const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export type JobFilters = { q?: string; industry?: string; location?: string; workMode?: string; type?: string; page?: number };

export async function getJobs(f: JobFilters = {}, pageSize = 12) {
  const p = new URLSearchParams();
  p.set('populate[company][populate][0]', 'logo');
  p.set('populate[industry]', 'true');
  p.set('sort[0]', 'featured:desc');
  p.set('sort[1]', 'publishedAt:desc');
  p.set('pagination[page]', String(f.page ?? 1));
  p.set('pagination[pageSize]', String(pageSize));
  if (f.q) {
    p.set('filters[$or][0][title][$containsi]', f.q);
    p.set('filters[$or][1][summary][$containsi]', f.q);
    p.set('filters[$or][2][company][name][$containsi]', f.q);
  }
  if (f.industry) p.set('filters[industry][slug][$eq]', f.industry);
  if (f.location && LOCATIONS.includes(f.location)) p.set('filters[location][$eq]', f.location);
  if (f.workMode && WORK_MODES.includes(f.workMode)) p.set('filters[workMode][$eq]', f.workMode);
  if (f.type && EMPLOYMENT_TYPES.includes(f.type)) p.set('filters[employmentType][$eq]', f.type);
  return get<List<Job>>('jobs', p);
}

export async function getFeaturedJobs(limit = 6) {
  const p = new URLSearchParams();
  p.set('populate[company][populate][0]', 'logo');
  p.set('populate[industry]', 'true');
  p.set('sort[0]', 'featured:desc');
  p.set('sort[1]', 'publishedAt:desc');
  p.set('pagination[pageSize]', String(limit));
  return (await get<List<Job>>('jobs', p)).data;
}

export async function getJob(slug: string) {
  const p = new URLSearchParams();
  p.set('filters[slug][$eq]', slug);
  p.set('populate[company][populate][0]', 'logo');
  p.set('populate[industry]', 'true');
  return (await get<List<Job>>('jobs', p)).data[0] ?? null;
}

export async function getJobSlugs() {
  const p = new URLSearchParams();
  p.set('fields[0]', 'slug');
  p.set('pagination[pageSize]', '100');
  try {
    return (await get<List<Pick<Job, 'slug'>>>('jobs', p)).data.map((j) => j.slug);
  } catch {
    return [];
  }
}

export async function getIndustries() {
  const p = new URLSearchParams();
  p.set('sort[0]', 'name:asc');
  p.set('pagination[pageSize]', '100');
  return (await get<List<Industry>>('industries', p)).data;
}

export function mediaUrl(m?: Media | null) {
  if (!m?.url) return null;
  return m.url.startsWith('http') ? m.url : `${STRAPI_URL}${m.url}`;
}
