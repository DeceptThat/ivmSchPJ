import { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedule.css';

function Schedule({ onBack }) {
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [newEntry, setNewEntry] = useState({ staff_id: '', staff_name: '', date: '', shift: 'Morning' });

  const fetchData = async () => {
    try {
      const [schedRes, staffRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/schedule-list'),
        axios.get('http://localhost:5000/api/auth/staff-list')
      ]);
      setSchedules(schedRes.data || []);
      setStaffList(staffRes.data || []);
    } catch (err) {
      console.error("Error fetching schedule data:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEntry.staff_id || !newEntry.date) return alert("Fill all fields");
    try {
      await axios.post('http://localhost:5000/api/auth/add-schedule', newEntry);
      fetchData(); 
      setNewEntry({ staff_id: '', staff_name: '', date: '', shift: 'Morning' });
    } catch (err) {
      alert("Failed to add schedule");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shift?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/remove-schedule/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="schedule-page">
      {/* Sidebar matching the Stock Movement design */}
      <aside className="schedule-sidebar">
        <div className="sidebar-upper-stack">
          <div className="sidebar-pill primary-pill">Assign Shift</div>
          <button className="side-action-btn return-btn" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </aside>

      <main className="schedule-main-content">
        <div className="table-title-area">
          <h2 className="page-main-title">Staff Work Schedule</h2>
        </div>

        {/* Input area styled like the Stock table header */}
        <div className="schedule-card form-card">
          <form onSubmit={handleAdd} className="schedule-assignment-form">
            <div className="input-group">
              <label>Staff Member</label>
              <select 
                className="schedule-pill"
                value={newEntry.staff_id} 
                onChange={e => {
                  const selectedStaff = staffList.find(s => s.staff_id === parseInt(e.target.value));
                  setNewEntry({
                    ...newEntry, 
                    staff_id: e.target.value, 
                    staff_name: selectedStaff ? selectedStaff.staff_name : '' 
                  });
                }}
              >
                <option value="">-- Select Staff --</option>
                {staffList.map(s => (
                  <option key={s.staff_id} value={s.staff_id}>{s.staff_name}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label>Date</label>
              <input type="date" className="schedule-pill" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
            </div>

            <div className="input-group">
              <label>Shift Time</label>
              <select className="schedule-pill" value={newEntry.shift} onChange={e => setNewEntry({...newEntry, shift: e.target.value})}>
                <option value="Morning">Morning (08:00 - 16:00)</option>
                <option value="Afternoon">Afternoon (16:00 - 00:00)</option>
                <option value="Night">Night (00:00 - 08:00)</option>
              </select>
            </div>

            <button type="submit" className="assign-btn">Assign Shift</button>
          </form>
        </div>

        {/* Table matching the Stock History table design */}
        <div className="schedule-table-scroll-box">
          <table className="schedule-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Staff Name</th>
                <th>Shift Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(item => (
                <tr key={item.sched_id}>
                  <td className="date-cell">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="staff-cell">{item.staff_name || item.Staff?.staff_name || 'Unknown'}</td>
                  <td><span className={`shift-badge ${item.shift.toLowerCase()}`}>{item.shift}</span></td>
                  <td>
                    <button className="delete-row-btn" onClick={() => handleDelete(item.sched_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Schedule;