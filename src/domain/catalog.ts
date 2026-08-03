export interface RestaurantView {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerView {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductView {
  id: string;
  restaurantId: string;
  name: string;
  unitPriceCents: number;
  currency: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CadastroTab = 'restaurants' | 'customers' | 'products';

export const CADASTRO_TABS: {
  id: CadastroTab;
  path: string;
  label: string;
  hint: string;
}[] = [
  {
    id: 'restaurants',
    path: '/cadastro/restaurantes',
    label: 'RESTAURANTE',
    hint: 'Loja',
  },
  {
    id: 'customers',
    path: '/cadastro/clientes',
    label: 'CLIENTES',
    hint: 'Pessoas',
  },
  {
    id: 'products',
    path: '/cadastro/produtos',
    label: 'PRODUTOS',
    hint: 'Cardápio',
  },
];

export function cadastroTabFromPath(pathname: string): CadastroTab {
  const match = CADASTRO_TABS.find(
    (tab) => pathname === tab.path || pathname.startsWith(`${tab.path}/`),
  );
  return match?.id ?? 'restaurants';
}

export function cadastroPathFromTab(tab: CadastroTab): string {
  return (
    CADASTRO_TABS.find((item) => item.id === tab)?.path ??
    '/cadastro/restaurantes'
  );
}

export function reaisToCents(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function validateRequiredName(name: string): string | null {
  if (!name.trim()) return 'Nome é obrigatório';
  return null;
}
