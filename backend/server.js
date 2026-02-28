require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'lifeoptima-dev-secret';

// Google Fit OAuth Config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ||
    (process.env.URL ? `${process.env.URL}/api/google-fit/callback` : 'http://localhost:4000/api/google-fit/callback');

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS user_data (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    app_state JSONB NOT NULL DEFAULT '{}',
    daily_history JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE TABLE IF NOT EXISTS google_fit_tokens (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

let dbReadyPromise = null;
async function ensureDbReady() {
    const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    if (!dbUrl) {
        throw new Error('DATABASE_URL fehlt');
    }
    if (!dbReadyPromise) {
        dbReadyPromise = (async () => {
            await pool.query(SCHEMA_SQL);
        })().catch((err) => {
            dbReadyPromise = null;
            throw err;
        });
    }
    return dbReadyPromise;
}

// Netlify: Pfad /.netlify/functions/api/* → /api/* für Express-Routing
app.use((req, res, next) => {
    if (req.path.startsWith('/.netlify/functions/api')) {
        const rest = req.path.replace('/.netlify/functions/api', '') || '/';
        req.url = '/api' + rest + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
    }
    next();
});

// CORS für Frontend-Integration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json());

// ---------- Auth & User Data (Neon DB) ----------
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Nicht angemeldet' });
    }
    try {
        const token = header.slice(7);
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token' });
    }
}

// Register
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: 'E-Mail und Passwort (min. 6 Zeichen) erforderlich' });
    }
    try {
        await ensureDbReady();
        const password_hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email.trim().toLowerCase(), password_hash]
        );
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
        await pool.query(
            'INSERT INTO user_data (user_id, app_state, daily_history) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING',
            [user.id, JSON.stringify({}), JSON.stringify([])]
        );
        res.status(201).json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'E-Mail bereits registriert' });
        if (err.message === 'DATABASE_URL fehlt') return res.status(503).json({ error: 'Server nicht konfiguriert (DATABASE_URL fehlt)' });
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
    }
    try {
        await ensureDbReady();
        const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email.trim().toLowerCase()]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'E-Mail oder Passwort falsch' });
        }
        const user = result.rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: 'E-Mail oder Passwort falsch' });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
        if (err.message === 'DATABASE_URL fehlt') return res.status(503).json({ error: 'Server nicht konfiguriert (DATABASE_URL fehlt)' });
        console.error('Login error:', err);
        res.status(500).json({ error: 'Anmeldung fehlgeschlagen' });
    }
});

// Get my data (app state + daily history)
app.get('/api/me/data', authMiddleware, async (req, res) => {
    try {
        await ensureDbReady();
        const result = await pool.query(
            'SELECT app_state, daily_history FROM user_data WHERE user_id = $1',
            [req.userId]
        );
        if (result.rows.length === 0) {
            return res.json({ appState: null, dailyHistory: [] });
        }
        const row = result.rows[0];
        res.json({
            appState: row.app_state,
            dailyHistory: row.daily_history || []
        });
    } catch (err) {
        console.error('GET /api/me/data error:', err);
        res.status(500).json({ error: 'Daten konnten nicht geladen werden' });
    }
});

// Save my data
app.put('/api/me/data', authMiddleware, async (req, res) => {
    const { appState, dailyHistory } = req.body || {};
    if (appState === undefined && dailyHistory === undefined) {
        return res.status(400).json({ error: 'appState oder dailyHistory erforderlich' });
    }
    try {
        await ensureDbReady();
        if (appState !== undefined && dailyHistory !== undefined) {
            await pool.query(
                `INSERT INTO user_data (user_id, app_state, daily_history, updated_at)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (user_id) DO UPDATE SET app_state = $2, daily_history = $3, updated_at = NOW()`,
                [req.userId, JSON.stringify(appState), JSON.stringify(dailyHistory)]
            );
        } else if (appState !== undefined) {
            await pool.query(
                `INSERT INTO user_data (user_id, app_state, updated_at)
                 VALUES ($1, $2, NOW())
                 ON CONFLICT (user_id) DO UPDATE SET app_state = $2, updated_at = NOW()`,
                [req.userId, JSON.stringify(appState)]
            );
        } else {
            await pool.query(
                `INSERT INTO user_data (user_id, daily_history, updated_at)
                 VALUES ($1, $2, NOW())
                 ON CONFLICT (user_id) DO UPDATE SET daily_history = $2, updated_at = NOW()`,
                [req.userId, JSON.stringify(dailyHistory)]
            );
        }
        res.json({ ok: true });
    } catch (err) {
        console.error('PUT /api/me/data error:', err);
        res.status(500).json({ error: 'Speichern fehlgeschlagen' });
    }
});

