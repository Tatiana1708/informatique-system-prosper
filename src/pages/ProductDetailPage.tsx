import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Produit } from '../types';

interface ProductDetailPageProps {
  produit: Produit;
  allProducts: Produit[];
  onBack: () => void;
  onSelectProduct: (product: Produit) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  produit,
  allProducts,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const [quantite, setQuantite] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const isAvailable = produit.stock > 0;

  const handleAddToCart = () => {
    addToCart(produit, quantite);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  // Find similar products in same category
  const similarProducts = allProducts
    .filter((p) => p.id !== produit.id && p.categorieId === produit.categorieId)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux produits</span>
      </button>

      {/* Main Product Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-4/3 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative">
            <img
              src={produit.image}
              alt={produit.nom}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              {produit.disponibilite}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500 font-medium">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{produit.garantie}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Stock : {produit.stock} un.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-purple-600" />
              <span>Expédition 24h/48h</span>
            </div>
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
              <Tag className="w-3.5 h-3.5" />
              <span>{produit.categorieNom || 'Informatique'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {produit.nom}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Marque : <strong className="text-slate-800">{produit.marque}</strong></span>
              <span>•</span>
              <span>Modèle : <strong className="text-slate-800">{produit.modele}</strong></span>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Prix unitaire TTC</span>
                <span className="text-3xl font-black text-slate-900">
                  {produit.prix.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                TVA Incluse (20%)
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                Description du produit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{produit.description}</p>
            </div>

            {/* Specifications list */}
            {produit.caracteristiques && produit.caracteristiques.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Caractéristiques clés
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  {produit.caracteristiques.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Add To Cart Bar */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Produit ajouté au panier avec succès !</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  disabled={quantite <= 1}
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-3 font-bold text-sm text-slate-900">{quantite}</span>
                <button
                  disabled={quantite >= produit.stock}
                  onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
                  className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <button
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition ${
                  isAvailable
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isAvailable ? `Ajouter au Panier (${(produit.prix * quantite).toFixed(2)} €)` : 'Rupture de Stock'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Produits Similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} produit={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
