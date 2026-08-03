import { useEffect, useState } from 'react';
import { createHttpCatalogApi } from '../../adapters/api/catalog.api';
import { createCatalogFacade } from '../../application/catalog.facade';
import type {
  CustomerView,
  ProductView,
  RestaurantView,
} from '../../domain/catalog';
import type { DeliveryChannel, OrderView } from '../../domain/order';
import { CHANNEL_LABEL, formatMoney } from '../../domain/order';
import './CreateManualOrderModal.css';

const facade = createCatalogFacade(createHttpCatalogApi());

interface LineItem {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

interface CreateManualOrderModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (order: OrderView) => void;
}

export function CreateManualOrderModal({
  open,
  onClose,
  onCreated,
}: CreateManualOrderModalProps) {
  const [restaurants, setRestaurants] = useState<RestaurantView[]>([]);
  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [products, setProducts] = useState<ProductView[]>([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [channel, setChannel] = useState<DeliveryChannel>('own');
  const [notes, setNotes] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<LineItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      const [r, c] = await Promise.all([
        facade.listRestaurants(),
        facade.listCustomers(),
      ]);
      if (!alive) return;
      if (!r.ok) {
        setError(r.error);
        return;
      }
      if (!c.ok) {
        setError(c.error);
        return;
      }
      setRestaurants(r.value);
      setCustomers(c.value);
      const first = r.value[0]?.id ?? '';
      setRestaurantId(first);
      setCustomerId(c.value[0]?.id ?? '');
      setChannel('own');
      setNotes('');
      setItems([]);
      setProductId('');
      setQuantity(1);
      setError(null);
    })();
    return () => {
      alive = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !restaurantId) {
      setProducts([]);
      return;
    }
    let alive = true;
    (async () => {
      const result = await facade.listProducts(restaurantId);
      if (!alive) return;
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setProducts(result.value);
      setProductId(result.value[0]?.id ?? '');
    })();
    return () => {
      alive = false;
    };
  }, [open, restaurantId]);

  if (!open) return null;

  const addItem = () => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setError('Selecione um produto');
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError('Quantidade inválida');
      return;
    }
    setError(null);
    setItems((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          unitPriceCents: product.unitPriceCents,
          quantity,
        },
      ];
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = await facade.createOrder({
      restaurantId,
      customerId,
      channel,
      notes: notes.trim() || undefined,
      items: items.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
      })),
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onCreated(result.value);
    onClose();
  };

  return (
    <div className="manual-order" role="dialog" aria-modal="true">
      <button
        type="button"
        className="manual-order__backdrop"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="manual-order__panel">
        <h2 className="manual-order__title">Novo pedido manual</h2>
        <p className="manual-order__lead">
          Use clientes e produtos já cadastrados para lançar uma comanda.
        </p>

        <form className="manual-order__form" onSubmit={submit}>
          <div className="manual-order__row">
            <div className="manual-order__field">
              <label htmlFor="manual-restaurant">Restaurante</label>
              <select
                id="manual-restaurant"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
              >
                <option value="">Selecione…</option>
                {restaurants.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="manual-order__field">
              <label htmlFor="manual-customer">Cliente</label>
              <select
                id="manual-customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Selecione…</option>
                {customers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="manual-order__field">
            <label htmlFor="manual-channel">Canal</label>
            <select
              id="manual-channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as DeliveryChannel)}
            >
              {(Object.keys(CHANNEL_LABEL) as DeliveryChannel[]).map((key) => (
                <option key={key} value={key}>
                  {CHANNEL_LABEL[key]}
                </option>
              ))}
            </select>
          </div>

          <div className="manual-order__field">
            <label>Itens</label>
            <div className="manual-order__add">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Produto…</option>
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {formatMoney(item.unitPriceCents)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                aria-label="Quantidade"
              />
              <button
                type="button"
                className="manual-order__btn manual-order__btn--ghost"
                onClick={addItem}
              >
                Add
              </button>
            </div>
          </div>

          <div className="manual-order__items">
            {items.map((line) => (
              <div key={line.productId} className="manual-order__item">
                <div>
                  <p>{line.name}</p>
                  <span>{formatMoney(line.unitPriceCents)}</span>
                </div>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setItems((current) =>
                      current.map((item) =>
                        item.productId === line.productId
                          ? { ...item, quantity: next }
                          : item,
                      ),
                    );
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setItems((current) =>
                      current.filter((item) => item.productId !== line.productId),
                    )
                  }
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="manual-order__field">
            <label htmlFor="manual-notes">Observações</label>
            <textarea
              id="manual-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          {error ? <p className="manual-order__error">{error}</p> : null}

          <div className="manual-order__actions">
            <button
              type="button"
              className="manual-order__btn manual-order__btn--ghost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="manual-order__btn manual-order__btn--primary"
              disabled={busy}
            >
              Cadastrar pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
