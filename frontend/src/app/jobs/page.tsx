import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { EMPLOYMENT_TYPES, LOCATIONS, WORK_MODES, getIndustries, getJobs, type JobFilters } from '@/lib/strapi';
import { JobCard } from '@/components/JobCard';

export const metadata: Metadata = { title: 'Find jobs' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

export default function JobsPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Find your next role</h1>
          <p className="muted" style={{ margin: 0 }}>Hand-picked openings from companies we trust.</p>
        </div>
      </div>
      <Suspense fallback={<section><div className="container muted">Loading jobs…</div></section>}>
        <JobsResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function JobsResults({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters: JobFilters = {
    q: one(sp.q)?.slice(0, 100),
    industry: one(sp.industry),
    location: one(sp.location),
    workMode: one(sp.workMode),
    type: one(sp.type),
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
  const [{ data: jobs, meta }, industries] = await Promise.all([getJobs(filters, 10), getIndustries()]);
  const { page, pageCount, total } = meta.pagination;

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v && k !== 'page') p.set(k, String(v));
    p.set('page', String(n));
    return `/jobs?${p}`;
  };

  return (
    <>
      <section>
        <div className="container jobs-layout">
          <form className="filters" action="/jobs">
            <label>
              Keyword
              <input className="field" name="q" defaultValue={filters.q} placeholder="Title, skill or company" />
            </label>
            <label>
              Industry
              <select className="field" name="industry" defaultValue={filters.industry ?? ''}>
                <option value="">All industries</option>
                {industries.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
              </select>
            </label>
            <label>
              Location
              <select className="field" name="location" defaultValue={filters.location ?? ''}>
                <option value="">All locations</option>
                {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label>
              Work mode
              <select className="field" name="workMode" defaultValue={filters.workMode ?? ''}>
                <option value="">Any</option>
                {WORK_MODES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label>
              Job type
              <select className="field" name="type" defaultValue={filters.type ?? ''}>
                <option value="">Any</option>
                {EMPLOYMENT_TYPES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <button className="btn btn-dark" type="submit">Search</button>
            <Link href="/jobs" className="muted" style={{ textAlign: 'center', fontSize: 14 }}>Clear filters</Link>
          </form>

          <div>
            <div className="results-head">
              <span><b style={{ color: 'var(--ink)' }}>{total}</b> {total === 1 ? 'job' : 'jobs'} found</span>
            </div>
            {jobs.length ? (
              <div className="grid-2">{jobs.map((j) => <JobCard key={j.documentId} job={j} />)}</div>
            ) : (
              <div className="empty">
                <h3>No jobs match your search</h3>
                <p className="muted">Try fewer filters or a different keyword.</p>
              </div>
            )}
            {pageCount > 1 && (
              <nav className="pagination" aria-label="Pages">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) =>
                  n === page ? <span key={n} className="current">{n}</span> : <Link key={n} href={pageHref(n)}>{n}</Link>,
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
