// ShopSphere OpenCommerce - E-Commerce Cart Engine & Checkout UI
// Author: Sanika Dound (GitHub: sanikadound)

// 1. Initial State & Data
const PRODUCTS = [
    { id: 1, name: "Wireless Noise-Canceling Headphones", price: 89.99, category: "Audio", emoji: "🎧" },
    { id: 2, name: "RGB Mechanical Gaming Keyboard", price: 64.50, category: "Accessories", emoji: "⌨️" },
    { id: 3, name: "Smart Fitness Watch V2", price: 129.00, category: "Wearables", emoji: "⌚" },
    { id: 4, name: "Ergonomic Precision Mouse", price: 34.99, category: "Accessories", emoji: "🖱️" },
    { id: 5, name: "Multi-Port USB-C 4K Hub", price: 42.00, category: "Productivity", emoji: "🔌" },
    { id: 6, name: "27-Inch Ultra-HD Curved Monitor", price: 249.99, category: "Displays", emoji: "🖥️" }
];

let cart = [
    { id: 1, qty: 1 },
    { id: 2, qty: 1 },
    { id: 4, qty: 2 }
];

let appliedCoupon = null;
const COUPONS = {
    "SAVE20": { type: "percent", value: 0.20, label: "20% Off Subtotal" },
    "TECH15": { type: "flat", value: 15.00, label: "$15 Flat Off" },
    "FREESHIP": { type: "freeship", value: 0.00, label: "Free Shipping ($10 Saved)" },
    "WELCOME50": { type: "flat", value: 50.00, label: "$50 VIP Welcome Discount" }
};

// 2. DOM Elements
const productGrid = document.getElementById("productGrid");
const cartItemsList = document.getElementById("cartItemsList");
const cartItemCount = document.getElementById("cartItemCount");
const subtotalDisplay = document.getElementById("subtotalDisplay");
const discountRow = document.getElementById("discountRow");
const discountDisplay = document.getElementById("discountDisplay");
const taxDisplay = document.getElementById("taxDisplay");
const shippingDisplay = document.getElementById("shippingDisplay");
const totalDisplay = document.getElementById("totalDisplay");
const couponInput = document.getElementById("couponInput");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const couponFeedback = document.getElementById("couponFeedback");
const regionSelect = document.getElementById("regionSelect");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutModal = document.getElementById("checkoutModal");
const openCheckoutModalBtn = document.getElementById("openCheckoutModalBtn");
const closeCheckoutModalBtn = document.getElementById("closeCheckoutModalBtn");
const checkoutForm = document.getElementById("checkoutForm");
const modalTotalPayable = document.getElementById("modalTotalPayable");
const successToast = document.getElementById("successToast");

// 3. Render Product Cards
function renderProducts() {
    productGrid.innerHTML = PRODUCTS.map(prod => `
        <div class="product-card">
            <div class="product-image">${prod.emoji}</div>
            <div class="product-info">
                <span class="product-category">${prod.category}</span>
                <h4>${prod.name}</h4>
            </div>
            <div class="product-footer">
                <span class="product-price">$${prod.price.toFixed(2)}</span>
                <button class="btn-primary" onclick="addToCart(${prod.id})">+ Add</button>
            </div>
        </div>
    `).join("");
}

// 4. Cart Management Functions
window.addToCart = function(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    updateCartUI();
};

window.changeQty = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
};

window.removeFromCart = function(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
};

clearCartBtn.addEventListener("click", () => {
    cart = [];
    appliedCoupon = null;
    couponInput.value = "";
    couponFeedback.textContent = "";
    updateCartUI();
});

// 5. Calculation Engine (The Solved Problem Core)
function calculateTotals() {
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const prod = PRODUCTS.find(p => p.id === item.id);
        if (prod) {
            subtotal += prod.price * item.qty;
            totalItems += item.qty;
        }
    });

    let discount = 0;
    let shipping = subtotal > 0 ? 10.00 : 0.00;

    if (appliedCoupon && subtotal > 0) {
        if (appliedCoupon.type === "percent") {
            discount = subtotal * appliedCoupon.value;
        } else if (appliedCoupon.type === "flat") {
            discount = Math.min(subtotal, appliedCoupon.value);
        } else if (appliedCoupon.type === "freeship") {
            shipping = 0.00;
        }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const taxRate = parseFloat(regionSelect.value) || 0.05;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax + shipping;

    return {
        subtotal,
        discount,
        tax,
        shipping,
        total,
        totalItems
    };
}

