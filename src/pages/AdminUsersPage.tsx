import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  Database,
  Edit2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Terminal,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Role, User, UserStatus } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Tous');

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    role: 'Client' as Role,
    statut: 'Actif' as UserStatus,
  });

  // TiDB Cloud Data App State
  const [tidbStatus, setTidbStatus] = useState<{
    endpointUrl: string;
    usersEndpointUrl?: string;
    isConfigured: boolean;
    publicKeyMasked: string;
    curlUsers?: string;
    curlUsersById?: string;
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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [data, tStatus] = await Promise.all([
        api.getUsers(searchTerm, selectedRole),
        api.getTiDBStatus().catch(() => null),
      ]);
      setUsers(data);
      if (tStatus) setTidbStatus(tStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
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

  const handleApplyFilters = () => {
    loadUsers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('Tous');
    api.getUsers('', 'Tous').then(setUsers);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ nom: '', email: '', role: 'Client', statut: 'Actif' });
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ nom: u.nom, email: u.email, role: u.role, statut: u.statut });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
        setNotification({
          type: 'success',
          message: `L'utilisateur "${formData.nom}" a été mis à jour avec succès.`,
        });
      } else {
        await api.createUser(formData);
        setNotification({
          type: 'success',
          message: `L'utilisateur "${formData.nom}" a été créé avec succès.`,
        });
      }
      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || "Erreur lors de l'enregistrement de l'utilisateur.",
      });
    }
  };

  const handleSuspend = async (u: User) => {
    const nextStatut: UserStatus = u.statut === 'Suspendu' ? 'Actif' : 'Suspendu';
    try {
      await api.updateUser(u.id, { statut: nextStatut });
      setNotification({
        type: 'success',
        message: `Statut de ${u.nom} changé en "${nextStatut}".`,
      });
      loadUsers();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Erreur lors du changement de statut.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.deleteUser(id);
        setNotification({
          type: 'success',
          message: 'Utilisateur supprimé avec succès.',
        });
        loadUsers();
      } catch (err: any) {
        setNotification({
          type: 'error',
          message: err.message || "Erreur lors de la suppression de l'utilisateur.",
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
      const result = await api.getTiDBUsers(idToUse.trim() || undefined);
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
      const res = await api.syncTiDBUsers();
      await loadUsers();
      setNotification({
        type: 'success',
        message: `${res.count} utilisateur(s) synchronisé(s) depuis TiDB Cloud (${res.latencyMs} ms) !`,
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

  const usersBaseUrl =
    tidbStatus?.usersEndpointUrl ||
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users';

  const handleCopyCurl = (withId = false) => {
    const idVal = tidbTargetId.trim() || '${id}';
    const text = withId
      ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${usersBaseUrl}?id=${idVal}'`
      : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${usersBaseUrl}'`;

    navigator.clipboard.writeText(text);
    if (withId) {
      setCopiedCurlById(true);
      setTimeout(() => setCopiedCurlById(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

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
              Gestion des Utilisateurs
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Gérez les comptes Admin, Vendeurs et Clients et synchronisez.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Recherche nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="Tous">Tous les rôles</option>
            <option value="Admin">Admin</option>
            <option value="Vendeur">Vendeur</option>
            <option value="Client">Client</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyFilters}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Appliquer les filtres</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
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
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date d'inscription</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-500">{u.id}</td>
                    <td className="p-4 font-bold text-slate-900">{u.nom}</td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span>{u.email}</span>
                        {u.isEmailVerified ? (
                          <span
                            className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md border border-emerald-200 font-semibold"
                            title="E-mail vérifié"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Vérifié
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md border border-amber-200 font-semibold"
                            title="E-mail non vérifié"
                          >
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            En attente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          u.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'Vendeur'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.statut === 'Actif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.statut}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{u.dateInscription}</td>
                    <td className="p-4 text-right space-x-2">
                      {/* <button
                        onClick={() => {
                          setTidbTargetId(u.id);
                          handleInspectTiDB(u.id);
                        }}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                        title="Tester sur TiDB (?id=...)"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button> */}
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSuspend(u)}
                        className={`p-1.5 rounded-lg transition text-xs font-bold ${
                          u.statut === 'Suspendu'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                        title={u.statut === 'Suspendu' ? 'Activer' : 'Suspendre'}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
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

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingUser ? 'Modifier Utilisateur' : 'Créer un Utilisateur'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nom Complet</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Vendeur">Vendeur</option>
                    <option value="Client">Client</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as UserStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
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
//   Filter,
//   Plus,
//   RefreshCw,
//   Search,
//   ShieldAlert,
//   Trash2,
//   UserPlus,
//   Users,
//   X,
// } from 'lucide-react';
// import { api } from '../services/api';
// import { Role, User, UserStatus } from '../types';

// export const AdminUsersPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filters state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRole, setSelectedRole] = useState<string>('Tous');

//   // Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [formData, setFormData] = useState({
//     nom: '',
//     email: '',
//     role: 'Client' as Role,
//     statut: 'Actif' as UserStatus,
//   });

//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await api.getUsers(searchTerm, selectedRole);
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleApplyFilters = () => {
//     loadUsers();
//   };

//   const handleResetFilters = () => {
//     setSearchTerm('');
//     setSelectedRole('Tous');
//     api.getUsers('', 'Tous').then(setUsers);
//   };

//   const handleOpenAdd = () => {
//     setEditingUser(null);
//     setFormData({ nom: '', email: '', role: 'Client', statut: 'Actif' });
//     setShowModal(true);
//   };

//   const handleOpenEdit = (u: User) => {
//     setEditingUser(u);
//     setFormData({ nom: u.nom, email: u.email, role: u.role, statut: u.statut });
//     setShowModal(true);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingUser) {
//       await api.updateUser(editingUser.id, formData);
//     } else {
//       await api.createUser(formData);
//     }
//     setShowModal(false);
//     loadUsers();
//   };

//   const handleSuspend = async (u: User) => {
//     const nextStatut: UserStatus = u.statut === 'Suspendu' ? 'Actif' : 'Suspendu';
//     await api.updateUser(u.id, { statut: nextStatut });
//     loadUsers();
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//       await api.deleteUser(id);
//       loadUsers();
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-slate-900 tracking-tight">
//             Gestion des Utilisateurs
//           </h1>
//           <p className="text-xs text-slate-500 mt-1">
//             Gérez les comptes Admin, Vendeurs et Clients de la plateforme.
//           </p>
//         </div>

//         <button
//           onClick={handleOpenAdd}
//           className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
//         >
//           <UserPlus className="w-4 h-4" />
//           <span>Nouvel utilisateur</span>
//         </button>
//       </div>

//       {/* Filter Control Bar (Required buttons: Appliquer les filtres, Réinitialiser) */}
//       <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
//         <div className="flex flex-wrap items-center gap-3 flex-1">
//           {/* Search */}
//           <div className="relative min-w-[220px]">
//             <input
//               type="text"
//               placeholder="Recherche nom ou email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
//             />
//             <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//           </div>

//           {/* Role Filter */}
//           <select
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//             className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
//           >
//             <option value="Tous">Tous les rôles</option>
//             <option value="Admin">Admin</option>
//             <option value="Vendeur">Vendeur</option>
//             <option value="Client">Client</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleApplyFilters}
//             className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
//           >
//             <Filter className="w-3.5 h-3.5" />
//             <span>Appliquer les filtres</span>
//           </button>
//           <button
//             onClick={handleResetFilters}
//             className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
//           >
//             <RefreshCw className="w-3.5 h-3.5" />
//             <span>Réinitialiser</span>
//           </button>
//         </div>
//       </div>

//       {/* Table Section (Required Columns: Nom, Email, Rôle, Statut, Date d'inscription) */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
//                 <th className="p-4">Nom</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Rôle</th>
//                 <th className="p-4">Statut</th>
//                 <th className="p-4">Date d'inscription</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="p-8 text-center text-slate-400">
//                     Chargement des utilisateurs...
//                   </td>
//                 </tr>
//               ) : users.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="p-8 text-center text-slate-500">
//                     Aucun utilisateur trouvé.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((u) => (
//                   <tr key={u.id} className="hover:bg-slate-50/80 transition">
//                     <td className="p-4 font-bold text-slate-900">{u.nom}</td>
//                     <td className="p-4 text-slate-600">{u.email}</td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
//                           u.role === 'Admin'
//                             ? 'bg-purple-100 text-purple-800'
//                             : u.role === 'Vendeur'
//                             ? 'bg-amber-100 text-amber-800'
//                             : 'bg-emerald-100 text-emerald-800'
//                         }`}
//                       >
//                         {u.role}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
//                           u.statut === 'Actif'
//                             ? 'bg-emerald-100 text-emerald-800'
//                             : 'bg-rose-100 text-rose-800'
//                         }`}
//                       >
//                         {u.statut}
//                       </span>
//                     </td>
//                     <td className="p-4 text-slate-500">{u.dateInscription}</td>
//                     <td className="p-4 text-right space-x-2">
//                       <button
//                         onClick={() => handleOpenEdit(u)}
//                         className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
//                         title="Modifier"
//                       >
//                         <Edit2 className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handleSuspend(u)}
//                         className={`p-1.5 rounded-lg transition text-xs font-bold ${
//                           u.statut === 'Suspendu'
//                             ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
//                             : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                         }`}
//                         title={u.statut === 'Suspendu' ? 'Activer' : 'Suspendre'}
//                       >
//                         <ShieldAlert className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(u.id)}
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

//       {/* Add / Edit User Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h3 className="font-extrabold text-slate-900 text-base">
//                 {editingUser ? 'Modifier Utilisateur' : 'Créer un Utilisateur'}
//               </h3>
//               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="space-y-3">
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-700">Nom Complet</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.nom}
//                   onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
//                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-700">Adresse Email</label>
//                 <input
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-slate-700">Rôle</label>
//                   <select
//                     value={formData.role}
//                     onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
//                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
//                   >
//                     <option value="Admin">Admin</option>
//                     <option value="Vendeur">Vendeur</option>
//                     <option value="Client">Client</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-slate-700">Statut</label>
//                   <select
//                     value={formData.statut}
//                     onChange={(e) => setFormData({ ...formData, statut: e.target.value as UserStatus })}
//                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
//                   >
//                     <option value="Actif">Actif</option>
//                     <option value="Suspendu">Suspendu</option>
//                   </select>
//                 </div>
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
