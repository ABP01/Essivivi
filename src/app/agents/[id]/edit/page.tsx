"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import usersService from '@/services/users.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditAgentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [countryCode, setCountryCode] = useState('228');
  const [phone, setPhone] = useState('');
  const [tricyclePlate, setTricyclePlate] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const formatPlate = (raw: string) => {
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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // support both numeric id and username in the URL (e.g. /agents/afiyavi/edit)
        const data = await usersService.getAgentByIdentifier(id);
        if (!mounted) return;
        // agent payload may nest user info or provide user id only
        const profile = data || {};
        const userObj = (profile.user && typeof profile.user === 'object') ? profile.user : null;
        // @ts-ignore - handling backend inconsistency where user might be ID or object
        const userIdVal = userObj?.id ?? (typeof profile.user === 'number' ? profile.user : null) ?? null;
        setUserId(userIdVal);

        const usernameFallback = (userObj?.username || profile.username || (userObj?.email || profile.email || '').split('@')[0] || '').toString();

        const maybeFirst = (userObj && (userObj.first_name || (userObj as any).firstname)) || profile.first_name || profile.firstname || usernameFallback;
        let maybeLast = (userObj && (userObj.last_name || (userObj as any).lastname)) || profile.last_name || profile.lastname || '';
        if (!maybeLast && usernameFallback) {
          // derive last name from username if possible
          const uname = usernameFallback;
          const delim = uname.includes('.') ? '.' : (uname.includes('_') ? '_' : (uname.includes('-') ? '-' : null));
          if (delim) {
            const parts = uname.split(delim).filter(Boolean);
            if (parts.length >= 2) maybeLast = parts.slice(-1).join(' ');
          } else {
            const parts = uname.split(/\s+/).filter(Boolean);
            if (parts.length >= 2) maybeLast = parts.slice(-1).join(' ');
          }
        }
        setFirstname(maybeFirst.toString());
        setLastname(maybeLast.toString());

        // if names missing, try a robust fallback to agents list which may expose full name variants
        if (!maybeFirst || !maybeLast) {
          try {
            const list = await usersService.getAgents();
            if (Array.isArray(list) && list.length > 0) {
              const matches = list.filter((it: any) => {
                const candidateProfileId = String(it.id ?? it.profile_id ?? it.user_profile_id ?? '');
                const candidateUserId = String(it.user?.id ?? it.user_id ?? it.uid ?? '');
                const candidateUsername = String(it.user?.username ?? it.username ?? it.user_name ?? '');
                const candidateEmailLocal = String((it.user?.email || it.email || '').split('@')[0] || '');

                const targetProfileId = String(profile.id ?? profile.profile_id ?? '');
                const targetUserId = String(userIdVal ?? '');
                const targetUsername = String(id || profile.username || userObj?.username || '');

                return candidateProfileId === targetProfileId || (candidateUserId && candidateUserId === targetUserId) || (candidateUsername && candidateUsername === targetUsername) || (candidateEmailLocal && candidateEmailLocal === targetUsername);
              });
              const match = matches[0];
              if (match) {
                const possibleName = match.name || match.full_name || match.displayName || match.display_name || match.nom || match.prenom || match.label || '';
                if (possibleName) {
                  const parts = possibleName.split(/\s+/).filter(Boolean);
                  if (parts.length === 1) {
                    if (!maybeFirst) setFirstname(parts[0]);
                  } else if (parts.length >= 2) {
                    if (!maybeFirst) setFirstname(parts.slice(0, -1).join(' '));
                    if (!maybeLast) setLastname(parts.slice(-1).join(' '));
                  }
                } else if (match.user && typeof match.user === 'object') {
                  if (!maybeFirst) setFirstname(((match.user as any).first_name || (match.user as any).firstname || '').toString());
                  if (!maybeLast) setLastname(((match.user as any).last_name || (match.user as any).lastname || '').toString());
                }
              }
            }
          } catch (e) {
            // ignore fallback errors
          }
        }
        setUserId(userIdVal);
        const rawPhone = (userObj as any)?.phone || userObj?.phone_number || profile.phone || profile.phone_number || '';
        if (rawPhone && rawPhone.startsWith('+')) {
          // assume country codes are 3 digits for our region
          const cc = rawPhone.substring(1, 4);
          setCountryCode(cc);
          setPhone(rawPhone.substring(4).replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim());
        } else {
          setPhone((rawPhone || '').toString().replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim());
        }
        setTricyclePlate(profile.tricycle_plate || profile.tricycle?.immatriculation || profile.immatriculation || profile.tricycle?.plate || '');
        const usernameKey = userObj?.username || profile.username || (userObj?.email || profile.email || '').split('@')?.[0] || '';
        setIdentificationNumber((profile.identification_number || profile.identificationNumber || '') || (usernameKey ? (localStorage.getItem(`agent_ident_${usernameKey}`) || '') : ''));
      } catch (err: any) {
        console.error('failed fetch agent', err);
        // try fallback: cached agent created recently in UI
        setError('Impossible de charger les données de l\'agent. ' + (err?.message || JSON.stringify(err)));
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
      const rawDigits = phone.replace(/\D/g, '');
      if (tricyclePlate && !isValidPlate(tricyclePlate)) {
        setError('La plaque tricycle doit respecter le format AB-12-34');
        setSaving(false);
        return;
      }

      // Update user fields if we have a user id
      if (userId) {
        await usersService.updateUser(userId, {
          first_name: firstname,
          last_name: lastname,
          phone_number: rawDigits ? `+${countryCode}${rawDigits}` : undefined,
        });
      }

      // Update agent profile (other fields)
      await usersService.updateAgent(id, {
        identification_number: identificationNumber || undefined,
        tricycle_plate: tricyclePlate || undefined,
      });

      router.push('/agents');
    } catch (err) {
      console.error('update failed', err);
      setError('Impossible d\'enregistrer les modifications.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Modifier l&apos;agent</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div>
            <label className="block text-sm mb-1">N° d&apos;identification</label>
            <Input value={identificationNumber || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm mb-1">Prénom</label>
            <Input value={firstname} onChange={e => setFirstname(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Nom</label>
            <Input value={lastname} onChange={e => setLastname(e.target.value)} />
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
              <Input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim())} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Préfixe {`+${countryCode}`}</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Plaque tricycle</label>
            <Input value={tricyclePlate} onChange={e => setTricyclePlate(e.target.value)} />
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
