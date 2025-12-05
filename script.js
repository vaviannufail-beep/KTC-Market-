// --- 1. DATA PRODUK ---
const products = [
    // --- KATEGORI: LAPTOP (4 Produk) ---
    { id: 101, name: "Laptop Gaming X400 Pro", category: "Laptop", price: 18500000, image: "laptop x400.jpg" },
    { id: 102, name: "Laptop Ultrabook Z13", category: "Laptop", price: 12500000, image: "laptop z13.jpg" },
    { id: 103, name: "Laptop Standar Bisnis A5", category: "Laptop", price: 7900000, image: "laptop a5.jpg" },
    { id: 104, name: "MacBook Pro M3 Max", category: "Laptop", price: 35000000, image: "m3 max.jpg" },

    // --- KATEGORI: KEYBOARD (3 Produk) ---
    { id: 201, name: "Mechanical Keyboard TKL RGB", category: "Keyboard", price: 1200000, image: "tkl rgb.jpg" },
    { id: 202, name: "Keyboard Wireless Ergonomis", category: "Keyboard", price: 450000, image: "ergonomis.jpg" },
    { id: 203, name: "Keyboard Gaming Full Size", category: "Keyboard", price: 950000, image: "keyboard gaming.jpg" },

    // --- KATEGORI: MOUSE (3 Produk) ---
    { id: 301, name: "Mouse Gaming Logitech G903", category: "Mouse", price: 1100000, image: "logitech g903.jpg" },
    { id: 302, name: "Mouse Wireless Silent", category: "Mouse", price: 280000, image: "mouse silent.jpg" },
    { id: 303, name: "Mouse Vertikal Ergonomis", category: "Mouse", price: 550000, image: "vertikal ergonomis.jpg" },
    
    // --- KATEGORI: MONITOR (2 Produk) ---
    { id: 401, name: "Monitor 27-inch 4K UHD", category: "Monitor", price: 6500000, image: "27 4k.jpg" },
    { id: 402, name: "Monitor 24-inch 144Hz FHD", category: "Monitor", price: 2900000, image: "24 144Hz.jpg" }
];

// --- 2. FUNGSI UTILITAS ---
// Format angka ke mata uang Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Mengambil keranjang dari Local Storage
const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

// Menyimpan keranjang ke Local Storage
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};


// --- 3. FUNGSI TAMPILAN (RENDER) ---

// Menampilkan daftar produk (DENGAN FILTER KATEGORI)
const renderProducts = (category = 'all') => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    
    // Filter produk berdasarkan kategori
    const filteredProducts = products.filter(product => {
        return category === 'all' || product.category === category;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p style="text-align: center;">Tidak ada produk di kategori ini.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <span class="category-tag">${product.category}</span>
            <p><strong>${formatRupiah(product.price)}</strong></p>
            <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
        `;
        productList.appendChild(productCard);
    });
};


// Menampilkan isi keranjang
const renderCart = () => {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutFinalTotalElement = document.getElementById('checkout-final-total');
    const cart = getCart();
    
    cartItemsElement.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<tr><td colspan="5" style="text-align: center;">Keranjang Anda kosong.</td></tr>';
    } else {
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${formatRupiah(item.price)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td>${formatRupiah(subtotal)}</td>
                <td><button onclick="removeItem(${item.id})">Hapus</button></td>
            `;
            cartItemsElement.appendChild(row);
        });
    }

    cartTotalElement.textContent = formatRupiah(total);
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update total di halaman checkout
    if (checkoutFinalTotalElement) {
        checkoutFinalTotalElement.textContent = formatRupiah(total);
    }
};

// Fungsi untuk beralih tampilan section
const showSection = (sectionId) => {
    const sections = ['products-section', 'cart-section', 'checkout-section', 'payment-section', 'success-section'];
    
    sections.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });

    document.getElementById(sectionId).classList.remove('hidden');
    
    // Panggil render saat pindah ke Cart atau Checkout
    if (sectionId === 'cart-section' || sectionId === 'checkout-section') {
        renderCart();
    }
};


// --- 4. FUNGSI LOGIKA KERANJANG ---

