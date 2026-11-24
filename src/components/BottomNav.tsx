import { Package, AlertTriangle, ArrowLeftRight, Settings } from 'lucide-react';
import type { ScreenId } from '@/types';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: typeof Package;
}

const items: NavItem[] = [
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
  { id: 'movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
  { id: 'config', label: 'Configurações', icon: Settings },
];

interface BottomNavProps {
  active: ScreenId;
  onNavigate: (id: ScreenId) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-surface"
      aria-label="Navegação inferior"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors min-h-[56px] ${
                isActive ? 'text-primary' : 'text-accent-300 hover:text-accent-500'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
