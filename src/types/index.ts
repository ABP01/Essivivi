export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'gestionnaire' | 'agent' | 'client';
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    photo?: string;
    // Profiles
    profile?: any; // Dynamic profile data
    preferences?: any;
    agent_profile?: AgentProfile;
    client_profile?: ClientProfile;
}

export interface AgentProfile {
    id: number;
    user?: number | User; // Depending on serialization
    photo?: string;
    date_embauche?: string;
    zone_assignee?: string;
    is_online?: boolean;
    latitude?: number;
    longitude?: number;
    current_speed?: number;
    heading?: number;

    // Legacy/Flatter structure support
    profile_id?: number;
    user_id?: number;
    username?: string;
    email?: string;
    first_name?: string;
    firstname?: string;
    last_name?: string;
    lastname?: string;
    phone?: string;
    phone_number?: string;

    // Name variations
    name?: string;
    full_name?: string;
    displayName?: string;
    display_name?: string;
    nom?: string;
    prenom?: string;
    label?: string;

    // Specific fields aliases
    tricycle_plate?: string;
    tricycle?: any;
    immatriculation?: string;
    identification_number?: string;
    identificationNumber?: string;
}

export interface ClientProfile {
    id: number;
    user?: number | User;
    nom_point_vente: string;
    nom_proprietaire?: string;
    adresse?: string;
    gps_lat?: number;
    gps_lng?: number;
    formatted_address?: string;
    solde: number;
}

export interface Commande {
    id: number;
    client: number | User;
    agent?: number | User | null;
    statut: 'pending' | 'validated' | 'delivered' | 'cancelled';
    montant: number;
    date_souhaitee: string;
    created_at: string;
    updated_at: string;
}

export interface Livraison {
    id: number;
    commande: number | Commande;
    agent?: number | AgentProfile | null;
    gps_lat?: number;
    gps_lng?: number;
    statut_livraison: 'assigned' | 'en_route' | 'arriving' | 'delivered';
    photo_preuve?: string;
    signature?: string;
    timestamp: string;
}

export interface DashboardStats {
    kpis: {
        total_revenue: number;
        total_deliveries: number;
        total_pending_orders: number;
        active_agents: number;
        active_clients: number;
        active_tricycles: number;
        avg_delivery_time: number;
    };
    charts: {
        revenue: Array<{ date: string; amount: number }>;
        deliveries: Array<{ date: string; count: number }>;
    };
    agent_performance: Array<{
        agent_id: number;
        agent_name: string;
        deliveries_completed: number;
        avg_rating: number;
    }>;
}

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status?: number;
}
