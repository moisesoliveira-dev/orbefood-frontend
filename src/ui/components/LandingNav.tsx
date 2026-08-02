import { BrandLogo } from './BrandLogo';
import { navLinks } from '../../domain/landing-content';

interface LandingNavProps {
  onCta: () => void;
}

export function LandingNav({ onCta }: LandingNavProps) {
  return (
    <nav className="landing-nav">
      <BrandLogo />
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <button type="button" className="btn-nav" onClick={onCta}>
        Começar agora
      </button>
    </nav>
  );
}
