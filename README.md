# WestWallet

WestWallet är ett modernt hushållsekonomisystem med fokus på enkel import av banktransaktioner, smarta regler och smidig kategorisering. Projektet består av en NestJS-backend (SQLite/TypeORM) och en Vite/React-frontend. En React Native-app finns i `mobile/` (WIP).

## Översikt av funktioner

- Inloggning med JWT (demo-konto och registrering)
- Plånböcker och transaktioner (enkla endpoints för CRUD)
- Bankimport (CSV/XLSX) med förhandsgranskning
- Regler för autoifyllnad (mönster → kategori/leverantör)
- Inline-skapande av kategori/leverantör direkt i importen och i regelflödet
- Icke-destruktiv regelapplicering (fyller bara tomma fält; respekterar manuella val)
- Visuella indikatorer när regler matchar
- Leverantör väljer automatiskt rätt kategori (synk mellan val)
- Daglig automatisk databas-backup med retention (skript)
- Tydlig 401-hantering (banner på inloggningssidan vid utloggad session)

## Arkitektur

- Backend: NestJS, TypeORM, SQLite, JWT, Multer (uppladdning), CSV/XLSX-parsing
- Web: React + Vite, React Router, Axios, Tailwind
- Mobile: React Native (Android config inkluderad; funktionalitet WIP)

Databasfilen är en stabil SQLite-fil på disk så att data överlever omstart i dev.

## Kom igång

### Förutsättningar
- Node.js 18+ (rekommenderat)
- npm

### Installera
- Backend (workspaces):
	- Från repo-root: `npm run install:all`
	- eller i `backend/`: `npm install`
- Web: i `web/`: `npm install`

### Starta
- Backend (dev):
	- VS Code-task: “Start Backend” (kör `cd backend && npm run dev`)
	- eller manuellt i `backend/`: `npm run dev`
- Web: i `web/`: `npm run dev` (Vite, port 5173)

Öppna webben på `http://localhost:5173`.

### Demoanvändare och seed
- Kör seed för att få demo-konto, kategorier och leverantörer:
	- `cd backend && npm run seed`
- Demo-inlogg: `demo` / `demo123`

### Kör i Codespaces
Frontend detekterar Codespaces-domäner och riktar trafik till backend-porten automatiskt. CORS och preflight är konfigurerat i backend.

## Bankimport och regler

1) Ladda upp CSV/XLSX i vyn “Expenses”.
2) Förhandsgranska transaktioner, välj/skap(a) kategori och leverantör per rad.
3) Skapa regler från en rad (snabbknapp) eller via regellistan.
4) Regler som matchar (case-insensitive substring) fyller i saknade fält men skriver inte över dina manuella val.
5) Väljer du leverantör så synkas kategori automatiskt.

Indikatorer visar när en regel matchat även om något fält fortfarande är tomt (t.ex. leverantör saknas men kategori infererades).

## Autentisering och 401-banner

- Alla API-anrop injicerar JWT från `localStorage`.
- Vid 401 (session utloggad/ogiltig token) rensas token och du skickas till `/login`.
- Inloggningssidan visar en gul banner: “Sessionen har gått ut. Logga in igen.”

## Databas och backup

- SQLite-fil ligger i backend-projektet (konfigurerad via TypeORM, stabil sökväg).
- Vid start (prestart/predev) körs:
	- Automatisk daglig backup (`scripts/db-backup-auto.sh`)
	- Retention/prune (`scripts/db-prune.sh`, behåller senaste 7 lägen som standard)
- Manuella skript:
	- `npm run db:backup`
	- `npm run db:list-backups`
	- `npm run db:restore:latest`
	- `npm run db:prune-backups`

## API-översikt (kort)

- Auth: `POST /auth/register`, `POST /auth/login`
- Kategorier: `GET/POST/PUT/DELETE /categories`
- Leverantörer: `GET/POST/PUT/DELETE /suppliers`
- Plånböcker: `GET/POST /wallets`, `GET /wallets/:id`, transaktioner under wallet
- Importregler: `GET/POST/PUT/DELETE /expenses/import/rules`

Frontend-API-klient finns i `web/src/api/api.ts` med Axios-interceptors (token + 401-hantering).

## Projektstruktur (förenklad)

```
backend/          # NestJS + TypeORM + SQLite
	src/
		modules/      # auth, categories, suppliers, expenses (import), wallets, users
		entities/     # TypeORM-entities
		seed.ts       # Skapar demo-data (användare/kategorier/leverantörer)
	scripts/        # backup/list/restore/prune för SQLite

web/              # Vite + React
	src/
		pages/        # Login, Wallets, Expenses, Categories/Suppliers
		components/   # BankImportPreview, Navigation, Toast (m.m.)
		api/          # Axios-klient och API-hjälpare

mobile/           # React Native (WIP)
```

## Utvecklingsanteckningar (senaste större ändringar)

- CORS fixad och preflight-hantering i Nest bootstrap
- AuthContext flyttad till root för stabil HMR i web
- Inline-skapande av kategori/leverantör i importflödet och i regelmodals
- Regelsystem byggt: skapa/lista/aktivera/inaktivera/redigera/ta bort
- Regler appliceras partiellt (skriver inte över dina val) och kan inferera kategori från leverantör
- Visuella hintar + badge när en regel matchar
- Leverantörsval uppdaterar kategori automatiskt
- SQLite-sökväg stabiliserad (data överlever omstart), seed-skript och backup-flöde (auto daglig + retention)
- 401 global hantering med banner på inloggningssidan

## Kända begränsningar och nästa steg

- Produktionshärdning: slå av `synchronize` och använd migrations (TypeORM)
- Token-refresh och förbättrade felmeddelanden i UI
- Global banner/indikation även på privata sidor (utan redirect) via `AuthContext` (kan aktiveras)
- Mobile-klienten är WIP

## Bidra

Skapa gärna issues och PRs. För större ändringar, öppna en diskussion först.

## Licens

ISC
