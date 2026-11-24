import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserPreferences, Theme } from '@/types';
import { DEFAULT_PREFERENCES } from '@/types';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchPreferences, upsertPreferences } from '@/services/preferences';

interface PreferencesContextValue {
  preferences: UserPreferences | null;
  loading: boolean;
  theme: Theme;
  toggleTheme: () => Promise<void>;
  updateTheme: (theme: Theme) => Promise<void>;
  updateNotificationSettings: (ativas: boolean, antecedencia: number) => Promise<void>;
  updateStaleDays: (dias: number) => Promise<void>;
  isDark: boolean;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const THEME_CACHE_KEY = 'estoque-belza-tema';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      const cachedTheme = localStorage.getItem(THEME_CACHE_KEY) as Theme | null;
      const data = await fetchPreferences();
      if (data) {
        setPreferences(data);
        localStorage.setItem(THEME_CACHE_KEY, data.tema);
      } else {
        const initial: UserPreferences = {
          id: '',
          usuario_id: user.id,
          ...DEFAULT_PREFERENCES,
          tema: cachedTheme ?? DEFAULT_PREFERENCES.tema,
          data_criacao: '',
          data_atualizacao: '',
        };
        setPreferences(initial);
        if (cachedTheme) {
          upsertPreferences({ tema: cachedTheme }).catch(() => {});
        }
      }
    } catch {
      const cachedTheme = localStorage.getItem(THEME_CACHE_KEY) as Theme | null;
      setPreferences({
        id: '',
        usuario_id: user.id,
        ...DEFAULT_PREFERENCES,
        tema: cachedTheme ?? DEFAULT_PREFERENCES.tema,
        data_criacao: '',
        data_atualizacao: '',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const theme: Theme = preferences?.tema ?? DEFAULT_PREFERENCES.tema;
  const isDark = theme === 'escuro';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_CACHE_KEY, theme);
  }, [isDark, theme]);

  const handleUpdateTheme = useCallback(async (newTheme: Theme) => {
    const prev = preferences;
    setPreferences((prev) => prev ? { ...prev, tema: newTheme } : prev);
    try {
      const updated = await upsertPreferences({ tema: newTheme });
      setPreferences(updated);
    } catch {
      setPreferences(prev);
    }
  }, [preferences]);

  const toggleTheme = useCallback(async () => {
    const newTheme: Theme = theme === 'claro' ? 'escuro' : 'claro';
    await handleUpdateTheme(newTheme);
  }, [theme, handleUpdateTheme]);

  const handleUpdateNotificationSettings = useCallback(
    async (ativas: boolean, antecedencia: number) => {
      const prev = preferences;
      setPreferences((prev) => prev ? { ...prev, notificacoes_estoque_ativas: ativas, antecedencia_aviso: antecedencia } : prev);
      try {
        const updated = await upsertPreferences({
          notificacoes_estoque_ativas: ativas,
          antecedencia_aviso: antecedencia,
        });
        setPreferences(updated);
      } catch {
        setPreferences(prev);
      }
    },
    [preferences]
  );

  const handleUpdateStaleDays = useCallback(async (dias: number) => {
    const prev = preferences;
    setPreferences((prev) => prev ? { ...prev, dias_para_considerar_parado: dias } : prev);
    try {
      const updated = await upsertPreferences({ dias_para_considerar_parado: dias });
      setPreferences(updated);
    } catch {
      setPreferences(prev);
    }
  }, [preferences]);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        theme,
        toggleTheme,
        updateTheme: handleUpdateTheme,
        updateNotificationSettings: handleUpdateNotificationSettings,
        updateStaleDays: handleUpdateStaleDays,
        isDark,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
