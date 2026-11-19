import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  className?: string;
}

export default function LoadingState({ className = 'py-16' }: LoadingStateProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <RefreshCw size={24} className="animate-spin text-primary" />
    </div>
  );
}
