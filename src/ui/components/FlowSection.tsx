import { flowSteps } from '../../domain/landing-content';

export function FlowSection() {
  return (
    <section id="fluxo" className="flow-section">
      <div className="section" style={{ paddingBottom: 0 }}>
        <p className="section-label">Fluxo</p>
        <h2 className="section-title">Como a jornada funciona</h2>
        <p className="section-sub" style={{ marginBottom: 48 }}>
          Do clique no app até a entrega, tudo orquestrado.
        </p>
      </div>

      <div className="flow-steps">
        {flowSteps.map((step) => (
          <div className="flow-step" key={step.num}>
            <p className="step-num">{step.num}</p>
            <span className="step-icon">{step.icon}</span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
