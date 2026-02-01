import React, { useState } from 'react';
import './Sale.css';

function Sale({ onBack }) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const handleAddItem = () => {
    const enteredID = barcodeInput.trim().toUpperCase();
    const inventory = JSON.parse(localStorage.getItem('inventoryData') || "[]");
    const item = inventory.find(i => (i.id || "").toString().trim().toUpperCase() === enteredID);

    if (item) {
      const newItem = {
        barcode: item.id,
        name: item.name,
        code: item.id,
        qty: 1,
        unitPrice: parseFloat(item.price) || 0,
        total: parseFloat(item.price) || 0
      };
      setCartItems([...cartItems, newItem]);
      setBarcodeInput('');
    } else {
      alert("Item not found in Inventory!");
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="sale-wrapper">
      <header className="sale-dark-header"><h2 className="sale-title-italic">Sale Management</h2></header>
      <div className="sale-main-content">
        <div className="sale-layout-grid">
          <div className="sale-left-panel">
            <div className="sale-table-container">
              <table className="sale-data-table">
                <thead><tr><th>Barcode</th><th>Item Name</th><th>Item Code</th><th>Quantity</th><th>Price</th></tr></thead>
                <tbody>
                  {cartItems.map((item, i) => (
                    <tr key={i}><td>{item.barcode}</td><td>{item.name}</td><td>{item.code}</td><td>{item.qty}</td><td>{item.total} THB</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sale-total-box">
              <span className="sale-total-text">Total : <span className="sale-green-val">{totalAmount}</span> THB</span>
            </div>
          </div>
          <div className="sale-right-panel">
            <div className="sale-scanner-box">
              <div className="sale-input-row">
                <label className="sale-label-italic">Item Bar Code:</label>
                <input value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} className="sale-barcode-input" />
                <button className="sale-green-btn-sm" onClick={handleAddItem}>Enter</button>
              </div>
            </div>
            <button className="sale-complete-btn" onClick={() => alert("Sale Completed!")}>Complete Sale</button>
          </div>
        </div>
        <button className="sale-return-pill" onClick={onBack}>Return</button>
      </div>
    </div>
  );
}

export default Sale;