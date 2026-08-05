import { Categorie, Client, Commande, DashboardStats, OrderStatus, PaymentStatus, Produit, User } from '../types';

export const api = {
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
  async getProducts(filters?: { search?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Produit[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      
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
    return await res.json();
  },

  async updateProduct(id: string, product: Partial<Produit>): Promise<Produit> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return await res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
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
};
