import { CalendarDays, MapPinned, SlidersHorizontal, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, SoftCard } from "@/components/ui";
import { getPlaces, getSavedPlaceIds, getTrips } from "@/lib/data";

export default async function RoutePlannerPage() {
  const [trips, places, savedPlaceIds] = await Promise.all([getTrips(), getPlaces(), getSavedPlaceIds()]);
  const trip = trips[0];
  const savedPlaces = places.filter((place) => savedPlaceIds.includes(place.id));

  return (
    <AppShell title="Routenplaner">
      {!trip ? (
        <EmptyState title="Noch keine Route" text="Lege zuerst eine Reise an. Danach kannst du hier Etappen und gespeicherte Stellplätze planen." />
      ) : null}
      <div className="relative overflow-hidden rounded-[2rem] border border-forest-700/10 bg-linen shadow-soft">
        <div className="map-grid relative h-[32rem]">
          <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-linen/85 text-forest-900 shadow-inset" aria-label="Filter">
            <SlidersHorizontal size={18} />
          </button>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 520" fill="none">
            <path d="M98 92 C132 148, 108 168, 168 207 C230 247, 188 310, 258 348 C300 371, 278 425, 315 468" stroke="#2f513b" strokeWidth="5" strokeLinecap="round" strokeDasharray="9 8" />
          </svg>
          {[
            ["A", "left-20 top-20"],
            ["A", "left-28 top-36"],
            ["B", "right-24 top-64"],
            ["P", "right-14 bottom-20"]
          ].map(([label, pos]) => (
            <span key={`${label}-${pos}`} className={`absolute ${pos} grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-xs font-bold text-linen ring-4 ring-linen/70`}>{label}</span>
          ))}
          <div className="absolute inset-x-3 bottom-3 rounded-[1.65rem] bg-linen/92 p-4 shadow-soft backdrop-blur">
            <h1 className="text-xl font-semibold text-forest-900">{trip?.title ?? "Neue Route"}</h1>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-forest-900/65">
              <span>{trip?.days ?? 0} Tage</span>
              <span>{trip?.distanceKm ?? 0} km</span>
              <span>{trip?.stops ?? 0} Stopps</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-forest-900/65">Eine atemberaubende Route durch die Alpen mit den schönsten Stellplätzen und Aussichtspunkten.</p>
            <div className="mt-4 flex gap-2">
              <button className="h-12 flex-1 rounded-2xl bg-cream text-sm font-semibold text-forest-900">Speichern</button>
              <button className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">
                <Zap size={16} />
                Route starten
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_22rem]">
        <SoftCard>
          <p className="text-sm font-semibold text-forest-900">Etappen</p>
          <div className="mt-3 grid gap-2">
            {["München - Achensee", "Achensee - Großglockner", "Pressegger See - Bled"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-forest-50 px-3 py-3 text-sm">
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-forest-700" />{item}</span>
                <span className="font-semibold text-forest-700">Tag {index + 1}</span>
              </div>
            ))}
          </div>
        </SoftCard>
        <SoftCard>
          <p className="text-sm font-semibold text-forest-900">Gespeicherte Stellplätze</p>
          <div className="mt-3 grid gap-2">
            {(savedPlaces.length ? savedPlaces : places.slice(0, 2)).map((place) => (
              <div key={place.id} className="rounded-xl bg-forest-50 px-3 py-3">
                <p className="text-sm font-semibold text-forest-900">{place.name}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-forest-900/58"><MapPinned size={13} />{place.location}</p>
              </div>
            ))}
          </div>
        </SoftCard>
      </div>
    </AppShell>
  );
}
