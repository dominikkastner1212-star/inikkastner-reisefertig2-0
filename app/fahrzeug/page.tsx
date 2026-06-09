import type { ReactNode } from "react";
import { BatteryCharging, Droplets, Fuel, Gauge, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SoftCard } from "@/components/ui";
import { getVehicle } from "@/lib/data";

export default async function VehiclePage() {
  const vehicle = await getVehicle();

  return (
    <AppShell title="Fahrzeug">
      <SoftCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-forest-900/58">Wohnmobil</p>
            <h1 className="mt-1 text-3xl font-semibold text-forest-900">{vehicle.name}</h1>
            <p className="mt-1 text-sm text-forest-900/62">{vehicle.plate} · {vehicle.mileage}</p>
          </div>
          <div className="h-24 w-32 rounded-2xl bg-[linear-gradient(145deg,#e9e3d5,#cbd9bd)] shadow-inset" />
        </div>
      </SoftCard>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Status icon={<Fuel size={19} />} label="Reichweite" value={vehicle.range} />
        <Status icon={<Droplets size={19} />} label="Frischwasser" value={`${vehicle.water}%`} />
        <Status icon={<Droplets size={19} />} label="Abwasser" value={`${vehicle.wastewater}%`} />
        <Status icon={<BatteryCharging size={19} />} label="Batterie" value={`${vehicle.battery}%`} />
        <Status icon={<Wrench size={19} />} label="Nächster Service" value={vehicle.nextService} />
        <Status icon={<Gauge size={19} />} label="Reifendruck" value="geprüft" />
      </div>
    </AppShell>
  );
}

function Status({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <SoftCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-50 text-forest-700">{icon}</span>
          <p className="text-sm font-semibold text-forest-900">{label}</p>
        </div>
        <p className="text-sm font-semibold text-forest-700">{value}</p>
      </div>
    </SoftCard>
  );
}
