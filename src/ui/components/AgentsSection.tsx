import { agents } from '../../domain/landing-content';

export function AgentsSection() {
  return (
    <section id="plataformas">
      <div className="section section--tight-bottom">
        <p className="section-eyebrow">Os dois pilares</p>
        <h2 className="section-heading">
          Cada canal tem <em>seu papel</em>
        </h2>
      </div>

      <div className="agents-layout">
        {agents.map((agent) => (
          <article className="agent-panel" key={agent.name}>
            <p className="agent-number">{agent.role}</p>
            <div className="agent-icon-line">
              <span className="agent-glyph">{agent.icon}</span>
              <div className="agent-glyph-line" />
            </div>
            <h3 className="agent-title">{agent.name}</h3>
            <p className="agent-subtitle">
              {agent.variant === 'a' ? 'Canais de marketplace' : 'Operação da loja'}
            </p>
            <p className="agent-desc">{agent.description}</p>
            <ul className="agent-menu">
              {agent.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
