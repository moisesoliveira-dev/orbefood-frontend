import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { prefersSidebarNavigation } from '../../adapters/platform/runtime';
import { createHttpCatalogApi } from '../../adapters/api/catalog.api';
import { createCatalogFacade } from '../../application/catalog.facade';
import type {
  CadastroTab,
  CustomerView,
  ProductView,
  RestaurantView,
} from '../../domain/catalog';
import {
  CADASTRO_TABS,
  cadastroPathFromTab,
  cadastroTabFromPath,
} from '../../domain/catalog';
import { formatMoney } from '../../domain/order';
import './CadastroPage.css';

const facade = createCatalogFacade(createHttpCatalogApi());

const SECTION_COPY: Record<
  CadastroTab,
  { title: string; accent: string; lead: string; toolbar: string }
> = {
  restaurants: {
    toolbar: 'Restaurante',
    title: 'Cadastro de',
    accent: 'restaurante',
    lead: 'Cadastre a loja que vai receber as comandas.',
  },
  customers: {
    toolbar: 'Clientes',
    title: 'Cadastro de',
    accent: 'clientes',
    lead: 'Clientes usados nos pedidos manuais da cozinha.',
  },
  products: {
    toolbar: 'Produtos',
    title: 'Cadastro de',
    accent: 'produtos',
    lead: 'Cardápio por restaurante para montar o pedido.',
  },
};

const CadastroPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const showInlineTabs = !prefersSidebarNavigation();
  const tab = cadastroTabFromPath(location.pathname);

  const [restaurants, setRestaurants] = useState<RestaurantView[]>([]);
  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [products, setProducts] = useState<ProductView[]>([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [restaurantName, setRestaurantName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const loadRestaurants = async () => {
    const result = await facade.listRestaurants();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRestaurants(result.value);
    if (!restaurantId && result.value[0]) {
      setRestaurantId(result.value[0].id);
    }
  };

  const loadCustomers = async () => {
    const result = await facade.listCustomers();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCustomers(result.value);
  };

  const loadProducts = async (id: string) => {
    if (!id) {
      setProducts([]);
      return;
    }
    const result = await facade.listProducts(id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setProducts(result.value);
  };

  useEffect(() => {
    void loadRestaurants();
    void loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearFlash();
    if (tab === 'products') {
      void loadProducts(restaurantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, restaurantId]);

  const clearFlash = () => {
    setError(null);
    setOkMsg(null);
  };

  const goToTab = (next: CadastroTab) => {
    clearFlash();
    history.push(cadastroPathFromTab(next));
  };

  const submitRestaurant = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFlash();
    setBusy(true);
    const result = await facade.createRestaurant(restaurantName);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRestaurantName('');
    setOkMsg(`Restaurante “${result.value.name}” cadastrado`);
    await loadRestaurants();
    setRestaurantId(result.value.id);
  };

  const submitCustomer = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFlash();
    setBusy(true);
    const result = await facade.createCustomer({
      name: customerName,
      phone: customerPhone,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCustomerName('');
    setCustomerPhone('');
    setOkMsg(`Cliente “${result.value.name}” cadastrado`);
    await loadCustomers();
  };

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFlash();
    setBusy(true);
    const result = await facade.createProduct({
      restaurantId,
      name: productName,
      priceReais: productPrice,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setProductName('');
    setProductPrice('');
    setOkMsg(`Produto “${result.value.name}” cadastrado`);
    await loadProducts(restaurantId);
  };

  const copy = SECTION_COPY[tab];

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>{copy.toolbar}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY className="cadastro-page">
        <div className="cadastro-board">
          <header className="cadastro-hud">
            <p className="cadastro-hud__eyebrow">Cadastro</p>
            <h1 className="cadastro-hud__title">
              {copy.title} <em>{copy.accent}</em>
            </h1>
            <p className="cadastro-hud__lead">{copy.lead}</p>
          </header>

          {showInlineTabs ? (
            <div className="cadastro-tabs" role="tablist" aria-label="Cadastros">
              {CADASTRO_TABS.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`cadastro-tab${active ? ' is-active' : ''}`}
                    onClick={() => goToTab(item.id)}
                  >
                    <span className="cadastro-tab__label">{item.label}</span>
                    <span className="cadastro-tab__hint">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <section className="cadastro-panel" role="tabpanel">
            {error ? (
              <p className="cadastro-msg cadastro-msg--error">{error}</p>
            ) : null}
            {okMsg ? (
              <p className="cadastro-msg cadastro-msg--ok">{okMsg}</p>
            ) : null}

            {tab === 'restaurants' ? (
              <>
                <form className="cadastro-form" onSubmit={submitRestaurant}>
                  <div className="cadastro-field">
                    <label htmlFor="restaurant-name">Nome do restaurante</label>
                    <input
                      id="restaurant-name"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="Ex.: OrbeFood Centro"
                      autoComplete="organization"
                    />
                  </div>
                  <div className="cadastro-actions">
                    <button
                      type="submit"
                      className="cadastro-btn cadastro-btn--primary"
                      disabled={busy}
                    >
                      Cadastrar restaurante
                    </button>
                  </div>
                </form>
                {restaurants.length === 0 ? (
                  <p className="cadastro-empty">Nenhum restaurante ainda.</p>
                ) : (
                  <ul className="cadastro-list">
                    {restaurants.map((item) => (
                      <li key={item.id} className="cadastro-list__item">
                        <div>
                          <p className="cadastro-list__title">{item.name}</p>
                          <p className="cadastro-list__meta">/{item.slug}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : null}

            {tab === 'customers' ? (
              <>
                <form className="cadastro-form" onSubmit={submitCustomer}>
                  <div className="cadastro-form__row">
                    <div className="cadastro-field">
                      <label htmlFor="customer-name">Nome</label>
                      <input
                        id="customer-name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nome do cliente"
                        autoComplete="name"
                      />
                    </div>
                    <div className="cadastro-field">
                      <label htmlFor="customer-phone">Telefone</label>
                      <input
                        id="customer-phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Opcional"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div className="cadastro-actions">
                    <button
                      type="submit"
                      className="cadastro-btn cadastro-btn--primary"
                      disabled={busy}
                    >
                      Cadastrar cliente
                    </button>
                  </div>
                </form>
                {customers.length === 0 ? (
                  <p className="cadastro-empty">Nenhum cliente ainda.</p>
                ) : (
                  <ul className="cadastro-list">
                    {customers.map((item) => (
                      <li key={item.id} className="cadastro-list__item">
                        <div>
                          <p className="cadastro-list__title">{item.name}</p>
                          <p className="cadastro-list__meta">
                            {item.phone || 'Sem telefone'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : null}

            {tab === 'products' ? (
              <>
                <form className="cadastro-form" onSubmit={submitProduct}>
                  <div className="cadastro-field">
                    <label htmlFor="product-restaurant">Restaurante</label>
                    <select
                      id="product-restaurant"
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
                  <div className="cadastro-form__row">
                    <div className="cadastro-field">
                      <label htmlFor="product-name">Produto</label>
                      <input
                        id="product-name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Ex.: Smash Burger"
                      />
                    </div>
                    <div className="cadastro-field">
                      <label htmlFor="product-price">Preço (R$)</label>
                      <input
                        id="product-price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="32,90"
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                  <div className="cadastro-actions">
                    <button
                      type="submit"
                      className="cadastro-btn cadastro-btn--primary"
                      disabled={busy}
                    >
                      Cadastrar produto
                    </button>
                  </div>
                </form>
                {products.length === 0 ? (
                  <p className="cadastro-empty">
                    Nenhum produto para este restaurante.
                  </p>
                ) : (
                  <ul className="cadastro-list">
                    {products.map((item) => (
                      <li key={item.id} className="cadastro-list__item">
                        <div>
                          <p className="cadastro-list__title">{item.name}</p>
                          <p className="cadastro-list__meta">
                            {formatMoney(item.unitPriceCents, item.currency)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : null}
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CadastroPage;
