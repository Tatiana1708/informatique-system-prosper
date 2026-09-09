import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  Database,
  Edit2,
  FolderPlus,
  FolderTree,
  RefreshCw,
  Search,
  Terminal,
  Trash2,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Categorie } from '../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Categorie | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
  });

  // TiDB Cloud Data App State
  const [tidbStatus, setTidbStatus] = useState<{
    endpointUrl: string;
    categoriesEndpointUrl?: string;
    isConfigured: boolean;
    publicKeyMasked: string;
    curlCategories?: string;
    curlCategoriesById?: string;
  } | null>(null);
  const [syncingTiDB, setSyncingTiDB] = useState(false);
  const [showTiDBModal, setShowTiDBModal] = useState(false);
  const [tidbTargetId, setTidbTargetId] = useState<string>('');
  const [tidbInspection, setTidbInspection] = useState<{
    loading: boolean;
    error: string | null;
    data: any | null;
    latencyMs: number;
    targetUrl?: string;
  }>({ loading: false, error: null, data: null, latencyMs: 0 });
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedCurlById, setCopiedCurlById] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const [data, tStatus] = await Promise.all([
        api.getCategories(),
        api.getTiDBStatus().catch(() => null),
      ]);
      setCategories(data);
      if (tStatus) setTidbStatus(tStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({ nom: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Categorie) => {
    setEditingCat(cat);
    setFormData({ nom: cat.nom, description: cat.description });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, formData);
        setNotification({
          type: 'success',
          message: `La catégorie "${formData.nom}" a été mise à jour avec succès.`,
        });
      } else {
        await api.createCategory(formData);
        setNotification({
          type: 'success',
          message: `La catégorie "${formData.nom}" a été créée avec succès.`,
        });
      }
      setShowModal(false);
      loadCategories();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || "Erreur lors de l'enregistrement de la catégorie.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await api.deleteCategory(id);
        setNotification({
          type: 'success',
          message: 'Catégorie supprimée avec succès.',
        });
        loadCategories();
      } catch (err: any) {
        setNotification({
          type: 'error',
          message: err.message || 'Erreur lors de la suppression de la catégorie.',
        });
      }
    }
  };

  // TiDB Handlers
  const handleInspectTiDB = async (customId?: string) => {
    const idToUse = customId !== undefined ? customId : tidbTargetId;
    if (customId !== undefined) {
      setTidbTargetId(customId);
    }
    setShowTiDBModal(true);
    setTidbInspection({ loading: true, error: null, data: null, latencyMs: 0 });

    try {
      const result = await api.getTiDBCategories(idToUse.trim() || undefined);
      setTidbInspection({
        loading: false,
        error: null,
        data: result,
        latencyMs: result.latencyMs,
        targetUrl: result.targetUrl,
      });
    } catch (err: any) {
      setTidbInspection({
        loading: false,
        error: err.message || 'Erreur lors de l’interrogation de TiDB Cloud',
        data: null,
        latencyMs: 0,
      });
    }
  };

  const handleSyncTiDB = async () => {
    setSyncingTiDB(true);
    try {
      const res = await api.syncTiDBCategories();
      await loadCategories();
      setNotification({
        type: 'success',
        message: `${res.count} catégorie(s) synchronisée(s) depuis TiDB Cloud (${res.latencyMs} ms) !`,
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Erreur synchronisation TiDB : ${err.message}`,
      });
    } finally {
      setSyncingTiDB(false);
    }
  };

  const categoriesBaseUrl =
    tidbStatus?.categoriesEndpointUrl ||
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories';

  const handleCopyCurl = (withId = false) => {
    const idVal = tidbTargetId.trim() || '${id}';
    const text = withId
      ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${categoriesBaseUrl}?id=${idVal}'`
      : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${categoriesBaseUrl}'`;

    navigator.clipboard.writeText(text);
    if (withId) {
      setCopiedCurlById(true);
      setTimeout(() => setCopiedCurlById(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm transition ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold px-2 py-1 hover:bg-black/5 rounded-lg transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Gestion des Catégories
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Organisez la hiérarchie des produits du catalogue e-commerce et synchronisez.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nouvelle catégorie</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Rechercher catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
            className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Rechercher</span>
          </button>
          <button
            onClick={() => setSearchTerm('')}
            className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">ID</th>
                <th className="p-4">Nom</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Nombre de produits</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date de création</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chargement des catégories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucune catégorie trouvée.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-500">{c.id}</td>
                    <td className="p-4 font-bold text-slate-900">{c.nom}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{c.description}</td>
                    <td className="p-4 text-center font-bold text-blue-600">
                      {c.nombreProduits || 0}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {c.statut}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{c.dateCreation}</td>
                    <td className="p-4 text-right space-x-2">
                      {/* <button
                        onClick={() => {
                          setTidbTargetId(c.id);
                          handleInspectTiDB(c.id);
                        }}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                        title="Tester sur TiDB (?id=...)"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button> */}
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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

      {/* Modal Add / Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingCat ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nom de la Catégorie</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réseaux & Serveurs"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Description détaillée de la catégorie..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// import React, { useEffect, useState } from 'react';
// import {
//   Edit2,
//   FolderPlus,
//   FolderTree,
//   RefreshCw,
//   Search,
//   Trash2,
//   X,
// } from 'lucide-react';
// import { api } from '../services/api';
// import { Categorie } from '../types';

// export const AdminCategoriesPage: React.FC = () => {
//   const [categories, setCategories] = useState<Categorie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [editingCat, setEditingCat] = useState<Categorie | null>(null);
//   const [formData, setFormData] = useState({
//     nom: '',
//     description: '',
//   });

//   const loadCategories = async () => {
//     setLoading(true);
//     try {
//       const data = await api.getCategories();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const handleOpenAdd = () => {
//     setEditingCat(null);
//     setFormData({ nom: '', description: '' });
//     setShowModal(true);
//   };

//   const handleOpenEdit = (cat: Categorie) => {
//     setEditingCat(cat);
//     setFormData({ nom: cat.nom, description: cat.description });
//     setShowModal(true);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingCat) {
//       await api.updateCategory(editingCat.id, formData);
//     } else {
//       await api.createCategory(formData);
//     }
//     setShowModal(false);
//     loadCategories();
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
//       await api.deleteCategory(id);
//       loadCategories();
//     }
//   };

//   const filteredCategories = categories.filter((c) =>
//     c.nom.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-slate-900 tracking-tight">
//             Gestion des Catégories
//           </h1>
//           <p className="text-xs text-slate-500 mt-1">
//             Organisez la hiérarchie des produits du catalogue e-commerce.
//           </p>
//         </div>

//         <button
//           onClick={handleOpenAdd}
//           className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
//         >
//           <FolderPlus className="w-4 h-4" />
//           <span>Nouvelle catégorie</span>
//         </button>
//       </div>

//       {/* Control Bar (Required buttons: Rechercher, Appliquer les filtres, Réinitialiser) */}
//       <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
//         <div className="relative min-w-[240px]">
//           <input
//             type="text"
//             placeholder="Rechercher catégorie..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
//           />
//           <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={loadCategories}
//             className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
//           >
//             <Search className="w-3.5 h-3.5" />
//             <span>Rechercher</span>
//           </button>
//           <button
//             onClick={() => setSearchTerm('')}
//             className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
//           >
//             <RefreshCw className="w-3.5 h-3.5" />
//             <span>Réinitialiser</span>
//           </button>
//         </div>
//       </div>

//       {/* Table Section (Required Columns: Nom, Description, Nombre de produits, Statut, Date de création) */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
//                 <th className="p-4">Nom</th>
//                 <th className="p-4">Description</th>
//                 <th className="p-4 text-center">Nombre de produits</th>
//                 <th className="p-4">Statut</th>
//                 <th className="p-4">Date de création</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="p-8 text-center text-slate-400">
//                     Chargement des catégories...
//                   </td>
//                 </tr>
//               ) : filteredCategories.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="p-8 text-center text-slate-500">
//                     Aucune catégorie trouvée.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCategories.map((c) => (
//                   <tr key={c.id} className="hover:bg-slate-50/80 transition">
//                     <td className="p-4 font-bold text-slate-900">{c.nom}</td>
//                     <td className="p-4 text-slate-600 max-w-xs truncate">{c.description}</td>
//                     <td className="p-4 text-center font-bold text-blue-600">
//                       {c.nombreProduits || 0}
//                     </td>
//                     <td className="p-4">
//                       <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
//                         {c.statut}
//                       </span>
//                     </td>
//                     <td className="p-4 text-slate-500">{c.dateCreation}</td>
//                     <td className="p-4 text-right space-x-2">
//                       <button
//                         onClick={() => handleOpenEdit(c)}
//                         className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
//                         title="Modifier"
//                       >
//                         <Edit2 className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(c.id)}
//                         className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
//                         title="Supprimer"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal Add / Edit Category */}
//       {showModal && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h3 className="font-extrabold text-slate-900 text-base">
//                 {editingCat ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
//               </h3>
//               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="space-y-3">
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-700">Nom de la Catégorie</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="Ex: Réseaux & Serveurs"
//                   value={formData.nom}
//                   onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
//                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-700">Description</label>
//                 <textarea
//                   rows={3}
//                   required
//                   placeholder="Description détaillée de la catégorie..."
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
//                 />
//               </div>

//               <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
//                 >
//                   Enregistrer
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
