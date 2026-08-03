import { brandName } from '../../domain/landing-content';

interface BrandLogoProps {
  className?: string;
}

/** Logo tipográfico estilo Maison — Playfair + itálico dourado. */
export function BrandLogo({ className = 'nav-logo' }: BrandLogoProps) {
  const split = brandName.length > 4 ? 4 : Math.max(1, brandName.length - 1);
  const head = brandName.slice(0, split);
  const tail = brandName.slice(split);

  return (
    <div className={className}>
      {head}
      <span>{tail}</span>
    </div>
  );
}
