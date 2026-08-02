import './OrdersFilterBar.css';
import type { OrdersFilterTab } from '../../domain/order';
import { countByTab } from '../../domain/order';
import type { OrderView } from '../../domain/order';

const TABS: { id: OrdersFilterTab; label: string; hint: string }[] = [
  { id: 'pending', label: 'ENTRADA', hint: 'Novos' },
  { id: 'kitchen', label: 'FOGÃO', hint: 'Preparo' },
  { id: 'ready', label: 'PASS', hint: 'Prontos' },
  { id: 'all', label: 'TODAS', hint: 'Comandas' },
  { id: 'done', label: 'ARQUIVO', hint: 'Fim' },
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
    <div className="kitchen-stations" role="tablist" aria-label="Estações da cozinha">
      {TABS.map((tab) => {
        const count = countByTab(orders, tab.id);
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`kitchen-station${isActive ? ' is-active' : ''}${count > 0 && tab.id === 'pending' ? ' has-heat' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span className="kitchen-station__label">{tab.label}</span>
            <span className="kitchen-station__hint">{tab.hint}</span>
            <span className="kitchen-station__count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
