export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="h-2 rounded-full bg-forest-100">
      <div className="h-full rounded-full bg-forest-700" style={{ width: `${pct}%` }} />
    </div>
  );
}
