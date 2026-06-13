// ==========================================
// TELEGRAM SOZLAMALARI (Shu yerni o'zgartiring)
// ==========================================
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

// ==========================================
// STATE & STORE MANAGEMENT
// ==========================================
const Store = {
    state: {
        view: 'shop-home',
        theme: localStorage.getItem('theme') || 'light',
        user: JSON.parse(localStorage.getItem('user')) || null,
        users: JSON.parse(localStorage.getItem('users')) || [],
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        products: JSON.parse(localStorage.getItem('products')) || [
            { id: 1, name: "Midnight Silk Blazer", category: "Outerwear", price: 450, size: ["M", "L", "XL"], color: "Black", stock: 15, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80", description: "Impeccably tailored silk blazer with satin lapels." },
            { id: 2, name: "Cashmere Turtleneck", category: "Knitwear", price: 280, size: ["S", "M", "L"], color: "Cream", stock: 24, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80", description: "Pure Mongolian cashmere, ethically sourced." },
            { id: 3, name: "Pleated Wool Trousers", category: "Bottoms", price: 195, size: ["30", "32", "34", "36"], color: "Charcoal", stock: 30, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80", description: "High-waisted pleated trousers in premium Italian wool." },
            { id: 4, name: "Oxford Cotton Shirt", category: "Shirts", price: 120, size: ["S", "M", "L", "XL"], color: "White", stock: 50, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", description: "Classic fit oxford shirt with mother-of-pearl buttons." },
            { id: 5, name: "Leather Chelsea Boots", category: "Footwear", price: 320, size: ["8", "9", "10", "11"], color: "Brown", stock: 12, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80", description: "Hand-stitched full-grain leather with rubber soles." },
            { id: 6, name: "Structured Wool Coat", category: "Outerwear", price: 550, size: ["M", "L"], color: "Camel", stock: 8, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80", description: "Double-breasted wool coat with gold-tone hardware." }
        ],
        orders: JSON.parse(localStorage.getItem('orders')) || [
            { id: "ORD-7782", customer: "Eleanor Vance", email: "eleanor@example.com", total: 730, status: "Completed", date: "2023-10-24", items: 2 },
            { id: "ORD-7783", customer: "Marcus Chen", email: "marcus@example.com", total: 450, status: "Pending", date: "2023-10-25", items: 1 }
        ],
        customers: JSON.parse(localStorage.getItem('customers')) || [
            { id: 1, name: "Eleanor Vance", email: "eleanor@example.com", spent: 1250, orders: 3, joined: "2023-01-15" },
            { id: 2, name: "Marcus Chen", email: "marcus@example.com", spent: 890, orders: 2, joined: "2023-03-22" }
        ]
    },
    
    save() {
        localStorage.setItem('theme', this.state.theme);
        localStorage.setItem('user', JSON.stringify(this.state.user));
        localStorage.setItem('users', JSON.stringify(this.state.users));
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
        localStorage.setItem('products', JSON.stringify(this.state.products));
        localStorage.setItem('orders', JSON.stringify(this.state.orders));
        localStorage.setItem('customers', JSON.stringify(this.state.customers));
    },
    
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', this.state.theme === 'dark');
        this.save();
        Router.render();
    },
    
    register(name, email, password) {
        if (email === 'admin@aura.com') return false;
        if (this.state.users.find(u => u.email === email)) return false;
        
        const newUser = { name, email, password, role: 'User', joined: new Date().toISOString().split('T')[0] };
        this.state.users.push(newUser);
        this.state.user = { name, email, role: 'User' };
        this.save();
        return true;
    },
    
    login(email, password) {
        if (email === 'admin@aura.com' && password === 'admin123') {
            this.state.user = { name: 'Admin User', email, role: 'Admin' };
            this.save();
            return true;
        }
        const user = this.state.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.state.user = { name: user.name, email: user.email, role: 'User' };
            this.save();
            return true;
        }
        return false;
    },
    
    logout() {
        this.state.user = null;
        this.save();
        Router.navigate('shop-home');
    },
    
    addToCart(product, size, color, qty = 1) {
        const existing = this.state.cart.find(i => i.id === product.id && i.size === size && i.color === color);
        if (existing) {
            existing.qty += qty;
        } else {
            this.state.cart.push({ ...product, size, color, qty });
        }
        this.save();
        alert('Added to cart!');
    },
    
    removeFromCart(index) {
        this.state.cart.splice(index, 1);
        this.save();
        Router.render();
    },
    
    updateCartQty(index, qty) {
        if (qty < 1) return this.removeFromCart(index);
        this.state.cart[index].qty = qty;
        this.save();
        Router.render();
    },
    
    getCartTotal() {
        return this.state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
};

// ==========================================
// ROUTER & VIEW MANAGEMENT
// ==========================================
const Router = {
    navigate(view, params = {}) {
        Store.state.view = view;
        Store.state.viewParams = params;
        window.scrollTo(0, 0);
        this.render();
    },
    
    render() {
        const app = document.getElementById('app');
        document.documentElement.classList.toggle('dark', Store.state.theme === 'dark');
        
        let html = '';
        switch (Store.state.view) {
            case 'shop-home': html = Views.shopHome(); break;
            case 'shop-catalog': html = Views.shopCatalog(); break;
            case 'shop-product': html = Views.shopProduct(Store.state.viewParams); break;
            case 'shop-cart': html = Views.shopCart(); break;
            case 'shop-checkout': html = Views.shopCheckout(); break;
            case 'shop-confirmation': html = Views.shopConfirmation(); break;
            case 'shop-login': html = Views.shopLogin(); break;
            case 'shop-register': html = Views.shopRegister(); break;
            case 'admin-login': html = Views.adminLogin(); break;
            case 'admin-dashboard': html = Views.adminLayout('dashboard'); break;
            case 'admin-products': html = Views.adminLayout('products'); break;
            case 'admin-orders': html = Views.adminLayout('orders'); break;
            case 'admin-customers': html = Views.adminLayout('customers'); break;
            default: html = Views.shopHome();
        }
        app.innerHTML = html;
        
        if (Store.state.view === 'admin-dashboard') this.initCharts();
    },
    
    initCharts() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12500, 19000, 15000, 22000, 28000, 32000],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
};

// ==========================================
// VIEW COMPONENTS
// ==========================================
const Views = {
    navbar() {
        const user = Store.state.user;
        const isAdmin = user && user.role === 'Admin';
        const cartCount = Store.state.cart.reduce((sum, i) => sum + i.qty, 0);
        
        return `
            <nav class="fixed top-0 w-full z-50 glass border-b border-slate-200 dark:border-slate-800 transition-all-300">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center cursor-pointer" onclick="Router.navigate('shop-home')">
                            <span class="font-serif text-2xl font-bold tracking-wider text-slate-900 dark:text-white">AURA</span>
                            ${isAdmin ? '<span class="ml-2 px-2 py-0.5 text-xs font-semibold bg-gold-500 text-white rounded">ERP</span>' : ''}
                        </div>
                        
                        <div class="hidden md:flex items-center space-x-8">
                            ${isAdmin ? `
                                <button onclick="Router.navigate('admin-dashboard')" class="text-sm font-medium hover:text-gold-500 transition-colors">Dashboard</button>
                                <button onclick="Router.navigate('admin-products')" class="text-sm font-medium hover:text-gold-500 transition-colors">Products</button>
                                <button onclick="Router.navigate('admin-orders')" class="text-sm font-medium hover:text-gold-500 transition-colors">Orders</button>
                                <button onclick="Router.navigate('admin-customers')" class="text-sm font-medium hover:text-gold-500 transition-colors">Customers</button>
                            ` : `
                                <button onclick="Router.navigate('shop-home')" class="text-sm font-medium hover:text-gold-500 transition-colors">Home</button>
                                <button onclick="Router.navigate('shop-catalog')" class="text-sm font-medium hover:text-gold-500 transition-colors">Catalog</button>
                            `}
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <button onclick="Store.toggleTheme()" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                <i class="fas ${Store.state.theme === 'dark' ? 'fa-sun text-gold-400' : 'fa-moon text-slate-600'}"></i>
                            </button>
                            
                            ${!isAdmin ? `
                                <button onclick="Router.navigate('shop-cart')" class="relative p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <i class="fas fa-shopping-bag text-slate-700 dark:text-slate-300"></i>
                                    ${cartCount > 0 ? `<span class="absolute top-0 right-0 bg-gold-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">${cartCount}</span>` : ''}
                                </button>
                                ${user ? `
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">${user.name}</span>
                                    <button onclick="Store.logout()" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500">Logout</button>
                                ` : `
                                    <button onclick="Router.navigate('shop-login')" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-gold-500">Login</button>
                                    <button onclick="Router.navigate('shop-register')" class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300">Register</button>
                                `}
                            ` : `
                                <button onclick="Store.logout()" class="text-sm font-medium text-red-500 hover:text-red-600">Logout</button>
                            `}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    },

    shopHome() {
        return `
            ${this.navbar()}
            <main class="pt-16 animate-fade-in">
                <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80" class="w-full h-full object-cover" alt="Hero">
                        <div class="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
                    </div>
                    <div class="relative z-10 text-center text-white px-4 animate-slide-up">
                        <p class="text-gold-400 font-medium tracking-[0.2em] mb-4 uppercase text-sm">Autumn / Winter 2024</p>
                        <h1 class="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">Elevate Your <br/>Everyday Essence</h1>
                        <p class="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light">Discover our curated collection of premium garments, crafted for those who appreciate the finer details.</p>
                        <button onclick="Router.navigate('shop-catalog')" class="px-8 py-4 bg-white text-slate-900 font-semibold rounded-sm hover:bg-gold-500 hover:text-white transition-all-300 transform hover:scale-105">
                            Explore Collection
                        </button>
                    </div>
                </section>
                <section class="max-w-7xl mx-auto px-4 py-20">
                    <div class="text-center mb-12">
                        <h2 class="font-serif text-3xl md:text-4xl font-bold mb-4">Curated Selection</h2>
                        <div class="w-20 h-1 bg-gold-500 mx-auto"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        ${Store.state.products.slice(0, 3).map(p => this.productCard(p)).join('')}
                    </div>
                </section>
            </main>
            ${this.footer()}
        `;
    },
    
    shopCatalog() {
        const categories = [...new Set(Store.state.products.map(p => p.category))];
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
                <div class="flex flex-col lg:flex-row gap-8">
                    <aside class="w-full lg:w-64 flex-shrink-0">
                        <div class="glass p-6 rounded-xl sticky top-24">
                            <h3 class="font-serif text-xl font-bold mb-6">Filters</h3>
                            <div class="mb-6">
                                <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-500">Category</h4>
                                <div class="space-y-2">
                                    ${categories.map(c => `
                                        <label class="flex items-center space-x-2 cursor-pointer">
                                            <input type="checkbox" class="rounded border-slate-300 text-gold-500 focus:ring-gold-500" onchange="Views.filterCatalog()">
                                            <span class="text-sm">${c}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="mb-6">
                                <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-500">Price Range</h4>
                                <input type="range" min="0" max="1000" class="w-full accent-gold-500" oninput="document.getElementById('priceVal').innerText = '$' + this.value; Views.filterCatalog()">
                                <div class="flex justify-between text-sm text-slate-500 mt-2">
                                    <span>$0</span>
                                    <span id="priceVal">$500</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="font-serif text-2xl font-bold">All Products</h2>
                            <span class="text-sm text-slate-500">${Store.state.products.length} items</span>
                        </div>
                        <div id="catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${Store.state.products.map(p => this.productCard(p)).join('')}
                        </div>
                    </div>
                </div>
            </main>
            ${this.footer()}
        `;
    },
    
    productCard(product) {
        return `
            <div class="group cursor-pointer" onclick="Router.navigate('shop-product', {id: ${product.id}})">
                <div class="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-[3/4] mb-4">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <button class="absolute bottom-4 left-4 right-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all-300 shadow-lg">
                        Quick View
                    </button>
                </div>
                <h3 class="font-serif text-lg font-semibold group-hover:text-gold-500 transition-colors">${product.name}</h3>
                <p class="text-slate-500 text-sm mb-2">${product.category}</p>
                <p class="font-medium text-lg">$${product.price}</p>
            </div>
        `;
    },
    
    shopProduct(params) {
        const product = Store.state.products.find(p => p.id === params.id);
        if (!product) return this.shopCatalog();
        
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
                <button onclick="Router.navigate('shop-catalog')" class="mb-6 text-sm text-slate-500 hover:text-gold-500 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Back to Catalog
                </button>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div class="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/5]">
                        <img src="${product.image}" class="w-full h-full object-cover" alt="${product.name}">
                    </div>
                    <div class="flex flex-col justify-center">
                        <p class="text-gold-500 font-medium tracking-wider uppercase text-sm mb-2">${product.category}</p>
                        <h1 class="font-serif text-4xl md:text-5xl font-bold mb-4">${product.name}</h1>
                        <p class="text-3xl font-light mb-6">$${product.price}</p>
                        <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">${product.description}</p>
                        <div class="space-y-6 mb-8">
                            <div>
                                <label class="block text-sm font-semibold mb-2">Color: <span class="font-normal text-slate-500">${product.color}</span></label>
                                <div class="flex gap-2">
                                    <div class="w-8 h-8 rounded-full border-2 border-gold-500 cursor-pointer" style="background-color: ${product.color.toLowerCase() === 'white' ? '#fff' : product.color.toLowerCase()}"></div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold mb-2">Size</label>
                                <div class="flex gap-2">
                                    ${product.size.map(s => `
                                        <button class="size-btn w-12 h-12 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-gold-500 hover:text-gold-500 transition-colors flex items-center justify-center font-medium" onclick="Views.selectSize(this)">${s}</button>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold mb-2">Quantity</label>
                                <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg w-32">
                                    <button class="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onclick="Views.adjustQty(-1)">-</button>
                                    <input type="number" id="product-qty" value="1" class="w-full text-center bg-transparent border-none focus:ring-0" readonly>
                                    <button class="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onclick="Views.adjustQty(1)">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <button onclick="Views.addToCartFromDetail(${product.id})" class="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-lg font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300">
                                Add to Cart
                            </button>
                            <button class="px-4 py-4 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-colors">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            ${this.footer()}
        `;
    },
    
    shopCart() {
        const total = Store.getCartTotal();
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 max-w-4xl mx-auto px-4 animate-fade-in">
                <h1 class="font-serif text-3xl font-bold mb-8">Shopping Cart</h1>
                ${Store.state.cart.length === 0 ? `
                    <div class="text-center py-20 glass rounded-2xl">
                        <i class="fas fa-shopping-bag text-4xl text-slate-300 mb-4"></i>
                        <p class="text-slate-500 mb-6">Your cart is empty</p>
                        <button onclick="Router.navigate('shop-catalog')" class="px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors">Continue Shopping</button>
                    </div>
                ` : `
                    <div class="glass rounded-2xl overflow-hidden mb-8">
                        ${Store.state.cart.map((item, idx) => `
                            <div class="p-6 flex flex-col sm:flex-row gap-6 border-b border-slate-200 dark:border-slate-800 last:border-0">
                                <img src="${item.image}" class="w-24 h-24 object-cover rounded-lg bg-slate-100">
                                <div class="flex-1">
                                    <h3 class="font-serif text-lg font-semibold">${item.name}</h3>
                                    <p class="text-sm text-slate-500 mb-2">${item.color} / ${item.size}</p>
                                    <p class="font-medium">$${item.price}</p>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg">
                                        <button class="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800" onclick="Store.updateCartQty(${idx}, ${item.qty - 1})">-</button>
                                        <span class="px-3 py-1 min-w-[2rem] text-center">${item.qty}</span>
                                        <button class="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800" onclick="Store.updateCartQty(${idx}, ${item.qty + 1})">+</button>
                                    </div>
                                    <button onclick="Store.removeFromCart(${idx})" class="text-slate-400 hover:text-red-500 transition-colors">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="glass rounded-2xl p-6 max-w-md ml-auto">
                        <div class="flex justify-between mb-4 text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between mb-6 text-slate-600 dark:text-slate-400">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div class="flex justify-between mb-6 text-xl font-bold border-t border-slate-200 dark:border-slate-800 pt-4">
                            <span>Total</span>
                            <span class="text-gold-500">$${total.toFixed(2)}</span>
                        </div>
                        <button onclick="Router.navigate('shop-checkout')" class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300">
                            Proceed to Checkout
                        </button>
                    </div>
                `}
            </main>
            ${this.footer()}
        `;
    },
    
    shopCheckout() {
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 max-w-3xl mx-auto px-4 animate-fade-in">
                <h1 class="font-serif text-3xl font-bold mb-8">Checkout</h1>
                <form onsubmit="Views.processCheckout(event)" class="glass rounded-2xl p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">Full Name</label>
                            <input type="text" id="checkout-name" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Phone Number</label>
                            <input type="tel" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Email Address</label>
                        <input type="email" id="checkout-email" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Card Number</label>
                        <div class="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all pl-12">
                            <i class="fab fa-cc-visa absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">CVC</label>
                            <input type="text" placeholder="123" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all">
                        </div>
                    </div>
                    <div class="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div class="flex justify-between text-xl font-bold mb-6">
                            <span>Total to Pay</span>
                            <span class="text-gold-500">$${Store.getCartTotal().toFixed(2)}</span>
                        </div>
                        <button type="submit" id="checkout-btn" class="w-full py-4 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition-all-300 flex items-center justify-center gap-2">
                            <span>Complete Order</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </form>
            </main>
            ${this.footer()}
        `;
    },
    
    shopConfirmation() {
        Store.state.cart = [];
        Store.save();
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 min-h-screen flex items-center justify-center px-4 animate-fade-in">
                <div class="text-center max-w-md">
                    <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-check text-3xl text-green-500"></i>
                    </div>
                    <h1 class="font-serif text-4xl font-bold mb-4">Order Confirmed!</h1>
                    <p class="text-slate-600 dark:text-slate-400 mb-8">Thank you for your purchase. Your order has been received and is being processed.</p>
                    <div class="glass rounded-xl p-6 mb-8 text-left">
                        <p class="text-sm text-slate-500 mb-1">Order Number</p>
                        <p class="font-mono font-semibold mb-4">#ORD-${Math.floor(Math.random() * 9000) + 1000}</p>
                        <p class="text-sm text-slate-500 mb-1">Estimated Delivery</p>
                        <p class="font-semibold">3-5 Business Days</p>
                    </div>
                    <button onclick="Router.navigate('shop-home')" class="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300">
                        Continue Shopping
                    </button>
                </div>
            </main>
            ${this.footer()}
        `;
    },

    shopLogin() {
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 min-h-screen flex items-center justify-center px-4 animate-fade-in">
                <div class="w-full max-w-md">
                    <div class="text-center mb-8">
                        <span class="font-serif text-3xl font-bold tracking-wider">AURA</span>
                        <p class="text-slate-500 mt-2">Welcome Back</p>
                    </div>
                    <div class="glass rounded-2xl p-8 shadow-xl">
                        <form onsubmit="Views.handleUserLogin(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Email</label>
                                <input type="email" id="login-email" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Password</label>
                                <input type="password" id="login-password" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <button type="submit" class="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300 mt-6">
                                Sign In
                            </button>
                        </form>
                        <div class="mt-6 text-center text-sm">
                            <span class="text-slate-500">Don't have an account?</span>
                            <button onclick="Router.navigate('shop-register')" class="text-gold-500 hover:underline font-medium ml-1">Register</button>
                        </div>
                    </div>
                </div>
            </main>
            ${this.footer()}
        `;
    },
    
    shopRegister() {
        return `
            ${this.navbar()}
            <main class="pt-24 pb-20 min-h-screen flex items-center justify-center px-4 animate-fade-in">
                <div class="w-full max-w-md">
                    <div class="text-center mb-8">
                        <span class="font-serif text-3xl font-bold tracking-wider">AURA</span>
                        <p class="text-slate-500 mt-2">Create Your Account</p>
                    </div>
                    <div class="glass rounded-2xl p-8 shadow-xl">
                        <form onsubmit="Views.handleUserRegister(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Full Name</label>
                                <input type="text" id="reg-name" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Email</label>
                                <input type="email" id="reg-email" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Password</label>
                                <input type="password" id="reg-password" required class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <button type="submit" class="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300 mt-6">
                                Create Account
                            </button>
                        </form>
                        <div class="mt-6 text-center text-sm">
                            <span class="text-slate-500">Already have an account?</span>
                            <button onclick="Router.navigate('shop-login')" class="text-gold-500 hover:underline font-medium ml-1">Sign In</button>
                        </div>
                    </div>
                </div>
            </main>
            ${this.footer()}
        `;
    },

    adminLogin() {
        return `
            <div class="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 animate-fade-in">
                <div class="w-full max-w-md">
                    <div class="text-center mb-8">
                        <span class="font-serif text-3xl font-bold tracking-wider">AURA</span>
                        <p class="text-slate-500 mt-2">Enterprise Resource Planning</p>
                    </div>
                    <div class="glass rounded-2xl p-8 shadow-xl">
                        <h2 class="text-2xl font-bold mb-6 text-center">Admin Access</h2>
                        <form onsubmit="Views.handleAdminLogin(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Email</label>
                                <input type="email" id="admin-email" value="admin@aura.com" class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Password</label>
                                <input type="password" id="admin-password" value="admin123" class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-gold-500 outline-none">
                            </div>
                            <button type="submit" class="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all-300 mt-6">
                                Sign In
                            </button>
                        </form>
                        <div class="mt-6 text-center">
                            <button onclick="Router.navigate('shop-home')" class="text-sm text-slate-500 hover:text-gold-500">← Back to Store</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    adminLayout(section) {
        if (!Store.state.user || Store.state.user.role !== 'Admin') {
            setTimeout(() => Router.navigate('admin-login'), 100);
            return '<div class="min-h-screen flex items-center justify-center">Redirecting...</div>';
        }
        
        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'products', label: 'Products', icon: 'fa-box' },
            { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
            { id: 'customers', label: 'Customers', icon: 'fa-users' }
        ];
        
        let content = '';
        switch(section) {
            case 'dashboard': content = this.adminDashboard(); break;
            case 'products': content = this.adminProducts(); break;
            case 'orders': content = this.adminOrders(); break;
            case 'customers': content = this.adminCustomers(); break;
        }
        
        return `
            <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex animate-fade-in">
                <aside class="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-40 hidden md:block">
                    <div class="p-6 border-b border-slate-200 dark:border-slate-800">
                        <span class="font-serif text-2xl font-bold tracking-wider">AURA <span class="text-gold-500 text-sm align-top">ERP</span></span>
                    </div>
                    <nav class="p-4 space-y-1">
                        ${navItems.map(item => `
                            <button onclick="Router.navigate('admin-${item.id}')" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === item.id ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                <i class="fas ${item.icon} w-5"></i>
                                ${item.label}
                            </button>
                        `).join('')}
                    </nav>
                </aside>
                <div class="md:hidden fixed top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 p-4 flex justify-between items-center">
                    <span class="font-serif text-xl font-bold">AURA ERP</span>
                    <button onclick="Store.logout()" class="text-sm text-red-500">Logout</button>
                </div>
                <main class="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
                    <div class="flex justify-between items-center mb-8">
                        <h1 class="text-2xl font-bold capitalize">${section}</h1>
                        <div class="flex items-center gap-4">
                            <button onclick="Store.toggleTheme()" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                                <i class="fas ${Store.state.theme === 'dark' ? 'fa-sun text-gold-400' : 'fa-moon text-slate-600'}"></i>
                            </button>
                            <div class="text-right hidden sm:block">
                                <p class="text-sm font-semibold">${Store.state.user.name}</p>
                                <p class="text-xs text-slate-500">${Store.state.user.role}</p>
                            </div>
                        </div>
                    </div>
                    ${content}
                </main>
            </div>
        `;
    },
    
    adminDashboard() {
        const totalRevenue = Store.state.orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
        const totalOrders = Store.state.orders.length;
        const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;
        
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="glass p-6 rounded-xl border-l-4 border-gold-500">
                        <p class="text-sm text-slate-500 mb-1">Total Revenue</p>
                        <p class="text-3xl font-bold">$${totalRevenue.toLocaleString()}</p>
                        <p class="text-xs text-green-500 mt-2"><i class="fas fa-arrow-up"></i> 12% from last month</p>
                    </div>
                    <div class="glass p-6 rounded-xl border-l-4 border-blue-500">
                        <p class="text-sm text-slate-500 mb-1">Total Orders</p>
                        <p class="text-3xl font-bold">${totalOrders}</p>
                        <p class="text-xs text-green-500 mt-2"><i class="fas fa-arrow-up"></i> 8% from last month</p>
                    </div>
                    <div class="glass p-6 rounded-xl border-l-4 border-purple-500">
                        <p class="text-sm text-slate-500 mb-1">Active Customers</p>
                        <p class="text-3xl font-bold">${Store.state.customers.length}</p>
                        <p class="text-xs text-slate-400 mt-2">Lifetime value tracking</p>
                    </div>
                    <div class="glass p-6 rounded-xl border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-500 mb-1">Avg. Order Value</p>
                        <p class="text-3xl font-bold">$${avgOrder}</p>
                        <p class="text-xs text-red-500 mt-2"><i class="fas fa-arrow-down"></i> 2% from last month</p>
                    </div>
                </div>
                <div class="glass p-6 rounded-xl">
                    <h3 class="font-semibold mb-4">Revenue Overview</h3>
                    <div class="h-80">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    },
    
    adminProducts() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div class="relative">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" placeholder="Search products..." class="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-gold-500 outline-none w-64">
                    </div>
                    <button onclick="Views.showAddProductModal()" class="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors flex items-center gap-2">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
                <div class="glass rounded-xl overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                            <tr>
                                <th class="px-6 py-3 font-medium">Product</th>
                                <th class="px-6 py-3 font-medium">Category</th>
                                <th class="px-6 py-3 font-medium">Price</th>
                                <th class="px-6 py-3 font-medium">Stock</th>
                                <th class="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                            ${Store.state.products.map(p => `
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <img src="${p.image}" class="w-10 h-10 rounded object-cover bg-slate-100">
                                            <span class="font-medium">${p.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-500">${p.category}</td>
                                    <td class="px-6 py-4 font-medium">$${p.price}</td>
                                    <td class="px-6 py-4">
                                        <span class="${p.stock < 10 ? 'text-red-500 font-semibold' : 'text-slate-600 dark:text-slate-400'}">${p.stock} units</span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-2">
                                        <button onclick="Views.editProduct(${p.id})" class="text-blue-500 hover:text-blue-600"><i class="fas fa-edit"></i></button>
                                        <button onclick="Views.deleteProduct(${p.id})" class="text-red-500 hover:text-red-600"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="product-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-slide-up">
                    <h3 class="text-xl font-bold mb-4">Add New Product</h3>
                    <form onsubmit="Views.saveProduct(event)" class="space-y-4">
                        <input type="hidden" id="edit-product-id">
                        <div><label class="block text-sm font-medium mb-1">Product Name</label><input type="text" id="p-name" required class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-gold-500"></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm font-medium mb-1">Category</label><input type="text" id="p-category" required class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-gold-500"></div>
                            <div><label class="block text-sm font-medium mb-1">Price ($)</label><input type="number" id="p-price" required class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-gold-500"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm font-medium mb-1">Stock</label><input type="number" id="p-stock" required class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-gold-500"></div>
                            <div><label class="block text-sm font-medium mb-1">Image URL</label><input type="url" id="p-image" required class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-gold-500"></div>
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onclick="document.getElementById('product-modal').classList.add('hidden')" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                            <button type="submit" class="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors">Save Product</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    
    adminOrders() {
        return `
            <div class="glass rounded-xl overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                        <tr>
                            <th class="px-6 py-3 font-medium">Order ID</th>
                            <th class="px-6 py-3 font-medium">Customer</th>
                            <th class="px-6 py-3 font-medium">Date</th>
                            <th class="px-6 py-3 font-medium">Total</th>
                            <th class="px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                        ${Store.state.orders.map(o => `
                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td class="px-6 py-4 font-mono">${o.id}</td>
                                <td class="px-6 py-4"><div class="font-medium">${o.customer}</div><div class="text-xs text-slate-500">${o.email}</div></td>
                                <td class="px-6 py-4 text-slate-500">${o.date}</td>
                                <td class="px-6 py-4 font-medium">$${o.total}</td>
                                <td class="px-6 py-4">
                                    <select onchange="Views.updateOrderStatus('${o.id}', this.value)" class="text-xs rounded-full px-2 py-1 border-0 font-medium focus:ring-2 focus:ring-gold-500 ${o.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : o.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                        <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    adminCustomers() {
        return `
            <div class="glass rounded-xl overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                        <tr>
                            <th class="px-6 py-3 font-medium">Customer</th>
                            <th class="px-6 py-3 font-medium">Joined</th>
                            <th class="px-6 py-3 font-medium">Orders</th>
                            <th class="px-6 py-3 font-medium">Total Spent</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                        ${Store.state.customers.map(c => `
                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td class="px-6 py-4"><div class="font-medium">${c.name}</div><div class="text-xs text-slate-500">${c.email}</div></td>
                                <td class="px-6 py-4 text-slate-500">${c.joined}</td>
                                <td class="px-6 py-4">${c.orders}</td>
                                <td class="px-6 py-4 font-medium text-gold-600 dark:text-gold-400">$${c.spent}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    footer() {
        return `
            <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <span class="font-serif text-2xl font-bold text-white tracking-wider block mb-4">AURA</span>
                        <p class="text-sm">Redefining modern luxury through sustainable, meticulously crafted garments.</p>
                    </div>
                    <div>
                        <h4 class="text-white font-semibold mb-4">Shop</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="#" class="hover:text-gold-500 transition-colors">New Arrivals</a></li>
                            <li><a href="#" class="hover:text-gold-500 transition-colors">Best Sellers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-semibold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="#" class="hover:text-gold-500 transition-colors">Contact Us</a></li>
                            <li><a href="#" class="hover:text-gold-500 transition-colors">Shipping & Returns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-semibold mb-4">Newsletter</h4>
                        <div class="flex">
                            <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-l-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-gold-500 text-sm">
                            <button class="px-4 py-2 bg-gold-500 text-white rounded-r-lg hover:bg-gold-600 transition-colors"><i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span>© 2024 AURA Fashion. All rights reserved.</span>
                    <button onclick="Router.navigate('admin-login')" class="hover:text-gold-500 transition-colors">Staff Access</button>
                </div>
            </footer>
        `;
    },

    // --- ACTIONS ---
    selectSize(btn) {
        document.querySelectorAll('.size-btn').forEach(b => {
            b.classList.remove('bg-gold-500', 'text-white', 'border-gold-500');
            b.classList.add('border-slate-300', 'dark:border-slate-700');
        });
        btn.classList.remove('border-slate-300', 'dark:border-slate-700');
        btn.classList.add('bg-gold-500', 'text-white', 'border-gold-500');
    },
    
    adjustQty(delta) {
        const input = document.getElementById('product-qty');
        let val = parseInt(input.value) + delta;
        if (val < 1) val = 1;
        input.value = val;
    },
    
    addToCartFromDetail(productId) {
        const product = Store.state.products.find(p => p.id === productId);
        const sizeBtn = document.querySelector('.size-btn.bg-gold-500');
        const size = sizeBtn ? sizeBtn.innerText : product.size[0];
        const qty = parseInt(document.getElementById('product-qty').value);
        Store.addToCart(product, size, product.color, qty);
    },
    
    filterCatalog() {
        const grid = document.getElementById('catalog-grid');
        grid.style.opacity = '0.5';
        setTimeout(() => { grid.style.opacity = '1'; }, 300);
    },
    
    handleUserLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        if (Store.login(email, password)) {
            Router.navigate('shop-home');
        } else {
            alert('Invalid email or password.');
        }
    },
    
    handleUserRegister(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        if (Store.register(name, email, password)) {
            Router.navigate('shop-home');
        } else {
            alert('Email already exists or is reserved for Admin.');
        }
    },
    
    handleAdminLogin(e) {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        if (Store.login(email, password)) {
            Router.navigate('admin-dashboard');
        } else {
            alert('Invalid admin credentials.');
        }
    },
    
    showAddProductModal() {
        document.getElementById('edit-product-id').value = '';
        document.getElementById('p-name').value = '';
        document.getElementById('p-category').value = '';
        document.getElementById('p-price').value = '';
        document.getElementById('p-stock').value = '';
        document.getElementById('p-image').value = '';
        document.getElementById('product-modal').classList.remove('hidden');
    },
    
    editProduct(id) {
        const p = Store.state.products.find(x => x.id === id);
        document.getElementById('edit-product-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-category').value = p.category;
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-stock').value = p.stock;
        document.getElementById('p-image').value = p.image;
        document.getElementById('product-modal').classList.remove('hidden');
    },
    
    saveProduct(e) {
        e.preventDefault();
        const id = document.getElementById('edit-product-id').value;
        const newProduct = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('p-name').value,
            category: document.getElementById('p-category').value,
            price: parseFloat(document.getElementById('p-price').value),
            stock: parseInt(document.getElementById('p-stock').value),
            image: document.getElementById('p-image').value,
            size: ["S", "M", "L"],
            color: "Black",
            description: "Premium quality garment."
        };
        if (id) {
            const idx = Store.state.products.findIndex(p => p.id === parseInt(id));
            Store.state.products[idx] = { ...Store.state.products[idx], ...newProduct };
        } else {
            Store.state.products.push(newProduct);
        }
        Store.save();
        document.getElementById('product-modal').classList.add('hidden');
        Router.render();
    },
    
    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            Store.state.products = Store.state.products.filter(p => p.id !== id);
            Store.save();
            Router.render();
        }
    },
    
    updateOrderStatus(orderId, status) {
        const order = Store.state.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            Store.save();
            Router.render();
        }
    },
    
    processCheckout(e) {
        e.preventDefault();
        const btn = document.getElementById('checkout-btn');
        const nameInput = document.getElementById('checkout-name').value;
        const emailInput = document.getElementById('checkout-email').value;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            const orderId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;
            const date = new Date().toLocaleDateString('uz-UZ');
            const total = Store.getCartTotal();
            
            let itemsText = "";
            Store.state.cart.forEach(item => {
                itemsText += `• ${item.name} (${item.size}, ${item.color}) x${item.qty} - $${item.price * item.qty}\n`;
            });
            
            // Telegram xabarini shakllantirish
            const message = `🛍 *Yangi Buyurtma!*%0A%0A🆔 *Buyurtma ID:* ${orderId}%0A📅 *Sana:* ${date}%0A👤 *Mijoz:* ${nameInput}%0A📧 *Email:* ${emailInput}%0A%0A📦 *Mahsulotlar:*%0A${encodeURIComponent(itemsText)}%0A💰 *Jami Summa:* $${total}`;
            
            // Telegramga yuborish
            if (TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN' && TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID') {
                const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}&parse_mode=Markdown`;
                fetch(url).catch(err => console.error("Telegram xatolik:", err));
            } else {
                console.log("Telegram xabari (Test rejimi):\n", decodeURIComponent(message));
            }

            // Buyurtmani saqlash
            const newOrder = {
                id: orderId,
                customer: nameInput,
                email: emailInput,
                total: total,
                status: "Pending",
                date: new Date().toISOString().split('T')[0],
                items: Store.state.cart.length
            };
            Store.state.orders.unshift(newOrder);
            
            // Mijozlar bazasini yangilash
            const existingCustomer = Store.state.customers.find(c => c.email === emailInput);
            if (existingCustomer) {
                existingCustomer.spent += total;
                existingCustomer.orders += 1;
            } else {
                Store.state.customers.push({
                    id: Date.now(),
                    name: nameInput,
                    email: emailInput,
                    spent: total,
                    orders: 1,
                    joined: new Date().toISOString().split('T')[0]
                });
            }

            Store.save();
            Router.navigate('shop-confirmation');
        }, 2000);
    }
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.toggle('dark', Store.state.theme === 'dark');
    Router.render();
});