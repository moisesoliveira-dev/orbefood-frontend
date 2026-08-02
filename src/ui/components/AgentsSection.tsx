import type { AgentCardData } from '../../domain/landing-content';
import { agents } from '../../domain/landing-content';

function AgentCard({ agent }: { agent: AgentCardData }) {
  return (
    <article className={`agent-card card-${agent.variant}`}>
      <div className={`agent-orb ${agent.orbClass}`}>{agent.icon}</div>
      <p className="agent-role">{agent.role}</p>
      <h3 className="agent-name">{agent.name}</h3>
      <p className="agent-desc">{agent.description}</p>
      <div className="agent-tags">
        {agent.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export function AgentsSection() {
  return (
    <section id="plataformas" className="section">
      <p className="section-label">Os dois pilares</p>
      <h2 className="section-title">
        Cada canal tem
        <br />
        seu papel
      </h2>
      <p className="section-sub">
        Marketplaces e operação conectados. Cada um otimizado para a sua etapa — sem
        dispersão, sem retrabalho.
      </p>

      <div className="agents-grid">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </section>
  );
}
