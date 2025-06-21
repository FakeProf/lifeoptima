import React, { useState, useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';

interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: 'low' | 'moderate' | 'high';
  chronotype: 'morning' | 'evening' | 'neutral';
  goals: string[];
  notifications: {
    hydration: boolean;
    supplements: boolean;
    focus: boolean;
    breaks: boolean;
    sleep: boolean;
  };
  preferences: {
    darkMode: boolean;
    language: 'de' | 'en';
    units: 'metric' | 'imperial';
  };
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 30,
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    chronotype: 'neutral',
    goals: [],
    notifications: {
      hydration: true,
      supplements: true,
      focus: true,
      breaks: true,
      sleep: true
    },
    preferences: {
      darkMode: false,
      language: 'de',
      units: 'metric'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences'>('profile');

  const availableGoals = [
    'Gewicht verlieren',
    'Muskeln aufbauen',
    'Energie steigern',
    'Besser schlafen',
    'Stress reduzieren',
    'Konzentration verbessern',
    'Immunsystem stärken',
    'Gesünder essen'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error);
    }
  };

  const saveProfile = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setIsEditing(false);
      alert('✅ Profil gespeichert! Ihre Einstellungen wurden übernommen.');
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      alert('❌ Fehler beim Speichern des Profils.');
    }
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const updateNotifications = (key: keyof UserProfile['notifications'], value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updatePreferences = (key: keyof UserProfile['preferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const toggleGoal = (goal: string) => {
    const newGoals = profile.goals.includes(goal)
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal];
    updateProfile('goals', newGoals);
  };

  const calculateBMI = () => {
    const heightInM = profile.height / 100;
    const bmi = profile.weight / (heightInM * heightInM);
    return Math.round(bmi * 10) / 10;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Untergewicht', color: '#F59E0B' };
    if (bmi < 25) return { text: 'Normalgewicht', color: '#10B981' };
    if (bmi < 30) return { text: 'Übergewicht', color: '#F59E0B' };
    return { text: 'Adipositas', color: '#EF4444' };
  };

  const getRecommendedWaterIntake = () => {
    const base = profile.weight * 35; // ml per kg
    const activity = profile.activityLevel === 'high' ? 500 : profile.activityLevel === 'moderate' ? 300 : 0;
    return Math.round((base + activity) / 250); // glasses (250ml each)
  };

  const exportData = () => {
    const data = {
      profile,
      progressStats: localStorage.getItem('progressStats'),
      mySupplements: localStorage.getItem('mySupplements'),
      hydrationData: localStorage.getItem('hydrationData'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LifeOptima-Export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const testNotifications = () => {
    if (profile.notifications.hydration) {
      NotificationService.scheduleHydrationReminder(90);
    }
    if (profile.notifications.focus) {
      NotificationService.scheduleCreativityPhase();
    }
    alert('🔔 Test-Benachrichtigungen wurden gesendet!\n\nÜberprüfen Sie Ihre Benachrichtigungseinstellungen, falls Sie nichts sehen.');
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const recommendedWater = getRecommendedWaterIntake();

  return (
    <div className="content-container fade-in">
      {/* Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h2>👤 Mein Profil</h2>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>
          Personalisieren Sie LifeOptima nach Ihren Bedürfnissen
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            className={activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i> Profil
          </button>
          <button
            className={activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i> Benachrichtigungen
          </button>
          <button
            className={activeTab === 'preferences' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('preferences')}
          >
            <i className="fas fa-cog"></i> Einstellungen
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <>
          <div className="card">
            <div className="card-header">
              <i className="fas fa-id-card" style={{ color: '#6366F1', fontSize: '24px' }}></i>
              <h3 className="card-title">Persönliche Informationen</h3>
              <button 
                className={isEditing ? 'btn-primary' : 'btn-secondary'}
                onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                style={{ marginLeft: 'auto' }}
              >
                <i className={isEditing ? 'fas fa-save' : 'fas fa-edit'}></i>
                {isEditing ? 'Speichern' : 'Bearbeiten'}
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  disabled={!isEditing}
                  style={{ width: '100%' }}
                  placeholder="Ihr Name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Alter</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => updateProfile('age', parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                  style={{ width: '100%' }}
                  min="18" max="100"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Gewicht (kg)</label>
                <input 
                  type="number" 
                  value={profile.weight}
                  onChange={(e) => updateProfile('weight', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing}
                  style={{ width: '100%' }}
                  min="30" max="200" step="0.1"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Größe (cm)</label>
                <input 
                  type="number" 
                  value={profile.height}
                  onChange={(e) => updateProfile('height', parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                  style={{ width: '100%' }}
                  min="100" max="250"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Aktivitätslevel</label>
                <select 
                  value={profile.activityLevel}
                  onChange={(e) => updateProfile('activityLevel', e.target.value)}
                  disabled={!isEditing}
                  style={{ width: '100%' }}
                >
                  <option value="low">Niedrig (Bürojob)</option>
                  <option value="moderate">Moderat (1-3x Sport/Woche)</option>
                  <option value="high">Hoch (4+ Sport/Woche)</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Chronotyp</label>
                <select 
                  value={profile.chronotype}
                  onChange={(e) => updateProfile('chronotype', e.target.value)}
                  disabled={!isEditing}
                  style={{ width: '100%' }}
                >
                  <option value="morning">Frühaufsteher (Lerche)</option>
                  <option value="neutral">Neutral</option>
                  <option value="evening">Spätaufsteher (Eule)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-heartbeat" style={{ color: '#EF4444', fontSize: '24px' }}></i>
              <h3 className="card-title">Gesundheitsdaten</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
                <h4>BMI</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: bmiCategory.color, marginBottom: '8px' }}>
                  {bmi}
                </div>
                <div style={{ fontSize: '14px', color: bmiCategory.color, fontWeight: '600' }}>
                  {bmiCategory.text}
                </div>
              </div>
              
              <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
                <h4>Empfohlene Wassermenge</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366F1', marginBottom: '8px' }}>
                  {recommendedWater}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  Gläser pro Tag
                </div>
              </div>
              
              <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
                <h4>Kalorien (geschätzt)</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '8px' }}>
                  {Math.round(profile.weight * 24 * (profile.activityLevel === 'high' ? 1.4 : profile.activityLevel === 'moderate' ? 1.2 : 1.0))}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  kcal pro Tag
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-target" style={{ color: '#10B981', fontSize: '24px' }}></i>
              <h3 className="card-title">Meine Ziele</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {availableGoals.map(goal => (
                <label key={goal} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: profile.goals.includes(goal) ? '#F3F4F6' : 'white' }}>
                  <input 
                    type="checkbox" 
                    checked={profile.goals.includes(goal)}
                    onChange={() => toggleGoal(goal)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: profile.goals.includes(goal) ? '600' : 'normal' }}>
                    {goal}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card">
          <div className="card-header">
            <i className="fas fa-bell" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
            <h3 className="card-title">Benachrichtigungseinstellungen</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(profile.notifications).map(([key, value]) => {
              const labels = {
                hydration: { icon: '💧', text: 'Hydration-Erinnerungen', desc: 'Regelmäßige Erinnerungen zum Wassertrinken' },
                supplements: { icon: '💊', text: 'Supplement-Erinnerungen', desc: 'Erinnerungen für Ihre täglichen Supplements' },
                focus: { icon: '🧠', text: 'Fokusphase-Starts', desc: 'Benachrichtigungen für 90-Minuten-Fokussitzungen' },
                breaks: { icon: '☕', text: 'Pause-Erinnerungen', desc: 'Erinnerungen für aktive Pausen' },
                sleep: { icon: '😴', text: 'Schlaf-Erinnerungen', desc: 'Erinnerungen für Wind-Down-Routine' }
              };
              
              const label = labels[key as keyof typeof labels];
              
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{label.icon}</span>
                    <div>
                      <h4 style={{ margin: 0, marginBottom: '4px' }}>{label.text}</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>{label.desc}</p>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={value}
                      onChange={(e) => updateNotifications(key as keyof UserProfile['notifications'], e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      {value ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              className="btn-primary"
              onClick={testNotifications}
              style={{ flex: 1 }}
            >
              <i className="fas fa-bell"></i>
              Test-Benachrichtigung senden
            </button>
            <button 
              className="btn-secondary"
              onClick={saveProfile}
            >
              <i className="fas fa-save"></i>
              Speichern
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card">
          <div className="card-header">
            <i className="fas fa-cog" style={{ color: '#6B7280', fontSize: '24px' }}></i>
            <h3 className="card-title">App-Einstellungen</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: '4px' }}>🌙 Dark Mode</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Dunkles Design für die Augen</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={profile.preferences.darkMode}
                  onChange={(e) => updatePreferences('darkMode', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  {profile.preferences.darkMode ? 'Aktiv' : 'Inaktiv'}
                </span>
              </label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: '4px' }}>🌍 Sprache</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>App-Sprache</p>
              </div>
              <select 
                value={profile.preferences.language}
                onChange={(e) => updatePreferences('language', e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: '4px' }}>📏 Einheiten</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Maßeinheiten</p>
              </div>
              <select 
                value={profile.preferences.units}
                onChange={(e) => updatePreferences('units', e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="metric">Metrisch (kg, cm)</option>
                <option value="imperial">Imperial (lbs, ft)</option>
              </select>
            </div>
          </div>
          
          <button 
            className="btn-primary"
            onClick={saveProfile}
            style={{ width: '100%', marginTop: '16px' }}
          >
            <i className="fas fa-save"></i>
            Einstellungen speichern
          </button>
        </div>
      )}

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-database" style={{ color: '#6B7280', fontSize: '24px' }}></i>
          <h3 className="card-title">Datenverwaltung</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn-secondary"
            onClick={exportData}
            style={{ width: '100%' }}
          >
            <i className="fas fa-download"></i>
            Daten exportieren (JSON)
          </button>
          
          <button 
            className="btn-accent"
            onClick={() => {
              if (confirm('⚠️ Alle Daten werden gelöscht!\n\nSind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            style={{ width: '100%' }}
          >
            <i className="fas fa-trash"></i>
            Alle Daten löschen
          </button>
        </div>
        
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px', fontSize: '12px', color: '#6B7280' }}>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Datenschutz:</strong></p>
          <p style={{ margin: 0 }}>• Alle Daten werden nur lokal in Ihrem Browser gespeichert</p>
          <p style={{ margin: 0 }}>• Keine Daten werden an Server übertragen</p>
          <p style={{ margin: 0 }}>• Sie haben volle Kontrolle über Ihre Daten</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen; 