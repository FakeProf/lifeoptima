import React, { useState, useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  type: 'focus' | 'break' | 'meal' | 'exercise' | 'rest' | 'hydration';
  title: string;
  description: string;
  isActive: boolean;
  color: string;
}

const ScheduleScreen: React.FC = () => {
  const [schedule, setSchedule] = useState<TimeBlock[]>([
    {
      id: '1',
      startTime: '06:00',
      endTime: '06:30',
      type: 'exercise',
      title: 'Morgendliches Training',
      description: 'Krafttraining oder 20 Min Cardio für optimalen Start',
      isActive: true,
      color: '#EF4444'
    },
    {
      id: '2',
      startTime: '06:30',
      endTime: '07:00',
      type: 'meal',
      title: 'Protein-reiches Frühstück',
      description: 'Eier, Haferflocken oder Protein-Shake + Vitamine',
      isActive: true,
      color: '#F59E0B'
    },
    {
      id: '3',
      startTime: '07:00',
      endTime: '08:30',
      type: 'focus',
      title: '90-Min Fokusphase 1 (Peak)',
      description: 'Wichtigste Aufgabe des Tages - höchste Konzentration',
      isActive: true,
      color: '#6366F1'
    },
    {
      id: '4',
      startTime: '08:30',
      endTime: '08:50',
      type: 'break',
      title: 'Aktive Pause + Hydration',
      description: 'Spaziergang, Dehnung, 1-2 Gläser Wasser',
      isActive: true,
      color: '#10B981'
    },
    {
      id: '5',
      startTime: '08:50',
      endTime: '10:20',
      type: 'focus',
      title: '90-Min Fokusphase 2',
      description: 'Kreative oder analytische Arbeit',
      isActive: true,
      color: '#6366F1'
    },
    {
      id: '6',
      startTime: '10:20',
      endTime: '10:40',
      type: 'break',
      title: 'Erholungspause',
      description: 'Kurzer Spaziergang, Atemübungen, Wasser trinken',
      isActive: true,
      color: '#10B981'
    },
    {
      id: '7',
      startTime: '12:00',
      endTime: '13:00',
      type: 'meal',
      title: 'Ausgewogenes Mittagessen',
      description: 'Protein + Gemüse + komplexe Kohlenhydrate',
      isActive: true,
      color: '#F59E0B'
    },
    {
      id: '8',
      startTime: '14:00',
      endTime: '15:30',
      type: 'focus',
      title: '90-Min Fokusphase 3',
      description: 'Meetings, Kollaboration oder weniger intensive Tasks',
      isActive: true,
      color: '#6366F1'
    },
    {
      id: '9',
      startTime: '15:30',
      endTime: '15:50',
      type: 'break',
      title: 'Nachmittagspause',
      description: 'Kurzer Spaziergang oder Powernap (max 20 Min)',
      isActive: true,
      color: '#10B981'
    },
    {
      id: '10',
      startTime: '17:00',
      endTime: '18:00',
      type: 'exercise',
      title: 'Abendtraining (optional)',
      description: 'Krafttraining oder entspanntes Cardio',
      isActive: false,
      color: '#EF4444'
    },
    {
      id: '11',
      startTime: '18:00',
      endTime: '19:00',
      type: 'meal',
      title: 'Frühes Abendessen',
      description: 'Leichte, proteinreiche Mahlzeit - 3h vor Schlaf',
      isActive: true,
      color: '#F59E0B'
    },
    {
      id: '12',
      startTime: '21:00',
      endTime: '22:00',
      type: 'rest',
      title: 'Wind-Down Routine',
      description: 'Lesen, Meditation, Schlafvorbereitung - kein Bildschirm',
      isActive: true,
      color: '#6B7280'
    }
  ]);

  const [hydrationSettings, setHydrationSettings] = useState({
    interval: 90, // Minuten
    dailyGoal: 8, // Gläser
    startTime: '07:00',
    endTime: '21:00'
  });

  useEffect(() => {
    loadScheduleSettings();
  }, []);

  const loadScheduleSettings = () => {
    try {
      const savedSchedule = localStorage.getItem('userSchedule');
      const savedHydration = localStorage.getItem('hydrationSettings');
      
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      }
      if (savedHydration) {
        setHydrationSettings(JSON.parse(savedHydration));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
    }
  };

  const toggleTimeBlock = (id: string) => {
    const updatedSchedule = schedule.map(block =>
      block.id === id ? { ...block, isActive: !block.isActive } : block
    );
    setSchedule(updatedSchedule);
    localStorage.setItem('userSchedule', JSON.stringify(updatedSchedule));
  };

  const updateHydrationSettings = (key: string, value: any) => {
    const updated = { ...hydrationSettings, [key]: value };
    setHydrationSettings(updated);
    localStorage.setItem('hydrationSettings', JSON.stringify(updated));
  };

  const activateAllNotifications = () => {
    // Hydration reminders
    NotificationService.scheduleHydrationReminder(hydrationSettings.interval);
    
    // Focus phase reminders
    schedule.filter(block => block.type === 'focus' && block.isActive).forEach(block => {
      const [hours, minutes] = block.startTime.split(':').map(Number);
      const now = new Date();
      const scheduleTime = new Date();
      scheduleTime.setHours(hours, minutes, 0, 0);
      
      if (scheduleTime <= now) {
        scheduleTime.setDate(scheduleTime.getDate() + 1);
      }
      
      setTimeout(() => {
        NotificationService.scheduleCreativityPhase();
      }, scheduleTime.getTime() - now.getTime());
    });

    alert('🔔 Alle Benachrichtigungen wurden aktiviert!\n\nSie erhalten jetzt:\n• Hydration-Erinnerungen alle ' + hydrationSettings.interval + ' Min\n• Fokusphase-Starts\n• Pause-Erinnerungen');
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'focus': return 'fas fa-brain';
      case 'break': return 'fas fa-coffee';
      case 'meal': return 'fas fa-utensils';
      case 'exercise': return 'fas fa-dumbbell';
      case 'rest': return 'fas fa-bed';
      case 'hydration': return 'fas fa-tint';
      default: return 'fas fa-clock';
    }
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>🕒 Optimierter Tagesplan</h2>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>
          Basierend auf 90-Minuten Ultradian Rhythmen und Chronobiologie
        </p>
      </div>

      {/* Hydration Settings */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-tint" style={{ color: '#6366F1', fontSize: '24px' }}></i>
          <h3 className="card-title">Hydration-Einstellungen</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Erinnerungsintervall (Minuten)
            </label>
            <input 
              type="number" 
              value={hydrationSettings.interval}
              onChange={(e) => updateHydrationSettings('interval', parseInt(e.target.value))}
              style={{ width: '100%' }}
              min="30" max="180"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Tägliches Ziel (Gläser)
            </label>
            <input 
              type="number" 
              value={hydrationSettings.dailyGoal}
              onChange={(e) => updateHydrationSettings('dailyGoal', parseInt(e.target.value))}
              style={{ width: '100%' }}
              min="6" max="15"
            />
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={activateAllNotifications}
          style={{ width: '100%', marginTop: '16px' }}
        >
          <i className="fas fa-bell"></i>
          Alle Benachrichtigungen aktivieren
        </button>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="card-title">Legende</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6366F1' }}></div>
            <span style={{ fontSize: '14px' }}>Fokusphasen (90 Min)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
            <span style={{ fontSize: '14px' }}>Aktive Pausen (20 Min)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
            <span style={{ fontSize: '14px' }}>Mahlzeiten</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
            <span style={{ fontSize: '14px' }}>Training</span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="card">
        <h3 className="card-title">Tagesablauf</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedule.map(block => (
            <div 
              key={block.id} 
              className="card" 
              style={{ 
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                opacity: block.isActive ? 1 : 0.6,
                borderLeft: `4px solid ${block.color}`
              }}
            >
              <div style={{ minWidth: '80px', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{block.startTime}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{block.endTime}</div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <i className={getBlockIcon(block.type)} style={{ color: block.color, fontSize: '18px' }}></i>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{block.title}</h4>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>{block.description}</p>
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={block.isActive}
                  onChange={() => toggleTimeBlock(block.id)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Aktiv</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-lightbulb" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
          <h3 className="card-title">Optimierungs-Tipps</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
            <p style={{ margin: 0 }}><strong>Fokusphasen:</strong> Handy stumm, E-Mails geschlossen, eine wichtige Aufgabe</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
            <p style={{ margin: 0 }}><strong>Pausen:</strong> Bewegung ist wichtiger als passive Entspannung</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
            <p style={{ margin: 0 }}><strong>Hydration:</strong> Alle 90 Minuten ein Glas Wasser (außer 2h vor Schlaf)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
            <p style={{ margin: 0 }}><strong>Timing:</strong> Finden Sie Ihren persönlichen Chronotyp (Lerche/Eule)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
            <p style={{ margin: 0 }}><strong>Schlaf:</strong> 7-9 Stunden, feste Zeiten, kein Bildschirm 1h vor Bett</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleScreen; 