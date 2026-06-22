document.addEventListener('DOMContentLoaded', () => {
    // Dictionary tracking added inventory: { "Product Name": { price: 18500, qty: 1 } }
    let orderBag = {};
    const cartBadge = document.querySelector('.cart-count');
    const utilityMenu = document.querySelector('.utility-menu');

    // 1. FRONTEND DYNAMIC QUANTITY SYSTEM CONTROLLER
    const setupProductCardControls = (card) => {
        const button = card.querySelector('.view-btn, a[href="#"]');
        if (!button || card.querySelector('.quantity-controller')) return;

        // Generate custom premium adjustment wrapper layout
        const controlWrapper = document.createElement('div');
        controlWrapper.className = 'quantity-controller';
        controlWrapper.style.display = 'none';
        controlWrapper.style.alignItems = 'center';
        controlWrapper.style.justifyContent = 'space-between';
        controlWrapper.style.width = '100%';
        controlWrapper.style.maxWidth = '160px';
        controlWrapper.style.margin = '0 auto';
        controlWrapper.style.border = '1px solid #D4AF37';
        controlWrapper.style.padding = '8px 12px';
        controlWrapper.style.color = '#FDFBF7';

        controlWrapper.innerHTML = `
            <button class="minus-btn" style="background:none; border:none; color:#D4AF37; cursor:pointer; font-weight:bold; font-size:1.1rem;">-</button>
            <span class="qty-display" style="font-size:1rem;">1</span>
            <button class="plus-btn" style="background:none; border:none; color:#D4AF37; cursor:pointer; font-weight:bold; font-size:1.1rem;">+</button>
        `;

        button.parentNode.insertBefore(controlWrapper, button.nextSibling);

        // Helper functions to fetch updated values if admin edits details live
        const getItemData = () => {
            const nameEl = card.querySelector('.prod-title, h4, div');
            const priceEl = card.querySelector('.product-price, div[style*="color: #D4AF37"]');
            return {
                name: nameEl ? nameEl.textContent.trim() : 'Premium Couture Item',
                price: priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10) : 0
            };
        };

        // Click Add item logic
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const item = getItemData();
            orderBag[item.name] = { price: item.price, qty: 1 };
            button.style.display = 'none';
            controlWrapper.style.display = 'flex';
            controlWrapper.querySelector('.qty-display').textContent = '1';
            updateCartTotals();
        });

        // Click Add extra quantity (+) logic
        controlWrapper.querySelector('.plus-btn').addEventListener('click', () => {
            const item = getItemData();
            if (orderBag[item.name]) {
                orderBag[item.name].qty++;
                controlWrapper.querySelector('.qty-display').textContent = orderBag[item.name].qty;
                updateCartTotals();
            }
        });

        // Click Lower/Discard quantity (-) logic
        controlWrapper.querySelector('.minus-btn').addEventListener('click', () => {
            const item = getItemData();
            if (orderBag[item.name]) {
                orderBag[item.name].qty--;
                if (orderBag[item.name].qty <= 0) {
                    delete orderBag[item.name];
                    controlWrapper.style.display = 'none';
                    button.style.display = 'inline-block';
                } else {
                    controlWrapper.querySelector('.qty-display').textContent = orderBag[item.name].qty;
                }
                updateCartTotals();
            }
        });
    };

    function updateCartTotals() {
        let grandTotalCount = 0;
        for (let key in orderBag) {
            grandTotalCount += orderBag[key].qty;
        }
        if (cartBadge) cartBadge.textContent = grandTotalCount;
    }

    // Initialize customer adjustments layout elements across storefront grids
    const productCards = document.querySelectorAll('.product-card, div[style*="background-color: #161616"]');
    productCards.forEach(setupProductCardControls);

    // 2. PREMIUM BILL INVOICE GENERATION SYSTEM
    if (utilityMenu) {
        utilityMenu.addEventListener('click', (e) => {
            if (e.target.textContent.includes('👜') || e.target.classList.contains('cart-count')) {
                const itemsList = Object.keys(orderBag);
                if (itemsList.length === 0) {
                    alert("Your Luxury Shopping Bag is empty. Add premium abayas to generate an invoice!");
                    return;
                }

                let subtotal = 0;
                let orderDetails = "========================================\n       NOOR-E-HAYA PREMIUM COUTURE      \n         PREMIUM INVOICE GENERATOR       \n========================================\n\n";
                
                itemsList.forEach((name, index) => {
                    const item = orderBag[name];
                    const rowTotal = item.price * item.qty;
                    orderDetails += `${index + 1}. ${name}\n   Qty: ${item.qty} × Rs. ${item.price.toLocaleString()}\n   Total: Rs. ${rowTotal.toLocaleString()}\n\n`;
                    subtotal += rowTotal;
                });

                // Free shipping condition matching Pakistan store limits over Rs. 15,000
                let shippingCost = subtotal > 15000 ? 0 : 500;
                let totalBill = subtotal + shippingCost;

                orderDetails += `----------------------------------------\n`;
                orderDetails += `Subtotal:      Rs. ${subtotal.toLocaleString()}\n`;
                orderDetails += `Shipping:      Rs. ${shippingCost === 0 ? "FREE" : "Rs. " + shippingCost}\n`;
                orderDetails += `----------------------------------------\n`;
                orderDetails += `TOTAL BILL:    Rs. ${totalBill.toLocaleString()}\n`;
                orderDetails += `========================================\n`;
                orderDetails += `Payment Method: Cash On Delivery (COD)\nThank you for shopping elite modesty.`;
                
                alert(orderDetails);
            }
        });
    }

    // 3. SECURE OWNER ACCESS CONTROL MANAGEMENT INTERFACE
    const secretTrigger = document.getElementById('secret-admin-trigger');
    const adminPanel = document.getElementById('admin-panel');

    if (secretTrigger && adminPanel) {
        secretTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            let pass = prompt("Enter Boutique Admin Security Key:");
            if (pass === "admin123") {
                adminPanel.style.display = "block";
                adminPanel.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert("Unauthorized Entry Attempt Denied.");
            }
        });

        // Process Owner Data Submissions
        document.getElementById('admin-save-btn').addEventListener('click', () => {
            const targetId = document.getElementById('admin-item-select').value;
            const newTitle = document.getElementById('admin-title-input').value.trim();
            const newPrice = document.getElementById('admin-price-input').value.trim();
            const newImg = document.getElementById('admin-img-input').value.trim();

            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                // Update specific card inner texts dynamically
                if (newTitle) {
                    const titleEl = targetCard.querySelector('.prod-title') || targetCard.querySelector('h4');
                    if (titleEl) titleEl.textContent = newTitle;
                }
                if (newPrice) {
                    const priceEl = targetCard.querySelector('.product-price') || targetCard.querySelector('div[style*="color: #D4AF37"]');
                    if (priceEl) priceEl.textContent = newPrice;
                }
                if (newImg) {
                    const imgEl = targetCard.querySelector('.prod-img') || targetCard.querySelector('img');
                    if (imgEl) imgEl.src = newImg;
                }
                
                alert("Storefront modified successfully! Customer view refreshed.");
                
                // Reset active inputs
                document.getElementById('admin-title-input').value = "";
                document.getElementById('admin-price-input').value = "";
                document.getElementById('admin-img-input').value = "";
            }
        });
    }
});