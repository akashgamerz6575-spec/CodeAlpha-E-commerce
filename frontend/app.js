document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const cartCounter = document.getElementById('cart-counter');
    
    // Cart Modal Elements
    const cartContainer = document.querySelector('.cart-container');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // State
    let products = [];
    let cart = JSON.parse(localStorage.getItem('techzone_cart')) || [];
    
    // API endpoints
    const API_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000' 
    : window.location.origin;
    const ORDERS_URL = 'http://localhost:3000/api/orders';

    /**
     * Format number as currency (USD)
     */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    /**
     * Fetch products from the backend API
     */
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            renderErrorState();
        }
    };

    /**
     * Render the products in the DOM
     */
    const renderProducts = () => {
        productGrid.innerHTML = '';
        
        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div class="error-state">
                    <h3>No products found</h3>
                    <p>Check back later for new inventory.</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="card-footer">
                        <span class="product-price">${formatCurrency(product.price)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            
            productGrid.appendChild(card);
        });

        attachCartListeners();
    };

    const renderErrorState = () => {
        productGrid.innerHTML = `
            <div class="error-state">
                <h3>Oops! Something went wrong.</h3>
                <p>We couldn't load the products. Please ensure the backend server is running.</p>
            </div>
        `;
    };

    /**
     * Handle "Add to Cart"
     */
    const attachCartListeners = () => {
        const buttons = document.querySelectorAll('.add-to-cart-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    cart.push(product);
                    updateCartUI();
                    
                    // Visual feedback
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Added!';
                    e.target.style.background = '#10b981';
                    
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.style.background = '';
                    }, 1500);
                }
            });
        });
    };

    /**
     * Toggle Cart Modal
     */
    const toggleCartModal = () => {
        cartModalOverlay.classList.toggle('active');
        cartModal.classList.toggle('active');
    };

    cartContainer.addEventListener('click', toggleCartModal);
    closeCartBtn.addEventListener('click', toggleCartModal);
    cartModalOverlay.addEventListener('click', toggleCartModal);

    /**
     * Update Cart UI & State
     */
    const updateCartUI = () => {
        // Persist cart to localStorage
        localStorage.setItem('techzone_cart', JSON.stringify(cart));
        
        cartCounter.textContent = cart.length;
        renderCartItems();
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            cartTotalPrice.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                </div>
                <button class="remove-item-btn" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalPrice.textContent = formatCurrency(total);

        // Attach remove listeners
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    };

    /**
     * Handle Checkout
     */
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) return;
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        // Show loading state on button
        const originalBtnText = checkoutBtn.textContent;
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cart, total: total })
            });

            if (!response.ok) {
                throw new Error('Checkout failed');
            }

            const data = await response.json();
            
            // Success!
            alert(`Thank you for your order!\n\nOrder ID: ${data.orderId}\nTotal: ${formatCurrency(total)}`);
            
            // Reset
            cart = [];
            localStorage.removeItem('techzone_cart');
            updateCartUI();
            toggleCartModal();
            
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            checkoutBtn.textContent = originalBtnText;
            checkoutBtn.disabled = false;
        }
    });

    // Initialize application
    fetchProducts();
    updateCartUI();
});
