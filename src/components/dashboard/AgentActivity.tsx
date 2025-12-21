'use client';

import { User, CheckCircle, Clock, PauseCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import usersService from '@/services/users.service';

const statusIcons = {
  'Actif': <CheckCircle className="h-3.5 w-3.5 text-green-500" />,
  'En pause': <PauseCircle className="h-3.5 w-3.5 text-yellow-500" />,
  'Inactif': <XCircle className="h-3.5 w-3.5 text-red-500" />,
};

export function AgentActivity() {
  const [agents, setAgents] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await usersService.getAgents();
        if (!mounted) return;
        if (Array.isArray(resp)) setAgents(resp.slice(0, 8));
      } catch (e) {
        // keep empty
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Activité des agents</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {agents.map((a) => (
          <div key={a.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={a.photoUrl || `/avatars/${a.id}.jpg`} alt={`${a.firstname} ${a.lastname}`} />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {a.firstname} {a.lastname}
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      {a.totalDeliveries ?? 0} livraisons
                    </span>
                    <div className="flex items-center">
                      <svg
                        className={cn(
                          'h-3.5 w-3.5',
                          (a.rating ?? 4) >= 4 ? 'text-yellow-400' : 'text-gray-300',
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">
                        {a.rating ?? 4}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    a.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                    a.status === 'on_delivery' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                  )}>
                    {a.status === 'active' ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : a.status === 'on_delivery' ? <Clock className="h-3.5 w-3.5 text-blue-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                    <span className="ml-1 capitalize">{a.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Voir tous les agents
        </button>
      </div>
    </div>
  );
}
