import React, { useMemo, useState } from 'react';
import { Filter, RefreshCw, Search, SlidersHorizontal, Tag, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Categorie, Produit } from '../types';

interface ProductsPageProps {
  products: Produit[];
  categories: Categorie[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  onSelectProduct: (product: Produit) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
}) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('Toutes');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.marque))).filter(Boolean);
    return ['Toutes', ...list];
  }, [products]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.nom.toLowerCase().includes(q);
        const matchBrand = p.marque.toLowerCase().includes(q);
        const matchModel = p.modele.toLowerCase().includes(q);
        const matchCat = p.categorieNom?.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchModel && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== 'Toutes' && selectedCategory !== '') {
        const catObj = categories.find((c) => c.id === selectedCategory);
        if (catObj && p.categorieId !== catObj.id && p.categorieNom !== catObj.nom) {
          return false;
        }
      }

      // Brand
      if (selectedBrand !== 'Toutes' && p.marque !== selectedBrand) {
        return false;
      }

      // Min Price
      if (minPrice !== '' && !isNaN(Number(minPrice)) && p.prix < Number(minPrice)) {
        return false;
      }

      // Max Price
      if (maxPrice !== '' && !isNaN(Number(maxPrice)) && p.prix > Number(maxPrice)) {
        return false;
      }

      // In Stock Only
      if (onlyInStock && p.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [products, categories, searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, onlyInStock]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Toutes');
    setSelectedBrand('Toutes');
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Catalogue de Produits Informatiques
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Recherchez et filtrez nos équipements certifiés (SSD, Cartes Graphiques, PC Portables, Écrans, Accessoires, Réseaux).
          </p>
        </div>
        {/* <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl">
          <Tag className="w-4 h-4 text-blue-600" />
          <span>{filteredProducts.length} produits trouvés sur {products.length}</span>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filtres de recherche</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          </div>

          {/* Search input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Mots-clés / Modèle</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: RTX 4070, 980 PRO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Marque / Constructeur</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Tranche de Prix (€)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min €"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max €"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stock Availability Filter */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Afficher uniquement les produits en stock</span>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Aucun produit ne correspond</h3>
              <p className="text-xs text-slate-500">
                Essayez de réinitialiser les filtres ou de modifier votre terme de recherche.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((produit) => (
                <ProductCard key={produit.id} produit={produit} onSelectProduct={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
