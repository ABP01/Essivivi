"use client";

import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Bell, Menu, RefreshCw, Search, Wifi, WifiOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EssiviHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function EssiviHeader({ onMenuClick, showMenuButton = false }: EssiviHeaderProps) {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const [notificationsData, setNotificationsData] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch notifications only
        // Assuming salesService is imported or available to be imported
        const notfis = await import('@/services/sales.service').then(m => m.default.getNotifications());

        if (!mounted) return;
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

  const displayName = user ?
    (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username)
    : 'Chargement...';

  const avatarUrl = user?.profile?.photo || user?.photo || null;
  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '';

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
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl.startsWith('http') ? avatarUrl : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-gray-500">
                  {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-gray-500">{displayRole}</p>
            </div>
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium px-2">Mon compte</p>
              </div>
              <div className="p-1">
                <Link href="/profile">
                  <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    Profil
                  </button>
                </Link>
                <Link href="/settings">
                  <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    Paramètres
                  </button>
                </Link>
              </div>
              <div className="p-1 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="w-full text-left px-3 py-2 text-sm rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => logout()}
                >
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
