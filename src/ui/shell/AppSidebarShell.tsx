import { IonIcon } from '@ionic/react';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import {
  APP_NAV_ITEMS,
  DEFAULT_CADASTRO_PATH,
  isNavChildActive,
  isNavItemActive,
} from '../../domain/app-nav';
import { BrandLogo } from '../components/BrandLogo';
import CadastroPage from '../pages/CadastroPage';
import HomePage from '../pages/HomePage';
import OrdersPage from '../pages/OrdersPage';
import './AppSidebarShell.css';

/** Shell web — sidebar lateral + rotas sem IonRouterOutlet (evita página “em branco”). */
export function AppSidebarShell() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Navegação principal">
        <div className="app-sidebar__top">
          <div className="app-sidebar__brand">
            <BrandLogo className="app-sidebar__logo" />
            <div className="app-sidebar__brand-copy">
              <p className="app-sidebar__eyebrow">Console</p>
              <p className="app-sidebar__tag">Operação multiplataforma</p>
            </div>
          </div>

          <div className="app-sidebar__pulse" aria-hidden="true">
            <span className="app-sidebar__pulse-orb app-sidebar__pulse-orb--a" />
            <span className="app-sidebar__pulse-line" />
            <span className="app-sidebar__pulse-orb app-sidebar__pulse-orb--b" />
          </div>
        </div>

        <nav className="app-sidebar__nav">
          {APP_NAV_ITEMS.map((item) => {
            if (item.children?.length) {
              return (
                <div
                  key={item.path}
                  className={`app-sidebar__group${
                    isNavItemActive(location.pathname, item) ? ' is-open' : ''
                  }`}
                >
                  <p className="app-sidebar__section-label">{item.label}</p>
                  <div className="app-sidebar__children" role="group">
                    {item.children.map((child) => {
                      const active = isNavChildActive(
                        location.pathname,
                        child,
                      );
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`app-sidebar__sublink${active ? ' is-active' : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <span
                            className="app-sidebar__sublink-rail"
                            aria-hidden="true"
                          />
                          <span className="app-sidebar__link-icon">
                            <IonIcon icon={child.icon} aria-hidden="true" />
                          </span>
                          <span className="app-sidebar__link-label">
                            {child.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const active = isNavItemActive(location.pathname, item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`app-sidebar__link${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="app-sidebar__link-icon">
                  <IonIcon icon={item.icon} aria-hidden="true" />
                </span>
                <span className="app-sidebar__link-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <div className="app-sidebar__status">
            <span className="app-sidebar__dot" aria-hidden="true" />
            <div>
              <strong>Web live</strong>
              <span>Console · gastro</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="app-shell__main">
        <Switch>
          <Route exact path="/orders" component={OrdersPage} />
          <Route exact path="/cadastro/restaurantes" component={CadastroPage} />
          <Route exact path="/cadastro/clientes" component={CadastroPage} />
          <Route exact path="/cadastro/produtos" component={CadastroPage} />
          <Route exact path="/cadastro">
            <Redirect to={DEFAULT_CADASTRO_PATH} />
          </Route>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/">
            <Redirect to="/orders" />
          </Route>
          <Redirect to="/orders" />
        </Switch>
      </main>
    </div>
  );
}
