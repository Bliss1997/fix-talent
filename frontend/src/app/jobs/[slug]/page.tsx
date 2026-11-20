import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getJob, getJobSlugs, mediaUrl } from '@/lib/strapi';
import { formatDate, formatSalary, initials } from '@/lib/format';
import { Blocks } from '@/components/Blocks';
import { ApplyForm } from './ApplyForm';

type Props = { params: Promise<{ slug: string }> };

// Pre-render current jobs at build time. Jobs published later still work and are rendered on first visit.
export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: '__placeholder' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob((await params).slug);
  if (!job) return { title: 'Job not found' };
  return { title: `${job.title} at ${job.company?.name ?? 'FIX Talent'}`, description: job.summary ?? undefined };
}

export default async function JobPage({ params }: Props) {
  const job = await getJob((await params).slug);
  if (!job) notFound();
  const logo = mediaUrl(job.company?.logo);

  return (
    <>
      <div className="job-hero">
        <div className="container">
          <span className="company-avatar lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo ? <img src={logo} alt="" /> : initials(job.company?.name ?? 'FIX Talent')}
          </span>
          <div>
            <Link href="/jobs" className="breadcrumb">← All jobs</Link>
            <h1>{job.title}</h1>
            <div style={{ opacity: 0.9 }}>{job.company?.name}</div>
            <div className="tags">
              <span className="tag">{job.location}</span>
              <span className="tag">{job.workMode}</span>
              <span className="tag">{job.employmentType}</span>
              {job.level && <span className="tag">{job.level}</span>}
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="container detail-layout">
          <article className="prose">
            {job.summary && <p style={{ fontSize: 18 }}>{job.summary}</p>}
            <h2>About the role</h2>
            <Blocks content={job.description} />
            {!!job.requirements?.length && (<><h2>Requirements</h2><Blocks content={job.requirements} /></>)}
            {!!job.benefits?.length && (<><h2>Benefits</h2><Blocks content={job.benefits} /></>)}
            {job.company && (
              <>
                <h2>About {job.company.name}</h2>
                <Blocks content={job.company.description} />
              </>
            )}
          </article>

          <aside>
            <div className="side-card">
              <h3>Job overview</h3>
              <dl className="facts">
                <div><dt>Salary</dt><dd>{formatSalary(job)}</dd></div>
                <div><dt>Location</dt><dd>{job.location}</dd></div>
                <div><dt>Work mode</dt><dd>{job.workMode}</dd></div>
                <div><dt>Job type</dt><dd>{job.employmentType}</dd></div>
                {job.industry && <div><dt>Industry</dt><dd>{job.industry.name}</dd></div>}
                {job.deadline && <div><dt>Apply by</dt><dd>{formatDate(job.deadline)}</dd></div>}
              </dl>
            </div>
            <div className="side-card apply-card" id="apply">
              <h3>Apply for this job</h3>
              <ApplyForm jobId={job.documentId} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
