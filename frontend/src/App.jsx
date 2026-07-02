import './index.css'
import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Star, Trash2, Shield, Package, ShoppingCart, 
  TrendingUp, DollarSign, PlusCircle, LogOut, Settings, Phone, 
  MapPin, Clock, MessageSquare, Search, Edit2, CheckCircle, RefreshCw, Scissors, Plus, Minus, X, Upload, FileText, Image
} from "lucide-react";

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Al-Nour Classic Abaya",
    price: 8500,
    comparePrice: 11000,
    tag: "Bestseller",
    color: "Midnight Black",
    image: "https://images.unsplash.com/photo-1662806407800-56793fa8e924?w=600&h=800&fit=crop&auto=format",
    stock: 24
  },
  {
    id: "p2",
    name: "Haya Embroidered Abaya",
    price: 12000,
    comparePrice: 15500,
    tag: "New Drops",
    color: "Deep Navy",
    image: "https://images.unsplash.com/photo-1730454752575-88d6307f5579?w=600&h=800&fit=crop&auto=format",
    stock: 15
  },
  {
    id: "p3",
    name: "Zahra Flowy Abaya",
    price: 9800,
    comparePrice: 13000,
    tag: "Premium Line",
    color: "Charcoal Grey",
    image: "https://images.unsplash.com/photo-1682685797498-3bad2c6e161a?w=600&h=800&fit=crop&auto=format",
    stock: 8
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("noor_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("noor_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("noor_orders");
    return saved ? JSON.parse(saved) : [
      { orderId: "NH-552190", customer: { name: "Amna Bilal", phone: "03001122334", city: "Karachi", paymentMethod: "COD" }, items: [{ id: "p1", name: "Al-Nour Classic Abaya", qty: 1, customLength: "54", customBust: "22", customNotes: "Loose fit cuffs" }], total: 8500, status: "Delivered", date: "2026-06-25", receiptImage: null }
    ];
  });
  const [brandProfile, setBrandProfile] = useState(() => {
    const saved = localStorage.getItem("noor_brand_profile");
    return saved ? JSON.parse(saved) : {
      ownerName: "Noor Management Studio",
      whatsappNumber: "923001234567",
      instagramUrl: "https://instagram.com/noorehaya.official",
      tiktokUrl: "https://tiktok.com/@noorehaya.official",
      bankName: "Meezan Bank Limited",
      accountTitle: "NOOR E HAYA COUTURE",
      iban: "PK49MEZN0012010928374",
      studioAddress: "Boutique 4, Street 12, Zamzama Commercial, Phase V, DHA, Karachi",
      timings: "1:00 PM - 10:00 PM"
    };
  });

  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", address: "", city: "Karachi", paymentMethod: "COD" });
  const [receiptBase64, setReceiptBase64] = useState(null);
  const [adminAuth, setAdminAuth] = useState(() => localStorage.getItem("noor_admin_logged") === "true");
  const [adminPass, setAdminPass] = useState("");
  const [searchTrackId, setSearchTrackId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [returnInvoiceId, setReturnInvoiceId] = useState("");
  const [returnStatusMsg, setReturnStatusMsg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", comparePrice: "", color: "", tag: "New Drops", stock: 15, image: "" });
  const [profileForm, setProfileForm] = useState({ ...brandProfile });

  // Persist data to localStorage
  useEffect(() => { localStorage.setItem("noor_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("noor_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("noor_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("noor_brand_profile", JSON.stringify(brandProfile)); }, [brandProfile]);

  // Handlers
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleShopItemAction = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (!exist) {
      if (product.stock < 1) return alert("⚠️ This exclusive article is completely sold out.");
      setCart([...cart, { ...product, qty: 1, needsAlterations: false, customLength: "54", customBust: "22", customNotes: "" }]);
    }
  };

  const incrementCartQty = (id) => {
    const targetProd = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);
    if (targetProd && cartItem && cartItem.qty >= targetProd.stock) {
      return alert(`⚠️ Maximum production capacity reached. Only ${targetProd.stock} pieces available.`);
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decrementCartQty = (id) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        if (item.qty <= 1) return null;
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    }).filter(Boolean));
  };

  const removeCartItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartAlteration = (id, field, value) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your bag is empty!");
    if (checkoutForm.paymentMethod === "Bank Transfer" && !receiptBase64) {
      return alert("⚠️ Please upload your bank transfer transaction receipt/screenshot to complete your custom order request.");
    }
    for (let item of cart) {
      const match = products.find(p => p.id === item.id);
      if (match && match.stock < item.qty) {
        return alert(`⚠️ Sizing stock layout error: ${item.name} has only ${match.stock} units remaining.`);
      }
    }

    const uniqueInvoiceId = "NH-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId: uniqueInvoiceId,
      customer: { ...checkoutForm },
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (item.price * item.qty), 0),
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      receiptImage: checkoutForm.paymentMethod === "Bank Transfer" ? receiptBase64 : null
    };

    setProducts(prevProducts => prevProducts.map(prod => {
      const purchased = cart.find(cartItem => cartItem.id === prod.id);
      if (purchased) {
        return { ...prod, stock: Math.max(0, prod.stock - purchased.qty) };
      }
      return prod;
    }));

    setOrders([newOrder, ...orders]);
    setCart([]);
    setReceiptBase64(null);
    alert(`🎉 Order Registered! Tracking Code: ${newOrder.orderId}`);
    setSearchTrackId(newOrder.orderId);
    setSearchedOrder(newOrder);
    setCurrentPage("contact");
  };

  const handleVerifyReturnWindow = (e) => {
    e.preventDefault();
    const targetedId = returnInvoiceId.trim().toUpperCase();
    const foundOrder = orders.find(o => o.orderId.toUpperCase() === targetedId);

    if (!foundOrder) {
      return setReturnStatusMsg({ success: false, text: "⚠️ No recorded matching invoice found within database servers." });
    }
    if (foundOrder.status === "Cancelled") {
      return setReturnStatusMsg({ success: false, text: "❌ This order tracking log is tagged as Cancelled/Void." });
    }

    const creationDate = new Date(foundOrder.date);
    const currentDate = new Date();
    const processingDifferenceInTime = currentDate.getTime() - creationDate.getTime();
    const totalDaysElapsed = Math.floor(processingDifferenceInTime / (1000 * 3600 * 24));

    if (totalDaysElapsed <= 7) {
      setReturnStatusMsg({
        success: true,
        text: `🟢 Return Valid! This order was generated on ${foundOrder.date} (${totalDaysElapsed} days ago). Your 7-Day Cashback Guarantee layer is active. Please hand over this verification ticket to our WhatsApp logistics helpdesk to securely process your refund payout.`
      });
    } else {
      setReturnStatusMsg({
        success: false,
        text: `❌ Return Terminated. This transaction was finalized on ${foundOrder.date} (${totalDaysElapsed} days ago), which explicitly passes our 7-day modesty safety duration cap.`
      });
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const defaultImg = "https://images.unsplash.com/photo-1662806407800-56793fa8e924?w=600";
    
    if (isEditing) {
      setProducts(prev => prev.map(p => p.id === currentEditId ? { 
        ...p, 
        name: productForm.name, 
        price: Number(productForm.price), 
        comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : null,
        color: productForm.color, 
        tag: productForm.tag, 
        stock: Number(productForm.stock),
        image: productForm.image || p.image 
      } : p));
      setIsEditing(false);
      setCurrentEditId(null);
      alert("Article specs rewritten successfully.");
    } else {
      const created = {
        id: "p_" + Date.now(),
        name: productForm.name,
        price: Number(productForm.price),
        comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : null,
        color: productForm.color || "Midnight Black",
        tag: productForm.tag,
        stock: Number(productForm.stock),
        image: productForm.image || defaultImg
      };
      setProducts([created, ...products]);
      alert("New article introduced into global catalog.");
    }
    setProductForm({ name: "", price: "", comparePrice: "", color: "", tag: "New Drops", stock: 15, image: "" });
  };

  const startEditProduct = (prod) => {
    setIsEditing(true);
    setCurrentEditId(prod.id);
    setProductForm({ name: prod.name, price: prod.price, comparePrice: prod.comparePrice || "", color: prod.color, tag: prod.tag, stock: prod.stock, image: prod.image });
  };

  const deleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: nextStatus } : o));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setBrandProfile({ ...profileForm });
    alert("HQ Profile Configuration synced across the storefront views.");
  };

  const totalCartUnits = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalRevenue = orders.reduce((sum, o) => o.status !== "Cancelled" ? sum + o.total : sum, 0);

  // ==================== RENDERING ====================

  return (
    <div className="noor-app-container">
      {/* JSON-LD Schema Markup for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "Noor-e-Haya",
          "description": "Premium abayas and Islamic wear for women",
          "url": "https://noorehayaa.vercel.app",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "PKR",
            "lowPrice": Math.min(...products.map(p => p.price)),
            "highPrice": Math.max(...products.map(p => p.price))
          }
        })}
      </script>

      {/* NAVIGATION */}
      <nav className="noor-nav" role="navigation" aria-label="Main navigation">
        <div onClick={() => setCurrentPage("home")} role="button" tabIndex="0" onKeyPress={(e) => e.key === "Enter" && setCurrentPage("home")} aria-label="Noor-e-Haya Home">
          <div className="noor-logo-text">نور حیا</div>
          <div className="noor-logo-sub">Noor e Haya</div>
        </div>

        <div className="noor-nav-links">
          <button onClick={() => setCurrentPage("home")} className={currentPage === "home" ? "active" : ""} aria-current={currentPage === "home" ? "page" : undefined}>Home</button>
          <button onClick={() => setCurrentPage("shop")} className={currentPage === "shop" ? "active" : ""} aria-current={currentPage === "shop" ? "page" : undefined}>Shop</button>
          <button onClick={() => setCurrentPage("checkout")} className={currentPage === "checkout" ? "active" : ""} aria-current={currentPage === "checkout" ? "page" : undefined} aria-label={`Shopping bag with ${totalCartUnits} items`}>Bag ({totalCartUnits})</button>
          <button onClick={() => setCurrentPage("contact")} className={currentPage === "contact" ? "active" : ""} aria-current={currentPage === "contact" ? "page" : undefined}>Tracking & Returns</button>
          {adminAuth && <button onClick={() => setCurrentPage("admin")} className={currentPage === "admin" ? "active" : ""} aria-current={currentPage === "admin" ? "page" : undefined}>💻 HQ Command</button>}
        </div>
      </nav>

      <main className="noor-content" role="main">
        
        {/* ==================== HOME PAGE ==================== */}
        {currentPage === "home" && (
          <div>
            <section className="text-center" style={{ padding: "50px 20px 20px 20px" }}>
              <p className="section-subtext">Luxury Modest Wear Collection</p>
              <h1>Where Grace Meets Modesty</h1>
              <p>
                Bespoke imported fabrics shaped into pristine fluid silhouettes. Crafted elegantly for premium look and daily flow.
              </p>
              <button onClick={() => setCurrentPage("shop")} className="gold-btn">Explore Full Catalog</button>
            </section>

            <section className="feature-grid">
              <article className="feature-card">
                <Scissors className="feature-icon" size={26} aria-hidden="true" />
                <h3 className="feature-title">Bespoke Custom Alterations</h3>
                <p className="feature-desc">
                  We value perfection. Select your exact abaya drop length and chest sizing specifications directly inside your selection bag for an immaculate fit.
                </p>
              </article>
              <article className="feature-card">
                <RefreshCw className="feature-icon" size={26} aria-hidden="true" />
                <h3 className="feature-title">7-Day Cashback Guarantee</h3>
                <p className="feature-desc">
                  Shop with absolute assurance. We provide a complete 100% moneyback return and size alteration framework valid up to 7 full days from your tracking generation timestamp.
                </p>
              </article>
              <article className="feature-card">
                <CheckCircle className="feature-icon" size={26} aria-hidden="true" />
                <h3 className="feature-title">Premium Imported Fabrics</h3>
                <p className="feature-desc">
                  Every Noor-E-Haya piece is meticulously tailored using premium Korean Nada and imported georgette weaves to assure light drapes and total opacity.
                </p>
              </article>
            </section>
          </div>
        )}

        {/* ==================== SHOP PAGE ==================== */}
        {currentPage === "shop" && (
          <section>
            <h2 className="section-headline">The Active Catalog</h2>
            <div className="product-grid" role="region" aria-label="Product catalog">
              {products.map((prod) => {
                const cartMatch = cart.find(item => item.id === prod.id);
                return (
                  <article key={prod.id} className="product-card">
                    <div>
                      <div className="img-container">
                        <img src={prod.image} alt={`${prod.name} in ${prod.color}`} loading="lazy" />
                        <span className="tag-badge" aria-label={`Product tag: ${prod.tag}`}>{prod.tag}</span>
                      </div>
                      <div>
                        <span className="stock-status">{prod.color}</span>
                        <span className={`stock-status ${prod.stock === 0 ? 'stock-out' : prod.stock <= 3 ? 'stock-low' : 'stock-in-stock'}`} aria-label={`Stock status: ${prod.stock === 0 ? 'Sold Out' : prod.stock <= 3 ? `Only ${prod.stock} Left` : 'In Stock'}`}>
                          {prod.stock === 0 ? "Sold Out" : prod.stock <= 3 ? `Only ${prod.stock} Left` : "In Stock"}
                        </span>
                      </div>
                      <h3 className="prod-title">{prod.name}</h3>
                    </div>
                    <div>
                      <div className="prod-footer">
                        <div>
                          {prod.comparePrice && (
                            <div className="price-compare">Rs. {prod.comparePrice.toLocaleString()}</div>
                          )}
                          <div className="price-primary">Rs. {prod.price.toLocaleString()}</div>
                        </div>

                        {cartMatch ? (
                          <div className="shop-action-pill" role="group" aria-label="Quantity control">
                            <button type="button" onClick={() => decrementCartQty(prod.id)} className="shop-pill-btn" aria-label="Decrease quantity">
                              <Minus size={12} aria-hidden="true" />
                            </button>
                            <span className="shop-pill-digit" aria-live="polite">{cartMatch.qty}</span>
                            <button type="button" onClick={() => incrementCartQty(prod.id)} className="shop-pill-btn" aria-label="Increase quantity">
                              <Plus size={12} aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleShopItemAction(prod)} 
                            className="gold-btn"
                            disabled={prod.stock === 0}
                            aria-label={prod.stock === 0 ? `${prod.name} is out of stock` : `Add ${prod.name} to shopping bag`}
                          >
                            {prod.stock === 0 ? "Out of Stock" : "Add to Bag"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ==================== CHECKOUT PAGE ==================== */}
        {currentPage === "checkout" && (
          <section>
            <h2 className="section-headline">Your Selection Bag</h2>
            {cart.length === 0 ? (
              <div className="text-center" style={{ padding: "60px", background: "var(--bg-card)", border: "1px solid var(--border-muted)" }} role="status" aria-live="polite">
                <ShoppingCart style={{ color: "#333", marginBottom: "15px" }} size={45} aria-hidden="true" />
                <p>Your checkout selection bag is currently empty.</p>
              </div>
            ) : (
              <div className="checkout-box">
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {cart.map((item) => (
                      <article key={item.id} style={{ background: "var(--bg-card)", padding: "20px", border: "1px solid var(--border-muted)", position: "relative" }}>
                        <button 
                          onClick={() => removeCartItem(item.id)} 
                          className="remove-btn"
                          aria-label={`Remove ${item.name} from bag`}
                          style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "5px" }}
                        >
                          <X size={16} aria-hidden="true" />
                        </button>

                        <div style={{ display: "flex", gap: "20px", alignItems: "center", paddingRight: "25px" }}>
                          <img src={item.image} alt={`${item.name} image`} style={{ width: "70px", height: "90px", objectFit: "cover" }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 4px 0", color: "var(--text-pure)", fontSize: "15px" }}>{item.name}</h4>
                            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>Color Tint: {item.color}</p>
                            <p style={{ margin: "6px 0 0 0", color: "var(--gold-accent)", fontWeight: "bold" }}>
                              Rs. {(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>

                          <div className="qty-pill-container" role="group" aria-label="Adjust quantity">
                            <button type="button" onClick={() => decrementCartQty(item.id)} className="qty-pill-btn" aria-label="Decrease quantity">
                              <Minus size={12} aria-hidden="true" />
                            </button>
                            <span className="qty-display-digit" aria-live="polite">{item.qty}</span>
                            <button type="button" onClick={() => incrementCartQty(item.id)} className="qty-pill-btn" aria-label="Increase quantity">
                              <Plus size={12} aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div style={{ marginTop: "15px", borderTop: "1px solid var(--border-light)", paddingTop: "12px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#D4D4D4", cursor: "pointer" }}>
                            <input 
                              type="checkbox" 
                              checked={item.needsAlterations} 
                              onChange={(e) => updateCartAlteration(item.id, "needsAlterations", e.target.checked)}
                              aria-label="Apply custom alterations"
                            />
                            <span>Apply Custom Tailored Alterations (Free Service)</span>
                          </label>

                          {item.needsAlterations && (
                            <div className="alteration-container">
                              <div className="alteration-grid">
                                <div>
                                  <label htmlFor={`length-${item.id}`} style={{ fontSize: "10px", color: "var(--text-gray)", display: "block", marginBottom: "4px" }}>Abaya Drop Length</label>
                                  <select 
                                    id={`length-${item.id}`}
                                    value={item.customLength} 
                                    onChange={(e) => updateCartAlteration(item.id, "customLength", e.target.value)}
                                  >
                                    <option value="50">50 Inches</option>
                                    <option value="52">52 Inches</option>
                                    <option value="54">54 Inches (Standard)</option>
                                    <option value="56">56 Inches</option>
                                    <option value="58">58 Inches</option>
                                  </select>
                                </div>
                                <div>
                                  <label htmlFor={`bust-${item.id}`} style={{ fontSize: "10px", color: "var(--text-gray)", display: "block", marginBottom: "4px" }}>Chest Width Specs</label>
                                  <select 
                                    id={`bust-${item.id}`}
                                    value={item.customBust} 
                                    onChange={(e) => updateCartAlteration(item.id, "customBust", e.target.value)}
                                  >
                                    <option value="18">18 Inches (Small)</option>
                                    <option value="20">20 Inches (Medium)</option>
                                    <option value="22">22 Inches (Standard Large)</option>
                                  </select>
                                </div>
                              </div>
                              <textarea 
                                placeholder="Type unique dimensions or cuff alteration notes here..." 
                                value={item.customNotes} 
                                onChange={(e) => updateCartAlteration(item.id, "customNotes", e.target.value)}
                                aria-label="Custom alteration notes"
                              />
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  <div style={{ background: "var(--bg-card)", padding: "25px", border: "1px solid var(--border-muted)", marginTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", color: "var(--gold-accent)", fontWeight: "bold", marginBottom: "20px" }}>
                      <span>Subtotal Aggregate</span>
                      <span>Rs. {cart.reduce((sum, i) => sum + (i.price * i.qty), 0).toLocaleString()}</span>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="checkout-box">
                      <div>
                        <label htmlFor="customer-name">Client Full Name</label>
                        <input 
                          id="customer-name"
                          required 
                          placeholder="Enter your full name" 
                          value={checkoutForm.name} 
                          onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})} 
                          aria-required="true"
                        />
                      </div>

                      <div>
                        <label htmlFor="customer-phone">Contact Number / WhatsApp</label>
                        <input 
                          id="customer-phone"
                          required 
                          placeholder="Enter phone number" 
                          value={checkoutForm.phone} 
                          onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                          aria-required="true"
                        />
                      </div>

                      <div>
                        <label htmlFor="customer-address">Delivery Address</label>
                        <textarea 
                          id="customer-address"
                          required 
                          placeholder="Enter your full delivery address" 
                          value={checkoutForm.address} 
                          onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                          aria-required="true"
                        />
                      </div>

                      <div>
                        <label htmlFor="payment-method">Payment Method</label>
                        <select 
                          id="payment-method"
                          value={checkoutForm.paymentMethod} 
                          onChange={(e) => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})}
                        >
                          <option value="COD">Cash on Delivery (Courier COD Logistics)</option>
                          <option value="Bank Transfer">Direct Bank Account Settlement</option>
                        </select>
                      </div>

                      {checkoutForm.paymentMethod === "Bank Transfer" && (
                        <div style={{ background: "rgba(212,175,55,0.05)", border: "1px dashed var(--gold-accent)", padding: "15px", fontSize: "12px", fontFamily: "monospace", color: "#D4D4D4", lineHeight: "1.6" }}>
                          <p style={{ color: "var(--gold-accent)", fontWeight: "bold", margin: "0 0 6px 0", fontSize: "13px" }}>Corporate Banking Wire Specs</p>
                          Bank Channel: <span style={{ color: "white" }}>{brandProfile.bankName}</span><br />
                          Account Title: <span style={{ color: "white" }}>{brandProfile.accountTitle}</span><br />
                          IBAN String: <span style={{ color: "white" }}>{brandProfile.iban}</span>
                          
                          <div style={{ marginTop: "15px", borderTop: "1px solid var(--border-muted)", paddingTop: "12px" }}>
                            <p style={{ color: "var(--text-pure)", fontWeight: "bold", margin: "0 0 5px 0" }}>⚡ Upload Payment Proof Screenshot:</p>
                            <label className="upload-receipt-zone" style={{ display: "block" }}>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleReceiptUpload}
                                aria-label="Upload receipt image"
                                style={{ display: "none" }} 
                              />
                              {receiptBase64 ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--status-success)" }}>
                                  <Image size={16} aria-hidden="true" />
                                  <span>Receipt Attached Successfully!</span>
                                </div>
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted)" }}>
                                  <Upload size={16} aria-hidden="true" />
                                  <span>Click to select or drop receipt image here</span>
                                </div>
                              )}
                            </label>
                            {receiptBase64 && (
                              <div style={{ marginTop: "10px", textAlign: "center" }}>
                                <img src={receiptBase64} alt="Receipt preview" style={{ maxHeight: "120px", border: "1px solid #404040" }} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button type="submit" className="gold-btn" style={{ width: "100%" }}>Place Custom Order</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== CONTACT & TRACKING PAGE ==================== */}
        {currentPage === "contact" && (
          <section>
            <h2 className="section-headline">Customer Care Portal</h2>
            <p className="section-subtext">Monitor real-time transit logs or evaluate cash-back return warranties instantly.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
              <article style={{ background: "var(--bg-card)", padding: "30px", border: "1px solid var(--border-muted)" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "15px", color: "var(--gold-accent)", textTransform: "uppercase", letterSpacing: "1px" }}>1. Live Order Tracker</h3>
                <form onSubmit={(e) => { e.preventDefault(); setSearchedOrder(orders.find(o => o.orderId.trim().toUpperCase() === searchTrackId.trim().toUpperCase()) || "NOT_FOUND"); }} className="search-wrapper">
                  <input 
                    required 
                    placeholder="Enter Order Invoice ID (e.g., NH-552190)" 
                    value={searchTrackId} 
                    onChange={(e) => setSearchTrackId(e.target.value)}
                    aria-label="Search order by tracking ID"
                  />
                  <button type="submit" className="gold-btn" style={{ padding: "0 25px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Search size={16} aria-hidden="true" /> Track
                  </button>
                </form>

                {searchedOrder && (
                  <div style={{ background: "#050505", border: "1px solid var(--border-light)", padding: "20px", marginTop: "15px" }} role="region" aria-label="Order details">
                    {searchedOrder === "NOT_FOUND" ? (
                      <p style={{ color: "var(--status-error)", margin: 0, fontSize: "13px" }}>⚠️ No matching order ledger detected inside our current data logs.</p>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px", marginBottom: "15px" }}>
                          <div><span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Invoice Code</span><h4 style={{ margin: "2px 0 0 0", color: "var(--gold-accent)", fontFamily: "monospace" }}>{searchedOrder.orderId}</h4></div>
                          <div><span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", textAlign: "right" }}>Status</span><span className={`status-${searchedOrder.status.toLowerCase()}`} style={{ padding: "3px 9px", fontSize: "11px", fontWeight: "bold", display: "inline-block", marginTop: "4px" }}>{searchedOrder.status}</span></div>
                        </div>
                        <p><strong>Client:</strong> {searchedOrder.customer.name}</p>
                        <p><strong>Order Date:</strong> {searchedOrder.date}</p>
                        <p><strong>Total Value:</strong> Rs. {searchedOrder.total.toLocaleString()}</p>
                        <div style={{ background: "var(--bg-card)", padding: "12px", marginTop: "12px" }}>
                          {searchedOrder.items.map((it, idx) => (
                            <p key={idx} style={{ fontSize: "12px", color: "#D4D4D4", margin: "4px 0 0 0" }}>• {it.name} (x{it.qty})</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>

              <article style={{ background: "var(--bg-card)", padding: "30px", border: "1px solid var(--border-muted)" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "15px", color: "var(--gold-accent)", textTransform: "uppercase", letterSpacing: "1px" }}>2. 7-Day Cashback Return Engine</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 15px 0" }}>Input your purchase invoice number below to calculate if your refund protection cycle remains valid.</p>
                
                <form onSubmit={handleVerifyReturnWindow} className="search-wrapper">
                  <input 
                    required 
                    placeholder="Enter Invoice Number to verify (e.g., NH-552190)" 
                    value={returnInvoiceId} 
                    onChange={(e) => setReturnInvoiceId(e.target.value)}
                    aria-label="Search return eligibility by invoice number"
                  />
                  <button type="submit" className="gold-btn" style={{ padding: "0 25px" }}>Verify Ticket</button>
                </form>

                {returnStatusMsg && (
                  <div style={{ background: returnStatusMsg.success ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${returnStatusMsg.success ? "var(--status-success)" : "var(--status-error)"}`, padding: "20px", marginTop: "15px" }} role="status" aria-live="polite">
                    <p style={{ margin: 0, fontSize: "13px", color: returnStatusMsg.success ? "#A7F3D0" : "#FCA5A5", lineHeight: "1.6" }}>{returnStatusMsg.text}</p>
                  </div>
                )}
              </article>
            </div>

            <h3 className="section-headline" style={{ marginTop: "40px" }}>Our Digital Lookbooks</h3>
            <div className="social-matrix-grid">
              <a 
                href={`https://wa.me/${brandProfile.whatsappNumber}`} 
                target="_blank" 
                rel="noreferrer" 
                className="social-card-btn"
                aria-label="Contact us on WhatsApp"
              >
                <MessageSquare size={18} style={{ color: "#10B981" }} aria-hidden="true" /> WhatsApp Support
              </a>
              <a 
                href={brandProfile.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="social-card-btn"
                aria-label="View our Instagram lookbook"
              >
                <Star size={18} style={{ color: "#E1306C" }} aria-hidden="true" /> Instagram Lookbook
              </a>
            </div>
          </section>
        )}

        {/* ==================== ADMIN SECTION ==================== */}
        {currentPage === "admin" && (
          <section>
            {!adminAuth ? (
              <div className="admin-login-fullscreen">
                <Shield style={{ color: "var(--status-info)", marginBottom: "15px" }} size={40} aria-hidden="true" />
                <h3 style={{ color: "white", fontSize: "18px", margin: "0 0 8px 0" }}>Command Portal Authentication</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "0 0 24px 0" }}>Operational data screens are heavily masked under encrypted locks.</p>
                <form onSubmit={(e) => { e.preventDefault(); if(adminPass === "haya786") { setAdminAuth(true); localStorage.setItem("noor_admin_logged", "true"); } else alert("Access token invalid."); }}>
                  <input 
                    type="password" 
                    placeholder="Input Security Passkey Token" 
                    value={adminPass} 
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="admin-input-style"
                    aria-label="Admin password"
                    required 
                  />
                  <button type="submit" className="gold-btn" style={{ width: "100%" }}>Authenticate Session</button>
                </form>
              </div>
            ) : (
              <div className="erp-dashboard">
                <div className="erp-panel-header">
                  <div><span style={{ color: "var(--text-muted)", fontSize: "11px" }}>EXECUTIVE MANAGEMENT TERMINAL</span><h2 style={{ margin: "4px 0 0 0", color: "white", fontSize: "24px" }}>Enterprise Command Workspace</h2></div>
                  <button 
                    onClick={() => { setAdminAuth(false); localStorage.removeItem("noor_admin_logged"); setCurrentPage("home"); }} 
                    style={{ background: "#1E293B", color: "var(--status-error)", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}
                    aria-label="End admin session"
                  >
                    <LogOut size={14} aria-hidden="true" /> End Session
                  </button>
                </div>

                <div className="metric-strip">
                  <div className="metric-card">
                    <div style={{ background: "rgba(59,130,246,0.1)", color: "var(--status-info)", padding: "12px", borderRadius: "6px" }}><DollarSign size={20} aria-hidden="true" /></div>
                    <div><span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Total Cash Valuations</span><div className="metric-val">PKR {totalRevenue.toLocaleString()}</div></div>
                  </div>
                  <div className="metric-card">
                    <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--status-success)", padding: "12px", borderRadius: "6px" }}><Package size={20} aria-hidden="true" /></div>
                    <div><span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Catalog Active Items</span><div className="metric-val">{products.length} Articles</div></div>
                  </div>
                </div>

                <div className="admin-grid">
                  <div>
                    <div className="admin-form-box">
                      <h3 style={{ color: "white", fontSize: "14px", margin: "0 0 15px 0" }}><PlusCircle size={15} aria-hidden="true" /> {isEditing ? "Modify Collection Article Specs" : "Launch New Catalog Article"}</h3>
                      <form onSubmit={handleSaveProduct}>
                        <input required placeholder="Abaya Title" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="admin-input-style" aria-label="Product name" />
                        <input required type="number" placeholder="Actual Retail Selling Price" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="admin-input-style" aria-label="Selling price" />
                        <input type="number" placeholder="Original Price to cross out" value={productForm.comparePrice} onChange={(e) => setProductForm({...productForm, comparePrice: e.target.value})} className="admin-input-style" aria-label="Compare price" />
                        <input placeholder="Color Matrix Tint" value={productForm.color} onChange={(e) => setProductForm({...productForm, color: e.target.value})} className="admin-input-style" aria-label="Product color" />
                        <input placeholder="Image Link URL" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="admin-input-style" aria-label="Image URL" />
                        <input type="number" placeholder="Production Stock Allocation units" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="admin-input-style" aria-label="Stock quantity" />
                        <button type="submit" className="gold-btn" style={{ width: "100%" }}>{isEditing ? "Update Core Specs" : "Publish Live Layer"}</button>
                      </form>
                    </div>
                  </div>

                  <div>
                    <div style={{ background: "#0F172A", padding: "25px", border: "1px solid #1E293B" }}>
                      <h3 style={{ color: "white", fontSize: "14px", margin: "0 0 15px 0" }}>Order Log Pipeline Ledger ({orders.length})</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {orders.map((o) => (
                          <article key={o.orderId} style={{ background: "#020617", padding: "15px", border: "1px solid #1E293B" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <span style={{ fontFamily: "monospace", color: "var(--status-info)", fontWeight: "bold" }}>{o.orderId}</span>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "10px" }}>{o.customer.name} ({o.customer.paymentMethod})</span>
                              </div>
                              <select 
                                value={o.status} 
                                onChange={(e) => updateOrderStatus(o.orderId, e.target.value)} 
                                style={{ background: "#0F172A", border: "1px solid #334155", color: "white", fontSize: "12px", padding: "4px" }}
                                aria-label={`Update ${o.orderId} status`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">In Production</option>
                                <option value="Shipped">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            {o.receiptImage && (
                              <div style={{ marginTop: "10px", padding: "8px", background: "#0F172A", border: "1px solid #334155" }}>
                                <span style={{ fontSize: "11px", color: "var(--gold-accent)", display: "block", marginBottom: "5px" }}>🖼️ Client Bank Proof Attachment:</span>
                                <a href={o.receiptImage} target="_blank" rel="noreferrer">
                                  <img src={o.receiptImage} alt="Payment proof for order" style={{ maxHeight: "100px", maxWidth: "100%", cursor: "zoom-in" }} />
                                </a>
                              </div>
                            )}

                            <div style={{ background: "#0F172A", padding: "10px", marginTop: "10px" }}>
                              {o.items.map((it, idx) => (
                                <p key={idx} style={{ margin: 0, fontSize: "12px", color: "#E2E8F0" }}>
                                  • {it.name} (x{it.qty}) {it.needsAlterations ? `➔ [L: ${it.customLength}", B: ${it.customBust}"]` : ""}
                                </p>
                              ))}
                            </div>
                            <div style={{ textAlign: "right", fontSize: "13px", fontWeight: "bold", color: "var(--status-success)", marginTop: "5px" }}>Rs. {o.total.toLocaleString()}</div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer>
        &copy; 2026 Noor-E-Haya Couture Luxury. All Rights Reserved. 
        <span onClick={() => { setCurrentPage("admin"); window.scrollTo(0, 0); }} role="button" tabIndex="0" onKeyPress={(e) => e.key === "Enter" && (setCurrentPage("admin"), window.scrollTo(0, 0))} aria-label="Admin access" style={{ cursor: "pointer", marginLeft: "12px" }}>🔑</span>
      </footer>
    </div>
  );
}