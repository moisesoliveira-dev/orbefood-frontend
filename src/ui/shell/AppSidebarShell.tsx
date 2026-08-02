import { IonIcon, IonRouterOutlet } from '@ionic/react';
import { Link, Redirect, Route, useLocation } from 'react-router-dom';
import { APP_NAV_ITEMS } from '../../domain/app-nav';
import { BrandLogo } from '../components/BrandLogo';
import HomePage from '../pages/HomePage';
import OrdersPage from '../pages/OrdersPage';
import './AppSidebarShell.css';

/** Shell web — sidebar lateral fixa. */
export function AppSidebarShell() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Navegação principal">
        <div className="app-sidebar__brand">
          <BrandLogo />
          <p className="app-sidebar__tag">Operação multiplataforma</p>
        </div>

        <nav className="app-sidebar__nav">
          {APP_NAV_ITEMS.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`app-sidebar__link${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <IonIcon icon={item.icon} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <span className="app-sidebar__dot" aria-hidden="true" />
          Web console
        </div>
      </aside>

      <main className="app-shell__main">
        <IonRouterOutlet>
          <Route exact path="/orders">
            <OrdersPage />
          </Route>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/">
            <Redirect to="/orders" />
          </Route>
        </IonRouterOutlet>
      </main>
    </div>
  );
}
