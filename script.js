const carsData = [
    { id: 1, brand: "BMW", model: "BMW M4", year: 2023, price: 65000, fuel: "Petrol", transmission: "Automatic", engine: "3.0L Twin-Turbo", image: "./thinh-do-YGeGFHCZIYI-unsplash.jpg" },
    { id: 2, brand: "Mercedes", model: "Mercedes C-Class", year: 2022, price: 52000, fuel: "Hybrid", transmission: "Automatic", engine: "2.0L Turbo Hybrid", image: "./jason-pischke-nG-sqMREq7s-unsplash.jpg" },
    { id: 3, brand: "Toyota", model: "Toyota Supra", year: 2023, price: 45000, fuel: "Petrol", transmission: "Automatic", engine: "3.0L Inline-6", image: "./tyler-clemmensen-4gSavS9pe1s-unsplash.jpg" },
    { id: 4, brand: "Audi", model: "Audi RS6", year: 2024, price: 110000, fuel: "Petrol", transmission: "Automatic", engine: "4.0L V8 Twin-Turbo", image: "./dmitry-novikov-49gi04Retc4-unsplash.jpg" },
    { id: 5, brand: "Tesla", model: "Tesla Model S", year: 2023, price: 89000, fuel: "Electric", transmission: "Automatic", engine: "Dual Motor Electric", image: "./dmitry-novikov-49gi04Retc4-unsplash.jpg" },
    { id: 6, brand: "BMW", model: "BMW X5", year: 2021, price: 58000, fuel: "Diesel", transmission: "Automatic", engine: "3.0L Diesel", image: "./leon-seibert-FVQ5AwHYoQk-unsplash.jpg" },
    { id: 7, brand: "Toyota", model: "Toyota RAV4", year: 2022, price: 32000, fuel: "Hybrid", transmission: "Automatic", engine: "2.5L Hybrid", image: "./gino-marcelo-hernandez-sanchez-MN0-x2hDNrc-unsplash.jpg" },
    { id: 8, brand: "Mercedes", model: "Mercedes G-Wagon", year: 2023, price: 150000, fuel: "Petrol", transmission: "Automatic", engine: "4.0L V8", image: "./d-panyukov-xZJ6uV5F4_k-unsplash.jpg" },
    { id: 9, brand: "Audi", model: "Audi A4", year: 2020, price: 28000, fuel: "Diesel", transmission: "Manual", engine: "2.0L TDI", image: "./brandon-paul-j_Nu-yeLvBg-unsplash.jpg" },
    { id: 10, brand: "Tesla", model: "Tesla Model 3", year: 2023, price: 42000, fuel: "Electric", transmission: "Automatic", engine: "Standard Range Electric", image: "./darien-attridge-J1fCVREbkV4-unsplash.jpg" }
];
let favorites = JSON.parse(localStorage.getItem('carzone_favorites')) || [];
let cart = JSON.parse(localStorage.getItem('carzone_cart')) || [];

const carsGrid = document.getElementById('carsGrid');
const searchInput = document.getElementById('searchInput');
const brandFilter = document.getElementById('brandFilter');
const fuelFilter = document.getElementById('fuelFilter');
const transFilter = document.getElementById('transFilter');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const resetFiltersBtn = document.getElementById('resetFilters');
const sortSelect = document.getElementById('sortSelect');
const favoritesCount = document.getElementById('favoritesCount');
const cartCount = document.getElementById('cartCount');
const detailsModal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');
const sidePanel = document.getElementById('sidebarPanel');
const panelTitle = document.getElementById('panelTitle');
const panelBody = document.getElementById('panelBody');
const panelFooter = document.getElementById('panelFooter');
const closePanel = document.querySelector('.close-panel');
const favoritesBtn = document.getElementById('favoritesBtn');
const cartBtn = document.getElementById('cartBtn');
const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('modeIcon');

document.addEventListener('DOMContentLoaded', () => {
    renderCars(carsData);
    updateCounters();
    setupEventListeners();
});

