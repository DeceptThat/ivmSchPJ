import { useState } from 'react';
import axios from 'axios';

function AdminGateKeeper({ isOpen, onClose, onConfirm }) {
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isOpen) return null;

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        username: adminUser, 
        password: adminPassword 
      });

      if (res.data.user) {
        // Sends the full user object (with staff_id) back to App.jsx
        onConfirm(res.data.user); 
      }
    } catch (err) {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', color: '#000', width: '350px', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0 }}>🔒 Secure Admin Access</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>Verify credentials to enter Admin Mode.</p>
        
        <input 
          placeholder="Username" 
          value={adminUser} 
          onChange={e => setAdminUser(e.target.value)} 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={adminPassword} 
          onChange={e => setAdminPassword(e.target.value)} 
          style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box' }} 
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleVerify} style={{ flex: 1, padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>Verify</button>
        </div>
      </div>
    </div>
  );
}

export default AdminGateKeeper;