import type { ReactNode } from "react";
import { CalendarDays, MapPinned, Route } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TripForm } from "@/components/forms";
import { ProgressBar } from "@/components/progress-bar";
import { SectionTitle, SoftCard } from "@/components/ui";
import { getTrips } from "@/lib/data";

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <AppShell title="Reisen">
      <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
        <div>
          <SectionTitle title="Reiseübersicht" action="Mai 2026" />
          <div className="grid gap-4 lg:grid-cols-2">
            {trips.map((trip) => (
              <SoftCard key={trip.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-semibold text-forest-900">{trip.title}</h1>
                    <p className="mt-1 text-sm text-forest-900/60">{trip.region}</p>
                    <p className="mt-1 text-xs text-forest-900/50">{trip.dates}</p>
                  </div>
                  <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-forest-900">{trip.days} Tage</span>
                </div>
                <div className="my-5 grid grid-cols-3 gap-2 text-center">
                  <Metric icon={<Route size={16} />} label="Route" value={`${trip.distanceKm} km`} />
                  <Metric icon={<MapPinned size={16} />} label="Stopps" value={`${trip.stops}`} />
                  <Metric icon={<CalendarDays size={16} />} label="Budget" value={`${trip.budget} EUR`} />
                </div>
                <ProgressBar value={trip.spent} max={trip.budget} />
                <p className="mt-2 text-xs text-forest-900/58">{trip.spent.toFixed(2)} EUR bisher geplant</p>
              </SoftCard>
            ))}
          </div>
        </div>
        <SoftCard>
          <h2 className="text-lg font-semibold text-forest-900">Neue Reise</h2>
          <p className="mt-1 text-sm text-forest-900/58">Lege eine Reise an und speichere sie in Supabase.</p>
          <div className="mt-4">
            <TripForm />
          </div>
        </SoftCard>
      </div>
    </AppShell>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-forest-50 p-3">
      <div className="mx-auto grid h-7 w-7 place-items-center text-forest-700">{icon}</div>
      <p className="mt-1 text-xs text-forest-900/55">{label}</p>
      <p className="text-sm font-semibold text-forest-900">{value}</p>
    </div>
  );
}
