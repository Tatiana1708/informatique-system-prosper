import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  Filter,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Commande, OrderStatus } from '../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Commande | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders(statusFilter);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, nextStatus: OrderStatus) => {
    await api.updateOrderStatus(id, nextStatus);
    loadOrders();
    if (selectedOrderDetails && selectedOrderDetails.id === id) {
      setSelectedOrderDetails({ ...selectedOrderDetails, statut: nextStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Gestion des Commandes
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Suivi, expédition et annulation des commandes clients.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Filtrer par statut :</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Expédiée">Expédiée</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>

        <button
          onClick={loadOrders}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Table Section (Required Columns: Référence, Client, Date, Montant, Statut, Paiement) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">Référence</th>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Paiement</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chargement des commandes...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-blue-600">{o.reference}</td>
                    <td className="p-4">{o.clientNom}</td>
                    <td className="p-4 text-slate-500">{o.date}</td>
                    <td className="p-4 text-right font-black text-slate-900">
                      {o.montantTotal.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          o.statut === 'Livrée'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.statut === 'Expédiée'
                            ? 'bg-blue-100 text-blue-800'
                            : o.statut === 'Annulée'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.statut}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {o.statutPaiement}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedOrderDetails(o)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                        title="Voir les détails"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'Expédiée')}
                        disabled={o.statut === 'Expédiée' || o.statut === 'Livrée' || o.statut === 'Annulée'}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg transition disabled:opacity-40"
                        title="Marquer comme Expédiée"
                      >
                        Expédier
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'Annulée')}
                        disabled={o.statut === 'Annulée' || o.statut === 'Livrée'}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg transition disabled:opacity-40"
                        title="Annuler la commande"
                      >
                        Annuler
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Détails Commande : {selectedOrderDetails.reference}
                </h3>
                <p className="text-xs text-slate-500">Client : {selectedOrderDetails.clientNom}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block font-medium">Adresse de livraison :</span>
                <span className="font-bold text-slate-800">{selectedOrderDetails.adresseLivraison}</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Produit</th>
                      <th className="p-2.5 text-center">Quantité</th>
                      <th className="p-2.5 text-right">Prix Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderDetails.lignes.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-bold text-slate-800">{l.produit?.nom || 'Produit'}</td>
                        <td className="p-2.5 text-center">{l.quantite}</td>
                        <td className="p-2.5 text-right font-bold text-blue-600">
                          {l.prixTotal.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-900">
                Total :{' '}
                {selectedOrderDetails.montantTotal.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
