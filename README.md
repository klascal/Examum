# Examen Systeem v2.0

Online examensysteem met admin, docent en kandidaat portals. 
Ingebouwde anti-fraud maatregelen en veilige timer.

## Installatie

```bash
npm install
```

## Configuratie

Kopieer `.env.example` naar `.env` en pas aan:

```bash
SESSION_SECRET=jouw_geheime_sleutel
PORT=3000
```

## Starten

```bash
npm start
```

## Default login

- **Admin**: admin / admin123

## Features

- ✅ Admin, Docent, Kandidaat rollen
- ✅ Anti-fraud: tab switching detectie
- ✅ Anti-fraud: rechtsklik blokkeren
- ✅ Anti-fraud: keyboard shortcuts blokkeren
- ✅ Server-side timer berekening
- ✅ Auto-inleveren bij timeout
- ✅ Resultaten inzien na afloop
- ✅ Rate limiting op logins
- ✅ Helmet security headers

## Structuur

```
src/
├── app.js              # Main Express app
├── config/
│   └── database.js     # SQLite + schema
├── middleware/
│   ├── auth.js         # Role checks
│   └── security.js     # Rate limiting + Helmet
├── routes/
│   ├── index.js        # Login/logout
│   ├── admin.js        # Admin portal
│   ├── docent.js       # Docent portal
│   ├── kandidaat.js    # Examen + timer
│   └── api.js          # AJAX endpoints
├── utils/
│   └── helpers.js      # generateCode, formatTime
└── db/
    └── examen.db       # SQLite database
```

## Anti-Fraud Maatregelen

| Maatregel | Implementatie |
|-----------|--------------|
| Tab switching | `visibilitychange` event, 2x = waarschuwing |
| Rechtsklik | `contextmenu` preventDefault |
| Copy/Paste | `copy`/`paste` preventDefault |
| DevTools | F12, Ctrl+Shift+I, Ctrl+U geblokkeerd |
| Timer | Server-side berekening, geen client manipulatie |
| Fraud logging | Elke overtreding wordt gelogd in database |
