import React, { useState } from 'react';
import { Building, CheckCircle2, Globe, Mail, MapPin, Phone, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    agence: 'France (Cachan)',
    sujet: 'Devis Matériel',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        agence: 'France (Cachan)',
        sujet: 'Devis Matériel',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contactez-Nous</h1>
        <p className="text-xs text-slate-500 mt-1">
          Nos conseillers et techniciens sont à votre écoute pour toutes vos demandes de devis, commandes ou support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Formulaire de Contact & Devis</h2>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Merci ! Votre message a bien été transmis à nos équipes de Cachan. Un conseiller vous recontactera sous 24h.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prosper METENDE"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Adresse Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Téléphone</label>
                <input
                  type="tel"
                  placeholder="+33 1 45 46 88 00"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Agence Régionale Cible</label>
                <select
                  value={formData.agence}
                  onChange={(e) => setFormData({ ...formData, agence: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="France (Cachan)">Siège Social - France (Cachan)</option>
                  <option value="Guyane">Territoire de Guyane</option>
                  <option value="Cameroun (Douala)">Agence Douala (Cameroun)</option>
                  <option value="Côte d'Ivoire (Abidjan)">Agence Abidjan (RCI)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Objet de la demande</label>
              <select
                value={formData.sujet}
                onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Devis Matériel">Devis Matériel / Composants</option>
                <option value="Maintenance">Maintenance & Réparation</option>
                <option value="Réseau">Projet Installation Réseau</option>
                <option value="Autre">Autre demande d'information</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Votre Message *</label>
              <textarea
                rows={5}
                required
                placeholder="Précisez votre besoin (quantités, modèles, spécifications)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer le message</span>
            </button>
          </form>
        </div>

        {/* HQ Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-extrabold text-sm">
              <Building className="w-5 h-5 text-blue-500" />
              <span>Siège Social (France)</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Adresse :</strong>
                  <span>17 Avenue Leon Blum, 94230 Cachan, France</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-white block">Téléphone :</strong>
                  <span>+33 (0)1 45 46 88 00</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <strong className="text-white block">Email :</strong>
                  <span>contact@informatiquesystem.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Agences Internationales</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
              <li>
                <strong className="text-slate-800">Guyane :</strong> Cayenne & Kourou
              </li>
              <li>
                <strong className="text-slate-800">Cameroun :</strong> Agence Akwa, Douala
              </li>
              <li>
                <strong className="text-slate-800">Côte d'Ivoire :</strong> Agence Plateau, Abidjan
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
