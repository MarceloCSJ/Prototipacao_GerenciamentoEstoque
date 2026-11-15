import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, AlertCircle } from 'lucide-react';
import type { Product, MovementType } from '@/types';
import { registerMovement } from '@/services/movements';

interface MovementFormProps {
  product: Product;
  onClose: () => void;
  onSaved: () => void;
}

export default function MovementForm({ product, onClose, onSaved }: MovementFormProps) {
  const [tipo, setTipo] = useState<MovementType>('entrada');
  const [quantidade, setQuantidade] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setError('');
  }, [tipo]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const qty = parseInt(quantidade, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }

    if (tipo === 'saida' && qty > product.estoque) {
      setError(`Saldo insuficiente. Estoque atual: ${product.estoque} un.`);
      return;
    }

    setSaving(true);
    try {
      await registerMovement(product.id, tipo, qty);
      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Saldo insuficiente')) {
        setError(`Saldo insuficiente. Estoque atual: ${product.estoque} un.`);
      } else if (msg.includes('maior que zero')) {
        setError('A quantidade deve ser maior que zero.');
      } else {
        setError('Não foi possível registrar a movimentação. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-accent-900/50 sm:items-center">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Registrar Movimentação</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-accent-300 hover:bg-canvas hover:text-accent-500"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-line px-5 py-3">
          <p className="text-sm font-semibold text-ink">{product.titulo}</p>
          <p className="text-xs text-accent-300 mt-0.5">Estoque atual: {product.estoque} unidades</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Tipo de movimentação</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors min-h-[44px] ${
                  tipo === 'entrada'
                    ? 'border-success bg-success/5 text-success'
                    : 'border-line text-accent-300 hover:border-success/50'
                }`}
                aria-pressed={tipo === 'entrada'}
              >
                <ArrowDownCircle size={24} />
                <span className="text-sm font-semibold">Entrada</span>
              </button>
              <button
                type="button"
                onClick={() => setTipo('saida')}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors min-h-[44px] ${
                  tipo === 'saida'
                    ? 'border-danger bg-danger/5 text-danger'
                    : 'border-line text-accent-300 hover:border-danger/50'
                }`}
                aria-pressed={tipo === 'saida'}
              >
                <ArrowUpCircle size={24} />
                <span className="text-sm font-semibold">Saída</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="quantidade" className="mb-1.5 block text-sm font-medium text-ink">
              Quantidade *
            </label>
            <input
              id="quantidade"
              type="number"
              inputMode="numeric"
              min="1"
              required
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 10"
              className="w-full rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="flex gap-3 border-t border-line px-5 py-4">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex-1 ${tipo === 'entrada' ? 'btn-primary' : 'btn-accent'}`}
          >
            {saving ? 'Registrando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
