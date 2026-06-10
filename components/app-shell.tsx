import Link from "next/link";
import type { ReactNode } from "react";
import { Home } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { MobileNav, SideNav } from "@/components/app-nav";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export async function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen lg:flex">
      <aside className="glass-panel fixed left-4 top-4 z-30 hidden h-[calc(100vh-2rem)] w-64 rounded-[1.5rem] p-4 lg:block">
        <Logo />
        <SideNav email={user?.email} />
      </aside>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 lg:ml-72 lg:px-8 lg:pb-10">
        <header className="mb-5 flex items-center justify-between lg:hidden">
          <Link href="/dashboard" className="pressable grid h-10 w-10 place-items-center rounded-full bg-linen text-forest-900 shadow-inset" aria-label="Start">
            <Home size={19} />
          </Link>
          <p className="text-sm font-semibold">{title ?? "Reisefertig2.0"}</p>
          <ThemeToggle />
        </header>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
