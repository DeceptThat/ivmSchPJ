import React, { useState } from 'react';
import axios from 'axios';
import './Sale.css';

function Sale({ onBack, user }) {
  const [searchInput, setSearchInput] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // 1. Fetch Item from Backend by Name or SKU
  const handleAddItem = async () => {
    const query = searchInput.trim();
    if (!query) return;

    try {
      // Using your new flexible search endpoint
      const res = await axios.get(`http://localhost:5000/api/auth/find-item?query=${query}`);
      const item = res.data;

      const existingItem = cartItems.find(i => i.sku === item.sku);
      
      if (existingItem) {
        // If already in cart, just increase quantity
        const updatedCart = cartItems.map(i => 
          i.sku === item.sku 
            ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * parseFloat(i.unitPrice) } 
            : i
        );
        setCartItems(updatedCart);
      } else {
        // Add new row to table
        const newItem = {
          cartId: Date.now(),
          sku: item.sku,
          name: item.item_name,
          code: item.category || 'N/A', // Using category as the "Item Code" display
          qty: 1,
          unitPrice: parseFloat(item.price) || 0,
          total: parseFloat(item.price) || 0
        };
        setCartItems([...cartItems, newItem]);
      }
      setSearchInput('');
    } catch (err) {
      alert("Item not found! Please check the SKU or Name.");
    }
  };

  const removeItem = (idToRemove) => {
    setCartItems(cartItems.filter(item => item.cartId !== idToRemove));
  };

  // 2. Complete Sale and Update Database Stock
  const handleCompleteSale = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");

    const activeStaffId = (user && typeof user.staff_id !== 'undefined') ? user.staff_id : 0;

    try {
      await axios.post('http://localhost:5000/api/auth/complete-sale', {
        staff_id: activeStaffId,
        items: cartItems.map(i => ({ sku: i.sku, quantity: i.qty, item_name: i.name })),
        total_amount: totalAmount
      });

      alert("Sale Completed Successfully! Stock updated.");
      setCartItems([]);
      setSearchInput('');
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to process sale. Check stock."));
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="sale-wrapper">
      <header className="sale-dark-header">
        <h2 className="sale-title-italic">Sale Management</h2>
      </header>
      <div className="sale-main-content">
        <div className="sale-layout-grid">
          
          {/* LEFT PANEL: THE TABLE */}
          <div className="sale-left-panel">
            <div className="sale-table-container">
              <table className="sale-data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.cartId}>
                      <td>{item.sku}</td>
                      <td>{item.name}</td>
                      <td>{item.code}</td>
                      <td>{item.qty}</td>
                      <td>{item.total.toLocaleString()} THB</td>
                      <td>
                        <button 
                          className="sale-remove-btn"
                          onClick={() => removeItem(item.cartId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sale-total-box">
              <span className="sale-total-text">
                Total : <span className="sale-green-val">{totalAmount.toLocaleString()}</span> THB
              </span>
            </div>
          </div>

          {/* RIGHT PANEL: INPUTS */}
          <div className="sale-right-panel">
            <div className="sale-scanner-box">
              <div className="sale-input-row">
                <label className="sale-label-italic">Item SKU or Name:</label>
                <input 
                  value={searchInput} 
                  onChange={(e) => setSearchInput(e.target.value)} 
                  className="sale-barcode-input" 
                  placeholder="Enter Name or SKU..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button className="sale-green-btn-sm" onClick={handleAddItem}>Enter</button>
              </div>
            </div>
            <button className="sale-complete-btn" onClick={handleCompleteSale}>
              Complete Sale
            </button>
          </div>
        </div>
        <button className="sale-return-pill" onClick={onBack}>Return</button>
      </div>
    </div>
  );
}

export default Sale;