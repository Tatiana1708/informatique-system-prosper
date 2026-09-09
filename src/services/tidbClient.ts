import crypto from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { Categorie, Client, Commande, LigneCommande, OrderStatus, PaymentStatus, Produit, User } from '../types.js';

const execFileAsync = promisify(execFile);

export interface TiDBConfig {
  endpointBaseUrl: string;
  endpointUrl: string; // Products endpoint
  categoriesEndpointUrl: string; // Categories endpoint
  usersEndpointUrl: string; // Users endpoint
  ordersEndpointUrl: string; // Orders endpoint
  clientsEndpointUrl: string; // Clients endpoint
  orderLinesEndpointUrl: string; // Order lines endpoint
  publicKey: string;
  privateKey: string;
  isConfigured: boolean;
}

export function getTiDBConfig(): TiDBConfig {
  const defaultBase =
    process.env.TIDB_ENDPOINT_BASE_URL ||
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint';

  const endpointUrl =
    process.env.TIDB_ENDPOINT_URL ||
    `${defaultBase}/products`;

  const categoriesEndpointUrl =
    process.env.TIDB_CATEGORIES_ENDPOINT_URL ||
    `${defaultBase}/categories`;

  const usersEndpointUrl =
    process.env.TIDB_USERS_ENDPOINT_URL ||
    `${defaultBase}/users`;

  const ordersEndpointUrl =
    process.env.TIDB_ORDERS_ENDPOINT_URL ||
    `${defaultBase}/orders`;

  const clientsEndpointUrl =
    process.env.TIDB_CLIENTS_ENDPOINT_URL ||
    `${defaultBase}/clients`;

  const orderLinesEndpointUrl =
    process.env.TIDB_ORDER_LINES_ENDPOINT_URL ||
    `${defaultBase}/order_lines`;

  const publicKey = process.env.TIDB_PUBLIC_KEY || process.env.PUBLIC_KEY || '';
  const privateKey = process.env.TIDB_PRIVATE_KEY || process.env.PRIVATE_KEY || '';

  return {
    endpointBaseUrl: defaultBase,
    endpointUrl,
    categoriesEndpointUrl,
    usersEndpointUrl,
    ordersEndpointUrl,
    clientsEndpointUrl,
    orderLinesEndpointUrl,
    publicKey,
    privateKey,
    isConfigured: Boolean(publicKey && privateKey),
  };
}

function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

function parseDigestHeader(header: string): Record<string, string> {
  const params: Record<string, string> = {};
  const cleaned = header.replace(/^Digest\s+/i, '');
  const regex = /([a-zA-Z0-9_-]+)=(?:"([^"]+)"|([^,\s]+))/g;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    params[match[1]] = match[2] !== undefined ? match[2] : match[3];
  }
  return params;
}

/**
 * Execute HTTP GET request using HTTP Digest Authentication (TiDB Cloud Data App format)
 * Implements: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET '<endpoint_url>'
 */
