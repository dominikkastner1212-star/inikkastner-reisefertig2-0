import { Plus } from "lucide-react";
import { createCost, createPackItem, createTrip, togglePackItem } from "@/lib/actions";
import type { PackItem } from "@/lib/types";

const inputClass = "min-h-11 rounded-xl border border-forest-700/10 bg-linen px-3 text-sm text-forest-900 outline-none ring-forest-700/20 transition focus:ring-4";

export function TripForm() {
  return (
    <form action={createTrip} className="grid gap-3">
      <div>
        <label className="text-xs font-semibold text-forest-900/60" htmlFor="trip-title">Reise</label>
        <input id="trip-title" name="title" required placeholder="Neue Reise" className={`${inputClass} mt-1 w-full`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="region" placeholder="Region" className={inputClass} />
        <input name="dates" placeholder="Zeitraum" className={inputClass} />
        <input name="days" type="number" min="1" placeholder="Tage" className={inputClass} />
        <input name="distanceKm" type="number" min="0" placeholder="Kilometer" className={inputClass} />
        <input name="stops" type="number" min="0" placeholder="Stopps" className={inputClass} />
        <input name="budget" type="number" min="0" step="0.01" placeholder="Budget EUR" className={inputClass} />
      </div>
      <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">
        <Plus size={17} />
        Reise anlegen
      </button>
    </form>
  );
}

export function PackItemForm() {
  return (
    <form action={createPackItem} className="grid gap-3">
      <input name="label" required placeholder="Neuer Packpunkt" className={inputClass} />
      <div className="grid grid-cols-2 gap-2">
        <select name="category" className={inputClass} defaultValue="Wohnmobil">
          <option value="Wohnmobil">Wohnmobil</option>
          <option value="Kleidung">Kleidung</option>
          <option value="Kueche">Küche</option>
          <option value="Dokumente">Dokumente</option>
        </select>
        <select name="priority" className={inputClass} defaultValue="normal">
          <option value="normal">normal</option>
          <option value="hoch">wichtig</option>
        </select>
      </div>
      <button className="h-11 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">Hinzufügen</button>
    </form>
  );
}

export function PackToggle({ item }: { item: PackItem }) {
  return (
    <form action={togglePackItem}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="done" value={String(item.done)} />
      <button className="flex w-full items-center justify-between rounded-xl border border-forest-700/10 bg-linen/70 px-3 py-3 text-left transition hover:bg-forest-50">
        <div className="flex items-center gap-3">
          <span className={`grid h-5 w-5 place-items-center rounded-full border text-xs ${item.done ? "border-forest-700 bg-forest-700 text-linen" : "border-forest-700/30"}`}>
            {item.done ? "✓" : ""}
          </span>
          <span className="text-sm font-medium text-forest-900">{item.label}</span>
        </div>
        {item.priority === "hoch" ? <span className="rounded-full bg-clay/55 px-2 py-1 text-[0.65rem] font-semibold text-forest-900">wichtig</span> : null}
      </button>
    </form>
  );
}

export function CostForm({ tripId }: { tripId: string }) {
  return (
    <form action={createCost} className="mt-6 grid gap-3">
      <input type="hidden" name="tripId" value={tripId} />
      <input name="label" required placeholder="Kategorie" className={inputClass} />
      <div className="grid grid-cols-[1fr_4rem] gap-2">
        <input name="amount" required type="number" min="0" step="0.01" placeholder="Betrag" className={inputClass} />
        <input name="color" type="color" defaultValue="#55764d" className="h-11 rounded-xl border border-forest-700/10 bg-linen p-1" aria-label="Farbe" />
      </div>
      <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">
        <Plus size={17} />
        Ausgabe speichern
      </button>
    </form>
  );
}
