import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Cloud,
  Code,
  Copy,
  Database,
  Edit2,
  ExternalLink,
  Eye,
  Filter,
  HardDrive,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Package,
  PackageCheck,
  PackagePlus,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Terminal,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Categorie, Produit } from '../types';

const PRESET_IMAGES = [
  { name: 'HP A3 Managed MFP E786dn', url: '/hp_a3_e786dn.jpg' },
  { name: 'Imprimante Laser Pro A4/A3', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80' },
  { name: 'SSD NVMe / Disque', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Carte Graphique RTX', url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80' },
  { name: 'PC Portable Dell / Lenovo', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80' },
  { name: 'Écran OLED / Moniteur', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { name: 'Clavier Mécanique RGB', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Routeur Réseau Wi-Fi 6E', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Processeur / CPU Intel', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mémoire RAM DDR5', url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80' },
  { name: 'Souris Gamer Ergonomique', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Casque Micro Pro', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Serveur / Baie Data', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
  { name: 'Boîtier PC Workstation', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80' },
];

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Toutes');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State for Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    marque: '',
    modele: '',
    categorieId: '',
    prix: 99.99,
    image: '/hp_a3_e786dn.jpg',
    garantie: '2 ans',
    stock: 10,
    description: '',
    caracteristiquesText: '',
  });

  // Modal State for Detail View (getProductById)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Produit | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Modal State for Delete Confirmation
  const [productToDelete, setProductToDelete] = useState<Produit | null>(null);
  const [deleting, setDeleting] = useState(false);

  // TiDB Cloud Data App State
  const [tidbStatus, setTidbStatus] = useState<{
    endpointUrl: string;
    isConfigured: boolean;
    publicKeyMasked: string;
    curlSample: string;
    curlSampleById?: string;
  } | null>(null);
  const [syncingTiDB, setSyncingTiDB] = useState(false);
  const [showTiDBModal, setShowTiDBModal] = useState(false);
  const [tidbTargetId, setTidbTargetId] = useState<string>('');
  const [tidbInspection, setTidbInspection] = useState<{
    loading: boolean;
    error: string | null;
    data: any | null;
    latencyMs: number;
    statusCode?: number;
    targetUrl?: string;
  }>({ loading: false, error: null, data: null, latencyMs: 0 });
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedCurlById, setCopiedCurlById] = useState(false);

  // Image Picker State
  const [imageTab, setImageTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Helper to optimize and compress image before uploading
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let { width, height } = img;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
        } else {
          setFormData((prev) => ({ ...prev, image: result }));
        }
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, image: result }));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  // 1. GET PRODUCTS: Fetch from Database API
  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, status] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getTiDBStatus().catch(() => null),
      ]);
      setProducts(prods);
      setCategories(cats);
      if (status) setTidbStatus(status);
    } catch (err: any) {
      console.error('Erreur chargement données produits:', err);
      setNotification({
        type: 'error',
        message: 'Impossible de synchroniser avec la base de données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // TiDB Cloud Handlers
  const handleInspectTiDB = async (customId?: string) => {
    setShowTiDBModal(true);
    const targetIdToQuery = customId !== undefined ? customId : tidbTargetId;
    if (customId !== undefined) {
      setTidbTargetId(customId);
    }
    setTidbInspection({ loading: true, error: null, data: null, latencyMs: 0 });
    try {
      const res = await api.getTiDBProducts(targetIdToQuery.trim() || undefined);
      setTidbInspection({
        loading: false,
        error: null,
        data: res,
        latencyMs: res.latencyMs,
        statusCode: 200,
        targetUrl: res.targetUrl,
      });
    } catch (err: any) {
      setTidbInspection({
        loading: false,
        error: err.message || 'Erreur lors de l\'appel au point de terminaison TiDB Cloud',
        data: null,
        latencyMs: 0,
      });
    }
  };

  const handleSyncTiDB = async () => {
    setSyncingTiDB(true);
    try {
      const res = await api.syncTiDBProducts();
      await loadData();
      setNotification({
        type: 'success',
        message: `${res.count} produit(s) synchronisé(s) depuis TiDB Cloud (${res.latencyMs} ms) !`,
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Synchronisation TiDB Cloud : ${err.message}`,
      });
    } finally {
      setSyncingTiDB(false);
    }
  };

  const handleCopyCurl = (withId = false) => {
    const base =
      tidbStatus?.endpointUrl ||
      'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products';
    const idVal = tidbTargetId.trim() || '${id}';
    const curl = withId
      ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${base}?id=${idVal}'`
      : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${base}'`;

    navigator.clipboard.writeText(curl);
    if (withId) {
      setCopiedCurlById(true);
      setTimeout(() => setCopiedCurlById(false), 2500);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2500);
    }
  };

  // 2. GET PRODUCT BY ID: Fetch Single Product from DB for Inspection Modal
  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    try {
      const p = await api.getProductById(id);
      if (p) {
        setDetailProduct(p);
      } else {
        throw new Error('Produit introuvable en base');
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Erreur getProductById: ${err.message || 'Produit non trouvé'}`,
      });
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Open Create Form
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      nom: '',
      marque: 'HP',
      modele: 'LaserJet',
      categorieId: categories[0]?.id || 'cat-1',
      prix: 199.99,
      image: '/hp_a3_e786dn.jpg',
      garantie: '2 ans constructeur',
      stock: 12,
      description: 'Matériel informatique et bureautique professionnel.',
      caracteristiquesText: 'Haute performance, Connectivité réseau, Garantie officielle',
    });
    setShowModal(true);
  };

  // Open Edit Form: first fetch fresh from DB via getProductById
  const handleOpenEdit = async (p: Produit) => {
    try {
      // Direct getProductById call ensures we edit the fresh database state
      const freshProduct = (await api.getProductById(p.id)) || p;
      setEditingProduct(freshProduct);
      setFormData({
        nom: freshProduct.nom,
        marque: freshProduct.marque,
        modele: freshProduct.modele,
        categorieId: freshProduct.categorieId,
        prix: freshProduct.prix,
        image: freshProduct.image,
        garantie: freshProduct.garantie,
        stock: freshProduct.stock,
        description: freshProduct.description,
        caracteristiquesText: Array.isArray(freshProduct.caracteristiques)
          ? freshProduct.caracteristiques.join(', ')
          : '',
      });
      setShowModal(true);
    } catch (err) {
      // Fallback to current object if API fails
      setEditingProduct(p);
      setFormData({
        nom: p.nom,
        marque: p.marque,
        modele: p.modele,
        categorieId: p.categorieId,
        prix: p.prix,
        image: p.image,
        garantie: p.garantie,
        stock: p.stock,
        description: p.description,
        caracteristiquesText: Array.isArray(p.caracteristiques) ? p.caracteristiques.join(', ') : '',
      });
      setShowModal(true);
    }
  };

  // 3 & 4. INSERT (createProduct) & UPDATE (updateProduct)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const specsArray = formData.caracteristiquesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const catObj = categories.find((c) => c.id === formData.categorieId);

    const payload = {
      nom: formData.nom,
      marque: formData.marque,
      modele: formData.modele,
      categorieId: formData.categorieId,
      categorieNom: catObj ? catObj.nom : undefined,
      prix: Number(formData.prix) || 0,
      stock: Number(formData.stock) || 0,
      garantie: formData.garantie,
      image: formData.image,
      description: formData.description,
      caracteristiques: specsArray.length > 0 ? specsArray : ['Haute performance'],
    };

    try {
      if (editingProduct) {
        // UPDATE in Database
        await api.updateProduct(editingProduct.id, payload);
        setNotification({
          type: 'success',
          message: `Le produit "${payload.nom}" a été mis à jour avec succès dans la base de données.`,
        });
      } else {
        // INSERT into Database
        await api.createProduct(payload);
        setNotification({
          type: 'success',
          message: `Le produit "${payload.nom}" a été inséré avec succès dans la base de données.`,
        });
      }
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      console.error('Erreur sauvegarde BDD:', err);
      setNotification({
        type: 'error',
        message: err.message || "Erreur lors de l'enregistrement en base de données.",
      });
    } finally {
      setSaving(false);
    }
  };

  // 5. DELETE (deleteProduct) with confirmation
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await api.deleteProduct(productToDelete.id);
      setNotification({
        type: 'success',
        message: `Le produit "${productToDelete.nom}" a été supprimé définitivement de la base de données.`,
      });
      setProductToDelete(null);
      await loadData();
    } catch (err: any) {
      console.error('Erreur suppression BDD:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Erreur lors de la suppression en base de données.',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filter products list
  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.nom.toLowerCase().includes(q) ||
      p.marque.toLowerCase().includes(q) ||
      p.modele.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q);

    const matchesCategory = selectedCat === 'Toutes' || p.categorieId === selectedCat;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && p.stock > 0) ||
      (stockFilter === 'out_of_stock' && p.stock <= 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Calculate quick database stats
  const totalEnStock = products.filter((p) => p.stock > 0).length;
  const totalRupture = products.filter((p) => p.stock <= 0).length;
  const valeurTotaleStock = products.reduce((sum, p) => sum + p.prix * p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-md transition animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold px-2 py-1 hover:bg-black/5 rounded-lg transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header with Database Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Gestion des Produits
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Interface opérationnelle de gestion du catalogue des équipements informatiques : consultation , ajout , modification et suppression.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* Database KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
            En Stock
          </div>
          <div className="text-2xl font-black text-emerald-600">{totalEnStock}</div>
          <div className="text-[10px] text-slate-400 mt-1">Disponibles immédiatement</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Rupture de Stock
          </div>
          <div className="text-2xl font-black text-rose-600">{totalRupture}</div>
          <div className="text-[10px] text-slate-400 mt-1">Nécessite réapprovisionnement</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-purple-600" />
            Valeur du Parc Stocké
          </div>
          <div className="text-xl font-black text-slate-900 truncate">
            {valeurTotaleStock.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="text"
              placeholder="Rechercher par nom, marque, modèle, ID base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Toutes les catégories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>

          <select
            value={stockFilter}
            onChange={(e: any) => setStockFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts de stock</option>
            <option value="in_stock">En stock seulement</option>
            <option value="out_of_stock">En rupture de stock</option>
          </select>
        </div>

        {/* <div className="text-xs text-slate-400 font-medium">
          {filteredProducts.length} sur {products.length} produit(s) affiché(s)
        </div> */}
      </div>

      {/* Table Section (GET Products) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">ID BDD</th>
                <th className="p-4">Produit</th>
                <th className="p-4">Marque & Modèle</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4 text-right">Prix (€)</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4">Disponibilité</th>
                <th className="p-4 text-right">Actions BDD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Interrogation de la base de données en cours...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Aucun produit ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    {/* ID BDD */}
                    <td className="p-4">
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {p.id}
                      </span>
                    </td>

                    {/* Product Name & Thumbnail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.nom}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => handleOpenDetail(p.id)}
                            className="font-bold text-slate-900 hover:text-blue-600 transition text-left line-clamp-1 flex items-center gap-1.5"
                            title="Cliquer pour voir la fiche BDD"
                          >
                            <span>{p.nom}</span>
                          </button>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            Garantie : {p.garantie || 'Non spécifiée'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Brand & Model */}
                    <td className="p-4 text-slate-700">
                      <span className="font-bold text-slate-900">{p.marque}</span>
                      <span className="text-slate-400 ml-1">({p.modele})</span>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {p.categorieNom || 'Non classé'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 text-right font-black text-slate-900">
                      {p.prix.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>

                    {/* Stock */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          p.stock > 5
                            ? 'bg-blue-50 text-blue-700'
                            : p.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.disponibilite}
                      </span>
                    </td>

                    {/* Action Buttons: Inspect (GET), Edit (UPDATE), Delete (DELETE) */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. GET By ID Details */}
                        <button
                          onClick={() => handleOpenDetail(p.id)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg transition"
                          title="Consulter les données en base (getProductById)"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. UPDATE Product */}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Modifier le produit en base (updateProduct)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* 3. DELETE Product */}
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Supprimer définitivement de la base (deleteProduct)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW PRODUCT DETAILS FROM DB (getProductById) */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Fiche Produit en Base de Données
                  </h3>
                  
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                <p className="text-xs">Chargement des données depuis la base...</p>
              </div>
            ) : detailProduct ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <img
                    src={detailProduct.image}
                    alt={detailProduct.nom}
                    referrerPolicy="no-referrer"
                    className="w-28 h-28 object-cover rounded-xl border border-slate-200 bg-white shrink-0 shadow-xs"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {detailProduct.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          detailProduct.stock > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {detailProduct.disponibilite}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 leading-tight">
                      {detailProduct.nom}
                    </h4>

                    <div className="text-xs text-slate-600 flex items-center gap-3">
                      <span>
                        Marque: <strong>{detailProduct.marque}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Modèle: <strong>{detailProduct.modele}</strong>
                      </span>
                    </div>

                    <div className="text-lg font-black text-blue-600 pt-1">
                      {detailProduct.prix.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </div>
                  </div>
                </div>

                {/* Technical Specifications from DB */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Catégorie</span>
                    <span className="font-bold text-slate-800">{detailProduct.categorieNom}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Stock Actuel</span>
                    <span className="font-bold text-slate-800">{detailProduct.stock} unité(s)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Garantie</span>
                    <span className="font-bold text-slate-800">{detailProduct.garantie || 'N/A'}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Description du Produit
                  </label>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {detailProduct.description || 'Aucune description fournie pour ce produit.'}
                  </p>
                </div>

                {/* Features List */}
                {detailProduct.caracteristiques && detailProduct.caracteristiques.length > 0 && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Caractéristiques Techniques Enregistrées en BDD
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {detailProduct.caracteristiques.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
                        >
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Modal Actions */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setProductToDelete(detailProduct);
                      }}
                      className="flex items-center gap-1.5 text-xs text-rose-600 font-bold hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>

                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleOpenEdit(detailProduct);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE / EDIT PRODUCT FORM (createProduct / updateProduct) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl text-white ${
                    editingProduct ? 'bg-amber-600' : 'bg-blue-600'
                  }`}
                >
                  {editingProduct ? <Edit2 className="w-4 h-4" /> : <PackagePlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingProduct ? 'Modifier le Produit en BDD' : 'Ajouter un Produit en BDD (INSERT)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingProduct
                      ? `Mise à jour directe de l'enregistrement ID: ${editingProduct.id}`
                      : 'Création et persistance immédiate dans la base de données'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Nom du produit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: HP Color LaserJet Managed MFP E786dn"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Marque <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="HP, Canon, Dell, Cisco..."
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Modèle <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E786DN, RTX 4090, PowerEdge..."
                    value={formData.modele}
                    onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Catégorie <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.categorieId}
                    onChange={(e) => setFormData({ ...formData, categorieId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Prix Unitaire (€ TTC) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2490.00"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stock Initial / Actuel *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Garantie</label>
                  <input
                    type="text"
                    placeholder="3 ans sur site J+1"
                    value={formData.garantie}
                    onChange={(e) => setFormData({ ...formData, garantie: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Characteristics Key Specs */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Caractéristiques Clés (séparées par une virgule)
                </label>
                <input
                  type="text"
                  placeholder="Format A3, Vitesse 45 ppm, Recto-verso automatique, Ethernet Gigabit"
                  value={formData.caracteristiquesText}
                  onChange={(e) => setFormData({ ...formData, caracteristiquesText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Selector Section */}
              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Image du Produit *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Aperçu direct</span>
                </div>

                {/* Current Image Live Preview */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Aperçu du produit"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0 bg-white"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {formData.nom || 'Nouveau Produit'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {formData.image.startsWith('data:')
                        ? '📷 Image importée depuis votre ordinateur'
                        : formData.image}
                    </div>
                  </div>
                </div>

                {/* Tab Switcher for Choosing Image */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setImageTab('gallery')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                      imageTab === 'gallery'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Galerie Matériel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                      imageTab === 'upload'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-3 h-3 text-emerald-500" />
                    <span>Importer un Fichier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                      imageTab === 'url'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3 text-purple-500" />
                    <span>Lien URL</span>
                  </button>
                </div>

                {/* Tab 1: Preset Gallery */}
                {imageTab === 'gallery' && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-slate-500">
                      Sélectionnez une photo officielle pour l'équipement :
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                      {PRESET_IMAGES.map((img, idx) => {
                        const isSelected = formData.image === img.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: img.url })}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition group ${
                              isSelected
                                ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm scale-95'
                                : 'border-transparent hover:border-slate-300'
                            }`}
                            title={img.name}
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 2: File Upload (Drag & Drop / Browser) */}
                {imageTab === 'upload' && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                          : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Cliquez pour sélectionner un fichier image
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Glissez-déposez ici (JPG, PNG, WEBP)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Custom URL */}
                {imageTab === 'url' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Saisissez l'URL d'une image en ligne :
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description Détaillée</label>
                <textarea
                  rows={2}
                  placeholder="Spécifications techniques et usages recommandés..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {saving
                      ? 'Écriture en BDD...'
                      : editingProduct
                      ? 'Enregistrer les Modifications'
                      : 'Ajouter'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION DIALOG (deleteProduct) */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Supprimer de la Base de Données ?
                </h3>
                <p className="text-[11px] text-slate-400">Action irréversible (DELETE FROM products)</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <img
                src={productToDelete.image}
                alt={productToDelete.nom}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {productToDelete.nom}
                </div>
                <div className="text-[11px] text-slate-500">
                  ID: <span className="font-mono">{productToDelete.id}</span> • {productToDelete.prix} €
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Êtes-vous certain de vouloir supprimer cet enregistrement ? Il sera retiré de la base de données MySQL et du catalogue visible par les clients.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? 'Suppression BDD...' : 'Confirmer la Suppression'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TIDB CLOUD DATA APP ENDPOINT INSPECTOR & TESTER */}
      {showTiDBModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold flex items-center gap-2">
                    <span>TiDB Cloud Data App Endpoint</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Digest Auth
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                    /endpoint/products
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTiDBModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Endpoint Spec Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    Requête HTTP & Format Curl (Support ?id=${'{id}'})
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Protocole TiDB Cloud
                  </span>
                </div>

                {/* ID Query Input & Chips */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Filtrer par ID de produit (?id=...) :</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTidbTargetId('')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                          !tidbTargetId
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Tous les produits
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: 1, p-1, etc. (laisser vide pour tout récupérer)"
                      value={tidbTargetId}
                      onChange={(e) => setTidbTargetId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleInspectTiDB()}
                      disabled={tidbInspection.loading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{tidbTargetId ? 'Exécuter ?id' : 'Exécuter Tout'}</span>
                    </button>
                  </div>

                  {products.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold">Exemples rapides :</span>
                      {products.slice(0, 5).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setTidbTargetId(p.id);
                            handleInspectTiDB(p.id);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-mono border transition ${
                            tidbTargetId === p.id
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p.id} ({p.nom.slice(0, 15)}...)
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Displayed cURL */}
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto relative group">
                  <pre className="whitespace-pre-wrap select-all">
                    curl --user ${'{PUBLIC_KEY}:${PRIVATE_KEY}'} --request GET \{'\n'}
                    &nbsp;&nbsp;'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products{tidbTargetId ? `?id=${tidbTargetId}` : '?id=${id}'}'
                  </pre>
                  <div className="absolute right-2 top-2 flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyCurl(true)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700 transition flex items-center gap-1"
                      title="Copier avec le paramètre ?id"
                    >
                      {copiedCurlById ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCurlById ? 'Copié' : 'Copier ?id'}</span>
                    </button>
                    <button
                      onClick={() => handleCopyCurl(false)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700 transition flex items-center gap-1"
                      title="Copier sans filtre"
                    >
                      {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCurl ? 'Copié' : 'Copier standard'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Méthode d'authentification</span>
                    <span className="font-bold text-slate-800">HTTP Digest Authentication (MD5)</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">État des clés dans le système</span>
                    <span className="font-bold text-slate-800">
                      {tidbStatus?.isConfigured
                        ? `Clés détectées (${tidbStatus.publicKeyMasked})`
                        : 'Variables TIDB_PUBLIC_KEY / TIDB_PRIVATE_KEY à définir'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleInspectTiDB()}
                    disabled={tidbInspection.loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tidbInspection.loading ? 'animate-spin' : ''}`} />
                    <span>
                      {tidbInspection.loading
                        ? 'Exécution GET...'
                        : tidbTargetId
                        ? `Tester GET (?id=${tidbTargetId})`
                        : 'Tester le Endpoint GET'}
                    </span>
                  </button>

                  <button
                    onClick={handleSyncTiDB}
                    disabled={syncingTiDB}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingTiDB ? 'animate-spin' : ''}`} />
                    <span>{syncingTiDB ? 'Synchronisation...' : 'Importer dans le Catalogue'}</span>
                  </button>
                </div>
              </div>

              {/* Execution Result Box */}
              {tidbInspection.loading && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-800">Appel au serveur TiDB Cloud en cours...</div>
                  <div className="text-[11px] text-slate-400">Authentification Digest challenge en traitement</div>
                </div>
              )}

              {tidbInspection.error && !tidbInspection.loading && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Réponse du serveur TiDB Cloud :</span>
                  </div>
                  <p className="text-xs text-rose-700 font-mono bg-white p-2.5 rounded-xl border border-rose-200 whitespace-pre-wrap">
                    {tidbInspection.error}
                  </p>
                  <p className="text-[11px] text-rose-600">
                    💡 Pour authentifier vos requêtes réelles avec vos propres identifiants PingCAP TiDB Cloud, renseignez <code className="font-bold">TIDB_PUBLIC_KEY</code> et <code className="font-bold">TIDB_PRIVATE_KEY</code> dans les paramètres de secrets.
                  </p>
                </div>
              )}

              {tidbInspection.data && !tidbInspection.loading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs">Succès (HTTP 200 OK)</span>
                    </div>
                    <div className="text-xs font-mono text-emerald-700">
                      Latence : {tidbInspection.latencyMs} ms • {tidbInspection.data.products?.length || 0} produits récupérés
                    </div>
                  </div>

                  {/* Normalized Products Preview */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 font-extrabold text-xs text-slate-800 flex items-center justify-between">
                      <span>Données Extraites (data.rows)</span>
                      <span className="text-[10px] text-slate-400">
                        {tidbInspection.data.products?.length || 0} lignes
                      </span>
                    </div>
                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {tidbInspection.data.products?.map((p: Produit, i: number) => (
                        <div key={p.id || i} className="p-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.image}
                              alt={p.nom}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{p.nom}</div>
                              <div className="text-[11px] text-slate-500">
                                {p.marque} {p.modele} • {p.categorieNom}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-slate-900">{p.prix} €</div>
                            <div className="text-[10px] text-emerald-600 font-semibold">{p.stock} en stock</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Raw JSON Payload */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-slate-200">
                    <div className="p-2.5 bg-slate-800 text-slate-300 text-[11px] font-mono flex items-center justify-between">
                      <span>Payload JSON TiDB Brut</span>
                    </div>
                    <pre className="p-3 text-[11px] font-mono overflow-x-auto max-h-48 text-slate-300">
                      {JSON.stringify(tidbInspection.data.rawResponse || tidbInspection.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Endpoint connecté à eu-central-1.data.tidbcloud.com
              </span>
              <button
                onClick={() => setShowTiDBModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition"
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

