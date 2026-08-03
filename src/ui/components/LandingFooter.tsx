import { BrandLogo } from './BrandLogo';
import { brandName } from '../../domain/landing-content';

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <BrandLogo className="footer-logo" />
      <p className="footer-copy">
        © {year} {brandName}. Todos os direitos reservados.
      </p>
      <ul className="footer-links">
        <li>
          <a href="#privacidade">Privacidade</a>
        </li>
        <li>
          <a href="#termos">Termos</a>
        </li>
        <li>
          <a href="#contato">Contato</a>
        </li>
      </ul>
    </footer>
  );
}
