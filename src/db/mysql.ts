import mysql from 'mysql2/promise';
import {
  MOCK_CATEGORIES,
  MOCK_CLIENTS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_USERS,
} from '../data/mockData.js';
import { Categorie, Client, Commande, Produit, User } from '../types.js';

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
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'informatique_system_prosper',
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
      date_inscription VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

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

  const [catRows]: any = await pool.query('SELECT COUNT(*) as count FROM categories');
  if (catRows[0].count === 0) {
    console.log('[MySQL] Seeding initial categories...');
    for (const c of MOCK_CATEGORIES) {
      await pool.query(
        'INSERT INTO categories (id, nom, description, statut, date_creation) VALUES (?, ?, ?, ?, ?)',
        [c.id, c.nom, c.description, c.statut, c.dateCreation]
      );
    }
  }

  const [prodRows]: any = await pool.query('SELECT COUNT(*) as count FROM products');
  if (prodRows[0].count === 0) {
    console.log('[MySQL] Seeding initial products...');
    for (const p of MOCK_PRODUCTS) {
      await pool.query(
        'INSERT INTO products (id, nom, marque, modele, categorie_id, categorie_nom, prix, image, garantie, stock, disponibilite, description, caracteristiques) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