export async function executeTiDBGetRequest(
  customUrl?: string,
  customPublicKey?: string,
  customPrivateKey?: string
): Promise<{
  rawResponse: any;
  latencyMs: number;
  statusCode: number;
}> {
  const config = getTiDBConfig();
  const url = customUrl || config.endpointUrl;
  const publicKey = customPublicKey || config.publicKey;
  const privateKey = customPrivateKey || config.privateKey;

  const startTime = Date.now();

  // Try native fetch with Digest authentication first
  try {
    const res1 = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    // If already OK without auth (e.g. public endpoint)
    if (res1.status === 200) {
      const data = await res1.json();
      return {
        rawResponse: data,
        latencyMs: Date.now() - startTime,
        statusCode: 200,
      };
    }

    // If 401 Unauthorized, perform Digest challenge computation
    if (res1.status === 401) {
      const authHeader = res1.headers.get('www-authenticate') || '';

      if (!publicKey || !privateKey) {
        throw new Error(
          'Clés API TiDB Cloud manquantes (TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY requises pour authentifier le point de terminaison).'
        );
      }

      if (authHeader.toLowerCase().includes('digest')) {
        const authParams = parseDigestHeader(authHeader);
        const realm = authParams.realm || 'tidb.cloud';
        const nonce = authParams.nonce || '';
        const qop = authParams.qop;
        const opaque = authParams.opaque;
        const algorithm = (authParams.algorithm || 'MD5').toUpperCase();

        const parsedUrl = new URL(url);
        const uri = parsedUrl.pathname + parsedUrl.search;

        const ha1 = md5(`${publicKey}:${realm}:${privateKey}`);
        const ha2 = md5(`GET:${uri}`);
        const nc = '00000001';
        const cnonce = crypto.randomBytes(8).toString('hex');

        let responseHash: string;
        if (qop && (qop === 'auth' || qop.includes('auth'))) {
          responseHash = md5(`${ha1}:${nonce}:${nc}:${cnonce}:auth:${ha2}`);
        } else {
          responseHash = md5(`${ha1}:${nonce}:${ha2}`);
        }

        const digestParts = [
          `username="${publicKey}"`,
          `realm="${realm}"`,
          `nonce="${nonce}"`,
          `uri="${uri}"`,
          `algorithm=${algorithm}`,
          `response="${responseHash}"`,
        ];

        if (qop) {
          digestParts.push(`qop="auth"`, `nc=${nc}`, `cnonce="${cnonce}"`);
        }
        if (opaque) {
          digestParts.push(`opaque="${opaque}"`);
        }

        const digestHeader = `Digest ${digestParts.join(', ')}`;

        const res2 = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: digestHeader,
            Accept: 'application/json',
          },
        });

        const latencyMs = Date.now() - startTime;
        const json = await res2.json().catch(async () => {
          const text = await res2.text();
          throw new Error(`Réponse non-JSON (${res2.status}): ${text}`);
        });

        if (res2.status !== 200) {
          const errMsg =
            json?.data?.result?.message ||
            json?.message ||
            json?.error ||
            `HTTP ${res2.status}`;
          throw new Error(`Erreur TiDB Cloud (${res2.status}): ${errMsg}`);
        }

        return {
          rawResponse: json,
          latencyMs,
          statusCode: res2.status,
        };
      }
    }

    const latencyMs = Date.now() - startTime;
    const body = await res1.json().catch(() => null);
    return {
      rawResponse: body,
      latencyMs,
      statusCode: res1.status,
    };
  } catch (fetchErr: any) {
    // Fallback: try curl with --digest if available on system
    if (publicKey && privateKey) {
      try {
        const { stdout } = await execFileAsync('curl', [
          '--silent',
          '--show-error',
          '--digest',
          '--user',
          `${publicKey}:${privateKey}`,
          '--request',
          'GET',
          url,
        ]);
        const latencyMs = Date.now() - startTime;
        const json = JSON.parse(stdout);
        return {
          rawResponse: json,
          latencyMs,
          statusCode: 200,
        };
      } catch (curlErr: any) {
        throw new Error(fetchErr.message || curlErr.message);
      }
    }
    throw fetchErr;
  }
}

/**
 * Normalizes any TiDB Cloud row object into our standard Produit interface
 */
export function normalizeTiDBRowToProduct(row: any, index: number): Produit {
  const id = String(row.id || row.ID || row.product_id || `tidb-p${index + 1}`);
  const nom = String(row.nom || row.name || row.title || row.label || 'Produit TiDB Cloud');
  const marque = String(row.marque || row.brand || row.manufacturer || 'HP');
  const modele = String(row.modele || row.model || 'Standard');
  const categorieId = String(row.categorie_id || row.category_id || row.categorieId || 'cat-9');
  const categorieNom = String(
    row.categorie_nom ||
      row.category_name ||
      row.categorieNom ||
      'Imprimantes Multifonctions (ou Tout-en-un)'
  );
  const prix = Number(row.prix ?? row.price ?? 199.99);
  const image = String(
    row.image ||
      row.image_url ||
      row.photo ||
      (nom.toLowerCase().includes('hp') || nom.toLowerCase().includes('imprimante')
        ? '/hp_a3_e786dn.jpg'
        : 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80')
  );
  const garantie = String(row.garantie || row.warranty || '2 ans');
  const stock = Number(row.stock ?? row.quantity ?? 10);
  let disponibilite: 'En stock' | 'Sur commande' | 'Rupture de stock' =
    stock > 0 ? 'En stock' : 'Rupture de stock';
  if (
    row.disponibilite === 'Sur commande' ||
    row.disponibilite === 'Rupture de stock' ||
    row.disponibilite === 'En stock'
  ) {
    disponibilite = row.disponibilite;
  }
  const description = String(row.description || row.desc || 'Produit synchronisé depuis TiDB Cloud Data App.');

  let caracteristiques: string[] = [];
  if (Array.isArray(row.caracteristiques)) {
    caracteristiques = row.caracteristiques;
  } else if (typeof row.caracteristiques === 'string') {
    try {
      const parsed = JSON.parse(row.caracteristiques);
      if (Array.isArray(parsed)) caracteristiques = parsed;
      else caracteristiques = [row.caracteristiques];
    } catch {
      caracteristiques = row.caracteristiques.split(',').map((s: string) => s.trim());
    }
  } else {
    caracteristiques = ['Synchronisé via TiDB Cloud', 'Haute performance', 'Garantie officielle'];
  }

  return {
    id,
    nom,
    marque,
    modele,
    categorieId,
    categorieNom,
    prix,
    image,
    garantie,
    stock,
    disponibilite,
    description,
    caracteristiques,
  };
}

/**
 * Helper to extract array of rows from diverse TiDB Cloud Data App response shapes
 */
export function extractRowsFromTiDBResponse(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data.rows)) return raw.data.rows;
  if (Array.isArray(raw.rows)) return raw.rows;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (
    raw.data &&
    typeof raw.data === 'object' &&
    (raw.data.id || raw.data.ID || raw.data.product_id || raw.data.category_id || raw.data.user_id)
  ) {
    return [raw.data];
  }
  if (
    typeof raw === 'object' &&
    (raw.id || raw.ID || raw.product_id || raw.category_id || raw.user_id || raw.nom || raw.name || raw.email)
  ) {
    return [raw];
  }
  return [];
}

