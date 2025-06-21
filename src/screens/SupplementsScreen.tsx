import React, { useState, useEffect } from 'react';
import { supplements, Supplement } from '../data/supplements';
import { NotificationService } from '../services/NotificationService';

const SupplementsScreen: React.FC = () => {
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Alle');
  const [mySupplements, setMySupplements] = useState<{[key: string]: {time: string, active: boolean}}>({});

  const categories = ['Alle', 'Grundlagen', 'Performance', 'Kognition', 'Regeneration', 'Immunsystem'];

  useEffect(() => {
    loadMySupplements();
  }, []);

  const loadMySupplements = () => {
    try {
      const saved = localStorage.getItem('mySupplements');
      if (saved) {
        setMySupplements(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Supplements:', error);
    }
  };

  const filteredSupplements = filterCategory === 'Alle' 
    ? supplements 
    : supplements.filter(s => s.category === filterCategory);

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'Hoch': return { bg: '#D1FAE5', text: '#065F46' };
      case 'Mittel': return { bg: '#FEF3C7', text: '#92400E' };
      case 'Niedrig': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const addToMySupplements = (supplement: Supplement, time: string) => {
    const updated = {
      ...mySupplements,
      [supplement.id]: { time, active: true }
    };
    setMySupplements(updated);
    localStorage.setItem('mySupplements', JSON.stringify(updated));
    
    // Schedule notification
    NotificationService.scheduleSupplementReminder(supplement.name, time);
    
    alert(`✅ ${supplement.name} wurde zu Ihren Supplements hinzugefügt!\n\nErinnerung um ${time} aktiviert.`);
    setSelectedSupplement(null);
  };

  const removeFromMySupplements = (supplementId: string) => {
    const updated = { ...mySupplements };
    delete updated[supplementId];
    setMySupplements(updated);
    localStorage.setItem('mySupplements', JSON.stringify(updated));
  };

  const toggleSupplementActive = (supplementId: string) => {
    const updated = {
      ...mySupplements,
      [supplementId]: {
        ...mySupplements[supplementId],
        active: !mySupplements[supplementId].active
      }
    };
    setMySupplements(updated);
    localStorage.setItem('mySupplements', JSON.stringify(updated));
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>💊 Supplement Guide</h2>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>
          Evidenzbasierte Empfehlungen für optimale Gesundheit
        </p>
      </div>

      {/* My Supplements */}
      {Object.keys(mySupplements).length > 0 && (
        <div className="card">
          <div className="card-header">
            <i className="fas fa-star" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
            <h3 className="card-title">Meine Supplements</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(mySupplements).map(([id, settings]) => {
              const supplement = supplements.find(s => s.id === id);
              if (!supplement) return null;
              
              return (
                <div key={id} className="card" style={{ 
                  marginBottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: settings.active ? 1 : 0.6
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: '4px' }}>{supplement.name}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
                      Erinnerung um {settings.time} | {supplement.dosage}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={settings.active ? 'btn-secondary' : 'btn-primary'}
                      onClick={() => toggleSupplementActive(id)}
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      {settings.active ? 'Aktiv' : 'Inaktiv'}
                    </button>
                    <button 
                      className="btn-accent"
                      onClick={() => removeFromMySupplements(id)}
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="card">
        <h3 className="card-title">Kategorien</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map(category => (
            <button
              key={category}
              className={filterCategory === category ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setFilterCategory(category)}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Supplements List */}
      <div className="card">
        <h3 className="card-title">Verfügbare Supplements ({filteredSupplements.length})</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredSupplements.map((supplement) => {
            const evidenceColors = getEvidenceColor(supplement.evidenceLevel);
            const isInMyList = mySupplements[supplement.id];
            
            return (
              <div key={supplement.id} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: '4px', color: '#111827' }}>{supplement.name}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{supplement.category}</p>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    backgroundColor: evidenceColors.bg,
                    color: evidenceColors.text,
                    whiteSpace: 'nowrap'
                  }}>
                    {supplement.evidenceLevel} Evidenz
                  </span>
                </div>
                
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.5, marginBottom: '12px' }}>
                  {supplement.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fas fa-pills" style={{ color: '#6366F1' }}></i>
                    <span>{supplement.dosage}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fas fa-clock" style={{ color: '#F59E0B' }}></i>
                    <span>{supplement.timing}</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>Hauptvorteile:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {supplement.benefits.slice(0, 3).map((benefit, index) => (
                      <span key={index} style={{ 
                        fontSize: '12px', 
                        backgroundColor: '#F3F4F6', 
                        color: '#374151',
                        padding: '2px 8px', 
                        borderRadius: '12px' 
                      }}>
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedSupplement(supplement)}
                    style={{ flex: 1, fontSize: '14px' }}
                  >
                    <i className="fas fa-info-circle"></i>
                    Details
                  </button>
                  {!isInMyList ? (
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        const time = prompt('Erinnerungszeit (HH:MM):', '08:00');
                        if (time) addToMySupplements(supplement, time);
                      }}
                      style={{ fontSize: '14px' }}
                    >
                      <i className="fas fa-plus"></i>
                      Hinzufügen
                    </button>
                  ) : (
                    <span style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#D1FAE5', 
                      color: '#065F46', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ✓ Hinzugefügt
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplement Detail Modal */}
      {selectedSupplement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>{selectedSupplement.name}</h2>
              <button 
                onClick={() => setSelectedSupplement(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Beschreibung</h4>
              <p>{selectedSupplement.description}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <h4>Dosierung</h4>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-pills" style={{ color: '#6366F1' }}></i>
                  {selectedSupplement.dosage}
                </p>
              </div>
              <div>
                <h4>Timing</h4>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-clock" style={{ color: '#F59E0B' }}></i>
                  {selectedSupplement.timing}
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Alle Vorteile</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {selectedSupplement.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            {selectedSupplement.sideEffects && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#EF4444' }}>Mögliche Nebenwirkungen</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {selectedSupplement.sideEffects.map((effect, index) => (
                    <li key={index} style={{ color: '#6B7280' }}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedSupplement.interactions && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#F59E0B' }}>Wechselwirkungen</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {selectedSupplement.interactions.map((interaction, index) => (
                    <li key={index} style={{ color: '#6B7280' }}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                className="btn-primary"
                onClick={() => {
                  const time = prompt('Erinnerungszeit (HH:MM):', '08:00');
                  if (time) addToMySupplements(selectedSupplement, time);
                }}
                style={{ flex: 1 }}
              >
                <i className="fas fa-plus"></i>
                Zu meinen Supplements hinzufügen
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedSupplement(null)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-info-circle" style={{ color: '#6366F1', fontSize: '24px' }}></i>
          <h3 className="card-title">Wichtige Hinweise</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          <p>⚠️ Konsultieren Sie vor der Einnahme einen Arzt oder Apotheker</p>
          <p>🔬 Evidenzlevel basieren auf aktueller wissenschaftlicher Literatur</p>
          <p>⏰ Timing-Empfehlungen optimieren Absorption und Wirkung</p>
          <p>💊 Qualität der Supplements ist entscheidend - achten Sie auf Drittanbieter-Tests</p>
        </div>
      </div>
    </div>
  );
};

export default SupplementsScreen; 