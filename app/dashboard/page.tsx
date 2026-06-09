import type { LucideIcon } from "lucide-react";
import { Bell, CalendarDays, ClipboardList, MapPinned, Route, TentTree } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceCard, SectionTitle, SoftCard, TripCard } from "@/components/ui";
import { getPlaces, getTrips } from "@/lib/data";

const shortcuts: Array<[string, string, LucideIcon]> = [
  ["Reisen", "Übersicht", CalendarDays],
  ["Checkliste", "Packliste & mehr", ClipboardList],
  ["Stellplätze", "Finden & speichern", MapPinned],
  ["Routen", "Planen & anpassen", Route]
];

export default async function DashboardPage() {
  const [places, trips] = await Promise.all([getPlaces(), getTrips()]);

  return (
    <AppShell title="Start">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-forest-900">Guten Morgen</p>
          <p className="mt-1 text-sm text-forest-900/62">Bereit für dein nächstes Abenteuer?</p>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-linen text-forest-900 shadow-inset" aria-label="Benachrichtigungen">
          <Bell size={18} />
        </button>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_21rem]">
        <div className="grid gap-5">
          <TripCard trip={trips[0]} />
          <div className="grid grid-cols-2 gap-3">
            {shortcuts.map(([title, subtitle, Icon]) => (
              <SoftCard key={title}>
                <Icon className="text-forest-700" size={20} />
                <p className="mt-3 text-sm font-semibold text-forest-900">{title}</p>
                <p className="text-xs text-forest-900/55">{subtitle}</p>
              </SoftCard>
            ))}
          </div>
          <div>
            <SectionTitle title="Inspiration für dich" action="Alle anzeigen" />
            <div className="grid gap-3 md:grid-cols-2">
              {places.slice(0, 2).map((place) => <PlaceCard key={place.id} place={place} />)}
            </div>
          </div>
        </div>

        <SoftCard className="hidden lg:block">
          <div className="map-grid relative h-80 overflow-hidden rounded-2xl">
            <div className="absolute inset-x-8 top-10 h-48 rounded-[50%] border-b-4 border-l-4 border-forest-700/70" />
            <div className="absolute left-14 top-14 grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-xs font-bold text-linen">A</div>
            <div className="absolute right-16 top-36 grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-xs font-bold text-linen">B</div>
            <div className="absolute bottom-8 left-6 right-6 rounded-2xl bg-linen/90 p-4 shadow-soft">
              <TentTree size={20} className="text-forest-700" />
              <p className="mt-2 font-semibold">Alpenüberquerung</p>
              <p className="mt-1 text-xs text-forest-900/60">12 Stopps auf 850 km</p>
            </div>
          </div>
        </SoftCard>
      </div>
    </AppShell>
  );
}
