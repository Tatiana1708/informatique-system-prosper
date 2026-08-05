import React from 'react';
import {
  ArrowLeft,
  Briefcase,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminSidebarProps {
  adminTab: string;
  setAdminTab: (tab: string) => void;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  adminTab,
  setAdminTab,
  setActiveTab,
}) => {
  const { currentRole } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'utilisateurs', label: 'Gestion Utilisateurs', icon: Users },
    { id: 'clients', label: 'Gestion Clients', icon: UserCheck },
    { id: 'commandes', label: 'Gestion Commandes', icon: ShoppingBag },
    { id: 'categories', label: 'Gestion Catégories', icon: FolderTree },
    { id: 'produits', label: 'Gestion Produits', icon: Package },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800">
      <div className="p-4">
        {/* Admin Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800 mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
            ADM
          </div>
          <div>
            <div className="font-extrabold text-white text-sm">Console Admin</div>
            <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
              Mode {currentRole}
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Return to Front-Office Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setActiveTab('home')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la Boutique</span>
        </button>
      </div>
    </aside>
  );
};
