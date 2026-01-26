"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, LoginResponse } from '@/services/auth.service';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    profile?: {
        photo?: string;
        nom_point_vente?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // If unauthorized, maybe clear token? 
            // But let's be careful not to loop redirect
            // authService.logout(); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (username: string, password: string) => {
        await authService.login(username, password);
        await fetchUser();
        router.push('/dashboard');
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push('/login');
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
