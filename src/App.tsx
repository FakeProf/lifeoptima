import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import SupplementsScreen from './screens/SupplementsScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import { NotificationService } from './services/NotificationService';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="nav-container">
      <div className="nav-tabs">
        <Link 
          to="/" 
          className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
        >
          <i className="fas fa-home nav-icon"></i>
          <span>Home</span>
        </Link>
        
        <Link 
          to="/schedule" 
          className={`nav-tab ${location.pathname === '/schedule' ? 'active' : ''}`}
        >
          <i className="fas fa-clock nav-icon"></i>
          <span>Zeitplan</span>
        </Link>
        
        <Link 
          to="/supplements" 
          className={`nav-tab ${location.pathname === '/supplements' ? 'active' : ''}`}
        >
          <i className="fas fa-pills nav-icon"></i>
          <span>Supplements</span>
        </Link>
        
        <Link 
          to="/progress" 
          className={`nav-tab ${location.pathname === '/progress' ? 'active' : ''}`}
        >
          <i className="fas fa-chart-line nav-icon"></i>
          <span>Fortschritt</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`nav-tab ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <i className="fas fa-user nav-icon"></i>
          <span>Profil</span>
        </Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    NotificationService.initialize();
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">LifeOptima wird geladen...</div>
        <div className="loading-subtitle">Ihr Begleiter für optimale Gesundheit</div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/schedule" element={<ScheduleScreen />} />
          <Route path="/supplements" element={<SupplementsScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
};

export default App; 