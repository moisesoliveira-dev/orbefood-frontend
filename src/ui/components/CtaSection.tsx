import { Ornament } from './Ornament';

interface CtaSectionProps {
  onPrimary: () => void;
  onSecondary: () => void;
}

export function CtaSection({ onPrimary, onSecondary }: CtaSectionProps) {
  return (
    <section className="cta-section">
      <Ornament />
      <h2 className="section-heading">
        Pronto para <em>unificar</em>
        <br />
        seus canais?
      </h2>
      <p className="section-body">
        Conecte iFood, 99Food e a cozinha em minutos. Escala sem perder qualidade.
      </p>
      <div className="cta-actions">
        <button type="button" className="btn-primary-gold" onClick={onPrimary}>
          Criar conta grátis
        </button>
        <button type="button" className="btn-outline-gold" onClick={onSecondary}>
          Falar com especialista
        </button>
      </div>
    </section>
  );
}
