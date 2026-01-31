import { useState, useEffect } from 'react';
import './Stock.css';

function Stock({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null); // 'IN', 'OUT', or null
  
  const [masterItems, setMasterItems] = useState(() => {
    const saved = localStorage.getItem('itemsData');
    return saved ? JSON.parse(saved) : [];
  });

  const [stockData, setStockData] = useState(() => {
    const saved = localStorage.getItem('inventoryStock');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ refNo: '', itemID: '', name: '', qty: '', supplier: '', expDate: '' });

  useEffect(() => {
    localStorage.setItem('inventoryStock', JSON.stringify(stockData));
    localStorage.setItem('itemsData', JSON.stringify(masterItems));
  }, [stockData, masterItems]);

  const handleTransaction = () => {
    const changeQty = parseInt(form.qty) || 0;
    const enteredID = form.itemID.trim().toUpperCase();

    // Update Master Catalog Total
    const itemIndex = masterItems.findIndex(i => i.id.toUpperCase() === enteredID);
    let currentBalance = 0;

    if (itemIndex !== -1) {
      const updatedMaster = [...masterItems];
      const oldQty = parseInt(updatedMaster[itemIndex].quantity) || 0;
      // Subtract if Stock Out, Add if Stock In
      currentBalance = modalType === 'OUT' ? oldQty - changeQty : oldQty + changeQty;
      updatedMaster[itemIndex].quantity = currentBalance;
      setMasterItems(updatedMaster);
    }

    const transactionEntry = { 
      ...form, 
      itemID: enteredID,
      type: modalType, 
      qty: changeQty,
      balanceAfter: currentBalance,
      transDate: new Date().toISOString().split('T')[0] 
    };

    setStockData([transactionEntry, ...stockData]);
    setModalType(null);
    setForm({ refNo: '', itemID: '', name: '', qty: '', supplier: '', expDate: '' });
  };

  return (
    <div className="stk-wrapper">
      <div className="stk-dark-header">Stock Management</div>
      <div className="stk-body">
        <div className="stk-search-bar">
          <div className="stk-search-pill">
            <span>🔍</span>
            <input placeholder="item name / ref no" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="stk-search-btn">Search</button>
        </div>

        <div className="stk-grid">
          <div className="stk-table-container">
            <table className="stk-table">
              <thead>
                <tr>
                  <th>Ref No.</th><th>Item ID</th><th>Item Name</th><th>Type</th><th>Qty</th><th>Date</th><th>Exp Date</th><th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {stockData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => (
                  <tr key={index}>
                    <td>{item.refNo}</td><td>{item.itemID}</td><td>{item.name}</td>
                    <td className={item.type === 'OUT' ? 'stk-text-out' : ''}>{item.type}</td>
                    <td>{item.qty}</td><td>{item.transDate}</td><td>{item.expDate}</td><td>{item.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="stk-side-actions">
            <button className="stk-action-btn" onClick={() => setModalType('IN')}>Stock in</button>
            <button className="stk-action-btn" onClick={() => setModalType('OUT')}>Stock out</button>
            <button className="stk-return-pill" onClick={onBack}>Return</button>
          </div>
        </div>
      </div>

      {/* --- TRANSACTION MODAL (Shared for IN and OUT) --- */}
      {modalType && (
        <div className="stk-modal-overlay">
          <div className="stk-modal-box">
            <h3 className="stk-modal-title">Stock {modalType === 'IN' ? 'In' : 'Out'} - Entry</h3>
            
            <div className="stk-field"><label>Ref No</label><input value={form.refNo} onChange={e => setForm({...form, refNo: e.target.value})}/></div>
            <div className="stk-field"><label>Item ID</label><input value={form.itemID} placeholder="e.g. S001" onChange={e => setForm({...form, itemID: e.target.value})}/></div>
            <div className="stk-field"><label>Item Name</label><input value={form.name} placeholder="Type Name" onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="stk-field"><label>Quantity</label><input type="number" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})}/></div>
            
            {/* Show supplier/exp only for Stock In */}
            {modalType === 'IN' && (
              <>
                <div className="stk-field"><label>Supplier</label><input value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})}/></div>
                <div className="stk-field"><label>Exp Date</label><input type="date" onChange={e => setForm({...form, expDate: e.target.value})}/></div>
              </>
            )}
            
            <div className="stk-modal-footer">
              <button className="stk-confirm-btn" onClick={handleTransaction}>Confirm Stock {modalType === 'IN' ? 'In' : 'Out'}</button>
              <button className="stk-cancel-link" onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;