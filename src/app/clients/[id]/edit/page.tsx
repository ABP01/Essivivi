"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import usersService from '@/services/users.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('boutique');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        let data: any;
        try {
          data = await usersService.getClientById(id);
        } catch (e) {
          // fallback: id may be a username-like identifier
          data = await usersService.getClientByIdentifier(id);
        }
        if (!mounted) return;
        // debug: log raw response to help identify which fields are present
        try { console.debug('[EditClient] fetched client data:', data); } catch (e) { }

        // handle multiple possible API shapes (nested user or different naming)
        const user = data.user ?? data;
        setUserId((user as any).id || null);

        // storeName: try many aliases
        const storeNameVal = data.storeName || data.store_name || data.nom_point_vente || data.company || data.name || user.username || '';
        setStoreName(storeNameVal);

        // ownerName: try many aliases including user fields
        const ownerCandidates = [
          data.ownerName,
          data.owner_name,
          data.nom_proprietaire,
          data.owner,
          data.contact_name,
          data.responsible,
          data.name,
          user.username,
          `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          user.full_name || user.name,
        ];
        const ownerVal = ownerCandidates.find(v => v && String(v).trim()) || '';
        setOwnerName(ownerVal);

        // contact fields
        const phoneVal = data.phone || data.phone_number || data.contact || user.phone || user.phone_number || '';
        setPhone(phoneVal);
        const emailVal = data.email || user.email || '';
        setEmail(emailVal);

        // address: try many aliases
        const addressVal = data.address || data.adresse || data.location || data.address1 || data.adresse1 || data.geo_address || user.address || '';
        setAddress(addressVal);

        setType(data.type || 'boutique');
      } catch (err) {
        console.error('failed fetch client', err);
        setError('Impossible de charger les données du client.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      // Map frontend-friendly field names to backend model field names
      const payload: any = {
        nom_point_vente: storeName,
        nom_proprietaire: ownerName,
        adresse: address,
        // keep backward-compatible aliases in case backend accepts them
        storeName,
        ownerName,
        address,
        type,
      };

      // update user contact info if we have user id
      if (userId) {
        await usersService.updateUser(userId, { phone_number: phone, email });
      }

      await usersService.updateClient(id, payload);
      router.push('/clients');
    } catch (err) {
      console.error('update failed', err);
      setError('Impossible d\'enregistrer les modifications.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Modifier le client</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div>
            <label className="block text-sm mb-1">Nom du point de vente</label>
            <Input value={storeName} onChange={e => setStoreName((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Nom du propriétaire</label>
            <Input value={ownerName} onChange={e => setOwnerName((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <Input value={phone} onChange={e => setPhone((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input value={email} onChange={e => setEmail((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Adresse</label>
            <Input value={address} onChange={e => setAddress((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="w-full p-2 rounded border" value={type} onChange={e => setType((e.target as HTMLSelectElement).value)}>
              <option value="boutique">Boutique</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hôtel</option>
              <option value="particulier">Particulier</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