/**
 * Fetch products from TiDB Cloud Data App endpoint and convert to Produit[]
 * If id is provided, queries: <endpoint>?id=${id}
 * e.g. curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products?id=${id}'
 */
export async function fetchTiDBProducts(id?: string): Promise<{
  products: Produit[];
  totalRows: number;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const config = getTiDBConfig();
  let url = config.endpointUrl;

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    const parsed = new URL(url);
    parsed.searchParams.set('id', String(id).trim());
    url = parsed.toString();
  }

  const result = await executeTiDBGetRequest(url);
  const raw = result.rawResponse;
  const rows = extractRowsFromTiDBResponse(raw);
  const products = rows.map((row, idx) => normalizeTiDBRowToProduct(row, idx));

  return {
    products,
    totalRows: rows.length,
    latencyMs: result.latencyMs,
    rawResponse: raw,
    targetUrl: url,
  };
}

/**
 * Fetch single product by ID directly using:
 * curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products?id=${id}'
 */
export async function fetchTiDBProductById(id: string): Promise<{
  product: Produit | null;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const result = await fetchTiDBProducts(id);
  const product = result.products.length > 0 ? result.products[0] : null;
  return {
    product,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl,
  };
}

/**
 * Normalizes any TiDB Cloud row object into our standard Categorie interface
 */
export function normalizeTiDBRowToCategory(row: any, index: number): Categorie {
  const id = String(row.id || row.ID || row.category_id || row.categorie_id || `cat-${index + 1}`);
  const nom = String(row.nom || row.name || row.title || row.label || 'Catégorie TiDB');
  const description = String(row.description || row.desc || 'Catégorie synchronisée depuis TiDB Cloud.');
  const statut: 'Actif' | 'Inactif' =
    String(row.statut || row.status || 'Actif').toLowerCase() === 'inactif' ? 'Inactif' : 'Actif';
  const dateCreation = String(
    row.date_creation || row.created_at || row.dateCreation || new Date().toISOString().split('T')[0]
  );
  const nombreProduits = Number(row.nombre_produits || row.product_count || row.nombreProduits || 0);

  return {
    id,
    nom,
    description,
    statut,
    dateCreation,
    nombreProduits,
  };
}

/**
 * Fetch categories from TiDB Cloud Data App endpoint and convert to Categorie[]
 * If id is provided, queries: <endpoint>?id=${id}
 * e.g. curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories?id=${id}'
 */
export async function fetchTiDBCategories(id?: string): Promise<{
  categories: Categorie[];
  totalRows: number;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const config = getTiDBConfig();
  let url = config.categoriesEndpointUrl;

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    const parsed = new URL(url);
    parsed.searchParams.set('id', String(id).trim());
    url = parsed.toString();
  }

  const result = await executeTiDBGetRequest(url);
  const raw = result.rawResponse;
  const rows = extractRowsFromTiDBResponse(raw);
  const categories = rows.map((row, idx) => normalizeTiDBRowToCategory(row, idx));

  return {
    categories,
    totalRows: rows.length,
    latencyMs: result.latencyMs,
    rawResponse: raw,
    targetUrl: url,
  };
}

