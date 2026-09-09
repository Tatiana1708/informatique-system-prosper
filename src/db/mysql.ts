import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import {
  MOCK_CATEGORIES,
  MOCK_CLIENTS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_USERS,
} from '../data/mockData.js';
import { Categorie, Client, Commande, Produit, User, DbTableInfo, DbOverview, SqlQueryResult } from '../types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DbStatus {
  connected: boolean;
  mode: 'mysql' | 'in-memory';
  config: {
    host: string;
    port: number;
    user: string;
    database: string;
  };
  error?: string;
  tablesCount?: number;
}

let pool: mysql.Pool | null = null;
let isConnected = false;
let connectionError: string | undefined = undefined;

export function getDbConfig() {
  let dbName = process.env.MYSQL_DATABASE || 'informatique_system_prosper';
  // 'sys', 'mysql', 'information_schema', 'performance_schema' are restricted system databases
  if (['sys', 'mysql', 'information_schema', 'performance_schema'].includes(dbName.toLowerCase())) {
    dbName = 'test';
  }
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: dbName,
  };
}

export async function initMySQLConnection(): Promise<DbStatus> {
  const config = getDbConfig();

  // If host is explicitly empty or explicitly disabled, fallback to in-memory
  if (!process.env.MYSQL_HOST && !process.env.MYSQL_URL) {
    connectionError = 'Variables d\'environnement MySQL non configurées (MYSQL_HOST / MYSQL_URL). Mode mémoire temporaire actif.';
    return {
      connected: false,
      mode: 'in-memory',
      config,
      error: connectionError,
    };
  }

  try {
    // Determine if SSL is required (TiDB Cloud or remote cloud hosts)
    const isCloudHost = config.host.includes('tidbcloud.com') || config.host.includes('aiven') || process.env.MYSQL_SSL === 'true' || config.port === 4000;
    const sslOption = isCloudHost ? { minVersion: 'TLSv1.2', rejectUnauthorized: false } : undefined;

    // Attempt connection
    if (process.env.MYSQL_URL) {
      pool = mysql.createPool(process.env.MYSQL_URL);
    } else {
      pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: sslOption,
      });
    }

    // Test connection
    const connection = await pool.getConnection();
    connection.release();

    // Create tables if not exist
    await createSchemaAndSeed();

    isConnected = true;
    connectionError = undefined;

    console.log(`[MySQL] Connexion réussie à la base de données ${config.database} sur ${config.host}:${config.port}`);

    return {
      connected: true,
      mode: 'mysql',
      config,
    };
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message || 'Impossible de se connecter à la base de données MySQL';
    console.warn(`[MySQL Warning] ${connectionError}. Basculement automatique en mode mémoire.`);
    
    return {
      connected: false,
      mode: 'in-memory',
      config,
      error: connectionError,
    };
  }
}

export function getMySQLPool(): mysql.Pool | null {
  return isConnected ? pool : null;
}

export function isMySQLConnected(): boolean {
  return isConnected;
}

export function getDbStatus(): DbStatus {
  return {
    connected: isConnected,
    mode: isConnected ? 'mysql' : 'in-memory',
    config: getDbConfig(),
    error: connectionError,
  };
}

