import { useState, useEffect } from 'react';
import './Admin.css';

function Admin({ onBack }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // --- DATA STATES ---
  const [staffList, setStaffList] = useState([
    { id: 'S001', name: 'Arthit Wong', contact: '0812345678', occupation: 'Manager', username: 'arthit.w' },
    { id: 'S002', name: 'Supawan Meecha', contact: '0891122334', occupation: 'Admin', username: 'supawan.m' },
  ]);

  const [scheduleList, setScheduleList] = useState([
    { id: 'SCH01', staffId: 'S001', date: '2026-02-01', time: '08:00 - 16:00' },
  ]);

  // New state for Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('systemNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [noteForm, setNoteForm] = useState({ message: '', type: 'Info' });

  useEffect(() => {
    localStorage.setItem('systemNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleAddData = () => {
    if (activeTab === 'notifications') {
      if (!noteForm.message) return alert("Please enter a message");
      const newNote = { 
        id: Date.now(), 
        ...noteForm, 
        timestamp: new Date().toLocaleString() 
      };
      setNotifications([newNote, ...notifications]);
      setNoteForm({ message: '', type: 'Info' });
    }
    // (Other add logic for staff/schedule would go here)
    setShowAddModal(false);
  };

  const handleRemoveData = (idToRemove) => {
    if (activeTab === 'notifications') {
      setNotifications(notifications.filter(n => n.id.toString() !== idToRemove));
    }
    setShowRemoveModal(false);
  };

  const renderAddFields = () => {
    if (activeTab === 'staff') {
      return (
        <>
          <div className="modal-row"><label>Staff Name</label><input className="modal-pill" placeholder="Name" /></div>
          <div className="modal-row"><label>Staff ID</label><input className="modal-pill" placeholder="S-XXX" /></div>
        </>
      );
    } else if (activeTab === 'schedule') {
      return (
        <>
          <div className="modal-row"><label>Schedule ID</label><input className="modal-pill" placeholder="SCH-XXX" /></div>
          <div className="modal-row"><label>Date</label><input className="modal-pill" type="date" /></div>
        </>
      );
    } else if (activeTab === 'notifications') {
      return (
        <>
          <div className="modal-row">
            <label>Level</label>
            <select className="modal-pill" onChange={e => setNoteForm({...noteForm, type: e.target.value})}>
              <option value="Info">ℹ️ Info</option>
              <option value="Warning">⚠️ Warning</option>
              <option value="Urgent">🚨 Urgent</option>
            </select>
          </div>
          <div className="modal-row">
            <label>Message</label>
            <textarea 
              className="modal-pill" 
              placeholder="Type notification here..."
              onChange={e => setNoteForm({...noteForm, message: e.target.value})}
              style={{height: '80px', paddingTop: '10px'}}
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2 className="admin-title">Admin Page / {activeTab.toUpperCase()}</h2>
        <button onClick={onBack} className="back-btn-admin">Back to Dashboard</button>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <div className="nav-group">
            <p className="nav-label">Navigation :</p>
            <button className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>👤 Staff</button>
            <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>🕒 Schedule</button>
            <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>🔔 Notifications</button>
            <button className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>📝 Logs</button>
          </div>

          {activeTab !== 'logs' && (
            <div className="action-group">
              <button className="admin-action-btn" onClick={() => setShowAddModal(true)}>Add {activeTab}</button>
              <button className="admin-action-btn" onClick={() => setShowRemoveModal(true)}>Remove {activeTab}</button>
            </div>
          )}
        </aside>

        <main className="admin-main-area">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              {activeTab === 'staff' ? (
                <>
                  <thead><tr><th>Staff ID</th><th>Name</th><th>Contact</th><th>Occupation</th><th>Username</th></tr></thead>
                  <tbody>{staffList.map((s, i) => (<tr key={i}><td>{s.id}</td><td>{s.name}</td><td>{s.contact}</td><td>{s.occupation}</td><td>{s.username}</td></tr>))}</tbody>
                </>
              ) : activeTab === 'schedule' ? (
                <>
                  <thead><tr><th>Sched ID</th><th>Staff ID</th><th>Date</th><th>Time Slot</th></tr></thead>
                  <tbody>{scheduleList.map((sch, i) => (<tr key={i}><td>{sch.id}</td><td>{sch.staffId}</td><td>{sch.date}</td><td>{sch.time}</td></tr>))}</tbody>
                </>
              ) : activeTab === 'notifications' ? (
                <>
                  <thead><tr><th>ID</th><th>Type</th><th>Message</th><th>Timestamp</th></tr></thead>
                  <tbody>{notifications.map((n, i) => (<tr key={i}><td>{n.id}</td><td>{n.type}</td><td>{n.message}</td><td>{n.timestamp}</td></tr>))}</tbody>
                </>
              ) : (
                <thead><tr><th>Log ID</th><th>User</th><th>Action</th><th>Timestamp</th></tr></thead>
              )}
            </table>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Add {activeTab}</h3>
              <button className="close-x" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {renderAddFields()}
              <button className="modal-submit-btn" onClick={handleAddData}>+ Confirm Add</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="modal-box remove-box">
            <div className="modal-header">
              <h3 className="modal-title">Remove {activeTab}</h3>
              <button className="close-x" onClick={() => setShowRemoveModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="remove-warning">Enter ID to delete:</p>
              <div className="modal-row">
                <input className="modal-pill" id="removeID" placeholder="Enter ID here" />
              </div>
              <button className="modal-submit-btn remove-confirm" onClick={() => handleRemoveData(document.getElementById('removeID').value)}>
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;