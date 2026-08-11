import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_STATS,
  MOCK_CATEGORIES,
  MOCK_CLIENTS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_USERS,
} from './src/data/mockData.js';
import { Categorie, Client, Commande, Produit, User } from './src/types.js';
import {
  getDbStatus,
  getMySQLPool,
  initMySQLConnection,
  isMySQLConnected,
} from './src/db/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let usersStore: User[] = [...MOCK_USERS];
let clientsStore: Client[] = [...MOCK_CLIENTS];
let categoriesStore: Categorie[] = [...MOCK_CATEGORIES];
let productsStore: Produit[] = [...MOCK_PRODUCTS];
let ordersStore: Commande[] = [...MOCK_ORDERS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize MySQL Connection (gracefully fallbacks to in-memory if unconfigured or error)
  const dbStatus = await initMySQLConnection();
  console.log(`[DB Status] Mode: ${dbStatus.mode.toUpperCase()}${dbStatus.error ? ' (' + dbStatus.error + ')' : ''}`);

  // Database Status API
  app.get('/api/db/status', (req, res) => {
    res.json(getDbStatus());
  });

  // API Routes

  // Dashboard Stats
  app.get('/api/dashboard/stats', (req, res) => {
    const totalRev = ordersStore.reduce((acc, order) => acc + order.montantTotal, 0);
    res.json({
      totalUtilisateurs: usersStore.length,
      totalProduits: productsStore.length,
      totalCommandes: ordersStore.length,
      chiffreAffairesTotal: parseFloat(totalRev.toFixed(2)),
      totalCategories: categoriesStore.length,
      totalClients: clientsStore.length,
    });
  });

  // Users CRUD
  app.get('/api/users', (req, res) => {
    const { search, role } = req.query;
    let filtered = [...usersStore];
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.nom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (role && typeof role === 'string' && role !== 'Tous') {
      filtered = filtered.filter((u) => u.role === role);
    }
    res.json(filtered);
  });

  app.post('/api/users', (req, res) => {
    const { nom, email, role, statut } = req.body;
    const newUser: User = {
      id: 'u' + (usersStore.length + 1),
      nom: nom || 'Nouvel Utilisateur',
      email: email || `user${Date.now()}@example.com`,
      role: role || 'Client',
      statut: statut || 'Actif',
      dateInscription: new Date().toISOString().split('T')[0],
    };
    usersStore.push(newUser);

    if (newUser.role === 'Client') {
      clientsStore.push({
        id: 'c' + (clientsStore.length + 1),
        userId: newUser.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: 'Nouveau',
        user: newUser,
      });
    }

    res.status(201).json(newUser);
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const idx = usersStore.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    usersStore[idx] = { ...usersStore[idx], ...req.body };
    res.json(usersStore[idx]);
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    usersStore = usersStore.filter((u) => u.id !== id);
    clientsStore = clientsStore.filter((c) => c.userId !== id);
    res.json({ success: true, id });
  });

  // Clients
  app.get('/api/clients', (req, res) => {
    const enriched = clientsStore.map((c) => {
      const user = usersStore.find((u) => u.id === c.userId);
      return { ...c, user };
    });
    res.json(enriched);
  });

  // Products CRUD
  app.get('/api/products', (req, res) => {
    const { search, category, minPrice, maxPrice } = req.query;
    let filtered = [...productsStore];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.marque.toLowerCase().includes(q) ||
          p.modele.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'Toutes') {
      filtered = filtered.filter((p) => p.categorieId === category || p.categorieNom === category);
    }

    if (minPrice && typeof minPrice === 'string' && !isNaN(Number(minPrice))) {
      filtered = filtered.filter((p) => p.prix >= Number(minPrice));
    }

    if (maxPrice && typeof maxPrice === 'string' && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter((p) => p.prix <= Number(maxPrice));
    }

    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = productsStore.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const cat = categoriesStore.find((c) => c.id === req.body.categorieId);
    const newProduct: Produit = {
      id: 'p' + (productsStore.length + 1),
      nom: req.body.nom || 'Nouveau Produit',
      marque: req.body.marque || 'Générique',
      modele: req.body.modele || 'PRO',
      categorieId: req.body.categorieId || 'cat-1',
      categorieNom: cat ? cat.nom : 'Composants',
      prix: Number(req.body.prix) || 99.99,
      image: req.body.image || 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      garantie: req.body.garantie || '2 ans',
      stock: Number(req.body.stock) || 10,
      disponibilite: Number(req.body.stock) > 0 ? 'En stock' : 'Rupture de stock',
      description: req.body.description || 'Description du produit informatique.',
      caracteristiques: req.body.caracteristiques || ['Haute performance', 'Garantie officielle'],
    };
    productsStore.push(newProduct);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const idx = productsStore.findIndex((p) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    const updated = { ...productsStore[idx], ...req.body };
    if (updated.stock !== undefined) {
      updated.disponibilite = updated.stock > 0 ? 'En stock' : 'Rupture de stock';
    }
    productsStore[idx] = updated;
    res.json(productsStore[idx]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    productsStore = productsStore.filter((p) => p.id !== id);
    res.json({ success: true, id });
  });

  // Categories CRUD
  app.get('/api/categories', (req, res) => {
    const enriched = categoriesStore.map((cat) => {
      const count = productsStore.filter((p) => p.categorieId === cat.id).length;
      return { ...cat, nombreProduits: count };
    });
    res.json(enriched);
  });

  app.post('/api/categories', (req, res) => {
    const newCat: Categorie = {
      id: 'cat-' + (categoriesStore.length + 1),
      nom: req.body.nom || 'Nouvelle Catégorie',
      description: req.body.description || 'Description de la catégorie.',
      statut: 'Actif',
      dateCreation: new Date().toISOString().split('T')[0],
      nombreProduits: 0,
    };
    categoriesStore.push(newCat);
    res.status(201).json(newCat);
  });

  app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const idx = categoriesStore.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    categoriesStore[idx] = { ...categoriesStore[idx], ...req.body };
    res.json(categoriesStore[idx]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    categoriesStore = categoriesStore.filter((c) => c.id !== id);
    res.json({ success: true, id });
  });

  // Orders CRUD
  app.get('/api/orders', (req, res) => {
    const { status, clientId } = req.query;
    let filtered = [...ordersStore];

    if (status && typeof status === 'string' && status !== 'Tous') {
      filtered = filtered.filter((o) => o.statut === status);
    }

    if (clientId && typeof clientId === 'string') {
      filtered = filtered.filter((o) => o.clientId === clientId);
    }

    res.json(filtered);
  });

  app.post('/api/orders', (req, res) => {
    const { items, adresseLivraison, clientNom, clientEmail } = req.body;
    const total = items.reduce(
      (sum: number, item: any) => sum + item.produit.prix * item.quantite,
      0
    );

    const newOrder: Commande = {
      id: 'cmd-' + (ordersStore.length + 1),
      reference: `CMD-2026-00${ordersStore.length + 1}`,
      clientId: 'c1',
      clientNom: clientNom || 'Alice MARTIN',
      clientEmail: clientEmail || 'alice.martin@gmail.com',
      date: new Date().toISOString().split('T')[0],
      montantTotal: parseFloat(total.toFixed(2)),
      statut: 'En attente',
      statutPaiement: 'Payé',
      adresseLivraison: adresseLivraison || '12 Rue de la République, 75011 Paris, France',
      lignes: items.map((item: any, i: number) => ({
        id: `lc-${Date.now()}-${i}`,
        commandeId: `cmd-${ordersStore.length + 1}`,
        produitId: item.produit.id,
        quantite: item.quantite,
        prixUnitaire: item.produit.prix,
        prixTotal: parseFloat((item.produit.prix * item.quantite).toFixed(2)),
        produit: item.produit,
      })),
    };

    ordersStore.unshift(newOrder);

    // Update client total spent & orders count
    const client = clientsStore.find((c) => c.id === 'c1');
    if (client) {
      client.nombreCommandes += 1;
      client.totalDepense = parseFloat((client.totalDepense + total).toFixed(2));
    }

    // Adjust product stock
    items.forEach((item: any) => {
      const p = productsStore.find((prod) => prod.id === item.produit.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantite);
        if (p.stock === 0) p.disponibilite = 'Rupture de stock';
      }
    });

    res.status(201).json(newOrder);
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { statut, statutPaiement } = req.body;
    const order = ordersStore.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    if (statut) order.statut = statut;
    if (statutPaiement) order.statutPaiement = statutPaiement;
    res.json(order);
  });

  // Authentication endpoint mock
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    res.json({ user, token: `mock-jwt-token-${user.id}` });
  });

  // Vite middleware for dev / static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
