import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Items.css';

function Items({ onBack }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ADDED: State for Modal and Form ---
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: '',
    item_name: '',
    category: '',
    sub_category: '',
    price: '',
    stock_quantity: 0
  });

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

  // --- ADDED: Handle Add Logic ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/add-item', newItem);
      setShowModal(false); // Close modal
      fetchItems(); // Refresh list
      setNewItem({ sku: '', item_name: '', category: '', sub_category: '', price: '', stock_quantity: 0 });
    } catch (err) {
      alert("Error adding item. Ensure SKU is unique.");
    }
  };

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
          {/* --- FIXED: Added onClick to open Modal --- */}
          <button className="side-action-btn primary" onClick={() => setShowModal(true)}>
            Add New Item
          </button>
          
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

          <button className="side-action-btn return-btn" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </aside>

      <main className="items-main-content">
        <div className="table-title-area">
          <h2 className="page-main-title">Item Inventory List</h2>
        </div>

        {/* --- ADDED: Add Item Modal Form --- */}
        {showModal && (
          <div className="modal-overlay">
            <div className="item-modal">
              <h3>Register New Item</h3>
              <form onSubmit={handleAddSubmit}>
                <input type="text" placeholder="SKU" required value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} />
                <input type="text" placeholder="Item Name" required value={newItem.item_name} onChange={(e) => setNewItem({...newItem, item_name: e.target.value})} />
                <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} />
                <input type="text" placeholder="Sub-Category (e.g., Fruit)" value={newItem.sub_category} onChange={(e) => setNewItem({...newItem, sub_category: e.target.value})} />
                <input type="number" placeholder="Price" required value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} />
                <div className="modal-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

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