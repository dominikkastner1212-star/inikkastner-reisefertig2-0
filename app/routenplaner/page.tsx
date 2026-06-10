import { CalendarDays, MapPinned } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LeafletRouteMap } from "@/components/leaflet-route-map";
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
      <LeafletRouteMap trip={trip} places={savedPlaces} />
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
