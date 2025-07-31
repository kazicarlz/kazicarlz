
 // DOM Elements
        const cartIcon = document.getElementById('cartIcon');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.querySelector('.close-cart');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const checkoutBtn = document.querySelector('.checkout-btn');

        // Cart state
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Open cart modal
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
        });

        // Close cart modal
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        // Add to cart functionality
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const name = button.dataset.name;
                const price = parseInt(button.dataset.price);
                const weight = button.dataset.weight;
                
                // Check if item is already in cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    // Increase quantity
                    existingItem.quantity++;
                } else {
                    // Add new item
                    cart.push({
                        id,
                        name,
                        price,
                        weight,
                        quantity: 1
                    });
                }
                
                // Save to localStorage
                saveCart();
                
                // Update cart UI
                updateCart();
                
                // Show cart modal
                cartModal.classList.add('active');
                
                // Show notification
                showNotification(`${name} added to cart!`);
            });
        });

        // Update cart UI
        function updateCart() {
            // Clear cart items
            cartItems.innerHTML = '';
            
            let total = 0;
            let count = 0;
            
            // Add items to cart
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                count += item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <i class="fas fa-gas-pump"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₦${item.price.toLocaleString()} (${item.weight})</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Update total and count
            cartTotal.textContent = total.toLocaleString();
            cartCount.textContent = count;
            
            // Add event listeners to new buttons
            document.querySelectorAll('.minus').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.dataset.id;
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.plus').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.dataset.id;
                    updateQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.dataset.id;
                    removeItem(id);
                });
            });
        }

        // Update item quantity
        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            
            if (item) {
                item.quantity += change;
                
                // Remove if quantity becomes 0
                if (item.quantity <= 0) {
                    cart = cart.filter(item => item.id !== id);
                }
                
                saveCart();
                updateCart();
            }
        }

        // Remove item from cart
        function removeItem(id) {
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCart();
        }

        // Save cart to localStorage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Show notification
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 15px 25px;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        // Checkout functionality
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            
            // In a real application, this would redirect to a checkout page
            alert('Thank you for your order! Your gas cylinders will be delivered soon.');
            
            // Clear cart
            cart = [];
            saveCart();
            updateCart();
            
            // Close cart
            cartModal.classList.remove('active');
        });

        // Initialize cart
        updateCart();