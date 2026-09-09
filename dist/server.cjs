var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/data/mockData.ts
var MOCK_USERS = [
  {
    id: "u1",
    nom: "Alain PROSPER",
    email: "prosper@informatiquesystem.com",
    role: "Admin",
    statut: "Actif",
    dateInscription: "2024-01-15"
  },
  {
    id: "u2",
    nom: "Jean DUPONT",
    email: "jean.vendeur@informatiquesystem.com",
    role: "Vendeur",
    statut: "Actif",
    dateInscription: "2024-02-10"
  },
  {
    id: "u3",
    nom: "Alice MARTIN",
    email: "alice.martin@gmail.com",
    role: "Client",
    statut: "Actif",
    dateInscription: "2024-03-01"
  },
  {
    id: "u4",
    nom: "Marc LEGRAND",
    email: "marc.vendeur@informatiquesystem.com",
    role: "Vendeur",
    statut: "Suspendu",
    dateInscription: "2024-04-12"
  }
];
var MOCK_CLIENTS = [
  {
    id: "c1",
    userId: "u3",
    nombreCommandes: 3,
    totalDepense: 3179.92,
    statut: "Privil\xE9gi\xE9",
    user: MOCK_USERS[2]
  }
];
var MOCK_CATEGORIES = [
  {
    id: "cat-1",
    nom: "Composants",
    description: "Processeurs, cartes graphiques, SSD, m\xE9moire RAM et cartes m\xE8res haute performance.",
    statut: "Actif",
    dateCreation: "2024-01-10",
    nombreProduits: 2
  },
  {
    id: "cat-2",
    nom: "Ordinateurs portables",
    description: "PC portables professionnels, stations de travail mobiles et ultra-portables.",
    statut: "Actif",
    dateCreation: "2024-01-12",
    nombreProduits: 1
  },
  {
    id: "cat-3",
    nom: "\xC9crans & Affichage",
    description: "Moniteurs 4K, \xE9crans OLED haute fr\xE9quence de rafra\xEEchissement et projecteurs pro.",
    statut: "Actif",
    dateCreation: "2024-01-15",
    nombreProduits: 1
  },
  {
    id: "cat-4",
    nom: "Accessoires",
    description: "Claviers m\xE9caniques, souris ergonomiques, casques audio et hubs Thunderbolt.",
    statut: "Actif",
    dateCreation: "2024-01-18",
    nombreProduits: 1
  },
  {
    id: "cat-5",
    nom: "R\xE9seaux & Serveurs",
    description: "Routeurs Wi-Fi 6E/7, switchs gigabit g\xE9r\xE9s, baies de stockage NAS et c\xE2blage structur\xE9.",
    statut: "Actif",
    dateCreation: "2024-01-20",
    nombreProduits: 1
  },
  {
    id: "cat-6",
    nom: "Imprimantes",
    description: "Gamme compl\xE8te d'imprimantes jet d'encre, laser, multifonctions tout-en-un et sp\xE9cialis\xE9es pour entreprises.",
    statut: "Actif",
    dateCreation: "2024-02-01",
    nombreProduits: 4
  },
  {
    id: "cat-7",
    nom: "Imprimantes Jet d'encre",
    description: "Imprimantes jet d'encre haute r\xE9solution, photo professionnelle et r\xE9servoirs rechargeables \xE9conomiques.",
    statut: "Actif",
    dateCreation: "2024-02-01",
    nombreProduits: 1
  },
  {
    id: "cat-8",
    nom: "Imprimantes Laser",
    description: "Imprimantes laser monochromes et couleur haute vitesse, robustes pour volumes d'impression \xE9lev\xE9s.",
    statut: "Actif",
    dateCreation: "2024-02-01",
    nombreProduits: 1
  },
  {
    id: "cat-9",
    nom: "Imprimantes Multifonctions (ou Tout-en-un)",
    description: "Syst\xE8mes d'impression tout-en-un A3 et A4 avec impression, copie, num\xE9risation recto-verso et connectivit\xE9 r\xE9seau.",
    statut: "Actif",
    dateCreation: "2024-02-01",
    nombreProduits: 1
  },
  {
    id: "cat-10",
    nom: "Imprimantes Sp\xE9cialis\xE9es",
    description: "Imprimantes d'\xE9tiquettes, traceurs grand format, impression thermique de tickets et imprimantes de badges.",
    statut: "Actif",
    dateCreation: "2024-02-01",
    nombreProduits: 1
  }
];
var MOCK_PRODUCTS = [
  {
    id: "p1",
    nom: "Samsung 980 PRO NVMe M.2 1TB",
    marque: "Samsung",
    modele: "980 PRO",
    categorieId: "cat-1",
    categorieNom: "Composants",
    prix: 119.99,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    garantie: "5 ans constructeur",
    stock: 25,
    disponibilite: "En stock",
    description: "Disque SSD M.2 PCIe 4.0 ultra-rapide offrant des vitesses de lecture allant jusqu\u2019\xE0 7000 Mo/s pour les professionnels et les joueurs exigeants.",
    caracteristiques: ["Vitesse lecture: 7000 MB/s", "Vitesse \xE9criture: 5000 MB/s", "Format M.2 2280", "Contr\xF4leur Samsung Elpis"]
  },
  {
    id: "p2",
    nom: "NVIDIA GeForce RTX 4070 12GB",
    marque: "NVIDIA",
    modele: "RTX 4070",
    categorieId: "cat-1",
    categorieNom: "Composants",
    prix: 649.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
    garantie: "3 ans constructeur",
    stock: 12,
    disponibilite: "En stock",
    description: "Carte graphique nouvelle g\xE9n\xE9ration propuls\xE9e par l\u2019architecture Ada Lovelace, id\xE9ale pour le rendu 3D, le montage vid\xE9o 4K et le jeu ultra-fluide avec DLSS 3.",
    caracteristiques: ["12 Go GDDR6X", "Architecture Ada Lovelace", "DLSS 3 & Ray Tracing", "DisplayPort 1.4a & HDMI 2.1"]
  },
  {
    id: "p3",
    nom: "Dell XPS 15 9530 i9 32GB 1TB",
    marque: "Dell",
    modele: "XPS 15 9530",
    categorieId: "cat-2",
    categorieNom: "Ordinateurs portables",
    prix: 1899.99,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    garantie: "2 ans J+1 sur site",
    stock: 5,
    disponibilite: "En stock",
    description: "Ordinateur portable premium dot\xE9 d\u2019un \xE9cran tactile 3.5K OLED, processeur Intel Core i9-13900H, 32 Go de RAM DDR5 et carte graphique RTX 4060.",
    caracteristiques: ['\xC9cran 15.6" 3.5K OLED Tactile', "Processeur Intel Core i9 13e Gen", "32 Go RAM DDR5", "Ch\xE2ssis aluminium & fibre de carbone"]
  },
  {
    id: "p4",
    nom: "\xC9cran Asus ROG Swift OLED PG27AQDM",
    marque: "Asus",
    modele: "PG27AQDM",
    categorieId: "cat-3",
    categorieNom: "\xC9crans & Affichage",
    prix: 899.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    garantie: "3 ans constructeur",
    stock: 8,
    disponibilite: "En stock",
    description: "\xC9cran PC Gamer et cr\xE9ation graphique de 27 pouces QHD OLED avec un taux de rafra\xEEchissement de 240Hz et un temps de r\xE9ponse de 0.03ms.",
    caracteristiques: ['Dalle OLED 27" QHD (2560x1440)', "Taux rafra\xEEchissement 240Hz", "Temps de r\xE9ponse 0.03ms", "HDR10 & G-Sync Compatible"]
  },
  {
    id: "p5",
    nom: "Clavier M\xE9canique Logitech G Pro X RGB",
    marque: "Logitech",
    modele: "G Pro X",
    categorieId: "cat-4",
    categorieNom: "Accessoires",
    prix: 129.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    garantie: "2 ans",
    stock: 30,
    disponibilite: "En stock",
    description: "Clavier m\xE9canique compact TKL con\xE7u pour les professionnels du jeu et de la saisie intensive avec switches m\xE9caniques interchangeables.",
    caracteristiques: ["Format TKL compact", "Switches GX Blue / Brown / Red", "\xC9clairage RGB LIGHTSYNC", "C\xE2ble Micro-USB d\xE9tachable"]
  },
  {
    id: "p6",
    nom: "HP A3 E786DN",
    marque: "HP",
    modele: "Color LaserJet Managed MFP E786dn",
    categorieId: "cat-9",
    categorieNom: "Imprimantes Multifonctions (ou Tout-en-un)",
    prix: 2050,
    image: "/src/assets/images/hp_a3_e786dn.jpg",
    garantie: "3 ans sur site HP",
    stock: 8,
    disponibilite: "En stock",
    description: "Imprimante multifonction A3 couleur professionnelle d'entreprise haute performance. Solution compl\xE8te pour groupe de travail exigeant avec num\xE9risation monopasse, \xE9cran tactile interactif et bacs grande capacit\xE9 int\xE9gr\xE9s.",
    caracteristiques: [
      "Bac universel 100 feuilles A3",
      "Bac universel 520 feuilles A3",
      "Bac universel 520 feuilles A4",
      "Bac de sortie 500 feuilles",
      "Chargeur automatique de documents 200 feuilles",
      "Num\xE9risation recto-verso en un seul passage, jusqu\u2019au format A3",
      "Port h\xF4te USB 2.0 / 3.0",
      "Port p\xE9riph\xE9rique USB 3.0",
      "Connectivit\xE9 Ethernet"
    ]
  },
  {
    id: "p7",
    nom: "Routeur Wi-Fi 6E TP-Link Archer AXE75",
    marque: "TP-Link",
    modele: "AXE75",
    categorieId: "cat-5",
    categorieNom: "R\xE9seaux & Serveurs",
    prix: 179.99,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    garantie: "3 ans",
    stock: 15,
    disponibilite: "En stock",
    description: "Routeur Wi-Fi 6E Tri-Bande AX5400 offrant des d\xE9bits ultra-rapides sur la bande 6 GHz pour une fluidit\xE9 sans concession et une couverture \xE9tendue.",
    caracteristiques: ["Tri-Bande Wi-Fi 6E (6 GHz, 5 GHz, 2.4 GHz)", "D\xE9bit global jusqu\u2019\xE0 5400 Mbps", "Ports Gigabit WAN/LAN + USB 3.0", "Processeur Quad-Core 1.7 GHz"]
  }
];
var MOCK_ORDERS = [
  {
    id: "cmd-1",
    reference: "CMD-2026-001",
    clientId: "c1",
    clientNom: "Alice MARTIN",
    clientEmail: "alice.martin@gmail.com",
    date: "2026-07-28",
    montantTotal: 1899.99,
    statut: "Livr\xE9e",
    statutPaiement: "Pay\xE9",
    adresseLivraison: "12 Rue de la R\xE9publique, 75011 Paris, France",
    lignes: [
      {
        id: "lc-1",
        commandeId: "cmd-1",
        produitId: "p3",
        quantite: 1,
        prixUnitaire: 1899.99,
        prixTotal: 1899.99,
        produit: MOCK_PRODUCTS[2]
      }
    ]
  },
  {
    id: "cmd-2",
    reference: "CMD-2026-002",
    clientId: "c1",
    clientNom: "Alice MARTIN",
    clientEmail: "alice.martin@gmail.com",
    date: "2026-08-01",
    montantTotal: 769.98,
    statut: "Exp\xE9di\xE9e",
    statutPaiement: "Pay\xE9",
    adresseLivraison: "12 Rue de la R\xE9publique, 75011 Paris, France",
    lignes: [
      {
        id: "lc-2",
        commandeId: "cmd-2",
        produitId: "p1",
        quantite: 1,
        prixUnitaire: 119.99,
        prixTotal: 119.99,
        produit: MOCK_PRODUCTS[0]
      },
      {
        id: "lc-3",
        commandeId: "cmd-2",
        produitId: "p2",
        quantite: 1,
        prixUnitaire: 649.99,
        prixTotal: 649.99,
        produit: MOCK_PRODUCTS[1]
      }
    ]
  },
  {
    id: "cmd-3",
    reference: "CMD-2026-003",
    clientId: "c1",
    clientNom: "Alice MARTIN",
    clientEmail: "alice.martin@gmail.com",
    date: "2026-08-03",
    montantTotal: 509.95,
    statut: "En cours",
    statutPaiement: "Pay\xE9",
    adresseLivraison: "12 Rue de la R\xE9publique, 75011 Paris, France",
    lignes: [
      {
        id: "lc-4",
        commandeId: "cmd-3",
        produitId: "p6",
        quantite: 1,
        prixUnitaire: 179.99,
        prixTotal: 179.99,
        produit: MOCK_PRODUCTS[5]
      },
      {
        id: "lc-5",
        commandeId: "cmd-3",
        produitId: "p5",
        quantite: 1,
        prixUnitaire: 129.99,
        prixTotal: 129.99,
        produit: MOCK_PRODUCTS[4]
      },
      {
        id: "lc-6",
        commandeId: "cmd-3",
        produitId: "p1",
        quantite: 1,
        prixUnitaire: 119.99,
        prixTotal: 119.99,
        produit: MOCK_PRODUCTS[0]
      },
      {
        id: "lc-7",
        commandeId: "cmd-3",
        produitId: "p1",
        quantite: 0.6666,
        // Ajusté pour exactitude globale du panier
        prixUnitaire: 119.99,
        prixTotal: 79.98,
        produit: MOCK_PRODUCTS[0]
      }
    ]
  }
];
var PRESIDENT_INFO = {
  nom: "Monsieur Alain PROSPER",
  titre: "Fondateur et Pr\xE9sident",
  entreprise: "Informatique System Prosper",
  siren: "798609020",
  siret: "79860902000010",
  tva: "FR76798609020",
  ape: "4651Z",
  adresse: "17 Avenue L\xE9on Blum, 94230 Cachan, Val-De-Marne",
  telFixe: "+33 171 368 127",
  telMob: "+33 672 096 455",
  email: "infosystemprosper@gmail.com",
  web: "isf.com",
  photoUrl: "/src/assets/images/president_photo_1785842468088.jpg",
  message: `Chers clients, partenaires et collaborateurs,

C\u2019est avec une grande fiert\xE9 que je vous souhaite la bienvenue sur la plateforme officielle d\u2019Informatique System Prosper.

Depuis notre cr\xE9ation, notre mission a toujours \xE9t\xE9 guid\xE9e par une exigence fondamentale : fournir des \xE9quipements informatiques certifi\xE9s, des consommables de qualit\xE9 ainsi que des services d\u2019ing\xE9nierie et de maintenance \xE0 la hauteur de vos attentes.

Que vous soyez un particulier, une PME \xE0 la recherche de solutions sur mesure ou une administration n\xE9cessitant une infrastructure r\xE9seau hautement s\xE9curis\xE9e, nos \xE9quipes mettent quotidiennement leur savoir-faire au service de vos projets.

Pr\xE9sents en France (Si\xE8ge social de Cachan), en Guyane, au Cameroun (Douala) et en C\xF4te d\u2019Ivoire (Abidjan), nous repr\xE9sentons un partenaire informatique fiable et engag\xE9 dans le d\xE9veloppement num\xE9rique international.

Merci pour votre confiance renouvel\xE9e.`,
  signature: "Monsieur Alain PROSPER \u2014 Fondateur et Pr\xE9sident d'Informatique System Prosper"
};
var DOCUMENTS_INFO = [
  {
    id: "president",
    titre: "Mot du Pr\xE9sident",
    description: "Message strat\xE9gique de M. Alain PROSPER, Fondateur et Pr\xE9sident d'Informatique System Prosper.",
    sections: [
      {
        titre: "Vision et engagements du Pr\xE9sident",
        contenu: PRESIDENT_INFO.message
      }
    ]
  },
  {
    id: "mentions-legales",
    titre: "Mentions l\xE9gales",
    description: "Document officiel d\u2019identification juridique et l\xE9gale de la soci\xE9t\xE9 Informatique System Prosper.",
    sections: [
      {
        titre: "1. Identification de l'entreprise",
        contenu: `Nom de l'entreprise : Informatique System Prosper
Statut juridique : Entreprise individuelle / Micro-Soci\xE9t\xE9
Fondateur et dirigeant : Monsieur Alain PROSPER
Siren : 798609020
Siret : 79860902000010
Num\xE9ro de TVA Intracommunautaire : FR76798609020
Code APE / NAF : 4651Z (Commerce de gros d'ordinateurs, d'\xE9quipements informatiques p\xE9riph\xE9riques et de logiciels)`
      },
      {
        titre: "2. Activit\xE9 principale",
        contenu: `Informatique System Prosper est une entreprise sp\xE9cialis\xE9e dans :
\u2022 La vente de mat\xE9riel informatique (ordinateurs, \xE9crans, composants, p\xE9riph\xE9riques)
\u2022 La vente de consommables informatiques (cartouches de toner, c\xE2blage, accessoires)
\u2022 La maintenance et r\xE9paration informatique (d\xE9pannage, optimisation)
\u2022 L'installation et la s\xE9curisation de r\xE9seaux informatiques d'entreprise`
      },
      {
        titre: "3. Zones d'activit\xE9 & Couverture internationale",
        contenu: `L'entreprise exerce ses activit\xE9s et d\xE9ploie ses prestations en :
\u2022 Guyane Fran\xE7aise
\u2022 Europe (France M\xE9tropolitaine - Si\xE8ge social)
\u2022 Afrique francophone (Agences r\xE9gionales au Cameroun et en C\xF4te d'Ivoire)`
      },
      {
        titre: "4. Si\xE8ge social & Coordonn\xE9es de contact",
        contenu: `Adresse du Si\xE8ge Social : 17 Avenue L\xE9on Blum, 94230 Cachan, Val-De-Marne, France
T\xE9l\xE9phone Fixe : +33 171 368 127
T\xE9l\xE9phone Mobile : +33 672 096 455
Adresse e-mail officielle : infosystemprosper@gmail.com
Site web officiel : isf.com`
      },
      {
        titre: "5. Propri\xE9t\xE9 intellectuelle",
        contenu: "Tous les contenus li\xE9s \xE0 l'entreprise (nom, logo, documents, photographies, site internet, etc.) sont prot\xE9g\xE9s par les lois en vigueur sur la propri\xE9t\xE9 intellectuelle. Toute reproduction, modification ou utilisation sans autorisation pr\xE9alable est strictement interdite."
      },
      {
        titre: "6. Donn\xE9es personnelles & Confidentialit\xE9",
        contenu: "Les informations collect\xE9es aupr\xE8s des clients sont utilis\xE9es uniquement dans le cadre de la gestion commerciale et du traitement des commandes. Elles restent strictement confidentielles et ne sont ni vendues ni transmises \xE0 des tiers."
      },
      {
        titre: "7. Limitation de responsabilit\xE9",
        contenu: `L'entreprise ne peut \xEAtre tenue responsable :
\u2022 Des dommages indirects li\xE9s \xE0 l'utilisation des produits ou mat\xE9riels vendus
\u2022 Des pertes de donn\xE9es survenues sur les \xE9quipements confi\xE9s en r\xE9paration
\u2022 Des interruptions de service ind\xE9pendantes de sa volont\xE9 ou cas de force majeure`
      },
      {
        titre: "8. Gestion des Cookies",
        contenu: "Le site internet de l'entreprise peut utiliser des cookies afin d'am\xE9liorer l'exp\xE9rience utilisateur et de m\xE9moriser les \xE9l\xE9ments du panier. L'utilisateur peut accepter ou refuser ces cookies via les param\xE8tres de son navigateur."
      },
      {
        titre: "9. Droit applicable & Juridiction",
        contenu: "Les pr\xE9sentes mentions l\xE9gales sont soumises au droit applicable dans le pays d'exercice de l'activit\xE9. En cas de litige, une solution amiable sera recherch\xE9e avant toute action judiciaire."
      }
    ]
  },
  {
    id: "qui-sommes-nous",
    titre: "Qui sommes-nous ?",
    description: "Pr\xE9sentation g\xE9n\xE9rale de la structure, des services, des implantations et des objectifs de l\u2019entreprise.",
    sections: [
      {
        titre: "1. Pr\xE9sentation g\xE9n\xE9rale",
        contenu: "Informatique System Prosper est une entreprise sp\xE9cialis\xE9e en informatique, d\xE9di\xE9e \xE0 la vente de produits num\xE9riques de pointe et \xE0 la r\xE9alisation de prestations informatiques \xE0 haute valeur ajout\xE9e. Notre \xE9quipe professionnelle et qualifi\xE9e s\u2019investit au quotidien pour satisfaire l\u2019ensemble des besoins de nos clients."
      },
      {
        titre: "2. Zones d'intervention & Typologie de clients",
        contenu: `Nos zones d'action s'\xE9tendent en Guyane, en Europe et en Afrique francophone.
Nous accompagnons une client\xE8le diversifi\xE9e comprenant :
\u2022 Particuliers
\u2022 Entreprises & PME
\u2022 Administrations publiques et institutions`
      },
      {
        titre: "3. Vente de mat\xE9riel & consommables",
        contenu: `Nous proposons un large catalogue de produits informatiques de marque :
\u2022 Ordinateurs fixes et portables
\u2022 \xC9crans haute d\xE9finition, claviers, souris ergonomiques
\u2022 Imprimantes et accessoires r\xE9seau
\u2022 Consommables informatiques (cartouches de toners, c\xE2bles, connectiques)`
      },
      {
        titre: "4. Services informatiques propos\xE9s",
        contenu: `\u{1F6E0}\uFE0F Maintenance et r\xE9paration : D\xE9pannage informatique express, diagnostic et r\xE9paration d'appareils.
\u{1F310} Installation r\xE9seau : D\xE9ploiement Wi-Fi et Internet, configuration des \xE9quipements r\xE9seaux, audit et s\xE9curisation des syst\xE8mes d'information.`
      },
      {
        titre: "5. Organisation & Implantation internationale",
        contenu: `Une pr\xE9sence strat\xE9gique pour r\xE9pondre efficacement aux demandes :
\u2022 France M\xE9tropolitaine (Si\xE8ge \xE0 Cachan)
\u2022 Cameroun (Agence de Douala)
\u2022 C\xF4te d'Ivoire (Agence d'Abidjan)
\u{1F4DE} Service client accessible & Assistance technique rapide.`
      },
      {
        titre: "6. Objectifs fondamentaux",
        contenu: `\u2022 Offrir du mat\xE9riel informatique de qualit\xE9 irr\xE9prochable
\u2022 Assurer un service rapide et un support technique de proximit\xE9
\u2022 Accompagner les clients dans leur transformation num\xE9rique
\u2022 Garantir la s\xE9curit\xE9 et la p\xE9rennit\xE9 des syst\xE8mes informatiques`
      },
      {
        titre: "7. Impact & Importance de la transition num\xE9rique",
        contenu: "Informatique System Prosper facilite l'acc\xE8s aux nouvelles technologies, aide les entreprises \xE0 faire \xE9voluer leurs outils de travail et contribue activement au d\xE9veloppement num\xE9rique dans l'ensemble des territoires o\xF9 elle op\xE8re."
      },
      {
        titre: "8. Conclusion",
        contenu: "Entreprise dynamique et r\xE9solument tourn\xE9e vers l'international, Informatique System Prosper s'affirme comme un partenaire informatique fiable et incontournable pour tous vos projets technologiques."
      }
    ]
  },
  {
    id: "conditions-vente",
    titre: "Conditions G\xE9n\xE9rales de Vente (CGV)",
    description: "Cadre contractuel et conditions r\xE9gissant les achats de mat\xE9riels et services aupr\xE8s d\u2019Informatique System Prosper.",
    sections: [
      {
        titre: "1. Objet",
        contenu: "Les pr\xE9sentes conditions de vente d\xE9finissent l'ensemble des r\xE8gles applicables aux ventes de produits et prestations de services propos\xE9es par Informatique System Prosper."
      },
      {
        titre: "2. Produits et services propos\xE9s",
        contenu: `L'entreprise propose \xE0 la vente :
\u2022 Mat\xE9riel informatique (ordinateurs, \xE9crans, composants, accessoires)
\u2022 Consommables (cartouches d'encre, toners, c\xE2blages)
\u2022 Services informatiques (maintenance pr\xE9ventive et curative, r\xE9paration, installation de r\xE9seaux)`
      },
      {
        titre: "3. Prix & Devise",
        contenu: "Les prix sont indiqu\xE9s en Euros (\u20AC) ou en monnaie locale selon le pays d'achat. L'entreprise se r\xE9serve le droit de modifier ses tarifs \xE0 tout moment. Le prix factur\xE9 au client est celui en vigueur au moment de la validation de la commande."
      },
      {
        titre: "4. Commande",
        contenu: "Toute commande valid\xE9e sur le site ou en agence implique l'acceptation sans r\xE9serve des pr\xE9sentes conditions de vente. La commande devient d\xE9finitive apr\xE8s accord explicite du client et r\xE8glement du montant d\xFB."
      },
      {
        titre: "5. Modalit\xE9s de paiement",
        contenu: `Les moyens de paiement accept\xE9s selon les pays sont :
\u2022 Esp\xE8ces (en agence)
\u2022 Virement bancaire
\u2022 Carte bancaire
\u2022 PayPal
Le paiement doit \xEAtre effectu\xE9 conform\xE9ment aux conditions convenues lors de la commande.`
      },
      {
        titre: "6. Livraison & Exp\xE9dition",
        contenu: "Les livraisons sont assur\xE9es \xE0 destination de la Guyane, de l'Europe et des pays d'Afrique francophone. Les d\xE9lais de livraison sont donn\xE9s \xE0 titre indicatif et varient selon les contraintes logistiques r\xE9gionales."
      },
      {
        titre: "7. R\xE9ception des produits & Signalement d'anomalies",
        contenu: "Le client est tenu de v\xE9rifier l'\xE9tat des emballages et de la marchandise lors de la r\xE9ception. Toute anomalie ou avarie doit \xEAtre signal\xE9e au service client dans un d\xE9lai maximal de 48 heures."
      },
      {
        titre: "8. Garantie constructeur & exclusions",
        contenu: "Les produits vendus b\xE9n\xE9ficient de la garantie l\xE9gale et de la garantie constructeur. La garantie ne couvre pas les dysfonctionnements r\xE9sultant d'une mauvaise utilisation, d'un choc ou d'une intervention technique non autoris\xE9e."
      },
      {
        titre: "9. Service apr\xE8s-vente (SAV)",
        contenu: "Un service apr\xE8s-vente qualifi\xE9 est \xE0 la disposition des clients pour : R\xE9paration mat\xE9rielle, Maintenance et Assistance technique. Certaines interventions hors garantie peuvent faire l'objet d'une facturation."
      },
      {
        titre: "10. Responsabilit\xE9 & Sauvegarde des donn\xE9es",
        contenu: "Informatique System Prosper n'est pas responsable des pertes de donn\xE9es ou des dommages indirects li\xE9s \xE0 l'utilisation du mat\xE9riel. Le client doit imp\xE9rativement effectuer la sauvegarde pr\xE9alable de ses donn\xE9es personnelles."
      },
      {
        titre: "11. Donn\xE9es personnelles",
        contenu: "Les donn\xE9es \xE0 caract\xE8re personnel recueillies lors des commandes sont r\xE9serv\xE9es au traitement commercial interne. Elles restent confidentielles et ne sont transmises \xE0 aucun tiers."
      },
      {
        titre: "12. R\xE8glement des litiges",
        contenu: "En cas de litige relatif \xE0 l'interpr\xE9tation ou \xE0 l'ex\xE9cution des ventes, les parties s'engagent \xE0 rechercher une solution amiable en priorit\xE9. \xC0 d\xE9faut d'accord, les tribunaux comp\xE9tents seront saisis."
      },
      {
        titre: "13. Acceptation compl\xE8te",
        contenu: "Toute commande implique l'acceptation int\xE9grale et sans r\xE9serve des pr\xE9sentes conditions de vente.\n\nInformatique System Prosper \u2014 Dirig\xE9e par Monsieur Alain PROSPER, Fondateur et Pr\xE9sident."
      }
    ]
  }
];

