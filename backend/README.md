# LifeOptima Push Backend

Dieses Backend ermöglicht Web Push Benachrichtigungen für LifeOptima.

## Features
- Speichert Browser-Push-Subscriptions
- Sendet Push-Nachrichten an alle registrierten Clients
- Gibt den VAPID Public Key für den Client aus

## Setup

1. Node.js installieren
2. Im backend-Ordner `npm install` ausführen
3. Server starten mit:
   
   ```
   npm start
   ```

## Endpunkte
- `POST /subscribe` – Erwartet Subscription-Objekt im Body, speichert es
- `POST /send` – Erwartet `{ title, message }` im Body, sendet Push an alle
- `GET /vapidPublicKey` – Gibt den Public Key für den Client zurück

## Hinweise
- Subscriptions werden in `subscriptions.json` gespeichert
- VAPID-Schlüssel werden automatisch generiert und in `vapid.json` gespeichert 