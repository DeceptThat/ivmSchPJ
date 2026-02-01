import { useState, useEffect } from 'react';
import './Stock.css';

function Stock({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null); 
  
  // --- 1. SAFE DATA LOADING ---
  const [stockData, setStockData] = useState(() => {
    try {
      const saved = localStorage.getItem('inventoryStock');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse stock data:", e);
      return [];
    }
  });

  const [form, setForm] = useState({ refNo: '', itemID: '', diffQty: '', supplier: '', expDate: '' });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('inventoryStock', JSON.stringify(stockData));
  }, [stockData]);

  // --- 2. REMOVE INDIVIDUAL ENTRY ---
  const removeEntry = (indexToRemove) => {
    if (window.confirm("Are you sure you want to remove this specific entry? This will help clean up data errors.")) {
      // Filter the array by index to remove only the clicked row
      const updatedData = stockData.filter((_, index) => index !== indexToRemove);
      setStockData(updatedData);
    }
  };

  // --- 3. TRANSACTION LOGIC ---
  const handleTransaction = () => {
    const enteredID = form.itemID?.toString().trim().toUpperCase();
    const diff = parseInt(form.diffQty) || 0; // Force to number
    
    let inventoryData = [];
    try {
      inventoryData = JSON.parse(localStorage.getItem('inventoryData') || "[]");
    } catch (e) { inventoryData = []; }

    const masterItem = inventoryData.find(i => i.id?.toString().trim().toUpperCase() === enteredID);

    if (!masterItem) {
      alert(`Error: Item ID "${enteredID}" not found in Master Items!`);
      return;
    }

    // Get the latest balance from the top of the list
    const lastEntry = stockData[0]; 
    const previousBalance = Number(lastEntry?.currentStock) || 0; 
    const newBalance = modalType === 'OUT' ? previousBalance - diff : previousBalance + diff;

    const newEntry = { 
      refNo: form.refNo || "N/A",
      itemID: enteredID, 
      itemName: masterItem.name || "Unknown Item", 
      type: modalType, 
      diffQty: diff, 
      currentStock: newBalance,
      transDate: new Date().toISOString().split('T')[0],
      expDate: form.expDate || "-"
    };

    setStockData([newEntry, ...stockData]);
    setModalType(null);
    setForm({ refNo: '', itemID: '', diffQty: '', supplier: '', expDate: '' });
  };

  // --- 4. SAFE FILTERING ---
  const filteredRows = Array.isArray(stockData) ? stockData.filter(s => {
    const search = searchTerm.toLowerCase();
    return (
      (s.itemName?.toLowerCase().includes(search)) ||
      (s.itemID?.toLowerCase().includes(search)) ||
      (s.refNo?.toString().toLowerCase().includes(search))
    );
  }) : [];

  return (
    <div className="stk-wrapper">
      <div className="stk-dark-header">Stock Management</div>
      <div className="stk-body">
        <div className="stk-search-bar">
          <div className="stk-search-pill">
            <span>🔍</span>
            <input 
              placeholder="Search ID / Name / Ref No" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="stk-grid">
          <div className="stk-table-container">
            <table className="stk-table">
              <thead>
                <tr>
                  <th>Ref No.</th><th>Item ID</th><th>Item Name</th><th>Type</th>
                  <th>Difference</th><th>Date</th><th>Exp Date</th><th>Current Stock</th>
                  <th>Action</th> {/* New Column Header */}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length > 0 ? (
                  filteredRows.map((item, index) => (
                    <tr key={index}>
                      <td>{item.refNo}</td><td>{item.itemID}</td><td>{item.itemName}</td>
                      <td className={item.type === 'OUT' ? 'stk-text-out' : 'stk-text-in'}>{item.type}</td>
                      <td className="stk-bold">{item.type === 'OUT' ? `-${item.diffQty}` : `+${item.diffQty}`}</td>
                      <td>{item.transDate}</td><td>{item.expDate || '-'}</td>
                      <td className="stk-current-stock" style={{fontWeight: 'bold'}}>
                         {/* Display 0 if value is NaN */}
                        {isNaN(item.currentStock) ? "0" : item.currentStock}
                      </td>
                      <td>
                        <button 
                          className="stk-remove-btn"
                          onClick={() => removeEntry(index)}
                          style={{
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="stk-side-actions">
            <button className="stk-action-btn stk-btn-in" onClick={() => setModalType('IN')}>Stock in</button>
            <button className="stk-action-btn stk-btn-out" onClick={() => setModalType('OUT')}>Stock out</button>
            <button className="stk-return-pill" onClick={onBack}>Return</button>
          </div>
        </div>
      </div>

      {modalType && (
        <div className="stk-modal-overlay">
          <div className="stk-modal-box">
            <h3 className="stk-modal-title">Stock {modalType}</h3>
            <div className="stk-field"><label>Ref No</label>
              <input value={form.refNo} onChange={e => setForm({...form, refNo: e.target.value})}/>
            </div>
            <div className="stk-field"><label>Item ID</label>
              <input value={form.itemID} placeholder="e.g. 001" onChange={e => setForm({...form, itemID: e.target.value})}/>
            </div>
            <div className="stk-field"><label>Difference</label>
              <input type="number" value={form.diffQty} onChange={e => setForm({...form, diffQty: e.target.value})}/>
            </div>
            {modalType === 'IN' && (
              <div className="stk-field"><label>Exp Date</label>
                <input type="date" value={form.expDate} onChange={e => setForm({...form, expDate: e.target.value})}/>
              </div>
            )}
            <div className="stk-modal-footer">
              <button className="stk-confirm-btn" onClick={handleTransaction}>Confirm</button>
              <button className="stk-cancel-link" onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;