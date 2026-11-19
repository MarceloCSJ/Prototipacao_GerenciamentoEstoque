import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  icon: ReactNode;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-accent-900/50 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-surface p-6 sm:rounded-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-accent-300">{message}</p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="btn-accent flex-1 !bg-danger hover:!bg-danger/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
