import type { Product } from '@/types';
import { setAlertaAtivo } from '@/services/notifications';

export type NotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

export function shouldWarnEarly(
  estoqueAtual: number,
  estoqueMinimo: number,
  antecedencia: number
): boolean {
  const limiteAviso = estoqueMinimo + antecedencia;
  return estoqueAtual <= limiteAviso;
}

export async function checkAndNotifyAfterMovement(
  product: Product,
  antecedencia: number,
  notificationsEnabled: boolean
): Promise<void> {
  if (!notificationsEnabled) return;
  if (getNotificationPermission() !== 'granted') return;

  const inWarningRange = shouldWarnEarly(product.estoque, product.estoque_minimo, antecedencia);

  if (!inWarningRange) {
    await setAlertaAtivo(product.id, false);
    return;
  }

  try {
    const state = await (await import('@/services/notifications')).getNotificationState(product.id);
    if (state?.alerta_ativo) return;

    new Notification('Estoque Belza', {
      body: `Reposição necessária!\n\nO produto ${product.titulo} está com ${product.estoque} unidades disponíveis.\n\nEstoque mínimo: ${product.estoque_minimo}.\nAntecedência: ${antecedencia}.`,
    });
    await setAlertaAtivo(product.id, true);
  } catch {
    // notification or state update failed — non-fatal
  }
}
