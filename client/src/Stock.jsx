import { useState, useEffect } from 'react';
import axios from 'axios';
import './Stock.css';

function Stock({ onBack, user: propUser }) {
  const [user] = useState(() => {
    if (propUser && propUser.staff_id) return propUser;
    const saved = localStorage.getItem('user');
    if (saved && saved !== "undefined" && saved !== "null") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); 
  const [stockData, setStockData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({ 
    refNo: '', 
    itemID: '', 
    diffQty: '', 
    expDate: '', 
    type: '',
    supplier: '' 
  });

  const fetchMovements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/movement-list');
      setStockData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/supplier-list');
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Supplier fetch error:", err);
    }
  };

  useEffect(() => { 
    fetchMovements(); 
    fetchSuppliers();
  }, []);

  const selectType = (selectedType) => {
    setForm({ ...form, type: selectedType });
    setModalStep(2);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep(1);
    setForm({ refNo: '', itemID: '', diffQty: '', expDate: '', type: '', supplier: '' });
  };

  const handleTransaction = async () => {
    const activeId = (user && typeof user.staff_id !== 'undefined') ? user.staff_id : user?.id;
    if (!activeId) return alert("Session Error: Please re-login.");
    if (!form.itemID || !form.diffQty) return alert("SKU and Quantity are required.");
    if (form.type === 'IN' && !form.supplier) return alert("Please select a supplier for Stock IN.");

    try {
      await axios.post('http://localhost:5000/api/auth/add-movement', {
        sku: form.itemID.trim(),
        staff_id: activeId,
        type: form.type,
        quantity: parseInt(form.diffQty),
        expire_date: form.type === 'IN' ? form.expDate : null,
        supplier_name: form.type === 'IN' ? form.supplier : null,
        ref_no: form.refNo || "N/A",
        date: new Date()
      });
      await fetchMovements();
      closeModal();
      alert("Stock updated!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Check SKU"));
    }
  };

  const filteredData = stockData.filter(s => 
    s.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.ref_no && s.ref_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="stock-page">
      <aside className="stock-sidebar">
        <div className="sidebar-upper-stack">
          <button className="side-action-btn primary" onClick={() => setShowModal(true)}>
            + New Entry
          </button>
          
          <div className="search-box-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search SKU or Ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar-search-input"
            />
          </div>

          <button className="side-action-btn return-btn" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </aside>

      <main className="stock-main-content">
        <div className="table-title-area">
          <h2 className="page-main-title">Stock Movement History</h2>
        </div>

        <div className="stock-table-scroll-box">
          <table className="stock-data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Staff</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Supplier</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.movement_id}>
                  <td className="ref-cell">{item.ref_no}</td>
                  <td>{item.Staff?.staff_name || 'System'}</td>
                  <td className="sku-cell">{item.sku}</td>
                  <td className={`type-cell ${item.type.toLowerCase()}`}>
                    {item.type}
                  </td>
                  <td>{item.quantity}</td>
                  <td className="supplier-cell">
                    {item.type === 'IN' ? (item.supplier_name || 'N/A') : '-'}
                  </td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {modalStep === 1 ? (
              <div style={{ textAlign: 'center' }}>
                <h3 className="modal-title">Choose Transaction</h3>
                <div className="modal-type-grid">
                  <button onClick={() => selectType('IN')}>📈 Stock In</button>
                  <button onClick={() => selectType('SOLD')}>💰 Sale</button>
                  <button onClick={() => selectType('DAMAGED')}>⚠️ Damaged</button>
                  <button onClick={() => selectType('EXPIRE')}>📅 Expired</button>
                  <button onClick={() => selectType('FOC')}>🎁 FOC</button>
                </div>
                <button onClick={closeModal} className="modal-btn-cancel text-only">Cancel</button>
              </div>
            ) : (
              <div>
                <h3 className="modal-title">Recording: {form.type}</h3>
                <div className="modal-form-stack">
                  <div className="input-group">
                    <label>Ref #:</label>
                    <input className="modal-pill" value={form.refNo} onChange={e => setForm({...form, refNo: e.target.value})} placeholder="Invoice/Batch" />
                  </div>
                  
                  {form.type === 'IN' && (
                    <div className="input-group">
                      <label>Supplier:</label>
                      <select 
                        className="modal-pill"
                        value={form.supplier} 
                        onChange={e => setForm({...form, supplier: e.target.value})}
                      >
                        <option value="">-- Select --</option>
                        {suppliers.map(sup => (
                          <option key={sup.supplier_id} value={sup.supplier_name}>{sup.supplier_name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="input-group">
                    <label>Item SKU:</label>
                    <input className="modal-pill" value={form.itemID} onChange={e => setForm({...form, itemID: e.target.value})} placeholder="Enter SKU" />
                  </div>
                  
                  <div className="input-group">
                    <label>Quantity:</label>
                    <input className="modal-pill" type="number" value={form.diffQty} onChange={e => setForm({...form, diffQty: e.target.value})} placeholder="0" />
                  </div>
                  
                  {form.type === 'IN' && (
                    <div className="input-group">
                      <label>Expiry Date:</label>
                      <input className="modal-pill" type="date" value={form.expDate} onChange={e => setForm({...form, expDate: e.target.value})} />
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-back" onClick={() => setModalStep(1)}>← Back</button>
                  <div className="footer-right">
                    <button className="modal-btn-cancel" onClick={closeModal}>Cancel</button>
                    <button className="modal-btn-confirm" onClick={handleTransaction}>Confirm</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;