import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  iconClassName?: string;
  iconBgClassName?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
  iconClassName = 'text-primary',
  iconBgClassName = 'bg-primary-50',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${iconBgClassName}`}>
        <Icon size={36} className={iconClassName} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-ink-dark">{title}</h3>
      <p className="mt-1 text-sm text-accent-300">{message}</p>
    </div>
  );
}
