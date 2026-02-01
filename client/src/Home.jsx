import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './Home.css';

const dummyData = [
  { day: 'Mon', sales: 400 }, { day: 'Tue', sales: 300 },
  { day: 'Wed', sales: 500 }, { day: 'Thu', sales: 200 },
  { day: 'Fri', sales: 700 }, { day: 'Sat', sales: 600 },
  { day: 'Sun', sales: 900 },
];

function Home({ 
  onLogout, onAdminClick, onReportClick, onItemsClick, 
  onStockClick, onScheduleClick, onSupplierClick, onCheckOutClick 
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // 1. Pull Admin Notifications
    const savedNotes = localStorage.getItem('systemNotifications');
    if (savedNotes) setAnnouncements(JSON.parse(savedNotes));

    // 2. Real-time Out of Stock Check
    // We look at the Stock Ledger to find the latest 'currentStock' for each item
    const stockHistory = JSON.parse(localStorage.getItem('inventoryStock') || "[]");
    
    // Get unique items and their most recent stock level
    const latestStockMap = {};
    stockHistory.forEach(entry => {
      if (!latestStockMap[entry.itemID]) {
        latestStockMap[entry.itemID] = entry;
      }
    });

    const outOfStock = Object.values(latestStockMap).filter(item => item.currentStock <= 0);
    setLowStockItems(outOfStock);
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
           <div className="logo-placeholder">IVMS LOGO</div>
           <h1>Inventory Management System</h1>
           <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-main">
        <div className="left-column">
          <div className="upper-stack">
            <div className="chart-box-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="button-row">
            {['Check Out', 'Items', 'Stock', 'Supplier', 'Admin', 'Schedule', 'Report'].map((name) => (
              <button 
                key={name} 
                className={`btn-action ${name === 'Check Out' ? 'checkout' : ''}`}
                onClick={() => {
                  if (name === 'Check Out') onCheckOutClick();
                  else if (name === 'Admin') onAdminClick();
                  else if (name === 'Report') onReportClick();
                  else if (name === 'Items') onItemsClick();
                  else if (name === 'Stock') onStockClick();
                  else if (name === 'Schedule') onScheduleClick();
                  else if (name === 'Supplier') onSupplierClick();
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="right-column">
          {/* DYNAMIC NOTIFICATIONS FROM ADMIN */}
          <div className="info-card">
            <h3>Admin Notifications</h3>
            {announcements.length > 0 ? (
              announcements.slice(0, 2).map(note => (
                <div key={note.id} className={`card-item note-${note.type.toLowerCase()}`}>
                  {note.type === 'Urgent' ? '🚨 ' : '🔔 '} {note.message}
                </div>
              ))
            ) : (
              <div className="card-item">No new updates.</div>
            )}
            <button className="view-more" onClick={onAdminClick}>Manage</button>
          </div>

          {/* DYNAMIC OUT OF STOCK CHECK */}
          <div className="info-card">
            <h3>Out of Stock</h3>
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className="card-item stock-alert">
                  ⚠️ {item.itemName} ({item.currentStock})
                </div>
              ))
            ) : (
              <div className="card-item all-clear">✅ All items in stock</div>
            )}
            <button className="view-more" onClick={onStockClick}>Restock Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;