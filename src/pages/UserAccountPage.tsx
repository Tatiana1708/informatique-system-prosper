import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Commande } from '../types';

export const UserAccountPage: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUserOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Client</h1>
        <p className="text-xs text-slate-500 mt-1">
          Gérez votre profil et consultez le suivi détaillé de vos commandes d’équipements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 h-fit">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              {currentUser.nom.charAt(0)}
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">{currentUser.nom}</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
                Statut : {currentUser.statut}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Rôle : <strong className="text-slate-800">{currentRole}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Membre depuis le : {currentUser.dateInscription}</span>
            </div>
          </div>
        </div>

        {/* Mes Commandes Section (Required Columns: Référence, Quantité, Prix unitaire, Prix total, Statut) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span>Mes Commandes & Historique d'Achats</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                {orders.length} commande(s)
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Chargement des commandes...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">Aucune commande enregistrée.</div>
            ) : (
              <div className="space-y-6">
                {orders.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="border border-slate-200/80 rounded-2xl p-5 space-y-4 bg-slate-50/50 hover:bg-white transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Référence</span>
                        <span className="font-extrabold text-blue-600 text-sm">{cmd.reference}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Date</span>
                        <span className="text-xs font-bold text-slate-700">{cmd.date}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Statut Commande</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            cmd.statut === 'Livrée'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cmd.statut === 'Expédiée'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {cmd.statut}
                        </span>
                      </div>
                    </div>

                    {/* Lignes de commande table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                            <th className="pb-2">Produit</th>
                            <th className="pb-2 text-center">Quantité</th>
                            <th className="pb-2 text-right">Prix unitaire</th>
                            <th className="pb-2 text-right">Prix total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {cmd.lignes.map((ligne) => (
                            <tr key={ligne.id}>
                              <td className="py-2.5">
                                <div className="font-bold text-slate-900">
                                  {ligne.produit?.nom || 'Équipement Informatique'}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {ligne.produit?.marque} {ligne.produit?.modele}
                                </div>
                              </td>
                              <td className="py-2.5 text-center font-bold">{ligne.quantite}</td>
                              <td className="py-2.5 text-right">
                                {ligne.prixUnitaire.toLocaleString('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR',
                                })}
                              </td>
                              <td className="py-2.5 text-right font-bold text-blue-600">
                                {ligne.prixTotal.toLocaleString('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR',
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Paiement : <strong className="text-slate-800">{cmd.statutPaiement}</strong></span>
                      <div>
                        <span className="text-slate-500 mr-2">Total Commande :</span>
                        <span className="font-black text-slate-900 text-sm">
                          {cmd.montantTotal.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
