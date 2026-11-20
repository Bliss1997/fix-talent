import Link from 'next/link';
import { Logo } from './Logo';

export function SiteHeader() {
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Where great people meet great work.</span>
          <span>Ho Chi Minh City · Ha Noi · Da Nang</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container">
          <Link href="/" aria-label="FIX Talent home">
            <Logo />
          </Link>
          <nav>
            <Link href="/jobs">Find jobs</Link>
            <Link href="/contact">Employers</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#industries">Industries</Link>
          </nav>
          <Link href="/contact" className="btn btn-dark">
            Contact us
          </Link>
        </div>
      </header>
    </>
  );
}