// ---------- Google Fit Integration ----------
// OAuth Start: Redirect zu Google
app.get('/api/google-fit/auth', authMiddleware, (req, res) => {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        return res.status(503).json({
            error: 'Google Fit nicht konfiguriert. GOOGLE_CLIENT_ID und GOOGLE_CLIENT_SECRET in .env setzen.'
        });
    }
    try {
        const scopes = ['https://www.googleapis.com/auth/fitness.activity.read'];
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            state: req.userId,
            prompt: 'consent'
        });
        res.json({ authUrl });
    } catch (err) {
        console.error('Google Fit auth url error:', err);
        res.status(500).json({ error: 'Fehler beim Erzeugen der Auth-URL: ' + err.message });
    }
});

// OAuth Callback: Token speichern
app.get('/api/google-fit/callback', async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) {
        return res.redirect('/?google-fit=error');
    }
    try {
        await ensureDbReady();
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Token in DB speichern
        const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
        await pool.query(
            `INSERT INTO google_fit_tokens (user_id, access_token, refresh_token, expires_at)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id) DO UPDATE SET
                 access_token = $2, refresh_token = $3, expires_at = $4, created_at = NOW()`,
            [state, tokens.access_token, tokens.refresh_token, expiresAt]
        );
        res.redirect('/?google-fit=connected');
    } catch (err) {
        console.error('Google Fit callback error:', err);
        res.redirect('/?google-fit=error');
    }
});

