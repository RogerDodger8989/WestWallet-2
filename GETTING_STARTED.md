# WestWallet - Hur du kör projektet

## 🚀 Snabbstart

### Backend (NestJS + TypeORM + SQLite)

1. **Starta backend:**
   ```bash
   cd /workspaces/WestWallet/backend
   npm run dev
   ```
   
   Backend körs nu på: http://localhost:3000

3. **Valfritt: kör migrationer** (om du slår av `synchronize`):
   ```bash
   # Kör i backend/
   npm run db:migrate
   ```

2. **Testa API:et:**
   
   **Registrera användare:**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H 'Content-Type: application/json' \
     -d '{"username":"demo","password":"demo123"}'
   ```
   
   **Logga in:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"username":"demo","password":"demo123"}'
   ```
   
   Detta ger dig en `access_token` som du använder för alla autentiserade anrop.

### Mobile (React Native)

#### Android Emulator

1. **Starta Android emulator** (från Android Studio eller kommandoraden)

2. **Kör mobile-appen:**
   ```bash
   cd /workspaces/WestWallet/mobile
   npm run android
   ```

3. **Eller starta Metro Bundler manuellt:**
   ```bash
   npm start
   ```
   Sedan tryck `a` för Android.

#### iOS Simulator (kräver macOS)

```bash
cd /workspaces/WestWallet/mobile
npm run ios
```

## 📱 Använda appen

1. **Registrera dig** - Skapa ett konto med användarnamn och lösenord
2. **Logga in** - Du kommer automatiskt till Wallets-skärmen
3. **Skapa plånbok** - Tryck på "+ Skapa ny plånbok"
4. **Lägg till transaktioner** - Tryck på en plånbok och välj "Lägg till transaktion"

## 🛠️ API Endpoints

### Autentisering
- `POST /auth/register` - Registrera ny användare
- `POST /auth/login` - Logga in (returnerar JWT token)

### Användare
- `GET /users/me` - Hämta inloggad användare (kräver JWT)
- `GET /users/:id` - Hämta specifik användare (kräver JWT)

### Plånböcker
- `GET /wallets` - Lista alla mina plånböcker (kräver JWT)
- `POST /wallets` - Skapa ny plånbok (kräver JWT)
- `GET /wallets/:id` - Hämta plånbok med saldo (kräver JWT)
- `POST /wallets/:id/transactions` - Skapa transaktion (kräver JWT)
- `GET /wallets/:id/transactions` - Lista transaktioner (kräver JWT)

## 🗄️ Databas

Backend använder SQLite och skapar automatiskt databasen i:
```
/workspaces/WestWallet/backend/data/sqlite.db

### Backup & återställning

Auto-backup körs vid start (en per dag) och en prune håller senaste 7.

Manuella skript (i `backend/`):
```bash
npm run db:backup
npm run db:list-backups
npm run db:restore:latest
npm run db:prune-backups
```

### Migrationer

Projektet har en TypeORM DataSource (`src/data-source.ts`) och en initial migration (`src/migrations/202511080001-InitialSchema.ts`).

- I dev kan du lämna `synchronize` på (default). För produktion: sätt `TYPEORM_SYNC=false` och kör migrationer:
   ```bash
   # Backend-mappen
   TYPEORM_SYNC=false npm run db:migrate
   ```
```

## 🎨 Mobile App Struktur

```
mobile/src/
├── App.tsx                  # Root component med navigation
├── api/
│   └── api.ts              # Axios client och API funktioner
├── context/
│   └── AuthContext.tsx     # Auth state management
└── screens/
    ├── LoginScreen.tsx     # Login/Register UI
    └── WalletsScreen.tsx   # Wallets lista och hantering
```

## 🔧 Felsökning

### Backend startar inte
```bash
# Kolla om port 3000 används
lsof -i :3000

# Döda processen
kill -9 <PID>
```

### Mobile kan inte ansluta till backend

- **Android Emulator**: Använd `10.0.2.2:3000` (redan konfigurerat)
- **iOS Simulator**: Använd `localhost:3000`
- **Fysisk enhet**: Använd din dators IP-adress (t.ex. `192.168.1.100:3000`)

Ändra i `mobile/src/api/api.ts`:
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000'; // Android emulator
// const API_BASE_URL = 'http://localhost:3000'; // iOS simulator
// const API_BASE_URL = 'http://192.168.1.100:3000'; // Fysisk enhet
```

## 💡 Bankimport & Regler (Web)

- Ladda upp CSV/XLSX i “Expenses”.
- Välj/skap(a) kategori och leverantör per rad; “+” öppnar inline dialog.
- Skapa regel från rad eller via regel-listan. Regler fyller i saknade fält, men skriver inte över dina val.
- Leverantör styr kategori automatiskt.
- En badge "Regel: …" visas vid match. Klicka den för att återställa enligt regeln.

## 🔐 Auth & Token Refresh

- JWT med 1h utgångstid. Klienten förnyar token automatiskt ~5 min innan utgång.
- Vid 401 rensas token och du dirigeras till /login där en banner förklarar läget.

## 🎯 Nästa steg

- [ ] Lägg till profilbild för användare
- [ ] Implementera kategorier för transaktioner
- [ ] Lägg till grafer för utgifter/inkomster
- [ ] Exportera transaktioner till CSV
- [ ] Dark/light mode toggle

Lycka till med din WestWallet! 🎉
