"use client";

import React, { useState } from 'react';
// Lightweight modal implementation to avoid dependency on missing Dialog component
import ReactDOM from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (client: any) => void;
}

export default function CreateClientModal({ open, onOpenChange, onCreated }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [type, setType] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    if (!username || !password) {
      setError('Veuillez renseigner au moins le nom d\'utilisateur et un mot de passe');
      return;
    }
    if (!type) {
      setError('Veuillez sélectionner le type du client');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const resp = await authService.register(username, email, password, 'client', phone, {
        // send multiple possible field names so backend can accept whichever it expects
        storeName: storeName || undefined,
        store_name: storeName || undefined,
        company: storeName || undefined,
        ownerName: ownerName || undefined,
        owner_name: ownerName || undefined,
        owner: ownerName || undefined,
        address: address || undefined,
        adresse: address || undefined,
        type: type || undefined,
      });
      // After creating user, fetch the created client profile from the API so we show the persisted record
      let created: any = { ...(resp || {}) };
      try {
        // try logging in (register does not return tokens) so we can call protected client endpoints
        try {
          await (await import('@/services/auth.service')).authService.login(username, password);
        } catch (loginErr) {
          // ignore login failure, still try to fetch (may fail if endpoint requires auth)
        }
        const usersService = (await import('@/services/users.service')).default;
        const profile = await usersService.getClientByIdentifier(resp?.username || username || resp?.id || '');
        if (profile) created = profile;
      } catch (e) {
        // fallback to optimistic local object if the fetch fails
        created = {
          ...(resp || {}),
          storeName: resp?.storeName || resp?.store_name || resp?.nom_point_vente || storeName || '',
          ownerName: resp?.ownerName || resp?.owner_name || ownerName || resp?.username || username || '',
          phone: resp?.phone || resp?.phone_number || phone || '',
          email: resp?.email || email || '',
          address: resp?.address || resp?.adresse || address || '',
          type: resp?.type || type || '',
        };
      }

      if (onCreated) onCreated(created);
      onOpenChange(false);
      setUsername(''); setEmail(''); setPassword(''); setStoreName(''); setOwnerName(''); setPhone(''); setAddress(''); setType('');
    } catch (err: any) {
      console.error('create client error', err);
      setError(err?.response?.data || err?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
        <h3 className="text-lg font-semibold mb-4">Créer un client</h3>
        <div className="space-y-3">
          {error && <div className="text-sm text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
          <div>
            <label className="block text-sm mb-1">Nom d&apos;utilisateur</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Nom du point de vente</label>
            <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Nom du propriétaire</label>
            <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Adresse</label>
            <Input value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="w-full p-2 rounded border" value={type} onChange={e => setType((e.target as HTMLSelectElement).value)}>
              <option value="">-- Sélectionner un type --</option>
              <option value="boutique">Boutique</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hôtel</option>
              <option value="particulier">Particulier</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleCreate} disabled={loading}>{loading ? 'Création...' : 'Créer'}</Button>
        </div>
      </div>
    </div>,
    typeof window !== 'undefined' ? (document.body as Element) : document.createDocumentFragment()
  );
}
