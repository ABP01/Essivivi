// Mock data and interfaces adapted from ESSIVI Admin Suite for integration into Free Next.js Dashboard

export interface Agent {
  id: string;
  identificationNumber: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  tricycle: {
    plate: string;
  };
  status: 'active' | 'inactive' | 'on_delivery';
  dateOfHire: string;
  photoUrl: string;
  totalDeliveries: number;
  revenue: number;
  lat?: number;
  lng?: number;
}

export interface Client {
  id: string;
  code: string;
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  lat: number;
  lng: number;
  type: 'boutique' | 'restaurant' | 'hotel' | 'particulier' | 'entreprise';
  totalOrders: number;
  lastOrderDate: string;
}

export interface Delivery {
  id: string;
  agentId: string;
  agentName: string;
  clientId: string;
  clientPhone: string;
  clientName: string;
  address: string;
  lat: number;
  lng: number;
  quantity?: {
    vitale: number;
    voltic: number;
    other: number;
  };
  amount: number;
  photoUrl?: string;
  signatureUrl?: string;
  timestamp: string;
  status: 'pending' | 'validated' | 'delivered' | 'cancelled';
}

export interface Order {
  id: string;
  client: number | string;
  client_name?: string;
  clientName?: string; // Compatibilité
  created_at: string;
  requestedAt?: string; // Compatibilité
  date_souhaitee: string;
  preferredAt?: string; // Compatibilité (utilisé dans orders/page.tsx)
  quantity?: {
    vitale: number;
    voltic: number;
    other: number;
  };
  statut: 'pending' | 'validated' | 'delivered' | 'cancelled';
  status?: string; // Compatibilité UI
  agent?: number | string;
  agent_name?: string;
  assignedAgentId?: string | number; // Compatibilité
  assignedAgentName?: string; // Compatibilité
  montant: number;
  totalAmount?: number; // Compatibilité
  delivery_latitude?: number;
  delivery_longitude?: number;
}

// Unsplash images for water distribution context
const agentPhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
];

const deliveryPhotos = [
  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606168094336-48f205276929?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1553531087-b25a0b9fa773?w=400&h=300&fit=crop',
];

const firstNames = ['Kofi', 'Ama', 'Kwame', 'Abena', 'Yaw', 'Akua', 'Kodjo', 'Afi', 'Mensah', 'Adjoa'];
const lastNames = ['Mensah', 'Asante', 'Osei', 'Boateng', 'Amoako', 'Owusu', 'Appiah', 'Darko', 'Frimpong', 'Agyemang'];
const storeNames = ['Boutique du Coin', 'Super Marché Central', 'Restaurant Le Soleil', 'Hôtel Palm Beach', 'Kiosque Express', 'Mini Market', 'Café de la Paix', 'Epicerie Fine', 'Bar Dancing', 'Station Service'];
const addresses = [
  'Rue du Commerce, Lomé',
  'Avenue de la Libération, Lomé',
  'Boulevard du 13 Janvier, Lomé',
  'Quartier Bè, Lomé',
  'Quartier Tokoin, Lomé',
  'Quartier Agbalépédogan, Lomé',
  'Avenue de Sarakawa, Lomé',
  'Rue des Nîmes, Lomé',
  'Quartier Adidogomé, Lomé',
  'Boulevard Jean-Paul II, Lomé',
];

