import React, { useState, useEffect } from 'react';

interface DailyStats {
  date: string;
  hydration: number; // glasses of water
  focusSessions: number; // completed 90-min sessions
  supplementsTaken: number; // number of supplements taken
  energy: number; // 1-10 scale
  mood: number; // 1-10 scale
  sleep: number; // hours
  exercise: boolean;
}

interface WeeklyGoals {
  hydrationGoal: number; // glasses per day
  focusGoal: number; // sessions per day
  supplementGoal: number; // supplements per day
  sleepGoal: number; // hours per night
  exerciseGoal: number; // days per week
}

const ProgressScreen: React.FC = () => {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [todayStats, setTodayStats] = useState<DailyStats>({
    date: new Date().toISOString().split('T')[0],
    hydration: 0,
    focusSessions: 0,
    supplementsTaken: 0,
    energy: 5,
    mood: 5,
    sleep: 7,
    exercise: false
  });
  const [goals, setGoals] = useState<WeeklyGoals>({
    hydrationGoal: 8,
    focusGoal: 3,
    supplementGoal: 3,
    sleepGoal: 8,
    exerciseGoal: 4
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    try {
      const savedStats = localStorage.getItem('progressStats');
      const savedGoals = localStorage.getItem('progressGoals');
      const savedToday = localStorage.getItem('todayStats');
      
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // Initialize with sample data for last 7 days
        const sampleData = generateSampleData();
        setStats(sampleData);
        localStorage.setItem('progressStats', JSON.stringify(sampleData));
      }
      
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      
      if (savedToday) {
        const today = JSON.parse(savedToday);
        if (today.date === new Date().toISOString().split('T')[0]) {
          setTodayStats(today);
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Fortschrittsdaten:', error);
    }
  };

  const generateSampleData = (): DailyStats[] => {
    const data: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        hydration: Math.floor(Math.random() * 4) + 6, // 6-9 glasses
        focusSessions: Math.floor(Math.random() * 3) + 1, // 1-3 sessions
        supplementsTaken: Math.floor(Math.random() * 3) + 2, // 2-4 supplements
        energy: Math.floor(Math.random() * 3) + 6, // 6-8 energy
        mood: Math.floor(Math.random() * 3) + 6, // 6-8 mood
        sleep: Math.floor(Math.random() * 2) + 7, // 7-8 hours
        exercise: Math.random() > 0.4 // 60% chance of exercise
      });
    }
    return data;
  };

  const updateTodayStats = (key: keyof DailyStats, value: any) => {
    const updated = { ...todayStats, [key]: value };
    setTodayStats(updated);
    localStorage.setItem('todayStats', JSON.stringify(updated));
    
    // Update stats array
    const updatedStats = stats.filter(s => s.date !== updated.date);
    updatedStats.push(updated);
    setStats(updatedStats);
    localStorage.setItem('progressStats', JSON.stringify(updatedStats));
  };

  const updateGoals = (key: keyof WeeklyGoals, value: number) => {
    const updated = { ...goals, [key]: value };
    setGoals(updated);
    localStorage.setItem('progressGoals', JSON.stringify(updated));
  };

  const getRecentStats = () => {
    const days = selectedPeriod === 'week' ? 7 : 30;
    return stats.slice(-days);
  };

  const calculateAverage = (key: keyof DailyStats) => {
    const recentStats = getRecentStats();
    if (recentStats.length === 0) return 0;
    
    if (key === 'exercise') {
      return recentStats.filter(s => s.exercise).length;
    }
    
    const sum = recentStats.reduce((acc, stat) => acc + (stat[key] as number), 0);
    return Math.round((sum / recentStats.length) * 10) / 10;
  };

  const getGoalProgress = (key: keyof DailyStats) => {
    const average = calculateAverage(key);
    let goal = 0;
    
    switch (key) {
      case 'hydration': goal = goals.hydrationGoal; break;
      case 'focusSessions': goal = goals.focusGoal; break;
      case 'supplementsTaken': goal = goals.supplementGoal; break;
      case 'sleep': goal = goals.sleepGoal; break;
      case 'exercise': goal = goals.exerciseGoal; break;
      default: return 100;
    }
    
    return Math.min(100, Math.round((average / goal) * 100));
  };

  const getStreakDays = (key: keyof DailyStats) => {
    let streak = 0;
    const sortedStats = [...stats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const stat of sortedStats) {
      let goalMet = false;
      
      switch (key) {
        case 'hydration': goalMet = stat.hydration >= goals.hydrationGoal; break;
        case 'focusSessions': goalMet = stat.focusSessions >= goals.focusGoal; break;
        case 'supplementsTaken': goalMet = stat.supplementsTaken >= goals.supplementGoal; break;
        case 'sleep': goalMet = stat.sleep >= goals.sleepGoal; break;
        case 'exercise': goalMet = stat.exercise; break;
      }
      
      if (goalMet) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const renderMiniChart = (key: keyof DailyStats) => {
    const recentStats = getRecentStats();
    const maxValue = Math.max(...recentStats.map(s => key === 'exercise' ? (s.exercise ? 1 : 0) : s[key] as number));
    
    return (
      <div style={{ display: 'flex', alignItems: 'end', gap: '2px', height: '40px' }}>
        {recentStats.map((stat, index) => {
          const value = key === 'exercise' ? (stat.exercise ? 1 : 0) : stat[key] as number;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div
              key={index}
              style={{
                width: '8px',
                height: `${height}%`,
                backgroundColor: '#6366F1',
                borderRadius: '2px',
                opacity: 0.7
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>📊 Fortschrittstracking</h2>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>
          Verfolgen Sie Ihre Gesundheits- und Produktivitätsziele
        </p>
      </div>

      {/* Today's Quick Input */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-calendar-day" style={{ color: '#6366F1', fontSize: '24px' }}></i>
          <h3 className="card-title">Heute ({new Date().toLocaleDateString('de-DE')})</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              💧 Wasser (Gläser)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => updateTodayStats('hydration', Math.max(0, todayStats.hydration - 1))}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              >-</button>
              <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{todayStats.hydration}</span>
              <button 
                onClick={() => updateTodayStats('hydration', todayStats.hydration + 1)}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              >+</button>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              🧠 Fokussitzungen
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => updateTodayStats('focusSessions', Math.max(0, todayStats.focusSessions - 1))}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              >-</button>
              <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{todayStats.focusSessions}</span>
              <button 
                onClick={() => updateTodayStats('focusSessions', todayStats.focusSessions + 1)}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              >+</button>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              💊 Supplements
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => updateTodayStats('supplementsTaken', Math.max(0, todayStats.supplementsTaken - 1))}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              >-</button>
              <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{todayStats.supplementsTaken}</span>
              <button 
                onClick={() => updateTodayStats('supplementsTaken', todayStats.supplementsTaken + 1)}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              >+</button>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              😴 Schlaf (Stunden)
            </label>
            <input 
              type="number" 
              value={todayStats.sleep}
              onChange={(e) => updateTodayStats('sleep', parseFloat(e.target.value) || 0)}
              style={{ width: '100%' }}
              min="0" max="12" step="0.5"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              ⚡ Energie (1-10)
            </label>
            <input 
              type="range" 
              value={todayStats.energy}
              onChange={(e) => updateTodayStats('energy', parseInt(e.target.value))}
              min="1" max="10"
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{todayStats.energy}</div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              😊 Stimmung (1-10)
            </label>
            <input 
              type="range" 
              value={todayStats.mood}
              onChange={(e) => updateTodayStats('mood', parseInt(e.target.value))}
              min="1" max="10"
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{todayStats.mood}</div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              🏋️ Training
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={todayStats.exercise}
                onChange={(e) => updateTodayStats('exercise', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span>{todayStats.exercise ? 'Erledigt ✅' : 'Offen'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Period Selection */}
      <div className="card">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            className={selectedPeriod === 'week' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setSelectedPeriod('week')}
          >
            Diese Woche
          </button>
          <button
            className={selectedPeriod === 'month' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setSelectedPeriod('month')}
          >
            Dieser Monat
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card">
        <h3 className="card-title">Fortschrittsübersicht ({selectedPeriod === 'week' ? 'Woche' : 'Monat'})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { key: 'hydration' as keyof DailyStats, icon: '💧', name: 'Hydration', unit: 'Gläser/Tag' },
            { key: 'focusSessions' as keyof DailyStats, icon: '🧠', name: 'Fokussitzungen', unit: 'Sessions/Tag' },
            { key: 'supplementsTaken' as keyof DailyStats, icon: '💊', name: 'Supplements', unit: 'Stück/Tag' },
            { key: 'sleep' as keyof DailyStats, icon: '😴', name: 'Schlaf', unit: 'Stunden/Nacht' },
            { key: 'exercise' as keyof DailyStats, icon: '🏋️', name: 'Training', unit: 'Tage' }
          ].map(metric => (
            <div key={metric.key} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{metric.icon}</span>
                  <h4 style={{ margin: 0 }}>{metric.name}</h4>
                </div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{metric.unit}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366F1' }}>
                  {calculateAverage(metric.key)}
                </span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  🔥 {getStreakDays(metric.key)} Tage
                </span>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#F3F4F6', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${getGoalProgress(metric.key)}%`, 
                    height: '100%', 
                    backgroundColor: getGoalProgress(metric.key) >= 100 ? '#10B981' : '#6366F1',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  <span>{getGoalProgress(metric.key)}% vom Ziel</span>
                </div>
              </div>
              
              {renderMiniChart(metric.key)}
            </div>
          ))}
        </div>
      </div>

      {/* Goals Settings */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-target" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
          <h3 className="card-title">Ziele anpassen</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              💧 Wasser (Gläser/Tag)
            </label>
            <input 
              type="number" 
              value={goals.hydrationGoal}
              onChange={(e) => updateGoals('hydrationGoal', parseInt(e.target.value) || 0)}
              style={{ width: '100%' }}
              min="1" max="20"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              🧠 Fokussitzungen/Tag
            </label>
            <input 
              type="number" 
              value={goals.focusGoal}
              onChange={(e) => updateGoals('focusGoal', parseInt(e.target.value) || 0)}
              style={{ width: '100%' }}
              min="1" max="8"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              💊 Supplements/Tag
            </label>
            <input 
              type="number" 
              value={goals.supplementGoal}
              onChange={(e) => updateGoals('supplementGoal', parseInt(e.target.value) || 0)}
              style={{ width: '100%' }}
              min="1" max="10"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              😴 Schlaf (Stunden/Nacht)
            </label>
            <input 
              type="number" 
              value={goals.sleepGoal}
              onChange={(e) => updateGoals('sleepGoal', parseInt(e.target.value) || 0)}
              style={{ width: '100%' }}
              min="6" max="12"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              🏋️ Training (Tage/Woche)
            </label>
            <input 
              type="number" 
              value={goals.exerciseGoal}
              onChange={(e) => updateGoals('exerciseGoal', parseInt(e.target.value) || 0)}
              style={{ width: '100%' }}
              min="1" max="7"
            />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-lightbulb" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
          <h3 className="card-title">Insights & Empfehlungen</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {calculateAverage('hydration') < goals.hydrationGoal && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#F59E0B', fontSize: '16px', marginTop: '2px' }}></i>
              <p style={{ margin: 0 }}>
                <strong>Hydration:</strong> Sie trinken im Schnitt nur {calculateAverage('hydration')} Gläser/Tag. 
                Ziel: {goals.hydrationGoal} Gläser. Mehr Wasser verbessert Energie und Konzentration.
              </p>
            </div>
          )}
          
          {calculateAverage('sleep') < goals.sleepGoal && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#EF4444', fontSize: '16px', marginTop: '2px' }}></i>
              <p style={{ margin: 0 }}>
                <strong>Schlaf:</strong> Sie schlafen im Schnitt nur {calculateAverage('sleep')} Stunden. 
                Ziel: {goals.sleepGoal} Stunden. Ausreichend Schlaf ist die Basis für alles andere.
              </p>
            </div>
          )}
          
          {calculateAverage('focusSessions') >= goals.focusGoal && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', backgroundColor: '#D1FAE5', borderRadius: '8px' }}>
              <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: '16px', marginTop: '2px' }}></i>
              <p style={{ margin: 0 }}>
                <strong>Fokus:</strong> Hervorragend! Sie erreichen Ihr Ziel von {goals.focusGoal} Fokussitzungen pro Tag. 
                Das 90-Minuten-System funktioniert für Sie.
              </p>
            </div>
          )}
          
          {getStreakDays('exercise') >= 7 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', backgroundColor: '#D1FAE5', borderRadius: '8px' }}>
              <i className="fas fa-fire" style={{ color: '#EF4444', fontSize: '16px', marginTop: '2px' }}></i>
              <p style={{ margin: 0 }}>
                <strong>Training-Streak:</strong> Fantastisch! {getStreakDays('exercise')} Tage in Folge trainiert. 
                Bleiben Sie dran - Konsistenz ist der Schlüssel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen; 