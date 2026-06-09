export function Scenery({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-b-[2rem] bg-cream ${compact ? "h-36" : "h-64"}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,248,241,0)_15%,rgba(247,240,227,0.72)_100%)]" />
      <div className="absolute bottom-0 left-[-8%] h-36 w-[55%] rounded-t-full bg-forest-300/55" />
      <div className="absolute bottom-0 right-[-12%] h-44 w-[70%] rounded-t-full bg-moss/80" />
      <div className="absolute bottom-0 left-[10%] h-28 w-[52%] rounded-t-full bg-forest-500/35" />
      <div className="absolute right-16 top-14 h-16 w-16 rounded-full bg-clay" />
      <div className="absolute bottom-[-4rem] left-1/2 h-44 w-24 -translate-x-1/2 rotate-[14deg] rounded-t-full bg-linen" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-forest-900/10 to-transparent" />
    </div>
  );
}