async function createSchemaAndSeed() {
  if (!pool) return;

  // Table Users
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      role VARCHAR(50) NOT NULL DEFAULT 'Client',
      statut VARCHAR(50) NOT NULL DEFAULT 'Actif',
      date_inscription VARCHAR(50) NOT NULL,
      is_email_verified BOOLEAN NOT NULL DEFAULT FALSE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Ensure is_email_verified column exists
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN NOT NULL DEFAULT FALSE;`);
  } catch {
    // Ignore if column already exists
  }

  // Table Categories
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      description TEXT,
      statut VARCHAR(50) NOT NULL DEFAULT 'Actif',
      date_creation VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Table Products
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      nom VARCHAR(150) NOT NULL,
      marque VARCHAR(100) NOT NULL,
      modele VARCHAR(100) NOT NULL,
      categorie_id VARCHAR(50) NOT NULL,
      categorie_nom VARCHAR(100) NOT NULL,
      prix DECIMAL(10,2) NOT NULL,
      image LONGTEXT,
      garantie VARCHAR(50),
      stock INT NOT NULL DEFAULT 0,
      disponibilite VARCHAR(50) NOT NULL,
      description TEXT,
      caracteristiques JSON
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Ensure image column is LONGTEXT for existing databases
  try {
    await pool.query(`ALTER TABLE products MODIFY COLUMN image LONGTEXT;`);
  } catch {
    // Ignore if table does not exist or already updated
  }

  // Table Clients
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      nombre_commandes INT NOT NULL DEFAULT 0,
      total_depense DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      statut VARCHAR(50) NOT NULL DEFAULT 'Actif',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Table Orders
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      reference VARCHAR(50) NOT NULL,
      client_id VARCHAR(50) NOT NULL,
      client_nom VARCHAR(100) NOT NULL,
      client_email VARCHAR(150) NOT NULL,
      date VARCHAR(50) NOT NULL,
      montant_total DECIMAL(10,2) NOT NULL,
      statut VARCHAR(50) NOT NULL,
      statut_paiement VARCHAR(50) NOT NULL,
      adresse_livraison TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Table Order Lines
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_lines (
      id VARCHAR(50) PRIMARY KEY,
      commande_id VARCHAR(50) NOT NULL,
      produit_id VARCHAR(50) NOT NULL,
      quantite INT NOT NULL,
      prix_unitaire DECIMAL(10,2) NOT NULL,
      prix_total DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (commande_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Seed data if empty
  const [usersRows]: any = await pool.query('SELECT COUNT(*) as count FROM users');
  if (usersRows[0].count === 0) {
    console.log('[MySQL] Seeding initial users...');
    for (const u of MOCK_USERS) {
      await pool.query(
        'INSERT INTO users (id, nom, email, role, statut, date_inscription) VALUES (?, ?, ?, ?, ?, ?)',
        [u.id, u.nom, u.email, u.role, u.statut, u.dateInscription]
      );
    }
  }

  console.log('[MySQL] Ensuring initial categories and products exist...');
  for (const c of MOCK_CATEGORIES) {
    await pool.query(
      'INSERT IGNORE INTO categories (id, nom, description, statut, date_creation) VALUES (?, ?, ?, ?, ?)',
      [c.id, c.nom, c.description, c.statut, c.dateCreation]
    );
  }

  for (const p of MOCK_PRODUCTS) {
    await pool.query(
      `INSERT INTO products (id, nom, marque, modele, categorie_id, categorie_nom, prix, image, garantie, stock, disponibilite, description, caracteristiques)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE image = VALUES(image), prix = VALUES(prix), description = VALUES(description), caracteristiques = VALUES(caracteristiques)`,
      [
        p.id,
        p.nom,
        p.marque,
        p.modele,
        p.categorieId,
        p.categorieNom,
        p.prix,
        p.image,
        p.garantie,
        p.stock,
        p.disponibilite,
        p.description,
        JSON.stringify(p.caracteristiques),
      ]
    );
  }

  const [clientRows]: any = await pool.query('SELECT COUNT(*) as count FROM clients');
  if (clientRows[0].count === 0) {
    console.log('[MySQL] Seeding initial clients...');
    for (const cl of MOCK_CLIENTS) {
      await pool.query(
        'INSERT INTO clients (id, user_id, nombre_commandes, total_depense, statut) VALUES (?, ?, ?, ?, ?)',
        [cl.id, cl.userId, cl.nombreCommandes, cl.totalDepense, cl.statut]
      );
    }
  }

  const [orderRows]: any = await pool.query('SELECT COUNT(*) as count FROM orders');
  if (orderRows[0].count === 0) {
    console.log('[MySQL] Seeding initial orders...');
    for (const o of MOCK_ORDERS) {
      await pool.query(
        'INSERT INTO orders (id, reference, client_id, client_nom, client_email, date, montant_total, statut, statut_paiement, adresse_livraison) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          o.id,
          o.reference,
          o.clientId,
          o.clientNom,
          o.clientEmail,
          o.date,
          o.montantTotal,
          o.statut,
          o.statutPaiement,
          o.adresseLivraison,
        ]
      );

      for (const line of o.lignes) {
        await pool.query(
          'INSERT INTO order_lines (id, commande_id, produit_id, quantite, prix_unitaire, prix_total) VALUES (?, ?, ?, ?, ?, ?)',
          [line.id, o.id, line.produitId, line.quantite, line.prixUnitaire, line.prixTotal]
        );
      }
    }
  }
}

// ==========================================
// LOCAL FILE DATABASE PERSISTENCE FALLBACK
// ==========================================

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('[DB Local] Error creating data directory:', err);
  }
}

export function readLocalDb(): {
  users: User[];
  categories: Categorie[];
  products: Produit[];
  clients: Client[];
  orders: Commande[];
} {
  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[DB Local] Warning reading database.json, initializing defaults:', err);
  }

  const initial = {
    users: [...MOCK_USERS],
    categories: [...MOCK_CATEGORIES],
    products: [...MOCK_PRODUCTS],
    clients: [...MOCK_CLIENTS],
    orders: [...MOCK_ORDERS],
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DB Local] Error writing initial database.json:', e);
  }

  return initial;
}

export function writeLocalDb(data: {
  users: User[];
  categories: Categorie[];
  products: Produit[];
  clients: Client[];
  orders: Commande[];
}) {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB Local] Error writing database.json:', err);
  }
}

// ==========================================
// DATABASE DATA PERSISTENCE FUNCTIONS
// ==========================================

export async function dbInsertProduct(p: Produit): Promise<void> {
  // Update local file storage
  const local = readLocalDb();
  const existingIdx = local.products.findIndex((prod) => prod.id === p.id);
  if (existingIdx >= 0) {
    local.products[existingIdx] = p;
  } else {
    local.products.unshift(p);
  }
  writeLocalDb(local);

  // If MySQL is active, insert into products table
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO products (id, nom, marque, modele, categorie_id, categorie_nom, prix, image, garantie, stock, disponibilite, description, caracteristiques)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           nom = VALUES(nom), marque = VALUES(marque), modele = VALUES(modele),
           categorie_id = VALUES(categorie_id), categorie_nom = VALUES(categorie_nom),
           prix = VALUES(prix), image = VALUES(image), garantie = VALUES(garantie),
           stock = VALUES(stock), disponibilite = VALUES(disponibilite),
           description = VALUES(description), caracteristiques = VALUES(caracteristiques)`,
        [
          p.id,
          p.nom,
          p.marque,
          p.modele,
          p.categorieId,
          p.categorieNom || 'Composants',
          p.prix,
          p.image,
          p.garantie,
          p.stock,
          p.disponibilite,
          p.description,
          JSON.stringify(p.caracteristiques || []),
        ]
      );
      console.log(`[MySQL] Produit inséré avec succès en BDD: ${p.nom} (${p.id})`);
    } catch (err) {
      console.error('[MySQL Error] dbInsertProduct:', err);
    }
  }
}

