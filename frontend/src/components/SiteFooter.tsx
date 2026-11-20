import Link from 'next/link';
import { Logo } from './Logo';

async function Year() {
  'use cache';
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div>
          <Logo variant="onDark" />
          <p className="footer-note">
            hello@fixtalent.example
            <br />
            Ho Chi Minh City · Ha Noi · Da Nang
          </p>
        </div>
        <div>
          <h4>Job seekers</h4>
          <Link href="/jobs">Find a job</Link>
          <Link href="/jobs?type=Internship">Internships</Link>
          <Link href="/jobs?workMode=Remote">Remote jobs</Link>
        </div>
        <div>
          <h4>Employers</h4>
          <Link href="/#services">Recruitment</Link>
          <Link href="/#services">Staffing</Link>
          <Link href="/#services">HR solutions</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/#industries">Industries</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="container copyright">© <Year /> FIX Talent. All rights reserved.</div>
    </footer>
  );
}
