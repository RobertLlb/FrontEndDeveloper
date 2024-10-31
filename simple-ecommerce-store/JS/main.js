
const products = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      price: 24.99,
      description: "Sustainable stainless steel water bottle",
      image: "bottle"
    },
    {
      id: 2,
      name: "Bamboo Utensil Set",
      price: 18.99,
      description: "Reusable bamboo cutlery set",
      image: "utensils"
    },
    {
      id: 3,
      name: "Organic Cotton Tote",
      price: 15.99,
      description: "100% organic cotton shopping bag",
      image: "tote"
    },
    {
      id: 4,
      name: "Beeswax Food Wraps",
      price: 22.99,
      description: "Natural alternative to plastic wrap",
      image: "wraps"
    }
  ];

  let cart = [];

  // Initialize Stripe
  const stripe = Stripe('your_publishable_key');

  function renderProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => `
  <div class="product-card">
    <div class="product-image">
      <svg width="100" height="100" viewBox="0 0 100 100">
        ${getProductIcon(product.image)}
      </svg>
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <button class="add-to-cart" onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  </div>
`).join('');
  }

  function getProductIcon(type) {
    const icons = {
      bottle: `<path d="M20,10V8h-4V4h-2v4h-4v2h4v12h2V10H20z" fill="#81C784"/>`,
      utensils: `<path d="M11,9H9V2H7v7H5V2H3v7c0,2.12,1.66,3.84,3.75,3.97V22h2.5v-9.03C11.34,12.84,13,11.12,13,9V2h-2V9z" fill="#81C784"/>`,
      tote: `<path d="M18,6h-2c0-2.21-1.79-4-4-4S8,3.79,8,6H6C4.9,6,4,6.9,4,8v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8C20,6.9,19.1,6,18,6z M12,4c1.1,0,2,0.9,2,2h-4C10,4.9,10.9,4,12,4z" fill="#81C784"/>`,
      wraps: `<path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M3,18.5V7 c1.1-0.35,2.3-0.5,3.5-0.5c1.34,0,3.13,0.41,4.5,0.99v11.5C9.63,18.41,7.84,18,6.5,18C5.3,18,4.1,18.15,3,18.5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.34,0-3.13,0.41-4.5,0.99V7.49c1.37-0.59,3.16-0.99,4.5-0.99c1.2,0,2.4,0.15,3.5,0.5V18.5z" fill="#81C784"/>`,
    };
    return icons[type] || icons.tote;
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
  }

  function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartItems.innerHTML = cart.map(item => `
  <div class="cart-item">
    <div class="cart-item-image">
      <svg width="50" height="50" viewBox="0 0 100 100">
        ${getProductIcon(item.image)}
      </svg>
    </div>
    <div>
      <h4>${item.name}</h4>
      <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
      <button onclick="removeFromCart(${item.id})" style="color:red;background:none;border:none;cursor:pointer">Remove</button>
    </div>
  </div>
`).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
  }

  // Cart toggle functionality
  const cartModal = document.getElementById('cartModal');
  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');

  cartToggle.addEventListener('click', () => {
    cartModal.classList.add('open');
  });

  closeCart.addEventListener('click', () => {
    cartModal.classList.remove('open');
  });

  // Search functionality
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
  });

  // Checkout handler
  document.getElementById('checkout').addEventListener('click', async () => {
    try {
      // Here you would typically make an API call to your backend
      // to create a Stripe session and redirect to Stripe Checkout
      alert('Redirecting to checkout...');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your payment. Please try again.');
    }
  });

  // Mobile navigation functionality
  const navItems = document.querySelectorAll('.mobile-nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Handle navigation actions
      switch (item.id) {
        case 'nav-home':
          renderProducts(products);
          break;
        case 'nav-categories':
          // Add categories functionality
          alert('Categories coming soon!');
          break;
        case 'nav-profile':
          // Add profile functionality
          alert('Profile coming soon!');
          break;
      }
    });
  });

  // Initial render
  renderProducts(products);
