import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { APP_NAV_ITEMS } from '../../domain/app-nav';
import HomePage from '../pages/HomePage';
import OrdersPage from '../pages/OrdersPage';

/** Shell nativo (Android/iOS) — tabs inferiores. */
export function AppTabsShell() {
  return (
    <IonTabs>
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

      <IonTabBar slot="bottom">
        {APP_NAV_ITEMS.map((item) => (
          <IonTabButton key={item.tab} tab={item.tab} href={item.path}>
            <IonIcon aria-hidden="true" icon={item.icon} />
            <IonLabel>{item.label}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
}