// 6. Update UI
function updateCartUI() {
    const { subtotal, discount, tax, shipping, total, totalItems } = calculateTotals();

    cartItemCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div style="text-align: center; padding: 32px 0; color: #64748b;">
                <p style="font-size: 2rem;">🛒</p>
                <p>Your cart is empty. Add products from the left!</p>
            </div>
        `;
        openCheckoutModalBtn.disabled = true;
    } else {
        openCheckoutModalBtn.disabled = false;
        cartItemsList.innerHTML = cart.map(item => {
            const prod = PRODUCTS.find(p => p.id === item.id);
            return `
                <div class="cart-item">
                    <div class="item-left">
                        <span class="item-emoji">${prod.emoji}</span>
                        <div class="item-meta">
                            <h5>${prod.name}</h5>
                            <span>$${prod.price.toFixed(2)} each</span>
                        </div>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="changeQty(${prod.id}, -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${prod.id}, 1)">+</button>
                        <button class="remove-btn" title="Remove" onclick="removeFromCart(${prod.id})">&times;</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    
    if (discount > 0 || (appliedCoupon && appliedCoupon.type === "freeship")) {
        discountRow.style.display = "flex";
        discountDisplay.textContent = appliedCoupon.type === "freeship" 
            ? "Free Shipping (-$10.00)" 
            : `-$${discount.toFixed(2)} (${appliedCoupon.label})`;
    } else {
        discountRow.style.display = "none";
    }

    taxDisplay.textContent = `$${tax.toFixed(2)}`;
    shippingDisplay.textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
    modalTotalPayable.textContent = `$${total.toFixed(2)}`;
}

// 7. Coupon Handler
function handleApplyCoupon(code) {
    const cleanedCode = code.trim().toUpperCase();
    if (!cleanedCode) {
        couponFeedback.className = "coupon-feedback error";
        couponFeedback.textContent = "Please enter a coupon code.";
        return;
    }

    if (COUPONS[cleanedCode]) {
        appliedCoupon = COUPONS[cleanedCode];
        couponFeedback.className = "coupon-feedback success";
        couponFeedback.textContent = `Coupon '${cleanedCode}' applied: ${appliedCoupon.label}!`;
        updateCartUI();
    } else {
        couponFeedback.className = "coupon-feedback error";
        couponFeedback.textContent = `Invalid coupon code '${cleanedCode}'. Try SAVE20 or TECH15.`;
    }
}

applyCouponBtn.addEventListener("click", () => handleApplyCoupon(couponInput.value));
couponInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleApplyCoupon(couponInput.value);
    }
});

document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
        const code = chip.dataset.code;
        couponInput.value = code;
        handleApplyCoupon(code);
    });
});

regionSelect.addEventListener("change", updateCartUI);

// 8. Modal & Checkout Form Validation
openCheckoutModalBtn.addEventListener("click", () => {
    if (cart.length > 0) {
        checkoutModal.classList.add("active");
    }
});

closeCheckoutModalBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove("active");
    }
});

// Card formatting
document.getElementById("cardNumber").addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    val = val.match(/.{1,4}/g)?.join(" ") || val;
    e.target.value = val;
});

// MM/YY formatting
document.getElementById("cardExpiry").addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 3) {
        val = val.substring(0, 2) + "/" + val.substring(2);
    }
    e.target.value = val;
});

checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById("custName").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const card = document.getElementById("cardNumber").value.replace(/\s/g, "");
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCvv").value.trim();

    // Validation rules
    if (!name) {
        document.getElementById("nameError").textContent = "Name is required.";
        isValid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    if (card.length !== 16 || isNaN(card)) {
        document.getElementById("cardError").textContent = "Card must be 16 digits.";
        isValid = false;
    } else {
        document.getElementById("cardError").textContent = "";
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        document.getElementById("expiryError").textContent = "Expiry format: MM/YY.";
        isValid = false;
    } else {
        document.getElementById("expiryError").textContent = "";
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        document.getElementById("cvvError").textContent = "CVV must be 3 digits.";
        isValid = false;
    } else {
        document.getElementById("cvvError").textContent = "";
    }

    if (isValid) {
        checkoutModal.classList.remove("active");
        checkoutForm.reset();
        cart = [];
        appliedCoupon = null;
        couponFeedback.textContent = "";
        couponInput.value = "";
        updateCartUI();

        // Show toast
        successToast.classList.add("show");
        setTimeout(() => {
            successToast.classList.remove("show");
        }, 4000);
    }
});

// 9. Initial Load
renderProducts();
updateCartUI();
