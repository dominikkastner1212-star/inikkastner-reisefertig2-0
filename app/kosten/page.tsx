import { AppShell } from "@/components/app-shell";
import { CostForm } from "@/components/forms";
import { SoftCard } from "@/components/ui";
import { getCosts, getTrips } from "@/lib/data";

export default async function CostsPage() {
  const [costs, trips] = await Promise.all([getCosts(), getTrips()]);
  const trip = trips[0];
  const total = costs.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppShell title="Kosten">
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <SoftCard>
          <p className="text-sm text-forest-900/60">Gesamtkosten</p>
          <p className="mt-2 text-5xl font-semibold text-forest-900">{total.toFixed(2)} EUR</p>
          <div className="relative mx-auto mt-8 h-44 w-44 rounded-full border-[1.1rem] border-moss">
            <div className="absolute inset-4 rounded-full border-[1.1rem] border-forest-700/80 border-r-clay border-t-stone" />
            <div className="absolute inset-0 grid place-items-center text-center">
              <span className="text-sm font-semibold text-forest-900">{trip.budget ? Math.round((total / trip.budget) * 100) : 0}%</span>
            </div>
          </div>
          <CostForm tripId={trip.id} />
        </SoftCard>
        <SoftCard>
          <h1 className="text-xl font-semibold text-forest-900">Budget nach Kategorie</h1>
          <div className="mt-5 grid gap-3">
            {costs.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-forest-900">{item.label}</span>
                  <span className="font-semibold text-forest-700">{item.amount.toFixed(2)} EUR</span>
                </div>
                <div className="h-2 rounded-full bg-forest-100">
                  <div className="h-full rounded-full" style={{ width: `${(item.amount / total) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </SoftCard>
      </div>
    </AppShell>
  );
}
