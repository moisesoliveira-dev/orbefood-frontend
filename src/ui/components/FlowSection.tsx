import { flowSteps } from '../../domain/landing-content';

export function FlowSection() {
  return (
    <section id="fluxo" className="flow-bg">
      <div className="flow-header">
        <p className="section-eyebrow">Mise en place</p>
        <h2 className="section-heading section-heading--center">
          A jornada <em>completa</em>
        </h2>
        <p className="flow-lead">
          Do clique no app até a entrega — quatro momentos, zero atrito.
        </p>
      </div>

      <div className="flow-steps">
        {flowSteps.map((step) => (
          <div className="flow-step" key={step.num}>
            <span className="step-counter">{step.num}</span>
            <span className="step-glyph">{step.icon}</span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
