"use client";

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockDeliveries } from '@/lib/essivi-mock';
import { Camera, Check, History, MapPin, Play, Plus, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

// Composant défini en dehors du render
function SyncStatusIndicator({ syncStatus }: { syncStatus: 'synced' | 'pending' | 'offline' }) {
  const config = {
    synced: { icon: Wifi, color: 'text-green-400', label: 'Synchronisé' },
    pending: { icon: Wifi, color: 'text-amber-400', label: 'En attente...' },
    offline: { icon: WifiOff, color: 'text-red-400', label: 'Hors ligne' },
  };
  const { icon: Icon, color, label } = config[syncStatus];
  return (
    <div className={`flex items-center gap-1 text-xs ${color}`}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}

export default function MobileDelivererPage() {
  const [activeTab, setActiveTab] = useState<'start' | 'new' | 'history'>('start');
  const [syncStatus] = useState<'synced' | 'pending' | 'offline'>('synced');
  const todayDeliveries = mockDeliveries.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">ESSIVI Livreur</h1>
            <p className="text-sm opacity-80">Kofi Mensah</p>
          </div>
          <SyncStatusIndicator syncStatus={syncStatus} />
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-4">
        {activeTab === 'start' && (
          <>
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 rounded-xl">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h2 className="text-xl font-bold mb-2">Démarrer la tournée</h2>
                <p className="text-sm opacity-80 mb-4">5 livraisons prévues aujourd&apos;hui</p>
                <button className="w-full py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Play className="h-5 w-5" /> Commencer
                </button>
              </div>
            </Card>

            <h3 className="font-semibold text-gray-900 dark:text-white">Livraisons du jour</h3>
            {todayDeliveries.map(d => (
              <Card key={d.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{d.clientName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {d.address}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {d.quantity.vitale + d.quantity.voltic} sachets
                  </Badge>
                </div>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'new' && (
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nouvelle livraison</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Position GPS: 6.1319, 1.2228</span>
              </div>
              <button className="w-full py-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Camera className="h-4 w-4" /> Prendre photo
              </button>
              <button className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Check className="h-4 w-4" /> Valider livraison
              </button>
            </div>
          </Card>
        )}

        {activeTab === 'history' && (
          <>
            <h3 className="font-semibold text-gray-900 dark:text-white">Historique</h3>
            {mockDeliveries.filter(d => d.status === 'completed').slice(0, 10).map(d => (
              <Card key={d.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{d.clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(d.timestamp).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="font-semibold text-green-600 dark:text-green-400">{d.amount} FCFA</span>
              </Card>
            ))}
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around">
        {[
          { id: 'start', icon: Play, label: 'Tournée' },
          { id: 'new', icon: Plus, label: 'Nouvelle' },
          { id: 'history', icon: History, label: 'Historique' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)} 
            className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
