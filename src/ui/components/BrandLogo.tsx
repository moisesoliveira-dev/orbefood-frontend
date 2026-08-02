import { brandName } from '../../domain/landing-content';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'nav-logo' }: BrandLogoProps) {
  return (
    <div className={className}>
      <div className="logo-dots" aria-hidden="true">
        <span />
        <span />
      </div>
      {brandName}
    </div>
  );
}
