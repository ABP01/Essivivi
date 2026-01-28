"use client";

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (agent: any) => void;
}

export default function CreateAgentModal({ open, onOpenChange, onCreated }: Props) {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('228');
  const [phone, setPhone] = useState('');
  const generateIdentification = () => `ESS-${String(Math.floor(Math.random() * 900000) + 100000)}`;
  const [identificationNumber, setIdentificationNumber] = useState(generateIdentification());
  const [tricyclePlate, setTricyclePlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPhoneDisplay = (digits: string) => {
    // group by 2 for readability: 12345678 => 12 34 56 78
    return digits.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  };

  const formatPlate = (raw: string) => {
    // Format to AB-12-34: two letters, dash, two digits, dash, two digits
    const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const letters = cleaned.slice(0, 2).replace(/[^A-Z]/g, '');
    const nums = cleaned.slice(2, 6).replace(/[^0-9]/g, '');
    const part1 = nums.slice(0, 2);
    const part2 = nums.slice(2, 4);
    let out = letters;
    if (part1.length > 0) out += '-' + part1;
    if (part2.length > 0) out += '-' + part2;
    return out;
  };

  const isValidPlate = (plate: string) => /^[A-Z]{2}-\d{2}-\d{2}$/.test(plate);

  const handleCreate = async () => {
    setError(null);
    if (!username || !password) {
      setError('Veuillez renseigner au moins le nom d\'utilisateur et un mot de passe');
      return;
    }
    if (tricyclePlate && !isValidPlate(tricyclePlate)) {
      setError('La plaque tricycle doit respecter le format AB 12-21');
      return;
    }
    setLoading(true);
    try {
      // normalize phone: remove non-digits and prefix with +country
      const rawDigits = phone.replace(/\D/g, '');
      const normalizedPhone = rawDigits ? `+${countryCode}${rawDigits}` : undefined;

      // send expected backend field names: first_name, last_name, identification_number
      const resp = await authService.register(username, email, password, 'agent', normalizedPhone, {
        first_name: firstname || undefined,
        last_name: lastname || undefined,
        identification_number: identificationNumber || undefined,
        tricycle_plate: tricyclePlate || undefined,
      });

      // Try to fetch the persisted agent profile from the API so the UI reflects saved data
      let agent: any = { ...(resp || {}) };
      try {
        // try to login so we can fetch protected endpoints
        try {
          await (await import('@/services/auth.service')).authService.login(username, password);
        } catch (loginErr) {
          // ignore
        }
        const usersService = (await import('@/services/users.service')).default;
        const profile = await usersService.getAgentByIdentifier(resp?.username || username || resp?.id || '');
        if (profile) agent = profile;
      } catch (e) {
        // fallback to optimistic object built from response/form
        const created = resp && (resp.user ?? resp);
        agent = {
          id: created?.id || created?.pk || created?.username || username,
          identificationNumber: created?.identificationNumber || identificationNumber,
          firstname: created?.first_name || created?.firstname || firstname || (username.split('.')[0] || username),
          lastname: created?.last_name || created?.lastname || lastname || (username.split('.')[1] || ''),
          phone: created?.phone || phone || created?.phone_number || (normalizedPhone ?? ''),
          email: created?.email || email || '',
          tricycle: { plate: created?.tricycle?.plate || tricyclePlate || '' },
          status: created?.status || 'active',
          dateOfHire: created?.dateOfHire || new Date().toISOString().split('T')[0],
          photoUrl: created?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
          totalDeliveries: created?.totalDeliveries ?? 0,
          revenue: created?.revenue ?? 0,
        };
      }

      if (onCreated) onCreated(agent);
      onOpenChange(false);
      // persist identification mapping locally so it can be restored on edit/detail pages
      try {
        const usernameKey = (resp && (resp.username || (resp.user && resp.user.username))) || username;
        const key = `agent_ident_${usernameKey}`;
        if (typeof window !== 'undefined' && usernameKey) {
          localStorage.setItem(key, identificationNumber);
        }
      } catch (e) {
        // ignore storage errors
      }
      try {
        const cacheKey = `agent_cache_${agent.id || agent.username || username}`;
        if (typeof window !== 'undefined' && cacheKey) {
          localStorage.setItem(cacheKey, JSON.stringify(agent));
        }
      } catch (e) {
        // ignore
      }

      setUsername(''); setFirstname(''); setLastname(''); setEmail(''); setPassword(''); setCountryCode('228'); setPhone(''); setIdentificationNumber(generateIdentification()); setTricyclePlate('');
    } catch (err: any) {
      console.error('create agent error', err);
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
        <h3 className="text-lg font-semibold mb-4">Créer un agent</h3>
        <div className="space-y-3">
          {error && <div className="text-sm text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
          <div>
            <label className="block text-sm mb-1">Nom d&apos;utilisateur</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Prénom</label>
              <Input value={firstname} onChange={e => setFirstname(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <Input value={lastname} onChange={e => setLastname(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <div className="flex gap-2">
              <select className="border rounded px-2 py-2" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                <option value="228">Togo (+228)</option>
                <option value="229">Bénin (+229)</option>
                <option value="225">Côte d&apos;Ivoire (+225)</option>
                <option value="221">Sénégal (+221)</option>
                <option value="223">Mali (+223)</option>
              </select>
              <Input value={phone} onChange={e => setPhone(formatPhoneDisplay(e.target.value))} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format automatique : espaces groupés. Préfixe {`+${countryCode}`}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">N° d&apos;identification (généré)</label>
              <Input value={identificationNumber} readOnly />
            </div>
            <div>
              <label className="block text-sm mb-1">Plaque tricycle (format: AB-1234)</label>
              <Input value={tricyclePlate} onChange={e => setTricyclePlate(formatPlate(e.target.value))} />
              {!isValidPlate(tricyclePlate) && tricyclePlate.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Format attendu : deux lettres, tiret, quatre chiffres (ex. AB-1234)</p>
              )}
            </div>
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
