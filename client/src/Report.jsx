import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './Report.css';


const reportData = [
  { day: 'Sun', earnings: 50 },
  { day: 'Mon', earnings: 120 },
  { day: 'Tue', earnings: 70 },
  { day: 'Wed', earnings: 200 },
  { day: 'Thu', earnings: 410 }, 
  { day: 'Fri', earnings: 180 },
  { day: 'Sat', earnings: 180 },
];

function Report({ onBack }) {
  const handleGenerate = () => alert("Updating chart based on new dates... (Demo Mode)");

  return (
    <div className="report-page">
      <header className="report-header">
        <h2 className="report-title">Report</h2>
      </header>

      <div className="report-content">
        <div className="report-top-row">
          <div className="report-card chart-card">
            <h3 className="card-label">Earnings</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEarnings)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="date-controls">
            <div className="date-input-group">
              <label className="center-label">Start Date:</label>
              <div className="pill-container">
                <input className="pill-input" placeholder="01" />
                <input className="pill-input" placeholder="07" />
                <input className="pill-input" placeholder="2025" />
              </div>
            </div>
            <div className="date-input-group">
              <label className="center-label">End Date:</label>
              <div className="pill-container">
                <input className="pill-input" placeholder="01" />
                <input className="pill-input" placeholder="08" />
                <input className="pill-input" placeholder="2025" />
              </div>
            </div>
            <button className="generate-btn" onClick={handleGenerate}>Generate</button>
          </div>
        </div>

        <div className="report-bottom-row">
          <div className="report-card summary-card">
            <h3 className="card-label">Summary</h3>
            <div className="summary-columns">
              <div className="summary-col-left">
                <p>Total income :</p>
                <p>Low Stock item :</p>
                <p>Total Sale :</p>
              </div>
              <div className="summary-col-right">
                <p>500</p>
                <p>5</p>
                <p>57</p>
              </div>
            </div>
            <div className="summary-date-section">
              <select className="date-range-select">
                <option>01 July 25 – 01 Aug 25</option>
              </select>
            </div>
          </div>

          <div className="report-side-buttons">
            <button className="side-btn">sale record</button>
            <button className="side-btn" onClick={onBack}>Return</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;