import './OrderCard.css';
import type { OrderView } from '../../domain/order';
import {
  advanceLabel,
  canAcceptOrder,
  canAdvanceOrder,
  canRejectOrder,
  CHANNEL_LABEL,
  formatMoney,
  formatPlacedAt,
  ORDER_STATUS_LABEL,
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
  return (
    <article className={`order-card status-${order.status}`}>
      <header className="order-card__header">
        <div>
          <p className="order-card__code">{order.externalCode}</p>
          <h3 className="order-card__customer">{order.customerName}</h3>
        </div>
        <div className="order-card__meta">
          <span className={`order-card__channel channel-${order.channel}`}>
            {CHANNEL_LABEL[order.channel]}
          </span>
          <span className="order-card__status">
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>
      </header>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <li key={`${order.id}-${item.name}`}>
            <span>
              {item.quantity}× {item.name}
            </span>
            <span>{formatMoney(item.unitPriceCents * item.quantity)}</span>
          </li>
        ))}
      </ul>

      {order.notes ? <p className="order-card__notes">{order.notes}</p> : null}

      <footer className="order-card__footer">
        <div className="order-card__totals">
          <strong>{formatMoney(order.totalCents, order.currency)}</strong>
          <span>{formatPlacedAt(order.placedAt)}</span>
        </div>

        <div className="order-card__actions">
          {canRejectOrder(order.status) ? (
            <button
              type="button"
              className="btn-ghost order-btn"
              disabled={busy}
              onClick={() => onReject(order.id)}
            >
              Recusar
            </button>
          ) : null}
          {canAcceptOrder(order.status) ? (
            <button
              type="button"
              className="btn-primary order-btn"
              disabled={busy}
              onClick={() => onAccept(order.id)}
            >
              Aceitar
            </button>
          ) : null}
          {canAdvanceOrder(order.status) ? (
            <button
              type="button"
              className="btn-primary order-btn"
              disabled={busy}
              onClick={() => onAdvance(order.id)}
            >
              {advanceLabel(order.status)}
            </button>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
