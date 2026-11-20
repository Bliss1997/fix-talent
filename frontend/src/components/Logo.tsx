type Variant = 'onLight' | 'onDark';

const COLORS: Record<Variant, { head: string; body: string; f: string }> = {
  onLight: { head: '#4FBDBA', body: '#0E4A56', f: '#FFFFFF' },
  onDark: { head: '#BEE9E8', body: '#FFFFFF', f: '#0E4A56' },
};

export function LogoMark({ size = 44, variant = 'onLight' }: { size?: number; variant?: Variant }) {
  const c = COLORS[variant];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="12" r="9" fill={c.head} />
      <path d="M8 62V50a24 24 0 0 1 48 0v12z" fill={c.body} />
      <path d="M26 56V40M26 40h16M26 49h11" stroke={c.f} strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ variant = 'onLight', slogan = true }: { variant?: Variant; slogan?: boolean }) {
  return (
    <span className={`logo logo-${variant}`}>
      <LogoMark variant={variant} />
      <span>
        <span className="logo-name">
          FIX <i>Talent</i>
        </span>
        {slogan && <small className="logo-slogan">Where great people meet great work.</small>}
      </span>
    </span>
  );
}
