import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  DollarSign,
  FolderTree,
  Package,
  Server,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { api } from '../services/api';
import { Commande, DashboardStats } from '../types';

interface AdminDashboardPageProps {
  setAdminTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setAdminTab }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUtilisateurs: 4,
    totalProduits: 6,
    totalCommandes: 3,
    chiffreAffairesTotal: 3179.92,
    totalCategories: 5,
    totalClients: 1,
  });

  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    mode: 'mysql' | 'in-memory';
    config: { host: string; port: number; user: string; database: string };
    error?: string;
  }>({
    connected: false,
    mode: 'in-memory',
    config: { host: 'localhost', port: 3306, user: 'root', database: 'informatique_system_prosper' },
  });

  const [recentOrders, setRecentOrders] = useState<Commande[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const s = await api.getDashboardStats();
        setStats(s);
        const ords = await api.getOrders();
        setRecentOrders(ords.slice(0, 5));
        const db = await api.getDbStatus();
        setDbStatus(db);
      } catch (err) {
        console.error(err);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Tableau de Bord Administrateur
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Aperçu analytique global d'Informatique System Prosper.
        </p>
      </div>

      {/* 6 Key Metrics Cards Matching Prompt Spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Metric 1: Total Users */}
        <div
          onClick={() => setAdminTab('utilisateurs')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 cursor-pointer transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nombre total d'utilisateurs
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalUtilisateurs}</div>
          <div className="text-[11px] text-slate-400 font-medium">Admin, Vendeurs & Clients</div>
        </div>

        {/* Metric 2: Total Products */}
        <div
          onClick={() => setAdminTab('produits')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 cursor-pointer transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nombre total de produits
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalProduits}</div>
          <div className="text-[11px] text-slate-400 font-medium">Référence matériel certifiées</div>
        </div>

        {/* Metric 3: Total Orders */}
        <div
          onClick={() => setAdminTab('commandes')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 cursor-pointer transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nombre total de commandes
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalCommandes}</div>
          <div className="text-[11px] text-slate-400 font-medium">Commandes enregistrées</div>
        </div>

        {/* Metric 4: Total Revenue (3 179,92 €) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chiffre d'affaires total
            </span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.chiffreAffairesTotal.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Chiffre d'affaires cumulé</span>
          </div>
        </div>

        {/* Metric 5: Total Categories */}
        <div
          onClick={() => setAdminTab('categories')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 cursor-pointer transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nombre de catégories
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalCategories}</div>
          <div className="text-[11px] text-slate-400 font-medium">Composants, Laptops, Réseaux...</div>
        </div>

        {/* Metric 6: Total Clients */}
        <div
          onClick={() => setAdminTab('clients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 cursor-pointer transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nombre total de clients
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalClients}</div>
          <div className="text-[11px] text-slate-400 font-medium">Comptes acheteurs actifs</div>
        </div>
      </div>

      {/* Database Connection Status Section */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${dbStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-white">Statut de la Base de Données MySQL</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${dbStatus.connected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  {dbStatus.mode === 'mysql' ? 'MySQL Connecté' : 'Mode Mémoire Volatile'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {dbStatus.connected
                  ? `Connexion active sur ${dbStatus.config.host}:${dbStatus.config.port} — BDD: ${dbStatus.config.database}`
                  : 'Exécution avec fallback mémoire local. Pour connecter votre instance MySQL, configurez les variables d\'environnement dans le panneau Secrets.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {dbStatus.connected ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                Opérationnel
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                Fallback Actif
              </span>
            )}
          </div>
        </div>

        {/* Configuration Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Hôte / Host</span>
            <span className="font-mono text-slate-200 font-semibold mt-0.5 block">{dbStatus.config.host}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Port</span>
            <span className="font-mono text-slate-200 font-semibold mt-0.5 block">{dbStatus.config.port}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Utilisateur / User</span>
            <span className="font-mono text-slate-200 font-semibold mt-0.5 block">{dbStatus.config.user}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Base de données</span>
            <span className="font-mono text-slate-200 font-semibold mt-0.5 block">{dbStatus.config.database}</span>
          </div>
        </div>

        {/* Schema Table List */}
        <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Tables gérées : <strong className="text-slate-200">users</strong>, <strong className="text-slate-200">categories</strong>, <strong className="text-slate-200">products</strong>, <strong className="text-slate-200">clients</strong>, <strong className="text-slate-200">orders</strong>, <strong className="text-slate-200">order_lines</strong></span>
          </div>
          <span className="text-slate-500 font-mono">Pilote: mysql2/promise</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base">Commandes Récentes</h2>
          <button
            onClick={() => setAdminTab('commandes')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Voir toutes les commandes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">Référence</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Montant Total</th>
                <th className="pb-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-blue-600">{o.reference}</td>
                  <td className="py-3">{o.clientNom}</td>
                  <td className="py-3 text-slate-500">{o.date}</td>
                  <td className="py-3 text-right font-extrabold text-slate-900">
                    {o.montantTotal.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        o.statut === 'Livrée'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.statut === 'Expédiée'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
