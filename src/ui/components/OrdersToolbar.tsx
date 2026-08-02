import './OrdersToolbar.css';
import type { ChannelFilter } from '../../domain/order';
import { CHANNEL_LABEL } from '../../domain/order';

const CHANNELS: { id: ChannelFilter; label: string }[] = [
  { id: 'all', label: 'Todos os canais' },
  { id: 'ifood', label: CHANNEL_LABEL.ifood },
  { id: '99food', label: CHANNEL_LABEL['99food'] },
  { id: 'own', label: CHANNEL_LABEL.own },
];

interface OrdersToolbarProps {
  search: string;
  channel: ChannelFilter;
  onSearchChange: (value: string) => void;
  onChannelChange: (value: ChannelFilter) => void;
}

export function OrdersToolbar({
  search,
  channel,
  onSearchChange,
  onChannelChange,
}: OrdersToolbarProps) {
  return (
    <div className="orders-toolbar">
      <label className="orders-toolbar__search">
        <span className="orders-toolbar__label">Buscar</span>
        <input
          type="search"
          value={search}
          placeholder="Código, cliente, item, telefone…"
          onChange={(event) => onSearchChange(event.target.value)}
          enterKeyHint="search"
          autoComplete="off"
        />
      </label>

      <label className="orders-toolbar__channel">
        <span className="orders-toolbar__label">Canal</span>
        <select
          value={channel}
          onChange={(event) =>
            onChannelChange(event.target.value as ChannelFilter)
          }
        >
          {CHANNELS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
