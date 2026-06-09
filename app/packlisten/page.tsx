import { AppShell } from "@/components/app-shell";
import { ChecklistRow, SectionTitle, SoftCard } from "@/components/ui";
import { getPackItems } from "@/lib/data";

const categories = ["Wohnmobil", "Kleidung", "Kueche", "Dokumente"] as const;

export default async function PacklistsPage() {
  const packItems = await getPackItems();

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
                    <ChecklistRow key={item.id} label={item.label} done={item.done} priority={item.priority} />
                  ))}
                </div>
              </SoftCard>
            );
          })}
        </div>
        <SoftCard>
          <p className="text-sm font-semibold text-forest-900">Packstatus</p>
          <p className="mt-4 text-5xl font-semibold text-forest-700">57%</p>
          <p className="mt-2 text-sm leading-6 text-forest-900/62">Vier Punkte sind erledigt. Kritische Dinge wie Gasflasche und Ausweise stehen noch offen.</p>
        </SoftCard>
      </div>
    </AppShell>
  );
}
