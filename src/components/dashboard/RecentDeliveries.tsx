'use client';

import { CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';
import { recentDeliveries } from '@/lib/mock-data/dashboard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusIcons = {
  'Livré': <CheckCircle className="h-4 w-4 text-green-500 mr-2" />,
  'En cours': <Clock className="h-4 w-4 text-blue-500 mr-2" />,
  'En attente': <Clock className="h-4 w-4 text-yellow-500 mr-2" />,
  'En retard': <AlertCircle className="h-4 w-4 text-red-500 mr-2" />,
};

const statusColors = {
  'Livré': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
  'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
  'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
  'En retard': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
};

export function RecentDeliveries() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Livraisons récentes</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentDeliveries.map((delivery) => (
          <div key={delivery.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {statusIcons[delivery.status as keyof typeof statusIcons]}
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {delivery.client}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {delivery.address}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[delivery.status as keyof typeof statusColors]} mr-3`}>
                  {delivery.status}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {delivery.time}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Ouvrir le menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Suivre la livraison
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      Annuler la livraison
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" className="w-full">
          Voir toutes les livraisons
        </Button>
      </div>
    </div>
  );
}
