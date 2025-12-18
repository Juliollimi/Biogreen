// ===============================
// Data
// ===============================
const PRODUCTS = [
  {
    id: "limpiador-multiusos",
    name: "Limpiador Multiusos",
    category: "multiusos",
    notes: ["biodegradable", "no tóxico", "vegetal"],
    ml: 500,
    price: 12.90,
    description: "Limpieza profunda para todas las superficies. Efectivo y seguro.",
    featured: 1,
    status: "available",
    image: "scr/Bio_green_Foto_Producto-SinFondo.png"
  },
  {
    id: "lavavajillas-ecologico",
    name: "Lavavajillas Ecológico",
    category: "cocina",
    notes: ["concentrado", "sin fosfatos", "aloe vera"],
    ml: 750,
    price: 14.50,
    description: "Corta grasa sin esfuerzo. Suave con tus manos, duro con la suciedad.",
    featured: 2,
    status: "coming-soon",
    emoji: "🧽"
  },
  {
    id: "limpiador-pisos",
    name: "Limpiador de Pisos",
    category: "pisos",
    notes: ["brillo natural", "eucalipto", "antibacterial"],
    ml: 1000,
    price: 15.75,
    description: "Deja tus pisos impecables con aroma fresco y natural.",
    featured: 3,
    status: "coming-soon",
    emoji: "🪴"
  },
  {
    id: "limpiador-banos",
    name: "Limpiador de Baños",
    category: "baño",
    notes: ["desinfectante", "anti-sarro", "menta"],
    ml: 500,
    price: 13.00,
    description: "Elimina bacterias y cal. Baños brillantes y frescos.",
    featured: 4,
    status: "coming-soon",
    emoji: "🚿"
  },
  {
    id: "desengrasante-cocina",
    name: "Desengrasante de Cocina",
    category: "cocina",
    notes: ["cítrico", "potente", "biodegradable"],
    ml: 500,
    price: 11.40,
    description: "Elimina grasa difícil de hornos, estufas y campanas.",
    featured: 5,
    status: "coming-soon",
    emoji: "🧼"
  },
  {
    id: "limpiador-vidrios",
    name: "Limpiador de Vidrios",
    category: "multiusos",
    notes: ["sin rayas", "brillo", "lavanda"],
    ml: 500,
    price: 10.90,
    description: "Cristales impecables sin manchas. Brillo perfecto.",
    featured: 6,
    status: "coming-soon",
    emoji: "🪟"
  }
];

// ===============================
// Helpers
// ===============================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const money = (n) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(n);

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function labelCategory(cat) {
  switch (cat) {
    case "multiusos": return "Multiusos";
    case "cocina": return "Cocina";
    case "baño": return "Baño";
    case "pisos": return "Pisos";
    default: return cat;
  }
}

const STORAGE_CART = "violeta_cart_v1";
const STORAGE_ORDERS = "violeta_orders_v1";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_CART)) || {}; }
  catch { return {}; }
}
function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || []; }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
}

// ===============================
// State
// ===============================
let cart = loadCart();
let searchText = "";
let category = "all";
let sortMode = "featured";

// ===============================
// Logic
// ===============================
function productMatches(p) {
  const hay = (p.name + " " + p.description + " " + p.notes.join(" ") + " " + p.category).toLowerCase();
  const okSearch = hay.includes(searchText.trim().toLowerCase());
  const okCat = category === "all" ? true : p.category === category;
  return okSearch && okCat;
}

function sortProducts(list) {
  const arr = [...list];
  switch (sortMode) {
    case "price-asc": return arr.sort((a, b) => a.price - b.price);
    case "price-desc": return arr.sort((a, b) => b.price - a.price);
    case "name-asc": return arr.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "featured":
    default: return arr.sort((a, b) => a.featured - b.featured);
  }
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return; // Guard clause

  const filtered = PRODUCTS.filter(productMatches);
  const sorted = sortProducts(filtered);

  const hint = $("#resultsHint");
  if (hint) {
    hint.textContent =
      sorted.length === 1
        ? "1 producto encontrado."
        : `${sorted.length} productos encontrados.`;
  }

  grid.innerHTML = sorted.map(p => {
    const isComingSoon = p.status === "coming-soon";

    let mediaContent;
    if (isComingSoon) {
      mediaContent = `
        <div class="coming-soon-wrapper">
           <span class="coming-soon-text-store">PRÓXIMAMENTE</span>
           <div class="emoji-blur-store">${p.emoji}</div>
        </div>
      `;
    } else {
      mediaContent = `
        <img src="${p.image}" alt="${escapeHtml(p.name)}" class="store-product-img">
        <div class="note">${p.notes[0]} • ${p.notes[1]}</div>
      `;
    }

    const priceDisplay = isComingSoon ? "Próximamente" : money(p.price);
    const btnState = isComingSoon ? "disabled" : "";
    const btnText = isComingSoon ? "No disponible" : "Añadir";

    return `
    <article class="card ${isComingSoon ? 'coming-soon-card' : ''}" onclick="void(0)">
      <div class="card-media">
        ${mediaContent}
      </div>
      <div class="card-body">
        <div class="title-row">
          <div>
            <h4>${escapeHtml(p.name)}</h4>
            <p class="small muted">${p.ml}ml • ${labelCategory(p.category)}</p>
          </div>
          <span class="tag">${labelCategory(p.category)}</span>
        </div>

        <p class="desc">${escapeHtml(p.description)}</p>

        <div class="meta">
          <div>
            <div class="price">${priceDisplay}</div>
            <p class="small muted">Notas: ${escapeHtml(p.notes.join(", "))}</p>
          </div>
          <button class="btn primary" data-add="${p.id}" ${btnState}>${btnText}</button>
        </div>
      </div>
    </article>
  `}).join("");

  // Add listeners
  $$("[data-add]").forEach(btn => {
    if (!btn.disabled) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(btn.dataset.add);
      });
    }
  });
}

