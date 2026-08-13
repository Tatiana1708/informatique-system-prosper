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
var import_path = __toESM(require("path"), 1);
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
  photoUrl: "../assets/images/president_photo_1785842468088.jpg",
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
var import_promise = __toESM(require("mysql2/promise"), 1);
var pool = null;
var isConnected = false;
var connectionError = void 0;
function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "informatique_system_prosper"
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
      date_inscription VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
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
      image TEXT,
      garantie VARCHAR(50),
      stock INT NOT NULL DEFAULT 0,
      disponibilite VARCHAR(50) NOT NULL,
      description TEXT,
      caracteristiques JSON
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
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
  const [catRows] = await pool.query("SELECT COUNT(*) as count FROM categories");
  if (catRows[0].count === 0) {
    console.log("[MySQL] Seeding initial categories...");
    for (const c of MOCK_CATEGORIES) {
      await pool.query(
        "INSERT INTO categories (id, nom, description, statut, date_creation) VALUES (?, ?, ?, ?, ?)",
        [c.id, c.nom, c.description, c.statut, c.dateCreation]
      );
    }
  }
  const [prodRows] = await pool.query("SELECT COUNT(*) as count FROM products");
  if (prodRows[0].count === 0) {
    console.log("[MySQL] Seeding initial products...");
    for (const p of MOCK_PRODUCTS) {
      await pool.query(
        "INSERT INTO products (id, nom, marque, modele, categorie_id, categorie_nom, prix, image, garantie, stock, disponibilite, description, caracteristiques) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

// server.ts
var usersStore = [...MOCK_USERS];
var clientsStore = [...MOCK_CLIENTS];
var categoriesStore = [...MOCK_CATEGORIES];
var productsStore = [...MOCK_PRODUCTS];
var ordersStore = [...MOCK_ORDERS];
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const dbStatus = await initMySQLConnection();
  console.log(`[DB Status] Mode: ${dbStatus.mode.toUpperCase()}${dbStatus.error ? " (" + dbStatus.error + ")" : ""}`);
  app.get("/api/db/status", (req, res) => {
    res.json(getDbStatus());
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
  app.post("/api/users", (req, res) => {
    const { nom, email, role, statut } = req.body;
    const newUser = {
      id: "u" + (usersStore.length + 1),
      nom: nom || "Nouvel Utilisateur",
      email: email || `user${Date.now()}@example.com`,
      role: role || "Client",
      statut: statut || "Actif",
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    usersStore.push(newUser);
    if (newUser.role === "Client") {
      clientsStore.push({
        id: "c" + (clientsStore.length + 1),
        userId: newUser.id,
        nombreCommandes: 0,
        totalDepense: 0,
        statut: "Nouveau",
        user: newUser
      });
    }
    res.status(201).json(newUser);
  });
  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const idx = usersStore.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouv\xE9" });
    }
    usersStore[idx] = { ...usersStore[idx], ...req.body };
    res.json(usersStore[idx]);
  });
  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    usersStore = usersStore.filter((u) => u.id !== id);
    clientsStore = clientsStore.filter((c) => c.userId !== id);
    res.json({ success: true, id });
  });
  app.get("/api/clients", (req, res) => {
    const enriched = clientsStore.map((c) => {
      const user = usersStore.find((u) => u.id === c.userId);
      return { ...c, user };
    });
    res.json(enriched);
  });
  app.get("/api/products", (req, res) => {
    const { search, category, minPrice, maxPrice } = req.query;
    let filtered = [...productsStore];
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
  app.get("/api/products/:id", (req, res) => {
    const product = productsStore.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Produit non trouv\xE9" });
    }
    res.json(product);
  });
  app.post("/api/products", (req, res) => {
    const cat = categoriesStore.find((c) => c.id === req.body.categorieId);
    const newProduct = {
      id: "p" + (productsStore.length + 1),
      nom: req.body.nom || "Nouveau Produit",
      marque: req.body.marque || "G\xE9n\xE9rique",
      modele: req.body.modele || "PRO",
      categorieId: req.body.categorieId || "cat-1",
      categorieNom: cat ? cat.nom : "Composants",
      prix: Number(req.body.prix) || 99.99,
      image: req.body.image || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
      garantie: req.body.garantie || "2 ans",
      stock: Number(req.body.stock) || 10,
      disponibilite: Number(req.body.stock) > 0 ? "En stock" : "Rupture de stock",
      description: req.body.description || "Description du produit informatique.",
      caracteristiques: req.body.caracteristiques || ["Haute performance", "Garantie officielle"]
    };
    productsStore.push(newProduct);
    res.status(201).json(newProduct);
  });
  app.put("/api/products/:id", (req, res) => {
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
    res.json(productsStore[idx]);
  });
  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    productsStore = productsStore.filter((p) => p.id !== id);
    res.json({ success: true, id });
  });
  app.get("/api/categories", (req, res) => {
    const enriched = categoriesStore.map((cat) => {
      const count = productsStore.filter((p) => p.categorieId === cat.id).length;
      return { ...cat, nombreProduits: count };
    });
    res.json(enriched);
  });
  app.post("/api/categories", (req, res) => {
    const newCat = {
      id: "cat-" + (categoriesStore.length + 1),
      nom: req.body.nom || "Nouvelle Cat\xE9gorie",
      description: req.body.description || "Description de la cat\xE9gorie.",
      statut: "Actif",
      dateCreation: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      nombreProduits: 0
    };
    categoriesStore.push(newCat);
    res.status(201).json(newCat);
  });
  app.put("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    const idx = categoriesStore.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Cat\xE9gorie non trouv\xE9e" });
    }
    categoriesStore[idx] = { ...categoriesStore[idx], ...req.body };
    res.json(categoriesStore[idx]);
  });
  app.delete("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    categoriesStore = categoriesStore.filter((c) => c.id !== id);
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
  app.post("/api/orders", (req, res) => {
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
    res.status(201).json(newOrder);
  });
  app.patch("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { statut, statutPaiement } = req.body;
    const order = ordersStore.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouv\xE9e" });
    }
    if (statut) order.statut = statut;
    if (statutPaiement) order.statutPaiement = statutPaiement;
    res.json(order);
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
            dateInscription: u.date_inscription
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
    const { nom, email, password, role } = req.body;
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
      dateInscription: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
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
          "INSERT INTO users (id, nom, email, role, statut, date_inscription) VALUES (?, ?, ?, ?, ?, ?)",
          [newUser.id, newUser.nom, newUser.email, newUser.role, newUser.statut, newUser.dateInscription]
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
  app.use("/src/assets", import_express.default.static(import_path.default.join(process.cwd(), "src/assets")));
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
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