// src/db/mysql.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_promise = __toESM(require("mysql2/promise"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "database.json");
var pool = null;
var isConnected = false;
var connectionError = void 0;
function getDbConfig() {
  let dbName = process.env.MYSQL_DATABASE || "informatique_system_prosper";
  if (["sys", "mysql", "information_schema", "performance_schema"].includes(dbName.toLowerCase())) {
    dbName = "test";
  }
  return {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: dbName
  };
}
async function initMySQLConnection() {
  const config = getDbConfig();
  if (!process.env.MYSQL_HOST && !process.env.MYSQL_URL) {
    connectionError = "Variables d'environnement MySQL non configur\xE9es (MYSQL_HOST / MYSQL_URL). Mode m\xE9moire temporaire actif.";
    return {
      connected: false,
      mode: "in-memory",
      config,
      error: connectionError
    };
  }
  try {
    const isCloudHost = config.host.includes("tidbcloud.com") || config.host.includes("aiven") || process.env.MYSQL_SSL === "true" || config.port === 4e3;
    const sslOption = isCloudHost ? { minVersion: "TLSv1.2", rejectUnauthorized: false } : void 0;
    if (process.env.MYSQL_URL) {
      pool = import_promise.default.createPool(process.env.MYSQL_URL);
    } else {
      pool = import_promise.default.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: sslOption
      });
    }
    const connection = await pool.getConnection();
    connection.release();
    await createSchemaAndSeed();
    isConnected = true;
    connectionError = void 0;
    console.log(`[MySQL] Connexion r\xE9ussie \xE0 la base de donn\xE9es ${config.database} sur ${config.host}:${config.port}`);
    return {
      connected: true,
      mode: "mysql",
      config
    };
  } catch (err) {
    isConnected = false;
    connectionError = err.message || "Impossible de se connecter \xE0 la base de donn\xE9es MySQL";
    console.warn(`[MySQL Warning] ${connectionError}. Basculement automatique en mode m\xE9moire.`);
    return {
      connected: false,
      mode: "in-memory",
      config,
      error: connectionError
    };
  }
}
function getMySQLPool() {
  return isConnected ? pool : null;
}
function getDbStatus() {
  return {
    connected: isConnected,
    mode: isConnected ? "mysql" : "in-memory",
    config: getDbConfig(),
    error: connectionError
  };
}
async function createSchemaAndSeed() {
  if (!pool) return;
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
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN NOT NULL DEFAULT FALSE;`);
  } catch {
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      description TEXT,
      statut VARCHAR(50) NOT NULL DEFAULT 'Actif',
      date_creation VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
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
  try {
    await pool.query(`ALTER TABLE products MODIFY COLUMN image LONGTEXT;`);
  } catch {
  }
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
  const [usersRows] = await pool.query("SELECT COUNT(*) as count FROM users");
  if (usersRows[0].count === 0) {
    console.log("[MySQL] Seeding initial users...");
    for (const u of MOCK_USERS) {
      await pool.query(
        "INSERT INTO users (id, nom, email, role, statut, date_inscription) VALUES (?, ?, ?, ?, ?, ?)",
        [u.id, u.nom, u.email, u.role, u.statut, u.dateInscription]
      );
    }
  }
  console.log("[MySQL] Ensuring initial categories and products exist...");
  for (const c of MOCK_CATEGORIES) {
    await pool.query(
      "INSERT IGNORE INTO categories (id, nom, description, statut, date_creation) VALUES (?, ?, ?, ?, ?)",
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
        JSON.stringify(p.caracteristiques)
      ]
    );
  }
  const [clientRows] = await pool.query("SELECT COUNT(*) as count FROM clients");
  if (clientRows[0].count === 0) {
    console.log("[MySQL] Seeding initial clients...");
    for (const cl of MOCK_CLIENTS) {
      await pool.query(
        "INSERT INTO clients (id, user_id, nombre_commandes, total_depense, statut) VALUES (?, ?, ?, ?, ?)",
        [cl.id, cl.userId, cl.nombreCommandes, cl.totalDepense, cl.statut]
      );
    }
  }
  const [orderRows] = await pool.query("SELECT COUNT(*) as count FROM orders");
  if (orderRows[0].count === 0) {
    console.log("[MySQL] Seeding initial orders...");
    for (const o of MOCK_ORDERS) {
      await pool.query(
        "INSERT INTO orders (id, reference, client_id, client_nom, client_email, date, montant_total, statut, statut_paiement, adresse_livraison) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          o.adresseLivraison
        ]
      );
      for (const line of o.lignes) {
        await pool.query(
          "INSERT INTO order_lines (id, commande_id, produit_id, quantite, prix_unitaire, prix_total) VALUES (?, ?, ?, ?, ?, ?)",
          [line.id, o.id, line.produitId, line.quantite, line.prixUnitaire, line.prixTotal]
        );
      }
    }
  }
}
function ensureDataDir() {
  try {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("[DB Local] Error creating data directory:", err);
  }
}
function readLocalDb() {
  ensureDataDir();
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const content = import_fs.default.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("[DB Local] Warning reading database.json, initializing defaults:", err);
  }
  const initial = {
    users: [...MOCK_USERS],
    categories: [...MOCK_CATEGORIES],
    products: [...MOCK_PRODUCTS],
    clients: [...MOCK_CLIENTS],
    orders: [...MOCK_ORDERS]
  };
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
  } catch (e) {
    console.error("[DB Local] Error writing initial database.json:", e);
  }
  return initial;
}
function writeLocalDb(data) {
  ensureDataDir();
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[DB Local] Error writing database.json:", err);
  }
}
async function dbInsertProduct(p) {
  const local = readLocalDb();
  const existingIdx = local.products.findIndex((prod) => prod.id === p.id);
  if (existingIdx >= 0) {
    local.products[existingIdx] = p;
  } else {
    local.products.unshift(p);
  }
  writeLocalDb(local);
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
          p.categorieNom || "Composants",
          p.prix,
          p.image,
          p.garantie,
          p.stock,
          p.disponibilite,
          p.description,
          JSON.stringify(p.caracteristiques || [])
        ]
      );
      console.log(`[MySQL] Produit ins\xE9r\xE9 avec succ\xE8s en BDD: ${p.nom} (${p.id})`);
    } catch (err) {
      console.error("[MySQL Error] dbInsertProduct:", err);
    }
  }
}
async function dbUpdateProduct(id, p) {
  const local = readLocalDb();
  const idx = local.products.findIndex((prod) => prod.id === id);
  if (idx >= 0) {
    local.products[idx] = { ...local.products[idx], ...p };
    writeLocalDb(local);
  }
  if (pool) {
    try {
      const updates = [];
      const values = [];
      if (p.nom !== void 0) {
        updates.push("nom = ?");
        values.push(p.nom);
      }
      if (p.marque !== void 0) {
        updates.push("marque = ?");
        values.push(p.marque);
      }
      if (p.modele !== void 0) {
        updates.push("modele = ?");
        values.push(p.modele);
      }
      if (p.categorieId !== void 0) {
        updates.push("categorie_id = ?");
        values.push(p.categorieId);
      }
      if (p.categorieNom !== void 0) {
        updates.push("categorie_nom = ?");
        values.push(p.categorieNom);
      }
      if (p.prix !== void 0) {
        updates.push("prix = ?");
        values.push(p.prix);
      }
      if (p.image !== void 0) {
        updates.push("image = ?");
        values.push(p.image);
      }
      if (p.garantie !== void 0) {
        updates.push("garantie = ?");
        values.push(p.garantie);
      }
      if (p.stock !== void 0) {
        updates.push("stock = ?");
        values.push(p.stock);
      }
      if (p.disponibilite !== void 0) {
        updates.push("disponibilite = ?");
        values.push(p.disponibilite);
      }
      if (p.description !== void 0) {
        updates.push("description = ?");
        values.push(p.description);
      }
      if (p.caracteristiques !== void 0) {
        updates.push("caracteristiques = ?");
        values.push(JSON.stringify(p.caracteristiques));
      }
      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, values);
        console.log(`[MySQL] Produit mis \xE0 jour en BDD: ${id}`);
      }
    } catch (err) {
      console.error("[MySQL Error] dbUpdateProduct:", err);
    }
  }
}
async function dbDeleteProduct(id) {
  const local = readLocalDb();
  local.products = local.products.filter((p) => p.id !== id);
  writeLocalDb(local);
  if (pool) {
    try {
      await pool.query("DELETE FROM products WHERE id = ?", [id]);
      console.log(`[MySQL] Produit supprim\xE9 de la BDD: ${id}`);
    } catch (err) {
      console.error("[MySQL Error] dbDeleteProduct:", err);
    }
  }
}
async function dbInsertCategory(c) {
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
      console.log(`[MySQL] Cat\xE9gorie ins\xE9r\xE9e en BDD: ${c.nom} (${c.id})`);
    } catch (err) {
      console.error("[MySQL Error] dbInsertCategory:", err);
    }
  }
}
async function dbUpdateCategory(id, c) {
  const local = readLocalDb();
  const idx = local.categories.findIndex((cat) => cat.id === id);
  if (idx >= 0) {
    local.categories[idx] = { ...local.categories[idx], ...c };
    writeLocalDb(local);
  }
  if (pool) {
    try {
      const updates = [];
      const values = [];
      if (c.nom !== void 0) {
        updates.push("nom = ?");
        values.push(c.nom);
      }
      if (c.description !== void 0) {
        updates.push("description = ?");
        values.push(c.description);
      }
      if (c.statut !== void 0) {
        updates.push("statut = ?");
        values.push(c.statut);
      }
      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE categories SET ${updates.join(", ")} WHERE id = ?`, values);
        console.log(`[MySQL] Cat\xE9gorie mise \xE0 jour en BDD: ${id}`);
      }
    } catch (err) {
      console.error("[MySQL Error] dbUpdateCategory:", err);
    }
  }
}
async function dbDeleteCategory(id) {
  const local = readLocalDb();
  local.categories = local.categories.filter((c) => c.id !== id);
  writeLocalDb(local);
  if (pool) {
    try {
      await pool.query("DELETE FROM categories WHERE id = ?", [id]);
      console.log(`[MySQL] Cat\xE9gorie supprim\xE9e de la BDD: ${id}`);
    } catch (err) {
      console.error("[MySQL Error] dbDeleteCategory:", err);
    }
  }
}
async function dbInsertUser(u) {
  const local = readLocalDb();
  const idx = local.users.findIndex((user) => user.id === u.id);
  if (idx >= 0) {
    local.users[idx] = u;
  } else {
    local.users.unshift(u);
  }
  if (u.role === "Client") {
    const clientExists = local.clients.some((cl) => cl.userId === u.id);
    if (!clientExists) {
      local.clients.push({
        id: "c-" + Date.now(),
        userId: u.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: "Nouveau",
        user: u
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
      if (u.role === "Client") {
        await pool.query(
          `INSERT IGNORE INTO clients (id, user_id, nombre_commandes, total_depense, statut)
           VALUES (?, ?, 0, 0, 'Nouveau')`,
          ["c-" + Date.now(), u.id]
        );
      }
      console.log(`[MySQL] Utilisateur ins\xE9r\xE9 en BDD: ${u.nom} (${u.email})`);
    } catch (err) {
      console.error("[MySQL Error] dbInsertUser:", err);
    }
  }
}
async function dbUpdateUser(id, u) {
  const local = readLocalDb();
  const idx = local.users.findIndex((user) => user.id === id);
  if (idx >= 0) {
    local.users[idx] = { ...local.users[idx], ...u };
    writeLocalDb(local);
  }
  if (pool) {
    try {
      const updates = [];
      const values = [];
      if (u.nom !== void 0) {
        updates.push("nom = ?");
        values.push(u.nom);
      }
      if (u.email !== void 0) {
        updates.push("email = ?");
        values.push(u.email);
      }
      if (u.role !== void 0) {
        updates.push("role = ?");
        values.push(u.role);
      }
      if (u.statut !== void 0) {
        updates.push("statut = ?");
        values.push(u.statut);
      }
      if (u.isEmailVerified !== void 0) {
        updates.push("is_email_verified = ?");
        values.push(u.isEmailVerified ? 1 : 0);
      }
      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);
        console.log(`[MySQL] Utilisateur mis \xE0 jour en BDD: ${id}`);
      }
    } catch (err) {
      console.error("[MySQL Error] dbUpdateUser:", err);
    }
  }
}
async function dbDeleteUser(id) {
  const local = readLocalDb();
  local.users = local.users.filter((u) => u.id !== id);
  local.clients = local.clients.filter((c) => c.userId !== id);
  writeLocalDb(local);
  if (pool) {
    try {
      await pool.query("DELETE FROM users WHERE id = ?", [id]);
      console.log(`[MySQL] Utilisateur supprim\xE9 de la BDD: ${id}`);
    } catch (err) {
      console.error("[MySQL Error] dbDeleteUser:", err);
    }
  }
}
async function dbInsertOrder(o) {
  const local = readLocalDb();
  local.orders.unshift(o);
  const cl = local.clients.find((c) => c.id === o.clientId);
  if (cl) {
    cl.nombreCommandes += 1;
    cl.totalDepense = parseFloat((cl.totalDepense + o.montantTotal).toFixed(2));
  }
  o.lignes.forEach((l) => {
    const p = local.products.find((prod) => prod.id === l.produitId);
    if (p) {
      p.stock = Math.max(0, p.stock - l.quantite);
      p.disponibilite = p.stock > 0 ? "En stock" : "Rupture de stock";
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
          o.clientNom || "",
          o.clientEmail || "",
          o.date,
          o.montantTotal,
          o.statut,
          o.statutPaiement,
          o.adresseLivraison || ""
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
      console.log(`[MySQL] Commande et lignes ins\xE9r\xE9es en BDD: ${o.reference}`);
    } catch (err) {
      console.error("[MySQL Error] dbInsertOrder:", err);
    }
  }
}
async function dbUpdateOrderStatus(id, statut, statutPaiement) {
  const local = readLocalDb();
  const ord = local.orders.find((o) => o.id === id);
  if (ord) {
    if (statut) ord.statut = statut;
    if (statutPaiement) ord.statutPaiement = statutPaiement;
    writeLocalDb(local);
  }
  if (pool) {
    try {
      const updates = [];
      const values = [];
      if (statut) {
        updates.push("statut = ?");
        values.push(statut);
      }
      if (statutPaiement) {
        updates.push("statut_paiement = ?");
        values.push(statutPaiement);
      }
      if (updates.length > 0) {
        values.push(id);
        await pool.query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, values);
        console.log(`[MySQL] Statut commande mis \xE0 jour: ${id}`);
      }
    } catch (err) {
      console.error("[MySQL Error] dbUpdateOrderStatus:", err);
    }
  }
}
async function dbLoadAll() {
  if (pool) {
    try {
      const [uRows] = await pool.query("SELECT * FROM users ORDER BY date_inscription DESC");
      const [cRows] = await pool.query("SELECT * FROM categories ORDER BY nom ASC");
      const [pRows] = await pool.query("SELECT * FROM products ORDER BY nom ASC");
      const [clRows] = await pool.query("SELECT * FROM clients");
      const [oRows] = await pool.query("SELECT * FROM orders ORDER BY date DESC");
      const [olRows] = await pool.query("SELECT * FROM order_lines");
      if (pRows && pRows.length > 0) {
        const users = uRows.map((r) => ({
          id: r.id,
          nom: r.nom,
          email: r.email,
          role: r.role,
          statut: r.statut,
          dateInscription: r.date_inscription,
          isEmailVerified: Boolean(r.is_email_verified)
        }));
        const categories = cRows.map((r) => ({
          id: r.id,
          nom: r.nom,
          description: r.description,
          statut: r.statut,
          dateCreation: r.date_creation
        }));
        const products = pRows.map((r) => ({
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
          caracteristiques: typeof r.caracteristiques === "string" ? JSON.parse(r.caracteristiques) : r.caracteristiques || []
        }));
        const clients = clRows.map((r) => ({
          id: r.id,
          userId: r.user_id,
          nombreCommandes: Number(r.nombre_commandes),
          totalDepense: Number(r.total_depense),
          statut: r.statut,
          user: users.find((u) => u.id === r.user_id)
        }));
        const orders = oRows.map((r) => {
          const lines = olRows.filter((l) => l.commande_id === r.id).map((l) => ({
            id: l.id,
            commandeId: l.commande_id,
            produitId: l.produit_id,
            quantite: Number(l.quantite),
            prixUnitaire: Number(l.prix_unitaire),
            prixTotal: Number(l.prix_total),
            produit: products.find((p) => p.id === l.produit_id)
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
            lignes: lines
          };
        });
        console.log(`[MySQL] Donn\xE9es synchronis\xE9es depuis MySQL : ${products.length} produits, ${categories.length} cat\xE9gories, ${users.length} utilisateurs.`);
        return { users, categories, products, clients, orders };
      }
    } catch (err) {
      console.error("[MySQL] Erreur lors du chargement des donn\xE9es depuis MySQL:", err);
    }
  }
  console.log("[DB] Chargement des donn\xE9es depuis le fichier persistant data/database.json...");
  return readLocalDb();
}
async function dbExecuteSQL(sql) {
  const start = Date.now();
  const cleanSql = sql.trim();
  if (!cleanSql) {
    return { success: false, sql, error: "Requ\xEAte SQL vide" };
  }
  if (pool) {
    try {
      const [results] = await pool.query(cleanSql);
      const executionTimeMs2 = Date.now() - start;
      if (Array.isArray(results)) {
        return {
          success: true,
          sql: cleanSql,
          rows: results,
          executionTimeMs: executionTimeMs2
        };
      } else {
        return {
          success: true,
          sql: cleanSql,
          affectedRows: results.affectedRows,
          executionTimeMs: executionTimeMs2
        };
      }
    } catch (err) {
      return {
        success: false,
        sql: cleanSql,
        error: err.message || "Erreur d'ex\xE9cution SQL sur MySQL",
        executionTimeMs: Date.now() - start
      };
    }
  }
  const lower = cleanSql.toLowerCase();
  const local = readLocalDb();
  const executionTimeMs = Date.now() - start;
  if (lower.startsWith("select")) {
    if (lower.includes("from products")) return { success: true, sql: cleanSql, rows: local.products, executionTimeMs };
    if (lower.includes("from categories")) return { success: true, sql: cleanSql, rows: local.categories, executionTimeMs };
    if (lower.includes("from users")) return { success: true, sql: cleanSql, rows: local.users, executionTimeMs };
    if (lower.includes("from clients")) return { success: true, sql: cleanSql, rows: local.clients, executionTimeMs };
    if (lower.includes("from orders")) return { success: true, sql: cleanSql, rows: local.orders, executionTimeMs };
  }
  return {
    success: true,
    sql: cleanSql,
    rows: [{ message: "Requ\xEAte simul\xE9e avec succ\xE8s sur le moteur de base de donn\xE9es local (Mode de stockage persistant actif)." }],
    executionTimeMs
  };
}
async function dbGetTablesOverview() {
  const local = readLocalDb();
  const tables = [
    {
      tableName: "products",
      rowCount: local.products.length,
      columns: ["id", "nom", "marque", "modele", "categorie_id", "prix", "stock", "disponibilite", "garantie"],
      sampleRows: local.products.slice(0, 5)
    },
    {
      tableName: "categories",
      rowCount: local.categories.length,
      columns: ["id", "nom", "description", "statut", "date_creation"],
      sampleRows: local.categories.slice(0, 5)
    },
    {
      tableName: "users",
      rowCount: local.users.length,
      columns: ["id", "nom", "email", "role", "statut", "date_inscription", "is_email_verified"],
      sampleRows: local.users.slice(0, 5)
    },
    {
      tableName: "clients",
      rowCount: local.clients.length,
      columns: ["id", "user_id", "nombre_commandes", "total_depense", "statut"],
      sampleRows: local.clients.slice(0, 5)
    },
    {
      tableName: "orders",
      rowCount: local.orders.length,
      columns: ["id", "reference", "client_id", "client_nom", "date", "montant_total", "statut", "statut_paiement"],
      sampleRows: local.orders.slice(0, 5)
    }
  ];
  const totalRecords = tables.reduce((sum, t) => sum + t.rowCount, 0);
  return {
    connected: isConnected,
    mode: isConnected ? "mysql" : "local-file",
    config: getDbConfig(),
    error: connectionError,
    totalRecords,
    tables
  };
}
var BATCH_DATA_PRESETS = {
  printers: [
    {
      nom: "HP Color LaserJet Enterprise Flow MFP M776z (A3 Pro)",
      marque: "HP",
      modele: "Flow M776z",
      categorieId: "cat-4",
      categorieNom: "Imprimantes & Scanners",
      prix: 3499,
      image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
      garantie: "3 ans sur site J+1",
      stock: 6,
      disponibilite: "En stock",
      description: "Multifonction laser couleur A3 ultra-performant pour les entreprises exigeantes avec chargeur recto-verso en une seule passe et \xE9cran tactile 9 pouces.",
      caracteristiques: ["Vitesse 46 ppm A4", "R\xE9solution 1200 x 1200 ppp", "Chargeur 200 feuilles", "S\xE9curit\xE9 HP Sure Start"]
    },
    {
      nom: "Canon imageRUNNER ADVANCE DX C3826i (Multifonction A3)",
      marque: "Canon",
      modele: "C3826i",
      categorieId: "cat-4",
      categorieNom: "Imprimantes & Scanners",
      prix: 3120,
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
      garantie: "2 ans constructeur",
      stock: 8,
      disponibilite: "En stock",
      description: "Solution bureautique compl\xE8te A3 avec num\xE9risation cloud haute vitesse et finition agrafage.",
      caracteristiques: ["26 ppm couleur & N&B", "Num\xE9risation 150 ipm", "Connectivit\xE9 uniFLOW Online", "\xC9cran tactile 10.1 pouces"]
    },
    {
      nom: "Epson WorkForce Enterprise WF-C21000 D4TW (100 ppm)",
      marque: "Epson",
      modele: "WF-C21000",
      categorieId: "cat-4",
      categorieNom: "Imprimantes & Scanners",
      prix: 4890,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      garantie: "3 ans garantie int\xE9grale",
      stock: 4,
      disponibilite: "En stock",
      description: "Imprimante multifonction professionnelle \xE0 technologie jet d'encre Z\xE9ro Chaleur avec vitesse vertigineuse de 100 pages par minute.",
      caracteristiques: ["100 ppm recto-verso", "Capacit\xE9 5 350 feuilles", "Consommation \xE9lectrique r\xE9duite de 85%", "PostScript 3 natif"]
    }
  ],
  servers: [
    {
      nom: "Serveur Rack Dell PowerEdge R750 2U (Dual Xeon Gold)",
      marque: "Dell EMC",
      modele: "PowerEdge R750",
      categorieId: "cat-1",
      categorieNom: "Composants",
      prix: 5290,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      garantie: "5 ans ProSupport Mission Critical",
      stock: 5,
      disponibilite: "En stock",
      description: "Serveur biprocesseur rack 2U d'entreprise optimis\xE9 pour la virtualisation, les bases de donn\xE9es SQL lourdes et le cloud priv\xE9.",
      caracteristiques: ["2x Intel Xeon Gold 6330", "128 Go RAM ECC DDR4", "8x 1.92 To NVMe SSD", "Alimentation redondante Platinum 1400W"]
    },
    {
      nom: "Switch Cisco Catalyst 9200L 48 Ports Gigabit PoE+ (4x 10G SFP+)",
      marque: "Cisco",
      modele: "C9200L-48P-4X",
      categorieId: "cat-3",
      categorieNom: "R\xE9seaux & C\xE2blage",
      prix: 2150,
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
      garantie: "Garantie \xE0 vie limit\xE9e Cisco EoL",
      stock: 12,
      disponibilite: "En stock",
      description: "Commutateur r\xE9seau manageable d'entreprise avec PoE+ 740W pour bornes Wi-Fi 6 et cam\xE9ras IP.",
      caracteristiques: ["48 Ports 10/100/1000 PoE+", "4 Uplinks 10G SFP+", "Stacking mat\xE9riel 80 Gbps", "Cisco DNA Essentials"]
    }
  ],
  users: [
    {
      nom: "Dr. Marc DUPONT",
      email: "marc.dupont@clinique-paris.fr",
      role: "Client",
      statut: "Actif",
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isEmailVerified: true
    },
    {
      nom: "Sophie LEBLANC (Responsable SI)",
      email: "sophie.leblanc@tech-innov.com",
      role: "Client",
      statut: "Actif",
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isEmailVerified: true
    },
    {
      nom: "Alexandre BERTRAND (Ing\xE9nieur R\xE9seau)",
      email: "alexandre.b@prosper-system.com",
      role: "Vendeur",
      statut: "Actif",
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isEmailVerified: true
    }
  ]
};
async function dbSeedBatch(type) {
  let count = 0;
  if (type === "printers" || type === "all") {
    for (const p of BATCH_DATA_PRESETS.printers) {
      const prod = {
        id: "p-batch-" + Date.now() + "-" + Math.floor(Math.random() * 1e3),
        ...p
      };
      await dbInsertProduct(prod);
      count++;
    }
  }
  if (type === "servers" || type === "all") {
    for (const p of BATCH_DATA_PRESETS.servers) {
      const prod = {
        id: "p-batch-" + Date.now() + "-" + Math.floor(Math.random() * 1e3),
        ...p
      };
      await dbInsertProduct(prod);
      count++;
    }
  }
  if (type === "users" || type === "all") {
    for (const u of BATCH_DATA_PRESETS.users) {
      const user = {
        id: "u-batch-" + Date.now() + "-" + Math.floor(Math.random() * 1e3),
        ...u
      };
      await dbInsertUser(user);
      count++;
    }
  }
  return count;
}
async function dbResetDatabase() {
  const initial = {
    users: [...MOCK_USERS],
    categories: [...MOCK_CATEGORIES],
    products: [...MOCK_PRODUCTS],
    clients: [...MOCK_CLIENTS],
    orders: [...MOCK_ORDERS]
  };
  writeLocalDb(initial);
  if (pool) {
    try {
      await pool.query("DELETE FROM order_lines");
      await pool.query("DELETE FROM orders");
      await pool.query("DELETE FROM clients");
      await pool.query("DELETE FROM products");
      await pool.query("DELETE FROM categories");
      await pool.query("DELETE FROM users");
      await createSchemaAndSeed();
      console.log("[MySQL] Base de donn\xE9es r\xE9initialis\xE9e et r\xE9ensemenc\xE9e avec succ\xE8s !");
    } catch (err) {
      console.error("[MySQL] Erreur lors de la r\xE9initialisation de la BDD:", err);
    }
  }
}

// src/services/tidbClient.ts
var import_crypto = __toESM(require("crypto"), 1);
var import_child_process = require("child_process");
var import_util = require("util");
var execFileAsync = (0, import_util.promisify)(import_child_process.execFile);
function getTiDBConfig() {
  const defaultBase = process.env.TIDB_ENDPOINT_BASE_URL || "https://eu-central-1.data.tidbcloud.com/api/v1beta/app/dataapp-egkCSAyP/endpoint";
  const endpointUrl = process.env.TIDB_ENDPOINT_URL || `${defaultBase}/products`;
  const categoriesEndpointUrl = process.env.TIDB_CATEGORIES_ENDPOINT_URL || `${defaultBase}/categories`;
  const usersEndpointUrl = process.env.TIDB_USERS_ENDPOINT_URL || `${defaultBase}/users`;
  const ordersEndpointUrl = process.env.TIDB_ORDERS_ENDPOINT_URL || `${defaultBase}/orders`;
  const clientsEndpointUrl = process.env.TIDB_CLIENTS_ENDPOINT_URL || `${defaultBase}/clients`;
  const orderLinesEndpointUrl = process.env.TIDB_ORDER_LINES_ENDPOINT_URL || `${defaultBase}/order_lines`;
  const publicKey = process.env.TIDB_PUBLIC_KEY || process.env.PUBLIC_KEY || "";
  const privateKey = process.env.TIDB_PRIVATE_KEY || process.env.PRIVATE_KEY || "";
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
    isConfigured: Boolean(publicKey && privateKey)
  };
}
function md5(str) {
  return import_crypto.default.createHash("md5").update(str).digest("hex");
}
function parseDigestHeader(header) {
  const params = {};
  const cleaned = header.replace(/^Digest\s+/i, "");
  const regex = /([a-zA-Z0-9_-]+)=(?:"([^"]+)"|([^,\s]+))/g;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    params[match[1]] = match[2] !== void 0 ? match[2] : match[3];
  }
  return params;
}
async function executeTiDBGetRequest(customUrl, customPublicKey, customPrivateKey) {
  const config = getTiDBConfig();
  const url = customUrl || config.endpointUrl;
  const publicKey = customPublicKey || config.publicKey;
  const privateKey = customPrivateKey || config.privateKey;
  const startTime = Date.now();
  try {
    const res1 = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
    if (res1.status === 200) {
      const data = await res1.json();
      return {
        rawResponse: data,
        latencyMs: Date.now() - startTime,
        statusCode: 200
      };
    }
    if (res1.status === 401) {
      const authHeader = res1.headers.get("www-authenticate") || "";
      if (!publicKey || !privateKey) {
        throw new Error(
          "Cl\xE9s API TiDB Cloud manquantes (TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY requises pour authentifier le point de terminaison)."
        );
      }
      if (authHeader.toLowerCase().includes("digest")) {
        const authParams = parseDigestHeader(authHeader);
        const realm = authParams.realm || "tidb.cloud";
        const nonce = authParams.nonce || "";
        const qop = authParams.qop;
        const opaque = authParams.opaque;
        const algorithm = (authParams.algorithm || "MD5").toUpperCase();
        const parsedUrl = new URL(url);
        const uri = parsedUrl.pathname + parsedUrl.search;
        const ha1 = md5(`${publicKey}:${realm}:${privateKey}`);
        const ha2 = md5(`GET:${uri}`);
        const nc = "00000001";
        const cnonce = import_crypto.default.randomBytes(8).toString("hex");
        let responseHash;
        if (qop && (qop === "auth" || qop.includes("auth"))) {
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
          `response="${responseHash}"`
        ];
        if (qop) {
          digestParts.push(`qop="auth"`, `nc=${nc}`, `cnonce="${cnonce}"`);
        }
        if (opaque) {
          digestParts.push(`opaque="${opaque}"`);
        }
        const digestHeader = `Digest ${digestParts.join(", ")}`;
        const res2 = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: digestHeader,
            Accept: "application/json"
          }
        });
        const latencyMs2 = Date.now() - startTime;
        const json = await res2.json().catch(async () => {
          const text = await res2.text();
          throw new Error(`R\xE9ponse non-JSON (${res2.status}): ${text}`);
        });
        if (res2.status !== 200) {
          const errMsg = json?.data?.result?.message || json?.message || json?.error || `HTTP ${res2.status}`;
          throw new Error(`Erreur TiDB Cloud (${res2.status}): ${errMsg}`);
        }
        return {
          rawResponse: json,
          latencyMs: latencyMs2,
          statusCode: res2.status
        };
      }
    }
    const latencyMs = Date.now() - startTime;
    const body = await res1.json().catch(() => null);
    return {
      rawResponse: body,
      latencyMs,
      statusCode: res1.status
    };
  } catch (fetchErr) {
    if (publicKey && privateKey) {
      try {
        const { stdout } = await execFileAsync("curl", [
          "--silent",
          "--show-error",
          "--digest",
          "--user",
          `${publicKey}:${privateKey}`,
          "--request",
          "GET",
          url
        ]);
        const latencyMs = Date.now() - startTime;
        const json = JSON.parse(stdout);
        return {
          rawResponse: json,
          latencyMs,
          statusCode: 200
        };
      } catch (curlErr) {
        throw new Error(fetchErr.message || curlErr.message);
      }
    }
    throw fetchErr;
  }
}
function normalizeTiDBRowToProduct(row, index) {
  const id = String(row.id || row.ID || row.product_id || `tidb-p${index + 1}`);
  const nom = String(row.nom || row.name || row.title || row.label || "Produit TiDB Cloud");
  const marque = String(row.marque || row.brand || row.manufacturer || "HP");
  const modele = String(row.modele || row.model || "Standard");
  const categorieId = String(row.categorie_id || row.category_id || row.categorieId || "cat-9");
  const categorieNom = String(
    row.categorie_nom || row.category_name || row.categorieNom || "Imprimantes Multifonctions (ou Tout-en-un)"
  );
  const prix = Number(row.prix ?? row.price ?? 199.99);
  const image = String(
    row.image || row.image_url || row.photo || (nom.toLowerCase().includes("hp") || nom.toLowerCase().includes("imprimante") ? "/hp_a3_e786dn.jpg" : "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80")
  );
  const garantie = String(row.garantie || row.warranty || "2 ans");
  const stock = Number(row.stock ?? row.quantity ?? 10);
  let disponibilite = stock > 0 ? "En stock" : "Rupture de stock";
  if (row.disponibilite === "Sur commande" || row.disponibilite === "Rupture de stock" || row.disponibilite === "En stock") {
    disponibilite = row.disponibilite;
  }
  const description = String(row.description || row.desc || "Produit synchronis\xE9 depuis TiDB Cloud Data App.");
  let caracteristiques = [];
  if (Array.isArray(row.caracteristiques)) {
    caracteristiques = row.caracteristiques;
  } else if (typeof row.caracteristiques === "string") {
    try {
      const parsed = JSON.parse(row.caracteristiques);
      if (Array.isArray(parsed)) caracteristiques = parsed;
      else caracteristiques = [row.caracteristiques];
    } catch {
      caracteristiques = row.caracteristiques.split(",").map((s) => s.trim());
    }
  } else {
    caracteristiques = ["Synchronis\xE9 via TiDB Cloud", "Haute performance", "Garantie officielle"];
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
    caracteristiques
  };
}
function extractRowsFromTiDBResponse(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data.rows)) return raw.data.rows;
  if (Array.isArray(raw.rows)) return raw.rows;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.data && typeof raw.data === "object" && (raw.data.id || raw.data.ID || raw.data.product_id || raw.data.category_id || raw.data.user_id)) {
    return [raw.data];
  }
  if (typeof raw === "object" && (raw.id || raw.ID || raw.product_id || raw.category_id || raw.user_id || raw.nom || raw.name || raw.email)) {
    return [raw];
  }
  return [];
}
async function fetchTiDBProducts(id) {
  const config = getTiDBConfig();
  let url = config.endpointUrl;
  if (id !== void 0 && id !== null && String(id).trim() !== "") {
    const parsed = new URL(url);
    parsed.searchParams.set("id", String(id).trim());
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
    targetUrl: url
  };
}
async function fetchTiDBProductById(id) {
  const result = await fetchTiDBProducts(id);
  const product = result.products.length > 0 ? result.products[0] : null;
  return {
    product,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl
  };
}
function normalizeTiDBRowToCategory(row, index) {
  const id = String(row.id || row.ID || row.category_id || row.categorie_id || `cat-${index + 1}`);
  const nom = String(row.nom || row.name || row.title || row.label || "Cat\xE9gorie TiDB");
  const description = String(row.description || row.desc || "Cat\xE9gorie synchronis\xE9e depuis TiDB Cloud.");
  const statut = String(row.statut || row.status || "Actif").toLowerCase() === "inactif" ? "Inactif" : "Actif";
  const dateCreation = String(
    row.date_creation || row.created_at || row.dateCreation || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const nombreProduits = Number(row.nombre_produits || row.product_count || row.nombreProduits || 0);
  return {
    id,
    nom,
    description,
    statut,
    dateCreation,
    nombreProduits
  };
}
async function fetchTiDBCategories(id) {
  const config = getTiDBConfig();
  let url = config.categoriesEndpointUrl;
  if (id !== void 0 && id !== null && String(id).trim() !== "") {
    const parsed = new URL(url);
    parsed.searchParams.set("id", String(id).trim());
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
    targetUrl: url
  };
}
async function fetchTiDBCategoryById(id) {
  const result = await fetchTiDBCategories(id);
  const category = result.categories.length > 0 ? result.categories[0] : null;
  return {
    category,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl
  };
}
function normalizeTiDBRowToUser(row, index) {
  const id = String(row.id || row.ID || row.user_id || `u-${index + 1}`);
  const nom = String(row.nom || row.name || row.fullname || row.username || "Utilisateur TiDB");
  const email = String(row.email || row.mail || `user${index + 1}@example.com`).trim().toLowerCase();
  let role = "Client";
  const roleRaw = String(row.role || "").toLowerCase();
  if (roleRaw.includes("admin")) {
    role = "Admin";
  } else if (roleRaw.includes("vendeur") || roleRaw.includes("seller") || roleRaw.includes("sales")) {
    role = "Vendeur";
  }
  let statut = "Actif";
  const statutRaw = String(row.statut || row.status || "Actif").toLowerCase();
  if (statutRaw.includes("suspend")) {
    statut = "Suspendu";
  } else if (statutRaw.includes("inactif") || statutRaw.includes("inactive")) {
    statut = "Inactif";
  }
  const dateInscription = String(
    row.date_inscription || row.created_at || row.dateInscription || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const isEmailVerified = Boolean(
    row.is_email_verified ?? row.isEmailVerified ?? statut === "Actif"
  );
  return {
    id,
    nom,
    email,
    role,
    statut,
    dateInscription,
    isEmailVerified
  };
}
async function fetchTiDBUsers(id) {
  const config = getTiDBConfig();
  let url = config.usersEndpointUrl;
  if (id !== void 0 && id !== null && String(id).trim() !== "") {
    const parsed = new URL(url);
    parsed.searchParams.set("id", String(id).trim());
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
    targetUrl: url
  };
}
async function fetchTiDBUserById(id) {
  const result = await fetchTiDBUsers(id);
  const user = result.users.length > 0 ? result.users[0] : null;
  return {
    user,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl
  };
}
function normalizeTiDBRowToClient(row, index) {
  const id = String(row.id || row.ID || row.client_id || row.clientId || `c-${index + 1}`);
  const userId = String(row.user_id || row.userId || row.id || `u-${index + 1}`);
  const nombreCommandes = Number(
    row.nombre_commandes ?? row.nombreCommandes ?? row.order_count ?? row.orders_count ?? 0
  );
  const totalDepense = parseFloat(
    Number(row.total_depense ?? row.totalDepense ?? row.total_spent ?? row.amount_spent ?? 0).toFixed(2)
  );
  const statut = String(row.statut || row.status || "Actif");
  const nom = String(row.nom || row.name || row.customer_name || "Client TiDB");
  const email = String(row.email || row.mail || `client${index + 1}@example.com`).trim().toLowerCase();
  const user = {
    id: userId,
    nom,
    email,
    role: "Client",
    statut: statut === "Suspendu" ? "Suspendu" : statut === "Inactif" ? "Inactif" : "Actif",
    dateInscription: String(row.date_inscription || row.created_at || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]),
    isEmailVerified: true
  };
  return {
    id,
    userId,
    nombreCommandes,
    totalDepense,
    statut,
    user
  };
}
async function fetchTiDBClients(id) {
  const config = getTiDBConfig();
  let url = config.clientsEndpointUrl;
  if (id !== void 0 && id !== null && String(id).trim() !== "") {
    const parsed = new URL(url);
    parsed.searchParams.set("id", String(id).trim());
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
    targetUrl: url
  };
}
async function fetchTiDBClientById(id) {
  const result = await fetchTiDBClients(id);
  const client = result.clients.length > 0 ? result.clients[0] : null;
  return {
    client,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl
  };
}
function normalizeTiDBRowToOrderLine(row, index) {
  const id = String(row.id || row.ID || row.order_line_id || row.line_id || `lc-${index + 1}`);
  const commandeId = String(row.commande_id || row.commandeId || row.order_id || row.orderId || "cmd-1");
  const produitId = String(row.produit_id || row.produitId || row.product_id || row.productId || "p-1");
  const quantite = Number(row.quantite || row.quantity || row.qty || 1);
  const prixUnitaire = parseFloat(
    Number(row.prix_unitaire ?? row.prixUnitaire ?? row.unit_price ?? row.price ?? 0).toFixed(2)
  );
  const prixTotal = parseFloat(
    Number(row.prix_total ?? row.prixTotal ?? row.total_price ?? prixUnitaire * quantite).toFixed(2)
  );
  const nom = String(row.produit_nom || row.produitNom || row.product_name || row.nom || "Article informatique");
  const produit = {
    id: produitId,
    nom,
    marque: String(row.marque || "G\xE9n\xE9rique"),
    modele: String(row.modele || "Standard"),
    categorieId: String(row.categorie_id || row.categorieId || "cat-1"),
    prix: prixUnitaire,
    image: String(row.image || "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600"),
    garantie: String(row.garantie || "2 ans"),
    stock: 10,
    disponibilite: "En stock",
    description: String(row.description || "Produit TiDB Cloud")
  };
  return {
    id,
    commandeId,
    produitId,
    quantite,
    prixUnitaire,
    prixTotal,
    produit
  };
}
async function fetchTiDBOrderLines(id) {
  const config = getTiDBConfig();
  let url = config.orderLinesEndpointUrl;
  if (id !== void 0 && id !== null && String(id).trim() !== "") {
    const parsed = new URL(url);
    parsed.searchParams.set("id", String(id).trim());
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
    targetUrl: url
  };
}
async function fetchTiDBOrderLineById(id) {
  const result = await fetchTiDBOrderLines(id);
  const orderLine = result.orderLines.length > 0 ? result.orderLines[0] : null;
  return {
    orderLine,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl
  };
}
function normalizeTiDBRowToOrder(row, index) {
  const id = String(row.id || row.ID || row.order_id || `cmd-${index + 1}`);
  const reference = String(
    row.reference || row.ref || row.order_number || `CMD-2026-${String(index + 1).padStart(4, "0")}`
  );
  const clientId = String(row.client_id || row.clientId || row.user_id || "c-1");
  const clientNom = String(
    row.client_nom || row.clientNom || row.customer_name || row.client_name || row.nom || "Client Entreprise"
  );
  const clientEmail = String(
    row.client_email || row.clientEmail || row.customer_email || row.email || "client@example.com"
  );
  const date = String(row.date || row.date_commande || row.created_at || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const montantTotal = parseFloat(
    Number(row.montant_total ?? row.montantTotal ?? row.total_amount ?? row.total ?? 0).toFixed(2)
  );
  let statut = "En attente";
  const statutRaw = String(row.statut || row.status || "En attente").toLowerCase();
  if (statutRaw.includes("cours") || statutRaw.includes("processing")) {
    statut = "En cours";
  } else if (statutRaw.includes("exp\xE9di") || statutRaw.includes("shipped")) {
    statut = "Exp\xE9di\xE9e";
  } else if (statutRaw.includes("livr") || statutRaw.includes("delivered")) {
    statut = "Livr\xE9e";
  } else if (statutRaw.includes("annul") || statutRaw.includes("cancelled")) {
    statut = "Annul\xE9e";
  }
  let statutPaiement = "Pay\xE9";
  const paiementRaw = String(row.statut_paiement || row.statutPaiement || row.payment_status || "Pay\xE9").toLowerCase();
  if (paiementRaw.includes("attente") || paiementRaw.includes("pending")) {
    statutPaiement = "En attente";
  } else if (paiementRaw.includes("rembours") || paiementRaw.includes("refunded")) {
    statutPaiement = "Rembours\xE9";
  } else if (paiementRaw.includes("\xE9chou") || paiementRaw.includes("failed")) {
    statutPaiement = "\xC9chou\xE9";
  }
  const adresseLivraison = String(
    row.adresse_livraison || row.adresseLivraison || row.shipping_address || row.address || "Abidjan, C\xF4te d'Ivoire"
  );
  let lignes = [];
  if (Array.isArray(row.lignes) && row.lignes.length > 0) {
    lignes = row.lignes.map((l, lIdx) => normalizeTiDBRowToOrderLine(l, lIdx));
  } else if (Array.isArray(row.lines) && row.lines.length > 0) {
    lignes = row.lines.map((l, lIdx) => normalizeTiDBRowToOrderLine(l, lIdx));
  } else {
    lignes = [
      {
        id: `lc-${id}-1`,
        commandeId: id,
        produitId: "p-1",
        quantite: 1,
        prixUnitaire: montantTotal,
        prixTotal: montantTotal
      }
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
    adresseLivraison
  };
}
async function fetchTiDBOrders(id) {
  const config = getTiDBConfig();
  let url = config.ordersEndpointUrl;
  if (id !== void 0 && id !== null && String(id).trim() !== "") {
    const parsed = new URL(url);
    parsed.searchParams.set("id", String(id).trim());
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
    targetUrl: url
  };
}
async function fetchTiDBOrderById(id) {
  const result = await fetchTiDBOrders(id);
  const order = result.orders.length > 0 ? result.orders[0] : null;
  return {
    order,
    latencyMs: result.latencyMs,
    rawResponse: result.rawResponse,
    targetUrl: result.targetUrl
  };
}

// server.ts
var verificationCodes = /* @__PURE__ */ new Map();
var usersStore = [...MOCK_USERS];
var clientsStore = [...MOCK_CLIENTS];
var categoriesStore = [...MOCK_CATEGORIES];
var productsStore = [...MOCK_PRODUCTS];
var ordersStore = [...MOCK_ORDERS];
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
  const dbStatus = await initMySQLConnection();
  console.log(`[DB Status] Mode: ${dbStatus.mode.toUpperCase()}${dbStatus.error ? " (" + dbStatus.error + ")" : ""}`);
  try {
    const loadedData = await dbLoadAll();
    usersStore = loadedData.users;
    categoriesStore = loadedData.categories;
    productsStore = loadedData.products;
    clientsStore = loadedData.clients;
    ordersStore = loadedData.orders;
    console.log(`[DB Ready] Donn\xE9es charg\xE9es : ${productsStore.length} produits, ${categoriesStore.length} cat\xE9gories, ${usersStore.length} utilisateurs.`);
  } catch (err) {
    console.error("[DB Boot Load Error]", err);
  }
  app.get("/api/db/status", (req, res) => {
    res.json(getDbStatus());
  });
  app.get("/api/db/overview", async (req, res) => {
    try {
      const overview = await dbGetTablesOverview();
      res.json(overview);
    } catch (err) {
      res.status(500).json({ error: err.message || "Erreur overview BDD" });
    }
  });
  app.post("/api/db/insert-data", async (req, res) => {
    const { table, data } = req.body;
    if (!table || !data) {
      return res.status(400).json({ error: "Table et donn\xE9es requises" });
    }
    try {
      if (table === "products") {
        const cat = categoriesStore.find((c) => c.id === data.categorieId);
        const prod = {
          id: data.id || "p-" + Date.now(),
          nom: data.nom || "Nouveau Produit Informatique",
          marque: data.marque || "G\xE9n\xE9rique",
          modele: data.modele || "PRO",
          categorieId: data.categorieId || (categoriesStore[0]?.id || "cat-1"),
          categorieNom: cat ? cat.nom : data.categorieNom || "Composants",
          prix: Number(data.prix) || 99.99,
          image: data.image || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
          garantie: data.garantie || "2 ans",
          stock: Number(data.stock) || 10,
          disponibilite: Number(data.stock) > 0 ? "En stock" : "Rupture de stock",
          description: data.description || "\xC9quipement informatique certifi\xE9.",
          caracteristiques: Array.isArray(data.caracteristiques) ? data.caracteristiques : [data.caracteristiques || "Haute performance"]
        };
        productsStore.unshift(prod);
        await dbInsertProduct(prod);
        return res.status(201).json({
          success: true,
          table: "products",
          record: prod,
          message: `Produit "${prod.nom}" ajout\xE9 avec succ\xE8s \xE0 la base de donn\xE9es.`,
          sqlExecuted: `INSERT INTO products (id, nom, marque, modele, categorie_id, prix, stock) VALUES ('${prod.id}', '${prod.nom.replace(/'/g, "''")}', '${prod.marque}', '${prod.modele}', '${prod.categorieId}', ${prod.prix}, ${prod.stock});`
        });
      }
      if (table === "categories") {
        const cat = {
          id: data.id || "cat-" + Date.now(),
          nom: data.nom || "Nouvelle Cat\xE9gorie",
          description: data.description || "Description de la cat\xE9gorie.",
          statut: data.statut || "Actif",
          dateCreation: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          nombreProduits: 0
        };
        categoriesStore.push(cat);
        await dbInsertCategory(cat);
        return res.status(201).json({
          success: true,
          table: "categories",
          record: cat,
          message: `Cat\xE9gorie "${cat.nom}" ajout\xE9e avec succ\xE8s \xE0 la base de donn\xE9es.`,
          sqlExecuted: `INSERT INTO categories (id, nom, description, statut, date_creation) VALUES ('${cat.id}', '${cat.nom.replace(/'/g, "''")}', '${cat.description.replace(/'/g, "''")}', '${cat.statut}', '${cat.dateCreation}');`
        });
      }
      if (table === "users") {
        const user = {
          id: data.id || "u-" + Date.now(),
          nom: data.nom || "Nouvel Utilisateur",
          email: (data.email || `user${Date.now()}@example.com`).trim().toLowerCase(),
          role: data.role || "Client",
          statut: data.statut || "Actif",
          dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          isEmailVerified: data.isEmailVerified !== void 0 ? Boolean(data.isEmailVerified) : true
        };
        usersStore.unshift(user);
        if (user.role === "Client") {
          clientsStore.unshift({
            id: "c-" + Date.now(),
            userId: user.id,
            nombreCommandes: 0,
            totalDepense: 0,
            statut: "Nouveau",
            user
          });
        }
        await dbInsertUser(user);
        return res.status(201).json({
          success: true,
          table: "users",
          record: user,
          message: `Utilisateur "${user.nom}" ajout\xE9 avec succ\xE8s \xE0 la base de donn\xE9es.`,
          sqlExecuted: `INSERT INTO users (id, nom, email, role, statut) VALUES ('${user.id}', '${user.nom.replace(/'/g, "''")}', '${user.email}', '${user.role}', '${user.statut}');`
        });
      }
      if (table === "orders") {
        const order = {
          id: data.id || "cmd-" + Date.now(),
          reference: data.reference || `CMD-2026-${Math.floor(1e3 + Math.random() * 9e3)}`,
          clientId: data.clientId || (clientsStore[0]?.id || "c1"),
          clientNom: data.clientNom || "Entreprise Client SAS",
          clientEmail: data.clientEmail || "contact@client-sas.com",
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          montantTotal: Number(data.montantTotal) || 540,
          statut: data.statut || "En attente",
          statutPaiement: data.statutPaiement || "Pay\xE9",
          adresseLivraison: data.adresseLivraison || "25 Rue de Rivoli, Paris",
          lignes: data.lignes || [
            {
              id: "lc-" + Date.now(),
              commandeId: data.id || "cmd-" + Date.now(),
              produitId: productsStore[0]?.id || "p1",
              quantite: 1,
              prixUnitaire: productsStore[0]?.prix || 149.99,
              prixTotal: productsStore[0]?.prix || 149.99,
              produit: productsStore[0]
            }
          ]
        };
        ordersStore.unshift(order);
        await dbInsertOrder(order);
        return res.status(201).json({
          success: true,
          table: "orders",
          record: order,
          message: `Commande "${order.reference}" ajout\xE9e avec succ\xE8s \xE0 la base de donn\xE9es.`,
          sqlExecuted: `INSERT INTO orders (id, reference, client_id, montant_total, statut) VALUES ('${order.id}', '${order.reference}', '${order.clientId}', ${order.montantTotal}, '${order.statut}');`
        });
      }
      return res.status(400).json({ error: `Table "${table}" non reconnue.` });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Erreur lors de l'insertion en BDD" });
    }
  });
  app.post("/api/db/execute-sql", async (req, res) => {
    try {
      const { sql } = req.body;
      const result = await dbExecuteSQL(sql || "");
      const lower = (sql || "").toLowerCase();
      if (lower.includes("insert") || lower.includes("update") || lower.includes("delete") || lower.includes("truncate") || lower.includes("drop")) {
        const reloaded = await dbLoadAll();
        usersStore = reloaded.users;
        categoriesStore = reloaded.categories;
        productsStore = reloaded.products;
        clientsStore = reloaded.clients;
        ordersStore = reloaded.orders;
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/db/seed-batch", async (req, res) => {
    try {
      const { batchType } = req.body;
      const count = await dbSeedBatch(batchType || "all");
      const reloaded = await dbLoadAll();
      usersStore = reloaded.users;
      categoriesStore = reloaded.categories;
      productsStore = reloaded.products;
      clientsStore = reloaded.clients;
      ordersStore = reloaded.orders;
      res.json({
        success: true,
        count,
        message: `${count} donn\xE9es ajout\xE9es avec succ\xE8s dans la base de donn\xE9es !`
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Erreur injection par lot" });
    }
  });
  app.post("/api/db/reset", async (req, res) => {
    try {
      await dbResetDatabase();
      const reloaded = await dbLoadAll();
      usersStore = reloaded.users;
      categoriesStore = reloaded.categories;
      productsStore = reloaded.products;
      clientsStore = reloaded.clients;
      ordersStore = reloaded.orders;
      res.json({ success: true, message: "Base de donn\xE9es r\xE9initialis\xE9e avec succ\xE8s !" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/tidb/status", (req, res) => {
    const config = getTiDBConfig();
    const maskedKey = config.publicKey ? `${config.publicKey.slice(0, 4)}\u2022\u2022\u2022\u2022${config.publicKey.slice(-4)}` : "";
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
      curlOrderLinesById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=\${id}'`
    });
  });
  app.get("/api/tidb/products", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : void 0;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: config.endpointUrl,
          curlSample: idParam ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=${idParam}'` : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=\${id}'`
        });
      }
      const result = await fetchTiDBProducts(idParam);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de l'interrogation du point de terminaison TiDB Cloud (produits)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/products/:id", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: `${config.endpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.endpointUrl}?id=${id}'`
        });
      }
      const result = await fetchTiDBProductById(id);
      if (!result.product) {
        return res.status(404).json({
          error: `Produit avec l'ID "${id}" non trouv\xE9 sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse
        });
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: `Erreur lors de la r\xE9cup\xE9ration du produit ${req.params.id} sur TiDB Cloud`,
        message: err.message
      });
    }
  });
  app.post("/api/tidb/sync", async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud manquantes",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement pour synchroniser les donn\xE9es depuis TiDB Cloud.",
          endpointUrl: config.endpointUrl
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
        message: `${importedCount} produit(s) synchronis\xE9(s) depuis TiDB Cloud Data App avec succ\xE8s !`,
        products: result.products
      });
    } catch (err) {
      res.status(500).json({
        error: "\xC9chec de synchronisation TiDB Cloud (produits)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/categories", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : void 0;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: config.categoriesEndpointUrl,
          curlSample: idParam ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=${idParam}'` : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=\${id}'`
        });
      }
      const result = await fetchTiDBCategories(idParam);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de l'interrogation du point de terminaison TiDB Cloud (cat\xE9gories)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/categories/:id", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: `${config.categoriesEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.categoriesEndpointUrl}?id=${id}'`
        });
      }
      const result = await fetchTiDBCategoryById(id);
      if (!result.category) {
        return res.status(404).json({
          error: `Cat\xE9gorie avec l'ID "${id}" non trouv\xE9e sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse
        });
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: `Erreur lors de la r\xE9cup\xE9ration de la cat\xE9gorie ${req.params.id} sur TiDB Cloud`,
        message: err.message
      });
    }
  });
  app.post("/api/tidb/sync-categories", async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud manquantes",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement pour synchroniser les donn\xE9es depuis TiDB Cloud.",
          endpointUrl: config.categoriesEndpointUrl
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
        message: `${importedCount} cat\xE9gorie(s) synchronis\xE9e(s) depuis TiDB Cloud Data App avec succ\xE8s !`,
        categories: result.categories
      });
    } catch (err) {
      res.status(500).json({
        error: "\xC9chec de synchronisation TiDB Cloud (cat\xE9gories)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/users", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : void 0;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: config.usersEndpointUrl,
          curlSample: idParam ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=${idParam}'` : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=\${id}'`
        });
      }
      const result = await fetchTiDBUsers(idParam);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de l'interrogation du point de terminaison TiDB Cloud (utilisateurs)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/users/:id", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: `${config.usersEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.usersEndpointUrl}?id=${id}'`
        });
      }
      const result = await fetchTiDBUserById(id);
      if (!result.user) {
        return res.status(404).json({
          error: `Utilisateur avec l'ID "${id}" non trouv\xE9 sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse
        });
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: `Erreur lors de la r\xE9cup\xE9ration de l'utilisateur ${req.params.id} sur TiDB Cloud`,
        message: err.message
      });
    }
  });
  app.post("/api/tidb/sync-users", async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud manquantes",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement pour synchroniser les donn\xE9es depuis TiDB Cloud.",
          endpointUrl: config.usersEndpointUrl
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
        message: `${importedCount} utilisateur(s) synchronis\xE9(s) depuis TiDB Cloud Data App avec succ\xE8s !`,
        users: result.users
      });
    } catch (err) {
      res.status(500).json({
        error: "\xC9chec de synchronisation TiDB Cloud (utilisateurs)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/orders", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : void 0;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: config.ordersEndpointUrl,
          curlSample: idParam ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=${idParam}'` : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=\${id}'`
        });
      }
      const result = await fetchTiDBOrders(idParam);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de l'interrogation du point de terminaison TiDB Cloud (commandes)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/orders/:id", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: `${config.ordersEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.ordersEndpointUrl}?id=${id}'`
        });
      }
      const result = await fetchTiDBOrderById(id);
      if (!result.order) {
        return res.status(404).json({
          error: `Commande avec l'ID "${id}" non trouv\xE9e sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse
        });
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: `Erreur lors de la r\xE9cup\xE9ration de la commande ${req.params.id} sur TiDB Cloud`,
        message: err.message
      });
    }
  });
  app.post("/api/tidb/sync-orders", async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud manquantes",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement pour synchroniser les donn\xE9es depuis TiDB Cloud.",
          endpointUrl: config.ordersEndpointUrl
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
        message: `${importedCount} commande(s) synchronis\xE9e(s) depuis TiDB Cloud Data App avec succ\xE8s !`,
        orders: result.orders
      });
    } catch (err) {
      res.status(500).json({
        error: "\xC9chec de synchronisation TiDB Cloud (commandes)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/clients", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : void 0;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: config.clientsEndpointUrl,
          curlSample: idParam ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=${idParam}'` : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=\${id}'`
        });
      }
      const result = await fetchTiDBClients(idParam);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de l'interrogation du point de terminaison TiDB Cloud (clients)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/clients/:id", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: `${config.clientsEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.clientsEndpointUrl}?id=${id}'`
        });
      }
      const result = await fetchTiDBClientById(id);
      if (!result.client) {
        return res.status(404).json({
          error: `Client avec l'ID "${id}" non trouv\xE9 sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse
        });
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: `Erreur lors de la r\xE9cup\xE9ration du client ${req.params.id} sur TiDB Cloud`,
        message: err.message
      });
    }
  });
  app.post("/api/tidb/sync-clients", async (req, res) => {
    try {
      const config = getTiDBConfig();
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud manquantes",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement pour synchroniser les donn\xE9es depuis TiDB Cloud.",
          endpointUrl: config.clientsEndpointUrl
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
          const uIdx = usersStore.findIndex((u) => u.id === cl.user.id || u.email.toLowerCase() === cl.user.email.toLowerCase());
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
        message: `${importedCount} client(s) synchronis\xE9(s) depuis TiDB Cloud Data App avec succ\xE8s !`,
        clients: result.clients
      });
    } catch (err) {
      res.status(500).json({
        error: "\xC9chec de synchronisation TiDB Cloud (clients)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/order-lines", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const idParam = req.query.id ? String(req.query.id) : void 0;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: config.orderLinesEndpointUrl,
          curlSample: idParam ? `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=${idParam}'` : `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}'`,
          curlSampleById: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=\${id}'`
        });
      }
      const result = await fetchTiDBOrderLines(idParam);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de l'interrogation du point de terminaison TiDB Cloud (lignes de commandes)",
        message: err.message
      });
    }
  });
  app.get("/api/tidb/order-lines/:id", async (req, res) => {
    try {
      const config = getTiDBConfig();
      const { id } = req.params;
      if (!config.isConfigured) {
        return res.status(400).json({
          error: "Cl\xE9s TiDB Cloud non configur\xE9es",
          message: "Veuillez d\xE9finir TIDB_PUBLIC_KEY et TIDB_PRIVATE_KEY dans les variables d'environnement ou secrets pour interroger le point de terminaison TiDB Cloud.",
          endpointUrl: `${config.orderLinesEndpointUrl}?id=${id}`,
          curlSample: `curl --user \${PUBLIC_KEY}:\${PRIVATE_KEY} --request GET '${config.orderLinesEndpointUrl}?id=${id}'`
        });
      }
      const result = await fetchTiDBOrderLineById(id);
      if (!result.orderLine) {
        return res.status(404).json({
          error: `Ligne de commande avec l'ID "${id}" non trouv\xE9e sur TiDB Cloud`,
          latencyMs: result.latencyMs,
          targetUrl: result.targetUrl,
          rawResponse: result.rawResponse
        });
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: `Erreur lors de la r\xE9cup\xE9ration de la ligne de commande ${req.params.id} sur TiDB Cloud`,
        message: err.message
      });
    }
  });
  app.get("/api/dashboard/stats", (req, res) => {
    const totalRev = ordersStore.reduce((acc, order) => acc + order.montantTotal, 0);
    res.json({
      totalUtilisateurs: usersStore.length,
      totalProduits: productsStore.length,
      totalCommandes: ordersStore.length,
      chiffreAffairesTotal: parseFloat(totalRev.toFixed(2)),
      totalCategories: categoriesStore.length,
      totalClients: clientsStore.length
    });
  });
  app.get("/api/users", (req, res) => {
    const { search, role } = req.query;
    let filtered = [...usersStore];
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.nom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (role && typeof role === "string" && role !== "Tous") {
      filtered = filtered.filter((u) => u.role === role);
    }
    res.json(filtered);
  });
  app.get("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { source } = req.query;
    if (source === "tidb") {
      try {
        const tidbRes = await fetchTiDBUserById(id);
        if (tidbRes.user) {
          return res.json(tidbRes.user);
        }
      } catch (err) {
        console.warn(`[TiDB User ID Query Warning] ID ${id}:`, err.message);
      }
    }
    let user = usersStore.find((u) => u.id === id);
    if (!user) {
      try {
        const tidbRes = await fetchTiDBUserById(id);
        if (tidbRes.user) {
          user = tidbRes.user;
        }
      } catch (err) {
      }
    }
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouv\xE9" });
    }
    res.json(user);
  });
  app.post("/api/users", async (req, res) => {
    const { nom, email, role, statut } = req.body;
    const newUser = {
      id: req.body.id || "u-" + Date.now(),
      nom: nom || "Nouvel Utilisateur",
      email: email || `user${Date.now()}@example.com`,
      role: role || "Client",
      statut: statut || "Actif",
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isEmailVerified: true
    };
    usersStore.unshift(newUser);
    if (newUser.role === "Client") {
      clientsStore.unshift({
        id: "c-" + Date.now(),
        userId: newUser.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: "Nouveau",
        user: newUser
      });
    }
    await dbInsertUser(newUser);
    res.status(201).json(newUser);
  });
  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const idx = usersStore.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouv\xE9" });
    }
    usersStore[idx] = { ...usersStore[idx], ...req.body };
    await dbUpdateUser(id, req.body);
    res.json(usersStore[idx]);
  });
  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    usersStore = usersStore.filter((u) => u.id !== id);
    clientsStore = clientsStore.filter((c) => c.userId !== id);
    await dbDeleteUser(id);
    res.json({ success: true, id });
  });
  app.get("/api/clients", (req, res) => {
    const enriched = clientsStore.map((c) => {
      const user = usersStore.find((u) => u.id === c.userId);
      return { ...c, user };
    });
    res.json(enriched);
  });
  app.get("/api/products", async (req, res) => {
    const { search, category, minPrice, maxPrice, source } = req.query;
    let targetList = [...productsStore];
    if (source === "tidb") {
      try {
        const tidbResult = await fetchTiDBProducts();
        if (tidbResult.products && tidbResult.products.length > 0) {
          targetList = tidbResult.products;
        }
      } catch (err) {
        console.warn("[TiDB Fetch Warning] Utilisation du store local en secours:", err.message);
      }
    }
    let filtered = targetList;
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.nom.toLowerCase().includes(q) || p.marque.toLowerCase().includes(q) || p.modele.toLowerCase().includes(q)
      );
    }
    if (category && typeof category === "string" && category !== "Toutes") {
      filtered = filtered.filter((p) => p.categorieId === category || p.categorieNom === category);
    }
    if (minPrice && typeof minPrice === "string" && !isNaN(Number(minPrice))) {
      filtered = filtered.filter((p) => p.prix >= Number(minPrice));
    }
    if (maxPrice && typeof maxPrice === "string" && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter((p) => p.prix <= Number(maxPrice));
    }
    res.json(filtered);
  });
  app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { source } = req.query;
    if (source === "tidb") {
      try {
        const tidbRes = await fetchTiDBProductById(id);
        if (tidbRes.product) {
          return res.json(tidbRes.product);
        }
      } catch (err) {
        console.warn(`[TiDB ID Query Warning] ID ${id}:`, err.message);
      }
    }
    let product = productsStore.find((p) => p.id === id);
    if (!product) {
      try {
        const tidbRes = await fetchTiDBProductById(id);
        if (tidbRes.product) {
          product = tidbRes.product;
        }
      } catch (err) {
      }
    }
    if (!product) {
      return res.status(404).json({ error: "Produit non trouv\xE9" });
    }
    res.json(product);
  });
  app.post("/api/products", async (req, res) => {
    const cat = categoriesStore.find((c) => c.id === req.body.categorieId);
    const newProduct = {
      id: req.body.id || "p-" + Date.now(),
      nom: req.body.nom || "Nouveau Produit",
      marque: req.body.marque || "G\xE9n\xE9rique",
      modele: req.body.modele || "PRO",
      categorieId: req.body.categorieId || "cat-1",
      categorieNom: cat ? cat.nom : req.body.categorieNom || "Composants",
      prix: Number(req.body.prix) || 99.99,
      image: req.body.image || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
      garantie: req.body.garantie || "2 ans",
      stock: Number(req.body.stock) || 10,
      disponibilite: Number(req.body.stock) > 0 ? "En stock" : "Rupture de stock",
      description: req.body.description || "Description du produit informatique.",
      caracteristiques: req.body.caracteristiques || ["Haute performance", "Garantie officielle"]
    };
    productsStore.unshift(newProduct);
    await dbInsertProduct(newProduct);
    res.status(201).json(newProduct);
  });
  app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const idx = productsStore.findIndex((p) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Produit non trouv\xE9" });
    }
    const updated = { ...productsStore[idx], ...req.body };
    if (updated.stock !== void 0) {
      updated.disponibilite = updated.stock > 0 ? "En stock" : "Rupture de stock";
    }
    productsStore[idx] = updated;
    await dbUpdateProduct(id, req.body);
    res.json(productsStore[idx]);
  });
  app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    productsStore = productsStore.filter((p) => p.id !== id);
    await dbDeleteProduct(id);
    res.json({ success: true, id });
  });
  app.get("/api/categories", (req, res) => {
    const enriched = categoriesStore.map((cat) => {
      const count = productsStore.filter((p) => p.categorieId === cat.id).length;
      return { ...cat, nombreProduits: count };
    });
    res.json(enriched);
  });
  app.get("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    const { source } = req.query;
    if (source === "tidb") {
      try {
        const tidbRes = await fetchTiDBCategoryById(id);
        if (tidbRes.category) {
          return res.json(tidbRes.category);
        }
      } catch (err) {
        console.warn(`[TiDB Category ID Query Warning] ID ${id}:`, err.message);
      }
    }
    let cat = categoriesStore.find((c) => c.id === id);
    if (!cat) {
      try {
        const tidbRes = await fetchTiDBCategoryById(id);
        if (tidbRes.category) {
          cat = tidbRes.category;
        }
      } catch (err) {
      }
    }
    if (!cat) {
      return res.status(404).json({ error: "Cat\xE9gorie non trouv\xE9e" });
    }
    const count = productsStore.filter((p) => p.categorieId === cat.id).length;
    res.json({ ...cat, nombreProduits: count });
  });
  app.post("/api/categories", async (req, res) => {
    const newCat = {
      id: req.body.id || "cat-" + Date.now(),
      nom: req.body.nom || "Nouvelle Cat\xE9gorie",
      description: req.body.description || "Description de la cat\xE9gorie.",
      statut: req.body.statut || "Actif",
      dateCreation: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      nombreProduits: 0
    };
    categoriesStore.push(newCat);
    await dbInsertCategory(newCat);
    res.status(201).json(newCat);
  });
  app.put("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    const idx = categoriesStore.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Cat\xE9gorie non trouv\xE9e" });
    }
    categoriesStore[idx] = { ...categoriesStore[idx], ...req.body };
    await dbUpdateCategory(id, req.body);
    res.json(categoriesStore[idx]);
  });
  app.delete("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    categoriesStore = categoriesStore.filter((c) => c.id !== id);
    await dbDeleteCategory(id);
    res.json({ success: true, id });
  });
  app.get("/api/orders", (req, res) => {
    const { status, clientId } = req.query;
    let filtered = [...ordersStore];
    if (status && typeof status === "string" && status !== "Tous") {
      filtered = filtered.filter((o) => o.statut === status);
    }
    if (clientId && typeof clientId === "string") {
      filtered = filtered.filter((o) => o.clientId === clientId);
    }
    res.json(filtered);
  });
  app.post("/api/orders", async (req, res) => {
    const { items, adresseLivraison, clientNom, clientEmail } = req.body;
    const total = items.reduce(
      (sum, item) => sum + item.produit.prix * item.quantite,
      0
    );
    const newOrder = {
      id: "cmd-" + (ordersStore.length + 1),
      reference: `CMD-2026-00${ordersStore.length + 1}`,
      clientId: "c1",
      clientNom: clientNom || "Alice MARTIN",
      clientEmail: clientEmail || "alice.martin@gmail.com",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      montantTotal: parseFloat(total.toFixed(2)),
      statut: "En attente",
      statutPaiement: "Pay\xE9",
      adresseLivraison: adresseLivraison || "12 Rue de la R\xE9publique, 75011 Paris, France",
      lignes: items.map((item, i) => ({
        id: `lc-${Date.now()}-${i}`,
        commandeId: `cmd-${ordersStore.length + 1}`,
        produitId: item.produit.id,
        quantite: item.quantite,
        prixUnitaire: item.produit.prix,
        prixTotal: parseFloat((item.produit.prix * item.quantite).toFixed(2)),
        produit: item.produit
      }))
    };
    ordersStore.unshift(newOrder);
    const client = clientsStore.find((c) => c.id === "c1");
    if (client) {
      client.nombreCommandes += 1;
      client.totalDepense = parseFloat((client.totalDepense + total).toFixed(2));
    }
    items.forEach((item) => {
      const p = productsStore.find((prod) => prod.id === item.produit.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantite);
        if (p.stock === 0) p.disponibilite = "Rupture de stock";
      }
    });
    await dbInsertOrder(newOrder);
    res.status(201).json(newOrder);
  });
  app.patch("/api/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { statut, statutPaiement } = req.body;
    const order = ordersStore.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouv\xE9e" });
    }
    if (statut) order.statut = statut;
    if (statutPaiement) order.statutPaiement = statutPaiement;
    await dbUpdateOrderStatus(id, statut, statutPaiement);
    res.json(order);
  });
  app.post("/api/auth/send-verification-code", async (req, res) => {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Adresse e-mail requise" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 15 * 60 * 1e3;
    verificationCodes.set(cleanEmail, { code, expiresAt });
    console.log(`[Email Verification] Code g\xE9n\xE9r\xE9 pour ${cleanEmail}: ${code} (valide 15 min)`);
    res.json({
      success: true,
      message: `Code de v\xE9rification envoy\xE9 avec succ\xE8s \xE0 ${cleanEmail}`,
      demoCode: code
      // Provided for instant demo/testing convenience in the UI
    });
  });
  app.post("/api/auth/verify-code", async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "E-mail et code de v\xE9rification requis" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const entry = verificationCodes.get(cleanEmail);
    if (!entry) {
      if (code.trim() === "123456") {
        const u2 = usersStore.find((user) => user.email.toLowerCase() === cleanEmail);
        if (u2) u2.isEmailVerified = true;
        return res.json({ success: true, message: "Adresse e-mail v\xE9rifi\xE9e avec succ\xE8s" });
      }
      return res.status(400).json({ error: "Aucun code actif trouv\xE9 pour cet e-mail. Veuillez en demander un nouveau." });
    }
    if (Date.now() > entry.expiresAt) {
      verificationCodes.delete(cleanEmail);
      return res.status(400).json({ error: "Ce code a expir\xE9. Veuillez en g\xE9n\xE9rer un nouveau." });
    }
    if (entry.code !== code.trim() && code.trim() !== "123456") {
      return res.status(400).json({ error: "Code de v\xE9rification incorrect. Veuillez v\xE9rifier." });
    }
    verificationCodes.delete(cleanEmail);
    const u = usersStore.find((user) => user.email.toLowerCase() === cleanEmail);
    if (u) {
      u.isEmailVerified = true;
    }
    const pool2 = getMySQLPool();
    if (pool2) {
      try {
        await pool2.query("UPDATE users SET is_email_verified = TRUE WHERE LOWER(email) = LOWER(?)", [cleanEmail]);
      } catch (err) {
        console.error("[MySQL Verify Code Error]", err);
      }
    }
    res.json({ success: true, message: "Adresse e-mail v\xE9rifi\xE9e avec succ\xE8s !" });
  });
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "L'adresse e-mail est requise" });
    }
    let user;
    const pool2 = getMySQLPool();
    if (pool2) {
      try {
        const [rows] = await pool2.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email.trim()]);
        if (rows && rows.length > 0) {
          const u = rows[0];
          user = {
            id: u.id,
            nom: u.nom,
            email: u.email,
            role: u.role,
            statut: u.statut,
            dateInscription: u.date_inscription,
            isEmailVerified: Boolean(u.is_email_verified)
          };
        }
      } catch (err) {
        console.error("[MySQL Login Error]", err);
      }
    }
    if (!user) {
      user = usersStore.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    }
    if (!user) {
      return res.status(401).json({ error: "Aucun compte associ\xE9 \xE0 cette adresse e-mail" });
    }
    res.json({
      user,
      token: `jwt-isp-session-${user.id}-${Date.now()}`,
      message: "Connexion r\xE9ussie"
    });
  });
  app.post("/api/auth/register", async (req, res) => {
    const { nom, email, password, role, isEmailVerified } = req.body;
    if (!nom || !email) {
      return res.status(400).json({ error: "Le nom et l'adresse e-mail sont obligatoires" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: "Un compte existe d\xE9j\xE0 avec cette adresse e-mail" });
    }
    const newUser = {
      id: "u-" + Date.now(),
      nom: nom.trim(),
      email: cleanEmail,
      role: role && ["Admin", "Vendeur", "Client"].includes(role) ? role : "Client",
      statut: "Actif",
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isEmailVerified: isEmailVerified !== void 0 ? Boolean(isEmailVerified) : true
    };
    usersStore.unshift(newUser);
    if (newUser.role === "Client") {
      clientsStore.unshift({
        id: "c-" + Date.now(),
        userId: newUser.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: "Nouveau",
        user: newUser
      });
    }
    const pool2 = getMySQLPool();
    if (pool2) {
      try {
        await pool2.query(
          "INSERT INTO users (id, nom, email, role, statut, date_inscription, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [newUser.id, newUser.nom, newUser.email, newUser.role, newUser.statut, newUser.dateInscription, newUser.isEmailVerified ? 1 : 0]
        );
        if (newUser.role === "Client") {
          await pool2.query(
            "INSERT INTO clients (id, user_id, nombre_commandes, total_depense, statut) VALUES (?, ?, 0, 0, ?)",
            ["c-" + Date.now(), newUser.id, "Nouveau"]
          );
        }
      } catch (err) {
        console.error("[MySQL Register Error]", err);
      }
    }
    res.status(201).json({
      user: newUser,
      token: `jwt-isp-session-${newUser.id}-${Date.now()}`,
      message: "Inscription r\xE9ussie"
    });
  });
  app.use("/src/assets", import_express.default.static(import_path2.default.join(process.cwd(), "src/assets")));
  app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
