import Link from "next/link";
import { CheckCircle2, LogIn, Users } from "lucide-react";
import { acceptTripInvite } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";

export default async function InvitePage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const [{ token }, query, user] = await Promise.all([params, searchParams, getCurrentUser()]);
  const next = `/einladung/${token}`;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <section className="glass-panel w-full max-w-md rounded-[2rem] p-5">
        <Logo compact />
        <div className="mt-8 grid h-14 w-14 place-items-center rounded-full bg-forest-50 text-forest-700">
          <Users size={28} />
        </div>

        <h1 className="mt-5 text-3xl font-semibold leading-tight text-forest-900">Reise gemeinsam planen</h1>
        <p className="mt-3 text-sm leading-6 text-forest-900/62">
          Melde dich mit deiner eigenen E-Mail an und füge diese Reise zu deinem Reisefertig2.0-Konto hinzu.
        </p>

        {query.message === "ungueltig" ? (
          <p className="mt-5 rounded-xl bg-clay/35 px-3 py-2 text-sm font-semibold text-forest-900">
            Dieser Einladungslink ist abgelaufen oder nicht mehr gültig.
          </p>
        ) : null}

        {user ? (
          <form action={acceptTripInvite} className="mt-6">
            <input type="hidden" name="token" value={token} />
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-semibold text-linen">
              <CheckCircle2 size={18} />
              Einladung annehmen
            </button>
            <p className="mt-3 text-center text-xs text-forest-900/50">{user.email}</p>
          </form>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-semibold text-linen"
          >
            <LogIn size={18} />
            Einloggen oder Konto erstellen
          </Link>
        )}
      </section>
    </main>
  );
}
