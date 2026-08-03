import { Ornament } from './Ornament';

interface HeroProps {
  onPrimary: () => void;
  onSecondary: () => void;
}

export function Hero({ onPrimary, onSecondary }: HeroProps) {
  return (
    <section className="hero">
      <p className="hero-season">Operação multiplataforma · Delivery</p>

      <h1 className="hero-title">Do pedido ao</h1>
      <span className="hero-title-italic">entregador unificado</span>

      <Ornament className="hero-ornament" />

      <p className="hero-desc">
        OrbeFood conecta iFood, 99Food e a sua cozinha em um fluxo só — sem painéis
        paralelos, sem perder SLA.
      </p>

      <div className="hero-actions">
        <button type="button" className="btn-primary-gold" onClick={onPrimary}>
          Criar conta grátis
        </button>
        <button type="button" className="btn-outline-gold" onClick={onSecondary}>
          Ver demonstração
        </button>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>Descer</span>
      </div>
    </section>
  );
}
