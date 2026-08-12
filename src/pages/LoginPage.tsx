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
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  setActiveTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab }) => {
  const { loginApi, switchRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail');
      return;
    }

    setLoading(true);

    try {
      const user = await loginApi(email, password);
      setSuccessMsg(`Ravi de vous revoir, ${user.nom} !`);
      setTimeout(() => {
        if (user.role === 'Admin' || user.role === 'Vendeur') {
          setActiveTab('admin');
        } else {
          setActiveTab('compte');
        }
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Identifiants ou mot de passe incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    setError(null);
    setLoading(true);

    try {
      const user = await loginApi(demoEmail, 'demo1234');
      setSuccessMsg(`Connexion rapide sous le profil ${roleName} (${user.nom})`);
      setTimeout(() => {
        if (user.role === 'Admin' || user.role === 'Vendeur') {
          setActiveTab('admin');
        } else {
          setActiveTab('compte');
        }
      }, 600);
    } catch (err: any) {
      // Fallback local switch
      switchRole(roleName as any);
      setSuccessMsg(`Mode démo basculé sur ${roleName}`);
      setTimeout(() => {
        if (roleName === 'Admin' || roleName === 'Vendeur') {
          setActiveTab('admin');
        } else {
          setActiveTab('compte');
        }
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Top Logo & Welcome Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-lg shadow-blue-500/25 mb-1">
            ISP
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Informatique System Prosper
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Connectez-vous à votre espace membre pour gérer vos commandes et vos équipements.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Se connecter</h2>
            <p className="text-xs text-slate-500">Saisissez vos identifiants d'accès</p>
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
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Adresse e-mail</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="exemple@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 block">Mot de passe</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Pour réinitialiser votre mot de passe, veuillez contacter le support au +33 171 368 127 ou infosystemprosper@gmail.com');
                  }}
                  className="text-[11px] text-blue-600 font-semibold hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                Rester connecté sur cet appareil
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Quick Login */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Comptes Démo de Test (Accès Rapide) :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('infosystemprosper@gmail.com', 'Admin')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-left transition font-semibold"
              >
                <div className="text-[10px] text-purple-600 uppercase font-black">Admin</div>
                <div className="truncate text-xs">Alain PROSPER</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('paul.kengne@informatiquesystem.com', 'Vendeur')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-left transition font-semibold"
              >
                <div className="text-[10px] text-amber-600 uppercase font-black">Vendeur</div>
                <div className="truncate text-xs">Paul KENGNE</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alice.martin@gmail.com', 'Client')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-left transition font-semibold"
              >
                <div className="text-[10px] text-emerald-600 uppercase font-black">Client</div>
                <div className="truncate text-xs">Alice MARTIN</div>
              </button>
            </div>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200/80">
          Vous n'avez pas encore de compte ?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="text-blue-600 font-extrabold hover:underline"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};