export async function dbUpdateProduct(id: string, p: Partial<Produit>): Promise<void> {
  const local = readLocalDb();
  const idx = local.products.findIndex((prod) => prod.id === id);
  if (idx >= 0) {
    local.products[idx] = { ...local.products[idx], ...p };
    writeLocalDb(local);
  }

  if (pool) {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (p.nom !== undefined) { updates.push('nom = ?'); values.push(p.nom); }
      if (p.marque !== undefined) { updates.push('marque = ?'); values.push(p.marque); }
      if (p.modele !== undefined) { updates.push('modele = ?'); values.push(p.modele); }
      if (p.categorieId !== undefined) { updates.push('categorie_id = ?'); values.push(p.categorieId); }
      if (p.categorieNom !== undefined) { updates.push('categorie_nom = ?'); values.push(p.categorieNom); }
      if (p.prix !== undefined) { updates.push('prix = ?'); values.push(p.prix); }
      if (p.image !== undefined) { updates.push('image = ?'); values.push(p.image); }
      if (p.garantie !== undefined) { updates.push('garantie = ?'); values.push(p.garantie); }
      if (p.stock !== undefined) { updates.push('stock = ?'); values.push(p.stock); }
      if (p.disponibilite !== undefined) { updates.push('disponibilite = ?'); values.push(p.disponibilite); }
      if (p.description !== undefined) { updates.push('description = ?'); values.push(p.description); }
      if (p.caracteristiques !== undefined) { updates.push('caracteristiques = ?'); values.push(JSON.stringify(p.caracteristiques)); }

      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
        console.log(`[MySQL] Produit mis à jour en BDD: ${id}`);
      }
    } catch (err) {
      console.error('[MySQL Error] dbUpdateProduct:', err);
    }
  }
}

