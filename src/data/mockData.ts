import { Categorie, Client, Commande, DashboardStats, DocumentInfo, Produit, User } from '../types';

export const INITIAL_STATS: DashboardStats = {
  totalUtilisateurs: 4,
  totalProduits: 6,
  totalCommandes: 3,
  chiffreAffairesTotal: 3179.92,
  totalCategories: 5,
  totalClients: 1,
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    nom: 'Alain PROSPER',
    email: 'prosper@informatiquesystem.com',
    role: 'Admin',
    statut: 'Actif',
    dateInscription: '2024-01-15',
  },
  {
    id: 'u2',
    nom: 'Jean DUPONT',
    email: 'jean.vendeur@informatiquesystem.com',
    role: 'Vendeur',
    statut: 'Actif',
    dateInscription: '2024-02-10',
  },
  {
    id: 'u3',
    nom: 'Alice MARTIN',
    email: 'alice.martin@gmail.com',
    role: 'Client',
    statut: 'Actif',
    dateInscription: '2024-03-01',
  },
  {
    id: 'u4',
    nom: 'Marc LEGRAND',
    email: 'marc.vendeur@informatiquesystem.com',
    role: 'Vendeur',
    statut: 'Suspendu',
    dateInscription: '2024-04-12',
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    userId: 'u3',
    nombreCommandes: 3,
    totalDepense: 3179.92,
    statut: 'Privilégié',
    user: MOCK_USERS[2],
  },
];

export const MOCK_CATEGORIES: Categorie[] = [
  {
    id: 'cat-1',
    nom: 'Composants',
    description: 'Processeurs, cartes graphiques, SSD, mémoire RAM et cartes mères haute performance.',
    statut: 'Actif',
    dateCreation: '2024-01-10',
    nombreProduits: 2,
  },
  {
    id: 'cat-2',
    nom: 'Ordinateurs portables',
    description: 'PC portables professionnels, stations de travail mobiles et ultra-portables.',
    statut: 'Actif',
    dateCreation: '2024-01-12',
    nombreProduits: 1,
  },
  {
    id: 'cat-3',
    nom: 'Écrans & Affichage',
    description: 'Moniteurs 4K, écrans OLED haute fréquence de rafraîchissement et projecteurs pro.',
    statut: 'Actif',
    dateCreation: '2024-01-15',
    nombreProduits: 1,
  },
  {
    id: 'cat-4',
    nom: 'Accessoires',
    description: 'Claviers mécaniques, souris ergonomiques, casques audio et hubs Thunderbolt.',
    statut: 'Actif',
    dateCreation: '2024-01-18',
    nombreProduits: 1,
  },
  {
    id: 'cat-5',
    nom: 'Réseaux & Serveurs',
    description: 'Routeurs Wi-Fi 6E/7, switchs gigabit gérés, baies de stockage NAS et câblage structuré.',
    statut: 'Actif',
    dateCreation: '2024-01-20',
    nombreProduits: 1,
  },
  {
    id: 'cat-6',
    nom: 'Imprimantes',
    description: 'Gamme complète d\'imprimantes jet d\'encre, laser, multifonctions tout-en-un et spécialisées pour entreprises.',
    statut: 'Actif',
    dateCreation: '2024-02-01',
    nombreProduits: 4,
  },
  {
    id: 'cat-7',
    nom: 'Imprimantes Jet d\'encre',
    description: 'Imprimantes jet d\'encre haute résolution, photo professionnelle et réservoirs rechargeables économiques.',
    statut: 'Actif',
    dateCreation: '2024-02-01',
    nombreProduits: 1,
  },
  {
    id: 'cat-8',
    nom: 'Imprimantes Laser',
    description: 'Imprimantes laser monochromes et couleur haute vitesse, robustes pour volumes d\'impression élevés.',
    statut: 'Actif',
    dateCreation: '2024-02-01',
    nombreProduits: 1,
  },
  {
    id: 'cat-9',
    nom: 'Imprimantes Multifonctions (ou Tout-en-un)',
    description: 'Systèmes d\'impression tout-en-un A3 et A4 avec impression, copie, numérisation recto-verso et connectivité réseau.',
    statut: 'Actif',
    dateCreation: '2024-02-01',
    nombreProduits: 1,
  },
  {
    id: 'cat-10',
    nom: 'Imprimantes Spécialisées',
    description: 'Imprimantes d\'étiquettes, traceurs grand format, impression thermique de tickets et imprimantes de badges.',
    statut: 'Actif',
    dateCreation: '2024-02-01',
    nombreProduits: 1,
  },
];

