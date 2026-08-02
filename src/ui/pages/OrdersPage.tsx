import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react';
import { createHttpOrdersApi } from '../../adapters/api/orders.api';
import { createOrdersFacade } from '../../application/orders.facade';
import type { OrderView, OrdersFilterTab } from '../../domain/order';
import { filterOrdersByTab } from '../../domain/order';
import { OrderCard } from '../components/OrderCard';
import { OrdersFilterBar } from '../components/OrdersFilterBar';
import './OrdersPage.css';

const facade = createOrdersFacade(createHttpOrdersApi());

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [tab, setTab] = useState<OrdersFilterTab>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const result = await facade.listOrders();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setOrders(result.value);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      await load();
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load inicial
  }, []);

  const refresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await load();
    event.detail.complete();
  };

  const replaceOrder = (updated: OrderView) => {
    setOrders((current) =>
      current.map((order) => (order.id === updated.id ? updated : order)),
    );
  };

  const runAction = async (
    orderId: string,
    action: (
      id: string,
    ) => Promise<
      { ok: true; value: OrderView } | { ok: false; error: string }
    >,
  ) => {
    setBusyId(orderId);
    const result = await action(orderId);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    replaceOrder(result.value);
  };

  const visible = filterOrdersByTab(orders, tab);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Pedidos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="orders-page">
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="orders-page__inner">
          <header className="orders-page__hero">
            <p className="orders-page__eyebrow">Operação do restaurante</p>
            <h1 className="orders-page__title">Pedidos ao vivo</h1>
            <p className="orders-page__sub">
              Aceite, prepare e despache pedidos de iFood, 99Food e canal próprio.
            </p>
          </header>

          <OrdersFilterBar orders={orders} active={tab} onChange={setTab} />

          {error ? <p className="orders-page__error">{error}</p> : null}

          {loading ? (
            <p className="orders-page__empty">Carregando pedidos…</p>
          ) : visible.length === 0 ? (
            <p className="orders-page__empty">Nenhum pedido neste filtro.</p>
          ) : (
            <div className="orders-page__list">
              {visible.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  busy={busyId === order.id}
                  onAccept={(id) => runAction(id, facade.acceptOrder)}
                  onReject={(id) => runAction(id, facade.rejectOrder)}
                  onAdvance={(id) => runAction(id, facade.advanceOrder)}
                />
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrdersPage;
