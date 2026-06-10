import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, MapPin, Star } from "lucide-react";
import type { Place, Trip } from "@/lib/types";
import { ProgressBar } from "@/components/progress-bar";

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-forest-900">{title}</h2>
      {action ? <span className="text-xs font-medium text-forest-700">{action}</span> : null}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest-700/18 bg-linen/55 p-6 text-center">
      <p className="text-sm font-semibold text-forest-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-forest-900/58">{text}</p>
    </div>
  );
}

export function SoftCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-forest-700/10 bg-linen/78 p-4 shadow-inset ${className}`}>{children}</div>;
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="pressable inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-forest-700 px-5 text-sm font-semibold text-linen shadow-soft">
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link href={`/reisen/${trip.id}`} className="pressable block">
    <SoftCard className="overflow-hidden p-0">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-forest-700/70">Nächste Reise</p>
            <h3 className="mt-1 text-xl font-semibold text-forest-900">{trip.title}</h3>
            <p className="mt-1 text-sm text-forest-900/62">{trip.dates}</p>
          </div>
          <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-forest-900">in 15 Tagen</span>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-forest-900/65">
            <span>Reise-Checkliste</span>
            <span>{trip.checklistDone} von {trip.checklistTotal} erledigt</span>
          </div>
          <ProgressBar value={trip.checklistDone} max={trip.checklistTotal} />
        </div>
      </div>
      <div className="h-24 bg-[linear-gradient(150deg,#dfe8d4,#f7f0e3)]">
        <div className="h-full bg-[radial-gradient(circle_at_72%_22%,#d6bf99_0_2.1rem,transparent_2.2rem),linear-gradient(150deg,transparent_40%,rgba(47,81,59,.2)_41%),linear-gradient(15deg,rgba(47,81,59,.36),transparent_55%)]" />
      </div>
    </SoftCard>
    </Link>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  return (
    <Link href={`/stellplaetze/${place.id}`} className="pressable grid grid-cols-[6rem_1fr] gap-3 rounded-2xl border border-forest-700/10 bg-linen/78 p-2 shadow-inset">
      <div className="rounded-xl bg-[linear-gradient(150deg,#b7c8a8,#f1dfbe)]">
        <div className="h-full min-h-24 rounded-xl bg-[radial-gradient(circle_at_75%_25%,#f1c77e_0_1.2rem,transparent_1.25rem),linear-gradient(25deg,rgba(47,81,59,.45),transparent_58%)]" />
      </div>
      <div className="py-1 pr-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-forest-900">{place.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs font-semibold"><Star size={13} fill="currentColor" />{place.rating}</span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-forest-900/60"><MapPin size={13} />{place.location}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {place.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-forest-50 px-2 py-1 text-[0.65rem] font-medium text-forest-700">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ChecklistRow({ label, done, priority }: { label: string; done: boolean; priority?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-forest-700/10 bg-linen/70 px-3 py-3">
      <div className="flex items-center gap-3">
        <span className={`grid h-5 w-5 place-items-center rounded-full border ${done ? "border-forest-700 bg-forest-700 text-linen" : "border-forest-700/30"}`}>
          {done ? <Check size={13} /> : null}
        </span>
        <span className="text-sm font-medium text-forest-900">{label}</span>
      </div>
      {priority === "hoch" ? <span className="rounded-full bg-clay/55 px-2 py-1 text-[0.65rem] font-semibold text-forest-900">wichtig</span> : null}
    </div>
  );
}
