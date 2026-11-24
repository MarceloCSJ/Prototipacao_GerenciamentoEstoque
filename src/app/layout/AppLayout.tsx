import type { ReactNode } from 'react';
import type { ScreenId } from '@/types';
import BottomNav from '@/components/BottomNav';

interface AppLayoutProps {
  active: ScreenId;
  onNavigate: (id: ScreenId) => void;
  children: ReactNode;
}

export default function AppLayout({ active, onNavigate, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <div className="relative mx-auto min-h-screen max-w-md bg-canvas pb-20 shadow-sm sm:border-x sm:border-line dark:bg-canvas-dark dark:border-line-dark">
        {children}
      </div>
      <BottomNav active={active} onNavigate={onNavigate} />
    </div>
  );
}
