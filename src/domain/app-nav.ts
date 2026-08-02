import { homeOutline, receiptOutline } from 'ionicons/icons';

export interface AppNavItem {
  path: string;
  tab: string;
  label: string;
  icon: string;
}

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    path: '/orders',
    tab: 'orders',
    label: 'Cozinha',
    icon: receiptOutline,
  },
  {
    path: '/home',
    tab: 'home',
    label: 'Início',
    icon: homeOutline,
  },
];
