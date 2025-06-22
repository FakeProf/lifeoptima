# 🚀 LifeOptima - Wissenschaftlich Fundierte Gesundheitsoptimierung

Eine vollständige Progressive Web App (PWA) für evidenzbasierte Gesundheitsoptimierung mit 5 integrierten Modulen.

![LifeOptima Screenshot](https://img.shields.io/badge/PWA-Ready-brightgreen) ![Responsive](https://img.shields.io/badge/Design-Responsive-blue) ![Offline](https://img.shields.io/badge/Offline-Support-orange)

## 🎯 Features

### 🏠 **Home Screen**
- **💧 Wasser-Tracking** mit visueller Progress Bar
- **⏱️ 90-Minuten Focus Timer** für optimale Produktivität
- **🔥 Streak-Counter** für tägliche Motivation
- **💡 48 Gesundheitstipps** mit täglicher Rotation und Navigation

### 🕒 **Schedule Screen**
- **📅 Vollständig editierbarer Tagesplan** mit 16-Stunden-Optimierung
- **🎯 3 wissenschaftlich optimierte Fokusphasen**
- **🔔 Individuelle Benachrichtigungen** für jede Aktivität
- **✏️ Drag & Drop Interface** für einfache Anpassungen

### 💊 **Supplements Screen**
- **19 evidenzbasierte Supplements** mit wissenschaftlicher Bewertung
- **🔴🟠🟡🟢 Prioritätssystem** (Kritisch bis Optional)
- **🏷️ Kategorie-Filter** (Kognition, Performance, Recovery)
- **📋 Persönliche Supplement-Liste** zum Verwalten

### 📊 **Progress Screen**
- **📈 Tägliche Eingaben** für Energie, Schlaf und Stimmung
- **📊 Wochenstatistiken** mit Durchschnittswerten
- **🧠 KI-basierte Insights** und Trend-Analyse
- **📅 Verlaufsverfolgung** mit lokalem Speicher

### 👤 **Profile Screen**
- **📝 Persönliche Daten** mit automatischer BMI-Berechnung
- **🎯 8 Gesundheitsziele** zum Auswählen und Verfolgen
- **🔔 Benachrichtigungseinstellungen**
- **💾 Datenexport** für Backup und Analyse

## 🛠️ Technische Details

### **Tech Stack**
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Design:** Responsive CSS Grid & Flexbox
- **Storage:** Browser localStorage für Offline-Funktionalität
- **PWA:** Service Worker, Web App Manifest
- **Icons:** Emoji-basiert für universelle Kompatibilität

### **PWA Features**
- ✅ **Installierbar** auf Desktop und Mobile
- ✅ **Offline-fähig** mit Service Worker
- ✅ **Responsive Design** für alle Bildschirmgrößen
- ✅ **Push-Benachrichtigungen** für Termine und Erinnerungen
- ✅ **App-Shortcuts** für schnellen Zugriff
- ✅ **Splash Screen** mit Loading-Animation

### **Wissenschaftliche Fundierung**
- **Supplements:** Basierend auf aktueller Forschung und Meta-Analysen
- **Schedule:** Optimiert nach circadianen Rhythmen und Ultradian-Zyklen
- **Hydration:** Berücksichtigt Stoffwechsel und Körpergewicht
- **Tips:** Evidenzbasierte Biohacking-Strategien

## 🚀 Installation & Verwendung

### **Lokale Entwicklung**
```bash
# Repository klonen
git clone https://github.com/[username]/lifeoptima.git
cd lifeoptima

# Lokalen Server starten
python -m http.server 8000
# oder
npx serve .

# Browser öffnen
open http://localhost:8000
```

### **Als PWA installieren**
1. Öffne die App im Browser
2. Klicke auf "App installieren" im Profile-Bereich
3. Bestätige die Installation
4. App erscheint im Startmenü/Homescreen

### **Deployment**
- **GitHub Pages:** Automatisches Deployment via GitHub Actions
- **Netlify:** Drag & Drop der Dateien
- **Vercel:** Git-basiertes Deployment
- **Firebase Hosting:** Für erweiterte Features

## 📱 Browser-Kompatibilität

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PWA Installation | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |

## 🎨 Design Prinzipien

- **Minimalistic:** Fokus auf Funktionalität ohne Ablenkung
- **Accessibility:** Hoher Kontrast und Touch-friendly Buttons
- **Performance:** Optimiert für schnelle Ladezeiten
- **Responsive:** Mobile-first Design mit Desktop-Optimierung

## 📊 Datenmanagement

### **Lokale Speicherung**
- Alle Daten werden in `localStorage` gespeichert
- Keine Server-Abhängigkeit
- Vollständige Offline-Funktionalität
- Automatisches Backup via Export-Funktion

### **Datenstruktur**
```javascript
{
  waterIntake: Number,
  currentStreak: Number,
  customSchedule: Array,
  mySupplements: Array,
  dailyData: Object,
  userData: Object,
  scheduleNotifications: Object
}
```

## 🔬 Wissenschaftliche Quellen

Die App basiert auf aktueller Forschung aus:
- **Chronobiologie:** Circadiane Rhythmus-Optimierung
- **Sportwissenschaft:** Performance und Recovery
- **Neurowissenschaft:** Kognitive Leistungssteigerung
- **Ernährungsmedizin:** Mikronährstoff-Optimierung

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz - siehe [LICENSE](LICENSE) Datei für Details.

## 🌟 Roadmap

- [ ] **Apple Health Integration** für automatisches Daten-Sync
- [ ] **Google Fit API** für Activity-Tracking
- [ ] **AI-powered Recommendations** basierend auf Verlaufsdaten
- [ ] **Social Features** für Community-basierte Motivation
- [ ] **Dark Mode** für bessere Augenfreundlichkeit
- [ ] **Multi-Language Support** (EN, DE, FR, ES)

## 🚀 Deployment Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://lifeoptima.netlify.app)

---

**Made with ❤️ for optimal health and performance**

*Hinweis: Diese App ersetzt keine medizinische Beratung. Konsultiere immer einen Arzt bei gesundheitlichen Fragen.* 