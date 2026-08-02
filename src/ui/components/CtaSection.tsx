interface CtaSectionProps {
  onPrimary: () => void;
  onSecondary: () => void;
}

export function CtaSection({ onPrimary, onSecondary }: CtaSectionProps) {
  return (
    <section className="cta-section">
      <p className="section-label">Comece hoje</p>
      <h2 className="section-title">Pronto para unificar seus canais de delivery?</h2>
      <p className="section-sub">
        Conecte iFood, 99Food e a cozinha em minutos. Escala sem perder qualidade.
      </p>
      <div className="cta-actions">
        <button type="button" className="btn-primary" onClick={onPrimary}>
          <span>Criar conta grátis</span>
          <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="btn-ghost" onClick={onSecondary}>
          Falar com especialista
        </button>
      </div>
    </section>
  );
}
