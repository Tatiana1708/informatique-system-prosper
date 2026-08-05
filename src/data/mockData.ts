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
    nom: 'Prosper METENDE',
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
  nom: 'Prosper METENDE',
  titre: 'Président-Fondateur',
  entreprise: 'Informatique System Prosper',
  photoUrl: '/src/assets/images/president_photo_1785842468088.jpg',
  message: `Chers clients, partenaires et collaborateurs,

C’est avec une immense fierté que je vous souhaite la bienvenue sur la plateforme officielle d’Informatique System Prosper.

Depuis notre création, notre mission a toujours été guidée par une exigence fondamentale : offrir le meilleur de la technologie informatique combiné à une qualité de service irréprochable. Que vous soyez une entreprise à la recherche d’équipements haute performance, un professionnel nécessitant une infrastructure réseau sécurisée ou un particulier passionné par le matériel informatique de pointe, nous mettons tout notre savoir-faire au service de vos projets.

Présents en France métropolitaine, en Guyane, au Cameroun (Douala) et en Côte d’Ivoire (Abidjan), nous incarnons un pont technologique solide entre le continent européen et le continent africain. Nos équipes d’ingénieurs, de techniciens et de conseillers s’engagent chaque jour à garantir la fiabilité de vos systèmes d’information et la réactivité de nos interventions.

Dans un monde en constante mutation numérique, Informatique System Prosper continue d'investir dans l'innovation, l'éco-responsabilité et la formation de nos talents pour vous accompagner vers l’excellence technologique.

Merci de votre confiance renouvelée.`,
  signature: 'Prosper METENDE — Président d\'Informatique System Prosper',
};

