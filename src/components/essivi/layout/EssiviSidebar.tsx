"use client";

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    Map,
    Package,
    Settings,
    ShoppingCart,
    Truck,
    UserCircle,
    Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/products', label: 'Produits', icon: Package },
  { path: '/agents', label: 'Agents', icon: Users },
  { path: '/clients', label: 'Clients', icon: UserCircle },
  { path: '/deliveries', label: 'Livraisons', icon: Truck },
  { path: '/orders', label: 'Commandes', icon: ShoppingCart },
  { path: '/reports', label: 'Rapports', icon: FileText },
  { path: '/map', label: 'Carte', icon: Map },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

interface EssiviSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function EssiviSidebar({ collapsed = false, onToggle }: EssiviSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Helper to get display name and role
  const displayName = user ?
    (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username)
    : 'Chargement...';

  const displayRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '';

  // Helper for avatar logic
  const avatarUrl = user?.profile?.photo ||
    (user?.profile?.avatar) || // Fallback if backend field name differs
    null;

  const initials = user?.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : (user?.username?.[0]?.toUpperCase() || 'U');

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col bg-gray-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Image src="/logo/logoicon.png" width={42} height={42} alt="Logo" />

          {!collapsed && (
            <div>
              <h1 className="text-lg text-white font-bold">ESSIVI</h1>
              <p className="text-xs text-gray-400">Distribution d&apos;eau</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-gray-700 p-3">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl.startsWith('http') ? avatarUrl : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-white">{initials}</span>
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={displayName}>{displayName}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{displayRole}</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Toggle button */}
      {onToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-gray-600 bg-gray-800 shadow-md hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-white" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white" />
          )}
        </Button>
      )}
    </aside>
  );
}
