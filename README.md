# Reisefertig2.0

Reisefertig2.0 ist eine mobile-first PWA für die Organisation von Wohnmobilreisen.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase vorbereitet
- PWA Manifest
- Mockdaten für den ersten UI-Stand

## Lokaler Start

```bash
npm install
npm run dev
```

Oder gebündelt:

```bash
bash scripts/bootstrap.sh
```

## Supabase

Kopiere `.env.example` nach `.env.local` und fülle:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Das verbundene Supabase-Projekt heißt `Reisefertig2.0` und hat diese URL:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://skbpamzsfubkthzdtocw.supabase.co
```

Den `NEXT_PUBLIC_SUPABASE_ANON_KEY` kopierst du aus Supabase unter Project Settings -> API.

Die App nutzt Mockdaten aus `data/mock.ts`, solange keine Supabase-Variablen gesetzt sind. Der vorbereitete Client liegt in `lib/supabase.ts`, die Datenzugriffsschicht in `lib/data.ts`, das erste SQL-Schema in `supabase/schema.sql` und Demo-Inhalte in `supabase/seed.sql`.

## Datenmodell

Der erste Schnitt enthält:

- `trips`
- `places`
- `packItems`
- `costs`
- `vehicle`

Diese Struktur kann direkt in Supabase-Tabellen überführt werden.

## Deployment

Für Vercel:

```bash
vercel
```

Danach die Supabase-Variablen im Vercel-Projekt unter Environment Variables setzen.
