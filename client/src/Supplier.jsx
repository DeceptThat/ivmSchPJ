import { useState, useEffect } from 'react';
import './Supplier.css';

function Supplier({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('supplierData');
    return saved ? JSON.parse(saved) : [
      { id: 1, supplierID: 'S001', name: 'ABC Stationery Co.', contact: '081-234-5678', address: '132, Bangkok', itemIDs: '001, 002' }
    ];
  });

  const [form, setForm] = useState({ name: '', supplierID: '', contact: '', address: '', itemIDs: '' });

  useEffect(() => {
    localStorage.setItem('supplierData', JSON.stringify(suppliers));
  }, [suppliers]);

  const handleOpenAdd = () => {
    const pass = prompt("Admin Password Required:");
    if (pass === 'Admin123') {
      setEditingId(null); 
      setForm({ name: '', supplierID: '', contact: '', address: '', itemIDs: '' });
      setShowModal(true);
    } else {
      alert("Access Denied");
    }
  };

 
  const handleEdit = (supplier) => {
    const pass = prompt("Admin Password Required:");
    if (pass === 'Admin') {
      setEditingId(supplier.id);
      setForm({ 
        name: supplier.name, 
        supplierID: supplier.supplierID, 
        contact: supplier.contact, 
        address: supplier.address, 
        itemIDs: supplier.itemIDs 
      });
      setShowModal(true);
    } else {
      alert("Access Denied");
    }
  };

  const handleSave = () => {
    if (!form.name || !form.supplierID) return alert("Please fill Name and ID");
    
    if (editingId) {
      
      setSuppliers(suppliers.map(s => s.id === editingId ? { ...form, id: editingId } : s));
    } else {
      
      setSuppliers([...suppliers, { ...form, id: Date.now() }]);
    }
    
    setShowModal(false);
    setEditingId(null);
  };

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.supplierID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sup-main-wrapper">
      <header className="sup-top-header"><h1>Suppliers Management</h1></header>

      <div className="sup-page-content">
        <div className="sup-nav-row">
          <div className="sup-search-pill">
            <span className="sup-search-icon">🔍</span>
            <input type="text" placeholder="Search Supplier Name/ID" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="sup-btn-add" onClick={handleOpenAdd}>Add Supplier</button>
        </div>

        <div className="sup-table-container">
          <table className="sup-styled-table">
            <thead>
              <tr><th>ID</th><th>Supplier Name</th><th>Contact</th><th>Address</th><th>Item IDs</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.supplierID}</td>
                  <td className="sup-name-bold">{s.name}</td>
                  <td>{s.contact}</td>
                  <td>{s.address}</td>
                  <td>{s.itemIDs}</td>
                  <td className="sup-action-cell">
                    {}
                    <button className="sup-icon-btn" onClick={() => handleEdit(s)}>✏️</button>
                    <button className="sup-icon-btn" onClick={() => setSuppliers(suppliers.filter(x => x.id !== s.id))}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="sup-btn-return-full" onClick={onBack}>Return</button>
      </div>

      {showModal && (
        <div className="sup-modal-overlay">
          <div className="sup-modal-box">
            <div className="sup-modal-header">{editingId ? 'Edit Supplier' : 'Add Suppliers'}</div>
            <div className="sup-modal-body">
              <div className="sup-form-group">
                <label>Supplier Name</label>
                <input className="sup-pill-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="sup-form-group">
                <label>Supplier ID</label>
                <input className="sup-pill-input" value={form.supplierID} onChange={e => setForm({...form, supplierID: e.target.value})} />
              </div>
              <div className="sup-form-group">
                <label>Contact</label>
                <input className="sup-pill-input" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
              </div>
              <div className="sup-form-group">
                <label>Address</label>
                <input className="sup-pill-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div className="sup-form-group">
                <label>Item IDs (e.g. 001, 002)</label>
                <input className="sup-pill-input" value={form.itemIDs} onChange={e => setForm({...form, itemIDs: e.target.value})} />
              </div>
              <button className="sup-modal-submit" onClick={handleSave}>
                {editingId ? 'Update Supplier' : 'Add Supplier'}
              </button>
              <button className="sup-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Supplier;