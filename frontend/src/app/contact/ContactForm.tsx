'use client';

import { useActionState } from 'react';
import { sendInquiry, type ContactState } from './actions';

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendInquiry, null);

  if (state?.ok) return <div className="alert alert-ok" role="status">{state.message}</div>;

  return (
    <form action={action} className="form">
      <div className="form-row">
        <label>Company *<input className="field" name="companyName" required maxLength={160} autoComplete="organization" /></label>
        <label>Your name *<input className="field" name="contactName" required maxLength={120} autoComplete="name" /></label>
      </div>
      <div className="form-row">
        <label>Work email *<input className="field" name="email" type="email" required autoComplete="email" /></label>
        <label>Phone<input className="field" name="phone" type="tel" maxLength={30} autoComplete="tel" /></label>
      </div>
      <label>
        What do you need? *
        <select className="field" name="service" defaultValue={defaultService ?? 'Recruitment'}>
          <option>Recruitment</option>
          <option>Staffing</option>
          <option>HR Solutions</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label>
        Tell us about the role or project *
        <textarea className="field" name="message" rows={5} required minLength={10} maxLength={3000} placeholder="Role, number of people, location, timeline…" />
      </label>
      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="check">
        <input type="checkbox" name="consent" required />
        I agree that FIX Talent may store these details to respond to my request.
      </label>
      {state && !state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}
      <button className="btn btn-dark" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send request'}</button>
    </form>
  );
}