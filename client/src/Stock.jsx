import { useState, useEffect } from 'react';
import './Stock.css';

function Stock({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null); 
  const [stockData, setStockData] = useState(() => {
    const saved = localStorage.getItem('inventoryStock');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ refNo: '', itemID: '', diffQty: '', supplier: '', expDate: '' });

  useEffect(() => {
    localStorage.setItem('inventoryStock', JSON.stringify(stockData));
  }, [stockData]);

  const handleTransaction = () => {
    const enteredID = form.itemID.toString().trim().toUpperCase();
    const diff = parseInt(form.diffQty) || 0;
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData') || "[]");
    const masterItem = inventoryData.find(i => i.id.toString().trim().toUpperCase() === enteredID);

    if (!masterItem) {
      alert(`Error: Item ID "${enteredID}" not found in Master Items!`);
      return;
    }

    const lastEntry = stockData.find(s => s.itemID === enteredID);
    const previousBalance = lastEntry ? lastEntry.currentStock : 0;
    const newBalance = modalType === 'OUT' ? previousBalance - diff : previousBalance + diff;

    const newEntry = { 
      ...form, itemID: enteredID, itemName: masterItem.name, 
      type: modalType, diffQty: diff, currentStock: newBalance,
      transDate: new Date().toISOString().split('T')[0] 
    };

    setStockData([newEntry, ...stockData]);
    setModalType(null);
    setForm({ refNo: '', itemID: '', diffQty: '', supplier: '', expDate: '' });
  };

  return (
    <div className="stk-wrapper">
      <div className="stk-dark-header">Stock Management</div>
      <div className="stk-body">
        <div className="stk-search-bar">
          <div className="stk-search-pill">
            <span>🔍</span>
            <input 
              placeholder="Search ID / Name / Ref No" 
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
                </tr>
              </thead>
              <tbody>
                {stockData.filter(s => 
                  // Expanded Search Logic
                  s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.itemID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (s.refNo && s.refNo.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((item, index) => (
                  <tr key={index}>
                    <td>{item.refNo}</td><td>{item.itemID}</td><td>{item.itemName}</td>
                    <td className={item.type === 'OUT' ? 'stk-text-out' : 'stk-text-in'}>{item.type}</td>
                    <td className="stk-bold">{item.type === 'OUT' ? `-${item.diffQty}` : `+${item.diffQty}`}</td>
                    <td>{item.transDate}</td><td>{item.expDate || '-'}</td>
                    <td className="stk-current-stock">{item.currentStock}</td>
                  </tr>
                ))}
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
            <div className="stk-field"><label>Ref No</label><input onChange={e => setForm({...form, refNo: e.target.value})}/></div>
            <div className="stk-field"><label>Item ID</label><input placeholder="e.g. 001" onChange={e => setForm({...form, itemID: e.target.value})}/></div>
            <div className="stk-field"><label>Difference</label><input type="number" onChange={e => setForm({...form, diffQty: e.target.value})}/></div>
            {modalType === 'IN' && <div className="stk-field"><label>Exp Date</label><input type="date" onChange={e => setForm({...form, expDate: e.target.value})}/></div>}
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