/**
 * Fetch single category by ID directly using:
 * curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories?id=${id}'
 */
export async function fetchTiDBCategoryById(id: string): Promise<{
  category: Categorie | null;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const result = await fetchTiDBCategories(id);
  const category = result.categories.length > 0 ? result.categories[0] : null;
  return {
    category,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl,
  };
}

/**
 * Normalizes any TiDB Cloud row object into our standard User interface
 */
export function normalizeTiDBRowToUser(row: any, index: number): User {
  const id = String(row.id || row.ID || row.user_id || `u-${index + 1}`);
  const nom = String(row.nom || row.name || row.fullname || row.username || 'Utilisateur TiDB');
  const email = String(row.email || row.mail || `user${index + 1}@example.com`).trim().toLowerCase();

  let role: 'Admin' | 'Vendeur' | 'Client' = 'Client';
  const roleRaw = String(row.role || '').toLowerCase();
  if (roleRaw.includes('admin')) {
    role = 'Admin';
  } else if (roleRaw.includes('vendeur') || roleRaw.includes('seller') || roleRaw.includes('sales')) {
    role = 'Vendeur';
  }

  let statut: 'Actif' | 'Suspendu' | 'Inactif' = 'Actif';
  const statutRaw = String(row.statut || row.status || 'Actif').toLowerCase();
  if (statutRaw.includes('suspend')) {
    statut = 'Suspendu';
  } else if (statutRaw.includes('inactif') || statutRaw.includes('inactive')) {
    statut = 'Inactif';
  }

  const dateInscription = String(
    row.date_inscription || row.created_at || row.dateInscription || new Date().toISOString().split('T')[0]
  );
  const isEmailVerified = Boolean(
    row.is_email_verified ?? row.isEmailVerified ?? (statut === 'Actif')
  );

  return {
    id,
    nom,
    email,
    role,
    statut,
    dateInscription,
    isEmailVerified,
  };
}

/**
 * Fetch users from TiDB Cloud Data App endpoint and convert to User[]
 * If id is provided, queries: <endpoint>?id=${id}
 * e.g. curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users?id=${id}'
 */
export async function fetchTiDBUsers(id?: string): Promise<{
  users: User[];
  totalRows: number;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const config = getTiDBConfig();
  let url = config.usersEndpointUrl;

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    const parsed = new URL(url);
    parsed.searchParams.set('id', String(id).trim());
    url = parsed.toString();
  }

  const result = await executeTiDBGetRequest(url);
  const raw = result.rawResponse;
  const rows = extractRowsFromTiDBResponse(raw);
  const users = rows.map((row, idx) => normalizeTiDBRowToUser(row, idx));

  return {
    users,
    totalRows: rows.length,
    latencyMs: result.latencyMs,
    rawResponse: raw,
    targetUrl: url,
  };
}

/**
 * Fetch single user by ID directly using:
 * curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users?id=${id}'
 */
export async function fetchTiDBUserById(id: string): Promise<{
  user: User | null;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const result = await fetchTiDBUsers(id);
  const user = result.users.length > 0 ? result.users[0] : null;
  return {
    user,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl,
  };
}

/**
 * Normalizes any TiDB Cloud row object into our standard Client interface
 */
export function normalizeTiDBRowToClient(row: any, index: number): Client {
  const id = String(row.id || row.ID || row.client_id || row.clientId || `c-${index + 1}`);
  const userId = String(row.user_id || row.userId || row.id || `u-${index + 1}`);
  const nombreCommandes = Number(
    row.nombre_commandes ?? row.nombreCommandes ?? row.order_count ?? row.orders_count ?? 0
  );
  const totalDepense = parseFloat(
    Number(row.total_depense ?? row.totalDepense ?? row.total_spent ?? row.amount_spent ?? 0).toFixed(2)
  );
  const statut = String(row.statut || row.status || 'Actif');

  const nom = String(row.nom || row.name || row.customer_name || 'Client TiDB');
  const email = String(row.email || row.mail || `client${index + 1}@example.com`).trim().toLowerCase();

  const user: User = {
    id: userId,
    nom,
    email,
    role: 'Client',
    statut: statut === 'Suspendu' ? 'Suspendu' : statut === 'Inactif' ? 'Inactif' : 'Actif',
    dateInscription: String(row.date_inscription || row.created_at || new Date().toISOString().split('T')[0]),
    isEmailVerified: true,
  };

  return {
    id,
    userId,
    nombreCommandes,
    totalDepense,
    statut,
    user,
  };
}

