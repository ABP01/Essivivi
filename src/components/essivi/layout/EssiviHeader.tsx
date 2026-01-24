"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Bell, Menu, RefreshCw, Search, Wifi, WifiOff } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import usersService from '@/services/users.service';

interface EssiviHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function EssiviHeader({ onMenuClick, showMenuButton = false }: EssiviHeaderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const [adminName, setAdminName] = useState<string>('Admin User');
  const [notificationsData, setNotificationsData] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [u, notfis] = await Promise.all([
          usersService.getCurrentUser(),
          // Assuming salesService is imported or available to be imported
          // We need to import salesService if not present.
          // Checked file content, it is NOT imported. Only usersService is imported.
          import('@/services/sales.service').then(m => m.default.getNotifications())
        ]);

        if (!mounted) return;
        const name = (u?.first_name || u?.username || '') + (u?.last_name ? ` ${u.last_name}` : '');
        setAdminName(name || 'Admin User');
        if (Array.isArray(notfis)) {
          setNotificationsData(notfis as any[]);
        }
      } catch (e) {
        // keep default
      }
    })();
    return () => { mounted = false; };
  }, []);

  const notifications = notificationsData;
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 lg:px-6">
      {showMenuButton && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Search */}
      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher agents, clients, livraisons..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus-visible:ring-1"
            aria-label="Recherche globale"
          />
        </div>
      </div>

      {/* Spacer to push icons to the right */}
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Sync Status */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative',
            !isOnline && 'text-red-600'
          )}
          onClick={handleSync}
          title={isSyncing ? 'Synchronisation...' : isOnline ? 'Connecté - Synchronisé' : 'Hors ligne'}
        >
          {isOnline ? (
            isSyncing ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Wifi className="h-5 w-5 text-green-600" />
            )
          ) : (
            <WifiOff className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 text-white"
              >
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Notifications</span>
                <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                  Tout marquer lu
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex flex-col gap-1 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                      !notification.read && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                  >
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                  Voir toutes les notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
                alt="Admin"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{adminName}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium px-2">Mon compte</p>
              </div>
              <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Profil
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Paramètres
                </button>
              </div>
              <div className="p-1 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full text-left px-3 py-2 text-sm rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
