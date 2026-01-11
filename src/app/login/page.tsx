"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Droplets, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // apply a page-specific theme to body while this component is mounted
    document.body.classList.add('login-theme');
    return () => {
      document.body.classList.remove('login-theme');
    };
  }, []);

  // form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.login(username, password);
      // Force a full navigation so the cookie set on the client is sent to the server
      // and Next middleware can validate the auth state before rendering the dashboard.
      if (typeof window !== 'undefined') {
        // slight delay to ensure cookie is persisted before the navigation
        setTimeout(() => window.location.replace('/dashboard'), 300);
      }
    } catch (err: any) {
      // Map common backend errors to user-friendly French messages
      const status = err?.response?.status;
      const backendData = err?.response?.data;
      console.error('Login error', status, backendData, err);
      if (status === 401) {
        setError('Identifiant incorrecte');
      } else {
        const backendMessage = backendData?.detail || backendData || err?.message;
        setError(backendMessage ? (typeof backendMessage === 'string' ? backendMessage : JSON.stringify(backendMessage)) : 'Identifiants incorrects ou erreur de connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Droplets className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ESSIVI-Sarl</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Système de gestion de distribution d&apos;eau</p>
        </div>

        {!showForm ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Êtes-vous déjà inscrit ?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowForm(true)} className="btn-primary">Oui, se connecter</button>
              <button onClick={() => router.push('/signup')} className="px-4 py-2 border rounded">Non, créer un compte</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Identifiant (Username)</label>
              <input
                type="text"
                placeholder="Ex: elom"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="text-center text-sm text-gray-500">
              <a href="/signup" className="text-primary">Créer un compte</a>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
