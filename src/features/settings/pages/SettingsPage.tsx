import { Settings, Bell, Shield, Info, LogOut, Mail, User } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import ScreenHeader from '@/components/shared/ScreenHeader';
import SettingsSection from '../components/SettingsSection';
import SettingsItem from '../components/SettingsItem';

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // session will be cleared by auth state listener
    }
  };

  return (
    <div>
      <ScreenHeader title="Configurações" subtitle="Ajustes de estoque e conta" />

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

        <SettingsSection title="Configurações de estoque">
          <SettingsItem icon={Settings} label="Estoque mínimo padrão" value="5 unidades" interactive />
          <SettingsItem icon={Bell} label="Avisar antes de atingir o mínimo" value="2 unidades" interactive />
          <SettingsItem icon={Info} label="Dias para considerar parado" value="60 dias" interactive />
        </SettingsSection>

        <SettingsSection title="Conta">
          <SettingsItem
            icon={Mail}
            label="E-mail"
            value={user?.email ?? '—'}
            iconBgClassName="bg-accent-50"
            iconClassName="text-accent"
          />
          <SettingsItem
            icon={Shield}
            label="Segurança da conta"
            value="Senha e privacidade"
            iconBgClassName="bg-accent-50"
            iconClassName="text-accent"
          />
          <SettingsItem
            icon={Info}
            label="Sobre o aplicativo"
            value="Versão 1.0.0"
            iconBgClassName="bg-accent-50"
            iconClassName="text-accent"
          />
        </SettingsSection>

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
