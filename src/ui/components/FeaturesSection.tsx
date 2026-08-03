import { features } from '../../domain/landing-content';

export function FeaturesSection() {
  return (
    <>
      <section id="recursos" className="section section--tight-bottom">
        <p className="section-eyebrow">Cozinha interna</p>
        <h2 className="section-heading">
          O que está <em>nos bastidores</em>
        </h2>
        <p className="section-body">
          Hexagonal por design: novos marketplaces e bancos entram como adapters.
        </p>
      </section>

      <div className="features-wrap">
        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-cell" key={feature.title}>
              <span className="feature-glyph">{feature.icon}</span>
              <h3 className="feature-name">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