// Generate mock agents
export const mockAgents: Agent[] = Array.from({ length: 10 }, (_, i) => ({
  id: `agent-${i + 1}`,
  identificationNumber: `ESS-${String(i + 1).padStart(4, '0')}`,
  firstname: firstNames[i],
  lastname: lastNames[i],
  phone: `+228 9${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
  email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@essivi.tg`,
  tricycle: {
    plate: `TG-${String(Math.floor(Math.random() * 9000) + 1000)}-TR`,
  },
  status: ['active', 'inactive', 'on_delivery'][Math.floor(Math.random() * 3)] as Agent['status'],
  dateOfHire: new Date(2022, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  photoUrl: agentPhotos[i],
  totalDeliveries: Math.floor(Math.random() * 500) + 50,
  revenue: Math.floor(Math.random() * 5000000) + 500000,
  lat: 6.1319 + (Math.random() - 0.5) * 0.1,
  lng: 1.2228 + (Math.random() - 0.5) * 0.1,
}));

// Generate mock clients
export const mockClients: Client[] = Array.from({ length: 50 }, (_, i) => ({
  id: `client-${i + 1}`,
  code: `CLI-${String(i + 1).padStart(5, '0')}`,
  storeName: `${storeNames[i % storeNames.length]} ${i > 9 ? i + 1 : ''}`,
  ownerName: `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
  phone: `+228 9${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
  email: `client${i + 1}@example.com`,
  address: addresses[i % addresses.length],
  lat: 6.1319 + (Math.random() - 0.5) * 0.15,
  lng: 1.2228 + (Math.random() - 0.5) * 0.15,
  type: ['boutique', 'restaurant', 'hotel', 'particulier', 'entreprise'][Math.floor(Math.random() * 5)] as Client['type'],
  totalOrders: Math.floor(Math.random() * 100) + 5,
  lastOrderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
}));

// Generate mock deliveries
export const mockDeliveries: Delivery[] = Array.from({ length: 200 }, (_, i) => {
  const agent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
  const client = mockClients[Math.floor(Math.random() * mockClients.length)];
  const vitale = Math.floor(Math.random() * 20);
  const voltic = Math.floor(Math.random() * 15);
  const other = Math.floor(Math.random() * 10);

  return {
    id: `delivery-${i + 1}`,
    agentId: agent.id,
    agentName: `${agent.firstname} ${agent.lastname}`,
    clientId: client.id,
    clientPhone: client.phone,
    clientName: client.storeName,
    address: client.address,
    lat: client.lat,
    lng: client.lng,
    quantity: { vitale, voltic, other },
    amount: vitale * 500 + voltic * 600 + other * 400,
    photoUrl: deliveryPhotos[Math.floor(Math.random() * deliveryPhotos.length)],
    signatureUrl: '',
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    status: ['pending', 'validated', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)] as Delivery['status'],
  };
});

// Generate mock orders
export const mockOrders: Order[] = Array.from({ length: 30 }, (_, i) => {
  const client = mockClients[Math.floor(Math.random() * mockClients.length)];
  const agent = Math.random() > 0.3 ? mockAgents[Math.floor(Math.random() * mockAgents.length)] : undefined;
  const vitale = Math.floor(Math.random() * 30) + 5;
  const voltic = Math.floor(Math.random() * 20);
  const other = Math.floor(Math.random() * 10);
  const montant = vitale * 500 + voltic * 600 + other * 400;
  const created_at = new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString();
  const date_souhaitee = new Date(Date.now() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString();
  const statut = agent ? (['validated', 'delivered'][Math.floor(Math.random() * 2)] as Order['statut']) : 'pending';

  return {
    id: `order-${i + 1}`,
    client: client.id,
    client_name: client.storeName,
    clientName: client.storeName, // Compatibilité
    created_at,
    requestedAt: created_at, // Compatibilité
    date_souhaitee,
    preferredAt: date_souhaitee, // Compatibilité lib-essivi-mock reference
    quantity: { vitale, voltic, other },
    statut,
    status: statut, // Compatibilité UI
    agent: agent?.id,
    agent_name: agent ? `${agent.firstname} ${agent.lastname}` : undefined,
    montant,
    totalAmount: montant, // Compatibilité
  };
});

// Dashboard KPIs
export const dashboardKPIs = {
  totalRevenue: 15750000,
  revenueChange: 12.5,
  totalDeliveries: 1245,
  deliveriesChange: 8.3,
  activeAgents: 8,
  agentsChange: 0,
  activeClients: 42,
  clientsChange: 5.2,
  pendingOrders: 12,
  avgDeliveryTime: 28,
  satisfactionRate: 94.5,
};

// Revenue chart data
export const revenueChartData = [
  { month: 'Jan', revenue: 1200000, deliveries: 98 },
  { month: 'Fév', revenue: 1350000, deliveries: 112 },
  { month: 'Mar', revenue: 1180000, deliveries: 95 },
  { month: 'Avr', revenue: 1420000, deliveries: 118 },
  { month: 'Mai', revenue: 1580000, deliveries: 125 },
  { month: 'Juin', revenue: 1650000, deliveries: 132 },
  { month: 'Juil', revenue: 1720000, deliveries: 140 },
  { month: 'Août', revenue: 1480000, deliveries: 120 },
  { month: 'Sep', revenue: 1390000, deliveries: 115 },
  { month: 'Oct', revenue: 1550000, deliveries: 128 },
  { month: 'Nov', revenue: 1680000, deliveries: 138 },
  { month: 'Déc', revenue: 1550000, deliveries: 124 },
];

// Delivery share by product
export const deliveryShareData = [
  { name: 'Vitale', value: 45, fill: 'hsl(207, 88%, 40%)' },
  { name: 'Voltic', value: 35, fill: 'hsl(145, 63%, 49%)' },
  { name: 'Autres', value: 20, fill: 'hsl(36, 100%, 50%)' },
];

// Notifications
export const notifications = [
  { id: '1', type: 'order', message: 'Nouvelle commande de Boutique du Coin', time: '2 min', read: false },
  { id: '2', type: 'delivery', message: 'Livraison #1234 complétée par Kofi Mensah', time: '15 min', read: false },
  { id: '3', type: 'alert', message: 'Stock faible: Vitale (50 sachets restants)', time: '1h', read: false },
  { id: '4', type: 'agent', message: 'Nouvel agent Ama Asante ajouté', time: '3h', read: true },
  { id: '5', type: 'system', message: 'Synchronisation des données terminée', time: '5h', read: true },
];
