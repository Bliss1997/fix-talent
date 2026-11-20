import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Hire with us',
  description: 'Tell FIX Talent about the role you need to fill. We reply within one business day.',
};

export default function ContactPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Let&apos;s find your fit</h1>
          <p className="muted" style={{ margin: 0 }}>Tell us what you need. We reply within one business day.</p>
        </div>
      </div>
      <section>
        <div className="container contact-layout">
          <div className="side-card" style={{ marginBottom: 0 }}>
            <ContactForm />
          </div>
          <aside>
            <div className="side-card">
              <h3>What happens next</h3>
              <ol className="steps">
                <li><b>We call you.</b> A consultant learns about the role and your team.</li>
                <li><b>We shortlist.</b> You get vetted candidates in days, not weeks.</li>
                <li><b>You hire.</b> We support interviews, offers and onboarding.</li>
              </ol>
            </div>
            <div className="side-card">
              <h3>Offices</h3>
              <p className="muted" style={{ margin: 0 }}>Ho Chi Minh City<br />Ha Noi<br />Da Nang</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}