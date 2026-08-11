import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Globe,
  Globe2,
  Headphones,
  Laptop,
  Mail,
  MapPin,
  Network,
  Phone,
  Printer,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { DOCUMENTS_INFO, PRESIDENT_INFO } from '../data/mockData';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
  selectedDocTab?: string;
  setSelectedDocTab?: (docId: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  setActiveTab,
  selectedDocTab = 'president',
  setSelectedDocTab,
}) => {
  const [activeDocId, setActiveDocId] = useState<string>(selectedDocTab);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'sec-0': true,
    'sec-1': true,
    'sec-2': true,
  });

  const handleTabChange = (docId: string) => {
    setActiveDocId(docId);
    if (setSelectedDocTab) {
      setSelectedDocTab(docId);
    }
  };

  const toggleAccordion = (secKey: string) => {
    setOpenSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const currentDoc = DOCUMENTS_INFO.find((d) => d.id === activeDocId) || DOCUMENTS_INFO[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-6">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Building className="w-4 h-4 text-blue-400" />
            <span>À propos d'Informatique System Prosper</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Excellence Technologique & Rayonnement International
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Informatique System Prosper est une entreprise de référence dans la fourniture d’équipements informatiques, les services de maintenance sur-mesure et l’ingénierie des infrastructures réseaux. Nous accompagnons les entreprises, institutions et particuliers à travers l’Europe et l’Afrique.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/80">
            <div className="text-2xl font-black text-blue-400">4 Zones</div>
            <div className="text-xs text-slate-400">France, Guyane, Cameroun, RCI</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/80">
            <div className="text-2xl font-black text-emerald-400">10 000+</div>
            <div className="text-xs text-slate-400">Clients & PME équipés</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/80">
            <div className="text-2xl font-black text-purple-400">99.8%</div>
            <div className="text-xs text-slate-400">Taux de satisfaction client</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/80">
            <div className="text-2xl font-black text-amber-400">24/7</div>
            <div className="text-xs text-slate-400">Support & Infogérance</div>
          </div>
        </div>
      </section>

      {/* 2. NOS DOMAINES D'EXPERTISE */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Nos Domaines d'Expertise
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Une offre globale couvrant l’ensemble de la chaîne de valeur informatique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Vente de Matériel Informatique</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Distribution de processeurs, SSD M.2 (Samsung 980 PRO), cartes graphiques (NVIDIA RTX 4070), ordinateurs portables professionnels (Dell XPS), moniteurs et accessoires d'origine certifiée.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Maintenance & Réparation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dépannage matériel et logiciel, remplacement de composants défectueux, audits de performance, nettoyage et optimisation des postes de travail sous contrats de maintenance réactifs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Installation Réseau & Infrastructure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Étude et pose de câblage structuré, baies de brassage, routeurs Wi-Fi 6E, switchs Gigabit gérés et sécurisation des réseaux d'entreprise contre les cybermenaces.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ZONES D'INTERVENTION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Zones d'Intervention Internationales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Un réseau d'agences régionales interconnectées garantissant une logistique rapide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* France */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-blue-600 absolute left-0 top-0" />
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-base">France</span>
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xs font-semibold text-blue-600">Siège Social — Cachan</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              17 Avenue Leon Blum, 94230 Cachan. Pilotage stratégique, HUB logistique et support technique européen.
            </p>
          </div>

          {/* Guyane */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-emerald-500 absolute left-0 top-0" />
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-base">Guyane</span>
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-xs font-semibold text-emerald-600">Kourou & Cayenne</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distribution de matériel informatique et interventions réseaux sur le territoire guyanais.
            </p>
          </div>

          {/* Cameroun */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-amber-500 absolute left-0 top-0" />
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-base">Cameroun</span>
              <Globe className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-xs font-semibold text-amber-600">Douala (Akwa)</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agence régionale d'Afrique Centrale : vente gros/détail, maintenance et intégration réseau d'entreprise.
            </p>
          </div>

          {/* Côte d'Ivoire */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-2 h-full bg-purple-500 absolute left-0 top-0" />
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-base">Côte d'Ivoire</span>
              <Globe className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-xs font-semibold text-purple-600">Abidjan (Plateau)</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agence régionale d'Afrique de l'Ouest : solutions d'infrastructures informatiques et télécoms.
            </p>
          </div>
        </div>
      </section>

      {/* 4. DOCUMENTS & INFORMATIONS (TABBED ACCORDION SYSTEM) */}
      <section id="documents-section" className="space-y-6 pt-6 border-t border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Documents & Informations Réglementaires
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Consultez le mot du président, les mentions légales, la présentation complète et nos conditions de vente.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {DOCUMENTS_INFO.map((doc) => {
            const isActive = doc.id === activeDocId;
            return (
              <button
                key={doc.id}
                onClick={() => handleTabChange(doc.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{doc.titre}</span>
                {doc.id === 'president' && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-emerald-400 text-slate-900 rounded font-black">
                    Président
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Official Document Banner Header */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Document Officiel — Informatique System Prosper
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Siren : <strong className="text-white">798609020</strong> | Siret : <strong className="text-white">79860902000010</strong> | TVA : <strong className="text-white">FR76798609020</strong> | NAF : <strong className="text-white">4651Z</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                17 Avenue Léon Blum, 94230 Cachan, Val-De-Marne | Tél : +33 171 368 127 / +33 672 096 455
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimer / Télécharger</span>
            </button>
          </div>

          {/* SPECIAL MOT DU PRÉSIDENT VIEW */}
          {activeDocId === 'president' ? (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
                {/* Photo du Président */}
                <div className="shrink-0 space-y-3 text-center">
                  <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-lg mx-auto bg-slate-200">
                    <img
                      src={PRESIDENT_INFO.photoUrl}
                      alt={PRESIDENT_INFO.nom}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{PRESIDENT_INFO.nom}</h3>
                    <p className="text-xs font-semibold text-blue-600">{PRESIDENT_INFO.titre}</p>
                    <p className="text-[11px] text-slate-500">{PRESIDENT_INFO.entreprise}</p>
                  </div>
                </div>

                {/* Message du Président */}
                <div className="space-y-4 flex-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    Message Officiel de la Présidence
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line font-medium italic">
                    "{PRESIDENT_INFO.message}"
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{PRESIDENT_INFO.signature}</div>
                      <div className="text-[11px] text-slate-500">Siège Social de Cachan — Val-De-Marne</div>
                    </div>
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ACCORDION FOR OTHER DOCUMENTS (Mentions Légales, Qui Sommes-Nous, Conditions de Vente) */
            <div className="space-y-4">
              <div className="mb-6 border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{currentDoc.titre}</h3>
                  <p className="text-xs text-slate-500 mt-1">{currentDoc.description}</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  Document à jour & conforme
                </span>
              </div>

              <div className="space-y-3">
                {currentDoc.sections.map((section, idx) => {
                  const secKey = `${activeDocId}-${idx}`;
                  const isOpen = openSections[secKey] ?? true;

                  return (
                    <div
                      key={secKey}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition"
                    >
                      <button
                        onClick={() => toggleAccordion(secKey)}
                        className="w-full text-left px-5 py-3.5 bg-slate-50 hover:bg-slate-100 font-bold text-slate-900 text-xs flex items-center justify-between transition"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{section.titre}</span>
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 whitespace-pre-line font-medium">
                          {section.contenu}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA CONTACT WITH HEADQUARTER IN CACHAN */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Siège Social & Coordination Internationale</span>
          </div>
          <h2 className="text-2xl font-black text-white">Besoin d'un devis ou d'un conseil technique ?</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nos équipes vous accueillent au <strong>17 Avenue Léon Blum, 94230 Cachan, Val-De-Marne</strong> ou répondent à vos demandes par téléphone et courriel sous 24h.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+33 171 368 127 / +33 672 096 455</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>infosystemprosper@gmail.com</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('contact')}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition shrink-0"
        >
          <span>Accéder à la Page Contact</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
