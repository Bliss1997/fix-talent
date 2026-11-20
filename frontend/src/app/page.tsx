import Link from 'next/link';
import { getFeaturedJobs, getIndustries } from '@/lib/strapi';
import { JobCard } from '@/components/JobCard';

const SERVICES = [
  { title: 'Recruitment', text: 'Permanent hiring for professional and managerial roles, matched on skills and culture.', icon: <><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6M17 11l2 2 4-4" /></> },
  { title: 'Staffing', text: 'Temporary and contract workers, ready fast, so your team scales with demand.', icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3" /></> },
  { title: 'HR Solutions', text: 'Payroll, outsourcing and workforce consulting that cut admin work and hiring risk.', icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /> },
];

export default async function Home() {
  const [jobs, industries] = await Promise.all([getFeaturedJobs(6), getIndustries()]);

  return (
    <>
      <div className="hero">
        <div className="hero-half hero-seekers">
          <div className="eyebrow">Job seekers</div>
          <h1>Seeking a new role?</h1>
          <p>Begin the journey to your next job today. Browse roles from companies we know and trust.</p>
          <form action="/jobs" className="hero-search" role="search">
            <input name="q" placeholder="Job title, skill or company" aria-label="Search jobs" />
            <button className="btn btn-dark" type="submit">Find jobs</button>
          </form>
        </div>
        <div className="hero-half hero-employers" id="employers">
          <div className="eyebrow">Employers</div>
          <h2>Looking for talent?</h2>
          <p>Tell us the role. We send you a shortlist of vetted candidates in days, not weeks.</p>
          <Link href="/contact" className="btn btn-dark">Hire with us</Link>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="intro">
            <h2>Great results and a smooth experience for people and companies</h2>
            <p>We connect skilled professionals with teams that value them, across Vietnam.</p>
          </div>
          <div className="stats" style={{ marginTop: 40 }}>
            <div><b>12,000+</b><span>candidates placed</span></div>
            <div><b>480+</b><span>partner companies</span></div>
            <div><b>14 days</b><span>average time to hire</span></div>
            <div><b>3</b><span>major cities</span></div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>Latest jobs</h2>
            <Link href="/jobs" className="btn btn-outline">View all jobs</Link>
          </div>
          {jobs.length ? (
            <div className="grid-3">{jobs.map((j) => <JobCard key={j.documentId} job={j} />)}</div>
          ) : (
            <div className="empty muted">No open roles right now. Check back soon.</div>
          )}
        </div>
      </section>

      <section className="dark-band" id="services">
        <div className="container">
          <div className="section-head"><h2>How we help employers</h2></div>
          <div className="grid-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <div className="icon-tile">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0E4A56" strokeWidth="2.2" strokeLinecap="round">{s.icon}</svg>
                </div>
                <h3 style={{ color: 'var(--teal)' }}>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="industries">
        <div className="container">
          <div className="section-head"><h2>Our specialisations</h2></div>
          <div className="grid-3">
            {industries.map((i) => (
              <Link key={i.documentId} href={`/jobs?industry=${encodeURIComponent(i.slug)}`} className="industry-card">
                <h3>{i.name}</h3>
                <p>{i.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta">
            <div>
              <h2>Let&apos;s find your fit.</h2>
              <p>Talk to our team about your next role or your next hire.</p>
            </div>
            <Link href="/contact" className="btn btn-dark">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
