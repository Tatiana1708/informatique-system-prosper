import 'dotenv/config';
import express from 'express';
import path from 'path';
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
  dbInsertProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbInsertCategory,
  dbUpdateCategory,
  dbDeleteCategory,
  dbInsertUser,
  dbUpdateUser,
  dbDeleteUser,
  dbInsertOrder,
  dbUpdateOrderStatus,
  dbLoadAll,
  dbExecuteSQL,
  dbGetTablesOverview,
  dbSeedBatch,
  dbResetDatabase,
} from './src/db/mysql.js';
import {
  getTiDBConfig,
  executeTiDBGetRequest,
  fetchTiDBProducts,
  fetchTiDBProductById,
  fetchTiDBCategories,
  fetchTiDBCategoryById,
  fetchTiDBUsers,
  fetchTiDBUserById,
  fetchTiDBClients,
  fetchTiDBClientById,
  fetchTiDBOrders,
  fetchTiDBOrderById,
  fetchTiDBOrderLines,
  fetchTiDBOrderLineById,
} from './src/services/tidbClient.js';

// In-memory verification codes store: email -> { code, expiresAt }
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

let usersStore: User[] = [...MOCK_USERS];
let clientsStore: Client[] = [...MOCK_CLIENTS];
let categoriesStore: Categorie[] = [...MOCK_CATEGORIES];
let productsStore: Produit[] = [...MOCK_PRODUCTS];
let ordersStore: Commande[] = [...MOCK_ORDERS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize MySQL Connection (gracefully fallbacks to in-memory/local-file if unconfigured or error)
  const dbStatus = await initMySQLConnection();
  console.log(`[DB Status] Mode: ${dbStatus.mode.toUpperCase()}${dbStatus.error ? ' (' + dbStatus.error + ')' : ''}`);

  // Load existing persistent database records on boot
  try {
    const loadedData = await dbLoadAll();
    usersStore = loadedData.users;
    categoriesStore = loadedData.categories;
    productsStore = loadedData.products;
    clientsStore = loadedData.clients;
    ordersStore = loadedData.orders;
    console.log(`[DB Ready] Données chargées : ${productsStore.length} produits, ${categoriesStore.length} catégories, ${usersStore.length} utilisateurs.`);
  } catch (err) {
    console.error('[DB Boot Load Error]', err);
  }

  // Database Status API
  app.get('/api/db/status', (req, res) => {
    res.json(getDbStatus());
  });

  // Database Overview & Tables API
  app.get('/api/db/overview', async (req, res) => {
    try {
      const overview = await dbGetTablesOverview();
      res.json(overview);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erreur overview BDD' });
    }
  });

  // Database Insert Data Endpoint (Products, Categories, Users, Orders)
  app.post('/api/db/insert-data', async (req, res) => {
    const { table, data } = req.body;
    if (!table || !data) {
      return res.status(400).json({ error: 'Table et données requises' });
    }

    try {
      if (table === 'products') {
        const cat = categoriesStore.find((c) => c.id === data.categorieId);
        const prod: Produit = {
          id: data.id || ('p-' + Date.now()),
          nom: data.nom || 'Nouveau Produit Informatique',
          marque: data.marque || 'Générique',
          modele: data.modele || 'PRO',
          categorieId: data.categorieId || (categoriesStore[0]?.id || 'cat-1'),
          categorieNom: cat ? cat.nom : (data.categorieNom || 'Composants'),
          prix: Number(data.prix) || 99.99,
          image: data.image || 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
          garantie: data.garantie || '2 ans',
          stock: Number(data.stock) || 10,
          disponibilite: Number(data.stock) > 0 ? 'En stock' : 'Rupture de stock',
          description: data.description || 'Équipement informatique certifié.',
          caracteristiques: Array.isArray(data.caracteristiques) ? data.caracteristiques : [data.caracteristiques || 'Haute performance'],
        };
        productsStore.unshift(prod);
        await dbInsertProduct(prod);
        return res.status(201).json({
          success: true,
          table: 'products',
          record: prod,
          message: `Produit "${prod.nom}" ajouté avec succès à la base de données.`,
          sqlExecuted: `INSERT INTO products (id, nom, marque, modele, categorie_id, prix, stock) VALUES ('${prod.id}', '${prod.nom.replace(/'/g, "''")}', '${prod.marque}', '${prod.modele}', '${prod.categorieId}', ${prod.prix}, ${prod.stock});`,
        });
      }

      if (table === 'categories') {
        const cat: Categorie = {
          id: data.id || ('cat-' + Date.now()),
          nom: data.nom || 'Nouvelle Catégorie',
          description: data.description || 'Description de la catégorie.',
          statut: data.statut || 'Actif',
          dateCreation: new Date().toISOString().split('T')[0],
          nombreProduits: 0,
        };
        categoriesStore.push(cat);
        await dbInsertCategory(cat);
        return res.status(201).json({
          success: true,
          table: 'categories',
          record: cat,
          message: `Catégorie "${cat.nom}" ajoutée avec succès à la base de données.`,
          sqlExecuted: `INSERT INTO categories (id, nom, description, statut, date_creation) VALUES ('${cat.id}', '${cat.nom.replace(/'/g, "''")}', '${cat.description.replace(/'/g, "''")}', '${cat.statut}', '${cat.dateCreation}');`,
        });
      }

      if (table === 'users') {
        const user: User = {
          id: data.id || ('u-' + Date.now()),
          nom: data.nom || 'Nouvel Utilisateur',
          email: (data.email || `user${Date.now()}@example.com`).trim().toLowerCase(),
          role: data.role || 'Client',
          statut: data.statut || 'Actif',
          dateInscription: new Date().toISOString().split('T')[0],
          isEmailVerified: data.isEmailVerified !== undefined ? Boolean(data.isEmailVerified) : true,
        };
        usersStore.unshift(user);
        if (user.role === 'Client') {
          clientsStore.unshift({
            id: 'c-' + Date.now(),
            userId: user.id,
            nombreCommandes: 0,
            totalDepense: 0,
            statut: 'Nouveau',
            user,
          });
        }
        await dbInsertUser(user);
        return res.status(201).json({
          success: true,
          table: 'users',
          record: user,
          message: `Utilisateur "${user.nom}" ajouté avec succès à la base de données.`,
          sqlExecuted: `INSERT INTO users (id, nom, email, role, statut) VALUES ('${user.id}', '${user.nom.replace(/'/g, "''")}', '${user.email}', '${user.role}', '${user.statut}');`,
        });
      }

      if (table === 'orders') {
        const order: Commande = {
          id: data.id || ('cmd-' + Date.now()),
          reference: data.reference || `CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          clientId: data.clientId || (clientsStore[0]?.id || 'c1'),
          clientNom: data.clientNom || 'Entreprise Client SAS',
          clientEmail: data.clientEmail || 'contact@client-sas.com',
          date: new Date().toISOString().split('T')[0],
          montantTotal: Number(data.montantTotal) || 540.00,
          statut: data.statut || 'En attente',
          statutPaiement: data.statutPaiement || 'Payé',
          adresseLivraison: data.adresseLivraison || '25 Rue de Rivoli, Paris',
          lignes: data.lignes || [
            {
              id: 'lc-' + Date.now(),
              commandeId: data.id || ('cmd-' + Date.now()),
              produitId: productsStore[0]?.id || 'p1',
              quantite: 1,
              prixUnitaire: productsStore[0]?.prix || 149.99,
              prixTotal: productsStore[0]?.prix || 149.99,
              produit: productsStore[0],
            },
          ],
        };
        ordersStore.unshift(order);
        await dbInsertOrder(order);
        return res.status(201).json({
          success: true,
          table: 'orders',
          record: order,
          message: `Commande "${order.reference}" ajoutée avec succès à la base de données.`,
          sqlExecuted: `INSERT INTO orders (id, reference, client_id, montant_total, statut) VALUES ('${order.id}', '${order.reference}', '${order.clientId}', ${order.montantTotal}, '${order.statut}');`,
        });
      }

      return res.status(400).json({ error: `Table "${table}" non reconnue.` });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erreur lors de l\'insertion en BDD' });
    }
  });

  // Direct SQL Execution endpoint
  app.post('/api/db/execute-sql', async (req, res) => {
    try {
      const { sql } = req.body;
      const result = await dbExecuteSQL(sql || '');
      const lower = (sql || '').toLowerCase();
      if (lower.includes('insert') || lower.includes('update') || lower.includes('delete') || lower.includes('truncate') || lower.includes('drop')) {
        const reloaded = await dbLoadAll();
        usersStore = reloaded.users;
        categoriesStore = reloaded.categories;
        productsStore = reloaded.products;
        clientsStore = reloaded.clients;
        ordersStore = reloaded.orders;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Batch Data Seeder endpoint
  app.post('/api/db/seed-batch', async (req, res) => {
    try {
      const { batchType } = req.body;
      const count = await dbSeedBatch(batchType || 'all');
      const reloaded = await dbLoadAll();
      usersStore = reloaded.users;
      categoriesStore = reloaded.categories;
      productsStore = reloaded.products;
      clientsStore = reloaded.clients;
      ordersStore = reloaded.orders;
      res.json({
        success: true,
        count,
        message: `${count} données ajoutées avec succès dans la base de données !`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erreur injection par lot' });
    }
  });

  // Database Reset & Reseed endpoint
  app.post('/api/db/reset', async (req, res) => {
    try {
      await dbResetDatabase();
      const reloaded = await dbLoadAll();
      usersStore = reloaded.users;
      categoriesStore = reloaded.categories;
      productsStore = reloaded.products;
      clientsStore = reloaded.clients;
      ordersStore = reloaded.orders;
      res.json({ success: true, message: 'Base de données réinitialisée avec succès !' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // TiDB Cloud Data Service / Data App Endpoints
  // Products: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products?id=${id}'
  // Categories: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories?id=${id}'
  // Users: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users?id=${id}'
  // Orders: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders?id=${id}'
  // Clients: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients?id=${id}'
  // Order Lines: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines?id=${id}'
  app.get('/api/tidb/status', (req, res) => {
    const config = getTiDBConfig();
    const maskedKey = config.publicKey
      ? `${config.publicKey.slice(0, 4)}••••${config.publicKey.slice(-4)}`
      : '';
    res.json({
      endpointUrl: config.endpointUrl,
      categoriesEndpointUrl: config.categoriesEndpointUrl,
      usersEndpointUrl: config.usersEndpointUrl,
      ordersEndpointUrl: config.ordersEndpointUrl,
      clientsEndpointUrl: config.clientsEndpointUrl,
      orderLinesEndpointUrl: config.orderLinesEndpointUrl,
      isConfigured: config.isConfigured,
      publicKeyMasked: maskedKey,
      curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}'`,
      curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=\${id}'`,
      curlProducts: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}'`,
      curlProductsById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=\${id}'`,
      curlCategories: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}'`,
      curlCategoriesById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=\${id}'`,
      curlUsers: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}'`,
      curlUsersById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=\${id}'`,
      curlOrders: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}'`,
      curlOrdersById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=\${id}'`,
      curlClients: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}'`,
      curlClientsById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=\${id}'`,
      curlOrderLines: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}'`,
      curlOrderLinesById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=\${id}'`,
    });
  });

  // Direct fetch from TiDB Cloud Data App endpoint (all products or filter by ?id=...)
  app.get('/api/tidb/products', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : undefined;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: config.endpointUrl,
          curlSample: idParam
            ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=${idParam}'`
            : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=\${id}'`,
        });
      }

      const result = await fetchTiDBProducts(idParam);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Erreur lors de l\'interrogation du point de terminaison TiDB Cloud (produits)',
        message: err.message,
      });
    }
  });

  // Direct fetch single product by ID from TiDB Cloud:
  // curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/products?id=${id}'
  app.get('/api/tidb/products/:id', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: `${config.endpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=${id}'`,
        });
      }

      const result = await fetchTiDBProductById(id);
      if (!result.product) {
        return res.status(404).json({
          error: `Produit avec l'ID "${id}" non trouvé sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: `Erreur lors de la récupération du produit ${req.params.id} sur TiDB Cloud`,
        message: err.message,
      });
    }
  });

  // Sync products from TiDB Cloud into local memory and database
  app.post('/api/tidb/sync', async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud manquantes',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement pour synchroniser les données depuis TiDB Cloud.',
          endpointUrl: config.endpointUrl,
        });
      }

      const result = await fetchTiDBProducts();
      let importedCount = 0;
      for (const p of result.products) {
        const idx = productsStore.findIndex((item) => item.id === p.id);
        if (idx >= 0) {
          productsStore[idx] = p;
        } else {
          productsStore.unshift(p);
        }
        await dbInsertProduct(p);
        importedCount++;
      }

      res.json({
        success: true,
        count: importedCount,
        latencyMs: result.latencyMs,
        message: `${importedCount} produit(s) synchronisé(s) depuis TiDB Cloud Data App avec succès !`,
        products: result.products,
      });
    } catch (err: any) {
      res.status(500).json({
        error: 'Échec de synchronisation TiDB Cloud (produits)',
        message: err.message,
      });
    }
  });

  // --- TiDB Categories Endpoints ---
  // Format: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories'
  // Format with ID: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories?id=${id}'
  app.get('/api/tidb/categories', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : undefined;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: config.categoriesEndpointUrl,
          curlSample: idParam
            ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=${idParam}'`
            : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=\${id}'`,
        });
      }

      const result = await fetchTiDBCategories(idParam);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Erreur lors de l\'interrogation du point de terminaison TiDB Cloud (catégories)',
        message: err.message,
      });
    }
  });

  // Direct fetch single category by ID from TiDB Cloud:
  // curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/categories?id=${id}'
  app.get('/api/tidb/categories/:id', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: `${config.categoriesEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=${id}'`,
        });
      }

      const result = await fetchTiDBCategoryById(id);
      if (!result.category) {
        return res.status(404).json({
          error: `Catégorie avec l'ID "${id}" non trouvée sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: `Erreur lors de la récupération de la catégorie ${req.params.id} sur TiDB Cloud`,
        message: err.message,
      });
    }
  });

  // Sync categories from TiDB Cloud into local memory and database
  app.post('/api/tidb/sync-categories', async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud manquantes',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement pour synchroniser les données depuis TiDB Cloud.',
          endpointUrl: config.categoriesEndpointUrl,
        });
      }

      const result = await fetchTiDBCategories();
      let importedCount = 0;
      for (const cat of result.categories) {
        const idx = categoriesStore.findIndex((item) => item.id === cat.id);
        if (idx >= 0) {
          categoriesStore[idx] = cat;
        } else {
          categoriesStore.push(cat);
        }
        await dbInsertCategory(cat);
        importedCount++;
      }

      res.json({
        success: true,
        count: importedCount,
        latencyMs: result.latencyMs,
        message: `${importedCount} catégorie(s) synchronisée(s) depuis TiDB Cloud Data App avec succès !`,
        categories: result.categories,
      });
    } catch (err: any) {
      res.status(500).json({
        error: 'Échec de synchronisation TiDB Cloud (catégories)',
        message: err.message,
      });
    }
  });

  // --- TiDB Users Endpoints ---
  // Format: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users'
  // Format with ID: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users?id=${id}'
  app.get('/api/tidb/users', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : undefined;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: config.usersEndpointUrl,
          curlSample: idParam
            ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=${idParam}'`
            : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=\${id}'`,
        });
      }

      const result = await fetchTiDBUsers(idParam);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Erreur lors de l\'interrogation du point de terminaison TiDB Cloud (utilisateurs)',
        message: err.message,
      });
    }
  });

  // Direct fetch single user by ID from TiDB Cloud:
  // curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/users?id=${id}'
  app.get('/api/tidb/users/:id', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: `${config.usersEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=${id}'`,
        });
      }

      const result = await fetchTiDBUserById(id);
      if (!result.user) {
        return res.status(404).json({
          error: `Utilisateur avec l'ID "${id}" non trouvé sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: `Erreur lors de la récupération de l'utilisateur ${req.params.id} sur TiDB Cloud`,
        message: err.message,
      });
    }
  });

  // Sync users from TiDB Cloud into local memory and database
  app.post('/api/tidb/sync-users', async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud manquantes',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement pour synchroniser les données depuis TiDB Cloud.',
          endpointUrl: config.usersEndpointUrl,
        });
      }

      const result = await fetchTiDBUsers();
      let importedCount = 0;
      for (const u of result.users) {
        const idx = usersStore.findIndex((item) => item.id === u.id || item.email.toLowerCase() === u.email.toLowerCase());
        if (idx >= 0) {
          usersStore[idx] = u;
        } else {
          usersStore.unshift(u);
        }
        await dbInsertUser(u);
        importedCount++;
      }

      res.json({
        success: true,
        count: importedCount,
        latencyMs: result.latencyMs,
        message: `${importedCount} utilisateur(s) synchronisé(s) depuis TiDB Cloud Data App avec succès !`,
        users: result.users,
      });
    } catch (err: any) {
      res.status(500).json({
        error: 'Échec de synchronisation TiDB Cloud (utilisateurs)',
        message: err.message,
      });
    }
  });

  // --- TiDB Orders Endpoints ---
  // Format: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders'
  // Format with ID: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders?id=${id}'
  app.get('/api/tidb/orders', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : undefined;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: config.ordersEndpointUrl,
          curlSample: idParam
            ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=${idParam}'`
            : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=\${id}'`,
        });
      }

      const result = await fetchTiDBOrders(idParam);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Erreur lors de l\'interrogation du point de terminaison TiDB Cloud (commandes)',
        message: err.message,
      });
    }
  });

  // Direct fetch single order by ID from TiDB Cloud:
  // curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/orders?id=${id}'
  app.get('/api/tidb/orders/:id', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: `${config.ordersEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=${id}'`,
        });
      }

      const result = await fetchTiDBOrderById(id);
      if (!result.order) {
        return res.status(404).json({
          error: `Commande avec l'ID "${id}" non trouvée sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: `Erreur lors de la récupération de la commande ${req.params.id} sur TiDB Cloud`,
        message: err.message,
      });
    }
  });

  // Sync orders from TiDB Cloud into local memory and database
  app.post('/api/tidb/sync-orders', async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud manquantes',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement pour synchroniser les données depuis TiDB Cloud.',
          endpointUrl: config.ordersEndpointUrl,
        });
      }

      const result = await fetchTiDBOrders();
      let importedCount = 0;
      for (const ord of result.orders) {
        const idx = ordersStore.findIndex((item) => item.id === ord.id || item.reference === ord.reference);
        if (idx >= 0) {
          ordersStore[idx] = ord;
        } else {
          ordersStore.unshift(ord);
        }
        await dbInsertOrder(ord);
        importedCount++;
      }

      res.json({
        success: true,
        count: importedCount,
        latencyMs: result.latencyMs,
        message: `${importedCount} commande(s) synchronisée(s) depuis TiDB Cloud Data App avec succès !`,
        orders: result.orders,
      });
    } catch (err: any) {
      res.status(500).json({
        error: 'Échec de synchronisation TiDB Cloud (commandes)',
        message: err.message,
      });
    }
  });

  // --- TiDB Clients Endpoints ---
  // Format: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients'
  // Format with ID: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients?id=${id}'
  app.get('/api/tidb/clients', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : undefined;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: config.clientsEndpointUrl,
          curlSample: idParam
            ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=${idParam}'`
            : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=\${id}'`,
        });
      }

      const result = await fetchTiDBClients(idParam);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Erreur lors de l\'interrogation du point de terminaison TiDB Cloud (clients)',
        message: err.message,
      });
    }
  });

  // Direct fetch single client by ID from TiDB Cloud:
  // curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/clients?id=${id}'
  app.get('/api/tidb/clients/:id', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: `${config.clientsEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=${id}'`,
        });
      }

      const result = await fetchTiDBClientById(id);
      if (!result.client) {
        return res.status(404).json({
          error: `Client avec l'ID "${id}" non trouvé sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: `Erreur lors de la récupération du client ${req.params.id} sur TiDB Cloud`,
        message: err.message,
      });
    }
  });

  // Sync clients from TiDB Cloud into local memory and database
  app.post('/api/tidb/sync-clients', async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud manquantes',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement pour synchroniser les données depuis TiDB Cloud.',
          endpointUrl: config.clientsEndpointUrl,
        });
      }

      const result = await fetchTiDBClients();
      let importedCount = 0;
      for (const cl of result.clients) {
        const idx = clientsStore.findIndex((item) => item.id === cl.id || item.userId === cl.userId);
        if (idx >= 0) {
          clientsStore[idx] = cl;
        } else {
          clientsStore.unshift(cl);
        }
        if (cl.user) {
          const uIdx = usersStore.findIndex((u) => u.id === cl.user!.id || u.email.toLowerCase() === cl.user!.email.toLowerCase());
          if (uIdx >= 0) {
            usersStore[uIdx] = cl.user;
          } else {
            usersStore.unshift(cl.user);
          }
          await dbInsertUser(cl.user);
        }
        importedCount++;
      }

      res.json({
        success: true,
        count: importedCount,
        latencyMs: result.latencyMs,
        message: `${importedCount} client(s) synchronisé(s) depuis TiDB Cloud Data App avec succès !`,
        clients: result.clients,
      });
    } catch (err: any) {
      res.status(500).json({
        error: 'Échec de synchronisation TiDB Cloud (clients)',
        message: err.message,
      });
    }
  });

  // --- TiDB Order Lines Endpoints ---
  // Format: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines'
  // Format with ID: curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines?id=${id}'
  app.get('/api/tidb/order-lines', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : undefined;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: config.orderLinesEndpointUrl,
          curlSample: idParam
            ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=${idParam}'`
            : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=\${id}'`,
        });
      }

      const result = await fetchTiDBOrderLines(idParam);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Erreur lors de l\'interrogation du point de terminaison TiDB Cloud (lignes de commandes)',
        message: err.message,
      });
    }
  });

  // Direct fetch single order line by ID from TiDB Cloud:
  // curl --user ${PUBLIC_KEY}:${PRIVATE_KEY} --request GET 'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint/order_lines?id=${id}'
  app.get('/api/tidb/order-lines/:id', async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;

      if (!config.isConfigured) {
        return res.status(400).json({
          error: 'Clés TiDB Cloud non configurées',
          message:
            'Veuillez définir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d\'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.',
          endpointUrl: `${config.orderLinesEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=${id}'`,
        });
      }

      const result = await fetchTiDBOrderLineById(id);
      if (!result.orderLine) {
        return res.status(404).json({
          error: `Ligne de commande avec l'ID "${id}" non trouvée sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse,
        });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: `Erreur lors de la récupération de la ligne de commande ${req.params.id} sur TiDB Cloud`,
        message: err.message,
      });
    }
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

  app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { source } = req.query;

    if (source === 'tidb') {
      try {
        const tidbRes = await fetchTiDBUserById(id);
        if (tidbRes.user) {
          return res.json(tidbRes.user);
        }
      } catch (err: any) {
        console.warn(`[TiDB User ID Query Warning] ID ${id}:`, err.message);
      }
    }

    let user = usersStore.find((u) => u.id === id);

    // If not found in local store, attempt lookup from TiDB Cloud endpoint
    if (!user) {
      try {
        const tidbRes = await fetchTiDBUserById(id);
        if (tidbRes.user) {
          user = tidbRes.user;
        }
      } catch (err: any) {
        // Fall through to 404
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  });

  app.post('/api/users', async (req, res) => {
    const { nom, email, role, statut } = req.body;
    const newUser: User = {
      id: req.body.id || ('u-' + Date.now()),
      nom: nom || 'Nouvel Utilisateur',
      email: email || `user${Date.now()}@example.com`,
      role: role || 'Client',
      statut: statut || 'Actif',
      dateInscription: new Date().toISOString().split('T')[0],
      isEmailVerified: true,
    };
    usersStore.unshift(newUser);

    if (newUser.role === 'Client') {
      clientsStore.unshift({
        id: 'c-' + Date.now(),
        userId: newUser.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: 'Nouveau',
        user: newUser,
      });
    }

    await dbInsertUser(newUser);
    res.status(201).json(newUser);
  });

  app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const idx = usersStore.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    usersStore[idx] = { ...usersStore[idx], ...req.body };
    await dbUpdateUser(id, req.body);
    res.json(usersStore[idx]);
  });

  app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    usersStore = usersStore.filter((u) => u.id !== id);
    clientsStore = clientsStore.filter((c) => c.userId !== id);
    await dbDeleteUser(id);
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
  app.get('/api/products', async (req, res) => {
    const { search, category, minPrice, maxPrice, source } = req.query;
    let targetList = [...productsStore];

    // Optional direct fetch from TiDB Cloud Data App endpoint
    if (source === 'tidb') {
      try {
        const tidbResult = await fetchTiDBProducts();
        if (tidbResult.products && tidbResult.products.length > 0) {
          targetList = tidbResult.products;
        }
      } catch (err: any) {
        console.warn('[TiDB Fetch Warning] Utilisation du store local en secours:', err.message);
      }
    }

    let filtered = targetList;

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

  app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { source } = req.query;

    if (source === 'tidb') {
      try {
        const tidbRes = await fetchTiDBProductById(id);
        if (tidbRes.product) {
          return res.json(tidbRes.product);
        }
      } catch (err: any) {
        console.warn(`[TiDB ID Query Warning] ID ${id}:`, err.message);
      }
    }

    let product = productsStore.find((p) => p.id === id);

    // If not found in local store, attempt lookup from TiDB Cloud endpoint
    if (!product) {
      try {
        const tidbRes = await fetchTiDBProductById(id);
        if (tidbRes.product) {
          product = tidbRes.product;
        }
      } catch (err: any) {
        // Continue to 404
      }
    }

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  });

  app.post('/api/products', async (req, res) => {
    const cat = categoriesStore.find((c) => c.id === req.body.categorieId);
    const newProduct: Produit = {
      id: req.body.id || ('p-' + Date.now()),
      nom: req.body.nom || 'Nouveau Produit',
      marque: req.body.marque || 'Générique',
      modele: req.body.modele || 'PRO',
      categorieId: req.body.categorieId || 'cat-1',
      categorieNom: cat ? cat.nom : (req.body.categorieNom || 'Composants'),
      prix: Number(req.body.prix) || 99.99,
      image: req.body.image || 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      garantie: req.body.garantie || '2 ans',
      stock: Number(req.body.stock) || 10,
      disponibilite: Number(req.body.stock) > 0 ? 'En stock' : 'Rupture de stock',
      description: req.body.description || 'Description du produit informatique.',
      caracteristiques: req.body.caracteristiques || ['Haute performance', 'Garantie officielle'],
    };
    productsStore.unshift(newProduct);
    await dbInsertProduct(newProduct);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', async (req, res) => {
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
    await dbUpdateProduct(id, req.body);
    res.json(productsStore[idx]);
  });

  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    productsStore = productsStore.filter((p) => p.id !== id);
    await dbDeleteProduct(id);
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

  app.get('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { source } = req.query;

    if (source === 'tidb') {
      try {
        const tidbRes = await fetchTiDBCategoryById(id);
        if (tidbRes.category) {
          return res.json(tidbRes.category);
        }
      } catch (err: any) {
        console.warn(`[TiDB Category ID Query Warning] ID ${id}:`, err.message);
      }
    }

    let cat = categoriesStore.find((c) => c.id === id);

    // If not found in local store, attempt lookup from TiDB Cloud endpoint
    if (!cat) {
      try {
        const tidbRes = await fetchTiDBCategoryById(id);
        if (tidbRes.category) {
          cat = tidbRes.category;
        }
      } catch (err: any) {
        // Fall through to 404
      }
    }

    if (!cat) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    const count = productsStore.filter((p) => p.categorieId === cat!.id).length;
    res.json({ ...cat, nombreProduits: count });
  });

  app.post('/api/categories', async (req, res) => {
    const newCat: Categorie = {
      id: req.body.id || ('cat-' + Date.now()),
      nom: req.body.nom || 'Nouvelle Catégorie',
      description: req.body.description || 'Description de la catégorie.',
      statut: req.body.statut || 'Actif',
      dateCreation: new Date().toISOString().split('T')[0],
      nombreProduits: 0,
    };
    categoriesStore.push(newCat);
    await dbInsertCategory(newCat);
    res.status(201).json(newCat);
  });

  app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const idx = categoriesStore.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    categoriesStore[idx] = { ...categoriesStore[idx], ...req.body };
    await dbUpdateCategory(id, req.body);
    res.json(categoriesStore[idx]);
  });

  app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    categoriesStore = categoriesStore.filter((c) => c.id !== id);
    await dbDeleteCategory(id);
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

  app.post('/api/orders', async (req, res) => {
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

    await dbInsertOrder(newOrder);
    res.status(201).json(newOrder);
  });

  app.patch('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { statut, statutPaiement } = req.body;
    const order = ordersStore.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    if (statut) order.statut = statut;
    if (statutPaiement) order.statutPaiement = statutPaiement;
    await dbUpdateOrderStatus(id, statut, statutPaiement);
    res.json(order);
  });

  // Authentication endpoints

  // Send Verification Code endpoint
  app.post('/api/auth/send-verification-code', async (req, res) => {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Adresse e-mail requise' });
    }

    const cleanEmail = email.trim().toLowerCase();
    // Generate a 6-digit numeric verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // 15 minutes validity
    const expiresAt = Date.now() + 15 * 60 * 1000;

    verificationCodes.set(cleanEmail, { code, expiresAt });

    console.log(`[Email Verification] Code généré pour ${cleanEmail}: ${code} (valide 15 min)`);

    res.json({
      success: true,
      message: `Code de vérification envoyé avec succès à ${cleanEmail}`,
      demoCode: code, // Provided for instant demo/testing convenience in the UI
    });
  });

  // Verify Code endpoint
  app.post('/api/auth/verify-code', async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'E-mail et code de vérification requis' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const entry = verificationCodes.get(cleanEmail);

    if (!entry) {
      // Allow demo bypass code 123456 as universal fallback
      if (code.trim() === '123456') {
        // Mark user verified
        const u = usersStore.find((user) => user.email.toLowerCase() === cleanEmail);
        if (u) u.isEmailVerified = true;
        return res.json({ success: true, message: 'Adresse e-mail vérifiée avec succès' });
      }
      return res.status(400).json({ error: 'Aucun code actif trouvé pour cet e-mail. Veuillez en demander un nouveau.' });
    }

    if (Date.now() > entry.expiresAt) {
      verificationCodes.delete(cleanEmail);
      return res.status(400).json({ error: 'Ce code a expiré. Veuillez en générer un nouveau.' });
    }

    if (entry.code !== code.trim() && code.trim() !== '123456') {
      return res.status(400).json({ error: 'Code de vérification incorrect. Veuillez vérifier.' });
    }

    // Code is valid
    verificationCodes.delete(cleanEmail);

    // Update in memory user
    const u = usersStore.find((user) => user.email.toLowerCase() === cleanEmail);
    if (u) {
      u.isEmailVerified = true;
    }

    // Update in MySQL if connected
    const pool = getMySQLPool();
    if (pool) {
      try {
        await pool.query('UPDATE users SET is_email_verified = TRUE WHERE LOWER(email) = LOWER(?)', [cleanEmail]);
      } catch (err) {
        console.error('[MySQL Verify Code Error]', err);
      }
    }

    res.json({ success: true, message: 'Adresse e-mail vérifiée avec succès !' });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'L\'adresse e-mail est requise' });
    }

    let user: User | undefined;

    // Check MySQL if connected
    const pool = getMySQLPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
        if (rows && rows.length > 0) {
          const u = rows[0];
          user = {
            id: u.id,
            nom: u.nom,
            email: u.email,
            role: u.role,
            statut: u.statut,
            dateInscription: u.date_inscription,
            isEmailVerified: Boolean(u.is_email_verified),
          };
        }
      } catch (err) {
        console.error('[MySQL Login Error]', err);
      }
    }

    // Fallback to memory store if not found in MySQL or MySQL disabled
    if (!user) {
      user = usersStore.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ error: 'Aucun compte associé à cette adresse e-mail' });
    }

    res.json({
      user,
      token: `jwt-isp-session-${user.id}-${Date.now()}`,
      message: 'Connexion réussie',
    });
  });

  app.post('/api/auth/register', async (req, res) => {
    const { nom, email, password, role, isEmailVerified } = req.body;

    if (!nom || !email) {
      return res.status(400).json({ error: 'Le nom et l\'adresse e-mail sont obligatoires' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate in memory or DB
    const existing = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'Un compte existe déjà avec cette adresse e-mail' });
    }

    const newUser: User = {
      id: 'u-' + Date.now(),
      nom: nom.trim(),
      email: cleanEmail,
      role: role && ['Admin', 'Vendeur', 'Client'].includes(role) ? role : 'Client',
      statut: 'Actif',
      dateInscription: new Date().toISOString().split('T')[0],
      isEmailVerified: isEmailVerified !== undefined ? Boolean(isEmailVerified) : true,
    };

    // Save in memory
    usersStore.unshift(newUser);

    if (newUser.role === 'Client') {
      clientsStore.unshift({
        id: 'c-' + Date.now(),
        userId: newUser.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: 'Nouveau',
        user: newUser,
      });
    }

    // Save in MySQL if connected
    const pool = getMySQLPool();
    if (pool) {
      try {
        await pool.query(
          'INSERT INTO users (id, nom, email, role, statut, date_inscription, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [newUser.id, newUser.nom, newUser.email, newUser.role, newUser.statut, newUser.dateInscription, newUser.isEmailVerified ? 1 : 0]
        );
        if (newUser.role === 'Client') {
          await pool.query(
            'INSERT INTO clients (id, user_id, nombre_commandes, total_depense, statut) VALUES (?, ?, 0, 0, ?)',
            ['c-' + Date.now(), newUser.id, 'Nouveau']
          );
        }
      } catch (err) {
        console.error('[MySQL Register Error]', err);
      }
    }

    res.status(201).json({
      user: newUser,
      token: `jwt-isp-session-${newUser.id}-${Date.now()}`,
      message: 'Inscription réussie',
    });
  });

  // Serve /src/assets statically as a fallback for asset images
  app.use('/src/assets', express.static(path.join(process.cwd(), 'src/assets')));

  // Favicon handler
  app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
