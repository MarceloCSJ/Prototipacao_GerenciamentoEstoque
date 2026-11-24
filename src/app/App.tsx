import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { useAuth } from '@/features/auth/context/AuthContext';
import AppLayout from './layout/AppLayout';
import AuthScreen from '@/features/auth/screens/AuthScreen';
import ProductsPage from '@/features/products/pages/ProductsPage';
import AlertsPage from '@/features/alerts/pages/AlertsPage';
import MovementsPage from '@/features/movements/pages/MovementsPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import type { ScreenId } from '@/types';

export default function App() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<ScreenId>('produtos');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <RefreshCw size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'produtos':
        return <ProductsPage />;
      case 'alertas':
        return <AlertsPage />;
      case 'movimentacoes':
        return <MovementsPage />;
      case 'config':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppLayout active={screen} onNavigate={setScreen}>
        {renderScreen()}
      </AppLayout>
      <Analytics />
    </>
  );
}
