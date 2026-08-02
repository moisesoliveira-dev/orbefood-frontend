import { useEffect, useState } from 'react';
import './OrderCard.css';
import type { OrderView } from '../../domain/order';
import {
  advanceLabel,
  canAcceptOrder,
  canAdvanceOrder,
  canRejectOrder,
  CHANNEL_LABEL,
  elapsedSeconds,
  formatMoney,
  formatTimer,
  stationLabel,
  ticketUrgency,
} from '../../domain/order';

interface OrderCardProps {
  order: OrderView;
  busy?: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAdvance: (id: string) => void;
}

export function OrderCard({
  order,
  busy,
  onAccept,
  onReject,
  onAdvance,
}: OrderCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const seconds = elapsedSeconds(order.placedAt, now);
  const urgency = ticketUrgency(order.status, order.placedAt, now);
  const station = stationLabel(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article
      className={`comanda urgency-${urgency} status-${order.status}`}
      aria-label={`Comanda ${order.externalCode}`}
    >
      <div className="comanda__clip" aria-hidden="true">
        <span className="comanda__clip-ring" />
        <span className="comanda__clip-bar" />
      </div>

      <div className="comanda__sheet">
        <header className="comanda__head">
          <div className="comanda__station">{station}</div>
          <div className={`comanda__timer urgency-${urgency}`}>
            <span className="comanda__timer-label">TEMPO</span>
            <strong className="comanda__timer-value">{formatTimer(seconds)}</strong>
          </div>
        </header>

        <div className="comanda__code-row">
          <h3 className="comanda__code">{order.externalCode}</h3>
          <span className={`comanda__channel channel-${order.channel}`}>
            {CHANNEL_LABEL[order.channel]}
          </span>
        </div>

        <p className="comanda__customer">{order.customerName}</p>
        <p className="comanda__meta-line">
          {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
          {formatMoney(order.totalCents, order.currency)}
        </p>

        <ul className="comanda__items">
          {order.items.map((item) => (
            <li key={`${order.id}-${item.name}`}>
              <span className="comanda__qty">{item.quantity}</span>
              <div className="comanda__item-body">
                <span className="comanda__item-name">{item.name}</span>
                {item.notes ? (
                  <span className="comanda__item-note">{item.notes}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        {order.notes ? (
          <p className="comanda__alert">⚠ {order.notes}</p>
        ) : null}

        <div className="comanda__perforation" aria-hidden="true" />

        <footer className="comanda__actions">
          {canRejectOrder(order.status) ? (
            <button
              type="button"
              className="comanda-btn comanda-btn--ghost"
              disabled={busy}
              onClick={() => onReject(order.id)}
            >
              X
            </button>
          ) : null}
          {canAcceptOrder(order.status) ? (
            <button
              type="button"
              className="comanda-btn comanda-btn--fire"
              disabled={busy}
              onClick={() => onAccept(order.id)}
            >
              PEGAR!
            </button>
          ) : null}
          {canAdvanceOrder(order.status) ? (
            <button
              type="button"
              className="comanda-btn comanda-btn--fire"
              disabled={busy}
              onClick={() => onAdvance(order.id)}
            >
              {advanceLabel(order.status)}
            </button>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
