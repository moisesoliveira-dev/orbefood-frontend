/** Conteúdo da landing — dados puros (sem side effects). */

export interface NavLink {
  href: string;
  label: string;
}

export interface AgentCardData {
  variant: 'a' | 'b';
  orbClass: 'orb-indigo' | 'orb-sky';
  icon: string;
  role: string;
  name: string;
  description: string;
  tags: string[];
}

export interface FlowStepData {
  num: string;
  icon: string;
  title: string;
  description: string;
}

export interface FeatureData {
  icon: string;
  title: string;
  description: string;
}

export const brandName = 'OrbeFood';

export const navLinks: NavLink[] = [
  { href: '#plataformas', label: 'Plataformas' },
  { href: '#fluxo', label: 'Como funciona' },
  { href: '#recursos', label: 'Recursos' },
];

export const agents: AgentCardData[] = [
  {
    variant: 'a',
    orbClass: 'orb-indigo',
    icon: '🛵',
    role: 'Canal 01 · Marketplaces',
    name: 'Delivery Hub',
    description:
      'Conecta iFood, 99Food e outros canais em um único fluxo de pedidos. Catálogo, status e SLA sincronizados sem retrabalho.',
    tags: ['iFood', '99Food', 'Catálogo', 'SLA'],
  },
  {
    variant: 'b',
    orbClass: 'orb-sky',
    icon: '🏪',
    role: 'Canal 02 · Operação',
    name: 'Ops Agent',
    description:
      'Orquestra cozinha, estoque e entregadores com contexto do pedido. Escala para humano quando a operação exige decisão.',
    tags: ['Cozinha', 'Estoque', 'Handoff', 'Roteamento'],
  },
];

export const flowSteps: FlowStepData[] = [
  {
    num: '01',
    icon: '📥',
    title: 'Pedido chega',
    description: 'O hub normaliza o pedido de qualquer marketplace e valida itens, pagamento e endereço.',
  },
  {
    num: '02',
    icon: '🔥',
    title: 'Cozinha acionada',
    description: 'A operação recebe o ticket unificado com prioridade, tempo e regras do canal de origem.',
  },
  {
    num: '03',
    icon: '📍',
    title: 'Entrega sincronizada',
    description: 'Status volta para o marketplace em tempo real — sem painéis paralelos.',
  },
  {
    num: '04',
    icon: '👤',
    title: 'Handoff humano',
    description: 'Exceções sobem para o time com contexto completo e prioridade definida.',
  },
];

export const features: FeatureData[] = [
  {
    icon: '🔌',
    title: 'Adapters por plataforma',
    description: 'iFood, 99Food e novos canais entram como adapters — o domínio de pedidos não muda.',
  },
  {
    icon: '🧠',
    title: 'Contexto unificado',
    description: 'Histórico do pedido, cliente e canal em um só lugar, do aceito ao entregue.',
  },
  {
    icon: '📊',
    title: 'Métricas por canal',
    description: 'Conversão, atraso, cancelamento e ticket médio por marketplace em tempo real.',
  },
  {
    icon: '🛡️',
    title: 'Regras de negócio',
    description: 'Horários, área, estoque mínimo e promoções centralizados, não espalhados nos apps.',
  },
  {
    icon: '🔀',
    title: 'Roteamento inteligente',
    description: 'Decide aceitar, rejeitar ou escalar com base em capacidade e SLA do canal.',
  },
  {
    icon: '📦',
    title: 'Catálogo único',
    description: 'Publique uma vez e sincronize preços e disponibilidade em todas as plataformas.',
  },
];
