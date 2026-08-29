import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import {
  Briefcase,
  ChevronDown,
  Globe,
  Info,
  Layers,
  LogIn,
  LogOut,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  User as UserIcon,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Role } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) => {
  const { currentUser, currentRole, isAuthenticated, switchRole, logout } = useAuth();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  const roles: Role[] = ['Admin', 'Vendeur', 'Client'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner with HQ Contact & Quick Role Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-medium">Siège Social :</span>
              <span>17 Ave Leon Blum, 94230 Cachan</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+33 672 096 455</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <button
                  id="header-admin-link"
                  className="ml-2 px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs flex items-center gap-1 transition"
                >
                  <span>En cours</span>
                </button>
            </span>
          </div>

          {/* Role Switcher Badge */}
          {(currentRole === 'Admin') && (
            <div className="relative flex items-center gap-2">
              <span className="text-slate-400 font-medium hidden sm:inline">Rôle actif :</span>
              <div className="relative">
                <button
                  id="role-switcher-btn"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentRole === 'Admin'
                        ? 'bg-purple-500'
                        : currentRole === 'Vendeur'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>{currentRole}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {roleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-slate-800"
                    >
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Changer de vue
                      </div>
                      {roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleDropdownOpen(false);
                            if (r === 'Admin' || r === 'Vendeur') {
                              setActiveTab('admin');
                            }
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                            currentRole === r ? 'font-bold text-blue-600 bg-blue-50/50' : ''
                          }`}
                        >
                          <span>{r}</span>
                          {r === 'Admin' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                              Back-office
                            </span>
                          )}
                          {r === 'Vendeur' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">
                              Ventes
                            </span>
                          )}
                          {r === 'Client' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                              Boutique
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {(currentRole === 'Admin' || currentRole === 'Vendeur') && (
                <button
                  id="header-admin-link"
                  onClick={() => setActiveTab('admin')}
                  className="ml-2 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 transition"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Espace Administration</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          id="header-logo-btn"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            ISP
          </div>
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight group-hover:text-blue-600 transition">
              Informatique System Prosper
            </div>
            <div className="text-[11px] text-slate-500 font-medium tracking-wide">
              Matériel & Infrastructures Réseaux
            </div>
          </div>
        </button>

        {/* Search Bar */}
        {/* <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              id="header-search-input"
              type="text"
              placeholder="Rechercher Samsung, RTX 4070, Dell, catégories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              id="header-search-btn"
              onClick={onSearchSubmit}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Chercher
            </button>
          </div>
        </div> */}

        {/* Desktop Navigation Menu & Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-700">
            <button
              id="nav-link-home"
              onClick={() => setActiveTab('home')}
              className={`hover:text-blue-600 transition ${
                activeTab === 'home' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : ''
              }`}
            >
              Accueil
            </button>
            <button
              id="nav-link-produits"
              onClick={() => setActiveTab('produits')}
              className={`hover:text-blue-600 transition ${
                activeTab === 'produits' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : ''
              }`}
            >
              Produits
            </button>
            {/* <button
              id="nav-link-categories"
              onClick={() => setActiveTab('categories')}
              className={`hover:text-blue-600 transition ${
                activeTab === 'categories' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : ''
              }`}
            >
              Catégories
            </button> */}
            <button
              id="nav-link-a-propos"
              onClick={() => setActiveTab('a-propos')}
              className={`flex items-center gap-1 hover:text-blue-600 transition ${
                activeTab === 'a-propos' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : ''
              }`}
            >
              <span>À propos</span>
            </button>
            <button
              id="nav-link-contact"
              onClick={() => setActiveTab('contact')}
              className={`hover:text-blue-600 transition ${
                activeTab === 'contact' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          <div className="h-5 w-px bg-slate-200" />

          {/* Cart Icon */}
          <button
            id="header-cart-btn"
            onClick={() => setActiveTab('panier')}
            className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
            title="Mon Panier"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalCount}
              </span>
            )}
          </button>

          {/* Account & Auth Actions */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                id="header-account-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-xs font-semibold transition"
              >
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span className="max-w-[100px] truncate">{currentUser.nom}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 text-slate-800 space-y-1"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="font-extrabold text-xs text-slate-900 truncate">{currentUser.nom}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('compte');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition text-slate-700 font-semibold"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      <span>Mon Espace Client</span>
                    </button>

                    {(currentRole === 'Admin' || currentRole === 'Vendeur') && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-purple-50 transition text-purple-700 font-semibold"
                      >
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        <span>Administration</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          setActiveTab('login');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-red-50 transition text-red-600 font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Connexion</span>
              </button>
              <button
                id="header-register-btn"
                onClick={() => setActiveTab('register')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm shadow-blue-500/20 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>S'inscrire</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-cart-btn"
            onClick={() => setActiveTab('panier')}
            className="relative p-2 text-slate-700 hover:text-blue-600 rounded-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-600 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 text-sm text-slate-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-col space-y-2 font-medium text-slate-700 text-sm">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <span>Accueil</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('produits');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <span>Produits</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('a-propos');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg bg-blue-50 text-blue-700 font-semibold flex items-center gap-2"
              >
                <span>À propos</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <span>Contact</span>
              </button>
              {isAuthenticated && currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('compte');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2 border-t border-slate-100 pt-3"
                  >
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    <span>Compte Client ({currentUser.nom})</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      setActiveTab('login');
                    }}
                    className="text-left py-2 px-3 rounded-lg hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Se déconnecter</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1.5 text-xs"
                  >
                    <LogIn className="w-4 h-4 text-blue-600" />
                    <span>Connexion</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('register');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-1.5 text-xs shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Créer un compte</span>
                  </button>
                </div>
              )}

              {(currentRole === 'Admin' || currentRole === 'Vendeur') && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg bg-purple-600 text-white font-semibold flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Accéder à l'Administration</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
