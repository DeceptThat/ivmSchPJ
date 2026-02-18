import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import './Home.css';

function Home({ 
  onLogout, onAdminClick, onReportClick, onItemsClick, 
  onStockClick, onScheduleClick, onSupplierClick, onCheckOutClick 
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [chartData, setChartData] = useState([]);

  // --- FETCH NOTIFICATIONS FROM DATABASE ---
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/notification-list');
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [statsRes, itemsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/weekly-stats'),
        axios.get('http://localhost:5000/api/auth/item-list')
      ]);

      if (statsRes.data && Array.isArray(statsRes.data)) {
        setChartData(statsRes.data);
      }

      // Filter for items lower than 10 units
      const alerts = itemsRes.data.filter(item => item.stock_quantity < 10);
      setLowStockItems(alerts);

      // Also refresh notifications when stats refresh
      fetchNotifications();

    } catch (err) {
      console.error("Dashboard Sync Error:", err.message);
    }
  };

  useEffect(() => {
    // Initial fetches
    fetchNotifications();
    fetchDashboardStats();
    
    // Auto-sync every 30 seconds
    const interval = setInterval(() => {
        fetchDashboardStats();
        fetchNotifications();
    }, 30000);

    // Keep your localStorage check as a backup if needed, but the API will overwrite it
    const savedNotes = localStorage.getItem('systemNotifications');
    if (savedNotes && announcements.length === 0) setAnnouncements(JSON.parse(savedNotes));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="logo-section">IVMS LOGO</div>
        <h1 className="system-title">Inventory Management System</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-grid">
        {/* LEFT COLUMN: Main Weekly Sales Trend */}
        <div className="main-chart-section">
          <div className="chart-container">
            <h3 className="chart-header">Weekly Sales Trend (Rolling 7 Days)</h3>
            <div className="chart-box">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `฿${v}`} tick={{fontSize: 10}} />
                    <Tooltip formatter={(v) => [`฿${v}`, 'Revenue']} />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#colorSales)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="loading-center">Syncing Live Data...</div>}
            </div>
          </div>

          <div className="action-button-grid">
            <button className="nav-btn checkout" onClick={onCheckOutClick}>Check Out</button>
            <button className="nav-btn" onClick={onItemsClick}>Items</button>
            <button className="nav-btn" onClick={onStockClick}>Stock</button>
            <button className="nav-btn" onClick={onSupplierClick}>Supplier</button>
            <button className="nav-btn" onClick={onAdminClick}>Admin</button>
            <button className="nav-btn" onClick={onScheduleClick}>Schedule</button>
            <button className="nav-btn" onClick={onReportClick}>Report</button>
          </div>
        </div>

        {/* RIGHT COLUMN: Small Boxes for Notifications & Alerts */}
        <div className="side-alert-section">
          <div className="small-alert-card">
            <h4 className="card-title">Admin Notifications</h4>
            <div className="alert-content-list">
              {announcements.length > 0 ? (
                announcements.slice(0, 2).map(note => (
                  /* FIXED: Using notif_id from database */
                  <div key={note.notif_id || note.id} className="alert-item">🔔 {note.message}</div>
                ))
              ) : <div className="empty-alert">No new updates.</div>}
            </div>
            <button className="mini-manage-btn" onClick={onAdminClick}>Manage</button>
          </div>

          <div className="small-alert-card">
            <h4 className="card-title">Inventory Alerts (&lt; 10)</h4>
            <div className="alert-content-list">
              {lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="alert-item stock">
                    {item.stock_quantity === 0 ? '❌' : '⚠️'} {item.item_name} ({item.stock_quantity})
                  </div>
                ))
              ) : <div className="empty-alert">All items well-stocked ✅</div>}
            </div>
            <button className="mini-manage-btn" onClick={onStockClick}>Restock Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
