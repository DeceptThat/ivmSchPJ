import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import './Report.css';

function Report({ onBack }) {
  const [showSaleModal, setShowSaleModal] = useState(false); 
  const [showSpecificModal, setShowSpecificModal] = useState(false); 
  const [salesList, setSalesList] = useState([]); 
  const [specificSales, setSpecificSales] = useState([]); 
  const [summary, setSummary] = useState({ income: 0, lowStock: 0, totalSales: 0 });
  const [chartData, setChartData] = useState([]);

  // Default dates set to February 2026
  const [startDate, setStartDate] = useState({ day: '01', month: '02', year: '2026' });
  const [endDate, setEndDate] = useState({ day: '18', month: '02', year: '2026' });

  const fetchReportData = async () => {
    try {
      const [salesRes, itemsRes, monthlyRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/sale-list'),
        axios.get('http://localhost:5000/api/auth/item-list'),
        axios.get('http://localhost:5000/api/auth/monthly-stats')
      ]);

      // monthlyRes.data now contains [{name: '01 Feb', earnings: 500}, ...]
      setChartData(monthlyRes.data || []); 
      setSalesList(salesRes.data || []);
      
      const totalIncome = salesRes.data.reduce((acc, s) => acc + parseFloat(s.total_amount || 0), 0);
      setSummary({
        income: totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        lowStock: itemsRes.data.filter(i => i.stock_quantity < 5).length,
        totalSales: salesRes.data.length
      });
    } catch (err) { 
      console.error("Report Load Error:", err); 
    }
  };

  const handleFetchSpecificPeriod = async () => {
    try {
      const start = `${startDate.year}-${startDate.month.padStart(2,'0')}-${startDate.day.padStart(2,'0')}`;
      const end = `${endDate.year}-${endDate.month.padStart(2,'0')}-${endDate.day.padStart(2,'0')}`;
      
      const res = await axios.get('http://localhost:5000/api/auth/sale-list', { params: { start, end } });
      setSpecificSales(Array.isArray(res.data) ? res.data : []); 
      setShowSpecificModal(true); 
    } catch (err) { 
      console.error("Search Error:", err); 
    }
  };

  useEffect(() => { 
    fetchReportData(); 
  }, []);

  return (
    <div className="report-page">
      <header className="report-header">
        <h2 className="report-title">Sales Report & Analytics</h2>
      </header>

      <div className="report-content">
        <div className="report-top-row">
          <div className="report-card chart-card">
            <h3 className="card-label">Monthly Revenue (THB)</h3>
            <div className="chart-wrapper" style={{ height: '320px', width: '100%' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    {/* FIXED: XAxis uses "name" to match backend */}
                    <XAxis dataKey="name" interval={4} style={{fontSize: '10px'}} />
                    <YAxis tickFormatter={(v) => `฿${v}`} style={{fontSize: '12px'}} />
                    <Tooltip />
                    {/* FIXED: Area uses "earnings" to match backend */}
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#3b82f6" 
                      fillOpacity={0.3} 
                      fill="#3b82f6" 
                      strokeWidth={3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="loading-state">Loading Chart...</div>
              )}
            </div>
          </div>

          <div className="date-controls">
            <div className="date-input-group">
              <label>Start Date:</label>
              <div className="pill-container">
                <input className="pill-input" value={startDate.day} onChange={(e)=>setStartDate({...startDate, day: e.target.value})}/>
                <input className="pill-input" value={startDate.month} onChange={(e)=>setStartDate({...startDate, month: e.target.value})}/>
                <input className="pill-input" value={startDate.year} onChange={(e)=>setStartDate({...startDate, year: e.target.value})}/>
              </div>
            </div>
            <div className="date-input-group">
              <label>End Date:</label>
              <div className="pill-container">
                <input className="pill-input" value={endDate.day} onChange={(e)=>setEndDate({...endDate, day: e.target.value})}/>
                <input className="pill-input" value={endDate.month} onChange={(e)=>setEndDate({...endDate, month: e.target.value})}/>
                <input className="pill-input" value={endDate.year} onChange={(e)=>setEndDate({...endDate, year: e.target.value})}/>
              </div>
            </div>
            <button className="generate-btn" onClick={handleFetchSpecificPeriod}>Find Record</button>
          </div>
        </div>

        <div className="report-bottom-row">
          <div className="report-card summary-card">
            <h3 className="card-label">Overall Summary</h3>
            <div className="summary-columns">
              <div className="summary-col-left">
                <p>Total income :</p>
                <p>Low Stock :</p>
                <p>Total Transactions :</p>
              </div>
              <div className="summary-col-right">
                <p>{summary.income} THB</p>
                <p style={{color: summary.lowStock > 0 ? 'red' : 'inherit'}}>{summary.lowStock}</p>
                <p>{summary.totalSales}</p>
              </div>
            </div>
          </div>

          <div className="report-side-buttons">
            <button className="side-btn" onClick={() => setShowSaleModal(true)}>Full Sale Record</button>
            <button className="side-btn" onClick={onBack}>Return</button>
          </div>
        </div>
      </div>

      {/* --- MODAL: ALL SALE RECORDS --- */}
      {showSaleModal && (
        <div className="modal-overlay" onClick={() => setShowSaleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>All-Time Sale Records</h3>
              <button className="close-x" onClick={() => setShowSaleModal(false)}>×</button>
            </div>
            <div className="modal-body-scroll">
              <table className="record-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Staff</th>
                    <th>Amount</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {salesList.map(s => (
                    <tr key={s.sale_id}>
                      <td>#{s.sale_id}</td>
                      <td>{s.staff_name || 'Admin'}</td>
                      <td>฿{parseFloat(s.total_amount).toFixed(2)}</td>
                      <td>{new Date(s.sale_date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SEARCHED RECORDS --- */}
      {showSpecificModal && (
        <div className="modal-overlay" onClick={() => setShowSpecificModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Results: {startDate.day}/{startDate.month} to {endDate.day}/{endDate.month}</h3>
              <button className="close-x" onClick={() => setShowSpecificModal(false)}>×</button>
            </div>
            <div className="modal-body-scroll">
              {specificSales.length > 0 ? (
                <table className="record-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Staff</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specificSales.map(s => (
                      <tr key={s.sale_id}>
                        <td>#{s.sale_id}</td>
                        <td>{s.staff_name || 'Admin'}</td>
                        <td>฿{parseFloat(s.total_amount).toFixed(2)}</td>
                        <td>{new Date(s.sale_date).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{padding: '20px', textAlign: 'center'}}>No records found.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;