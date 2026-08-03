import {
  createOutline,
  homeOutline,
  peopleOutline,
  restaurantOutline,
  receiptOutline,
  storefrontOutline,
} from 'ionicons/icons';
import type { CadastroTab } from './catalog';

export interface AppNavChild {
  path: string;
  label: string;
  icon: string;
  section: CadastroTab;
}

export interface AppNavItem {
  path: string;
  tab: string;
  label: string;
  icon: string;
  children?: AppNavChild[];
}

export const CADASTRO_NAV_CHILDREN: AppNavChild[] = [
  {
    path: '/cadastro/restaurantes',
    label: 'Restaurante',
    icon: storefrontOutline,
    section: 'restaurants',
  },
  {
    path: '/cadastro/clientes',
    label: 'Clientes',
    icon: peopleOutline,
    section: 'customers',
  },
  {
    path: '/cadastro/produtos',
    label: 'Produtos',
    icon: restaurantOutline,
    section: 'products',
  },
];

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    path: '/orders',
    tab: 'orders',
    label: 'Cozinha',
    icon: receiptOutline,
  },
  {
    path: '/cadastro',
    tab: 'cadastro',
    label: 'Cadastro',
    icon: createOutline,
    children: CADASTRO_NAV_CHILDREN,
  },
  {
    path: '/home',
    tab: 'home',
    label: 'Início',
    icon: homeOutline,
  },
];

export const DEFAULT_CADASTRO_PATH = CADASTRO_NAV_CHILDREN[0].path;

export function isNavItemActive(pathname: string, item: AppNavItem): boolean {
  if (item.children?.length) {
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  }
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function isNavChildActive(pathname: string, child: AppNavChild): boolean {
  return pathname === child.path || pathname.startsWith(`${child.path}/`);
}
