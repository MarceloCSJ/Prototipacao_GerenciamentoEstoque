import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import ProductsList from '@/screens/ProductsList';
import AlertsList from '@/screens/AlertsList';
import Movements from '@/screens/Movements';
import SettingsScreen from '@/screens/Settings';
import type { ScreenId } from '@/types';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('produtos');

  const renderScreen = () => {
    switch (screen) {
      case 'produtos':
        return <ProductsList onNewProduct={() => {}} />;
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
      {/* Mobile-first container centered on larger screens */}
      <div className="relative mx-auto min-h-screen max-w-md bg-canvas pb-20 shadow-sm sm:border-x sm:border-line">
        {renderScreen()}
      </div>
      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  );
}
