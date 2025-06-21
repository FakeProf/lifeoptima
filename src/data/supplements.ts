export interface Supplement {
  id: string;
  name: string;
  category: string;
  dosage: string;
  timing: string;
  benefits: string[];
  evidenceLevel: 'Hoch' | 'Mittel' | 'Niedrig';
  description: string;
  sideEffects?: string[];
  interactions?: string[];
}

export const supplements: Supplement[] = [
  {
    id: '1',
    name: 'Creatin Monohydrat',
    category: 'Performance',
    dosage: '3-5g täglich',
    timing: 'Nach dem Training',
    benefits: [
      'Erhöht Muskelkraft und -leistung',
      'Verbessert Regeneration',
      'Unterstützt Muskelaufbau',
      'Kann kognitive Funktion verbessern'
    ],
    evidenceLevel: 'Hoch',
    description: 'Das am besten erforschte Supplement für Kraft- und Ausdauersport. Creatin erhöht die Phosphocreatinspeicher in den Muskeln.',
    sideEffects: ['Wassereinlagerungen', 'Mögliche Gewichtszunahme'],
    interactions: ['Keine bekannten schwerwiegenden Interaktionen']
  },
  {
    id: '2',
    name: 'Vitamin D3',
    category: 'Vitamine',
    dosage: '1000-4000 IU täglich',
    timing: 'Mit Fett',
    benefits: [
      'Stärkt das Immunsystem',
      'Verbessert Knochengesundheit',
      'Reguliert Stimmung',
      'Unterstützt Muskelfunktion'
    ],
    evidenceLevel: 'Hoch',
    description: 'Essentiell für Knochengesundheit und Immunfunktion. Mangel ist weit verbreitet, besonders in nördlichen Breitengraden.',
    sideEffects: ['Bei Überdosierung: Hyperkalzämie'],
    interactions: ['Verstärkt Kalziumaufnahme']
  },
  {
    id: '3',
    name: 'Magnesium',
    category: 'Mineralien',
    dosage: '200-400mg täglich',
    timing: 'Abends',
    benefits: [
      'Verbessert Schlafqualität',
      'Reduziert Muskelkrämpfe',
      'Unterstützt Herzgesundheit',
      'Reguliert Blutzucker'
    ],
    evidenceLevel: 'Hoch',
    description: 'Wichtiger Cofaktor für über 300 enzymatische Reaktionen. Magnesium ist entscheidend für Muskel- und Nervenfunktion.',
    sideEffects: ['Durchfall bei hohen Dosen'],
    interactions: ['Kann Antibiotika-Absorption beeinträchtigen']
  },
  {
    id: '4',
    name: 'Omega-3 (EPA/DHA)',
    category: 'Fettsäuren',
    dosage: '1-3g täglich',
    timing: 'Zu den Mahlzeiten',
    benefits: [
      'Reduziert Entzündungen',
      'Verbessert Herzgesundheit',
      'Unterstützt Gehirnfunktion',
      'Kann Depression lindern'
    ],
    evidenceLevel: 'Hoch',
    description: 'Essentielle Fettsäuren mit starken entzündungshemmenden Eigenschaften. Besonders wichtig für Herz und Gehirn.',
    sideEffects: ['Fischiger Nachgeschmack', 'Magen-Darm-Beschwerden'],
    interactions: ['Kann Blutgerinnung beeinflussen']
  },
  {
    id: '5',
    name: 'Whey Protein',
    category: 'Protein',
    dosage: '25-50g nach Training',
    timing: 'Post-Workout',
    benefits: [
      'Fördert Muskelaufbau',
      'Verbessert Regeneration',
      'Hohe biologische Wertigkeit',
      'Sättigt gut'
    ],
    evidenceLevel: 'Hoch',
    description: 'Schnell absorbiertes Protein mit vollständigem Aminosäureprofil. Ideal für Post-Workout-Nutrition.',
    sideEffects: ['Blähungen bei Laktoseintoleranz'],
    interactions: ['Keine bekannten Interaktionen']
  },
  {
    id: '6',
    name: 'Ashwagandha',
    category: 'Adaptogene',
    dosage: '300-600mg täglich',
    timing: 'Abends',
    benefits: [
      'Reduziert Stress und Cortisol',
      'Verbessert Schlafqualität',
      'Kann Testosteron erhöhen',
      'Unterstützt Muskelkraft'
    ],
    evidenceLevel: 'Mittel',
    description: 'Adaptogenes Kraut aus der ayurvedischen Medizin. Hilft dem Körper bei der Stressanpassung.',
    sideEffects: ['Müdigkeit', 'Magen-Darm-Beschwerden'],
    interactions: ['Kann Schilddrüsenmedikamente verstärken']
  },
  {
    id: '7',
    name: 'Koffein',
    category: 'Stimulanzien',
    dosage: '100-400mg täglich',
    timing: 'Morgens/Pre-Workout',
    benefits: [
      'Erhöht Wachheit und Fokus',
      'Verbessert sportliche Leistung',
      'Kann Fettverbrennung fördern',
      'Antioxidative Eigenschaften'
    ],
    evidenceLevel: 'Hoch',
    description: 'Das am weitesten verbreitete Stimulans. Blockiert Adenosin-Rezeptoren und erhöht Dopamin.',
    sideEffects: ['Schlaflosigkeit', 'Nervosität', 'Abhängigkeit'],
    interactions: ['Verstärkt andere Stimulanzien']
  },
  {
    id: '8',
    name: 'Zink',
    category: 'Mineralien',
    dosage: '15-30mg täglich',
    timing: 'Auf nüchternen Magen',
    benefits: [
      'Stärkt Immunsystem',
      'Unterstützt Testosteronproduktion',
      'Wichtig für Wundheilung',
      'Reguliert Blutzucker'
    ],
    evidenceLevel: 'Hoch',
    description: 'Essentielles Spurenelement für Immunfunktion und Hormonproduktion. Besonders wichtig für Männer.',
    sideEffects: ['Übelkeit auf nüchternen Magen'],
    interactions: ['Hemmt Kupferaufnahme bei hohen Dosen']
  },
  {
    id: '9',
    name: 'Multivitamin',
    category: 'Vitamine',
    dosage: '1 Tablette täglich',
    timing: 'Zu einer Mahlzeit',
    benefits: [
      'Deckt Grundbedarf ab',
      'Praktisch und einfach',
      'Unterstützt allgemeine Gesundheit',
      'Günstige Basisversorgung'
    ],
    evidenceLevel: 'Mittel',
    description: 'Kombinationspräparat verschiedener Vitamine und Mineralien. Sinnvoll als Basisversorgung.',
    sideEffects: ['Selten Magen-Darm-Beschwerden'],
    interactions: ['Verschiedene je nach Inhaltsstoffen']
  },
  {
    id: '10',
    name: 'Melatonin',
    category: 'Schlaf',
    dosage: '0.5-3mg vor dem Schlaf',
    timing: '30-60 Min vor Bett',
    benefits: [
      'Verbessert Einschlafzeit',
      'Reguliert Schlaf-Wach-Rhythmus',
      'Antioxidative Eigenschaften',
      'Hilft bei Jetlag'
    ],
    evidenceLevel: 'Hoch',
    description: 'Natürliches Schlafhormon. Besonders effektiv bei Schlafrhythmusstörungen und Jetlag.',
    sideEffects: ['Tagesmüdigkeit', 'Lebhafte Träume'],
    interactions: ['Kann andere sedative Medikamente verstärken']
  }
]; 