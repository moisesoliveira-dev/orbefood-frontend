import type { OrdersApi } from '../adapters/api/orders.api';
import type { OrderView } from '../domain/order';

export type OrdersResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function ok<T>(value: T): OrdersResult<T> {
  return { ok: true, value };
}

function err<T>(error: unknown): OrdersResult<T> {
  return {
    ok: false,
    error: error instanceof Error ? error.message : 'Erro inesperado',
  };
}

export function createOrdersFacade(api: OrdersApi) {
  return {
    async listOrders(): Promise<OrdersResult<OrderView[]>> {
      try {
        return ok(await api.list());
      } catch (error) {
        return err(error);
      }
    },

    async acceptOrder(orderId: string): Promise<OrdersResult<OrderView>> {
      try {
        return ok(await api.accept(orderId));
      } catch (error) {
        return err(error);
      }
    },

    async rejectOrder(orderId: string): Promise<OrdersResult<OrderView>> {
      try {
        return ok(await api.reject(orderId));
      } catch (error) {
        return err(error);
      }
    },

    async advanceOrder(orderId: string): Promise<OrdersResult<OrderView>> {
      try {
        return ok(await api.advance(orderId));
      } catch (error) {
        return err(error);
      }
    },
  };
}

export type OrdersFacade = ReturnType<typeof createOrdersFacade>;
