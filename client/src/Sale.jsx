import React, { useState } from 'react';
import './Sale.css';

function Sale({ onBack }) {
  const [cartItems] = useState([
    { barcode: '0001', name: 'Apple', code: 'ST-0001', qty: 2, unitPrice: 12, total: 24 },
    { barcode: '0002', name: 'Aero Pen', code: 'LT-0001', qty: 1, unitPrice: 6, total: 6 },
  ]);

  return (
    <div className="sale-wrapper">
      <header className="sale-dark-header">
        <h2 className="sale-title-italic">Sale Management</h2>
      </header>

      <div className="sale-main-content">
        <div className="sale-layout-grid">
          <div className="sale-left-panel">
            <div className="sale-table-container">
              <table className="sale-data-table">
                <thead>
                  <tr>
                    <th>Barcode</th><th>Item Name</th><th>Item Code</th><th>Quantity</th><th>Price per unit</th><th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.barcode}</td><td>{item.name}</td><td>{item.code}</td><td>{item.qty}</td><td>{item.unitPrice}</td><td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sale-total-box">
              <span className="sale-total-text">Total : <span className="sale-green-val">30</span> THB</span>
            </div>
          </div>

          <div className="sale-right-panel">
            <div className="sale-scanner-box">
              <div className="sale-input-row">
                <label className="sale-label-italic">Item Bar Code:</label>
                <input type="text" className="sale-barcode-input" />
                <div className="sale-action-btns">
                  <button className="sale-green-btn-sm">Enter</button>
                  <button className="sale-green-btn-sm">Scan</button>
                </div>
              </div>
              <div className="sale-preview-card">
                <div className="sale-item-image-box">🖊️</div>
                <div className="sale-item-details">
                  <p><em>Item Name:</em> <span>Aero Pen</span></p>
                  <p><em>Item Code:</em> <span>ST001</span></p>
                  <p><em>Item Price:</em> <span>6 THB</span></p>
                </div>
              </div>
            </div>
            <button className="sale-complete-btn">Complete Sale</button>
          </div>
        </div>
        <button className="sale-return-pill" onClick={onBack}>Return</button>
      </div>
    </div>
  );
}

export default Sale;