interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'default' | 'warning' | 'danger';
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default: 'bg-purple-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
};

const heightClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export function ProgressBar({
  value,
  max,
  variant = 'default',
  showLabel = false,
  height = 'md',
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="w-full">
      <div
        className={`
          w-full bg-slate-700 rounded-full overflow-hidden
          ${heightClasses[height]}
        `}
      >
        <div
          className={`
            ${variantClasses[variant]}
            ${heightClasses[height]}
            rounded-full transition-all duration-300 ease-out
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-center text-sm text-slate-300">
          {value} / {max}
        </div>
      )}
    </div>
  );
}
