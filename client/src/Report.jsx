import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './Report.css';

const reportData = [
  { day: 'Sun', earnings: 50 }, { day: 'Mon', earnings: 120 },
  { day: 'Tue', earnings: 70 }, { day: 'Wed', earnings: 200 },
  { day: 'Thu', earnings: 410 }, { day: 'Fri', earnings: 180 },
  { day: 'Sat', earnings: 180 },
];

function Report({ onBack }) {
  const [showSaleModal, setShowSaleModal] = useState(false);

  const dummySales = [
    { id: 'T001', item: 'Apple', qty: 5, total: '$10.00', date: '2026-02-01' },
    { id: 'T002', item: 'Orange', qty: 10, total: '$15.00', date: '2026-02-01' },
    { id: 'T003', item: 'Milk', qty: 2, total: '$8.50', date: '2026-01-31' },
  ];

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
                <AreaChart data={reportData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="earnings" stroke="#3b82f6" fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="date-controls">
            <div className="date-input-group">
              <label>Start Date:</label>
              <div className="pill-container">
                <input className="pill-input" placeholder="01" /><input className="pill-input" placeholder="07" /><input className="pill-input" placeholder="2025" />
              </div>
            </div>
            <div className="date-input-group">
              <label>End Date:</label>
              <div className="pill-container">
                <input className="pill-input" placeholder="01" /><input className="pill-input" placeholder="08" /><input className="pill-input" placeholder="2025" />
              </div>
            </div>
            <button className="generate-btn" onClick={() => alert("Demo Mode")}>Generate</button>
          </div>
        </div>

        <div className="report-bottom-row">
          <div className="report-card summary-card">
            <h3 className="card-label">Summary</h3>
            <div className="summary-columns">
              <div className="summary-col-left"><p>Total income :</p><p>Low Stock item :</p><p>Total Sale :</p></div>
              <div className="summary-col-right"><p>500</p><p>5</p><p>57</p></div>
            </div>
          </div>

          <div className="report-side-buttons">
            <button className="side-btn" onClick={() => setShowSaleModal(true)}>sale record</button>
            <button className="side-btn" onClick={onBack}>Return</button>
          </div>
        </div>
      </div>

      {}
      {showSaleModal && (
        <div className="modal-overlay">
          <div className="report-modal"> {}
            <div className="modal-header">
              <h3>Recent Sale Transactions</h3>
              <button onClick={() => setShowSaleModal(false)} style={{cursor: 'pointer'}}>×</button>
            </div>
            <table className="report-table">
              <thead>
                <tr><th>ID</th><th>Item</th><th>Qty</th><th>Total</th><th>Date</th></tr>
              </thead>
              <tbody>
                {dummySales.map(s => (
                  <tr key={s.id}><td>{s.id}</td><td>{s.item}</td><td>{s.qty}</td><td>{s.total}</td><td>{s.date}</td></tr>
                ))}
              </tbody>
            </table>
            <button className="modal-cancel-btn" onClick={() => setShowSaleModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;