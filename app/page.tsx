import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Globe, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Scenery } from "@/components/scenery";
import { PrimaryButton, SoftCard } from "@/components/ui";

export default function LandingPage() {
  const features: Array<[string, string, LucideIcon]> = [
    ["Mobile-first", "Eine App-Shell, die sich wie ein ruhiger Reisebegleiter anfühlt.", MonitorSmartphone],
    ["Mockdaten zuerst", "Supabase ist vorbereitet, die Oberfläche läuft direkt mit Demo-Inhalten.", ShieldCheck],
    ["Reise-Flow", "Routen, Stellplätze, Packlisten, Kosten und Fahrzeugstatus greifen zusammen.", Globe]
  ];

  return (
    <main className="min-h-screen px-5 py-6 lg:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
        <Link href="/dashboard" className="rounded-full border border-forest-700/15 bg-linen px-4 py-2 text-sm font-semibold text-forest-900">
          App öffnen
        </Link>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] text-forest-900 sm:text-6xl lg:text-7xl">
            Reisefertig2.0
          </h1>
          <p className="mt-5 max-w-md text-xl font-medium text-forest-900">Deine Reise. Perfekt organisiert.</p>
          <p className="mt-6 max-w-md text-base leading-7 text-forest-900/68">
            Plane Wohnmobil-Abenteuer, verwalte Packlisten, Kosten, Stellplätze und Routen an einem ruhigen Ort.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="/dashboard">Jetzt starten</PrimaryButton>
            <span className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-linen px-4 text-sm font-semibold text-forest-900 shadow-inset">
              <Globe size={17} />
              PWA bereit
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-forest-700/10 bg-linen p-3 shadow-soft">
          <div className="overflow-hidden rounded-[1.55rem] bg-linen">
            <div className="grid min-h-[34rem] content-between">
              <div className="px-8 pt-14 text-center">
                <div className="mx-auto w-fit">
                  <Logo compact />
                </div>
                <h2 className="mt-4 text-4xl font-semibold text-forest-900">Reisefertig2.0</h2>
                <p className="mt-2 text-sm text-forest-900/65">Planen. Entdecken. Erleben.</p>
              </div>
              <Scenery />
              <div className="p-5">
                <Link href="/dashboard" className="grid h-12 place-items-center rounded-2xl bg-forest-700 text-sm font-semibold text-linen">
                  Los geht&apos;s
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 pb-10 md:grid-cols-3">
        {features.map(([title, text, Icon]) => (
          <SoftCard key={title}>
            <Icon className="text-forest-700" size={22} />
            <h3 className="mt-4 text-lg font-semibold text-forest-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-forest-900/64">{text}</p>
          </SoftCard>
        ))}
      </section>
    </main>
  );
}
