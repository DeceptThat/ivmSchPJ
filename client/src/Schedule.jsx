import { useState, useEffect } from 'react';
import './Schedule.css';

function Schedule({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scheduleData');
      if (saved) {
        setScheduleList(JSON.parse(saved));
      }
    } catch (e) {
      setScheduleList([]);
    }
  }, []);

  const filteredSchedule = scheduleList.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      item.staffId?.toLowerCase().includes(search) ||
      item.id?.toLowerCase().includes(search) ||
      item.date?.includes(search)
    );
  });

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h2 className="schedule-title">Staff Schedule</h2>
      </header>

      <div className="schedule-container">
        <aside className="schedule-sidebar">
          <div className="search-pill">
            <span>🔍</span>
            <input 
              placeholder="Search Staff / Date" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="side-action-btn" onClick={onBack}>
            Return
          </button>
        </aside>

        <main className="schedule-main">
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Sched ID</th>
                  <th>Staff ID</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td style={{fontWeight: 'bold'}}>{item.staffId}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
                      No schedules found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Schedule;