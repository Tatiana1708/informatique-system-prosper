import React from 'react';
import { Globe, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedDocTab?: (docId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setSelectedDocTab }) => {
  const navigateToDoc = (docId: string) => {
    setActiveTab('a-propos');
    if (setSelectedDocTab) {
      setSelectedDocTab(docId);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                ISP
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Informatique System Prosper
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leader international de la vente d’équipements informatiques, de la maintenance système et du déploiement d’infrastructures réseaux haute performance.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantie officielle & Matériel certifié</span>
            </div>
          </div>

          {/* Headquarters & Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Siège Social & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>17 Avenue Léon Blum, 94230 Cachan, Val-De-Marne, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+33 171 368 127 / +33 672 096 455</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>infosystemprosper@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Intervention Zones */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Zones d'Intervention
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>France Métropolitaine (Siège Cachan)</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guyane Française</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Cameroun (Agence de Douala)</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Côte d'Ivoire (Agence d'Abidjan)</span>
              </li>
            </ul>
          </div>

          {/* Quick Legal & Info Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigateToDoc('president')}
                  className="hover:text-white transition"
                >
                  Mot du Président
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('mentions-legales')}
                  className="hover:text-white transition"
                >
                  Mentions légales
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('qui-sommes-nous')}
                  className="hover:text-white transition"
                >
                  Qui sommes-nous ?
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToDoc('conditions-vente')}
                  className="hover:text-white transition"
                >
                  Conditions Générales de Vente
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-white transition">
                  Nous Contacter
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Informatique System Prosper — Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            <span>Conçu pour l'Excellence Technologique & les Infrastructures</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
