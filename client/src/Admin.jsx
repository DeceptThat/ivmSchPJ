import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin({ onBack }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [showAddModal, setShowAddModal] = useState(false);

  // --- ALL DATA STATES PRESERVED ---
  const [staffList, setStaffList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]); 
  const [notifications, setNotifications] = useState([]);

  // --- ALL FORM STATES PRESERVED ---
  const [staffForm, setStaffForm] = useState({ name: '', occupation: '', username: '', password: '' });
  const [schedForm, setSchedForm] = useState({ staff_name: '', shift: '', date: '' });
  const [notifForm, setNotifForm] = useState({ message: '' });

  const fetchAllData = async () => {
    try {
      const [staffRes, schedRes, notifRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/staff-list'),
        axios.get('http://localhost:5000/api/auth/schedule-list'),
        axios.get('http://localhost:5000/api/auth/notification-list'),
      ]);
      setStaffList(staffRes.data || []);
      setScheduleList(schedRes.data || []);
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  useEffect(() => { 
    fetchAllData(); 
  }, []);

  const handleAddData = async () => {
    try {
      if (activeTab === 'staff') {
        await axios.post('http://localhost:5000/api/auth/add-staff', {
          staff_name: staffForm.name,
          username: staffForm.username,
          password: staffForm.password,
          role: staffForm.occupation || 'Staff'
        });
        setStaffForm({ name: '', occupation: '', username: '', password: '' });
      } else if (activeTab === 'schedule') {
        await axios.post('http://localhost:5000/api/auth/add-schedule', {
          staff_name: schedForm.staff_name,
          shift: schedForm.shift,
          date: schedForm.date
        });
        setSchedForm({ staff_name: '', shift: '', date: '' });
      } else if (activeTab === 'notifications') {
        await axios.post('http://localhost:5000/api/auth/add-notification', { 
          message: notifForm.message 
        });
        setNotifForm({ message: '' });
      }
      await fetchAllData();
      setShowAddModal(false);
    } catch (err) {
      alert("Save Error: " + (err.response?.data?.message || "Server error"));
    }
  };

  const handleRemoveData = async (id, type) => {
    if (!window.confirm(`Delete ${type}?`)) return;
    try {
      const endpoint = type === 'staff' ? 'remove-staff' : type === 'notification' ? 'remove-notification' : 'remove-schedule';
      await axios.delete(`http://localhost:5000/api/auth/${endpoint}/${id}`);
      await fetchAllData();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="sidebar-upper-stack">
          <div className="sidebar-pill primary-pill">Admin / {activeTab.toUpperCase()}</div>
          
          <div className="nav-group">
            <button className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>👤 Staff List</button>
            <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>🕒 Shift Sched</button>
            <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>🔔 Alerts</button>
          </div>

          <button className="side-action-btn primary-action" onClick={() => setShowAddModal(true)}>
            + Add New {activeTab}
          </button>

          <button className="side-action-btn return-btn" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <div className="table-title-area">
          <h2 className="page-main-title">Management Dashboard</h2>
        </div>

        <div className="admin-table-scroll-box">
          <table className="admin-data-table">
            <thead>
              {activeTab === 'staff' && (
                <tr><th>ID</th><th>Staff Name</th><th>Role</th><th>Username</th><th>Action</th></tr>
              )}
              {activeTab === 'schedule' && (
                <tr><th>ID</th><th>Staff Member</th><th>Shift</th><th>Date</th><th>Action</th></tr>
              )}
              {activeTab === 'notifications' && (
                <tr><th>ID</th><th>Message</th><th>Date Posted</th><th>Action</th></tr>
              )}
            </thead>
            <tbody>
              {activeTab === 'staff' && staffList.map(s => (
                <tr key={s.staff_id}>
                  <td>#{s.staff_id}</td>
                  <td className="bold-cell">{s.staff_name}</td>
                  <td>{s.role}</td>
                  <td>{s.username}</td>
                  <td><button className="delete-row-btn" onClick={() => handleRemoveData(s.staff_id, 'staff')}>Remove</button></td>
                </tr>
              ))}
              {activeTab === 'schedule' && scheduleList.map(sc => (
                <tr key={sc.sched_id}>
                  <td>#{sc.sched_id}</td>
                  <td className="bold-cell">{sc.staff_name}</td>
                  <td>{sc.shift}</td>
                  <td>{sc.date}</td>
                  <td><button className="delete-row-btn" onClick={() => handleRemoveData(sc.sched_id, 'schedule')}>Remove</button></td>
                </tr>
              ))}
              {activeTab === 'notifications' && notifications.map(n => (
                <tr key={n.notif_id}>
                  <td>#{n.notif_id}</td>
                  <td className="message-cell">{n.message}</td>
                  <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td><button className="delete-row-btn" onClick={() => handleRemoveData(n.notif_id, 'notification')}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Create New {activeTab}</h3>
            <div className="modal-form-stack">
              {activeTab === 'staff' ? (
                <>
                  <input className="modal-pill" placeholder="Name" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
                  <input className="modal-pill" placeholder="Role" value={staffForm.occupation} onChange={e => setStaffForm({...staffForm, occupation: e.target.value})} />
                  <input className="modal-pill" placeholder="Username" value={staffForm.username} onChange={e => setStaffForm({...staffForm, username: e.target.value})} />
                  <input className="modal-pill" type="password" placeholder="Password" value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} />
                </>
              ) : activeTab === 'schedule' ? (
                <>
                  <input className="modal-pill" placeholder="Staff Name" value={schedForm.staff_name} onChange={e => setSchedForm({...schedForm, staff_name: e.target.value})} />
                  <input className="modal-pill" placeholder="Shift (e.g. Morning)" value={schedForm.shift} onChange={e => setSchedForm({...schedForm, shift: e.target.value})} />
                  <input className="modal-pill" type="date" value={schedForm.date} onChange={e => setSchedForm({...schedForm, date: e.target.value})} />
                </>
              ) : (
                <textarea className="modal-pill textarea" placeholder="Enter Alert Message..." value={notifForm.message} onChange={e => setNotifForm({message: e.target.value})} />
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={handleAddData}>Confirm Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;