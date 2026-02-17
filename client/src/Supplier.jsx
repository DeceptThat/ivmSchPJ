import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminGateKeeper from './AdminGateKeeper';
import './Supplier.css';

function Supplier({ onBack }) {
  const [suppliers, setSuppliers] = useState([]);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateAction, setGateAction] = useState(null); 
  const [targetId, setTargetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newSup, setNewSup] = useState({ name: '', email: '', phone: '' });

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/supplier-list');
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleAdminConfirmed = (adminUser) => {
    setIsGateOpen(false);
    if (gateAction === 'add') {
      submitNewSupplier();
    } else if (gateAction === 'delete') {
      executeDelete(targetId);
    }
  };

  const submitNewSupplier = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/add-supplier', {
        supplier_name: newSup.name,
        email: newSup.email,
        phone: newSup.phone
      });
      fetchSuppliers();
      setNewSup({ name: '', email: '', phone: '' });
      alert("Supplier Added!");
    } catch (err) { alert("Error adding supplier"); }
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/remove-supplier/${id}`);
      fetchSuppliers();
    } catch (err) { alert("Delete failed"); }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="supplier-page">
      <aside className="supplier-sidebar">
        <div className="sidebar-upper-stack">
          <div className="add-supplier-container">
            <h3>Add New Supplier</h3>
            <div className="modal-form-stack">
                <input placeholder="Name" className="modal-pill" value={newSup.name} onChange={e => setNewSup({...newSup, name: e.target.value})} />
                <input placeholder="Email" className="modal-pill" value={newSup.email} onChange={e => setNewSup({...newSup, email: e.target.value})} />
                <input placeholder="Phone" className="modal-pill" value={newSup.phone} onChange={e => setNewSup({...newSup, phone: e.target.value})} />
                <button className="side-action-btn primary" onClick={() => { setGateAction('add'); setIsGateOpen(true); }}>Save Supplier</button>
            </div>
          </div>

          <div className="search-box-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search Name..." 
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

      <main className="supplier-main-content">
        <div className="table-title-area">
          <h2 className="page-main-title">Supplier Management List</h2>
        </div>

        <div className="supplier-table-scroll-box">
          <table className="supplier-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(s => (
                <tr key={s.supplier_id}>
                  <td>{s.supplier_id}</td>
                  <td className="name-cell">{s.supplier_name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>
                    <button className="item-remove-btn" onClick={() => { 
                      setTargetId(s.supplier_id); 
                      setGateAction('delete'); 
                      setIsGateOpen(true); 
                    }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <AdminGateKeeper 
        isOpen={isGateOpen} 
        onClose={() => setIsGateOpen(false)} 
        onConfirm={handleAdminConfirmed} 
      />
    </div>
  );
}

export default Supplier;