import { useState, useEffect } from 'react';
import './Schedule.css';

function Schedule({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load data from LocalStorage to keep it synced with Admin page
  const [staffList] = useState(() => {
    const saved = localStorage.getItem('staffData');
    return saved ? JSON.parse(saved) : [];
  });

  const [scheduleList, setScheduleList] = useState(() => {
    const saved = localStorage.getItem('scheduleData');
    return saved ? JSON.parse(saved) : [
      { id: 'SCH01', staffId: 'S001', staffName: 'Arthit Wong', date: '2026-02-01', shift: 'Morning' }
    ];
  });

  const filteredSchedule = scheduleList.filter(sch => 
    sch.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sch.staffId.includes(searchTerm)
  );

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h2 className="schedule-title">Staff Shift Schedule</h2>
      </header>

      <div className="schedule-container">
        <aside className="schedule-sidebar">
          <div className="search-section">
            <div className="search-pill">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Search Staff..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="side-action-btn">Search</button>
          </div>

          <button className="side-action-btn return-btn" onClick={onBack}>Return</button>
        </aside>

        <main className="schedule-main">
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Sched ID</th>
                  <th>Staff ID</th>
                  <th>Staff Name</th>
                  <th>Date</th>
                  <th>Shift Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map(sch => (
                  <tr key={sch.id}>
                    <td>{sch.id}</td>
                    <td>{sch.staffId}</td>
                    <td>{sch.staffName}</td>
                    <td>{sch.date}</td>
                    <td>{sch.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Schedule;