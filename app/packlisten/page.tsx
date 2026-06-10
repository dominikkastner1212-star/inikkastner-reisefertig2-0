import { AppShell } from "@/components/app-shell";
import { PackItemForm } from "@/components/forms";
import { PackToggle } from "@/components/pack-toggle";
import { SectionTitle, SoftCard } from "@/components/ui";
import { getPackItems, getTrips } from "@/lib/data";

const categories = ["Wohnmobil", "Kleidung", "Kueche", "Dokumente"] as const;

export default async function PacklistsPage() {
  const [packItems, trips] = await Promise.all([getPackItems(), getTrips()]);
  const doneCount = packItems.filter((item) => item.done).length;
  const progress = packItems.length ? Math.round((doneCount / packItems.length) * 100) : 0;
  const activeTrip = trips[0];

  return (
    <AppShell title="Packliste">
      <SectionTitle title="Packliste" action="Mobile Liste" />
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-4">
          {categories.map((category) => {
            const items = packItems.filter((item) => item.category === category);
            if (!items.length) return null;

            return (
              <SoftCard key={category}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-forest-900">{category === "Kueche" ? "Küche" : category}</h2>
                  <span className="text-xs font-semibold text-forest-900/55">
                    {items.filter((item) => item.done).length}/{items.length}
                  </span>
                </div>
                <div className="grid gap-2">
                  {items.map((item) => (
                    <PackToggle key={item.id} item={item} />
                  ))}
                </div>
              </SoftCard>
            );
          })}
        </div>
        <SoftCard>
          <p className="text-sm font-semibold text-forest-900">Packstatus</p>
          <p className="mt-4 text-5xl font-semibold text-forest-700">{progress}%</p>
          <p className="mt-2 text-sm leading-6 text-forest-900/62">{doneCount} von {packItems.length} Punkten sind erledigt.</p>
          <div className="mt-6 border-t border-forest-700/10 pt-5">
            <p className="mb-3 text-sm font-semibold text-forest-900">Neuer Packpunkt</p>
            <PackItemForm tripId={activeTrip?.id} />
          </div>
        </SoftCard>
      </div>
    </AppShell>
  );
}
