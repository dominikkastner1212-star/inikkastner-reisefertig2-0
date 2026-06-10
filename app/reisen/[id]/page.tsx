import Link from "next/link";
import { notFound } from "next/navigation";
import { BatteryCharging, CalendarDays, Euro, MapPinned, Route, Shirt, Users, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CostForm, InviteMemberForm, MemberList, PackItemForm, PackToggle, TripEditForm } from "@/components/forms";
import { LeafletRouteMap } from "@/components/leaflet-route-map";
import { ProgressBar } from "@/components/progress-bar";
import { EmptyState, PlaceCard, SoftCard } from "@/components/ui";
import { getCosts, getPackItems, getSavedPlaces, getTrip, getTripMembers, getVehicle } from "@/lib/data";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [trip, packItems, costs, savedPlaces, vehicle, members] = await Promise.all([
    getTrip(id),
    getPackItems(id),
    getCosts(id),
    getSavedPlaces(),
    getVehicle(),
    getTripMembers(id)
  ]);

  if (!trip) notFound();

  const doneCount = packItems.filter((item) => item.done).length;
  const packProgress = packItems.length ? Math.round((doneCount / packItems.length) * 100) : 0;
  const costTotal = costs.reduce((sum, item) => sum + item.amount, 0);
  const budgetProgress = trip.budget ? Math.min(100, Math.round((costTotal / trip.budget) * 100)) : 0;

  return (
    <AppShell title={trip.title}>
      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-4">
          <SoftCard className="overflow-hidden p-0">
            <div className="p-5">
              <Link href="/reisen" className="text-xs font-semibold text-forest-700">Zurück zu Reisen</Link>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight text-forest-900">{trip.title}</h1>
                  <p className="mt-2 text-sm text-forest-900/62">{trip.region}</p>
                  <p className="mt-1 text-xs text-forest-900/50">{trip.dates}</p>
                </div>
                <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-forest-900">{trip.days} Tage</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Metric icon={<Route size={16} />} label="Route" value={`${trip.distanceKm} km`} />
                <Metric icon={<MapPinned size={16} />} label="Stopps" value={`${trip.stops}`} />
                <Metric icon={<CalendarDays size={16} />} label="Plan" value={`${budgetProgress}%`} />
              </div>
            </div>
            <div className="h-28 bg-[linear-gradient(150deg,#dfe8d4,#f7f0e3)]">
              <div className="h-full bg-[radial-gradient(circle_at_72%_22%,#d6bf99_0_2.2rem,transparent_2.3rem),linear-gradient(18deg,rgba(47,81,59,.4),transparent_58%)]" />
            </div>
          </SoftCard>

          <LeafletRouteMap trip={trip} places={savedPlaces} />

          <SoftCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-forest-900">Packliste</h2>
                <p className="mt-1 text-sm text-forest-900/58">{doneCount} von {packItems.length} erledigt</p>
              </div>
              <span className="text-2xl font-semibold text-forest-700">{packProgress}%</span>
            </div>
            <div className="mt-4">
              <ProgressBar value={doneCount} max={Math.max(packItems.length, 1)} />
            </div>
            <div className="mt-4 grid gap-2">
              {packItems.length ? (
                packItems.slice(0, 8).map((item) => <PackToggle key={item.id} item={item} />)
              ) : (
                <EmptyState title="Noch keine Packpunkte" text="Füge unten den ersten Packpunkt für diese Reise hinzu." />
              )}
            </div>
            <div className="mt-5 border-t border-forest-700/10 pt-4">
              <PackItemForm tripId={trip.id} />
            </div>
          </SoftCard>
        </div>

        <aside className="grid content-start gap-4">
          <SoftCard>
            <h2 className="text-lg font-semibold text-forest-900">Reise bearbeiten</h2>
            <TripEditForm trip={trip} />
          </SoftCard>

          <SoftCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-forest-900">Gemeinsam planen</h2>
                <p className="mt-1 text-sm text-forest-900/58">Lade Personen per E-Mail zu dieser Reise ein.</p>
              </div>
              <Users size={21} className="text-forest-700" />
            </div>
            <div className="mt-4">
              <InviteMemberForm tripId={trip.id} />
            </div>
            <div className="mt-5 border-t border-forest-700/10 pt-4">
              <MemberList tripId={trip.id} members={members} />
            </div>
          </SoftCard>

          <SoftCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-forest-900">Kosten</h2>
                <p className="mt-1 text-sm text-forest-900/58">{costTotal.toFixed(2)} EUR von {trip.budget.toFixed(2)} EUR</p>
              </div>
              <Euro size={22} className="text-forest-700" />
            </div>
            <div className="mt-4">
              <ProgressBar value={costTotal} max={Math.max(trip.budget, 1)} />
            </div>
            <div className="mt-4 grid gap-2">
              {costs.slice(0, 5).map((item) => (
                <div key={item.label} className="flex justify-between rounded-xl bg-forest-50 px-3 py-3 text-sm">
                  <span className="font-medium text-forest-900">{item.label}</span>
                  <span className="font-semibold text-forest-700">{item.amount.toFixed(2)} EUR</span>
                </div>
              ))}
            </div>
            <CostForm tripId={trip.id} />
          </SoftCard>

          <SoftCard>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-forest-900">Fahrzeug-Check</h2>
              <Wrench size={20} className="text-forest-700" />
            </div>
            <div className="mt-4 grid gap-2">
              <VehicleMetric icon={<BatteryCharging size={16} />} label="Batterie" value={`${vehicle.battery}%`} />
              <VehicleMetric icon={<Shirt size={16} />} label="Frischwasser" value={`${vehicle.water}%`} />
              <VehicleMetric icon={<Wrench size={16} />} label="Service" value={vehicle.nextService} />
            </div>
          </SoftCard>

          <SoftCard>
            <h2 className="text-lg font-semibold text-forest-900">Gespeicherte Stellplätze</h2>
            <div className="mt-4 grid gap-3">
              {savedPlaces.length ? (
                savedPlaces.slice(0, 3).map((place) => <PlaceCard key={place.id} place={place} />)
              ) : (
                <EmptyState title="Keine Favoriten" text="Speichere Stellplätze, damit sie hier und in der Route auftauchen." />
              )}
            </div>
          </SoftCard>
        </aside>
      </section>
    </AppShell>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-forest-50 p-3">
      <div className="mx-auto grid h-7 w-7 place-items-center text-forest-700">{icon}</div>
      <p className="mt-1 text-xs text-forest-900/55">{label}</p>
      <p className="text-sm font-semibold text-forest-900">{value}</p>
    </div>
  );
}

function VehicleMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-forest-50 px-3 py-3">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-forest-900">{icon}{label}</span>
      <span className="text-sm font-semibold text-forest-700">{value}</span>
    </div>
  );
}
