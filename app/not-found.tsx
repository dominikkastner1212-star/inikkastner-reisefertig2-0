import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-forest-700">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-forest-900">Nicht gefunden</h1>
        <Link href="/dashboard" className="mt-6 inline-grid h-12 place-items-center rounded-2xl bg-forest-700 px-5 text-sm font-semibold text-linen">
          Zur App
        </Link>
      </div>
    </main>
  );
}
