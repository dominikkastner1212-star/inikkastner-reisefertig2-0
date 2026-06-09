# Reisefertig2.0 Projektstand

Stand: 2026-06-09

## Live

- App: https://inikkastner-reisefertig2-0.vercel.app
- Vercel Deployment: `dpl_CqCfFcLJTXfXc6aZaGVQdv3vmyeC`
- Deployment Status: `READY`
- GitHub Commit: `1c426b326c5f1c5e1d475f3bd3ea14ce27f14858`

## Supabase

- Projekt: `Reisefertig2.0`
- Projekt-ID: `skbpamzsfubkthzdtocw`
- URL: `https://skbpamzsfubkthzdtocw.supabase.co`

Aktive Migrationen:

- `initial_reisefertig2_schema`
- `seed_reisefertig2_demo_data`
- `add_auth_user_rls`
- `add_saved_places`

## Funktionsumfang

- Next.js PWA mit App Router
- Mobile-first UI im Reisefertig2.0 Designsystem
- Supabase Auth mit Login, Registrierung und Logout
- Geschützte App-Seiten
- Row Level Security für nutzereigene Daten
- Dashboard
- Reisen anlegen, bearbeiten und löschen
- Packlisten anlegen und abhaken
- Kosten erfassen
- Stellplätze anzeigen und speichern
- Routenplaner mit Etappen und gespeicherten Stellplätzen
- Fahrzeugdaten anzeigen und bearbeiten
- PWA Manifest und Offline-Seite

## Hinweise

- Eigene Domain ist noch offen.
- ZIP-Archiv und TypeScript-Buildinfo sollen nicht in zukünftige Commits.
- Nächste sinnvolle Schritte: Domain verbinden, UI-Detailtest auf Mobilgeräten, bessere echte Karten-/Routenintegration.
