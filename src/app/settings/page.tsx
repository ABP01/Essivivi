"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import { Card } from '@/components/ui/card';
import { Bell, Building2, Globe, MapPin, Save, Shield } from 'lucide-react';
import { useState } from 'react';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'delivery' | 'security'>('general');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configurez les paramètres de l&apos;application
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {[
            { id: 'general', label: 'Général' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'delivery', label: 'Livraisons' },
            { id: 'security', label: 'Sécurité' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informations entreprise</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Informations générales de ESSIVI-Sarl</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l&apos;entreprise</label>
                  <input type="text" defaultValue="ESSIVI-Sarl" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone</label>
                  <input type="text" defaultValue="+228 22 XX XX XX" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adresse</label>
                <input type="text" defaultValue="Lomé, Togo" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email de contact</label>
                <input type="email" defaultValue="contact@essivi.tg" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Localisation</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Langue</label>
                  <select defaultValue="fr" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Devise</label>
                  <select defaultValue="xof" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="xof">FCFA (XOF)</option>
                    <option value="eur">Euro (EUR)</option>
                    <option value="usd">Dollar (USD)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fuseau horaire</label>
                <select defaultValue="africa/lome" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="africa/lome">Africa/Lomé (GMT+0)</option>
                  <option value="europe/paris">Europe/Paris (GMT+1)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Préférences de notification</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Nouvelles commandes', desc: 'Notification à chaque nouvelle commande', default: true },
              { label: 'Livraisons terminées', desc: 'Confirmation de livraison des agents', default: true },
              { label: 'Alertes stock', desc: 'Alertes quand le stock est faible', default: true },
              { label: 'Notifications par email', desc: 'Recevoir les notifications par email', default: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={item.default} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Delivery Tab */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paramètres de livraison</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Validation GPS', desc: 'Exiger la validation de position GPS lors des livraisons', default: true },
                { label: 'Photo obligatoire', desc: 'Exiger une photo à chaque livraison', default: true },
                { label: 'Signature obligatoire', desc: 'Exiger la signature du client', default: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={item.default} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </div>
              ))}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Distance maximale de validation (mètres)</label>
                <input type="number" defaultValue="50" className="w-full max-w-[200px] px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Distance maximale entre l&apos;agent et le client pour valider une livraison</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tarification</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Prix par défaut des produits (FCFA)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vitale (sachet)</label>
                <input type="number" defaultValue="500" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Voltic (sachet)</label>
                <input type="number" defaultValue="600" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Autres (sachet)</label>
                <input type="number" defaultValue="400" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sécurité</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs (2FA)</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Exiger un code SMS lors de la connexion</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 py-3 border-b border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiration de session (minutes)</label>
              <input type="number" defaultValue="60" className="w-full max-w-[200px] px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Journalisation des actions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enregistrer toutes les actions des utilisateurs</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );

}

export default function ProtectedSettingsPage() {
  return (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  );
}
