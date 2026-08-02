import type { DeliveryChannel, OrderStatus, OrderView } from '../../domain/order';

export interface OrdersApi {
  list(params?: {
    status?: OrderStatus;
    channel?: DeliveryChannel;
  }): Promise<OrderView[]>;
  accept(orderId: string): Promise<OrderView>;
  reject(orderId: string): Promise<OrderView>;
  advance(orderId: string): Promise<OrderView>;
}

function resolveApiBase(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (env) {
    return env.replace(/\/$/, '');
  }
  // Web (Vite proxy / nginx) e app Capacitor em produção via mesmo host relativo.
  // Em device nativo apontando para máquina local, definir VITE_API_URL.
  return '/api';
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function createHttpOrdersApi(baseUrl = resolveApiBase()): OrdersApi {
  return {
    async list(params) {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.channel) query.set('channel', params.channel);
      const suffix = query.toString() ? `?${query}` : '';
      const response = await fetch(`${baseUrl}/orders${suffix}`);
      return parseJson<OrderView[]>(response);
    },

    async accept(orderId) {
      const response = await fetch(`${baseUrl}/orders/${orderId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return parseJson<OrderView>(response);
    },

    async reject(orderId) {
      const response = await fetch(`${baseUrl}/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      return parseJson<OrderView>(response);
    },

    async advance(orderId) {
      const response = await fetch(`${baseUrl}/orders/${orderId}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return parseJson<OrderView>(response);
    },
  };
}
