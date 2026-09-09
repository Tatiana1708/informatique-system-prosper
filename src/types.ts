export type Role = 'Admin' | 'Vendeur' | 'Client';

export type UserStatus = 'Actif' | 'Suspendu' | 'Inactif';

export interface User {
  id: string;
  nom: string;
  email: string;
  motDePasseHash?: string;
  role: Role;
  statut: UserStatus;
  dateInscription: string;
  isEmailVerified?: boolean;
}

export interface Client {
  id: string;
  userId: string;
  nombreCommandes: number;
  totalDepense: number;
  statut: string;
  user?: User;
}

export interface Categorie {
  id: string;
  nom: string;
  description: string;
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
  nombreProduits?: number;
}

export interface Produit {
  id: string;
  nom: string;
  marque: string;
  modele: string;
  categorieId: string;
  prix: number;
  image: string;
  garantie: string;
  stock: number;
  disponibilite: 'En stock' | 'Sur commande' | 'Rupture de stock';
  description: string;
  caracteristiques?: string[];
  categorieNom?: string;
}

export type OrderStatus = 'En attente' | 'En cours' | 'Expédiée' | 'Livrée' | 'Annulée';
export type PaymentStatus = 'Payé' | 'En attente' | 'Remboursé' | 'Échoué';

export interface LigneCommande {
  id: string;
  commandeId: string;
  produitId: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  produit?: Produit;
}

export interface Commande {
  id: string;
  reference: string;
  clientId: string;
  clientNom?: string;
  clientEmail?: string;
  date: string;
  montantTotal: number;
  statut: OrderStatus;
  statutPaiement: PaymentStatus;
  lignes: LigneCommande[];
  adresseLivraison?: string;
}

export interface CartItem {
  produit: Produit;
  quantite: number;
}

export interface SectionContent {
  titre: string;
  contenu: string;
}

export interface DocumentInfo {
  id: string;
  titre: string;
  description: string;
  sections: SectionContent[];
}

export interface DashboardStats {
  totalUtilisateurs: number;
  totalProduits: number;
  totalCommandes: number;
  chiffreAffairesTotal: number;
  totalCategories: number;
  totalClients: number;
}

export interface DbTableInfo {
  tableName: string;
  rowCount: number;
  columns: string[];
  sampleRows: any[];
}

export interface DbOverview {
  connected: boolean;
  mode: 'mysql' | 'in-memory' | 'local-file';
  config: {
    host: string;
    port: number;
    user: string;
    database: string;
  };
  error?: string;
  totalRecords: number;
  tables: DbTableInfo[];
}

export interface SqlQueryResult {
  success: boolean;
  sql: string;
  rows?: any[];
  affectedRows?: number;
  executionTimeMs?: number;
  error?: string;
}