export async function dbDeleteProduct(id: string): Promise<void> {
  const local = readLocalDb();
  local.products = local.products.filter((p) => p.id !== id);
  writeLocalDb(local);

  if (pool) {
    try {
      await pool.query('DELETE FROM products WHERE id = ?', [id]);
      console.log(`[MySQL] Produit supprimé de la BDD: ${id}`);
    } catch (err) {
      console.error('[MySQL Error] dbDeleteProduct:', err);
    }
  }
}

export async function dbInsertCategory(c: Categorie): Promise<void> {
  const local = readLocalDb();
  const existingIdx = local.categories.findIndex((cat) => cat.id === c.id);
  if (existingIdx >= 0) {
    local.categories[existingIdx] = c;
  } else {
    local.categories.push(c);
  }
  writeLocalDb(local);

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO categories (id, nom, description, statut, date_creation)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nom = VALUES(nom), description = VALUES(description), statut = VALUES(statut)`,
        [c.id, c.nom, c.description, c.statut, c.dateCreation]
      );
      console.log(`[MySQL] Catégorie insérée en BDD: ${c.nom} (${c.id})`);
    } catch (err) {
      console.error('[MySQL Error] dbInsertCategory:', err);
    }
  }
}

export async function dbUpdateCategory(id: string, c: Partial<Categorie>): Promise<void> {
  const local = readLocalDb();
  const idx = local.categories.findIndex((cat) => cat.id === id);
  if (idx >= 0) {
    local.categories[idx] = { ...local.categories[idx], ...c };
    writeLocalDb(local);
  }

  if (pool) {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      if (c.nom !== undefined) { updates.push('nom = ?'); values.push(c.nom); }
      if (c.description !== undefined) { updates.push('description = ?'); values.push(c.description); }
      if (c.statut !== undefined) { updates.push('statut = ?'); values.push(c.statut); }

      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
        console.log(`[MySQL] Catégorie mise à jour en BDD: ${id}`);
      }
    } catch (err) {
      console.error('[MySQL Error] dbUpdateCategory:', err);
    }
  }
}

export async function dbDeleteCategory(id: string): Promise<void> {
  const local = readLocalDb();
  local.categories = local.categories.filter((c) => c.id !== id);
  writeLocalDb(local);

  if (pool) {
    try {
      await pool.query('DELETE FROM categories WHERE id = ?', [id]);
      console.log(`[MySQL] Catégorie supprimée de la BDD: ${id}`);
    } catch (err) {
      console.error('[MySQL Error] dbDeleteCategory:', err);
    }
  }
}

export async function dbInsertUser(u: User): Promise<void> {
  const local = readLocalDb();
  const idx = local.users.findIndex((user) => user.id === u.id);
  if (idx >= 0) {
    local.users[idx] = u;
  } else {
    local.users.unshift(u);
  }
  if (u.role === 'Client') {
    const clientExists = local.clients.some((cl) => cl.userId === u.id);
    if (!clientExists) {
      local.clients.push({
        id: 'c-' + Date.now(),
        userId: u.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: 'Nouveau',
        user: u,
      });
    }
  }
  writeLocalDb(local);

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO users (id, nom, email, role, statut, date_inscription, is_email_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nom = VALUES(nom), email = VALUES(email), role = VALUES(role), statut = VALUES(statut), is_email_verified = VALUES(is_email_verified)`,
        [u.id, u.nom, u.email, u.role, u.statut, u.dateInscription, u.isEmailVerified ? 1 : 0]
      );
      if (u.role === 'Client') {
        await pool.query(
          `INSERT IGNORE INTO clients (id, user_id, nombre_commandes, total_depense, statut)
           VALUES (?, ?, 0, 0, 'Nouveau')`,
          ['c-' + Date.now(), u.id]
        );
      }
      console.log(`[MySQL] Utilisateur inséré en BDD: ${u.nom} (${u.email})`);
    } catch (err) {
      console.error('[MySQL Error] dbInsertUser:', err);
    }
  }
}