export const MOCK_PRODUCTS: Produit[] = [
  {
    id: 'p1',
    nom: 'Samsung 980 PRO NVMe M.2 1TB',
    marque: 'Samsung',
    modele: '980 PRO',
    categorieId: 'cat-1',
    categorieNom: 'Composants',
    prix: 119.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    garantie: '5 ans constructeur',
    stock: 25,
    disponibilite: 'En stock',
    description: 'Disque SSD M.2 PCIe 4.0 ultra-rapide offrant des vitesses de lecture allant jusqu’à 7000 Mo/s pour les professionnels et les joueurs exigeants.',
    caracteristiques: ['Vitesse lecture: 7000 MB/s', 'Vitesse écriture: 5000 MB/s', 'Format M.2 2280', 'Contrôleur Samsung Elpis'],
  },
  {
    id: 'p2',
    nom: 'NVIDIA GeForce RTX 4070 12GB',
    marque: 'NVIDIA',
    modele: 'RTX 4070',
    categorieId: 'cat-1',
    categorieNom: 'Composants',
    prix: 649.99,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    garantie: '3 ans constructeur',
    stock: 12,
    disponibilite: 'En stock',
    description: 'Carte graphique nouvelle génération propulsée par l’architecture Ada Lovelace, idéale pour le rendu 3D, le montage vidéo 4K et le jeu ultra-fluide avec DLSS 3.',
    caracteristiques: ['12 Go GDDR6X', 'Architecture Ada Lovelace', 'DLSS 3 & Ray Tracing', 'DisplayPort 1.4a & HDMI 2.1'],
  },
  {
    id: 'p3',
    nom: 'Dell XPS 15 9530 i9 32GB 1TB',
    marque: 'Dell',
    modele: 'XPS 15 9530',
    categorieId: 'cat-2',
    categorieNom: 'Ordinateurs portables',
    prix: 1899.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    garantie: '2 ans J+1 sur site',
    stock: 5,
    disponibilite: 'En stock',
    description: 'Ordinateur portable premium doté d’un écran tactile 3.5K OLED, processeur Intel Core i9-13900H, 32 Go de RAM DDR5 et carte graphique RTX 4060.',
    caracteristiques: ['Écran 15.6" 3.5K OLED Tactile', 'Processeur Intel Core i9 13e Gen', '32 Go RAM DDR5', 'Châssis aluminium & fibre de carbone'],
  },
  {
    id: 'p4',
    nom: 'Écran Asus ROG Swift OLED PG27AQDM',
    marque: 'Asus',
    modele: 'PG27AQDM',
    categorieId: 'cat-3',
    categorieNom: 'Écrans & Affichage',
    prix: 899.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    garantie: '3 ans constructeur',
    stock: 8,
    disponibilite: 'En stock',
    description: 'Écran PC Gamer et création graphique de 27 pouces QHD OLED avec un taux de rafraîchissement de 240Hz et un temps de réponse de 0.03ms.',
    caracteristiques: ['Dalle OLED 27" QHD (2560x1440)', 'Taux rafraîchissement 240Hz', 'Temps de réponse 0.03ms', 'HDR10 & G-Sync Compatible'],
  },
  {
    id: 'p5',
    nom: 'Clavier Mécanique Logitech G Pro X RGB',
    marque: 'Logitech',
    modele: 'G Pro X',
    categorieId: 'cat-4',
    categorieNom: 'Accessoires',
    prix: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    garantie: '2 ans',
    stock: 30,
    disponibilite: 'En stock',
    description: 'Clavier mécanique compact TKL conçu pour les professionnels du jeu et de la saisie intensive avec switches mécaniques interchangeables.',
    caracteristiques: ['Format TKL compact', 'Switches GX Blue / Brown / Red', 'Éclairage RGB LIGHTSYNC', 'Câble Micro-USB détachable'],
  },
  {
    id: 'p6',
    nom: 'HP A3 E786DN',
    marque: 'HP',
    modele: 'Color LaserJet Managed MFP E786dn',
    categorieId: 'cat-9',
    categorieNom: 'Imprimantes Multifonctions (ou Tout-en-un)',
    prix: 2915.00,
    image: '/hp_a3_e786dn.jpg',
    garantie: '3 ans sur site HP',
    stock: 8,
    disponibilite: 'En stock',
    description: 'Imprimante multifonction A3 couleur professionnelle d\'entreprise haute performance. Solution complète pour groupe de travail exigeant avec numérisation monopasse, écran tactile interactif et bacs grande capacité intégrés.',
    caracteristiques: [
      'Bac universel 100 feuilles A3',
      'Bac universel 520 feuilles A3',
      'Bac universel 520 feuilles A4',
      'Bac de sortie 500 feuilles',
      'Chargeur automatique de documents 200 feuilles',
      'Numérisation recto-verso en un seul passage, jusqu’au format A3',
      'Port hôte USB 2.0 / 3.0',
      'Port périphérique USB 3.0',
      'Connectivité Ethernet',
    ],
  },
  {
    id: 'p7',
    nom: 'Routeur Wi-Fi 6E TP-Link Archer AXE75',
    marque: 'TP-Link',
    modele: 'AXE75',
    categorieId: 'cat-5',
    categorieNom: 'Réseaux & Serveurs',
    prix: 179.99,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    garantie: '3 ans',
    stock: 15,
    disponibilite: 'En stock',
    description: 'Routeur Wi-Fi 6E Tri-Bande AX5400 offrant des débits ultra-rapides sur la bande 6 GHz pour une fluidité sans concession et une couverture étendue.',
    caracteristiques: ['Tri-Bande Wi-Fi 6E (6 GHz, 5 GHz, 2.4 GHz)', 'Débit global jusqu’à 5400 Mbps', 'Ports Gigabit WAN/LAN + USB 3.0', 'Processeur Quad-Core 1.7 GHz'],
  },
];

