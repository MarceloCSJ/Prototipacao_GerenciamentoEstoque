import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section>
      <h2 className="section-title mb-3">{title}</h2>
      <div className="card divide-y divide-line overflow-hidden">{children}</div>
    </section>
  );
}
