import { Plus } from "lucide-react";
import { createCost, createPackItem, createTrip, deleteTrip, togglePackItem, toggleSavedPlace, updateTrip, updateVehicle } from "@/lib/actions";
import type { PackItem, Trip } from "@/lib/types";
import { vehicle as mockVehicle } from "@/data/mock";

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

export function TripEditForm({ trip }: { trip: Trip }) {
  return (
    <details className="mt-4 rounded-2xl bg-forest-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-forest-900">Bearbeiten</summary>
      <form action={updateTrip} className="mt-3 grid gap-3">
        <input type="hidden" name="id" value={trip.id} />
        <input name="title" defaultValue={trip.title} required className={inputClass} />
        <input name="region" defaultValue={trip.region} className={inputClass} />
        <input name="dates" defaultValue={trip.dates} className={inputClass} />
        <div className="grid grid-cols-2 gap-2">
          <input name="days" type="number" min="1" defaultValue={trip.days} className={inputClass} />
          <input name="stops" type="number" min="0" defaultValue={trip.stops} className={inputClass} />
          <input name="distanceKm" type="number" min="0" defaultValue={trip.distanceKm} className={inputClass} />
          <input name="budget" type="number" min="0" step="0.01" defaultValue={trip.budget} className={inputClass} />
        </div>
        <button className="h-11 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">Änderungen speichern</button>
      </form>
      <form action={deleteTrip} className="mt-2">
        <input type="hidden" name="id" value={trip.id} />
        <button className="h-10 w-full rounded-2xl bg-clay/45 text-sm font-semibold text-forest-900">Reise löschen</button>
      </form>
    </details>
  );
}

export function PackItemForm({ tripId }: { tripId?: string }) {
  return (
    <form action={createPackItem} className="grid gap-3">
      <input type="hidden" name="tripId" value={tripId ?? ""} />
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

export function VehicleForm({ vehicle = mockVehicle }: { vehicle?: typeof mockVehicle }) {
  return (
    <form action={updateVehicle} className="grid gap-3">
      <input name="name" defaultValue={vehicle.name} placeholder="Fahrzeug" className={inputClass} />
      <input name="plate" defaultValue={vehicle.plate} placeholder="Kennzeichen" className={inputClass} />
      <div className="grid grid-cols-2 gap-2">
        <input name="mileage" defaultValue={vehicle.mileage} placeholder="Kilometerstand" className={inputClass} />
        <input name="range" defaultValue={vehicle.range} placeholder="Reichweite" className={inputClass} />
        <input name="water" type="number" min="0" max="100" defaultValue={vehicle.water} placeholder="Wasser %" className={inputClass} />
        <input name="wastewater" type="number" min="0" max="100" defaultValue={vehicle.wastewater} placeholder="Abwasser %" className={inputClass} />
        <input name="battery" type="number" min="0" max="100" defaultValue={vehicle.battery} placeholder="Batterie %" className={inputClass} />
        <input name="nextService" defaultValue={vehicle.nextService} placeholder="Service" className={inputClass} />
      </div>
      <button className="h-12 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">Fahrzeug speichern</button>
    </form>
  );
}

export function SavePlaceButton({ placeId, saved }: { placeId: string; saved: boolean }) {
  return (
    <form action={toggleSavedPlace}>
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="saved" value={String(saved)} />
      <button className={`mt-4 h-12 w-full rounded-2xl text-sm font-semibold ${saved ? "bg-cream text-forest-900" : "bg-forest-700 text-linen"}`}>
        {saved ? "Gespeichert" : "Stellplatz speichern"}
      </button>
    </form>
  );
}
