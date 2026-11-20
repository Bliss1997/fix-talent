'use client';

import { useActionState } from 'react';
import { apply, type ApplyState } from './actions';

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(apply, null);

  if (state?.ok) return <div className="alert alert-ok" role="status">{state.message}</div>;

  return (
    <form action={action} className="form">
      <input type="hidden" name="job" value={jobId} />
      <label>Full name *<input className="field" name="fullName" required maxLength={120} autoComplete="name" /></label>
      <label>Email *<input className="field" name="email" type="email" required autoComplete="email" /></label>
      <label>Phone<input className="field" name="phone" type="tel" maxLength={30} autoComplete="tel" /></label>
      <label>LinkedIn<input className="field" name="linkedin" type="url" placeholder="https://linkedin.com/in/..." /></label>
      <label>
        CV *<span className="hint">PDF or Word, up to 5 MB</span>
        <input className="field" name="cv" type="file" required accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
      </label>
      <label>Cover letter<textarea className="field" name="coverLetter" rows={4} maxLength={5000} /></label>
      <label className="check">
        <input type="checkbox" name="consent" required />
        I agree that FIX Talent may store my details and share them with this employer for this application.
      </label>
      {state && !state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}
      <button className="btn btn-dark" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Submit application'}</button>
    </form>
  );
}
