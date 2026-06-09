import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, Caravan, Home, LogOut, Map, MapPinned, Plus, Route, User } from "lucide-react";
import { signOut } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/dashboard", label: "Start", icon: Home },
  { href: "/reisen", label: "Karte", icon: Map },
  { href: "/routenplaner", label: "Planung", icon: Route },
  { href: "/packlisten", label: "Listen", icon: CalendarDays },
  { href: "/fahrzeug", label: "Profil", icon: User }
];

const sideItems = [
  { href: "/dashboard", label: "Start", icon: Home },
  { href: "/reisen", label: "Reisen", icon: Map },
  { href: "/packlisten", label: "Packlisten", icon: CalendarDays },
  { href: "/routenplaner", label: "Routen", icon: Route },
  { href: "/stellplaetze/seecamping-mentl", label: "Stellplätze", icon: MapPinned },
  { href: "/fahrzeug", label: "Fahrzeug", icon: Caravan },
  { href: "/kosten", label: "Kosten", icon: Plus }
];

export async function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen lg:flex">
      <aside className="glass-panel fixed left-4 top-4 z-30 hidden h-[calc(100vh-2rem)] w-64 rounded-[1.5rem] p-4 lg:block">
        <Logo />
        <nav className="mt-8 grid gap-1">
          {sideItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-forest-900/75 transition hover:bg-forest-100 hover:text-forest-900">
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="absolute bottom-4 left-4 right-4">
          <p className="mb-2 truncate px-3 text-xs text-forest-900/55">{user?.email ?? "Offline-Modus"}</p>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-forest-900/75 transition hover:bg-forest-100 hover:text-forest-900">
            <LogOut size={18} />
            Abmelden
          </button>
        </form>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 lg:ml-72 lg:px-8 lg:pb-10">
        <header className="mb-5 flex items-center justify-between lg:hidden">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-linen text-forest-900 shadow-inset" aria-label="Menü">
            <span className="h-0.5 w-4 rounded bg-current before:mt-[-6px] before:block before:h-0.5 before:w-4 before:rounded before:bg-current after:mt-[10px] after:block after:h-0.5 after:w-4 after:rounded after:bg-current" />
          </button>
          <p className="text-sm font-semibold">{title ?? "Reisefertig2.0"}</p>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-linen text-forest-900 shadow-inset" aria-label="Profil">
            <User size={18} />
          </button>
        </header>
        {children}
      </main>
      <nav className="glass-panel safe-bottom fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 gap-1 rounded-t-[1.5rem] px-4 pt-3 lg:hidden">
        {navItems.map((item, index) => (
          <Link key={item.href} href={item.href} className="grid place-items-center gap-1 text-[0.68rem] font-medium text-forest-900/75">
            <span className={`grid h-9 w-9 place-items-center rounded-full ${index === 2 ? "bg-forest-700 text-linen" : ""}`}>
              <item.icon size={18} />
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
