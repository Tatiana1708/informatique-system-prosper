import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Globe,
  HardDrive,
  Laptop,
  Monitor,
  Network,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Categorie, Produit } from '../types';

interface HomePageProps {
  products: Produit[];
  categories: Categorie[];
  setActiveTab: (tab: string) => void;
  onSelectProduct: (product: Produit) => void;
  onSelectCategory: (catId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  setActiveTab,
  onSelectProduct,
  onSelectCategory,
}) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 mt-4 p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-slate-900 to-purple-950/40 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Matériel Officiel & Infrastructures Réseaux</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Informatique System Prosper
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Votre partenaire technologique de confiance en France, en Guyane, au Cameroun et en Côte d’Ivoire. Découvrez notre gamme de processeurs, cartes graphiques, PC portables premium, serveurs et équipements réseaux.
          </p>

          {/* Key Quick Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-700">
              <div className="text-2xl font-extrabold text-blue-400">4 Zones</div>
              <div className="text-xs text-slate-400">France, Guyane, Cameroun, RCI</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-700">
              <div className="text-2xl font-extrabold text-emerald-400">100% Certifié</div>
              <div className="text-xs text-slate-400">Garanties constructeurs officielles</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-700 col-span-2 sm:col-span-1">
              <div className="text-2xl font-extrabold text-purple-400">Support 24/7</div>
              <div className="text-xs text-slate-400">Maintenance & Réseau d'entreprise</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('produits')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <span>Explorer Nos Produits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('a-propos')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition"
            >
              <span>Découvrir la Société</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Category Explorer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Parcourir par Catégorie
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Des composants informatiques de pointe aux solutions réseaux pour entreprises.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Voir toutes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md cursor-pointer transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                {cat.nom.includes('Composants') && <Cpu className="w-5 h-5" />}
                {cat.nom.includes('Ordinateurs') && <Laptop className="w-5 h-5" />}
                {cat.nom.includes('Écrans') && <Monitor className="w-5 h-5" />}
                {cat.nom.includes('Accessoires') && <HardDrive className="w-5 h-5" />}
                {cat.nom.includes('Réseaux') && <Network className="w-5 h-5" />}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                {cat.nom}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
              <div className="mt-3 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <span>{cat.nombreProduits || 1} références</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Produits à la Une
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sélection de nos composants et équipements les plus demandés.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('produits')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Voir tout le catalogue ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((produit) => (
            <ProductCard key={produit.id} produit={produit} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* Domain Expertise Cards */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Nos Domaines d'Expertise
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Des prestations sur-mesure pour accompagner votre croissance et sécuriser vos systèmes d’information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Vente de Matériel Informatique</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distribution officielle de composants haute performance (SSD, GPU, processeurs), portables professionnels, moniteurs et accessoires sous garanties constructeurs officielles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Maintenance & Réparation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diagnostics express, réparation matérielle, optimisation logicielle et dépannage sur site ou en atelier avec un taux de résolution de premier niveau garanti.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Installation Réseau & Infrastructure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conception de baies de brassage, câblage structuré Ethernet/Fibre, déploiement de réseaux Wi-Fi 6E/7 professionnels et sécurisation des accès distants VPN/Pare-feu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footprint */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Zones d'Intervention Internationales
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Présence stratégique en Europe, en Amérique du Sud et en Afrique de l'Ouest.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('a-propos')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>En savoir plus sur nos agences</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-400">France</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                Siège Social
              </span>
            </div>
            <p className="text-xs text-slate-300">17 Avenue Leon Blum, 94230 Cachan</p>
            <p className="text-[11px] text-slate-400">Direction générale & HUB logistique Europe</p>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400">Guyane</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                Territoire
              </span>
            </div>
            <p className="text-xs text-slate-300">Cayenne & Kourou</p>
            <p className="text-[11px] text-slate-400">Matériel & maintenance sur site</p>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-400">Cameroun</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                Agence Régionale
              </span>
            </div>
            <p className="text-xs text-slate-300">Douala (Akwa)</p>
            <p className="text-[11px] text-slate-400">Distribution & Intégration Afrique Centrale</p>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-purple-400">Côte d'Ivoire</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                Agence Régionale
              </span>
            </div>
            <p className="text-xs text-slate-300">Abidjan (Plateau)</p>
            <p className="text-[11px] text-slate-400">Infrastructures réseaux Afrique de l'Ouest</p>
          </div>
        </div>
      </section>
    </div>
  );
};
