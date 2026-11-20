import Link from 'next/link';
import type { Job } from '@/lib/strapi';
import { mediaUrl } from '@/lib/strapi';
import { formatSalary, initials } from '@/lib/format';

export function JobCard({ job }: { job: Job }) {
  const logo = mediaUrl(job.company?.logo);
  return (
    <Link href={`/jobs/${job.slug}`} className="job-card">
      <div className="job-card-top">
        <span className="company-avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo ? <img src={logo} alt="" /> : initials(job.company?.name ?? 'FIX Talent')}
        </span>
        {job.featured && <span className="badge badge-featured">Featured</span>}
      </div>
      <h3>{job.title}</h3>
      <div className="muted">{job.company?.name}</div>
      <div className="tags">
        <span className="tag">{job.location}</span>
        <span className="tag">{job.workMode}</span>
        <span className="tag">{job.employmentType}</span>
      </div>
      <div className="job-card-bottom">
        <b>{formatSalary(job)}</b>
        <span className="link-arrow">View →</span>
      </div>
    </Link>
  );
}
