export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'dispatched'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export type DeliveryChannel = 'ifood' | '99food' | 'own';

export interface OrderItemView {
  name: string;
  quantity: number;
  unitPriceCents: number;
  currency: string;
  notes?: string;
}

export interface OrderView {
  id: string;
  restaurantId: string;
  channel: DeliveryChannel;
  externalCode: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItemView[];
  status: OrderStatus;
  totalCents: number;
  currency: string;
  placedAt: string;
  notes?: string;
  updatedAt: string;
}

export type OrdersFilterTab = 'all' | 'pending' | 'kitchen' | 'ready' | 'done';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Novo',
  accepted: 'Aceito',
  preparing: 'Preparando',
  ready: 'Pronto',
  dispatched: 'Saiu',
  delivered: 'Entregue',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
};

export const CHANNEL_LABEL: Record<DeliveryChannel, string> = {
  ifood: 'iFood',
  '99food': '99Food',
  own: 'Próprio',
};

export function formatMoney(cents: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function formatPlacedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function filterOrdersByTab(
  orders: OrderView[],
  tab: OrdersFilterTab,
): OrderView[] {
  switch (tab) {
    case 'pending':
      return orders.filter((o) => o.status === 'pending');
    case 'kitchen':
      return orders.filter(
        (o) => o.status === 'accepted' || o.status === 'preparing',
      );
    case 'ready':
      return orders.filter(
        (o) => o.status === 'ready' || o.status === 'dispatched',
      );
    case 'done':
      return orders.filter(
        (o) =>
          o.status === 'delivered' ||
          o.status === 'rejected' ||
          o.status === 'cancelled',
      );
    default:
      return orders;
  }
}

export function canAcceptOrder(status: OrderStatus): boolean {
  return status === 'pending';
}

export function canRejectOrder(status: OrderStatus): boolean {
  return status === 'pending' || status === 'accepted';
}

export function canAdvanceOrder(status: OrderStatus): boolean {
  return (
    status === 'accepted' ||
    status === 'preparing' ||
    status === 'ready' ||
    status === 'dispatched'
  );
}

export function advanceLabel(status: OrderStatus): string {
  switch (status) {
    case 'accepted':
      return 'Iniciar preparo';
    case 'preparing':
      return 'Marcar pronto';
    case 'ready':
      return 'Despachar';
    case 'dispatched':
      return 'Marcar entregue';
    default:
      return 'Avançar';
  }
}

export function countByTab(
  orders: OrderView[],
  tab: OrdersFilterTab,
): number {
  return filterOrdersByTab(orders, tab).length;
}
