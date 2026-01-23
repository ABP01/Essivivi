"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { logger } from '@/lib/logger';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      logger.info('signup: sending', { username, email });
      const resp = await authService.register(username, email, password);
      logger.info('signup: response', resp);
      // After successful signup, auto-login and redirect to dashboard
      try {
        await authService.login(username, password);
        router.replace('/dashboard');
        return;
      } catch (loginErr) {
        // If auto-login fails, fallback to redirect to login page
        logger.error('auto-login failed', loginErr);
        router.replace('/login');
        return;
      }
    } catch (err: any) {
      logger.error('signup error', err);
      const backend = err?.response ? { status: err.response.status, data: err.response.data } : null;
      setError(backend || err?.message || 'Échec de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Créer un compte</h2>
        {error && <div className="text-sm text-red-600 mb-3">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nom d'utilisateur</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>{loading ? 'Création...' : 'Créer le compte'}</Button>
            <a href="/login" className="text-sm text-blue-600">Déjà un compte ?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
