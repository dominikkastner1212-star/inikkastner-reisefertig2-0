import { Caravan, Trees } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center rounded-full border border-forest-700/30 bg-forest-50 text-forest-700">
        <Caravan size={23} strokeWidth={1.8} />
        <Trees className="absolute -right-1 top-2" size={17} strokeWidth={1.8} />
      </div>
      {!compact && (
        <div>
          <p className="text-2xl font-semibold leading-none text-forest-900">Reisefertig2.0</p>
          <p className="mt-1 text-xs text-forest-700/70">Deine Reise. Perfekt organisiert.</p>
        </div>
      )}
    </div>
  );
}
