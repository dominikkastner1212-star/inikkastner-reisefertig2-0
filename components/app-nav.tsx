"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Caravan, Home, LogOut, Map, MapPinned, Plus, Route, User } from "lucide-react";
import { signOut } from "@/lib/actions";
import { PendingButton } from "@/components/pending-button";

const mobileItems = [
  { href: "/dashboard", label: "Start", icon: Home },
  { href: "/reisen", label: "Reisen", icon: Map },
  { href: "/routenplaner", label: "Route", icon: Route },
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

export function SideNav({ email }: { email?: string | null }) {
  return (
    <>
      <nav className="mt-8 grid gap-1">
        {sideItems.map((item) => (
          <NavLink key={item.href} item={item} variant="side" />
        ))}
      </nav>
      <form action={signOut} className="absolute bottom-4 left-4 right-4">
        <p className="mb-2 truncate px-3 text-xs text-forest-900/55">{email ?? "Offline-Modus"}</p>
        <PendingButton className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-forest-900/75 transition-colors hover:bg-forest-100 hover:text-forest-900" pendingText="Abmelden...">
          <LogOut size={18} />
          Abmelden
        </PendingButton>
      </form>
    </>
  );
}

export function MobileNav() {
  return (
    <nav className="glass-panel safe-bottom fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 gap-1 rounded-t-[1.5rem] px-4 pt-3 lg:hidden">
      {mobileItems.map((item) => (
        <NavLink key={item.href} item={item} variant="mobile" />
      ))}
    </nav>
  );
}

function NavLink({
  item,
  variant
}: {
  item: { href: string; label: string; icon: typeof Home };
  variant: "side" | "mobile";
}) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        prefetch
        className={`pressable grid place-items-center gap-1 rounded-xl py-1 text-[0.68rem] font-medium transition-colors ${active ? "text-forest-900" : "text-forest-900/68"}`}
      >
        <span className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${active ? "bg-forest-700 text-linen shadow-soft" : "bg-transparent"}`}>
          <item.icon size={18} />
        </span>
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      prefetch
      className={`pressable flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-forest-100 text-forest-900" : "text-forest-900/75 hover:bg-forest-100 hover:text-forest-900"}`}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  );
}
