import React from 'react';
import { ArrowRight, Cpu, FolderTree, HardDrive, Laptop, Monitor, Network } from 'lucide-react';
import { Categorie } from '../types';

interface CategoriesPageProps {
  categories: Categorie[];
  onSelectCategory: (catId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Nos Catégories d'Équipements Informatiques
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explorez nos 5 univers spécialisés du matériel informatique et des infrastructures d’entreprise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400 cursor-pointer transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition">
                {cat.nom.includes('Composants') && <Cpu className="w-6 h-6" />}
                {cat.nom.includes('Ordinateurs') && <Laptop className="w-6 h-6" />}
                {cat.nom.includes('Écrans') && <Monitor className="w-6 h-6" />}
                {cat.nom.includes('Accessoires') && <HardDrive className="w-6 h-6" />}
                {cat.nom.includes('Réseaux') && <Network className="w-6 h-6" />}
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition">
                {cat.nom}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>{cat.nombreProduits || 1} références disponibles</span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Parcourir</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
