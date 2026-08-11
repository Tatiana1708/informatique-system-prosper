import React, { useEffect, useState } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AboutPage } from './pages/AboutPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminClientsPage } from './pages/AdminClientsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { CartPage } from './pages/CartPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { api } from './services/api';
import { Categorie, Produit } from './types';

function MainAppContent() {
  const { currentRole } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedDocTab, setSelectedDocTab] = useState<string>('president');

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null);

  // Loaded Catalog Data
  const [products, setProducts] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, adminTab]);

  const handleSelectProduct = (product: Produit) => {
    setSelectedProduct(product);
    setActiveTab('produit-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('produits');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setActiveTab('produits');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ADMIN BACK-OFFICE LAYOUT
  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
        <AdminSidebar
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Header Bar */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                Espace Administration
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-extrabold text-slate-800 capitalize">
                {adminTab}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              >
                Accéder au Front-Office Client
              </button>
            </div>
          </header>

          {/* Admin Sub-Page Views */}
          <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
            {adminTab === 'dashboard' && <AdminDashboardPage setAdminTab={setAdminTab} />}
            {adminTab === 'utilisateurs' && <AdminUsersPage />}
            {adminTab === 'clients' && <AdminClientsPage />}
            {adminTab === 'commandes' && <AdminOrdersPage />}
            {adminTab === 'categories' && <AdminCategoriesPage />}
            {adminTab === 'produits' && <AdminProductsPage />}
          </main>
        </div>
      </div>
    );
  }

  // PUBLIC FRONT-OFFICE LAYOUT
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            setActiveTab={setActiveTab}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeTab === 'produits' && (
          <ProductsPage
            products={products}
            categories={categories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'produit-detail' && selectedProduct && (
          <ProductDetailPage
            produit={selectedProduct}
            allProducts={products}
            onBack={() => setActiveTab('produits')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage
            categories={categories}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeTab === 'a-propos' && (
          <AboutPage
            setActiveTab={setActiveTab}
            selectedDocTab={selectedDocTab}
            setSelectedDocTab={setSelectedDocTab}
          />
        )}

        {activeTab === 'contact' && <ContactPage />}

        {activeTab === 'panier' && <CartPage setActiveTab={setActiveTab} />}

        {activeTab === 'compte' && <UserAccountPage setActiveTab={setActiveTab} />}

        {activeTab === 'login' && <LoginPage setActiveTab={setActiveTab} />}

        {activeTab === 'register' && <RegisterPage setActiveTab={setActiveTab} />}
      </main>

      <Footer
        setActiveTab={setActiveTab}
        setSelectedDocTab={setSelectedDocTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
}
