import { useState } from 'react';
import type { FormEvent } from 'react';
import { Package, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro';
      if (message.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (message.includes('already registered') || message.includes('already been registered')) {
        setError('Este e-mail já está cadastrado. Faça login.');
      } else if (message.includes('Password should be at least')) {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Não foi possível completar a operação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Same container pattern as the main app: max-w-md, centered, with border on larger screens */}
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-canvas shadow-sm sm:border-x sm:border-line">
        {/* Header — matches the sticky header pattern used in other screens */}
        <header className="border-b border-line bg-surface px-5 pt-5 pb-4">
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Package size={28} className="text-white" strokeWidth={1.8} />
            </div>
            <h1 className="text-xl font-bold text-ink">Estoque Belza</h1>
            <p className="mt-0.5 text-xs text-accent-300">Gerencie seu estoque com confiança</p>
          </div>
        </header>

        {/* Form area — uses the same px-5 padding as all other screens */}
        <div className="flex flex-1 flex-col justify-center px-5 py-8">
          <div className="card p-5">
            {/* Mode toggle */}
            <div className="mb-5 flex gap-1 rounded-lg bg-canvas p-1">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors min-h-[40px] ${
                  mode === 'login' ? 'bg-surface text-ink shadow-sm' : 'text-accent-300'
                }`}
                aria-pressed={mode === 'login'}
              >
                Entrar
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors min-h-[40px] ${
                  mode === 'signup' ? 'bg-surface text-ink shadow-sm' : 'text-accent-300'
                }`}
                aria-pressed={mode === 'signup'}
              >
                Cadastrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-300" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-lg border border-line bg-canvas pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-300" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-lg border border-line bg-canvas pl-10 pr-11 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-300 hover:text-accent-500"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>

            {mode === 'signup' && (
              <p className="mt-4 text-center text-xs text-accent-300">
                Ao cadastrar-se, você poderá gerenciar seus produtos e estoque.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
