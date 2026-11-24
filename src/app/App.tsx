import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import AppLayout from './layout/AppLayout';
import AuthScreen from '@/features/auth/screens/AuthScreen';
import ProductsPage from '@/features/products/pages/ProductsPage';
import AlertsPage from '@/features/alerts/pages/AlertsPage';
import MovementsPage from '@/features/movements/pages/MovementsPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import type { ScreenId } from '@/types';

export default function App() {
  const { user, loading } = useAuth();
  const { preferences } = usePreferences();
  const [screen, setScreen] = useState<ScreenId>('produtos');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas dark:bg-canvas-dark">
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
    <AppLayout active={screen} onNavigate={setScreen}>
      {renderScreen()}
    </AppLayout>
  );
}
