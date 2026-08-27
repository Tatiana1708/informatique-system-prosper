import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Edit2,
  Image as ImageIcon,
  Link as LinkIcon,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Categorie, Produit } from '../types';

const PRESET_IMAGES = [
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

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    marque: '',
    modele: '',
    categorieId: '',
    prix: 99.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    garantie: '2 ans',
    stock: 10,
    description: '',
  });

  // Image Picker State
  const [imageTab, setImageTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const loadData = async () => {
    setLoading(true);
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
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      nom: '',
      marque: 'Samsung',
      modele: 'PRO',
      categorieId: categories[0]?.id || 'cat-1',
      prix: 149.99,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      garantie: '3 ans',
      stock: 15,
      description: 'Équipement informatique haute performance.',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: Produit) => {
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
    });
    setShowModal(true);
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de l\'enregistrement du produit');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await api.deleteProduct(id);
      loadData();
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = p.nom.toLowerCase().includes(q) || p.marque.toLowerCase().includes(q);
    const catMatch = selectedCat === 'Toutes' || p.categorieId === selectedCat;
    return nameMatch && catMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion des Produits
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ajoutez, éditez et contrôlez les stocks des équipements informatiques.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <PackagePlus className="w-4 h-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Recherche produit ou marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="Toutes">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">Produit</th>
                <th className="p-4">Marque / Modèle</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4 text-right">Prix</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4">Disponibilité</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chargement des produits...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucun produit trouvé.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.nom}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <span className="font-bold text-slate-900 line-clamp-1">{p.nom}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {p.marque} <span className="text-slate-400">({p.modele})</span>
                    </td>
                    <td className="p-4 text-slate-600">{p.categorieNom}</td>
                    <td className="p-4 text-right font-black text-slate-900">
                      {p.prix.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="p-4 text-center font-bold text-blue-600">{p.stock}</td>
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
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Product Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingProduct ? 'Modifier le Produit' : 'Créer un Produit'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nom du produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Samsung 980 PRO 1TB"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Marque *</label>
                  <input
                    type="text"
                    required
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Modèle *</label>
                  <input
                    type="text"
                    required
                    value={formData.modele}
                    onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Catégorie *</label>
                  <select
                    value={formData.categorieId}
                    onChange={(e) => setFormData({ ...formData, categorieId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Garantie</label>
                  <input
                    type="text"
                    value={formData.garantie}
                    onChange={(e) => setFormData({ ...formData, garantie: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Image Selector Section */}
              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Image du Produit *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Aperçu en direct</span>
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
                  <div className="flex-1 min-w-0 space-y-1">
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
                      Cliquez sur une image ci-dessous pour l'attribuer immédiatement au produit :
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
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
                      className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                          : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Cliquez pour choisir un fichier image
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ou glissez-déposez l'image ici (PNG, JPG, WEBP - Max 8Mo)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Custom URL */}
                {imageTab === 'url' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Saisissez ou collez l'URL directe d'une image web :
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
