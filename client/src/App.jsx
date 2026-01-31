import { useState } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('home'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') setIsLoggedIn(true);
    else alert('Invalid Credentials!');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input className="login-input" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input className="login-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- ROUTING SWITCHBOARD ---
  if (view === 'admin') return <Admin onBack={() => setView('home')} />;
  if (view === 'report') return <Report onBack={() => setView('home')} />;
  if (view === 'items') return <Items onBack={() => setView('home')} />;
  if (view === 'stock') return <Stock onBack={() => setView('home')} />; 
  if (view === 'schedule') return <Schedule onBack={() => setView('home')} />;
  if (view === 'supplier') return <Supplier onBack={() => setView('home')} />;
  if (view === 'checkout') return <Sale onBack={() => setView('home')} />;

  return (
    <Home 
      onLogout={() => { setIsLoggedIn(false); setView('home'); }} 
      onAdminClick={() => {
        const pass = prompt("Admin Password:");
        if (pass === 'Admin') setView('admin');
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

export default App;