import React, { useEffect, useState } from 'react';
import {
  Database,
  PlusCircle,
  Play,
  RefreshCw,
  Table,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Server,
  HardDrive,
  Sparkles,
  Printer,
  Cpu,
  Users,
  ShoppingBag,
  FolderTree,
  Package,
  Layers,
  ArrowRight,
  Code,
  FileText,
  Cloud,
  Copy,
  Check,
  Search,
  UserCheck,
  ShoppingCart,
  ListOrdered,
} from 'lucide-react';
import { api } from '../services/api';
import { Categorie, DbOverview, DbTableInfo, Produit, SqlQueryResult, User } from '../types';

export const AdminDatabasePage: React.FC = () => {
  const [overview, setOverview] = useState<DbOverview | null>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTableTab, setActiveTableTab] = useState<'products' | 'categories' | 'users' | 'clients' | 'orders'>('products');
  
  // Add Data Form State
  const [selectedInsertType, setSelectedInsertType] = useState<'product' | 'category' | 'user' | 'order'>('product');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insertSuccessMessage, setInsertSuccessMessage] = useState<string | null>(null);
  const [insertErrorMessage, setInsertErrorMessage] = useState<string | null>(null);

  // Form Fields - Product
  const [prodNom, setProdNom] = useState('');
  const [prodMarque, setProdMarque] = useState('HP');
  const [prodModele, setProdModele] = useState('');
  const [prodCategorieId, setProdCategorieId] = useState('cat-4');
  const [prodPrix, setProdPrix] = useState('2490.00');
  const [prodStock, setProdStock] = useState('15');
  const [prodGarantie, setProdGarantie] = useState('3 ans');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80');
  const [prodCaracteristiques, setProdCaracteristiques] = useState('Vitesse 45 ppm, Recto-verso automatique, Écran tactile');

  // Form Fields - Category
  const [catNom, setCatNom] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catStatut, setCatStatut] = useState<'Actif' | 'Inactif'>('Actif');

  // Form Fields - User
  const [userNom, setUserNom] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'Admin' | 'Vendeur' | 'Client'>('Client');
  const [userStatut, setUserStatut] = useState<'Actif' | 'Inactif'>('Actif');

  // Form Fields - Order
  const [orderRef, setOrderRef] = useState(`CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [orderClientNom, setOrderClientNom] = useState('');
  const [orderClientEmail, setOrderClientEmail] = useState('');
  const [orderMontant, setOrderMontant] = useState('850.00');
  const [orderStatut, setOrderStatut] = useState<'En attente' | 'Payée' | 'Expédiée' | 'Livrée'>('Payée');
  const [orderAdresse, setOrderAdresse] = useState('25 Rue de Rivoli, 75004 Paris');

  // SQL Console State
  const [sqlQuery, setSqlQuery] = useState('SELECT id, nom, marque, prix, stock FROM products LIMIT 10;');
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlResult, setSqlResult] = useState<SqlQueryResult | null>(null);

  // Batch Seeder State
  const [batchLoading, setBatchLoading] = useState(false);

  // TiDB Cloud Data App State
  const [tidbActiveTab, setTidbActiveTab] = useState<
    'products' | 'categories' | 'users' | 'orders' | 'clients' | 'order_lines'
  >('products');
  const [tidbStatus, setTidbStatus] = useState<{
    endpointUrl: string;
    categoriesEndpointUrl?: string;
    usersEndpointUrl?: string;
    ordersEndpointUrl?: string;
    clientsEndpointUrl?: string;
    orderLinesEndpointUrl?: string;
    isConfigured: boolean;
    publicKeyMasked: string;
    curlSample: string;
    curlSampleById?: string;
    curlCategories?: string;
    curlCategoriesById?: string;
    curlUsers?: string;
    curlUsersById?: string;
    curlOrders?: string;
    curlOrdersById?: string;
    curlClients?: string;
    curlClientsById?: string;
    curlOrderLines?: string;
    curlOrderLinesById?: string;
  } | null>(null);
  const [testingTiDB, setTestingTiDB] = useState(false);
  const [syncingTiDB, setSyncingTiDB] = useState(false);
  const [tidbTargetId, setTidbTargetId] = useState('');
  const [tidbTestResult, setTidbTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
    totalRows?: number;
    rawResponse?: any;
    targetUrl?: string;
    entityType?: 'products' | 'categories' | 'users' | 'orders' | 'clients' | 'order_lines';
  } | null>(null);
  const [copiedTiDBCurl, setCopiedTiDBCurl] = useState(false);
  const [copiedTiDBCurlById, setCopiedTiDBCurlById] = useState(false);

  const fetchDbData = async () => {
    setLoading(true);
    try {
      const [ov, cats, tStatus] = await Promise.all([
        api.getDbOverview(),
        api.getCategories(),
        api.getTiDBStatus().catch(() => null),
      ]);
      setOverview(ov);
      setCategories(cats);
      if (tStatus) setTidbStatus(tStatus);
    } catch (err) {
      console.error('Erreur chargement overview DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  const getActiveTiDBEndpointUrl = () => {
    if (tidbActiveTab === 'categories') {
      return (
        tidbStatus?.categoriesEndpointUrl ||
        'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories'
      );
    }
    if (tidbActiveTab === 'users') {
      return (
        tidbStatus?.usersEndpointUrl ||
        'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users'
      );
    }
    if (tidbActiveTab === 'orders') {
      return (
        tidbStatus?.ordersEndpointUrl ||
        'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders'
      );
    }
    if (tidbActiveTab === 'clients') {
      return (
        tidbStatus?.clientsEndpointUrl ||
        'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients'
      );
    }
    if (tidbActiveTab === 'order_lines') {
      return (
        tidbStatus?.orderLinesEndpointUrl ||
        'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines'
      );
    }
    return (
      tidbStatus?.endpointUrl ||
      'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products'
    );
  };

  const handleTestTiDB = async (customId?: string) => {
    setTestingTiDB(true);
    setTidbTestResult(null);
    const queryId = customId !== undefined ? customId : tidbTargetId;
    if (customId !== undefined) {
      setTidbTargetId(customId);
    }
    const cleanId = queryId.trim() || undefined;

    try {
      if (tidbActiveTab === 'categories') {
        const res = await api.getTiDBCategories(cleanId);
        setTidbTestResult({
          success: true,
          message: `${res.categories.length} catégorie(s) récupérée(s) depuis le point de terminaison TiDB Cloud${cleanId ? ` (avec ?id=${cleanId})` : ''}.`,
          latencyMs: res.latencyMs,
          totalRows: res.categories.length,
          rawResponse: res.rawResponse,
          targetUrl: res.targetUrl,
          entityType: 'categories',
        });
      } else if (tidbActiveTab === 'users') {
        const res = await api.getTiDBUsers(cleanId);
        setTidbTestResult({
          success: true,
          message: `${res.users.length} utilisateur(s) récupéré(s) depuis le point de terminaison TiDB Cloud${cleanId ? ` (avec ?id=${cleanId})` : ''}.`,
          latencyMs: res.latencyMs,
          totalRows: res.users.length,
          rawResponse: res.rawResponse,
          targetUrl: res.targetUrl,
          entityType: 'users',
        });
      } else if (tidbActiveTab === 'orders') {
        const res = await api.getTiDBOrders(cleanId);
        setTidbTestResult({
          success: true,
          message: `${res.orders.length} commande(s) récupérée(s) depuis le point de terminaison TiDB Cloud${cleanId ? ` (avec ?id=${cleanId})` : ''}.`,
          latencyMs: res.latencyMs,
          totalRows: res.orders.length,
          rawResponse: res.rawResponse,
          targetUrl: res.targetUrl,
          entityType: 'orders',
        });
      } else if (tidbActiveTab === 'clients') {
        const res = await api.getTiDBClients(cleanId);
        setTidbTestResult({
          success: true,
          message: `${res.clients.length} client(s) récupéré(s) depuis le point de terminaison TiDB Cloud${cleanId ? ` (avec ?id=${cleanId})` : ''}.`,
          latencyMs: res.latencyMs,
          totalRows: res.clients.length,
          rawResponse: res.rawResponse,
          targetUrl: res.targetUrl,
          entityType: 'clients',
        });
      } else if (tidbActiveTab === 'order_lines') {
        const res = await api.getTiDBOrderLines(cleanId);
        setTidbTestResult({
          success: true,
          message: `${res.orderLines.length} ligne(s) de commande récupérée(s) depuis le point de terminaison TiDB Cloud${cleanId ? ` (avec ?id=${cleanId})` : ''}.`,
          latencyMs: res.latencyMs,
          totalRows: res.orderLines.length,
          rawResponse: res.rawResponse,
          targetUrl: res.targetUrl,
          entityType: 'order_lines',
        });
      } else {
        const res = await api.getTiDBProducts(cleanId);
        setTidbTestResult({
          success: true,
          message: `${res.products.length} produit(s) récupérés depuis le point de terminaison TiDB Cloud${cleanId ? ` (avec ?id=${cleanId})` : ''}.`,
          latencyMs: res.latencyMs,
          totalRows: res.products.length,
          rawResponse: res.rawResponse,
          targetUrl: res.targetUrl,
          entityType: 'products',
        });
      }
    } catch (err: any) {
      setTidbTestResult({
        success: false,
        error: err.message || 'Erreur lors du test TiDB Cloud',
        entityType: tidbActiveTab,
      });
    } finally {
      setTestingTiDB(false);
    }
  };

  const handleSyncTiDBToDb = async () => {
    setSyncingTiDB(true);
    try {
      if (tidbActiveTab === 'categories') {
        const res = await api.syncTiDBCategories();
        await fetchDbData();
        setInsertSuccessMessage(
          `${res.count} catégories synchronisées et stockées en base de données depuis TiDB Cloud (${res.latencyMs} ms) !`
        );
      } else if (tidbActiveTab === 'users') {
        const res = await api.syncTiDBUsers();
        await fetchDbData();
        setInsertSuccessMessage(
          `${res.count} utilisateurs synchronisés et stockés en base de données depuis TiDB Cloud (${res.latencyMs} ms) !`
        );
      } else if (tidbActiveTab === 'orders') {
        const res = await api.syncTiDBOrders();
        await fetchDbData();
        setInsertSuccessMessage(
          `${res.count} commandes synchronisées et stockées en base de données depuis TiDB Cloud (${res.latencyMs} ms) !`
        );
      } else if (tidbActiveTab === 'clients') {
        const res = await api.syncTiDBClients();
        await fetchDbData();
        setInsertSuccessMessage(
          `${res.count} clients synchronisés et stockés en base de données depuis TiDB Cloud (${res.latencyMs} ms) !`
        );
      } else if (tidbActiveTab === 'order_lines') {
        setInsertSuccessMessage(
          `Les lignes de commande sont interrogées depuis TiDB Cloud Data App.`
        );
      } else {
        const res = await api.syncTiDBProducts();
        await fetchDbData();
        setInsertSuccessMessage(
          `${res.count} produits synchronisés et stockés en base de données depuis TiDB Cloud (${res.latencyMs} ms) !`
        );
      }
    } catch (err: any) {
      setInsertErrorMessage(`Erreur synchronisation TiDB : ${err.message}`);
    } finally {
      setSyncingTiDB(false);
    }
  };

  const handleCopyTiDBCurl = (withId = false) => {
    const base = getActiveTiDBEndpointUrl();
    const idVal = tidbTargetId.trim() || '${id}';
    const curl = withId
      ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${base}?id=${idVal}'`
      : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${base}'`;

    navigator.clipboard.writeText(curl);
    if (withId) {
      setCopiedTiDBCurlById(true);
      setTimeout(() => setCopiedTiDBCurlById(false), 2500);
    } else {
      setCopiedTiDBCurl(true);
      setTimeout(() => setCopiedTiDBCurl(false), 2500);
    }
  };

  // Handle Form Submission (Add Data to DB)
  const handleInsertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInsertSuccessMessage(null);
    setInsertErrorMessage(null);

    try {
      if (selectedInsertType === 'product') {
        const catObj = categories.find((c) => c.id === prodCategorieId);
        const specs = prodCaracteristiques
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const res = await api.insertDbData('products', {
          nom: prodNom,
          marque: prodMarque,
          modele: prodModele || prodNom,
          categorieId: prodCategorieId,
          categorieNom: catObj ? catObj.nom : 'Imprimantes & Scanners',
          prix: parseFloat(prodPrix) || 0,
          stock: parseInt(prodStock, 10) || 0,
          garantie: prodGarantie,
          description: prodDescription || `Produit informatique haute performance de marque ${prodMarque}.`,
          image: prodImage,
          caracteristiques: specs.length > 0 ? specs : ['Haute performance', 'Garantie constructeur'],
        });

        setInsertSuccessMessage(res.message || 'Produit ajouté avec succès en base de données.');
        setProdNom('');
        setProdModele('');
        setProdDescription('');
      } else if (selectedInsertType === 'category') {
        const res = await api.insertDbData('categories', {
          nom: catNom,
          description: catDescription || `Catégorie ${catNom}`,
          statut: catStatut,
        });
        setInsertSuccessMessage(res.message || 'Catégorie ajoutée avec succès en base de données.');
        setCatNom('');
        setCatDescription('');
      } else if (selectedInsertType === 'user') {
        const res = await api.insertDbData('users', {
          nom: userNom,
          email: userEmail,
          role: userRole,
          statut: userStatut,
          isEmailVerified: true,
        });
        setInsertSuccessMessage(res.message || 'Utilisateur ajouté avec succès en base de données.');
        setUserNom('');
        setUserEmail('');
      } else if (selectedInsertType === 'order') {
        const res = await api.insertDbData('orders', {
          reference: orderRef,
          clientNom: orderClientNom || 'Client Société',
          clientEmail: orderClientEmail || 'client@societe.fr',
          montantTotal: parseFloat(orderMontant) || 100,
          statut: orderStatut,
          statutPaiement: 'Payé',
          adresseLivraison: orderAdresse,
        });
        setInsertSuccessMessage(res.message || 'Commande ajoutée avec succès en base de données.');
        setOrderRef(`CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      }

      // Refresh overview
      await fetchDbData();
    } catch (err: any) {
      setInsertErrorMessage(err.message || 'Erreur lors de l\'insertion en base de données.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run SQL Query
  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecutingSql(true);
    try {
      const res = await api.executeSql(sqlQuery);
      setSqlResult(res);
      await fetchDbData();
    } catch (err: any) {
      setSqlResult({
        success: false,
        sql: sqlQuery,
        error: err.message || 'Erreur lors de l\'exécution',
      });
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Run Batch Seeder
  const handleSeedBatch = async (batchType: 'printers' | 'servers' | 'users' | 'all') => {
    setBatchLoading(true);
    try {
      const res = await api.seedDbBatch(batchType);
      setInsertSuccessMessage(res.message);
      await fetchDbData();
    } catch (err: any) {
      setInsertErrorMessage(err.message || 'Erreur lors de l\'injection de données');
    } finally {
      setBatchLoading(false);
    }
  };

  const selectedTableInfo = overview?.tables.find((t) => t.tableName === activeTableTab);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Gestion de la Base de Données
              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                overview?.mode === 'mysql'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {overview?.mode === 'mysql' ? 'Moteur MySQL Connecté' : 'Stockage Persistant (Local File DB)'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ajoutez des données, inspectez les tables, exécutez des requêtes SQL et pilotez le schéma de données.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDbData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Database Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-purple-600" />
            Total Enregistrements
          </div>
          <div className="text-2xl font-black text-slate-900">
            {overview?.totalRecords ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Dans {overview?.tables.length ?? 5} tables relationnelles
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-600" />
            Hôte & Base
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">
            {overview?.config.database || 'informatique_system_prosper'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">
            {overview?.config.host}:{overview?.config.port} ({overview?.config.user})
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            État de Synchronisation
          </div>
          <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Opérationnel
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Synchronisation continue active
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-amber-600" />
            Tables Actives
          </div>
          <div className="text-sm font-bold text-slate-800">
            products, categories, users, orders
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            InnoDB / Clés primaires UUID
          </div>
        </div>
      </div>

      {/* Batch Data Seeder Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-200">
                Générateur & Injection Rapide en Base de Données
              </h2>
            </div>
            <p className="text-xs text-purple-100 max-w-xl">
              Injectez instantanément des lots d'équipements réels (imprimantes professionnelles A3, serveurs d'entreprise Dell/Cisco, ou comptes utilisateurs) pour enrichir votre base.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSeedBatch('printers')}
              disabled={batchLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700/80 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold transition border border-purple-500/50"
            >
              <Printer className="w-3.5 h-3.5 text-purple-200" />
              <span>+ Lot Imprimantes A3</span>
            </button>

            <button
              onClick={() => handleSeedBatch('servers')}
              disabled={batchLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition border border-indigo-500/50"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-200" />
              <span>+ Lot Serveurs & Réseau</span>
            </button>

            <button
              onClick={() => handleSeedBatch('users')}
              disabled={batchLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition border border-slate-600/50"
            >
              <Users className="w-3.5 h-3.5 text-slate-200" />
              <span>+ Lot Utilisateurs Pro</span>
            </button>
          </div>
        </div>
      </div>

      {/* TiDB Cloud Data App Endpoint Integration Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <Cloud className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>TiDB Cloud Data App • Endpoints API GET</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tidbStatus?.isConfigured
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {tidbStatus?.isConfigured ? 'Clés Configuées' : 'Authentification Prête'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Interrogez et synchronisez vos produits, catégories et utilisateurs directement depuis les points de terminaison TiDB Cloud Data App avec authentification Digest.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopyTiDBCurl(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              title="Copier avec le paramètre ?id"
            >
              {copiedTiDBCurlById ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedTiDBCurlById ? 'Copié !' : 'Copier curl ?id=${id}'}</span>
            </button>

            <button
              onClick={() => handleCopyTiDBCurl(false)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              title="Copier curl standard"
            >
              {copiedTiDBCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedTiDBCurl ? 'Copié !' : 'Copier curl standard'}</span>
            </button>

            <button
              onClick={() => handleTestTiDB()}
              disabled={testingTiDB}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>
                {testingTiDB
                  ? 'Appel GET...'
                  : tidbTargetId
                  ? `Tester (?id=${tidbTargetId})`
                  : 'Tester Endpoint GET'}
              </span>
            </button>

            <button
              onClick={handleSyncTiDBToDb}
              disabled={syncingTiDB}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingTiDB ? 'animate-spin' : ''}`} />
              <span>{syncingTiDB ? 'Synchronisation...' : 'Synchroniser vers BDD'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selector for Products / Categories / Users / Orders / Clients / Order Lines */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setTidbActiveTab('products');
              setTidbTargetId('');
              setTidbTestResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              tidbActiveTab === 'products'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produits (/products)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTidbActiveTab('categories');
              setTidbTargetId('');
              setTidbTestResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              tidbActiveTab === 'categories'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Catégories (/categories)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTidbActiveTab('users');
              setTidbTargetId('');
              setTidbTestResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              tidbActiveTab === 'users'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Utilisateurs (/users)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTidbActiveTab('orders');
              setTidbTargetId('');
              setTidbTestResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              tidbActiveTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Commandes (/orders)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTidbActiveTab('clients');
              setTidbTargetId('');
              setTidbTestResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              tidbActiveTab === 'clients'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Clients (/clients)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTidbActiveTab('order_lines');
              setTidbTargetId('');
              setTidbTestResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              tidbActiveTab === 'order_lines'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Lignes Commande (/order_lines)</span>
          </button>
        </div>

        {/* Filter by ID Input */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                Requête cURL ciblée avec ?id= ({
                  tidbActiveTab === 'categories'
                    ? 'Catégorie'
                    : tidbActiveTab === 'users'
                    ? 'Utilisateur'
                    : tidbActiveTab === 'orders'
                    ? 'Commande'
                    : tidbActiveTab === 'clients'
                    ? 'Client'
                    : tidbActiveTab === 'order_lines'
                    ? 'Ligne Commande'
                    : 'Produit'
                }) :
              </span>
            </label>
            {tidbTargetId && (
              <button
                type="button"
                onClick={() => setTidbTargetId('')}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Réinitialiser (Tous les éléments)
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Ex: 1... (laisser vide pour récupérer tous les ${
                tidbActiveTab === 'categories'
                  ? 'catégories'
                  : tidbActiveTab === 'users'
                  ? 'utilisateurs'
                  : tidbActiveTab === 'orders'
                  ? 'commandes'
                  : tidbActiveTab === 'clients'
                  ? 'clients'
                  : tidbActiveTab === 'order_lines'
                  ? 'lignes de commandes'
                  : 'produits'
              })`}
              value={tidbTargetId}
              onChange={(e) => setTidbTargetId(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleTestTiDB()}
              disabled={testingTiDB}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Exécuter</span>
            </button>
          </div>
        </div>

        {/* Curl Command & Endpoint Spec Box */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto space-y-2 relative group">
          <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>
              Format de requête cURL ({tidbActiveTab.toUpperCase()}) :
            </span>
            <span className="text-slate-400 font-normal">HTTP GET (Digest Auth)</span>
          </div>
          <pre className="text-slate-200 select-all whitespace-pre-wrap">
            curl --user ${'{PUBLIC_KEY}:${PRIVATE_KEY}'} --request GET \{'\n'}
            &nbsp;&nbsp;'{getActiveTiDBEndpointUrl()}{tidbTargetId ? `?id=${tidbTargetId}` : '?id=${id}'}'
          </pre>
        </div>

        {/* Test Result Display */}
        {tidbTestResult && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              tidbTestResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-2">
                {tidbTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                {tidbTestResult.success ? 'Succès TiDB Cloud (200 OK)' : 'Erreur TiDB Cloud'}
              </span>
              {tidbTestResult.latencyMs && (
                <span className="font-mono text-[11px] bg-white/80 px-2 py-0.5 rounded border">
                  {tidbTestResult.latencyMs} ms
                </span>
              )}
            </div>

            {tidbTestResult.message && <p>{tidbTestResult.message}</p>}
            {tidbTestResult.error && (
              <p className="font-mono text-[11px] bg-white p-2 rounded border border-rose-200">
                {tidbTestResult.error}
              </p>
            )}

            {tidbTestResult.rawResponse && (
              <details className="mt-2 text-[10px] font-mono">
                <summary className="cursor-pointer font-bold underline text-slate-700">
                  Afficher la réponse JSON brute de TiDB
                </summary>
                <pre className="mt-2 bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-40">
                  {JSON.stringify(tidbTestResult.rawResponse, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Main Section: Form to Add Data on Database */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-600" />
              Ajouter des Données en Base (INSERT INTO)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Remplissez le formulaire ci-dessous pour insérer directement un enregistrement dans la table sélectionnée.
            </p>
          </div>

          {/* Table Type Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedInsertType('product')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedInsertType === 'product'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Produit</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedInsertType('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedInsertType === 'category'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Catégorie</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedInsertType('user')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedInsertType === 'user'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Utilisateur</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedInsertType('order')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedInsertType === 'order'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Commande</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {insertSuccessMessage && (
          <div className="mx-6 mt-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{insertSuccessMessage}</span>
            </div>
            <button onClick={() => setInsertSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">
              ✕
            </button>
          </div>
        )}

        {insertErrorMessage && (
          <div className="mx-6 mt-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{insertErrorMessage}</span>
            </div>
            <button onClick={() => setInsertErrorMessage(null)} className="text-rose-700 hover:text-rose-900 text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleInsertSubmit} className="p-6 space-y-6">
          {/* PRODUCT INSERTION FORM */}
          {selectedInsertType === 'product' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du Produit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Imprimante HP LaserJet Pro Enterprise"
                  value={prodNom}
                  onChange={(e) => setProdNom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marque <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: HP, Canon, Dell, Cisco"
                  value={prodMarque}
                  onChange={(e) => setProdMarque(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Modèle
                </label>
                <input
                  type="text"
                  placeholder="ex: Flow M776z / E786DN"
                  value={prodModele}
                  onChange={(e) => setProdModele(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catégorie Cible
                </label>
                <select
                  value={prodCategorieId}
                  onChange={(e) => setProdCategorieId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prix (€ TTC) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="2490.00"
                  value={prodPrix}
                  onChange={(e) => setProdPrix(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stock Initial
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Garantie
                </label>
                <input
                  type="text"
                  placeholder="3 ans sur site J+1"
                  value={prodGarantie}
                  onChange={(e) => setProdGarantie(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Image Produit
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description Détaillée
                </label>
                <textarea
                  rows={2}
                  placeholder="Description technique complète..."
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caractéristiques Clés (séparées par une virgule)
                </label>
                <input
                  type="text"
                  placeholder="Vitesse 45 ppm, Bac 520 feuilles, Ethernet Gigabit, Sécurité SureStart"
                  value={prodCaracteristiques}
                  onChange={(e) => setProdCaracteristiques(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* CATEGORY INSERTION FORM */}
          {selectedInsertType === 'category' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de la Catégorie <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Imprimantes Multifonctions"
                  value={catNom}
                  onChange={(e) => setCatNom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statut
                </label>
                <select
                  value={catStatut}
                  onChange={(e: any) => setCatStatut(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description de la Catégorie
                </label>
                <textarea
                  rows={2}
                  placeholder="Description du type d'équipements et services associés..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* USER INSERTION FORM */}
          {selectedInsertType === 'user' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom Complet <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Jean Dupont"
                  value={userNom}
                  onChange={(e) => setUserNom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ex: jean.dupont@entreprise.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rôle Système
                </label>
                <select
                  value={userRole}
                  onChange={(e: any) => setUserRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Client">Client</option>
                  <option value="Vendeur">Vendeur</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statut
                </label>
                <select
                  value={userStatut}
                  onChange={(e: any) => setUserStatut(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            </div>
          )}

          {/* ORDER INSERTION FORM */}
          {selectedInsertType === 'order' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Référence Commande
                </label>
                <input
                  type="text"
                  required
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du Client
                </label>
                <input
                  type="text"
                  placeholder="ex: Cabinet Médical Pasteur"
                  value={orderClientNom}
                  onChange={(e) => setOrderClientNom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Montant Total (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={orderMontant}
                  onChange={(e) => setOrderMontant(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse de Livraison
                </label>
                <input
                  type="text"
                  value={orderAdresse}
                  onChange={(e) => setOrderAdresse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statut
                </label>
                <select
                  value={orderStatut}
                  onChange={(e: any) => setOrderStatut(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="En attente">En attente</option>
                  <option value="Payée">Payée</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Livrée">Livrée</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Insertion en cours...' : 'Insérer dans la Base de Données'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Query Console */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-900/50 text-purple-400 border border-purple-800">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Console de Requêtes SQL Directes
              </h3>
              <p className="text-[11px] text-slate-400">
                Exécutez vos requêtes SELECT, INSERT, UPDATE, DELETE directement sur la base de données.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSqlQuery('SELECT id, nom, marque, prix, stock FROM products;')}
              className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              SELECT Products
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery('SELECT id, nom, description FROM categories;')}
              className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              SELECT Categories
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery('SELECT id, nom, email, role FROM users;')}
              className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              SELECT Users
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full bg-slate-900 text-purple-300 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
            placeholder="Entrez votre instruction SQL..."
          />
          <button
            onClick={handleExecuteSql}
            disabled={isExecutingSql}
            className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-md shadow-purple-600/30 transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecutingSql ? 'Exécution...' : 'Exécuter'}</span>
          </button>
        </div>

        {/* SQL Results Viewer */}
        {sqlResult && (
          <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                {sqlResult.success ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Requête réussie
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Erreur SQL
                  </span>
                )}
                {sqlResult.executionTimeMs !== undefined && (
                  <span className="text-slate-400">({sqlResult.executionTimeMs} ms)</span>
                )}
                {sqlResult.affectedRows !== undefined && (
                  <span className="text-purple-400 font-medium">{sqlResult.affectedRows} ligne(s) affectée(s)</span>
                )}
              </div>
            </div>

            {sqlResult.error && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono rounded-lg">
                {sqlResult.error}
              </div>
            )}

            {sqlResult.rows && sqlResult.rows.length > 0 && (
              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {Object.keys(sqlResult.rows[0]).map((col) => (
                        <th key={col} className="p-2 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {sqlResult.rows.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        {Object.values(row).map((val: any, j: number) => (
                          <td key={j} className="p-2 whitespace-nowrap">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Database Tables Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-5 h-5 text-purple-600" />
              Explorateur des Tables de la Base de Données
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultez les colonnes et les lignes actuellement enregistrées en base.
            </p>
          </div>

          {/* Table Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {overview?.tables.map((t) => (
              <button
                key={t.tableName}
                onClick={() => setActiveTableTab(t.tableName as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTableTab === t.tableName
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.tableName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTableTab === t.tableName
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {t.rowCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Table Content */}
        {selectedTableInfo && (
          <div className="p-6 space-y-4">
            {/* Columns Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-500">Colonnes du Schéma:</span>
              {selectedTableInfo.columns.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-md border border-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Rows Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    {selectedTableInfo.columns.map((col) => (
                      <th key={col} className="px-4 py-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedTableInfo.sampleRows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition">
                      {selectedTableInfo.columns.map((col) => (
                        <td key={col} className="px-4 py-3 whitespace-nowrap max-w-xs truncate">
                          {col === 'prix' ? (
                            <span className="font-bold text-purple-700">{row[col]} €</span>
                          ) : col === 'stock' ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row[col] > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {row[col]} en stock
                            </span>
                          ) : col === 'role' ? (
                            <span className="font-semibold text-slate-900">{row[col]}</span>
                          ) : (
                            String(row[col] ?? '-')
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 text-right">
              Affichage des {selectedTableInfo.sampleRows.length} premiers enregistrements sur {selectedTableInfo.rowCount} au total.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
