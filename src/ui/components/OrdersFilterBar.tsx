import './OrdersFilterBar.css';
import type { OrdersFilterTab } from '../../domain/order';
import { countByTab } from '../../domain/order';
import type { OrderView } from '../../domain/order';

const TABS: { id: OrdersFilterTab; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Novos' },
  { id: 'kitchen', label: 'Cozinha' },
  { id: 'ready', label: 'Pronto' },
  { id: 'done', label: 'Finalizados' },
];

interface OrdersFilterBarProps {
  orders: OrderView[];
  active: OrdersFilterTab;
  onChange: (tab: OrdersFilterTab) => void;
}

export function OrdersFilterBar({
  orders,
  active,
  onChange,
}: OrdersFilterBarProps) {
  return (
    <div className="orders-filter" role="tablist" aria-label="Filtrar pedidos">
      {TABS.map((tab) => {
        const count = countByTab(orders, tab.id);
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`orders-filter__tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="orders-filter__count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
