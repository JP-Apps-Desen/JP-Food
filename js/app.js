
const WHATSAPP = "5511999999999";

const menu = [
  {
    id: 1,
    name: "X-Burger",
    category: "hamburgueres",
    description: "Pão, hambúrguer, queijo e molho especial.",
    price: 22.90,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
  },
  
{
  id: 2,
  name: "X-Bacon",
  category: "hamburgueres",
  description: "Hambúrguer, queijo, bacon e molho da casa.",
  price: 27.90,
  image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600"
},
  {
    id: 3,
    name: "Pizza Calabresa",
    category: "pizzas",
    description: "Calabresa, cebola e mussarela.",
    price: 42.90,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
  },
  {
    id: 4,
    name: "Pizza Mussarela",
    category: "pizzas",
    description: "Mussarela, tomate e orégano.",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600"
  },
  {
    id: 5,
    name: "Refrigerante",
    category: "bebidas",
    description: "Bebida gelada para acompanhar.",
    price: 7.00,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600"
  },
  {
    id: 6,
    name: "Suco Natural",
    category: "bebidas",
    description: "Suco refrescante.",
    price: 9.00,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600"
  }
];

let cart = [];
let selectedCategory = "todos";

const products = document.getElementById("products");
const search = document.getElementById("search");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("cart-modal");

function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderProducts() {
  const term = search.value.toLowerCase();

  const filtered = menu.filter(item => {
    const matchesCategory =
      selectedCategory === "todos" ||
      item.category === selectedCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  products.innerHTML = "";

  if (!filtered.length) {
    products.innerHTML =
      '<div class="empty">Nenhum produto encontrado.</div>';
    return;
  }

  filtered.forEach(item => {
    products.innerHTML += `
      <article class="product">
        <img src="${item.image}" alt="${item.name}"
          onerror="this.style.display='none'">
        <div class="product-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="product-bottom">
            <span class="price">${money(item.price)}</span>
            <button class="add-button"
              onclick="addToCart(${item.id})">+ Adicionar</button>
          </div>
        </div>
      </article>
    `;
  });
}

function addToCart(id) {
  const item = menu.find(product => product.id === id);
  const existing = cart.find(product => product.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...item, quantity: 1});
  }

  updateCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  updateCart();
}

function updateCart() {
  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = quantity;
  cartTotal.textContent = money(total);
  cartItems.innerHTML = "";

  if (!cart.length) {
    cartItems.innerHTML =
      '<p class="empty">Seu carrinho está vazio.</p>';
    return;
  }

  cart.forEach(item => {
    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>${money(item.price)} cada</small>
        </div>
        <div class="quantity">
          <button onclick="changeQuantity(${item.id}, -1)">−</button>
          ${item.quantity}
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  });
}

function openCart() {
  modal.classList.add("show");
}

function closeCart() {
  modal.classList.remove("show");
}

function sendOrder() {
  if (!cart.length) {
    alert("Adicione produtos ao carrinho.");
    return;
  }

  if (WHATSAPP === "5511999999999") {
    alert("Configure o número de WhatsApp do restaurante antes de usar.");
    return;
  }

  let message = "Olá! Gostaria de fazer este pedido:%0A%0A";

  cart.forEach(item => {
    message += `${item.quantity}x ${item.name} - ${money(item.price * item.quantity)}%0A`;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  message += `%0ATotal: ${money(total)}`;

  window.open(
    `https://wa.me/${WHATSAPP}?text=${message}`,
    "_blank"
  );
}

search.addEventListener("input", renderProducts);

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active")
      ?.classList.remove("active");

    button.classList.add("active");
    selectedCategory = button.dataset.category;
    renderProducts();
  });
});

renderProducts();
updateCart();

// Registro do Service Worker do DG Food
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(registration => {
        console.log(
          "DG Food: Service Worker registrado!",
          registration.scope
        );
      })
      .catch(error => {
        console.error(
          "Erro ao registrar Service Worker:",
          error
        );
      });
  });
}
