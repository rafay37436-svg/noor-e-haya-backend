import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

export default function Shop({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      let serverProducts = [];
      
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (response.ok) {
          serverProducts = await response.json();
        }
      } catch (err) {
        console.log("Backend offline or sandbox mode active. Relying on local memory stream.");
      }

      // Read any sandbox products saved locally in the browser
      const localSandboxItems = JSON.parse(localStorage.getItem('sandbox_products') || '[]');
      
      // Combine both lists so nothing gets hidden or lost
      setProducts([...serverProducts, ...localSandboxItems]);
      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#fff', fontSize: '1.2rem', letterSpacing: '1px' }}>
        LOADING COUTURE SELECTIONS...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '30px' }}>
        {products.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', gridColumn: '1/-1' }}>No products available yet.</p>
        ) : (
          products.map((item) => (
            <article key={item._id || Math.random()} style={{ background: '#111', border: '1px solid #222', padding: '15px' }}>
              <div style={{ width: '100%', height: '380px', overflow: 'hidden', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={item.img || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontWeight: '400', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{item.title}</h3>
                <p style={{ margin: 0, color: '#d4af37', fontWeight: 'bold' }}>{item.price}</p>
              </div>
              <button 
                onClick={() => onAddToCart(item)} 
                style={{ width: '100%', marginTop: '15px', padding: '12px', background: 'transparent', border: '1px solid #fff', color: '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', cursor: 'pointer' }}
              >
                Add to Selection Bag
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}