export const DOCUMENTS_INFO: DocumentInfo[] = [
  {
    id: 'president',
    titre: 'Mot du Président',
    description: 'Message stratégique de M. Prosper METENDE, Président-Fondateur d\'Informatique System Prosper.',
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
    description: 'Document légal encadrant les activités et l’immatriculation de l’entreprise.',
    sections: [
      {
        titre: '1. Identification de l\'Éditeur',
        contenu: 'Le site web "Informatique System Prosper" est édité par la société Informatique System Prosper SAS, au capital social de 100 000 €, immatriculée au Registre du Commerce et des Sociétés sous le numéro RCS Nanterre B 892 410 321.',
      },
      {
        titre: '2. Activité professionnelle & Agréments',
        contenu: 'Informatique System Prosper est spécialisée dans le commerce de détail et de gros de matériels informatiques, la maintenance des équipements, l’installation d’infrastructures réseaux d’entreprise et le conseil en architectures informatiques.',
      },
      {
        titre: '3. Zones d\'Intervention & Filiales',
        contenu: 'L\'entreprise déploie ses services en France Métropolitaine, en Guyane Française, au Cameroun (Agence régionale de Douala) et en Côte d\'Ivoire (Agence régionale d\'Abidjan).',
      },
      {
        titre: '4. Siège Social & Coordonnées',
        contenu: 'Siège Social : 17 Avenue Leon Blum, 94230 Cachan, France.\nTéléphone : +33 (0)1 45 46 88 00\nCourriel : contact@informatiquesystem.com\nDirecteur de la publication : Prosper METENDE.',
      },
      {
        titre: '5. Propriété Intellectuelle',
        contenu: 'L’ensemble des contenus présents sur la plateforme (textes, logos, visuels, photographies, éléments graphiques et architecture logicielle) est protégé par les lois internationales relatives à la propriété intellectuelle.',
      },
      {
        titre: '6. Données Personnelles & RGPD',
        contenu: 'Informatique System Prosper s’engage à protéger vos données à caractère personnel conformément au Règlement Général sur la Protection des Données (RGPD 2016/679). Vous disposez d’un droit d’accès, de rectification et de suppression.',
      },
      {
        titre: '7. Limitation de Responsabilité',
        contenu: 'Informatique System Prosper s’efforce d’assurer la précision des informations diffusées mais ne saurait être tenue responsable des interruptions temporaires du service ou de variations de stocks fournisseurs.',
      },
      {
        titre: '8. Gestion des Cookies',
        contenu: 'Des cookies techniques et d’audience sont utilisés pour vous offrir une navigation optimale et mémoriser votre panier ainsi que vos préférences de connexion.',
      },
      {
        titre: '9. Droit Applicable & Juridiction',
        contenu: 'Les présentes mentions sont régies par le droit français. En cas de litige, les tribunaux compétents du ressort du siège social seront seuls habilités.',
      },
    ],
  },
  {
    id: 'qui-sommes-nous',
    titre: 'Qui sommes-nous ?',
    description: 'Présentation complète de nos valeurs, de nos agences et de notre mission internationale.',
    sections: [
      {
        titre: '1. Présentation Générale',
        contenu: 'Informatique System Prosper est un acteur majeur des solutions informatiques globales pour entreprises et particuliers, combinant distribution de matériel, infogérance et intégration système.',
      },
      {
        titre: '2. Zones Géographiques & Présence Internationale',
        contenu: 'Afin d’assurer une proximité sans égale avec nos clients, nous opérons activement en France (Siège Cachan), en Guyane, au Cameroun (Douala) et en Côte d’Ivoire (Abidjan).',
      },
      {
        titre: '3. Vente de Matériel Informatique de Pointe',
        contenu: 'Nous distribuons les plus grandes marques mondiales (Samsung, NVIDIA, Dell, Asus, HP, TP-Link, Cisco) garantissant authenticité, performance et garantie constructeur étendue.',
      },
      {
        titre: '4. Services de Maintenance & Réparation Express',
        contenu: 'Nos ateliers certifiés et techniciens itinérants assurent la maintenance préventive et curative de vos parcs informatiques sous un contrat d\'intervention garanti sous 4 heures.',
      },
      {
        titre: '5. Organisation Interne & Équipes Experts',
        contenu: 'Notre structure s’articule autour de pôles spécialisés : pôle commercial, ingénierie système et réseau, service après-vente (SAV) et logistique internationale.',
      },
      {
        titre: '6. Nos Objectifs Stratégiques',
        contenu: 'Rendre accessibles les technologies informatiques les plus avancées tout en réduisant l’empreinte carbone à travers la revalorisation du matériel et la durabilité des équipements.',
      },
      {
        titre: '7. Importance de la Transition Numérique',
        contenu: 'Nous accompagnons la transformation digitale des PME et grandes institutions en leur apportant des outils réseaux fiables, sécurisés et évolutifs.',
      },
      {
        titre: '8. Engagements Qualité & Satisfaction Client',
        contenu: 'Chaque commande bénéficie d’un contrôle rigoureux avant expédition, d’une traçabilité de livraison complète et d’une assistance téléphonique dédiée.',
      },
      {
        titre: '9. Conclusion & Perspectives d\'Avenir',
        contenu: 'Informatique System Prosper ambitionne d’étendre son réseau de distribution et d’inaugurer de nouveaux centres de formation aux métiers du numérique d’ici 2028.',
      },
    ],
  },
  {
    id: 'conditions-vente',
    titre: 'Conditions Générales de Vente (CGV)',
    description: 'Règles et conditions contractuelles encadrant les achats et prestations.',
    sections: [
      {
        titre: '1. Objet & Champ d\'Application',
        contenu: 'Les présentes CGV régissent l’ensemble des ventes conclues entre Informatique System Prosper et toute personne physique ou morale effectuant un achat.',
      },
      {
        titre: '2. Produits & Disponibilité',
        contenu: 'Nos offres de produits sont valables tant qu’elles sont visibles sur le site et dans la limite des stocks disponibles.',
      },
      {
        titre: '3. Prix & Modalités de Facturation',
        contenu: 'Les prix sont indiqués en Euros (€) Toutes Taxes Comprises (TTC) et tiennent compte de la TVA applicable au jour de la commande.',
      },
      {
        titre: '4. Validation de la Commande',
        contenu: 'Toute commande validée sur le site implique l’acceptation sans réserve des présentes CGV et constitue une preuve de contrat.',
      },
      {
        titre: '5. Modalités de Paiement',
        contenu: 'Le règlement s’effectue par Carte Bancaire (Visa, MasterCard), Virement bancaire ou paiement échelonné sécurisé.',
      },
      {
        titre: '6. Livraison & Délais d\'Expédition',
        contenu: 'Les livraisons sont assurées sous 24h à 72h ouvrées en France et par fret express contrôlé pour les destinations outre-mer et Afrique.',
      },
      {
        titre: '7. Réception & Vérification du Matériel',
        contenu: 'Le client doit contrôler l’état de l’emballage et du matériel à la livraison et émettre le cas échéant des réserves précises sous 48h.',
      },
      {
        titre: '8. Droit de Rétractation (14 jours)',
        contenu: 'Conformément au code de la consommation, le client particulier dispose d’un délai de 14 jours calendaires pour retourner son produit intact.',
      },
      {
        titre: '9. Garantie Légale & Constructeur',
        contenu: 'Tous les matériels vendus bénéficient de la garantie légale de conformité (2 ans) et de la garantie constructeur (jusqu’à 5 ans).',
      },
      {
        titre: '10. Service Après-Vente (SAV) & Retours',
        contenu: 'Tout retour doit faire l’objet d’un numéro RMA préalable attribué par notre support technique joignable via l’espace client.',
      },
      {
        titre: '11. Limites de Responsabilité & Force Majeure',
        contenu: 'Informatique System Prosper ne saura être tenue responsable en cas d’incompatibilité matérielle non signalée ou de cas de force majeure.',
      },
      {
        titre: '12. Protection des Données & Traçabilité',
        contenu: 'Les données de transaction sont cryptées SSL et conservées uniquement pour le traitement administratif et légal des factures.',
      },
      {
        titre: '13. Litiges & Droit Applicable',
        contenu: 'Les présentes CGV sont soumises à la loi française. À défaut d’accord amiable, le tribunal de commerce compétent sera saisi.',
      },
    ],
  },
];
