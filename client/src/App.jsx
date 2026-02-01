import { useState } from 'react';
import Login from './Login'; // New Import
import Home from './Home';
import Admin from './Admin';
import Report from './Report';
import Items from './Items';
import Schedule from './Schedule';
import Supplier from './Supplier';
import Stock from './Stock';
import Sale from './Sale'; 
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null); // null = logged out
  const [view, setView] = useState('home'); 

  // --- 1. LOGIN GATEKEEPER ---
  // If no userRole, show only Login.jsx. 
  // We pass 'setUserRole' so Login.jsx can tell App.jsx who logged in.
  if (!userRole) {
    return <Login onLogin={(role) => setUserRole(role)} />;
  }

  // --- 2. NAVIGATION SWITCHBOARD ---
  // Returns specific page based on the 'view' state
  const renderView = () => {
    switch (view) {
      case 'admin':    return <Admin onBack={() => setView('home')} />;
      case 'report':   return <Report onBack={() => setView('home')} />;
      case 'items':    return <Items onBack={() => setView('home')} />;
      case 'stock':    return <Stock onBack={() => setView('home')} />; 
      case 'schedule': return <Schedule onBack={() => setView('home')} />;
      case 'supplier': return <Supplier onBack={() => setView('home')} />;
      case 'checkout': return <Sale onBack={() => setView('home')} />;
      default:         return (
        <Home 
          onLogout={() => { setUserRole(null); setView('home'); }} 
          onAdminClick={() => {
            const pass = prompt("Admin Password:");
            if (pass === 'Admin') setView('admin');
            else alert("Access Denied");
          }}
          onReportClick={() => setView('report')} 
          onItemsClick={() => setView('items')}
          onStockClick={() => setView('stock')}
          onScheduleClick={() => setView('schedule')}
          onSupplierClick={() => setView('supplier')} 
          onCheckOutClick={() => setView('checkout')}
        />
      );
    }
  };

  return (
    <div className="app-container">
      {renderView()}
    </div>
  );
}

export default App;