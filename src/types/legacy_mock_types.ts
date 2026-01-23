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
