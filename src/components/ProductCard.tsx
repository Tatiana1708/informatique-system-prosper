import React from 'react';
import { Eye, ShieldCheck, ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Produit } from '../types';

interface ProductCardProps {
  produit: Produit;
  onSelectProduct: (product: Produit) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ produit, onSelectProduct }) => {
  const { addToCart } = useCart();

  const isAvailable = produit.stock > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Thumbnail Container */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <img
          src={produit.image}
          alt={produit.nom}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
              isAvailable
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {produit.disponibilite}
          </span>
        </div>

        {/* Brand Pill */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
          {produit.marque}
        </div>

        {/* Quick View Button */}
        <button
          onClick={() => onSelectProduct(produit)}
          className="absolute right-3 bottom-3 p-2 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-800 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          title="Voir les détails"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
            <Tag className="w-3 h-3 text-blue-500" />
            <span>{produit.categorieNom || 'Informatique'}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(produit)}
            className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 cursor-pointer transition"
          >
            {produit.nom}
          </h3>

          {/* Model info */}
          <p className="text-xs text-slate-500 mt-1">
            Modèle : <span className="font-semibold text-slate-700">{produit.modele}</span>
          </p>
        </div>

        {/* Specs & Warranty */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>{produit.garantie}</span>
          </span>
          <span className="font-medium text-slate-600">Stock : {produit.stock}</span>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Prix TTC</span>
            <span className="text-lg font-black text-slate-900">
              {produit.prix.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectProduct(produit)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Explorer
            </button>
            <button
              disabled={!isAvailable}
              onClick={() => addToCart(produit, 1)}
              className={`p-2 rounded-xl text-white font-semibold flex items-center gap-1 transition ${
                isAvailable
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
              title={isAvailable ? 'Ajouter au panier' : 'Rupture de stock'}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
