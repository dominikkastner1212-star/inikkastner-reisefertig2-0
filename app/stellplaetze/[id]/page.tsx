import type { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Droplets, Heart, MapPin, ShowerHead, Star, Trash2, Wifi, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SavePlaceButton } from "@/components/forms";
import { SoftCard } from "@/components/ui";
import { getIsPlaceSaved, getPlace } from "@/lib/data";

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [place, saved] = await Promise.all([getPlace(id), getIsPlaceSaved(id)]);
  if (!place) notFound();

  const amenities: Array<[string, LucideIcon]> = [
    ["Strom", Zap],
    ["Wasser", Droplets],
    ["Entsorgung", Trash2],
    ["WLAN", Wifi],
    ["Dusche", ShowerHead],
    ["Hunde erlaubt", Heart]
  ];

  return (
    <AppShell title="Stellplatz">
      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="h-64 rounded-[2rem] bg-[linear-gradient(150deg,#dfe8d4,#f7f0e3)] shadow-soft">
            <div className="h-full rounded-[2rem] bg-[radial-gradient(circle_at_72%_22%,#d6bf99_0_2.4rem,transparent_2.5rem),linear-gradient(25deg,rgba(47,81,59,.4),transparent_58%)]" />
          </div>
          <div className="mt-5">
            <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-forest-900">Stellplatz</span>
            <h1 className="mt-3 text-3xl font-semibold text-forest-900">{place.name}</h1>
            <p className="mt-1 text-sm text-forest-900/62">{place.location}</p>
            <div className="mt-3 flex gap-3 text-sm font-semibold text-forest-900">
              <span className="inline-flex items-center gap-1"><Star size={16} fill="currentColor" />{place.rating}</span>
              <span>Geöffnet</span>
            </div>
          </div>
          <SoftCard className="mt-5">
            <h2 className="font-semibold text-forest-900">Über den Stellplatz</h2>
            <p className="mt-3 text-sm leading-6 text-forest-900/66">{place.description}</p>
            <p className="mt-4 inline-flex items-center gap-2 border-t border-forest-700/10 pt-4 text-sm text-forest-900/62">
              <MapPin size={17} />
              Pressegger See 7, 9620 Hermagor, Österreich
            </p>
          </SoftCard>
        </div>
        <div className="grid gap-4">
          <SoftCard>
            <div className="grid grid-cols-3 gap-3">
              {amenities.map(([label, Icon]) => (
                <div key={label} className="grid place-items-center gap-2 rounded-xl bg-forest-50 px-2 py-3 text-center text-[0.68rem] font-medium text-forest-900">
                  <Icon size={17} className="text-forest-700" />
                  {label}
                </div>
              ))}
            </div>
          </SoftCard>
          <SoftCard>
            <p className="text-2xl font-semibold text-forest-900">{place.price} EUR / Nacht</p>
            <p className="mt-1 text-xs text-forest-900/58">inkl. 2 Personen, Strom, WLAN</p>
            <SavePlaceButton placeId={place.id} saved={saved} />
            <button className="mt-2 h-12 w-full rounded-2xl bg-cream text-sm font-semibold text-forest-900">Verfügbarkeit prüfen</button>
          </SoftCard>
        </div>
      </section>
    </AppShell>
  );
}
