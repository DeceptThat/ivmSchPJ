import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Items.css';

function Items({ onBack }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/item-list');
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/remove-item/${id}`);
      fetchItems();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const filteredItems = items.filter(i => 
    i.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="items-page">
      <aside className="items-sidebar">
        <div className="sidebar-upper-stack">
          <button className="side-action-btn primary">Add New Item</button>
          
          <div className="search-box-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search Name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar-search-input"
            />
          </div>

          {/* This button is now locked in the top stack */}
          <button className="side-action-btn return-btn" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </aside>

      <main className="items-main-content">
        <div className="table-title-area">
          <h2 className="page-main-title">Item Inventory List</h2>
        </div>

        <div className="items-table-scroll-box">
          <table className="items-data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Last Supplier</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.item_id}>
                  <td className="sku-cell">{item.sku}</td>
                  <td className="name-cell">{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.sub_category}</td>
                  <td>{parseFloat(item.price).toFixed(2)} THB</td>
                  <td className={`stock-cell ${item.stock_quantity < 10 ? 'low' : ''}`}>
                    {item.stock_quantity}
                  </td>
                  <td className="supplier-cell">{item.last_supplier || 'No History'}</td>
                  <td>
                    <button className="item-remove-btn" onClick={() => handleRemove(item.item_id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Items;