// ===============================
// Cart Logic
// ===============================
function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  renderCart();
  openCart(true);
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart(cart);
  renderCart();
}

function setQty(productId, qty) {
  if (qty <= 0) return removeFromCart(productId);
  cart[productId] = qty;
  saveCart(cart);
  renderCart();
}

function cartItemsDetailed() {
  return Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);
}

function calcTotals() {
  const items = cartItemsDetailed();
  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const shipping = items.length ? 3.50 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function renderCart() {
  const itemsWrap = $("#cartItems");
  const empty = $("#cartEmpty");
  const countEl = $("#cartCount");

  if (!itemsWrap || !empty || !countEl) return;

  const items = cartItemsDetailed();
  countEl.textContent = String(items.reduce((a, i) => a + i.qty, 0));

  if (!items.length) {
    itemsWrap.innerHTML = "";
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    itemsWrap.innerHTML = items.map(it => `
      <div class="cart-item">
        <div>
          <h5>${escapeHtml(it.name)}</h5>
          <div class="sub">${it.ml}ml • ${money(it.price)} c/u</div>
          <div class="sub muted">Notas: ${escapeHtml(it.notes.join(", "))}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
          <div class="qty">
            <button aria-label="Restar" data-dec="${it.id}">−</button>
            <strong>${it.qty}</strong>
            <button aria-label="Sumar" data-inc="${it.id}">+</button>
          </div>
          <button class="btn remove" data-remove="${it.id}">Quitar</button>
        </div>
      </div>
    `).join("");

    $$("[data-dec]").forEach(b => b.addEventListener("click", () => setQty(b.dataset.dec, (cart[b.dataset.dec] || 1) - 1)));
    $$("[data-inc]").forEach(b => b.addEventListener("click", () => setQty(b.dataset.inc, (cart[b.dataset.inc] || 0) + 1)));
    $$("[data-remove]").forEach(b => b.addEventListener("click", () => removeFromCart(b.dataset.remove)));
  }

  const { subtotal, shipping, total } = calcTotals();
  const subEl = $("#subtotal");
  const shipEl = $("#shipping");
  const totEl = $("#total");

  if (subEl) subEl.textContent = money(subtotal);
  if (shipEl) shipEl.textContent = money(shipping);
  if (totEl) totEl.textContent = money(total);

  // Checkout payable updates
  const payEl = $("#payable");
  if (payEl) payEl.textContent = money(total);
  const couponHint = $("#couponHint");
  if (couponHint) couponHint.textContent = "";
}

// ===============================
// Drawer & Modals
// ===============================
function openCart(open) {
  const drawer = $("#cartDrawer");
  if (drawer) {
    drawer.classList.toggle("open", !!open);
    drawer.setAttribute("aria-hidden", String(!open));
  }
}

function openModal(modalId, open) {
  const modal = $(modalId);
  if (modal) {
    modal.classList.toggle("open", !!open);
    modal.setAttribute("aria-hidden", String(!open));
  }
}

function openCheckout() {
  const items = cartItemsDetailed();
  if (!items.length) return;
  const form = $("#checkoutForm");
  if (form) form.reset();

  const { total } = calcTotals();
  const payEl = $("#payable");
  if (payEl) payEl.textContent = money(total);
  const couponHint = $("#couponHint");
  if (couponHint) couponHint.textContent = "";

  openModal("#checkoutModal", true);
}

function renderOrders() {
  const list = $("#ordersList");
  if (!list) return;
  const orders = loadOrders();

  if (!orders.length) {
    list.innerHTML = `
      <div class="cart-empty">
        <p>No hay compras guardadas aún.</p>
        <p class="small">Cuando compres, aparecerán aquí.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = orders
    .slice().reverse()
    .map(o => `
      <div class="order">
        <div class="top">
          <div>
            <h5>#${escapeHtml(o.orderId)} • ${new Date(o.createdAt).toLocaleString("es-EC")}</h5>
            <div class="small muted">${escapeHtml(o.name)} • ${escapeHtml(o.paymentMethod)}</div>
            <div class="small muted">${escapeHtml(o.address)}</div>
          </div>
          <div><strong>${money(o.total)}</strong></div>
        </div>
        <ul>
          ${o.items.map(it => `<li>${escapeHtml(it.name)} × ${it.qty} (${money(it.price)} c/u)</li>`).join("")}
        </ul>
      </div>
    `)
    .join("");
}

// ===============================
// Checkout
// ===============================
function applyCoupon(total, code) {
  const normalized = (code || "").trim().toUpperCase();
  if (!normalized) return { total, discount: 0, note: "" };

  if (normalized === "VIOLETA10") {
    const discount = +(total * 0.10).toFixed(2);
    return { total: +(total - discount).toFixed(2), discount, note: "Cupón aplicado: 10% de descuento." };
  }
  if (normalized === "ENVIO0") {
    // descuento equivalente al envío cuando hay items
    const { shipping } = calcTotals();
    const discount = shipping;
    return { total: +(total - discount).toFixed(2), discount, note: "Cupón aplicado: envío gratis." };
  }
  return { total, discount: 0, note: "Cupón no válido." };
}

function finalizePurchase(formData) {
  const items = cartItemsDetailed();
  if (!items.length) return;

  const base = calcTotals();
  const coupon = applyCoupon(base.total, formData.coupon);

  const order = {
    orderId: Math.random().toString(16).slice(2, 10).toUpperCase(),
    createdAt: new Date().toISOString(),
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    paymentMethod: formData.paymentMethod,
    items: items.map(it => ({ id: it.id, name: it.name, qty: it.qty, price: it.price })),
    subtotal: base.subtotal,
    shipping: base.shipping,
    discount: coupon.discount,
    total: coupon.total
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  // Clear cart
  cart = {};
  saveCart(cart);
  renderCart();
  openModal("#checkoutModal", false);
  openCart(false);

  alert(
    `Compra confirmada.\n\nOrden #${order.orderId}\nTotal: ${money(order.total)}\n\n(Guardado en tu navegador.)`
  );
}

// ===============================
// Events
// ===============================
function initEvents() {
  try {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const searchInput = $("#searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchText = e.target.value;
        renderProducts();
      });
    }

    const catSelect = $("#categorySelect");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        category = e.target.value;
        renderProducts();
      });
    }

    const sortSelect = $("#sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        sortMode = e.target.value;
        renderProducts();
      });
    }

    // Cart open/close
    const openCartBtn = $("#openCartBtn");
    if (openCartBtn) openCartBtn.addEventListener("click", () => openCart(true));

    const closeCartBtn = $("#closeCartBtn");
    if (closeCartBtn) closeCartBtn.addEventListener("click", () => openCart(false));

    const closeCartOverlay = $("#closeCartOverlay");
    if (closeCartOverlay) closeCartOverlay.addEventListener("click", () => openCart(false));

    // Clear cart
    const clearCartBtn = $("#clearCartBtn");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        cart = {};
        saveCart(cart);
        renderCart();
      });
    }

    // Checkout
    const checkoutBtn = $("#checkoutBtn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

    const closeModalBtn = $("#closeModalBtn");
    if (closeModalBtn) closeModalBtn.addEventListener("click", () => openModal("#checkoutModal", false));

    const closeModalOverlay = $("#closeModalOverlay");
    if (closeModalOverlay) closeModalOverlay.addEventListener("click", () => openModal("#checkoutModal", false));

    const couponInput = $("#coupon");
    if (couponInput) {
      couponInput.addEventListener("input", (e) => {
        const { total } = calcTotals();
        const out = applyCoupon(total, e.target.value);
        const payEl = $("#payable");
        const hintEl = $("#couponHint");
        if (payEl) payEl.textContent = money(out.total);
        if (hintEl) hintEl.textContent = out.note + (out.discount ? ` Descuento: ${money(out.discount)}.` : "");
      });
    }

    const checkoutForm = $("#checkoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
          name: $("#name").value.trim(),
          phone: $("#phone").value.trim(),
          address: $("#address").value.trim(),
          paymentMethod: $("#paymentMethod").value,
          coupon: $("#coupon").value
        };
        finalizePurchase(data);
      });
    }

    // Orders
    const viewOrdersBtn = $("#viewOrdersBtn");
    if (viewOrdersBtn) {
      viewOrdersBtn.addEventListener("click", () => {
        renderOrders();
        openModal("#ordersModal", true);
      });
    }

    const closeOrdersBtn = $("#closeOrdersBtn");
    if (closeOrdersBtn) closeOrdersBtn.addEventListener("click", () => openModal("#ordersModal", false));

    const closeOrdersOverlay = $("#closeOrdersOverlay");
    if (closeOrdersOverlay) closeOrdersOverlay.addEventListener("click", () => openModal("#ordersModal", false));

    const clearOrdersBtn = $("#clearOrdersBtn");
    if (clearOrdersBtn) {
      clearOrdersBtn.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_ORDERS);
        renderOrders();
      });
    }

    // Esc to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        openCart(false);
        openModal("#checkoutModal", false);
        openModal("#ordersModal", false);
      }
    });
  } catch (e) {
    console.error("Init events failed", e);
  }
}

// ===============================
// Boot
// ===============================
// Ensure DOM is ready before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    initEvents();
  });
} else {
  renderProducts();
  renderCart();
  initEvents();
}
