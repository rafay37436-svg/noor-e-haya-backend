import React, { useState } from 'react';
import logoIcon from './assets/logo-icon.png';

export default function AdminDashboard() {
  // Local list of items for management
  const [items, setItems] = useState([
    { id: 1, name: "Premium Velvet Sherwani", price: 15000, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500" },
    { id: 2, name: "Embroidered Organza Dupatta", price: 3500, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500" }
  ]);

  const [newItem, setNewItem] = useState({ name: '', price: '', image: '' });
  const [secretToken, setSecretToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple hardcoded pin check for your presentation 
  const handleLogin = (e) => {
    e.preventDefault();
    if (secretToken === "786") { // You can change this secret key
      setIsAuthenticated(true);
    } else {
      alert("❌ Invalid Secret Owner Code!");
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const itemToAdd = {
      id: Date.now(),
      name: newItem.name,
      price: Number(newItem.price),
      image: newItem.image || "https://images.unsplash.com/photo-1608748010899-18f300247112?w=500"
    };

    setItems([...items, itemToAdd]);
    setNewItem({ name: '', price: '', image: '' });
    alert("✨ Item added successfully to the store layout!");
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', background: '#111', color: '#fff', borderRadius: '8px', textAlign: 'center', fontFamily: 'Arial', border: '1px solid #d4af37' }}>
        <h2 style={{ color: '#d4af37', textTransform: 'uppercase' }}>🔒 Owner Secret Access</h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Enter your private password to modify store inventory items.</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input 
            type="password" 
            placeholder="Enter Owner PIN (Try 786)" 
            value={secretToken} 
            onChange={(e) => setSecretToken(e.target.value)}
            style={{ padding: '12px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '4px', textAlign: 'center' }}
          />
          <button type="submit" style={{ padding: '12px', background: '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#fff', background: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
        <h2 style={{ color: '#d4af37', margin: 0 }}>⚙️ NOOR-E-HAYA MANAGEMENT PANEL</h2>
        <button onClick={() => setIsAuthenticated(false)} style={{ padding: '6px 12px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Log Out</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginTop: '30px' }}>
        
        {/* LEFT COLUMN: ADD NEW ITEM FORM */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #222', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, color: '#27ae60' }}>➕ Add New Item</h3>
          <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" placeholder="Product Name" value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} required 
              style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
            />
            <input 
              type="number" placeholder="Price (Rs.)" value={newItem.price} 
              onChange={e => setNewItem({...newItem, price: e.target.value})} required 
              style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
            />
            <input 
              type="text" placeholder="Image Web URL (or leave blank)" value={newItem.image} 
              onChange={e => setNewItem({...newItem, image: e.target.value})} 
              style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}
            />
            <button type="submit" style={{ padding: '12px', background: '#27ae60', color: '#fff', border: 'none', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}>
              Publish Live to Store
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: CURRENT LIVE INVENTORY LIST */}
        <div>
          <h3 style={{ marginTop: 0 }}>📦 Active Storefront Items ({items.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0' }}>{item.name}</h4>
                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>Rs. {item.price}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  style={{ padding: '8px 15px', background: '#c5221f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}