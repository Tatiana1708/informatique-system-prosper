import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface RegisterPageProps {
  setActiveTab: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ setActiveTab }) => {
  const { registerApi } = useAuth();
  const { cart } = useCart();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Client' | 'Vendeur'>('Client');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!nom.trim()) {
      setError('Veuillez renseigner votre nom complet');
      return;
    }

    if (!email.trim()) {
      setError('Veuillez renseigner une adresse e-mail valide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions générales pour créer un compte');
      return;
    }

    setLoading(true);

    try {
      const user = await registerApi(nom, email, password, role);
      const redirectTab = cart.length > 0 ? 'panier' : (user.role === 'Admin' || user.role === 'Vendeur' ? 'admin' : 'compte');
      setSuccessMsg(
        cart.length > 0
          ? `Félicitations ${user.nom} ! Votre compte est créé. Redirection vers votre panier pour finaliser l'achat...`
          : `Félicitations ! Compte créé avec succès pour ${user.nom}.`
      );
      setTimeout(() => {
        setActiveTab(redirectTab);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-lg space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-lg shadow-blue-500/25 mb-1">
            ISP
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Informatique System Prosper
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Créez votre compte en quelques secondes pour commander vos équipements informatiques et suivre vos factures.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Inscrire un nouveau compte</h2>
            <p className="text-xs text-slate-500">Remplissez le formulaire d'inscription</p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Nom complet / Entreprise</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Jean DUPONT ou Sarl Tech Services"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Adresse e-mail professionnelle</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="jean.dupont@entreprise.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Type de Profil</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Client')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    role === 'Client'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Client (Particulier / Pro)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Vendeur')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    role === 'Vendeur'
                      ? 'border-amber-600 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vendeur / Partenaire</span>
                </button>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Identique au premier"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-snug cursor-pointer">
                J'accepte les{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('a-propos')}
                  className="text-blue-600 font-semibold underline"
                >
                  Conditions Générales de Vente
                </button>{' '}
                et la Politique de Confidentialité d'Informatique System Prosper.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Création de votre compte...</span>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="text-center text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200/80">
          Vous possédez déjà un compte ?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="text-blue-600 font-extrabold hover:underline"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};
