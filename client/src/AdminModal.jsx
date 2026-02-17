import React, { useState } from 'react';
import './Admin.css'; // Reuse your existing modal styles

function AdminGatekeeper({ isOpen, onClose, onConfirm }) {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 className="modal-title">🛡️ Admin Security Check</h3>
          <button className="close-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '0.9rem' }}>
            Please enter the secure key to access administrative functions.
          </p>
          <div className="modal-row">
            <input 
              className="modal-pill" 
              type="password" 
              value={key} 
              onChange={(e) => setKey(e.target.value)} 
              placeholder="Enter Secure Key"
              autoFocus
            />
          </div>
          <button 
            className="modal-submit-btn" 
            onClick={() => {
              onConfirm(key);
              setKey(''); // reset for next time
            }}
          >
            Verify & Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminGatekeeper;