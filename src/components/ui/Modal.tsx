import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  headerExtra?: ReactNode;
}

export default function Modal({ title, onClose, children, footer, headerExtra }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-accent-900/50 sm:items-center">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          {headerExtra}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-accent-300 hover:bg-canvas hover:text-accent-500"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {children}

        {footer && (
          <div className="flex gap-3 border-t border-line px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
