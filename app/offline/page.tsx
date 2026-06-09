import Link from "next/link";
import { Logo } from "@/components/logo";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto w-fit">
          <Logo compact />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-forest-900">Du bist offline</h1>
        <p className="mt-3 text-sm leading-6 text-forest-900/62">Reisefertig2.0 ist als PWA vorbereitet. Sobald du wieder online bist, kannst du deine Reise weiterplanen.</p>
        <Link href="/dashboard" className="mt-6 inline-grid h-12 place-items-center rounded-2xl bg-forest-700 px-5 text-sm font-semibold text-linen">
          Zurück zur App
        </Link>
      </div>
    </main>
  );
}
