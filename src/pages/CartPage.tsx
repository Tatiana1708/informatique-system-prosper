import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface CartPageProps {
  setActiveTab: (tab: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setActiveTab }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { currentUser } = useAuth();

  const [adresseLivraison, setAdresseLivraison] = useState('12 Rue de la République, 75011 Paris');
  const [modePaiement, setModePaiement] = useState('Carte Bancaire');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const order = await api.createOrder({
        items: cart,
        adresseLivraison,
        clientNom: currentUser.nom,
        clientEmail: currentUser.email,
      });

      setCompletedOrder(order);
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Commande Confirmée !</h1>
          <p className="text-xs text-slate-500">
            Merci pour votre achat chez Informatique System Prosper. Votre facture et le suivi sont enregistrés.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
            <span className="text-slate-500">Référence Commande</span>
            <span className="font-extrabold text-blue-600 text-sm">{completedOrder.reference}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
            <span className="text-slate-500">Montant Total Réglé</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {completedOrder.montantTotal.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Adresse de livraison</span>
            <span className="font-medium text-slate-800">{completedOrder.adresseLivraison}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('compte')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Suivre ma commande
          </button>
          <button
            onClick={() => {
              setCompletedOrder(null);
              setActiveTab('produits');
            }}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Votre panier est vide</h2>
        <p className="text-xs text-slate-500">
          Vous n'avez pas encore ajouté d'équipements informatiques à votre panier.
        </p>
        <button
          onClick={() => setActiveTab('produits')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20"
        >
          Découvrir nos produits
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Votre Panier</h1>
        <p className="text-xs text-slate-500 mt-1">
          Vérifiez vos articles, saisissez votre adresse et procédez à la validation de commande.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.produit.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.produit.image}
                  alt={item.produit.nom}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {item.produit.nom}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {item.produit.marque} • Modèle : {item.produit.modele}
                  </p>
                  <p className="text-xs font-extrabold text-blue-600 mt-1">
                    {item.produit.prix.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}{' '}
                    / un.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                {/* Quantity buttons */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => updateQuantity(item.produit.id, item.quantite - 1)}
                    className="w-7 h-7 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-200 transition text-xs"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-xs text-slate-900">{item.quantite}</span>
                  <button
                    onClick={() => updateQuantity(item.produit.id, item.quantite + 1)}
                    className="w-7 h-7 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-200 transition text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[90px]">
                  <span className="text-[10px] text-slate-400 font-medium block">Total ligne</span>
                  <span className="font-black text-slate-900 text-sm">
                    {(item.produit.prix * item.quantite).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.produit.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  title="Supprimer la ligne"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 h-fit">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Récapitulatif de Commande
          </h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Adresse de Livraison</span>
              </label>
              <textarea
                rows={2}
                required
                value={adresseLivraison}
                onChange={(e) => setAdresseLivraison(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Mode de Paiement</span>
              </label>
              <select
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              >
                <option value="Carte Bancaire">Carte Bancaire (Visa / Mastercard)</option>
                <option value="Virement Bancaire">Virement Bancaire Sécurisé</option>
                <option value="Paiement 3X">Paiement 3X sans frais</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Sous-total articles</span>
                <span>
                  {totalPrice.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Frais de port (Express)</span>
                <span className="text-emerald-600 font-bold">Gratuit</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t border-slate-100">
                <span>Total TTC</span>
                <span className="text-blue-600">
                  {totalPrice.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Validation en cours...' : 'Valider & Payer la Commande'}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Paiement crypté SSL & Facture automatique</span>
          </div>
        </div>
      </div>
    </div>
  );
};
