export interface HealthTip {
  id: string;
  category: 'Hydration' | 'Sleep' | 'Exercise' | 'Nutrition' | 'Mental' | 'Recovery';
  title: string;
  description: string;
  actionable: string;
  evidenceBased: boolean;
}

export const healthTips: HealthTip[] = [
  {
    id: '1',
    category: 'Hydration',
    title: 'Optimale Hydration für Leistung',
    description: 'Bereits 2% Dehydration kann die körperliche und geistige Leistung um bis zu 20% reduzieren.',
    actionable: 'Trinken Sie alle 90 Minuten 250ml Wasser, auch ohne Durstgefühl.',
    evidenceBased: true
  },
  {
    id: '2',
    category: 'Sleep',
    title: 'Der 90-Minuten-Schlafzyklus',
    description: 'Unser Schlaf läuft in 90-Minuten-Zyklen ab. Aufwachen zwischen den Zyklen fühlt sich erfrischender an.',
    actionable: 'Planen Sie 7,5 oder 9 Stunden Schlaf (5-6 komplette Zyklen).',
    evidenceBased: true
  },
  {
    id: '3',
    category: 'Exercise',
    title: 'Kraft vor Ausdauer',
    description: 'Krafttraining vor Cardio maximiert beide Adaptationen und verhindert Interferenz-Effekte.',
    actionable: 'Machen Sie Krafttraining vor Ausdauertraining oder an separaten Tagen.',
    evidenceBased: true
  },
  {
    id: '4',
    category: 'Mental',
    title: 'Ultradian Rhythmen nutzen',
    description: 'Unser Gehirn arbeitet in 90-Minuten-Zyklen mit natürlichen Hoch- und Tiefphasen.',
    actionable: 'Planen Sie intensive geistige Arbeit in 90-Minuten-Blöcken mit 20-Minuten-Pausen.',
    evidenceBased: true
  },
  {
    id: '5',
    category: 'Nutrition',
    title: 'Protein-Timing optimieren',
    description: 'Die Proteinverteilung über den Tag ist wichtiger als die Gesamtmenge für Muskelaufbau.',
    actionable: 'Essen Sie alle 4-6 Stunden 25-40g hochwertiges Protein.',
    evidenceBased: true
  },
  {
    id: '6',
    category: 'Recovery',
    title: 'Kälte für Regeneration',
    description: 'Kältetherapie reduziert Entzündungen und beschleunigt die Muskelregeneration.',
    actionable: 'Nehmen Sie 2-3x pro Woche ein 10-15 minütiges kaltes Bad oder Dusche.',
    evidenceBased: true
  },
  {
    id: '7',
    category: 'Mental',
    title: 'Meditation für Fokus',
    description: 'Bereits 10 Minuten tägliche Meditation verbessert Fokus, Stressresistenz und emotionale Regulation.',
    actionable: 'Meditieren Sie täglich 10 Minuten, am besten zur gleichen Zeit.',
    evidenceBased: true
  },
  {
    id: '8',
    category: 'Hydration',
    title: 'Elektrolyte nicht vergessen',
    description: 'Bei intensivem Training oder Schwitzen braucht der Körper mehr als nur Wasser.',
    actionable: 'Fügen Sie bei Training >1h eine Prise Salz oder Elektrolytgetränk hinzu.',
    evidenceBased: true
  },
  {
    id: '9',
    category: 'Sleep',
    title: 'Licht reguliert den Schlaf',
    description: 'Morgenlicht setzt die Circadianrhythmen zurück und verbessert den Nachtschlaf.',
    actionable: 'Bekommen Sie in den ersten 30 Minuten nach dem Aufwachen helles Licht.',
    evidenceBased: true
  },
  {
    id: '10',
    category: 'Exercise',
    title: 'Bewegung für das Gehirn',
    description: 'Aerobe Bewegung fördert Neurogenese und verbessert Gedächtnis und Lernfähigkeit.',
    actionable: 'Machen Sie 3-4x pro Woche 30 Minuten moderate aerobe Bewegung.',
    evidenceBased: true
  }
]; 