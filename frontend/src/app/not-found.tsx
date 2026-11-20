import Link from 'next/link';

export default function NotFound() {
  return (
    <section>
      <div className="container empty">
        <h1>Page not found</h1>
        <p className="muted">This job may have closed or the link is wrong.</p>
        <Link href="/jobs" className="btn btn-dark">Browse jobs</Link>
      </div>
    </section>
  );
}
