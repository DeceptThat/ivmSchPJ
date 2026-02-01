import { useState } from 'react';
import Login from './Login';
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
  const [userRole, setUserRole] = useState(null); 
  const [view, setView] = useState('home'); 

  if (!userRole) {
    return <Login onLogin={(role) => setUserRole(role)} />;
  }

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
          userRole={userRole}
          onLogout={() => { setUserRole(null); setView('home'); }} 
          onAdminClick={() => {
            // Check role first, then secondary password
            if (userRole === 'admin' || userRole === 'manager') {
              const secondPass = prompt("Enter Secure Admin Key:");
              if (secondPass === 'Admin123') { // Set your preferred key here
                setView('admin');
              } else {
                alert("Incorrect Secure Key!");
              }
            } else {
              alert("Access Denied: Admin privileges required.");
            }
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