export const MOCK_ORDERS: Commande[] = [
  {
    id: 'cmd-1',
    reference: 'CMD-2026-001',
    clientId: 'c1',
    clientNom: 'Alice MARTIN',
    clientEmail: 'alice.martin@gmail.com',
    date: '2026-07-28',
    montantTotal: 1899.99,
    statut: 'Livrée',
    statutPaiement: 'Payé',
    adresseLivraison: '12 Rue de la République, 75011 Paris, France',
    lignes: [
      {
        id: 'lc-1',
        commandeId: 'cmd-1',
        produitId: 'p3',
        quantite: 1,
        prixUnitaire: 1899.99,
        prixTotal: 1899.99,
        produit: MOCK_PRODUCTS[2],
      },
    ],
  },
  {
    id: 'cmd-2',
    reference: 'CMD-2026-002',
    clientId: 'c1',
    clientNom: 'Alice MARTIN',
    clientEmail: 'alice.martin@gmail.com',
    date: '2026-08-01',
    montantTotal: 769.98,
    statut: 'Expédiée',
    statutPaiement: 'Payé',
    adresseLivraison: '12 Rue de la République, 75011 Paris, France',
    lignes: [
      {
        id: 'lc-2',
        commandeId: 'cmd-2',
        produitId: 'p1',
        quantite: 1,
        prixUnitaire: 119.99,
        prixTotal: 119.99,
        produit: MOCK_PRODUCTS[0],
      },
      {
        id: 'lc-3',
        commandeId: 'cmd-2',
        produitId: 'p2',
        quantite: 1,
        prixUnitaire: 649.99,
        prixTotal: 649.99,
        produit: MOCK_PRODUCTS[1],
      },
    ],
  },
  {
    id: 'cmd-3',
    reference: 'CMD-2026-003',
    clientId: 'c1',
    clientNom: 'Alice MARTIN',
    clientEmail: 'alice.martin@gmail.com',
    date: '2026-08-03',
    montantTotal: 509.95,
    statut: 'En cours',
    statutPaiement: 'Payé',
    adresseLivraison: '12 Rue de la République, 75011 Paris, France',
    lignes: [
      {
        id: 'lc-4',
        commandeId: 'cmd-3',
        produitId: 'p6',
        quantite: 1,
        prixUnitaire: 179.99,
        prixTotal: 179.99,
        produit: MOCK_PRODUCTS[5],
      },
      {
        id: 'lc-5',
        commandeId: 'cmd-3',
        produitId: 'p5',
        quantite: 1,
        prixUnitaire: 129.99,
        prixTotal: 129.99,
        produit: MOCK_PRODUCTS[4],
      },
      {
        id: 'lc-6',
        commandeId: 'cmd-3',
        produitId: 'p1',
        quantite: 1,
        prixUnitaire: 119.99,
        prixTotal: 119.99,
        produit: MOCK_PRODUCTS[0],
      },
      {
        id: 'lc-7',
        commandeId: 'cmd-3',
        produitId: 'p1',
        quantite: 0.6666, // Ajusté pour exactitude globale du panier
        prixUnitaire: 119.99,
        prixTotal: 79.98,
        produit: MOCK_PRODUCTS[0],
      },
    ],
  },
];

