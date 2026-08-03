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
import type {
  ChannelFilter,
  OrderView,
  OrdersFilterTab,
} from '../../domain/order';
import {
  ORDERS_PAGE_SIZE,
  countByTab,
  elapsedSeconds,
  formatTimer,
  paginateItems,
  queryOrders,
  ticketUrgency,
} from '../../domain/order';
import { OrderCard } from '../components/OrderCard';
import { OrdersFilterBar } from '../components/OrdersFilterBar';
import { OrdersPagination } from '../components/OrdersPagination';
import { OrdersToolbar } from '../components/OrdersToolbar';
import './OrdersPage.css';

const facade = createOrdersFacade(createHttpOrdersApi());

function hottestTimer(orders: OrderView[], now: number): string {
  const active = orders.filter(
    (o) =>
      o.status !== 'delivered' &&
      o.status !== 'rejected' &&
      o.status !== 'cancelled',
  );
  if (!active.length) return '00:00';
  const maxSeconds = Math.max(
    ...active.map((o) => elapsedSeconds(o.placedAt, now)),
  );
  return formatTimer(maxSeconds);
}

function criticalCount(orders: OrderView[], now: number): number {
  return orders.filter(
    (o) => ticketUrgency(o.status, o.placedAt, now) === 'critical',
  ).length;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [tab, setTab] = useState<OrdersFilterTab>('pending');
  const [channel, setChannel] = useState<ChannelFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

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

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tab, channel, search]);

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

  const filtered = queryOrders(orders, { tab, channel, search });
  const paged = paginateItems(filtered, page, ORDERS_PAGE_SIZE);
  const entrada = countByTab(orders, 'pending');
  const fogao = countByTab(orders, 'kitchen');
  const critical = criticalCount(orders, now);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Cozinha</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY className="orders-page">
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="kitchen-board">
          <div className="kitchen-board__top">
            <header className="kitchen-hud">
              <div className="kitchen-hud__brand">
                <p className="kitchen-hud__eyebrow">Service line</p>
                <h1 className="kitchen-hud__title">
                  Quadro de <em>comandas</em>
                </h1>
              </div>

              <div className="kitchen-hud__meters" aria-label="Indicadores da cozinha">
                <div className="kitchen-meter">
                  <span className="kitchen-meter__label">FILA</span>
                  <strong>{entrada}</strong>
                </div>
                <div className="kitchen-meter">
                  <span className="kitchen-meter__label">FOGO</span>
                  <strong>{fogao}</strong>
                </div>
                <div className={`kitchen-meter${critical ? ' is-critical' : ''}`}>
                  <span className="kitchen-meter__label">ALERTA</span>
                  <strong>{critical}</strong>
                </div>
                <div className="kitchen-meter kitchen-meter--timer">
                  <span className="kitchen-meter__label">MAX</span>
                  <strong>{hottestTimer(orders, now)}</strong>
                </div>
              </div>
            </header>

            <OrdersFilterBar
              orders={orders}
              active={tab}
              onChange={(next) => setTab(next)}
            />

            <OrdersToolbar
              search={search}
              channel={channel}
              onSearchChange={setSearch}
              onChannelChange={setChannel}
            />

            <OrdersPagination
              page={paged.page}
              totalPages={paged.totalPages}
              totalItems={paged.totalItems}
              pageSize={paged.pageSize}
              onPageChange={setPage}
            />

            {error ? <p className="orders-page__error">{error}</p> : null}
          </div>

          <div className="kitchen-board__stage">
            {loading ? (
              <p className="orders-page__empty">Aquecendo a chapa…</p>
            ) : paged.items.length === 0 ? (
              <p className="orders-page__empty">
                Nenhuma comanda com esses filtros.
              </p>
            ) : (
              <div className="comanda-stack" role="list">
                {paged.items.map((order) => (
                  <div
                    key={order.id}
                    role="listitem"
                    className="comanda-stack__item"
                  >
                    <OrderCard
                      order={order}
                      busy={busyId === order.id}
                      onAccept={(id) => runAction(id, facade.acceptOrder)}
                      onReject={(id) => runAction(id, facade.rejectOrder)}
                      onAdvance={(id) => runAction(id, facade.advanceOrder)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrdersPage;