export async function dbUpdateUser(id: string, u: Partial<User>): Promise<void> {
  const local = readLocalDb();
  const idx = local.users.findIndex((user) => user.id === id);
  if (idx >= 0) {
    local.users[idx] = { ...local.users[idx], ...u };
    writeLocalDb(local);
  }

  if (pool) {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      if (u.nom !== undefined) { updates.push('nom = ?'); values.push(u.nom); }
      if (u.email !== undefined) { updates.push('email = ?'); values.push(u.email); }
      if (u.role !== undefined) { updates.push('role = ?'); values.push(u.role); }
      if (u.statut !== undefined) { updates.push('statut = ?'); values.push(u.statut); }
      if (u.isEmailVerified !== undefined) { updates.push('is_email_verified = ?'); values.push(u.isEmailVerified ? 1 : 0); }

      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
        console.log(`[MySQL] Utilisateur mis à jour en BDD: ${id}`);
      }
    } catch (err) {
      console.error('[MySQL Error] dbUpdateUser:', err);
    }
  }
}

export async function dbDeleteUser(id: string): Promise<void> {
  const local = readLocalDb();
  local.users = local.users.filter((u) => u.id !== id);
  local.clients = local.clients.filter((c) => c.userId !== id);
  writeLocalDb(local);

  if (pool) {
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      console.log(`[MySQL] Utilisateur supprimé de la BDD: ${id}`);
    } catch (err) {
      console.error('[MySQL Error] dbDeleteUser:', err);
    }
  }
}

