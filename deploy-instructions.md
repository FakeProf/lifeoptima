# LifeOptima Push-Benachrichtigungen Deployment

## 🚀 Schnellstart

### 1. Lokales Backend starten
```bash
cd backend
npm install
npm start
```

### 2. Frontend testen
- Öffne `index.html` im Browser
- Gehe zu "Tagesplan" → "Bearbeiten" → Aktiviere Benachrichtigungen
- Oder zu "Supplements" → "Meine Supplements" → Erinnerung einstellen

## 🌐 Produktions-Deployment

### Option 1: Heroku (Empfohlen)
```bash
# Backend deployen
cd backend
heroku create lifeoptima-push
git init
git add .
git commit -m "Initial commit"
git push heroku main

# URL in index.html anpassen (Zeile 3072)
# https://lifeoptima-push.herokuapp.com
```

### Option 2: Railway
```bash
cd backend
railway login
railway init
railway up
```

### Option 3: Vercel
```bash
cd backend
vercel --prod
```

## 🔧 Konfiguration

### Backend-URL anpassen
In `index.html` Zeile 3072:
```javascript
const BACKEND_URL = window.location.protocol === 'https:' 
    ? 'https://deine-backend-url.herokuapp.com'  // Deine URL hier
    : 'http://localhost:4000';
```

### HTTPS erforderlich
- Push-Benachrichtigungen funktionieren nur über HTTPS
- Ausnahme: localhost für Entwicklung
- Für Produktion: HTTPS-Domain verwenden

## ✅ Testen

1. **Backend-Status prüfen:**
   - `https://deine-backend-url.herokuapp.com/` → Status OK

2. **Push-Subscription testen:**
   - Browser-Konsole öffnen
   - Nach "Push Subscription registriert" suchen

3. **Benachrichtigungen testen:**
   - Tagesplan-Benachrichtigung setzen
   - Supplement-Erinnerung einstellen
   - Timer-Benachrichtigung (90 Min)

## 🐛 Troubleshooting

### Backend nicht erreichbar
- CORS-Fehler: Backend läuft nicht oder falsche URL
- HTTPS-Fehler: Nur HTTPS für Push-Benachrichtigungen

### Keine Benachrichtigungen
- Browser-Berechtigung prüfen
- Service Worker registriert?
- Backend-Logs prüfen

### Lokale Entwicklung
```bash
# Backend starten
cd backend && npm start

# Frontend mit Live-Server
npx live-server --port=3000
```

## 📱 PWA Installation

1. App im Browser öffnen
2. "App installieren" Button klicken
3. Oder Browser-Menü → "Zum Startbildschirm hinzufügen"

## 🔔 Benachrichtigungs-Features

- **Tagesplan:** Zeitbasierte Erinnerungen
- **Supplements:** Tägliche Einnahme-Erinnerungen  
- **Timer:** 90-Minuten Focus-Timer
- **Wiederholungen:** Tägliche/wöchentliche Benachrichtigungen

