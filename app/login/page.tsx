import { Suspense } from "react";
import { Caravan, LockKeyhole } from "lucide-react";
import { signIn, signUp } from "@/lib/actions";
import { Logo } from "@/components/logo";

export default function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string; next?: string }> }) {
  return (
    <Suspense>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: { searchParams: Promise<{ message?: string; next?: string }> }) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <div className="w-full max-w-5xl lg:grid lg:grid-cols-[1fr_24rem] lg:gap-8">
        <section className="hidden content-center lg:grid">
          <Logo />
          <h1 className="mt-10 max-w-xl text-6xl font-semibold leading-none text-forest-900">Reisen privat organisieren.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-forest-900/64">
            Melde dich an, damit Reisen, Packlisten und Kosten nur dir gehören.
          </p>
        </section>

        <section className="glass-panel rounded-[2rem] p-5">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-50 text-forest-700">
            <Caravan size={28} />
          </div>
          <h2 className="mt-5 text-center text-3xl font-semibold text-forest-900">Reisefertig2.0</h2>
          <p className="mt-2 text-center text-sm text-forest-900/60">Einloggen oder neu registrieren</p>

          {params.message ? (
            <p className="mt-4 rounded-xl bg-clay/35 px-3 py-2 text-center text-xs font-semibold text-forest-900">{messageText(params.message)}</p>
          ) : null}

          <AuthForm action={signIn} button="Einloggen" next={params.next} />

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-forest-700/10" />
            <span className="text-xs font-semibold text-forest-900/45">oder</span>
            <span className="h-px flex-1 bg-forest-700/10" />
          </div>

          <AuthForm action={signUp} button="Konto erstellen" next={params.next} secondary />
        </section>
      </div>
    </main>
  );
}

function AuthForm({
  action,
  button,
  next,
  secondary = false
}: {
  action: (formData: FormData) => Promise<void>;
  button: string;
  next?: string;
  secondary?: boolean;
}) {
  return (
    <form action={action} className="mt-5 grid gap-3">
      <input type="hidden" name="next" value={next ?? "/dashboard"} />
      <label className="grid gap-1 text-xs font-semibold text-forest-900/60">
        E-Mail
        <input name="email" type="email" required autoComplete="email" className="min-h-11 rounded-xl border border-forest-700/10 bg-linen px-3 text-sm text-forest-900 outline-none ring-forest-700/20 focus:ring-4" />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-forest-900/60">
        Passwort
        <input name="password" type="password" required minLength={6} autoComplete={secondary ? "new-password" : "current-password"} className="min-h-11 rounded-xl border border-forest-700/10 bg-linen px-3 text-sm text-forest-900 outline-none ring-forest-700/20 focus:ring-4" />
      </label>
      <button className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold ${secondary ? "bg-cream text-forest-900" : "bg-forest-700 text-linen"}`}>
        <LockKeyhole size={17} />
        {button}
      </button>
    </form>
  );
}

function messageText(message: string) {
  const messages: Record<string, string> = {
    "login-fehlgeschlagen": "Login fehlgeschlagen. Prüfe E-Mail und Passwort.",
    "registrierung-fehlgeschlagen": "Registrierung fehlgeschlagen. Vielleicht existiert das Konto schon.",
    "bitte-email-bestaetigen": "Bitte bestätige deine E-Mail und logge dich danach ein.",
    "supabase-fehlt": "Supabase ist noch nicht konfiguriert."
  };

  return messages[message] ?? "Bitte versuche es erneut.";
}
