import { Link } from 'react-router-dom';

const EXTERNAL = /^(https?:)?\/\/|^(mailto:|tel:)/i;

/**
 * One button that is really a link.
 * - '/path'            -> react-router <Link> (no page reload)
 * - '#section'         -> in-page anchor
 * - 'https://…' etc.   -> normal <a>, opens in a new tab
 * - empty              -> disabled look, not clickable
 */
export default function CtaLink({ to, className = '', children, newTab }) {
  if (!to) {
    return (
      <span className={`${className} is-disabled`} aria-disabled="true">
        {children}
      </span>
    );
  }
  if (EXTERNAL.test(to)) {
    const blank = newTab ?? /^(https?:)?\/\//i.test(to);
    return (
      <a
        href={to}
        className={className}
        {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  if (to.startsWith('#')) {
    return <a href={to} className={className}>{children}</a>;
  }
  return <Link to={to} className={className}>{children}</Link>;
}