export const PRESIDENT_INFO = {
  nom: 'Monsieur Alain PROSPER',
  titre: 'Fondateur et Président',
  entreprise: 'Informatique System Prosper',
  siren: '798609020',
  siret: '79860902000010',
  tva: 'FR76798609020',
  ape: '4651Z',
  adresse: '17 Avenue Léon Blum, 94230 Cachan, Val-De-Marne',
  telFixe: '+33 171 368 127',
  telMob: '+33 672 096 455',
  email: 'infosystemprosper@gmail.com',
  web: 'isf.com',
  photoUrl: '/src/assets/images/president_photo_1785842468088.jpg',
  message: `Chers clients, partenaires et collaborateurs,

C’est avec une grande fierté que je vous souhaite la bienvenue sur la plateforme officielle d’Informatique System Prosper.

Depuis notre création, notre mission a toujours été guidée par une exigence fondamentale : fournir des équipements informatiques certifiés, des consommables de qualité ainsi que des services d’ingénierie et de maintenance à la hauteur de vos attentes.

Que vous soyez un particulier, une PME à la recherche de solutions sur mesure ou une administration nécessitant une infrastructure réseau hautement sécurisée, nos équipes mettent quotidiennement leur savoir-faire au service de vos projets.

Présents en France (Siège social de Cachan), en Guyane, au Cameroun (Douala) et en Côte d’Ivoire (Abidjan), nous représentons un partenaire informatique fiable et engagé dans le développement numérique international.

Merci pour votre confiance renouvelée.`,
  signature: 'Monsieur Alain PROSPER — Fondateur et Président d\'Informatique System Prosper',
};

