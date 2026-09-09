import { Categorie, Client, Commande, DashboardStats, LigneCommande, OrderStatus, PaymentStatus, Produit, User, DbOverview, SqlQueryResult } from '../types';

export const api = {
  // Database Status
  async getDbStatus(): Promise<{ connected: boolean; mode: 'mysql' | 'in-memory'; config: any; error?: string }> {
    try {
      const res = await fetch('/api/db/status');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e: any) {
      return {
        connected: false,
        mode: 'in-memory',
        config: { host: 'localhost', port: 3306, user: 'root', database: 'informatique_system_prosper' },
        error: 'Impossible d\'interroger le statut de la base de données',
      };
    }
  },

  // Authentication
  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string; demoCode?: string }> {
    const res = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Erreur lors de l\'envoi du code de vérification' }));
      throw new Error(errData.error || 'Erreur lors de l\'envoi du code');
    }
    return await res.json();
  },

  async verifyEmailCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Code invalide ou expiré' }));
      throw new Error(errData.error || 'Code invalide');
    }
    return await res.json();
  },

  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Erreur lors de la connexion' }));
      throw new Error(errData.error || 'Identifiants invalides');
    }
    return await res.json();
  },

  async register(userData: { nom: string; email: string; password?: string; role?: string; isEmailVerified?: boolean }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Erreur lors de l\'inscription' }));
      throw new Error(errData.error || 'Erreur lors de la création de compte');
    }
    return await res.json();
  },

  // Stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return {
        totalUtilisateurs: 4,
        totalProduits: 6,
        totalCommandes: 3,
        chiffreAffairesTotal: 3179.92,
        totalCategories: 5,
        totalClients: 1,
      };
    }
  },

  // Users
  async getUsers(search?: string, role?: string): Promise<User[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  },

  async deleteUser(id: string): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
  },

  // Clients
  async getClients(): Promise<Client[]> {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Products
  async getProducts(filters?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    source?: 'local' | 'tidb';
  }): Promise<Produit[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.source) params.append('source', filters.source);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getProductById(id: string): Promise<Produit | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return null;
    }
  },

  async createProduct(product: Partial<Produit>): Promise<Produit> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Erreur lors de la création du produit' }));
      throw new Error(errData.error || `Erreur serveur HTTP ${res.status}`);
    }
    return await res.json();
  },

  async updateProduct(id: string, product: Partial<Produit>): Promise<Produit> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Erreur lors de la mise à jour du produit' }));
      throw new Error(errData.error || `Erreur serveur HTTP ${res.status}`);
    }
    return await res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Erreur lors de la suppression du produit' }));
      throw new Error(errData.error || `Erreur serveur HTTP ${res.status}`);
    }
  },

  // Categories
  async getCategories(): Promise<Categorie[]> {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createCategory(category: Partial<Categorie>): Promise<Categorie> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return await res.json();
  },

  async updateCategory(id: string, category: Partial<Categorie>): Promise<Categorie> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return await res.json();
  },

  async deleteCategory(id: string): Promise<void> {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  },

  // Orders
  async getOrders(status?: string): Promise<Commande[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createOrder(orderData: { items: any[]; adresseLivraison?: string; clientNom?: string; clientEmail?: string }): Promise<Commande> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  },

  async updateOrderStatus(id: string, statut: OrderStatus, statutPaiement?: PaymentStatus): Promise<Commande> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut, statutPaiement }),
    });
    return await res.json();
  },

  // Database Management & Direct Operations
  async getDbOverview(): Promise<DbOverview> {
    const res = await fetch('/api/db/overview');
    if (!res.ok) throw new Error('Erreur lors de la récupération de la structure de base de données');
    return await res.json();
  },

  async insertDbData(table: 'products' | 'categories' | 'users' | 'orders', data: any): Promise<{ success: boolean; table: string; record: any; message: string; sqlExecuted?: string }> {
    const res = await fetch('/api/db/insert-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'insertion en base de données' }));
      throw new Error(err.error || 'Erreur lors de l\'insertion');
    }
    return await res.json();
  },

  async executeSql(sql: string): Promise<SqlQueryResult> {
    const res = await fetch('/api/db/execute-sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    });
    return await res.json();
  },

  async seedDbBatch(batchType: 'printers' | 'servers' | 'users' | 'all'): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch('/api/db/seed-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchType }),
    });
    if (!res.ok) throw new Error('Erreur lors de l\'injection de données');
    return await res.json();
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/db/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Erreur lors de la réinitialisation de la base');
    return await res.json();
  },

  // TiDB Cloud Data App API
  async getTiDBStatus(): Promise<{
    endpointUrl: string;
    categoriesEndpointUrl?: string;
    usersEndpointUrl?: string;
    isConfigured: boolean;
    publicKeyMasked: string;
    curlSample: string;
    curlSampleById: string;
    curlProducts?: string;
    curlProductsById?: string;
    curlCategories?: string;
    curlCategoriesById?: string;
    curlUsers?: string;
    curlUsersById?: string;
  }> {
    const res = await fetch('/api/tidb/status');
    if (!res.ok) throw new Error('Erreur statut TiDB Cloud');
    return await res.json();
  },

  async getTiDBProducts(id?: string): Promise<{
    products: Produit[];
    totalRows: number;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const url = id ? `/api/tidb/products?id=${encodeURIComponent(id)}` : '/api/tidb/products';
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'appel à TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getTiDBProductById(id: string): Promise<{
    product: Produit | null;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const res = await fetch(`/api/tidb/products/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de la récupération du produit sur TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async syncTiDBProducts(): Promise<{
    success: boolean;
    count: number;
    latencyMs: number;
    message: string;
    products: Produit[];
  }> {
    const res = await fetch('/api/tidb/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur synchronisation TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur synchronisation (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // TiDB Categories
  async getTiDBCategories(id?: string): Promise<{
    categories: Categorie[];
    totalRows: number;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const url = id ? `/api/tidb/categories?id=${encodeURIComponent(id)}` : '/api/tidb/categories';
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'appel à TiDB Cloud (catégories)' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getTiDBCategoryById(id: string): Promise<{
    category: Categorie | null;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const res = await fetch(`/api/tidb/categories/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de la récupération de la catégorie sur TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async syncTiDBCategories(): Promise<{
    success: boolean;
    count: number;
    latencyMs: number;
    message: string;
    categories: Categorie[];
  }> {
    const res = await fetch('/api/tidb/sync-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur synchronisation catégories TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur synchronisation (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // TiDB Users
  async getTiDBUsers(id?: string): Promise<{
    users: User[];
    totalRows: number;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const url = id ? `/api/tidb/users?id=${encodeURIComponent(id)}` : '/api/tidb/users';
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'appel à TiDB Cloud (utilisateurs)' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getTiDBUserById(id: string): Promise<{
    user: User | null;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const res = await fetch(`/api/tidb/users/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de la récupération de l\'utilisateur sur TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async syncTiDBUsers(): Promise<{
    success: boolean;
    count: number;
    latencyMs: number;
    message: string;
    users: User[];
  }> {
    const res = await fetch('/api/tidb/sync-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur synchronisation utilisateurs TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur synchronisation (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // TiDB Orders
  async getTiDBOrders(id?: string): Promise<{
    orders: Commande[];
    totalRows: number;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const url = id ? `/api/tidb/orders?id=${encodeURIComponent(id)}` : '/api/tidb/orders';
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'appel à TiDB Cloud (commandes)' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getTiDBOrderById(id: string): Promise<{
    order: Commande | null;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const res = await fetch(`/api/tidb/orders/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de la récupération de la commande sur TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async syncTiDBOrders(): Promise<{
    success: boolean;
    count: number;
    latencyMs: number;
    message: string;
    orders: Commande[];
  }> {
    const res = await fetch('/api/tidb/sync-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur synchronisation commandes TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur synchronisation (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // TiDB Clients
  async getTiDBClients(id?: string): Promise<{
    clients: Client[];
    totalRows: number;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const url = id ? `/api/tidb/clients?id=${encodeURIComponent(id)}` : '/api/tidb/clients';
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'appel à TiDB Cloud (clients)' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getTiDBClientById(id: string): Promise<{
    client: Client | null;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const res = await fetch(`/api/tidb/clients/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de la récupération du client sur TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async syncTiDBClients(): Promise<{
    success: boolean;
    count: number;
    latencyMs: number;
    message: string;
    clients: Client[];
  }> {
    const res = await fetch('/api/tidb/sync-clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur synchronisation clients TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur synchronisation (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // TiDB Order Lines
  async getTiDBOrderLines(id?: string): Promise<{
    orderLines: LigneCommande[];
    totalRows: number;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const url = id ? `/api/tidb/order-lines?id=${encodeURIComponent(id)}` : '/api/tidb/order-lines';
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de l\'appel à TiDB Cloud (lignes de commande)' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getTiDBOrderLineById(id: string): Promise<{
    orderLine: LigneCommande | null;
    latencyMs: number;
    rawResponse: any;
    targetUrl?: string;
  }> {
    const res = await fetch(`/api/tidb/order-lines/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur lors de la récupération de la ligne de commande sur TiDB Cloud' }));
      throw new Error(err.message || err.error || `Erreur TiDB Cloud (HTTP ${res.status})`);
    }
    return await res.json();
  },
};
