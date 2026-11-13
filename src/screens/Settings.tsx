import { Settings, Bell, Shield, Info, CircleHelp, ChevronRight } from 'lucide-react';

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

const accountSettings: SettingRow[] = [
  { icon: Shield, label: 'Segurança da conta', value: 'Senha e privacidade' },
  { icon: CircleHelp, label: 'Sobre o aplicativo', value: 'Versão 1.0.0' },
];

export default function SettingsScreen() {
  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold text-ink">Configurações</h1>
        <p className="text-xs text-accent-300 mt-0.5">Ajustes de estoque e conta</p>
      </header>

      <div className="px-5 py-4 space-y-6">
        {/* Stock defaults section */}
        <section>
          <h2 className="section-title mb-3">Configurações de estoque</h2>
          <div className="card divide-y divide-line overflow-hidden">
            {stockSettings.map((row) => {
              const Icon = row.icon;
              return (
                <button
                  key={row.label}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-canvas"
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
                <button
                  key={row.label}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-canvas"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-ink">{row.label}</span>
                  <span className="text-xs text-accent-300">{row.value}</span>
                  <ChevronRight size={18} className="text-accent-300" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer info */}
        <p className="pt-2 text-center text-xs text-accent-300">
          Estoque Belza • Protótipo MVP
        </p>
      </div>
    </div>
  );
}
