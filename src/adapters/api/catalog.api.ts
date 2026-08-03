import type {
  CustomerView,
  ProductView,
  RestaurantView,
} from '../../domain/catalog';
import type { DeliveryChannel, OrderView } from '../../domain/order';

export interface CreateOrderPayload {
  restaurantId: string;
  customerId: string;
  channel?: DeliveryChannel;
  externalCode?: string;
  notes?: string;
  items: Array<{
    productId?: string;
    name?: string;
    quantity: number;
    unitPriceCents?: number;
    notes?: string;
  }>;
}

export interface CatalogApi {
  listRestaurants(): Promise<RestaurantView[]>;
  createRestaurant(input: { name: string }): Promise<RestaurantView>;
  listCustomers(query?: string): Promise<CustomerView[]>;
  createCustomer(input: {
    name: string;
    phone?: string;
  }): Promise<CustomerView>;
  listProducts(restaurantId: string): Promise<ProductView[]>;
  createProduct(input: {
    restaurantId: string;
    name: string;
    unitPriceCents: number;
  }): Promise<ProductView>;
  createOrder(input: CreateOrderPayload): Promise<OrderView>;
}

function resolveApiBase(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (env) {
    return env.replace(/\/$/, '');
  }
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

function mapEntityDates<T extends { createdAt: string | Date; updatedAt: string | Date }>(
  row: T,
): T & { createdAt: string; updatedAt: string } {
  return {
    ...row,
    createdAt:
      typeof row.createdAt === 'string'
        ? row.createdAt
        : new Date(row.createdAt).toISOString(),
    updatedAt:
      typeof row.updatedAt === 'string'
        ? row.updatedAt
        : new Date(row.updatedAt).toISOString(),
  };
}

export function createHttpCatalogApi(baseUrl = resolveApiBase()): CatalogApi {
  return {
    async listRestaurants() {
      const response = await fetch(`${baseUrl}/restaurants`);
      const rows = await parseJson<RestaurantView[]>(response);
      return rows.map(mapEntityDates);
    },

    async createRestaurant(input) {
      const response = await fetch(`${baseUrl}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return mapEntityDates(await parseJson<RestaurantView>(response));
    },

    async listCustomers(query) {
      const params = new URLSearchParams();
      if (query?.trim()) params.set('q', query.trim());
      const suffix = params.toString() ? `?${params}` : '';
      const response = await fetch(`${baseUrl}/customers${suffix}`);
      const rows = await parseJson<CustomerView[]>(response);
      return rows.map(mapEntityDates);
    },

    async createCustomer(input) {
      const response = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return mapEntityDates(await parseJson<CustomerView>(response));
    },

    async listProducts(restaurantId) {
      const params = new URLSearchParams({ restaurantId });
      const response = await fetch(`${baseUrl}/products?${params}`);
      const rows = await parseJson<ProductView[]>(response);
      return rows.map(mapEntityDates);
    },

    async createProduct(input) {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return mapEntityDates(await parseJson<ProductView>(response));
    },

    async createOrder(input) {
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return parseJson<OrderView>(response);
    },
  };
}
