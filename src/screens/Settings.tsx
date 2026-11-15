import { Settings, Bell, Shield, Info, ChevronRight, LogOut, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SettingRow {
  icon: typeof Settings;
  label: string;
  value: string;
}

const stockSettings: SettingRow[] = [
  { icon: Settings, label: 'Estoque mínimo padrão', value: '5 unidades' },
  { icon: Bell, label: 'Avisar antes de atingir o mínimo', value: '2 unidades' },
  { icon: Info, label: 'Dias para considerar parado', value: '60 dias' },
];

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // session will be cleared by auth state listener
    }
  };

  const accountSettings: SettingRow[] = [
    { icon: Mail, label: 'E-mail', value: user?.email ?? '—' },
    { icon: Shield, label: 'Segurança da conta', value: 'Senha e privacidade' },
    { icon: Info, label: 'Sobre o aplicativo', value: 'Versão 1.0.0' },
  ];

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold text-ink">Configurações</h1>
        <p className="text-xs text-accent-300 mt-0.5">Ajustes de estoque e conta</p>
      </header>

      <div className="px-5 py-4 space-y-6">
        {/* User profile card */}
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
            <User size={24} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.email ?? 'Usuário'}</p>
            <p className="text-xs text-accent-300">Conta autenticada</p>
          </div>
        </div>

        {/* Stock defaults section */}
        <section>
          <h2 className="section-title mb-3">Configurações de estoque</h2>
          <div className="card divide-y divide-line overflow-hidden">
            {stockSettings.map((row) => {
              const Icon = row.icon;
              return (
                <button
                  key={row.label}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-canvas min-h-[44px]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-ink">{row.label}</span>
                  <span className="text-xs text-accent-300">{row.value}</span>
                  <ChevronRight size={18} className="text-accent-300" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Account section */}
        <section>
          <h2 className="section-title mb-3">Conta</h2>
          <div className="card divide-y divide-line overflow-hidden">
            {accountSettings.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className="flex w-full items-center gap-3 p-4 min-h-[44px]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-ink">{row.label}</span>
                  <span className="truncate text-xs text-accent-300">{row.value}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-surface px-4 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/5 min-h-[44px]"
        >
          <LogOut size={18} />
          Sair da conta
        </button>

        <p className="pt-2 text-center text-xs text-accent-300">
          Estoque Belza • Protótipo MVP
        </p>
      </div>
    </div>
  );
}
