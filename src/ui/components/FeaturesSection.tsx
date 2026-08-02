import { features } from '../../domain/landing-content';

export function FeaturesSection() {
  return (
    <section id="recursos" className="section">
      <p className="section-label">Recursos</p>
      <h2 className="section-title">
        Construído para
        <br />
        operar de verdade
      </h2>
      <p className="section-sub" style={{ marginBottom: 48 }}>
        Hexagonal por design: novos marketplaces e bancos entram como adapters.
      </p>

      <div className="features-grid">
        {features.map((feature) => (
          <article className="feature-item" key={feature.title}>
            <span className="feature-icon">{feature.icon}</span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