/**
 * Fetch clients from TiDB Cloud Data App endpoint and convert to Client[]
 * If id is provided, queries: <endpoint>?id=${id}
 * e.g. curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients?id=${id}'
 */
export async function fetchTiDBClients(id?: string): Promise<{
  clients: Client[];
  totalRows: number;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const config = getTiDBConfig();
  let url = config.clientsEndpointUrl;

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    const parsed = new URL(url);
    parsed.searchParams.set('id', String(id).trim());
    url = parsed.toString();
  }

  const result = await executeTiDBGetRequest(url);
  const raw = result.rawResponse;
  const rows = extractRowsFromTiDBResponse(raw);
  const clients = rows.map((row, idx) => normalizeTiDBRowToClient(row, idx));

  return {
    clients,
    totalRows: rows.length,
    latencyMs: result.latencyMs,
    rawResponse: raw,
    targetUrl: url,
  };
}

/**
 * Fetch single client by ID directly using:
 * curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients?id=${id}'
 */
export async function fetchTiDBClientById(id: string): Promise<{
  client: Client | null;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const result = await fetchTiDBClients(id);
  const client = result.clients.length > 0 ? result.clients[0] : null;
  return {
    client,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl,
  };
}

/**
 * Normalizes any TiDB Cloud row object into our standard LigneCommande interface
 */
export function normalizeTiDBRowToOrderLine(row: any, index: number): LigneCommande {
  const id = String(row.id || row.ID || row.order_line_id || row.line_id || `lc-${index + 1}`);
  const commandeId = String(row.commande_id || row.commandeId || row.order_id || row.orderId || 'cmd-1');
  const produitId = String(row.produit_id || row.produitId || row.product_id || row.productId || 'p-1');
  const quantite = Number(row.quantite || row.quantity || row.qty || 1);
  const prixUnitaire = parseFloat(
    Number(row.prix_unitaire ?? row.prixUnitaire ?? row.unit_price ?? row.price ?? 0).toFixed(2)
  );
  const prixTotal = parseFloat(
    Number(row.prix_total ?? row.prixTotal ?? row.total_price ?? (prixUnitaire * quantite)).toFixed(2)
  );

  const nom = String(row.produit_nom || row.produitNom || row.product_name || row.nom || 'Article informatique');

  const produit: Produit = {
    id: produitId,
    nom,
    marque: String(row.marque || 'Générique'),
    modele: String(row.modele || 'Standard'),
    categorieId: String(row.categorie_id || row.categorieId || 'cat-1'),
    prix: prixUnitaire,
    image: String(row.image || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600'),
    garantie: String(row.garantie || '2 ans'),
    stock: 10,
    disponibilite: 'En stock',
    description: String(row.description || 'Produit TiDB Cloud'),
  };

  return {
    id,
    commandeId,
    produitId,
    quantite,
    prixUnitaire,
    prixTotal,
    produit,
  };
}

/**
 * Fetch order lines from TiDB Cloud Data App endpoint and convert to LigneCommande[]
 * If id is provided, queries: <endpoint>?id=${id}
 * e.g. curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines?id=${id}'
 */
export async function fetchTiDBOrderLines(id?: string): Promise<{
  orderLines: LigneCommande[];
  totalRows: number;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const config = getTiDBConfig();
  let url = config.orderLinesEndpointUrl;

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    const parsed = new URL(url);
    parsed.searchParams.set('id', String(id).trim());
    url = parsed.toString();
  }

  const result = await executeTiDBGetRequest(url);
  const raw = result.rawResponse;
  const rows = extractRowsFromTiDBResponse(raw);
  const orderLines = rows.map((row, idx) => normalizeTiDBRowToOrderLine(row, idx));

  return {
    orderLines,
    totalRows: rows.length,
    latencyMs: result.latencyMs,
    rawResponse: raw,
    targetUrl: url,
  };
}

/**
 * Fetch single order line by ID directly using:
 * curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines?id=${id}'
 */
export async function fetchTiDBOrderLineById(id: string): Promise<{
  orderLine: LigneCommande | null;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const result = await fetchTiDBOrderLines(id);
  const orderLine = result.orderLines.length > 0 ? result.orderLines[0] : null;
  return {
    orderLine,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl,
  };
}

/**
 * Normalizes any TiDB Cloud row object into our standard Commande interface
 */
