export const dashboardKPIs = {
  totalRevenue: 1250000,
  revenueChange: 12.5,
  totalDeliveries: 342,
  deliveriesChange: 5.2,
  activeAgents: 15,
  agentsChange: 2.1,
  activeClients: 128,
  clientsChange: 8.7,
  pendingOrders: 24,
  avgDeliveryTime: 45,
  satisfactionRate: 94.5,
};

export const revenueData = [
  { month: 'Jan', revenue: 850000 },
  { month: 'Fév', revenue: 920000 },
  { month: 'Mar', revenue: 780000 },
  { month: 'Avr', revenue: 1100000 },
  { month: 'Mai', revenue: 980000 },
  { month: 'Juin', revenue: 1250000 },
];

export const deliveryData = [
  { day: 'Lun', deliveries: 45 },
  { day: 'Mar', deliveries: 52 },
  { day: 'Mer', deliveries: 48 },
  { day: 'Jeu', deliveries: 55 },
  { day: 'Ven', deliveries: 62 },
  { day: 'Sam', deliveries: 45 },
  { day: 'Dim', deliveries: 35 },
];

export const deliveryStatusData = [
  { status: 'Livrées', value: 78 },
  { status: 'En cours', value: 15 },
  { status: 'En retard', value: 7 },
];

export const recentDeliveries = [
  { id: 1, client: 'Jean Dupont', address: 'Cocody, Abidjan', status: 'Livré', time: '10:30' },
  { id: 2, client: 'Aïcha Koné', address: 'Yopougon, Abidjan', status: 'En cours', time: '11:15' },
  { id: 3, client: 'Mohamed Diarra', address: 'Plateau, Abidjan', status: 'En attente', time: '11:45' },
  { id: 4, client: 'Fatou Bamba', address: 'Treichville, Abidjan', status: 'Livré', time: '12:30' },
  { id: 5, client: 'Koffi Kouamé', address: 'Marcory, Abidjan', status: 'En retard', time: '13:15' },
];

export const agentActivity = [
  { id: 1, name: 'Yao Kouassi', deliveries: 24, status: 'Actif', rating: 4.8 },
  { id: 2, name: 'Amina Traoré', deliveries: 18, status: 'Actif', rating: 4.9 },
  { id: 3, name: 'Ousmane Diop', deliveries: 15, status: 'En pause', rating: 4.5 },
  { id: 4, name: 'Mariam Keita', deliveries: 12, status: 'Actif', rating: 4.7 },
  { id: 5, name: 'Ibrahim Coulibaly', deliveries: 8, status: 'Inactif', rating: 4.3 },
];
