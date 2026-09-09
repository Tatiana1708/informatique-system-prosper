import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Copy,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
  UploadCloud,
  UserCheck,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Client } from '../types';

export const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // TiDB Cloud state
  const [tidbStatus, setTidbStatus] = useState<{
    clientsEndpointUrl?: string;
    isConfigured: boolean;
    publicKeyMasked?: string;
  } | null>(null);

  const [copiedCurl, setCopiedCurl] = useState(false);
  const [syncingTiDB, setSyncingTiDB] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // TiDB Inspector Modal
  const [showTiDBModal, setShowTiDBModal] = useState(false);
  const [tidbTargetId, setTidbTargetId] = useState<string>('');
  const [tidbInspection, setTidbInspection] = useState<{
    loading: boolean;
    executed: boolean;
    clients?: Client[];
    singleClient?: Client | null;
    rawResponse: any;
    latencyMs?: number;
    error?: string;
    targetUrl?: string;
  }>({
    loading: false,
    executed: false,
    rawResponse: null,
  });

  const clientsBaseUrl =
    tidbStatus?.clientsEndpointUrl ||
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients';

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTiDBStatus = async () => {
    try {
      const status = await api.getTiDBStatus();
      setTidbStatus(status);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadClients();
    loadTiDBStatus();
  }, []);

  const handleCopyCurl = () => {
    const url = tidbTargetId ? `${clientsBaseUrl}?id=${tidbTargetId}` : clientsBaseUrl;
    const cmd = `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${url}'`;
    navigator.clipboard.writeText(cmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleInspectTiDB = async (customId = tidbTargetId) => {
    setTidbInspection({
      loading: true,
      executed: false,
      rawResponse: null,
      error: undefined,
    });

    try {
      const cleanId = customId.trim();
      if (cleanId) {
        const res = await api.getTiDBClientById(cleanId);
        setTidbInspection({
          loading: false,
          executed: true,
          singleClient: res.client,
          rawResponse: res.rawResponse,
          latencyMs: res.latencyMs,
          targetUrl: res.targetUrl || `${clientsBaseUrl}?id=${cleanId}`,
        });
      } else {
        const res = await api.getTiDBClients();
        setTidbInspection({
          loading: false,
          executed: true,
          clients: res.clients,
          rawResponse: res.rawResponse,
          latencyMs: res.latencyMs,
          targetUrl: res.targetUrl || clientsBaseUrl,
        });
      }
    } catch (err: any) {
      setTidbInspection({
        loading: false,
        executed: true,
        rawResponse: null,
        error: err.message || 'Erreur lors de la requête TiDB Cloud',
      });
    }
  };

  const handleSyncTiDBClients = async () => {
    setSyncingTiDB(true);
    try {
      const res = await api.syncTiDBClients();
      setNotification({
        type: 'success',
        message: `${res.message} (${res.latencyMs}ms)`,
      });
      loadClients();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Échec de synchronisation des clients TiDB Cloud',
      });
    } finally {
      setSyncingTiDB(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const openInspectorWithId = (id: string) => {
    setTidbTargetId(id);
    setShowTiDBModal(true);
    handleInspectTiDB(id);
  };

  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = c.user?.nom.toLowerCase().includes(q);
    const emailMatch = c.user?.email.toLowerCase().includes(q);
    const idMatch = c.id.toLowerCase().includes(q);
    return nameMatch || emailMatch || idMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header & TiDB actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Gestion des Clients</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
          Suivi des acheteurs, de leur volume de commandes et de leur chiffre d'affaires cumulé.
          </p>
        </div>

        {/* <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncTiDBClients}
            disabled={syncingTiDB}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <UploadCloud className={`w-3.5 h-3.5 ${syncingTiDB ? 'animate-bounce' : ''}`} />
            <span>{syncingTiDB ? 'Synchronisation...' : 'Synchroniser Clients'}</span>
          </button>
        </div> */}
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search and stats bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <input
            type="text"
            placeholder="Recherche client par nom, email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadClients}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <div className="text-xs font-semibold text-slate-500">
            Total : <strong className="text-slate-900">{filteredClients.length} clients</strong>
          </div>
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
                <th className="p-4 text-center">Nombre de commandes</th>
                <th className="p-4 text-right">Total dépensé</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date d'inscription</th>
                {/* <th className="p-4 text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Chargement des clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Aucun client enregistré.
                  </td>
                </tr>
              ) : (
                filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-indigo-600">{c.id}</td>
                    <td className="p-4 font-bold text-slate-900">{c.user?.nom || 'Client Anonyme'}</td>
                    <td className="p-4 text-slate-600">{c.user?.email || 'N/A'}</td>
                    <td className="p-4 text-center font-bold text-indigo-600">
                      {c.nombreCommandes}
                    </td>
                    <td className="p-4 text-right font-black text-slate-900">
                      {c.totalDepense.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                        {c.statut}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {c.user?.dateInscription || '2024-03-01'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TiDB Cloud Inspector Modal */}
      {showTiDBModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Inspecteur TiDB Cloud Data App (Clients)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Endpoint : <code>/endpoint/clients?id=${'{id}'}</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTiDBModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter by ID */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Filtre ID (?id=...) :
                </label>
                {tidbTargetId && (
                  <button
                    type="button"
                    onClick={() => {
                      setTidbTargetId('');
                      handleInspectTiDB('');
                    }}
                    className="text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    Effacer le filtre (Tous les clients)
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 1, c1... (laisser vide pour tous les clients)"
                  value={tidbTargetId}
                  onChange={(e) => setTidbTargetId(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleInspectTiDB(tidbTargetId)}
                  disabled={tidbInspection.loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Exécuter</span>
                </button>
              </div>

              {/* Sample IDs chips */}
              {clients.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Exemples :</span>
                  {clients.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setTidbTargetId(c.id);
                        handleInspectTiDB(c.id);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono border transition ${
                        tidbTargetId === c.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.id} ({c.user?.nom || 'Client'})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* cURL Display */}
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto relative group">
              <pre className="whitespace-pre-wrap select-all">
                curl --user ${'{PUBLIC_KEY}:${PRIVATE_KEY}'} --request GET \{'\n'}
                &nbsp;&nbsp;'{clientsBaseUrl}{tidbTargetId ? `?id=${tidbTargetId}` : '?id=${id}'}'
              </pre>
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                <button
                  onClick={handleCopyCurl}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700 transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copier cURL</span>
                </button>
              </div>
            </div>

            {/* Response Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Résultat de l'exécution :</span>
                {tidbInspection.latencyMs !== undefined && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Clock className="w-3 h-3" />
                    {tidbInspection.latencyMs} ms
                  </span>
                )}
              </div>

              {tidbInspection.loading ? (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Interrogation de TiDB Cloud en cours...</p>
                </div>
              ) : tidbInspection.error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Erreur de requête</span>
                  </div>
                  <p className="font-mono text-[11px]">{tidbInspection.error}</p>
                </div>
              ) : tidbInspection.executed ? (
                <div className="space-y-3">
                  {/* Parsed preview */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                      Données Normalisées :
                    </span>
                    {tidbInspection.singleClient ? (
                      <div className="space-y-1">
                        <p><span className="font-bold">ID :</span> {tidbInspection.singleClient.id}</p>
                        <p><span className="font-bold">Nom :</span> {tidbInspection.singleClient.user?.nom || 'N/A'}</p>
                        <p><span className="font-bold">Email :</span> {tidbInspection.singleClient.user?.email || 'N/A'}</p>
                        <p><span className="font-bold">Commandes :</span> {tidbInspection.singleClient.nombreCommandes}</p>
                        <p><span className="font-bold">Dépenses :</span> {tidbInspection.singleClient.totalDepense} €</p>
                        <p><span className="font-bold">Statut :</span> {tidbInspection.singleClient.statut}</p>
                      </div>
                    ) : (
                      <p className="text-slate-600">
                        {tidbInspection.clients?.length || 0} client(s) récupéré(s) depuis TiDB Cloud.
                      </p>
                    )}
                  </div>

                  {/* Raw JSON viewer */}
                  <details className="text-xs group bg-slate-900 text-slate-200 rounded-xl p-3">
                    <summary className="cursor-pointer font-bold text-slate-300 hover:text-white flex items-center justify-between">
                      <span>Voir la réponse JSON brute</span>
                      <span className="text-[10px] text-slate-400 group-open:rotate-180 transition">▼</span>
                    </summary>
                    <pre className="mt-2 text-[10px] font-mono overflow-x-auto max-h-48 text-emerald-400 bg-slate-950 p-2.5 rounded-lg">
                      {JSON.stringify(tidbInspection.rawResponse, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  Cliquez sur "Exécuter" pour interroger TiDB Cloud.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={handleSyncTiDBClients}
                disabled={syncingTiDB}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Synchroniser tous les clients vers la BDD</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTiDBModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
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

