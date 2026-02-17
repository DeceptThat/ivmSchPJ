import { useState, useEffect } from 'react';
import Login from './Login';
import Home from './Home';
import Admin from './Admin';
import Report from './Report';
import Items from './Items';
import Schedule from './Schedule';
import Supplier from './Supplier';
import Stock from './Stock';
import Sale from './Sale'; 
import AdminGateKeeper from './AdminGateKeeper'; 
import './App.css';

function App() {
  // 1. SAFE INITIALIZATION
  const [userRole, setUserRole] = useState(() => {
    const r = localStorage.getItem('userRole');
    return (r && r !== "undefined" && r !== "null") ? r : null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved && saved !== "undefined" && saved !== "null") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [view, setView] = useState(() => {
    const v = localStorage.getItem('lastView');
    return (v && v !== "undefined") ? v : 'home';
  });
  
  const [isGateOpen, setIsGateOpen] = useState(false);

  // 2. NAVIGATION
  const navigateTo = (newView) => {
    setView(newView);
    localStorage.setItem('lastView', newView);
  };

  // 3. HANDLERS
  const handleLogin = (role, userData) => {
    if (!userData) return alert("Login Error: User data is missing.");
    setUserRole(role);
    setUser(userData);
    localStorage.setItem('userRole', role);
    localStorage.setItem('user', JSON.stringify(userData));
    navigateTo('home');
  };

  const handleAdminVerification = (verifiedUser) => {
    if (!verifiedUser) return alert("Verification Error: Data missing.");
    setUser(verifiedUser);
    setUserRole(verifiedUser.role);
    localStorage.setItem('user', JSON.stringify(verifiedUser));
    localStorage.setItem('userRole', verifiedUser.role);
    setIsGateOpen(false);
    navigateTo('admin');
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setUserRole(null);
      setUser(null);
      setView('home');
      window.location.reload(); 
    }
  };

  // 4. AUTH GATE - RECALIBRATED
  // If we don't have a valid user object, do not show the Home or Stock pages.
  if (!userRole || !user) {
    return <Login onLogin={handleLogin} />;
  }

  // 5. VIEW ROUTER
  const renderView = () => {
    switch (view) {
      case 'admin':    return <Admin onBack={() => navigateTo('home')} />;
      case 'report':   return <Report onBack={() => navigateTo('home')} />;
      case 'items':    return <Items onBack={() => navigateTo('home')} />;
      case 'stock':    return <Stock user={user} onBack={() => navigateTo('home')} />; 
      case 'schedule': return <Schedule onBack={() => navigateTo('home')} />;
      case 'supplier': return <Supplier onBack={() => navigateTo('home')} />;
      case 'checkout': return <Sale onBack={() => navigateTo('home')} />;
      default:         return (
        <Home 
          userRole={userRole}
          userName={user?.staff_name}
          onLogout={handleLogout} 
          onAdminClick={() => setIsGateOpen(true)}
          onReportClick={() => navigateTo('report')} 
          onItemsClick={() => navigateTo('items')}
          onStockClick={() => navigateTo('stock')}
          onScheduleClick={() => navigateTo('schedule')}
          onSupplierClick={() => navigateTo('supplier')} 
          onCheckOutClick={() => navigateTo('checkout')}
        />
      );
    }
  };

  return (
    <div className="app-container">
      <div style={{background: '#000', color: '#fff', padding: '10px', fontSize: '12px', textAlign: 'right'}}>
          Logged in as: <strong>{user.staff_name}</strong> | Role: {userRole}
      </div>
      {renderView()}
      <AdminGateKeeper 
        isOpen={isGateOpen} 
        onClose={() => setIsGateOpen(false)} 
        onConfirm={handleAdminVerification} 
      />
    </div>
  );
}

export default App;