export async function dbInsertOrder(o: Commande): Promise<void> {
  const local = readLocalDb();
  local.orders.unshift(o);
  const cl = local.clients.find((c) => c.id === o.clientId);
  if (cl) {
    cl.nombreCommandes += 1;
    cl.totalDepense = parseFloat((cl.totalDepense + o.montantTotal).toFixed(2));
  }
  // Decrement products stock
  o.lignes.forEach((l) => {
    const p = local.products.find((prod) => prod.id === l.produitId);
    if (p) {
      p.stock = Math.max(0, p.stock - l.quantite);
      p.disponibilite = p.stock > 0 ? 'En stock' : 'Rupture de stock';
    }
  });
  writeLocalDb(local);

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO orders (id, reference, client_id, client_nom, client_email, date, montant_total, statut, statut_paiement, adresse_livraison)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          o.id,
          o.reference,
          o.clientId,
          o.clientNom || '',
          o.clientEmail || '',
          o.date,
          o.montantTotal,
          o.statut,
          o.statutPaiement,
          o.adresseLivraison || '',
        ]
      );

      for (const line of o.lignes) {
        await pool.query(
          `INSERT INTO order_lines (id, commande_id, produit_id, quantite, prix_unitaire, prix_total)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [line.id, o.id, line.produitId, line.quantite, line.prixUnitaire, line.prixTotal]
        );
        await pool.query(
          `UPDATE products SET stock = GREATEST(0, stock - ?), disponibilite = IF(stock - ? > 0, 'En stock', 'Rupture de stock') WHERE id = ?`,
          [line.quantite, line.quantite, line.produitId]
        );
      }
      console.log(`[MySQL] Commande et lignes insérées en BDD: ${o.reference}`);
    } catch (err) {
      console.error('[MySQL Error] dbInsertOrder:', err);
    }
  }
}

export async function dbUpdateOrderStatus(id: string, statut?: string, statutPaiement?: string): Promise<void> {
  const local = readLocalDb();
  const ord = local.orders.find((o) => o.id === id);
  if (ord) {
    if (statut) ord.statut = statut as any;
    if (statutPaiement) ord.statutPaiement = statutPaiement as any;
    writeLocalDb(local);
  }

  if (pool) {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      if (statut) { updates.push('statut = ?'); values.push(statut); }
      if (statutPaiement) { updates.push('statut_paiement = ?'); values.push(statutPaiement); }
      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
        console.log(`[MySQL] Statut commande mis à jour: ${id}`);
      }
    } catch (err) {
      console.error('[MySQL Error] dbUpdateOrderStatus:', err);
    }
  }
}

// ==========================================
// LOAD DATA FROM DATABASE ON STARTUP
// ==========================================

export async function dbLoadAll(): Promise<{
  users: User[];
  categories: Categorie[];
  products: Produit[];
  clients: Client[];
  orders: Commande[];
}> {
  // If MySQL is active, attempt to query from live database
  if (pool) {
    try {
      const [uRows]: any = await pool.query('SELECT * FROM users ORDER BY date_inscription DESC');
      const [cRows]: any = await pool.query('SELECT * FROM categories ORDER BY nom ASC');
      const [pRows]: any = await pool.query('SELECT * FROM products ORDER BY nom ASC');
      const [clRows]: any = await pool.query('SELECT * FROM clients');
      const [oRows]: any = await pool.query('SELECT * FROM orders ORDER BY date DESC');
      const [olRows]: any = await pool.query('SELECT * FROM order_lines');

      if (pRows && pRows.length > 0) {
        const users: User[] = uRows.map((r: any) => ({
          id: r.id,
          nom: r.nom,
          email: r.email,
          role: r.role,
          statut: r.statut,
          dateInscription: r.date_inscription,
          isEmailVerified: Boolean(r.is_email_verified),
        }));

        const categories: Categorie[] = cRows.map((r: any) => ({
          id: r.id,
          nom: r.nom,
          description: r.description,
          statut: r.statut,
          dateCreation: r.date_creation,
        }));

        const products: Produit[] = pRows.map((r: any) => ({
          id: r.id,
          nom: r.nom,
          marque: r.marque,
          modele: r.modele,
          categorieId: r.categorie_id,
          categorieNom: r.categorie_nom,
          prix: Number(r.prix),
          image: r.image,
          garantie: r.garantie,
          stock: Number(r.stock),
          disponibilite: r.disponibilite,
          description: r.description,
          caracteristiques: typeof r.caracteristiques === 'string' ? JSON.parse(r.caracteristiques) : (r.caracteristiques || []),
        }));

        const clients: Client[] = clRows.map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          nombreCommandes: Number(r.nombre_commandes),
          totalDepense: Number(r.total_depense),
          statut: r.statut,
          user: users.find((u) => u.id === r.user_id),
        }));

        const orders: Commande[] = oRows.map((r: any) => {
          const lines = olRows
            .filter((l: any) => l.commande_id === r.id)
            .map((l: any) => ({
              id: l.id,
              commandeId: l.commande_id,
              produitId: l.produit_id,
              quantite: Number(l.quantite),
              prixUnitaire: Number(l.prix_unitaire),
              prixTotal: Number(l.prix_total),
              produit: products.find((p) => p.id === l.produit_id),
            }));

          return {
            id: r.id,
            reference: r.reference,
            clientId: r.client_id,
            clientNom: r.client_nom,
            clientEmail: r.client_email,
            date: r.date,
            montantTotal: Number(r.montant_total),
            statut: r.statut,
            statutPaiement: r.statut_paiement,
            adresseLivraison: r.adresse_livraison,
            lignes: lines,
          };
        });

        console.log(`[MySQL] Données synchronisées depuis MySQL : ${products.length} produits, ${categories.length} catégories, ${users.length} utilisateurs.`);
        return { users, categories, products, clients, orders };
      }
    } catch (err) {
      console.error('[MySQL] Erreur lors du chargement des données depuis MySQL:', err);
    }
  }

  // Fallback to local persistent JSON database
  console.log('[DB] Chargement des données depuis le fichier persistant data/database.json...');
  return readLocalDb();
}

// ==========================================
// SQL QUERY RUNNER
// ==========================================

export async function dbExecuteSQL(sql: string): Promise<SqlQueryResult> {
  const start = Date.now();
  const cleanSql = sql.trim();

  if (!cleanSql) {
    return { success: false, sql, error: 'Requête SQL vide' };
  }

  if (pool) {
    try {
      const [results]: any = await pool.query(cleanSql);
      const executionTimeMs = Date.now() - start;

      if (Array.isArray(results)) {
        return {
          success: true,
          sql: cleanSql,
          rows: results,
          executionTimeMs,
        };
      } else {
        return {
          success: true,
          sql: cleanSql,
          affectedRows: results.affectedRows,
          executionTimeMs,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        sql: cleanSql,
        error: err.message || 'Erreur d\'exécution SQL sur MySQL',
        executionTimeMs: Date.now() - start,
      };
    }
  }

  // In local mode: basic parser for SELECT or simulate insertion
  const lower = cleanSql.toLowerCase();
  const local = readLocalDb();
  const executionTimeMs = Date.now() - start;

  if (lower.startsWith('select')) {
    if (lower.includes('from products')) return { success: true, sql: cleanSql, rows: local.products, executionTimeMs };
    if (lower.includes('from categories')) return { success: true, sql: cleanSql, rows: local.categories, executionTimeMs };
    if (lower.includes('from users')) return { success: true, sql: cleanSql, rows: local.users, executionTimeMs };
    if (lower.includes('from clients')) return { success: true, sql: cleanSql, rows: local.clients, executionTimeMs };
    if (lower.includes('from orders')) return { success: true, sql: cleanSql, rows: local.orders, executionTimeMs };
  }

  return {
    success: true,
    sql: cleanSql,
    rows: [{ message: 'Requête simulée avec succès sur le moteur de base de données local (Mode de stockage persistant actif).' }],
    executionTimeMs,
  };
}

// ==========================================
// TABLES OVERVIEW & STATS
// ==========================================

export async function dbGetTablesOverview(): Promise<DbOverview> {
  const local = readLocalDb();

  const tables: DbTableInfo[] = [
    {
      tableName: 'products',
      rowCount: local.products.length,
      columns: ['id', 'nom', 'marque', 'modele', 'categorie_id', 'prix', 'stock', 'disponibilite', 'garantie'],
      sampleRows: local.products.slice(0, 5),
    },
    {
      tableName: 'categories',
      rowCount: local.categories.length,
      columns: ['id', 'nom', 'description', 'statut', 'date_creation'],
      sampleRows: local.categories.slice(0, 5),
    },
    {
      tableName: 'users',
      rowCount: local.users.length,
      columns: ['id', 'nom', 'email', 'role', 'statut', 'date_inscription', 'is_email_verified'],
      sampleRows: local.users.slice(0, 5),
    },
    {
      tableName: 'clients',
      rowCount: local.clients.length,
      columns: ['id', 'user_id', 'nombre_commandes', 'total_depense', 'statut'],
      sampleRows: local.clients.slice(0, 5),
    },
    {
      tableName: 'orders',
      rowCount: local.orders.length,
      columns: ['id', 'reference', 'client_id', 'client_nom', 'date', 'montant_total', 'statut', 'statut_paiement'],
      sampleRows: local.orders.slice(0, 5),
    },
  ];

  const totalRecords = tables.reduce((sum, t) => sum + t.rowCount, 0);

  return {
    connected: isConnected,
    mode: isConnected ? 'mysql' : 'local-file',
    config: getDbConfig(),
    error: connectionError,
    totalRecords,
    tables,
  };
}

// ==========================================
// SEEDING BATCH DATA GENERATOR
// ==========================================

export const BATCH_DATA_PRESETS = {
  printers: [
    {
      nom: 'HP Color LaserJet Enterprise Flow MFP M776z (A3 Pro)',
      marque: 'HP',
      modele: 'Flow M776z',
      categorieId: 'cat-4',
      categorieNom: 'Imprimantes & Scanners',
      prix: 3499.00,
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
      garantie: '3 ans sur site J+1',
      stock: 6,
      disponibilite: 'En stock' as const,
      description: 'Multifonction laser couleur A3 ultra-performant pour les entreprises exigeantes avec chargeur recto-verso en une seule passe et écran tactile 9 pouces.',
      caracteristiques: ['Vitesse 46 ppm A4', 'Résolution 1200 x 1200 ppp', 'Chargeur 200 feuilles', 'Sécurité HP Sure Start'],
    },
    {
      nom: 'Canon imageRUNNER ADVANCE DX C3826i (Multifonction A3)',
      marque: 'Canon',
      modele: 'C3826i',
      categorieId: 'cat-4',
      categorieNom: 'Imprimantes & Scanners',
      prix: 3120.00,
      image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
      garantie: '2 ans constructeur',
      stock: 8,
      disponibilite: 'En stock' as const,
      description: 'Solution bureautique complète A3 avec numérisation cloud haute vitesse et finition agrafage.',
      caracteristiques: ['26 ppm couleur & N&B', 'Numérisation 150 ipm', 'Connectivité uniFLOW Online', 'Écran tactile 10.1 pouces'],
    },
    {
      nom: 'Epson WorkForce Enterprise WF-C21000 D4TW (100 ppm)',
      marque: 'Epson',
      modele: 'WF-C21000',
      categorieId: 'cat-4',
      categorieNom: 'Imprimantes & Scanners',
      prix: 4890.00,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      garantie: '3 ans garantie intégrale',
      stock: 4,
      disponibilite: 'En stock' as const,
      description: 'Imprimante multifonction professionnelle à technologie jet d\'encre Zéro Chaleur avec vitesse vertigineuse de 100 pages par minute.',
      caracteristiques: ['100 ppm recto-verso', 'Capacité 5 350 feuilles', 'Consommation électrique réduite de 85%', 'PostScript 3 natif'],
    },
  ],
  servers: [
    {
      nom: 'Serveur Rack Dell PowerEdge R750 2U (Dual Xeon Gold)',
      marque: 'Dell EMC',
      modele: 'PowerEdge R750',
      categorieId: 'cat-1',
      categorieNom: 'Composants',
      prix: 5290.00,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      garantie: '5 ans ProSupport Mission Critical',
      stock: 5,
      disponibilite: 'En stock' as const,
      description: 'Serveur biprocesseur rack 2U d\'entreprise optimisé pour la virtualisation, les bases de données SQL lourdes et le cloud privé.',
      caracteristiques: ['2x Intel Xeon Gold 6330', '128 Go RAM ECC DDR4', '8x 1.92 To NVMe SSD', 'Alimentation redondante Platinum 1400W'],
    },
    {
      nom: 'Switch Cisco Catalyst 9200L 48 Ports Gigabit PoE+ (4x 10G SFP+)',
      marque: 'Cisco',
      modele: 'C9200L-48P-4X',
      categorieId: 'cat-3',
      categorieNom: 'Réseaux & Câblage',
      prix: 2150.00,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      garantie: 'Garantie à vie limitée Cisco EoL',
      stock: 12,
      disponibilite: 'En stock' as const,
      description: 'Commutateur réseau manageable d\'entreprise avec PoE+ 740W pour bornes Wi-Fi 6 et caméras IP.',
      caracteristiques: ['48 Ports 10/100/1000 PoE+', '4 Uplinks 10G SFP+', 'Stacking matériel 80 Gbps', 'Cisco DNA Essentials'],
    },
  ],
  users: [
    {
      nom: 'Dr. Marc DUPONT',
      email: 'marc.dupont@clinique-paris.fr',
      role: 'Client' as const,
      statut: 'Actif' as const,
      dateInscription: new Date().toISOString().split('T')[0],
      isEmailVerified: true,
    },
    {
      nom: 'Sophie LEBLANC (Responsable SI)',
      email: 'sophie.leblanc@tech-innov.com',
      role: 'Client' as const,
      statut: 'Actif' as const,
      dateInscription: new Date().toISOString().split('T')[0],
      isEmailVerified: true,
    },
    {
      nom: 'Alexandre BERTRAND (Ingénieur Réseau)',
      email: 'alexandre.b@prosper-system.com',
      role: 'Vendeur' as const,
      statut: 'Actif' as const,
      dateInscription: new Date().toISOString().split('T')[0],
      isEmailVerified: true,
    },
  ],
};

export async function dbSeedBatch(type: 'printers' | 'servers' | 'users' | 'all'): Promise<number> {
  let count = 0;

  if (type === 'printers' || type === 'all') {
    for (const p of BATCH_DATA_PRESETS.printers) {
      const prod: Produit = {
        id: 'p-batch-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        ...p,
      };
      await dbInsertProduct(prod);
      count++;
    }
  }

  if (type === 'servers' || type === 'all') {
    for (const p of BATCH_DATA_PRESETS.servers) {
      const prod: Produit = {
        id: 'p-batch-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        ...p,
      };
      await dbInsertProduct(prod);
      count++;
    }
  }

  if (type === 'users' || type === 'all') {
    for (const u of BATCH_DATA_PRESETS.users) {
      const user: User = {
        id: 'u-batch-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        ...u,
      };
      await dbInsertUser(user);
      count++;
    }
  }

  return count;
}

export async function dbResetDatabase(): Promise<void> {
  const initial = {
    users: [...MOCK_USERS],
    categories: [...MOCK_CATEGORIES],
    products: [...MOCK_PRODUCTS],
    clients: [...MOCK_CLIENTS],
    orders: [...MOCK_ORDERS],
  };

  writeLocalDb(initial);

  if (pool) {
    try {
      await pool.query('DELETE FROM order_lines');
      await pool.query('DELETE FROM orders');
      await pool.query('DELETE FROM clients');
      await pool.query('DELETE FROM products');
      await pool.query('DELETE FROM categories');
      await pool.query('DELETE FROM users');

      await createSchemaAndSeed();
      console.log('[MySQL] Base de données réinitialisée et réensemencée avec succès !');
    } catch (err) {
      console.error('[MySQL] Erreur lors de la réinitialisation de la BDD:', err);
    }
  }
}
