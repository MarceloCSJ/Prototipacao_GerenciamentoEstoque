import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconBgClassName?: string;
  iconClassName?: string;
  interactive?: boolean;
}

export default function SettingsItem({
  icon: Icon,
  label,
  value,
  iconBgClassName = 'bg-primary-50',
  iconClassName = 'text-primary',
  interactive = false,
}: SettingsItemProps) {
  const content = (
    <>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBgClassName}`}>
        <Icon size={18} className={iconClassName} />
      </div>
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <span className="truncate text-xs text-accent-300">{value}</span>
      {interactive && <ChevronRight size={18} className="text-accent-300" />}
    </>
  );

  if (interactive) {
    return (
      <button className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-canvas min-h-[44px]">
        {content}
      </button>
    );
  }

  return <div className="flex w-full items-center gap-3 p-4 min-h-[44px]">{content}</div>;
}