// Schrittzahl abrufen
app.get('/api/google-fit/steps', authMiddleware, async (req, res) => {
    try {
        await ensureDbReady();
        const tokenResult = await pool.query(
            'SELECT access_token, refresh_token, expires_at FROM google_fit_tokens WHERE user_id = $1',
            [req.userId]
        );
        if (tokenResult.rows.length === 0) {
            return res.status(404).json({ error: 'Google Fit nicht verbunden' });
        }
        const tokenRow = tokenResult.rows[0];
        
        // Token erneuern falls abgelaufen
        oauth2Client.setCredentials({
            access_token: tokenRow.access_token,
            refresh_token: tokenRow.refresh_token
        });
        
        if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
            const { credentials } = await oauth2Client.refreshAccessToken();
            oauth2Client.setCredentials(credentials);
            await pool.query(
                'UPDATE google_fit_tokens SET access_token = $1, expires_at = $2 WHERE user_id = $3',
                [credentials.access_token, credentials.expiry_date ? new Date(credentials.expiry_date) : null, req.userId]
            );
        }
        
        const fitness = google.fitness('v1');
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startTimeMillis = startOfDay.getTime();
        const endTimeMillis = now.getTime();

        const response = await fitness.users.dataset.aggregate({
            userId: 'me',
            auth: oauth2Client,
            requestBody: {
                aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis,
                endTimeMillis
            }
        });

        let steps = 0;
        if (response.data.bucket && response.data.bucket.length > 0) {
            for (const bucket of response.data.bucket) {
                if (bucket.dataset) {
                    for (const ds of bucket.dataset) {
                        if (ds.point) {
                            for (const point of ds.point) {
                                if (point.value && point.value[0] && point.value[0].intVal !== undefined) {
                                    steps += parseInt(point.value[0].intVal, 10);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        res.json({ steps, date: new Date().toISOString().split('T')[0] });
    } catch (err) {
        console.error('Google Fit steps error:', err);
        if (err.code === 401) {
            // Token ungültig - Verbindung löschen
            await pool.query('DELETE FROM google_fit_tokens WHERE user_id = $1', [req.userId]);
            return res.status(401).json({ error: 'Google Fit Verbindung abgelaufen. Bitte erneut verbinden.' });
        }
        res.status(500).json({ error: 'Schrittzahl konnte nicht geladen werden' });
    }
});

// Google Fit Verbindung prüfen
app.get('/api/google-fit/status', authMiddleware, async (req, res) => {
    try {
        await ensureDbReady();
        const result = await pool.query(
            'SELECT expires_at FROM google_fit_tokens WHERE user_id = $1',
            [req.userId]
        );
        res.json({ connected: result.rows.length > 0 });
    } catch (err) {
        res.status(500).json({ error: 'Status konnte nicht geladen werden' });
    }
});

// Google Fit Verbindung trennen
app.delete('/api/google-fit/disconnect', authMiddleware, async (req, res) => {
    try {
        await ensureDbReady();
        await pool.query('DELETE FROM google_fit_tokens WHERE user_id = $1', [req.userId]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Verbindung konnte nicht getrennt werden' });
    }
});

// VAPID Keys: Env (Netlify) oder Datei (lokal)
let vapidKeys;
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    vapidKeys = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
} else {
    const vapidPath = path.join(__dirname, 'vapid.json');
    if (fs.existsSync(vapidPath)) {
        vapidKeys = JSON.parse(fs.readFileSync(vapidPath));
    } else {
        vapidKeys = webpush.generateVAPIDKeys();
        try { fs.writeFileSync(vapidPath, JSON.stringify(vapidKeys)); } catch (_) {}
    }
}

webpush.setVapidDetails(
    'mailto:info@lifeoptima.de',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Health Check Endpoint (nur für API-Checks)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'LifeOptima Push Backend',
        timestamp: new Date().toISOString(),
        pushEnabled: true,
        dbConfigured: !!(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL)
    });
});

// Statische Dateien servieren (für Frontend) - NACH allen API-Routen
app.use(express.static(path.join(__dirname, '..')));

// Fallback: index.html für alle anderen Routen (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Subscriptions speichern
const subsPath = path.join(__dirname, 'subscriptions.json');
function loadSubs() {
    if (fs.existsSync(subsPath)) {
        return JSON.parse(fs.readFileSync(subsPath));
    }
    return [];
}
function saveSubs(subs) {
    fs.writeFileSync(subsPath, JSON.stringify(subs, null, 2));
}

// Geplante Pushes speichern
const scheduledPushesPath = path.join(__dirname, 'scheduled-pushes.json');
function loadScheduledPushes() {
    if (fs.existsSync(scheduledPushesPath)) {
        return JSON.parse(fs.readFileSync(scheduledPushesPath));
    }
    return [];
}
function saveScheduledPushes(pushes) {
    fs.writeFileSync(scheduledPushesPath, JSON.stringify(pushes, null, 2));
}

// Endpunkt: Subscription registrieren
app.post('/subscribe', (req, res) => {
    const sub = req.body;
    let subs = loadSubs();
    if (!subs.find(s => s.endpoint === sub.endpoint)) {
        subs.push(sub);
        saveSubs(subs);
    }
    res.status(201).json({ message: 'Subscription gespeichert' });
});

// Endpunkt: Push an alle senden (Demo)
app.post('/send', async (req, res) => {
    const { title, message } = req.body;
    const subs = loadSubs();
    let results = [];
    for (const sub of subs) {
        try {
            await webpush.sendNotification(sub, JSON.stringify({ title, message }));
            results.push({ endpoint: sub.endpoint, status: 'ok' });
        } catch (err) {
            results.push({ endpoint: sub.endpoint, status: 'error', error: err.message });
        }
    }
    res.json({ results });
});

// Endpunkt: Push für später planen (verhindert Duplikate, unterstützt Wiederholung)
app.post('/schedule-push', (req, res) => {
    const { subscription, time, title, message, repeat, activity } = req.body;
    if (!subscription || !time || !title || !message || !activity) {
        return res.status(400).json({ error: 'subscription, time, title, message, activity erforderlich' });
    }
    let pushes = loadScheduledPushes();
    // Prüfe auf Duplikat (gleiche Subscription, Zeit, Aktivität)
    const exists = pushes.find(p => p.subscription.endpoint === subscription.endpoint && p.time === time && p.activity === activity && !p.sent);
    if (exists) {
        return res.status(200).json({ message: 'Push bereits geplant' });
    }
    pushes.push({ subscription, time, title, message, activity, repeat: !!repeat, sent: false });
    saveScheduledPushes(pushes);
    res.status(201).json({ message: 'Push geplant' });
});

// Endpunkt: Alle geplanten Pushes auflisten
app.get('/scheduled-pushes', (req, res) => {
    res.json(loadScheduledPushes());
});

// Endpunkt: Geplanten Push löschen
app.post('/delete-scheduled-push', (req, res) => {
    const { subscription, time, activity } = req.body;
    if (!subscription || !time || !activity) {
        return res.status(400).json({ error: 'subscription, time, activity erforderlich' });
    }
    let pushes = loadScheduledPushes();
    const before = pushes.length;
    pushes = pushes.filter(p => !(p.subscription.endpoint === subscription.endpoint && p.time === time && p.activity === activity && !p.sent));
    saveScheduledPushes(pushes);
    res.json({ removed: before - pushes.length });
});

// Cron-Job: prüft jede Minute auf fällige Pushes (berücksichtigt Wiederholung)
cron.schedule('* * * * *', async () => {
    let pushes = loadScheduledPushes();
    const now = new Date();
    let changed = false;
    for (const push of pushes) {
        if (!push.sent && isDue(push.time, now)) {
            try {
                await webpush.sendNotification(push.subscription, JSON.stringify({ title: push.title, message: push.message }));
                if (push.repeat) {
                    // Für wiederholende Pushes: sent NICHT setzen
                    console.log('Wiederholender Push gesendet:', push.title, push.time);
                } else {
                    push.sent = true;
                }
                changed = true;
                console.log('Geplanter Push gesendet:', push.title, push.time);
            } catch (err) {
                console.error('Fehler beim Senden des geplanten Push:', err.message);
            }
        }
    }
    if (changed) saveScheduledPushes(pushes);
});

// Hilfsfunktion: prüft, ob Zeit fällig ist (Format: HH:MM, heute)
function isDue(timeStr, now) {
    const [h, m] = timeStr.split(':').map(Number);
    return now.getHours() === h && now.getMinutes() === m;
}

// Endpunkt: VAPID Public Key für Client
app.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
});

module.exports = app;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Push-Server läuft auf Port ${PORT}`);
    });
} 