export function normalizeTiDBRowToOrder(row: any, index: number): Commande {
  const id = String(row.id || row.ID || row.order_id || `cmd-${index + 1}`);
  const reference = String(
    row.reference || row.ref || row.order_number || `CMD-2026-${String(index + 1).padStart(4, '0')}`
  );
  const clientId = String(row.client_id || row.clientId || row.user_id || 'c-1');
  const clientNom = String(
    row.client_nom || row.clientNom || row.customer_name || row.client_name || row.nom || 'Client Entreprise'
  );
  const clientEmail = String(
    row.client_email || row.clientEmail || row.customer_email || row.email || 'client@example.com'
  );
  const date = String(row.date || row.date_commande || row.created_at || new Date().toISOString().split('T')[0]);
  const montantTotal = parseFloat(
    Number(row.montant_total ?? row.montantTotal ?? row.total_amount ?? row.total ?? 0).toFixed(2)
  );

  let statut: OrderStatus = 'En attente';
  const statutRaw = String(row.statut || row.status || 'En attente').toLowerCase();
  if (statutRaw.includes('cours') || statutRaw.includes('processing')) {
    statut = 'En cours';
  } else if (statutRaw.includes('expédi') || statutRaw.includes('shipped')) {
    statut = 'Expédiée';
  } else if (statutRaw.includes('livr') || statutRaw.includes('delivered')) {
    statut = 'Livrée';
  } else if (statutRaw.includes('annul') || statutRaw.includes('cancelled')) {
    statut = 'Annulée';
  }

  let statutPaiement: PaymentStatus = 'Payé';
  const paiementRaw = String(row.statut_paiement || row.statutPaiement || row.payment_status || 'Payé').toLowerCase();
  if (paiementRaw.includes('attente') || paiementRaw.includes('pending')) {
    statutPaiement = 'En attente';
  } else if (paiementRaw.includes('rembours') || paiementRaw.includes('refunded')) {
    statutPaiement = 'Remboursé';
  } else if (paiementRaw.includes('échou') || paiementRaw.includes('failed')) {
    statutPaiement = 'Échoué';
  }

  const adresseLivraison = String(
    row.adresse_livraison || row.adresseLivraison || row.shipping_address || row.address || 'Abidjan, Côte d\'Ivoire'
  );

  let lignes: LigneCommande[] = [];
  if (Array.isArray(row.lignes) && row.lignes.length > 0) {
    lignes = row.lignes.map((l: any, lIdx: number) => normalizeTiDBRowToOrderLine(l, lIdx));
  } else if (Array.isArray(row.lines) && row.lines.length > 0) {
    lignes = row.lines.map((l: any, lIdx: number) => normalizeTiDBRowToOrderLine(l, lIdx));
  } else {
    // Default fallback single item line
    lignes = [
      {
        id: `lc-${id}-1`,
        commandeId: id,
        produitId: 'p-1',
        quantite: 1,
        prixUnitaire: montantTotal,
        prixTotal: montantTotal,
      },
    ];
  }

  return {
    id,
    reference,
    clientId,
    clientNom,
    clientEmail,
    date,
    montantTotal,
    statut,
    statutPaiement,
    lignes,
    adresseLivraison,
  };
}

/**
 * Fetch orders from TiDB Cloud Data App endpoint and convert to Commande[]
 * If id is provided, queries: <endpoint>?id=${id}
 * e.g. curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders?id=${id}'
 */
export async function fetchTiDBOrders(id?: string): Promise<{
  orders: Commande[];
  totalRows: number;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const config = getTiDBConfig();
  let url = config.ordersEndpointUrl;

  if (id !== undefined && id !== null && String(id).trim() !== '') {
    const parsed = new URL(url);
    parsed.searchParams.set('id', String(id).trim());
    url = parsed.toString();
  }

  const result = await executeTiDBGetRequest(url);
  const raw = result.rawResponse;
  const rows = extractRowsFromTiDBResponse(raw);
  const orders = rows.map((row, idx) => normalizeTiDBRowToOrder(row, idx));

  return {
    orders,
    totalRows: rows.length,
    latencyMs: result.latencyMs,
    rawResponse: raw,
    targetUrl: url,
  };
}

/**
 * Fetch single order by ID directly using:
 * curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders?id=${id}'
 */
export async function fetchTiDBOrderById(id: string): Promise<{
  order: Commande | null;
  latencyMs: number;
  rawResponse: any;
  targetUrl: string;
}> {
  const result = await fetchTiDBOrders(id);
  const order = result.orders.length > 0 ? result.orders[0] : null;
  return {
    order,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl,
  };
}
