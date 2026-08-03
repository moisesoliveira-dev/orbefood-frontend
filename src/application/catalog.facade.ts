import type { CatalogApi, CreateOrderPayload } from '../adapters/api/catalog.api';
import type {
  CustomerView,
  ProductView,
  RestaurantView,
} from '../domain/catalog';
import { reaisToCents, validateRequiredName } from '../domain/catalog';
import type { OrderView } from '../domain/order';

export type CatalogResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function ok<T>(value: T): CatalogResult<T> {
  return { ok: true, value };
}

function err<T>(error: unknown): CatalogResult<T> {
  return {
    ok: false,
    error: error instanceof Error ? error.message : 'Erro inesperado',
  };
}

export function createCatalogFacade(api: CatalogApi) {
  return {
    async listRestaurants(): Promise<CatalogResult<RestaurantView[]>> {
      try {
        return ok(await api.listRestaurants());
      } catch (error) {
        return err(error);
      }
    },

    async createRestaurant(name: string): Promise<CatalogResult<RestaurantView>> {
      const validation = validateRequiredName(name);
      if (validation) return err(new Error(validation));
      try {
        return ok(await api.createRestaurant({ name: name.trim() }));
      } catch (error) {
        return err(error);
      }
    },

    async listCustomers(query?: string): Promise<CatalogResult<CustomerView[]>> {
      try {
        return ok(await api.listCustomers(query));
      } catch (error) {
        return err(error);
      }
    },

    async createCustomer(input: {
      name: string;
      phone?: string;
    }): Promise<CatalogResult<CustomerView>> {
      const validation = validateRequiredName(input.name);
      if (validation) return err(new Error(validation));
      try {
        return ok(
          await api.createCustomer({
            name: input.name.trim(),
            phone: input.phone?.trim() || undefined,
          }),
        );
      } catch (error) {
        return err(error);
      }
    },

    async listProducts(
      restaurantId: string,
    ): Promise<CatalogResult<ProductView[]>> {
      if (!restaurantId) {
        return err(new Error('Selecione um restaurante'));
      }
      try {
        return ok(await api.listProducts(restaurantId));
      } catch (error) {
        return err(error);
      }
    },

    async createProduct(input: {
      restaurantId: string;
      name: string;
      priceReais: string;
    }): Promise<CatalogResult<ProductView>> {
      const validation = validateRequiredName(input.name);
      if (validation) return err(new Error(validation));
      if (!input.restaurantId) {
        return err(new Error('Selecione um restaurante'));
      }
      const cents = reaisToCents(input.priceReais);
      if (cents === null) {
        return err(new Error('Preço inválido'));
      }
      try {
        return ok(
          await api.createProduct({
            restaurantId: input.restaurantId,
            name: input.name.trim(),
            unitPriceCents: cents,
          }),
        );
      } catch (error) {
        return err(error);
      }
    },

    async createOrder(
      input: CreateOrderPayload,
    ): Promise<CatalogResult<OrderView>> {
      if (!input.restaurantId) {
        return err(new Error('Selecione um restaurante'));
      }
      if (!input.customerId) {
        return err(new Error('Selecione um cliente'));
      }
      if (!input.items.length) {
        return err(new Error('Adicione ao menos um item'));
      }
      try {
        return ok(await api.createOrder(input));
      } catch (error) {
        return err(error);
      }
    },
  };
}

export type CatalogFacade = ReturnType<typeof createCatalogFacade>;
