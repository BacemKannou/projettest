// Catalogue de produits
const products = [
  {
    id: 1,
    name: "UltraBook Pro 14",
    category: "portable",
    price: 1299,
    icon: "💻",
    desc: "Léger, puissant, autonomie 12h. Idéal pour le travail nomade."
  },
  {
    id: 2,
    name: "GamerX RTX Edition",
    category: "fixe",
    price: 1899,
    icon: "🖥️",
    desc: "Tour gaming haute performance avec carte graphique dernière génération."
  },
  {
    id: 3,
    name: "SlimBook Air 13",
    category: "portable",
    price: 999,
    icon: "💻",
    desc: "Ultra fin, parfait pour les études et la bureautique."
  },
  {
    id: 4,
    name: "WorkStation Elite",
    category: "fixe",
    price: 2499,
    icon: "🖥️",
    desc: "Station de travail pour montage vidéo et modélisation 3D."
  },
  {
    id: 5,
    name: "Clavier Mécanique RGB",
    category: "accessoire",
    price: 89,
    icon: "⌨️",
    desc: "Switches mécaniques, rétroéclairage personnalisable."
  },
  {
    id: 6,
    name: "Souris Gamer Pro",
    category: "accessoire",
    price: 59,
    icon: "🖱️",
    desc: "Capteur haute précision, boutons programmables."
  },
  {
    id: 7,
    name: "Écran 27\" 4K",
    category: "accessoire",
    price: 349,
    icon: "🖥️",
    desc: "Dalle 4K UHD, idéal pour la création et la productivité."
  },
  {
    id: 8,
    name: "NoteBook Essential 15",
    category: "portable",
    price: 749,
    icon: "💻",
    desc: "Ordinateur portable polyvalent pour un usage quotidien."
  }
];

let cart = [];
let currentFilter = "tous";

const productGrid = document.getElementById("product-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartBtn = document.getElementById("cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total-value");

function formatPrice(value) {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function renderProducts() {
  const filtered = currentFilter === "tous"
    ? products
    : products.filter(p => p.category === currentFilter);

  productGrid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-image">${p.icon}</div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <span class="product-name">${p.name}</span>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-to-cart" data-id="${p.id}">Ajouter</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">&times;</button>
      </div>
    `).join("");
  }

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = formatPrice(totalPrice);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function changeQty(id, action) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  if (action === "increase") {
    item.qty++;
  } else if (action === "decrease") {
    item.qty--;
    if (item.qty <= 0) {
      cart = cart.filter(item => item.id !== id);
    }
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

// Filtres
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProducts();
  });
});

// Ajout au panier (délégation d'événement)
productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = Number(e.target.dataset.id);
    addToCart(id);
  }
});

// Actions dans le panier
cartItemsEl.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (e.target.classList.contains("qty-btn")) {
    changeQty(id, e.target.dataset.action);
  } else if (e.target.classList.contains("cart-item-remove")) {
    removeFromCart(id);
  }
});

// Ouverture / fermeture du panier
cartBtn.addEventListener("click", () => cartOverlay.classList.add("open"));
cartClose.addEventListener("click", () => cartOverlay.classList.remove("open"));
cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) cartOverlay.classList.remove("open");
});

// Commande
document.querySelector(".cart-checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }
  alert("Merci pour votre commande ! Un email de confirmation vous sera envoyé.");
  cart = [];
  renderCart();
  cartOverlay.classList.remove("open");
});

// Initialisation
renderProducts();
renderCart();
