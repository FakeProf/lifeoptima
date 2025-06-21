import React, { useState, useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';
import { healthTips } from '../data/healthTips';

const HomeScreen: React.FC = () => {
  const [hydrationGoal, setHydrationGoal] = useState(8);
  const [hydrationCount, setHydrationCount] = useState(0);
  const [creativePhasesCompleted, setCreativePhasesCompleted] = useState(0);
  const [todaysTip, setTodaysTip] = useState(healthTips[0]);
  const [isCreativePhaseActive, setIsCreativePhaseActive] = useState(false);

  useEffect(() => {
    loadDailyData();
    setRandomTip();
  }, []);

  const loadDailyData = () => {
    try {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem('lastUpdateDate');
      
      if (savedDate !== today) {
        // Neuer Tag, reset counters
        setHydrationCount(0);
        setCreativePhasesCompleted(0);
        localStorage.setItem('lastUpdateDate', today);
        localStorage.setItem('hydrationCount', '0');
        localStorage.setItem('creativePhasesCompleted', '0');
      } else {
        // Lade gespeicherte Werte
        const savedHydration = localStorage.getItem('hydrationCount');
        const savedCreativePhases = localStorage.getItem('creativePhasesCompleted');
        
        if (savedHydration) setHydrationCount(parseInt(savedHydration));
        if (savedCreativePhases) setCreativePhasesCompleted(parseInt(savedCreativePhases));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  };

  const setRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * healthTips.length);
    setTodaysTip(healthTips[randomIndex]);
  };

  const addWater = () => {
    const newCount = hydrationCount + 1;
    setHydrationCount(newCount);
    localStorage.setItem('hydrationCount', newCount.toString());
    
    if (newCount === 1) {
      NotificationService.scheduleHydrationReminder(90);
    }
  };

  const startCreativePhase = () => {
    setIsCreativePhaseActive(true);
    
    if (confirm('🧠 90-Minuten Kreativphase starten?\n\nSchalten Sie alle Ablenkungen aus und fokussieren Sie sich auf eine wichtige Aufgabe. Sie erhalten in 90 Minuten eine Erinnerung für eine Pause.')) {
      NotificationService.scheduleCreativityPhase();
      
      // Simuliere Ende der Kreativphase
      setTimeout(() => {
        setIsCreativePhaseActive(false);
        const newCount = creativePhasesCompleted + 1;
        setCreativePhasesCompleted(newCount);
        localStorage.setItem('creativePhasesCompleted', newCount.toString());
      }, 90 * 60 * 1000); // 90 Minuten
    } else {
      setIsCreativePhaseActive(false);
    }
  };

  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Guten Morgen! Bereit für einen optimierten Tag?';
    if (hour < 18) return '☀️ Bleiben Sie fokussiert und hydratisiert!';
    return '🌙 Zeit zur Regeneration und Vorbereitung auf morgen!';
  };

  const getHydrationProgress = () => {
    return Math.min((hydrationCount / hydrationGoal) * 100, 100);
  };

  return (
    <div className="content-container fade-in">
      {/* Header mit Motivationsnachricht */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>{getMotivationalMessage()}</h2>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Hydration Tracker */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-tint" style={{ color: '#6366F1', fontSize: '24px' }}></i>
          <h3 className="card-title">Hydration Tracker</h3>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getHydrationProgress()}%` }}
          ></div>
        </div>
        <p className="text-center text-secondary">
          {hydrationCount} / {hydrationGoal} Gläser
        </p>
        <button className="btn-primary" onClick={addWater} style={{ width: '100%', marginTop: '16px' }}>
          <i className="fas fa-plus"></i>
          Wasser getrunken
        </button>
      </div>

      {/* Creative Phase Tracker */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-brain" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
          <h3 className="card-title">90-Min Kreativphasen</h3>
        </div>
        <p className="text-center" style={{ fontSize: '18px', margin: '16px 0' }}>
          Heute abgeschlossen: <strong>{creativePhasesCompleted}</strong>
        </p>
        <button 
          className="btn-accent" 
          onClick={startCreativePhase}
          disabled={isCreativePhaseActive}
          style={{ width: '100%' }}
        >
          <i className="fas fa-clock"></i>
          {isCreativePhaseActive ? 'Phase läuft...' : 'Phase starten'}
        </button>
      </div>

      {/* Daily Tip */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-lightbulb" style={{ color: '#10B981', fontSize: '24px' }}></i>
          <h3 className="card-title">Tipp des Tages</h3>
        </div>
        <h4 style={{ color: '#111827', marginBottom: '8px' }}>{todaysTip.title}</h4>
        <p style={{ color: '#6B7280', lineHeight: 1.6, marginBottom: '12px' }}>
          {todaysTip.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
          <i className="fas fa-arrow-up" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
          <p style={{ margin: 0, fontWeight: '500' }}>
            {todaysTip.actionable}
          </p>
        </div>
        {todaysTip.evidenceBased && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '12px', borderTop: '1px solid #E5E7EB' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '14px' }}></i>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
              Wissenschaftlich belegt
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="card-title">Schnellaktionen</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <button 
            className="btn-primary"
            onClick={() => NotificationService.scheduleDailyMotivation()}
            style={{ padding: '16px 12px', flexDirection: 'column', height: 'auto' }}
          >
            <i className="fas fa-bell" style={{ fontSize: '20px', marginBottom: '8px' }}></i>
            <span style={{ fontSize: '12px' }}>Morgen-Erinnerung</span>
          </button>
          
          <button 
            className="btn-accent"
            onClick={setRandomTip}
            style={{ padding: '16px 12px', flexDirection: 'column', height: 'auto' }}
          >
            <i className="fas fa-sync" style={{ fontSize: '20px', marginBottom: '8px' }}></i>
            <span style={{ fontSize: '12px' }}>Neuer Tipp</span>
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => alert('Einstellungen sind im Profil-Tab verfügbar!')}
            style={{ padding: '16px 12px', flexDirection: 'column', height: 'auto' }}
          >
            <i className="fas fa-cog" style={{ fontSize: '20px', marginBottom: '8px' }}></i>
            <span style={{ fontSize: '12px' }}>Einstellungen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 