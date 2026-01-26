"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';
import usersService from '@/services/users.service';
import { User } from '@/types';
import React, { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await usersService.getCurrentUser();
        setUser(currentUser);
        setFormData({
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          phone_number: currentUser.phone_number || '',
        });
      } catch (error) {
        logger.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Assuming usersService has an update method
      await usersService.updateUser(user.id, formData);
      setUser({ ...user, ...formData });
      logger.info('Profile updated successfully');
    } catch (error) {
      logger.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Utilisateur non trouvé</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profile?.photo || user.photo} alt={user.username} />
              <AvatarFallback>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="phone_number">Téléphone</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}