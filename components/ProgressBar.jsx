'use client';

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / Math.max(total, 1)) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-ash-500 mb-2">
        <span>Pas {current} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-ash-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