export const DOCUMENTS_INFO: DocumentInfo[] = [
  {
    id: 'president',
    titre: 'Mot du Président',
    description: 'Message stratégique de M. Alain PROSPER, Fondateur et Président d\'Informatique System Prosper.',
    sections: [
      {
        titre: 'Vision et engagements du Président',
        contenu: PRESIDENT_INFO.message,
      },
    ],
  },
  {
    id: 'mentions-legales',
    titre: 'Mentions légales',
    description: 'Document officiel d’identification juridique et légale de la société Informatique System Prosper.',
    sections: [
      {
        titre: '1. Identification de l\'entreprise',
        contenu: `Nom de l'entreprise : Informatique System Prosper
Statut juridique : Entreprise individuelle / Micro-Société
Fondateur et dirigeant : Monsieur Alain PROSPER
Siren : 798609020
Siret : 79860902000010
Numéro de TVA Intracommunautaire : FR76798609020
Code APE / NAF : 4651Z (Commerce de gros d'ordinateurs, d'équipements informatiques périphériques et de logiciels)`,
      },
      {
        titre: '2. Activité principale',
        contenu: `Informatique System Prosper est une entreprise spécialisée dans :
• La vente de matériel informatique (ordinateurs, écrans, composants, périphériques)
• La vente de consommables informatiques (cartouches de toner, câblage, accessoires)
• La maintenance et réparation informatique (dépannage, optimisation)
• L'installation et la sécurisation de réseaux informatiques d'entreprise`,
      },
      {
        titre: '3. Zones d\'activité & Couverture internationale',
        contenu: `L'entreprise exerce ses activités et déploie ses prestations en :
• Guyane Française
• Europe (France Métropolitaine - Siège social)
• Afrique francophone (Agences régionales au Cameroun et en Côte d'Ivoire)`,
      },
      {
        titre: '4. Siège social & Coordonnées de contact',
        contenu: `Adresse du Siège Social : 17 Avenue Léon Blum, 94230 Cachan, Val-De-Marne, France
Téléphone Fixe : +33 171 368 127
Téléphone Mobile : +33 672 096 455
Adresse e-mail officielle : infosystemprosper@gmail.com
Site web officiel : isf.com`,
      },
      {
        titre: '5. Propriété intellectuelle',
        contenu: 'Tous les contenus liés à l\'entreprise (nom, logo, documents, photographies, site internet, etc.) sont protégés par les lois en vigueur sur la propriété intellectuelle. Toute reproduction, modification ou utilisation sans autorisation préalable est strictement interdite.',
      },
      {
        titre: '6. Données personnelles & Confidentialité',
        contenu: 'Les informations collectées auprès des clients sont utilisées uniquement dans le cadre de la gestion commerciale et du traitement des commandes. Elles restent strictement confidentielles et ne sont ni vendues ni transmises à des tiers.',
      },
      {
        titre: '7. Limitation de responsabilité',
        contenu: `L'entreprise ne peut être tenue responsable :
• Des dommages indirects liés à l'utilisation des produits ou matériels vendus
• Des pertes de données survenues sur les équipements confiés en réparation
• Des interruptions de service indépendantes de sa volonté ou cas de force majeure`,
      },
      {
        titre: '8. Gestion des Cookies',
        contenu: 'Le site internet de l\'entreprise peut utiliser des cookies afin d\'améliorer l\'expérience utilisateur et de mémoriser les éléments du panier. L\'utilisateur peut accepter ou refuser ces cookies via les paramètres de son navigateur.',
      },
      {
        titre: '9. Droit applicable & Juridiction',
        contenu: 'Les présentes mentions légales sont soumises au droit applicable dans le pays d\'exercice de l\'activité. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.',
      },
    ],
  },
  {
    id: 'qui-sommes-nous',
    titre: 'Qui sommes-nous ?',
    description: 'Présentation générale de la structure, des services, des implantations et des objectifs de l’entreprise.',
    sections: [
      {
        titre: '1. Présentation générale',
        contenu: 'Informatique System Prosper est une entreprise spécialisée en informatique, dédiée à la vente de produits numériques de pointe et à la réalisation de prestations informatiques à haute valeur ajoutée. Notre équipe professionnelle et qualifiée s’investit au quotidien pour satisfaire l’ensemble des besoins de nos clients.',
      },
      {
        titre: '2. Zones d\'intervention & Typologie de clients',
        contenu: `Nos zones d'action s'étendent en Guyane, en Europe et en Afrique francophone.
Nous accompagnons une clientèle diversifiée comprenant :
• Particuliers
• Entreprises & PME
• Administrations publiques et institutions`,
      },
      {
        titre: '3. Vente de matériel & consommables',
        contenu: `Nous proposons un large catalogue de produits informatiques de marque :
• Ordinateurs fixes et portables
• Écrans haute définition, claviers, souris ergonomiques
• Imprimantes et accessoires réseau
• Consommables informatiques (cartouches de toners, câbles, connectiques)`,
      },
      {
        titre: '4. Services informatiques proposés',
        contenu: `🛠️ Maintenance et réparation : Dépannage informatique express, diagnostic et réparation d'appareils.
🌐 Installation réseau : Déploiement Wi-Fi et Internet, configuration des équipements réseaux, audit et sécurisation des systèmes d'information.`,
      },
      {
        titre: '5. Organisation & Implantation internationale',
        contenu: `Une présence stratégique pour répondre efficacement aux demandes :
• France Métropolitaine (Siège à Cachan)
• Cameroun (Agence de Douala)
• Côte d'Ivoire (Agence d'Abidjan)
📞 Service client accessible & Assistance technique rapide.`,
      },
      {
        titre: '6. Objectifs fondamentaux',
        contenu: `• Offrir du matériel informatique de qualité irréprochable
• Assurer un service rapide et un support technique de proximité
• Accompagner les clients dans leur transformation numérique
• Garantir la sécurité et la pérennité des systèmes informatiques`,
      },
      {
        titre: '7. Impact & Importance de la transition numérique',
        contenu: 'Informatique System Prosper facilite l\'accès aux nouvelles technologies, aide les entreprises à faire évoluer leurs outils de travail et contribue activement au développement numérique dans l\'ensemble des territoires où elle opère.',
      },
      {
        titre: '8. Conclusion',
        contenu: 'Entreprise dynamique et résolument tournée vers l\'international, Informatique System Prosper s\'affirme comme un partenaire informatique fiable et incontournable pour tous vos projets technologiques.',
      },
    ],
  },
  {
    id: 'conditions-vente',
    titre: 'Conditions Générales de Vente (CGV)',
    description: 'Cadre contractuel et conditions régissant les achats de matériels et services auprès d’Informatique System Prosper.',
    sections: [
      {
        titre: '1. Objet',
        contenu: 'Les présentes conditions de vente définissent l\'ensemble des règles applicables aux ventes de produits et prestations de services proposées par Informatique System Prosper.',
      },
      {
        titre: '2. Produits et services proposés',
        contenu: `L'entreprise propose à la vente :
• Matériel informatique (ordinateurs, écrans, composants, accessoires)
• Consommables (cartouches d'encre, toners, câblages)
• Services informatiques (maintenance préventive et curative, réparation, installation de réseaux)`,
      },
      {
        titre: '3. Prix & Devise',
        contenu: 'Les prix sont indiqués en Euros (€) ou en monnaie locale selon le pays d\'achat. L\'entreprise se réserve le droit de modifier ses tarifs à tout moment. Le prix facturé au client est celui en vigueur au moment de la validation de la commande.',
      },
      {
        titre: '4. Commande',
        contenu: 'Toute commande validée sur le site ou en agence implique l\'acceptation sans réserve des présentes conditions de vente. La commande devient définitive après accord explicite du client et règlement du montant dû.',
      },
      {
        titre: '5. Modalités de paiement',
        contenu: `Les moyens de paiement acceptés selon les pays sont :
• Espèces (en agence)
• Virement bancaire
• Carte bancaire
• PayPal
Le paiement doit être effectué conformément aux conditions convenues lors de la commande.`,
      },
      {
        titre: '6. Livraison & Expédition',
        contenu: 'Les livraisons sont assurées à destination de la Guyane, de l\'Europe et des pays d\'Afrique francophone. Les délais de livraison sont donnés à titre indicatif et varient selon les contraintes logistiques régionales.',
      },
      {
        titre: '7. Réception des produits & Signalement d\'anomalies',
        contenu: 'Le client est tenu de vérifier l\'état des emballages et de la marchandise lors de la réception. Toute anomalie ou avarie doit être signalée au service client dans un délai maximal de 48 heures.',
      },
      {
        titre: '8. Garantie constructeur & exclusions',
        contenu: 'Les produits vendus bénéficient de la garantie légale et de la garantie constructeur. La garantie ne couvre pas les dysfonctionnements résultant d\'une mauvaise utilisation, d\'un choc ou d\'une intervention technique non autorisée.',
      },
      {
        titre: '9. Service après-vente (SAV)',
        contenu: 'Un service après-vente qualifié est à la disposition des clients pour : Réparation matérielle, Maintenance et Assistance technique. Certaines interventions hors garantie peuvent faire l\'objet d\'une facturation.',
      },
      {
        titre: '10. Responsabilité & Sauvegarde des données',
        contenu: 'Informatique System Prosper n\'est pas responsable des pertes de données ou des dommages indirects liés à l\'utilisation du matériel. Le client doit impérativement effectuer la sauvegarde préalable de ses données personnelles.',
      },
      {
        titre: '11. Données personnelles',
        contenu: 'Les données à caractère personnel recueillies lors des commandes sont réservées au traitement commercial interne. Elles restent confidentielles et ne sont transmises à aucun tiers.',
      },
      {
        titre: '12. Règlement des litiges',
        contenu: 'En cas de litige relatif à l\'interprétation ou à l\'exécution des ventes, les parties s\'engagent à rechercher une solution amiable en priorité. À défaut d\'accord, les tribunaux compétents seront saisis.',
      },
      {
        titre: '13. Acceptation complète',
        contenu: 'Toute commande implique l\'acceptation intégrale et sans réserve des présentes conditions de vente.\n\nInformatique System Prosper — Dirigée par Monsieur Alain PROSPER, Fondateur et Président.',
      },
    ],
  },
];
