export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDateGroup(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
