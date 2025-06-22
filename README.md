# LifeOptima - Gesundheits-Optimierungs App

Eine wissenschaftlich fundierte React Native App für optimale Gesundheit und Produktivität.

## 🎯 Features

### Kern-Funktionen
- **Hydration Tracking**: Intelligente Wassererinnerungen alle 90 Minuten
- **90-Minuten Kreativphasen**: Basierend auf Ultradian Rhythmen
- **Supplement Guide**: 10 wissenschaftlich belegte Supplements mit Evidenz-Level
- **Fortschritts-Tracking**: Detaillierte Charts und Insights
- **Smart Notifications**: Personalisierte Erinnerungen

### Screens
1. **Home**: Dashboard mit Hydration-Tracker, Kreativphasen und Tagestipps
2. **Schedule**: Optimierter Tagesplan mit 90-Minuten-Zyklen
3. **Supplements**: Evidenz-basierte Supplement-Empfehlungen
4. **Progress**: Fortschritts-Charts und persönliche Insights
5. **Profile**: Einstellungen und Personalisierung

## 🏗️ Technologie

### Stack
- React Native 0.73.2
- TypeScript
- React Navigation 6
- AsyncStorage für lokale Daten
- Push Notifications
- Chart-Visualisierungen

### Dependencies
```json
{
  "react": "18.2.0",
  "react-native": "0.73.2",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "react-native-vector-icons": "^10.0.3",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-push-notification": "^8.1.1",
  "react-native-chart-kit": "^6.12.0",
  "react-native-linear-gradient": "^2.8.3"
}
```

## 🚀 Installation

### Voraussetzungen
- Node.js >= 18
- React Native CLI
- Android Studio (für Android)
- Xcode (für iOS)

### Setup
```bash
# Dependencies installieren
npm install

# iOS Dependencies (nur für iOS)
cd ios && pod install && cd ..

# Android Build
npx react-native run-android

# iOS Build
npx react-native run-ios
```

## 📱 Benachrichtigungen

### Typen
- **Hydration**: Alle 90 Minuten
- **Kreativphasen**: 90-Minuten-Timer mit Pausen
- **Supplements**: Individuelle Zeiten
- **Tägliche Motivation**: Morgens um 7:00

### Konfiguration
Alle Benachrichtigungen können im Profil-Screen ein/ausgeschaltet werden.

## 🧬 Wissenschaftliche Basis

### Hydration
- 2% Dehydration = 20% Leistungsabfall
- Optimales Timing: alle 90 Minuten
- Ziel: 8-10 Gläser täglich

### Ultradian Rhythmen
- 90-Minuten-Zyklen für optimale Produktivität
- 20-Minuten-Pausen zwischen Fokusphasen
- Basiert auf neurowissenschaftlichen Erkenntnissen

### Supplements
Alle 10 Supplements sind kategorisiert nach:
- **Evidenz-Level**: Hoch/Mittel/Niedrig
- **Wissenschaftliche Studien**
- **Dosierung & Timing**
- **Nebenwirkungen & Interaktionen**

## 📊 Datenstruktur

### Lokale Speicherung
```typescript
interface DailyData {
  date: string;
  hydrationCount: number;
  creativePhasesCompleted: number;
  supplementsTaken: string[];
}

interface UserPreferences {
  hydrationGoal: number;
  notifications: {
    hydration: boolean;
    creativity: boolean;
    supplements: boolean;
    daily: boolean;
  };
}
```

## 🎨 Design System

### Farben
```typescript
const colors = {
  primary: '#6366F1',     // Indigo
  secondary: '#10B981',   // Emerald
  accent: '#F59E0B',      // Amber
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  // ...
};
```

### Komponenten
- **Cards**: Gerundete Kanten, Schatten
- **Buttons**: Gradient-Hintergründe
- **Charts**: Interaktive Visualisierungen
- **Icons**: Material Design Icons

## 🔔 Push Notifications

### Channels
- `hydration`: Wassererinnerungen
- `creativity`: Kreativphasen
- `supplements`: Supplement-Erinnerungen

### Scheduling
```typescript
NotificationService.scheduleHydrationReminder(90); // 90 Minuten
NotificationService.scheduleCreativityPhase();
NotificationService.scheduleSupplementReminder('Vitamin D3', '08:00');
```

## 📈 Fortschritts-Tracking

### Metriken
- Hydration (Gläser/Tag)
- Kreativphasen (Anzahl/Tag)
- Wochenziele (Completion Rate)
- Habit Streaks

### Insights
- Personalisierte Empfehlungen
- Trend-Analyse
- Optimierungsvorschläge

## 🧪 Wissenschaftliche Quellen

### Hydration
- Armstrong, L.E. et al. (2012). Mild dehydration affects mood in healthy young women.
- Ganio, M.S. et al. (2011). Mild dehydration impairs cognitive performance.

### Ultradian Rhythms
- Lavie, P. (1985). Ultradian rhythms: Gates of sleep and wakefulness.
- Kleitman, N. & Rossi, E. (1953). Cycle variations in cognitive performance.

### Supplements
- Kreider, R.B. et al. (2017). International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation.
- Holick, M.F. (2017). The vitamin D deficiency pandemic.

## 🔧 Entwicklung

### Ordnerstruktur
```
src/
├── components/         # Wiederverwendbare Komponenten
├── screens/           # Hauptscreens
├── services/          # Business Logic
├── data/             # Statische Daten
├── theme/            # Design System
└── types/            # TypeScript Definitionen
```

### Debugging
```bash
# Logs anzeigen
npx react-native log-android
npx react-native log-ios

# Reset Cache
npx react-native start --reset-cache
```

## 🌟 Roadmap

### Version 1.1
- [ ] Datenexport (CSV/JSON)
- [ ] Erweiterte Statistiken
- [ ] Soziale Features
- [ ] Supplement-Scanner

### Version 1.2
- [ ] Wearable Integration
- [ ] ML-basierte Empfehlungen
- [ ] Gesundheitsdaten-Sync
- [ ] Offline-Modus

## 📄 Lizenz

MIT License - Siehe LICENSE Datei

## 🤝 Mitwirken

Contributions sind willkommen! Bitte:
1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Commit deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📞 Kontakt

Für Fragen oder Feedback:
- GitHub Issues
- Email: support@lifeoptima.app

---

**LifeOptima** - Ihr wissenschaftlich fundierter Begleiter für optimale Gesundheit und Produktivität. 🚀 