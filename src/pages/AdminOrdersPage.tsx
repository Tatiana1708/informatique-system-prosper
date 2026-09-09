import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Copy,
  Edit2,
  ExternalLink,
  Eye,
  Filter,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Terminal,
  Truck,
  UploadCloud,
  X,
  XCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Commande, LigneCommande, OrderStatus } from '../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Commande | null>(null);

  // TiDB Cloud state
  const [tidbStatus, setTidbStatus] = useState<{
    ordersEndpointUrl?: string;
    orderLinesEndpointUrl?: string;
    isConfigured: boolean;
    publicKeyMasked?: string;
  } | null>(null);

  const [copiedCurlOrders, setCopiedCurlOrders] = useState(false);
  const [copiedCurlOrderLines, setCopiedCurlOrderLines] = useState(false);
  const [syncingTiDB, setSyncingTiDB] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // TiDB Inspection Modal
  const [showTiDBModal, setShowTiDBModal] = useState(false);
  const [tidbTab, setTidbTab] = useState<'orders' | 'order_lines'>('orders');
  const [tidbTargetId, setTidbTargetId] = useState<string>('');
  const [tidbInspection, setTidbInspection] = useState<{
    loading: boolean;
    executed: boolean;
    orders?: Commande[];
    orderLines?: LigneCommande[];
    singleOrder?: Commande | null;
    singleOrderLine?: LigneCommande | null;
    rawResponse: any;
    latencyMs?: number;
    error?: string;
    targetUrl?: string;
  }>({
    loading: false,
    executed: false,
    rawResponse: null,
  });

  const ordersBaseUrl =
    tidbStatus?.ordersEndpointUrl ||
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders';
  const orderLinesBaseUrl =
    tidbStatus?.orderLinesEndpointUrl ||
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines';

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders(statusFilter);
      setOrders(data);
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
    loadOrders();
  }, [statusFilter]);

  useEffect(() => {
    loadTiDBStatus();
  }, []);

  const handleUpdateStatus = async (id: string, nextStatus: OrderStatus) => {
    await api.updateOrderStatus(id, nextStatus);
    loadOrders();
    if (selectedOrderDetails && selectedOrderDetails.id === id) {
      setSelectedOrderDetails({ ...selectedOrderDetails, statut: nextStatus });
    }
  };

  const handleCopyCurl = (target: 'orders' | 'order_lines') => {
    let cmd = '';
    if (target === 'orders') {
      const url = tidbTargetId ? `${ordersBaseUrl}?id=${tidbTargetId}` : ordersBaseUrl;
      cmd = `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${url}'`;
      navigator.clipboard.writeText(cmd);
      setCopiedCurlOrders(true);
      setTimeout(() => setCopiedCurlOrders(false), 2000);
    } else {
      const url = tidbTargetId ? `${orderLinesBaseUrl}?id=${tidbTargetId}` : orderLinesBaseUrl;
      cmd = `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${url}'`;
      navigator.clipboard.writeText(cmd);
      setCopiedCurlOrderLines(true);
      setTimeout(() => setCopiedCurlOrderLines(false), 2000);
    }
  };

  const handleInspectTiDB = async (targetTab = tidbTab, customId = tidbTargetId) => {
    setTidbInspection({
      loading: true,
      executed: false,
      rawResponse: null,
      error: undefined,
    });

    try {
      const cleanId = customId.trim();
      if (targetTab === 'orders') {
        if (cleanId) {
          const res = await api.getTiDBOrderById(cleanId);
          setTidbInspection({
            loading: false,
            executed: true,
            singleOrder: res.order,
            rawResponse: res.rawResponse,
            latencyMs: res.latencyMs,
            targetUrl: res.targetUrl || `${ordersBaseUrl}?id=${cleanId}`,
          });
        } else {
          const res = await api.getTiDBOrders();
          setTidbInspection({
            loading: false,
            executed: true,
            orders: res.orders,
            rawResponse: res.rawResponse,
            latencyMs: res.latencyMs,
            targetUrl: res.targetUrl || ordersBaseUrl,
          });
        }
      } else {
        // order_lines
        if (cleanId) {
          const res = await api.getTiDBOrderLineById(cleanId);
          setTidbInspection({
            loading: false,
            executed: true,
            singleOrderLine: res.orderLine,
            rawResponse: res.rawResponse,
            latencyMs: res.latencyMs,
            targetUrl: res.targetUrl || `${orderLinesBaseUrl}?id=${cleanId}`,
          });
        } else {
          const res = await api.getTiDBOrderLines();
          setTidbInspection({
            loading: false,
            executed: true,
            orderLines: res.orderLines,
            rawResponse: res.rawResponse,
            latencyMs: res.latencyMs,
            targetUrl: res.targetUrl || orderLinesBaseUrl,
          });
        }
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

  const handleSyncTiDBOrders = async () => {
    setSyncingTiDB(true);
    try {
      const res = await api.syncTiDBOrders();
      setNotification({
        type: 'success',
        message: `${res.message} (${res.latencyMs}ms)`,
      });
      loadOrders();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Échec de synchronisation des commandes TiDB Cloud',
      });
    } finally {
      setSyncingTiDB(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const openInspectorWithId = (id: string, tab: 'orders' | 'order_lines' = 'orders') => {
    setTidbTab(tab);
    setTidbTargetId(id);
    setShowTiDBModal(true);
    handleInspectTiDB(tab, id);
  };

  return (
    <div className="space-y-6">
      {/* Header & TiDB actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Gestion des Commandes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
           Suivi, expédition et annulation des commandes clients temps réel.
          </p>
        </div>

        {/* <div className="flex items-center gap-2 flex-wrap">

          <button
            onClick={handleSyncTiDBOrders}
            disabled={syncingTiDB}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <UploadCloud className={`w-3.5 h-3.5 ${syncingTiDB ? 'animate-bounce' : ''}`} />
            <span>{syncingTiDB ? 'Synchronisation...' : 'Synchroniser Commandes'}</span>
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

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Filtrer par statut :</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Expédiée">Expédiée</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>

        <button
          onClick={loadOrders}
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
                <th className="p-4">Référence</th>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Paiement</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chargement des commandes...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-indigo-600 font-mono">{o.reference}</td>
                    <td className="p-4">{o.clientNom}</td>
                    <td className="p-4 text-slate-500">{o.date}</td>
                    <td className="p-4 text-right font-black text-slate-900">
                      {o.montantTotal.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          o.statut === 'Livrée'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.statut === 'Expédiée'
                            ? 'bg-blue-100 text-blue-800'
                            : o.statut === 'Annulée'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.statut}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {o.statutPaiement}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedOrderDetails(o)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                        title="Voir les détails"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'Expédiée')}
                        disabled={o.statut === 'Expédiée' || o.statut === 'Livrée' || o.statut === 'Annulée'}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg transition disabled:opacity-40"
                        title="Marquer comme Expédiée"
                      >
                        Expédier
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'Annulée')}
                        disabled={o.statut === 'Annulée' || o.statut === 'Livrée'}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg transition disabled:opacity-40"
                        title="Annuler la commande"
                      >
                        Annuler
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Détails Commande : {selectedOrderDetails.reference}
                </h3>
                <p className="text-xs text-slate-500">Client : {selectedOrderDetails.clientNom}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block font-medium">Adresse de livraison :</span>
                <span className="font-bold text-slate-800">{selectedOrderDetails.adresseLivraison}</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Produit</th>
                      <th className="p-2.5 text-center">Quantité</th>
                      <th className="p-2.5 text-right">Prix Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderDetails.lignes.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-bold text-slate-800">{l.produit?.nom || 'Produit'}</td>
                        <td className="p-2.5 text-center">{l.quantite}</td>
                        <td className="p-2.5 text-right font-bold text-indigo-600">
                          {l.prixTotal.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-900">
                Total :{' '}
                {selectedOrderDetails.montantTotal.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

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
                    Inspecteur TiDB Cloud Data App (Orders &amp; Lines)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test d'interrogation HTTP Digest avec filtre ID optionnel
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

            {/* Tab switch between Orders and Order Lines */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => {
                  setTidbTab('orders');
                  handleInspectTiDB('orders', tidbTargetId);
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  tidbTab === 'orders'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Commandes (/endpoint/orders)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTidbTab('order_lines');
                  handleInspectTiDB('order_lines', tidbTargetId);
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  tidbTab === 'order_lines'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lignes de commande (/endpoint/order_lines)
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
                      handleInspectTiDB(tidbTab, '');
                    }}
                    className="text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    Effacer le filtre (Tout charger)
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    tidbTab === 'orders'
                      ? 'Ex: 1, cmd-1... (laisser vide pour toutes les commandes)'
                      : 'Ex: 1, lc-1... (laisser vide pour toutes les lignes)'
                  }
                  value={tidbTargetId}
                  onChange={(e) => setTidbTargetId(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleInspectTiDB(tidbTab, tidbTargetId)}
                  disabled={tidbInspection.loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Exécuter</span>
                </button>
              </div>

              {/* Sample IDs chips */}
              {orders.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Exemples :</span>
                  {orders.slice(0, 5).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => {
                        setTidbTargetId(o.id);
                        handleInspectTiDB(tidbTab, o.id);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono border transition ${
                        tidbTargetId === o.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {o.id} ({o.reference})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* cURL Display */}
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto relative group">
              <pre className="whitespace-pre-wrap select-all">
                curl --user ${'{PUBLIC_KEY}:${PRIVATE_KEY}'} --request GET \{'\n'}
                &nbsp;&nbsp;'{tidbTab === 'orders' ? ordersBaseUrl : orderLinesBaseUrl}
                {tidbTargetId ? `?id=${tidbTargetId}` : '?id=${id}'}'
              </pre>
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyCurl(tidbTab)}
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
                    {tidbTab === 'orders' ? (
                      tidbInspection.singleOrder ? (
                        <div className="space-y-1">
                          <p><span className="font-bold">ID :</span> {tidbInspection.singleOrder.id}</p>
                          <p><span className="font-bold">Réf :</span> {tidbInspection.singleOrder.reference}</p>
                          <p><span className="font-bold">Client :</span> {tidbInspection.singleOrder.clientNom} ({tidbInspection.singleOrder.clientEmail})</p>
                          <p><span className="font-bold">Total :</span> {tidbInspection.singleOrder.montantTotal} €</p>
                          <p><span className="font-bold">Statut :</span> {tidbInspection.singleOrder.statut}</p>
                        </div>
                      ) : (
                        <p className="text-slate-600">
                          {tidbInspection.orders?.length || 0} commande(s) récupérée(s) depuis TiDB Cloud.
                        </p>
                      )
                    ) : tidbInspection.singleOrderLine ? (
                      <div className="space-y-1">
                        <p><span className="font-bold">ID :</span> {tidbInspection.singleOrderLine.id}</p>
                        <p><span className="font-bold">Commande ID :</span> {tidbInspection.singleOrderLine.commandeId}</p>
                        <p><span className="font-bold">Produit ID :</span> {tidbInspection.singleOrderLine.produitId}</p>
                        <p><span className="font-bold">Quantité :</span> {tidbInspection.singleOrderLine.quantite}</p>
                        <p><span className="font-bold">Prix :</span> {tidbInspection.singleOrderLine.prixTotal} €</p>
                      </div>
                    ) : (
                      <p className="text-slate-600">
                        {tidbInspection.orderLines?.length || 0} ligne(s) de commande récupérée(s) depuis TiDB Cloud.
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
                onClick={handleSyncTiDBOrders}
                disabled={syncingTiDB}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Synchroniser toutes les commandes vers la BDD</span>
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



// import React, { useEffect, useState } from 'react';
// import {
//   CheckCircle2,
//   Eye,
//   Filter,
//   PackageCheck,
//   RefreshCw,
//   ShoppingBag,
//   Truck,
//   X,
//   XCircle,
// } from 'lucide-react';
// import { api } from '../services/api';
// import { Commande, OrderStatus } from '../types';

// export const AdminOrdersPage: React.FC = () => {
//   const [orders, setOrders] = useState<Commande[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filters state
//   const [statusFilter, setStatusFilter] = useState<string>('Tous');
//   const [selectedOrderDetails, setSelectedOrderDetails] = useState<Commande | null>(null);

//   const loadOrders = async () => {
//     setLoading(true);
//     try {
//       const data = await api.getOrders(statusFilter);
//       setOrders(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, [statusFilter]);

//   const handleUpdateStatus = async (id: string, nextStatus: OrderStatus) => {
//     await api.updateOrderStatus(id, nextStatus);
//     loadOrders();
//     if (selectedOrderDetails && selectedOrderDetails.id === id) {
//       setSelectedOrderDetails({ ...selectedOrderDetails, statut: nextStatus });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-black text-slate-900 tracking-tight">
//           Gestion des Commandes
//         </h1>
//         <p className="text-xs text-slate-500 mt-1">
//           Suivi, expédition et annulation des commandes clients.
//         </p>
//       </div>

//       {/* Filter Control Bar */}
//       <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <label className="text-xs font-bold text-slate-700">Filtrer par statut :</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
//           >
//             <option value="Tous">Tous les statuts</option>
//             <option value="En attente">En attente</option>
//             <option value="En cours">En cours</option>
//             <option value="Expédiée">Expédiée</option>
//             <option value="Livrée">Livrée</option>
//             <option value="Annulée">Annulée</option>
//           </select>
//         </div>

//         <button
//           onClick={loadOrders}
//           className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
//         >
//           <RefreshCw className="w-3.5 h-3.5" />
//           <span>Actualiser</span>
//         </button>
//       </div>

//       {/* Table Section (Required Columns: Référence, Client, Date, Montant, Statut, Paiement) */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
//                 <th className="p-4">Référence</th>
//                 <th className="p-4">Client</th>
//                 <th className="p-4">Date</th>
//                 <th className="p-4 text-right">Montant</th>
//                 <th className="p-4">Statut</th>
//                 <th className="p-4">Paiement</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="p-8 text-center text-slate-400">
//                     Chargement des commandes...
//                   </td>
//                 </tr>
//               ) : orders.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-8 text-center text-slate-500">
//                     Aucune commande trouvée.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((o) => (
//                   <tr key={o.id} className="hover:bg-slate-50/80 transition">
//                     <td className="p-4 font-bold text-blue-600">{o.reference}</td>
//                     <td className="p-4">{o.clientNom}</td>
//                     <td className="p-4 text-slate-500">{o.date}</td>
//                     <td className="p-4 text-right font-black text-slate-900">
//                       {o.montantTotal.toLocaleString('fr-FR', {
//                         style: 'currency',
//                         currency: 'EUR',
//                       })}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
//                           o.statut === 'Livrée'
//                             ? 'bg-emerald-100 text-emerald-800'
//                             : o.statut === 'Expédiée'
//                             ? 'bg-blue-100 text-blue-800'
//                             : o.statut === 'Annulée'
//                             ? 'bg-rose-100 text-rose-800'
//                             : 'bg-amber-100 text-amber-800'
//                         }`}
//                       >
//                         {o.statut}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
//                         {o.statutPaiement}
//                       </span>
//                     </td>
//                     <td className="p-4 text-right space-x-1.5">
//                       <button
//                         onClick={() => setSelectedOrderDetails(o)}
//                         className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
//                         title="Voir les détails"
//                       >
//                         Voir
//                       </button>
//                       <button
//                         onClick={() => handleUpdateStatus(o.id, 'Expédiée')}
//                         disabled={o.statut === 'Expédiée' || o.statut === 'Livrée' || o.statut === 'Annulée'}
//                         className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg transition disabled:opacity-40"
//                         title="Marquer comme Expédiée"
//                       >
//                         Expédier
//                       </button>
//                       <button
//                         onClick={() => handleUpdateStatus(o.id, 'Annulée')}
//                         disabled={o.statut === 'Annulée' || o.statut === 'Livrée'}
//                         className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg transition disabled:opacity-40"
//                         title="Annuler la commande"
//                       >
//                         Annuler
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Details Modal */}
//       {selectedOrderDetails && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <div>
//                 <h3 className="font-extrabold text-slate-900 text-base">
//                   Détails Commande : {selectedOrderDetails.reference}
//                 </h3>
//                 <p className="text-xs text-slate-500">Client : {selectedOrderDetails.clientNom}</p>
//               </div>
//               <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 hover:text-slate-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-3 text-xs">
//               <div className="p-3 bg-slate-50 rounded-xl space-y-1">
//                 <span className="text-slate-500 block font-medium">Adresse de livraison :</span>
//                 <span className="font-bold text-slate-800">{selectedOrderDetails.adresseLivraison}</span>
//               </div>

//               <div className="overflow-x-auto border border-slate-200 rounded-xl">
//                 <table className="w-full text-left text-xs">
//                   <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px]">
//                     <tr>
//                       <th className="p-2.5">Produit</th>
//                       <th className="p-2.5 text-center">Quantité</th>
//                       <th className="p-2.5 text-right">Prix Total</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {selectedOrderDetails.lignes.map((l) => (
//                       <tr key={l.id}>
//                         <td className="p-2.5 font-bold text-slate-800">{l.produit?.nom || 'Produit'}</td>
//                         <td className="p-2.5 text-center">{l.quantite}</td>
//                         <td className="p-2.5 text-right font-bold text-blue-600">
//                           {l.prixTotal.toLocaleString('fr-FR', {
//                             style: 'currency',
//                             currency: 'EUR',
//                           })}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
//               <span className="text-xs font-extrabold text-slate-900">
//                 Total :{' '}
//                 {selectedOrderDetails.montantTotal.toLocaleString('fr-FR', {
//                   style: 'currency',
//                   currency: 'EUR',
//                 })}
//               </span>
//               <button
//                 onClick={() => setSelectedOrderDetails(null)}
//                 className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
