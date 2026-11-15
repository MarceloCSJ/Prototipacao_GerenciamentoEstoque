import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';
import AuthScreen from '@/screens/Auth';
import ProductsList from '@/screens/ProductsList';
import AlertsList from '@/screens/AlertsList';
import Movements from '@/screens/Movements';
import SettingsScreen from '@/screens/Settings';
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
        return <ProductsList />;
      case 'alertas':
        return <AlertsList />;
      case 'movimentacoes':
        return <Movements />;
      case 'config':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="relative mx-auto min-h-screen max-w-md bg-canvas pb-20 shadow-sm sm:border-x sm:border-line">
        {renderScreen()}
      </div>
      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  );
}
