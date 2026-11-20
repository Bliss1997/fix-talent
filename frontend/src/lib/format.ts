import type { Job } from './strapi';

function short(n: number, currency: string) {
  if (currency === 'VND') return n >= 1_000_000 ? `${Math.round(n / 1_000_000)}M` : n.toLocaleString('en-US');
  return n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(n);
}

export function formatSalary(j: Pick<Job, 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'salaryNegotiable'>) {
  const c = j.salaryCurrency ?? 'VND';
  if (j.salaryNegotiable || (!j.salaryMin && !j.salaryMax)) return 'Negotiable';
  if (j.salaryMin && j.salaryMax) return `${short(j.salaryMin, c)} – ${short(j.salaryMax, c)} ${c}`;
  if (j.salaryMin) return `From ${short(j.salaryMin, c)} ${c}`;
  return `Up to ${short(j.salaryMax!, c)} ${c}`;
}

export function formatDate(iso?: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}
