import React, { useEffect, useState } from 'react';
import { Mail, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { Client } from '../types';

export const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await api.getClients();
        setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = c.user?.nom.toLowerCase().includes(q);
    const emailMatch = c.user?.email.toLowerCase().includes(q);
    return nameMatch || emailMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Gestion des Clients
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Suivi des acheteurs, de leur volume de commandes et de leur chiffre d'affaires cumulé.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Recherche client par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total : <strong className="text-slate-900">{filteredClients.length} clients</strong>
        </div>
      </div>

      {/* Table Section (Required Columns: Nom, Email, Nombre de commandes, Total dépensé, Statut, Date d'inscription) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Nombre de commandes</th>
                <th className="p-4 text-right">Total dépensé</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date d'inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Chargement des clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Aucun client enregistré.
                  </td>
                </tr>
              ) : (
                filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">{c.user?.nom || 'Client Anonyme'}</td>
                    <td className="p-4 text-slate-600">{c.user?.email || 'N/A'}</td>
                    <td className="p-4 text-center font-bold text-blue-600">
                      {c.nombreCommandes}
                    </td>
                    <td className="p-4 text-right font-black text-slate-900">
                      {c.totalDepense.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                        {c.statut}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {c.user?.dateInscription || '2024-03-01'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
