import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function ScreenHeader({
  title,
  subtitle,
  onRefresh,
  loading,
  actions,
  children,
}: ScreenHeaderProps) {
  return (
    <header className="header-surface sticky top-0 z-20 px-5 pt-5 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink dark:text-ink-dark">{title}</h1>
          {subtitle && <p className="text-xs text-accent-300 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-ghost px-3"
              aria-label="Atualizar"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          {actions}
        </div>
      </div>
      {children}
    </header>
  );
}
