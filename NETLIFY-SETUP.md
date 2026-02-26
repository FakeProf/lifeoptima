# Netlify Functions Setup – LifeOptima

## Umgebungsvariablen (Site Settings → Environment Variables)

Diese Variablen müssen in Netlify hinterlegt werden:

| Variable | Beschreibung |
|----------|--------------|
| `DATABASE_URL` | Neon PostgreSQL Connection String (aus .env) |
| `JWT_SECRET` | Geheimer String für JWT (z.B. 32+ Zeichen) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `VAPID_PUBLIC_KEY` | (Optional) Für Push – aus backend/vapid.json |
| `VAPID_PRIVATE_KEY` | (Optional) Für Push – aus backend/vapid.json |

## Google Cloud Console

**Weiterleitungs-URI** für die Netlify-App hinzufügen:
```
https://lifeoptima.netlify.app/api/google-fit/callback
```

## VAPID Keys (für Push-Benachrichtigungen)

Lokal erzeugen:
```bash
cd backend
node -e "const w=require('web-push'); const k=w.generateVAPIDKeys(); console.log('VAPID_PUBLIC_KEY:', k.publicKey); console.log('VAPID_PRIVATE_KEY:', k.privateKey);"
```
Die Ausgabe in die Netlify Env-Variablen eintragen.