function renderCars(cars) {
    carsGrid.innerHTML = '';
    if (cars.length === 0) {
        carsGrid.innerHTML = `<p style="text-align:center;">მანქანები ვერ მოიძებნა.</p>`;
        return;
    }

    cars.forEach(car => {
        const isFav = favorites.includes(car.id);
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="car-img-container">
                <img src="${car.image}" alt="${car.model}">
                <button class="fav-icon-btn" onclick="toggleFavorite(${car.id})">
                    <img src="./icons8-favorites-50.png" alt="Fav" style="${isFav ? 'filter: drop-shadow(0px 0px 3px red);' : 'opacity:0.5;'}">
                </button>
            </div>
            <div class="car-details">
                <h3>${car.model}</h3>
                <div class="car-info-row">
                    <span>${car.year}</span>
                    <span>${car.fuel}</span>
                    <span>${car.transmission}</span>
                </div>
                <div class="car-price">$${car.price.toLocaleString()}</div>
            </div>
            <div class="card-actions">
                <button class="details-btn" onclick="openDetailsModal(${car.id})">Details</button>
                <button class="cart-btn" onclick="addToCart(${car.id})">Add To Cart</button>
            </div>
        `;
        carsGrid.appendChild(card);
    });
}

function filterAndSortCars() {
    let result = [...carsData];

    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        result = result.filter(car => car.model.toLowerCase().includes(query) || car.brand.toLowerCase().includes(query));
    }

    const brand = brandFilter.value;
    if (brand !== 'all') result = result.filter(car => car.brand === brand);

    const fuel = fuelFilter.value;
    if (fuel !== 'all') result = result.filter(car => car.fuel === fuel);

    const trans = transFilter.value;
    if (trans !== 'all') result = result.filter(car => car.transmission === trans);

    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    result = result.filter(car => car.price >= minPrice && car.price <= maxPrice);

    const sortVal = sortSelect.value;
    if (sortVal === 'low-high') result.sort((a, b) => a.price - b.price);
    if (sortVal === 'high-low') result.sort((a, b) => b.price - a.price);
    if (sortVal === 'a-z') result.sort((a, b) => a.model.localeCompare(b.model));
    if (sortVal === 'z-a') result.sort((a, b) => b.model.localeCompare(a.model));
    if (sortVal === 'newest') result.sort((a, b) => b.year - a.year);
    if (sortVal === 'oldest') result.sort((a, b) => a.year - b.year);

    renderCars(result);
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('carzone_favorites', JSON.stringify(favorites));
    updateCounters();
    filterAndSortCars();
}

function openFavoritesPanel() {
    panelTitle.innerText = "Favorite Cars";
    panelBody.innerHTML = '';
    panelFooter.innerHTML = '';

    const favCars = carsData.filter(car => favorites.includes(car.id));
    if (favCars.length === 0) {
        panelBody.innerHTML = `<p>ჯერ არ გაქვს მანქანა დამატებული ფავორიტებში</p>`;
    } else {
        favCars.forEach(car => {
            panelBody.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${car.model}</h4>
                        <p>$${car.price.toLocaleString()}</p>
                        <img src="${car.image}" alt="${car.model}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;">
                    </div>
                    <button class="reset-btn" style="padding: 5px 10px; width:50%" onclick="toggleFavorite(${car.id}); openFavoritesPanel();">Remove</button>
                </div>
            `;
        });
    }
    sidePanel.classList.add('open');
}

function addToCart(id) {
    const car = carsData.find(c => c.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...car, quantity: 1 });
    }
    saveCart();
    updateCounters();
    openCartPanel();
}

function updateCartQuantity(id, change) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(c => c.id !== id);
        }
    }
    saveCart();
    updateCounters();
    openCartPanel();
}

function saveCart() {
    localStorage.setItem('carzone_cart', JSON.stringify(cart));
}

function openCartPanel() {
    panelTitle.innerText = "Shopping Cart";
    panelBody.innerHTML = '';
    
    if (cart.length === 0) {
        panelBody.innerHTML = `<p>Your cart is empty.</p>`;
        panelFooter.innerHTML = '';
        sidePanel.classList.add('open');
        return;
    }

    let totalSum = 0;
    cart.forEach(item => {
        totalSum += item.price * item.quantity;
        panelBody.innerHTML += `
            <div class="cart-item">
                <div>
                    <img src="${item.image}" alt="${item.model}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;">
                    <h4>${item.model}</h4>
                    <p>$${item.price.toLocaleString()}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    panelFooter.innerHTML = `
        <h3>Total: $${totalSum.toLocaleString()}</h3>
        <button class="explore-btn" style="width:100%; margin-top:10px;" onclick="alert('Checkout completed!')">Checkout</button>
    `;
    sidePanel.classList.add('open');
}

function openDetailsModal(id) {
    const car = carsData.find(c => c.id === id);
    modalBody.innerHTML = `
        <img src="${car.image}" alt="${car.model}" style="width:100%; height:220px; object-fit:cover; border-radius:8px; margin-bottom:15px;">
        <h2>${car.model}</h2>
        <p><strong>Brand:</strong> ${car.brand}</p>
        <p><strong>Year:</strong> ${car.year}</p>
        <p><strong>Engine:</strong> ${car.engine}</p>
        <p><strong>Fuel:</strong> ${car.fuel}</p>
        <p><strong>Transmission:</strong> ${car.transmission}</p>
        <h3 style="margin-top:10px; color:var(--primary);">Price: $${car.price.toLocaleString()}</h3>
        <button class="cart-btn" style="width:100%; margin-top:15px;" onclick="addToCart(${car.id}); detailsModal.style.display='none';">Add To Cart</button>
    `;
    detailsModal.style.display = 'flex';
}

function updateCounters() {
    favoritesCount.innerText = favorites.length;
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function setupEventListeners() {
    searchInput.addEventListener('input', filterAndSortCars);
    brandFilter.addEventListener('change', filterAndSortCars);
    fuelFilter.addEventListener('change', filterAndSortCars);
    transFilter.addEventListener('change', filterAndSortCars);
    minPriceInput.addEventListener('input', filterAndSortCars);
    maxPriceInput.addEventListener('input', filterAndSortCars);
    sortSelect.addEventListener('change', filterAndSortCars);

    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        brandFilter.value = 'all';
        fuelFilter.value = 'all';
        transFilter.value = 'all';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        sortSelect.value = 'default';
        filterAndSortCars();
    });

    favoritesBtn.addEventListener('click', openFavoritesPanel);
    cartBtn.addEventListener('click', openCartPanel);

    closeModal.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });

    closePanel.addEventListener('click', () => {
        sidePanel.classList.remove('open');
    });

    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        modeIcon.src = isDark ? './icons8-sun-48.png' : './icons8-moon-30.png';
    });
}