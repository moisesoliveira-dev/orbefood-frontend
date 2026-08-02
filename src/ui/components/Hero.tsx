import { DualOrbs } from './DualOrbs';

interface HeroProps {
  onPrimary: () => void;
  onSecondary: () => void;
}

export function Hero({ onPrimary, onSecondary }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="badge-dot" />
        Pedidos unificados em todos os canais
      </div>

      <DualOrbs />

      <p className="hero-eyebrow">Operação multiplataforma de delivery</p>

      <h1 className="hero-title">
        Do pedido ao entregador
        <br />
        em <em>todas as plataformas</em>
      </h1>

      <p className="hero-sub">
        OrbeFood conecta iFood, 99Food e a sua cozinha em um fluxo só — sem painéis
        paralelos, sem perder SLA.
      </p>

      <div className="hero-actions">
        <button type="button" className="btn-primary" onClick={onPrimary}>
          <span>Criar conta grátis</span>
          <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="btn-ghost" onClick={onSecondary}>
          Ver demonstração
        </button>
      </div>

      <p className="hero-footnote">Sem cartão de crédito · Configuração em minutos</p>
    </section>
  );
}
