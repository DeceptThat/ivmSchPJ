import { useState, useEffect } from 'react';
import './Items.css';

function Items({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // --- DATA STATE (Persistent) ---
  const [itemsList, setItemsList] = useState(() => {
    const saved = localStorage.getItem('inventoryData');
    return saved ? JSON.parse(saved) : [
      { id: '001', name: 'Apple', cat: 'Food', sub: 'Fruit', price: '20THB' },
      { id: '002', name: 'Banana', cat: 'Food', sub: 'Fruit', price: '12THB' },
      { id: '003', name: 'Orange', cat: 'Food', sub: 'Fruit', price: '18THB' }
    ];
  });

  const [newItem, setNewItem] = useState({ id: '', name: '', cat: '', sub: '', price: '' });
  const [removeId, setRemoveId] = useState('');

  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(itemsList));
  }, [itemsList]);

  // --- SEARCH LOGIC ---
  // This filters based on ID or Name
  const filteredItems = itemsList.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) || 
      item.id.includes(search)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (newItem.id && newItem.name) {
      setItemsList([...itemsList, newItem]);
      setShowAddModal(false);
      setNewItem({ id: '', name: '', cat: '', sub: '', price: '' });
    }
  };

  const removeItem = () => {
    setItemsList(itemsList.filter(item => item.id !== removeId));
    setShowRemoveModal(false);
    setRemoveId('');
  };

  return (
    <div className="items-page">
      <header className="items-header">
        <h2 className="items-title">Items List</h2>
      </header>

      <div className="items-container">
        <aside className="items-sidebar">
          <button className="item-action-btn" onClick={() => setShowAddModal(true)}>Add new Item</button>
          <button className="item-action-btn" onClick={() => setShowRemoveModal(true)}>Remove Item</button>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search Name or ID..." 
                className="search-bar" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* The button is now decorative as the search is automatic */}
            <button className="search-confirm-btn">Search</button>
          </div>
          <button className="item-action-btn return-btn" onClick={onBack}>Return</button>
        </aside>

        <main className="items-main">
          <div className="items-table-wrapper">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item Id</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>per unit price</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.cat}</td>
                      <td>{item.sub}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No matching items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modals remain the same as previous functional version */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="item-modal">
            <div className="modal-header-dark">
              <span className="modal-title-text">Add New Item</span>
              <button className="close-x" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body-blue">
              <div className="item-form-row"><label>Item ID</label><input name="id" className="item-input" onChange={handleInputChange}/></div>
              <div className="item-form-row"><label>Name</label><input name="name" className="item-input" onChange={handleInputChange}/></div>
              <div className="item-form-row"><label>Category</label><input name="cat" className="item-input" onChange={handleInputChange}/></div>
              <div className="item-form-row"><label>Sub-Category</label><input name="sub" className="item-input" onChange={handleInputChange}/></div>
              <div className="item-form-row"><label>Price Per Unit</label><input name="price" className="item-input" onChange={handleInputChange}/></div>
              <button className="add-item-confirm" onClick={addItem}>Add New Item</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="item-modal remove-modal">
            <div className="modal-header-dark">
              <span className="modal-title-text">Remove Item</span>
              <button className="close-x" onClick={() => setShowRemoveModal(false)}>×</button>
            </div>
            <div className="modal-body-blue">
              <div className="item-form-row">
                <label>Enter Item ID</label>
                <input className="item-input" onChange={(e) => setRemoveId(e.target.value)} />
              </div>
              <button className="add-item-confirm remove-btn-style" onClick={removeItem}>Remove Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Items;