// Tambah produk ke keranjang
const addToCart = (productId) => {
    let cart = getCart();
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
        });
    }
    
    saveCart(cart);
    renderCart();
    alert(product.name + " berhasil ditambahkan!");
};

// Perbarui jumlah (quantity)
const updateQuantity = (productId, newQuantity) => {
    let cart = getCart();
    const quantity = parseInt(newQuantity);

    if (quantity > 0) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = quantity;
            saveCart(cart);
            renderCart();
        }
    } else {
        removeItem(productId);
    }
};

// Hapus item dari keranjang
const removeItem = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId); 
    
    saveCart(cart);
    renderCart();
};


// --- 5. FUNGSI LOGIKA CHECKOUT DAN PEMBAYARAN ---

// Render Halaman Pembayaran berdasarkan metode
const renderPaymentPage = (method) => {
    const paymentContainer = document.querySelector('.payment-container');
    const qrisImage = "qriss.jpeg"; 
    
    paymentContainer.innerHTML = ''; 
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalRupiah = formatRupiah(total);

    if (method === 'qris') {
        paymentContainer.innerHTML = `
            <h3>Metode Pembayaran: QRIS</h3>
            <p>Scan kode QR di bawah ini untuk menyelesaikan pembayaran Anda sebesar <strong>${totalRupiah}</strong>.</p>
            <img src="${qrisImage}" alt="QRIS Code" class="qris-image">
            <p class="instruction">Setelah melakukan pembayaran, klik tombol Konfirmasi.</p>
            <button onclick="confirmPayment()" class="confirm-btn">Konfirmasi Pembayaran</button>
        `;
    } else if (method === 'bank') {
        const accountDetails = `
            <h3>Metode Pembayaran: Transfer Bank</h3>
            <p>Total yang harus dibayar: <strong>${totalRupiah}</strong></p>
            
            <h4>Transfer Bank (Pilih Salah Satu)</h4>
            <div class="bank-info">
                <p><strong>Bank Mandiri:</strong> 02734562182</p>
                <p>Favian Nufail Mandiri</p>
            </div>
            <div class="bank-info">
                <p><strong>Bank BCA:</strong> 1501494149</p>
                <p>ridho parulian siagian BCA</p>
            </div>
            <p class="instruction">Silakan transfer sebesar <strong id="bank-transfer-total">${totalRupiah}</strong> ke salah satu rekening di atas.</p>
            <p class="instruction">Pastikan jumlah transfer sama persis dengan total pembayaran.</p>
            <button onclick="confirmPayment()" class="confirm-btn">Saya Sudah Transfer dan Konfirmasi</button>
        `;
        paymentContainer.innerHTML = accountDetails;
    }
    
    showSection('payment-section');
};


// Lanjut dari Checkout ke Pembayaran
const goToPayment = () => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const cart = getCart();

    // Pengecekan Keranjang
    if (cart.length === 0) {
        alert("Keranjang Anda kosong. Silakan tambah produk terlebih dahulu.");
        return;
    }

    // Ambil metode pembayaran yang dipilih
    const selectedMethod = document.querySelector('input[name="payment_method"]:checked');

    if (!name || !address) {
        alert("Mohon lengkapi Nama dan Alamat pengiriman.");
        return;
    }
    
    if (!selectedMethod) {
        alert("Mohon pilih salah satu metode pembayaran.");
        return;
    }

    // Pindah ke tampilan pembayaran dan render detailnya
    renderPaymentPage(selectedMethod.value);
};

// Konfirmasi Pembayaran (simulasi)
const confirmPayment = () => {
    // Hapus data keranjang setelah pembayaran (simulasi sukses)
    localStorage.removeItem('cart');
    
    // Tampilkan halaman sukses
    showSection('success-section');
};

// Reset aplikasi setelah sukses
const resetApp = () => {
    renderCart(); // Perbarui count di header menjadi 0
    showSection('products-section');
}

// --- INISIALISASI ---
// Jalankan saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    showSection('products-section'); // Pastikan yang tampil pertama adalah produk
});