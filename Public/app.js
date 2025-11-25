// Application State
let currentUser = null;
let authToken = null;
const API_BASE = '/api';

const estadosBrasileiros = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
];

let products = [];
let shoppingCart = [];
let currentFilter = 'Todos';

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
    }

    return data;
}

// Load products from API
async function loadProducts(categoria = 'Todos') {
    try {
        const endpoint = categoria === 'Todos' 
            ? '/products' 
            : `/products?categoria=${encodeURIComponent(categoria)}`;
        
        const data = await apiRequest(endpoint);
        products = data.products;
        renderProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showMessage('marketplace-messages', 'Erro ao carregar produtos', true);
    }
}

// Navigation Functions
function navigateHome() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showPage('marketplace');
        loadProducts();
    } else if (currentUser.tipo === 'vendedor') {
        showPage('dashboard-vendedor');
        loadSellerProducts();
    } else if (currentUser.tipo === 'cliente') {
        showPage('dashboard-cliente');
        loadProducts();
    } else {
        showPage('marketplace');
        loadProducts();
    }
}

function getCurrentUser() {
    return currentUser;
}

function navigateHomeFromSidebar() {
    closeMobileSidebar();
    navigateHome();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    clearMessages();
}

function setUserTypeAndRegister(userType) {
    showPage('registro');
    if (userType === 'vendedor') {
        document.getElementById('tipo-vendedor').checked = true;
    } else {
        document.getElementById('tipo-cliente').checked = true;
    }
    toggleSellerFields();
}

// Form Functions
function toggleSellerFields() {
    const isVendedor = document.getElementById('tipo-vendedor').checked;
    const sellerFields = document.getElementById('seller-fields');
    if (isVendedor) {
        sellerFields.classList.add('show');
    } else {
        sellerFields.classList.remove('show');
    }
}

// CPF/CNPJ Functions (mantém as mesmas)
function formatCpfCnpj(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    input.value = value;
}

function validateCpfCnpj(cpfCnpj) {
    if (!cpfCnpj) return true;
    const numbers = cpfCnpj.replace(/\D/g, '');
    if (numbers.length === 11 || numbers.length === 14) {
        return true;
    }
    return false;
}

function validateCpfCnpjField() {
    const cpfCnpj = document.getElementById('cpf-cnpj').value.trim();
    const cpfCnpjError = document.getElementById('cpf-cnpj-error');
    if (cpfCnpj && !validateCpfCnpj(cpfCnpj)) {
        cpfCnpjError.style.display = 'block';
        return false;
    } else {
        cpfCnpjError.style.display = 'none';
        return true;
    }
}

// Validation Functions (mantém as mesmas)
function validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('email-error');
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email && !emailPattern.test(email)) {
        emailError.style.display = 'block';
        return false;
    } else {
        emailError.style.display = 'none';
        return true;
    }
}

function validatePassword() {
    const senha = document.getElementById('senha').value;
    const senhaError = document.getElementById('senha-error');
    if (senha && senha.length < 8) {
        senhaError.style.display = 'block';
        return false;
    } else {
        senhaError.style.display = 'none';
        return true;
    }
}

function validatePasswordMatch() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const confirmarSenhaError = document.getElementById('confirmar-senha-error');
    if (confirmarSenha && senha !== confirmarSenha) {
        confirmarSenhaError.style.display = 'block';
        return false;
    } else {
        confirmarSenhaError.style.display = 'none';
        return true;
    }
}

function clearMessages() {
    document.getElementById('registration-messages').innerHTML = '';
    document.getElementById('login-messages').innerHTML = '';
}

function showMessage(containerId, message, isError = false) {
    const container = document.getElementById(containerId);
    const className = isError ? 'error-alert' : 'success-message';
    container.innerHTML = `<div class="${className}">${message}</div>`;
}

// Register Function - ADAPTADO
async function register(event) {
    event.preventDefault();

    clearMessages();

    if (!validateEmail() || !validatePassword() || !validatePasswordMatch() || !validateCpfCnpjField()) {
        showMessage('registration-messages', 'Por favor, corrija os erros no formulário', true);
        return;
    }

    const tipo = document.getElementById('tipo-vendedor').checked ? 'vendedor' : 'cliente';
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const telefone = document.getElementById('telefone').value.trim();
    const cpf_cnpj = document.getElementById('cpf-cnpj').value.trim();

    if (!nome || !email || !senha) {
        showMessage('registration-messages', 'Por favor, preencha todos os campos obrigatórios', true);
        return;
    }

    const userData = {
        tipo,
        nome,
        email,
        senha,
        telefone,
        cpf_cnpj
    };

    if (tipo === 'vendedor') {
        const nomeLoja = document.getElementById('nome-loja').value.trim();
        const categoria = document.getElementById('categoria-loja').value;
        const descricaoLoja = document.getElementById('descricao-loja').value.trim();

        if (!nomeLoja || !categoria) {
            showMessage('registration-messages', 'Por favor, preencha os dados da loja', true);
            return;
        }

        userData.nomeLoja = nomeLoja;
        userData.categoria = categoria;
        userData.descricaoLoja = descricaoLoja;
    }

    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        showMessage('registration-messages', 'Cadastro realizado com sucesso! Faça login para continuar.');
        setTimeout(() => {
            showPage('login');
            document.getElementById('registration-form').reset();
        }, 2000);

    } catch (error) {
        showMessage('registration-messages', error.message, true);
    }
}

// Login Function - ADAPTADO
async function login(event) {
    event.preventDefault();
    clearMessages();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;

    if (!email || !senha) {
        showMessage('login-messages', 'Por favor, preencha email e senha', true);
        return;
    }

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        authToken = data.token;
        currentUser = data.user;
        
        // Salvar no localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        updateNavbar();
        navigateHome();
        document.getElementById('login-form').reset();

    } catch (error) {
        showMessage('login-messages', error.message, true);
    }
}

// Logout
function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateNavbar();
    showPage('marketplace');
    loadProducts();
}

// Load Seller Products - ADAPTADO
async function loadSellerProducts() {
    if (!currentUser || !currentUser.seller_id) return;

    try {
        const data = await apiRequest(`/products?seller_id=${currentUser.seller_id}`);
        renderSellerProducts(data.products);
    } catch (error) {
        console.error('Erro ao carregar produtos do vendedor:', error);
    }
}

// Add Product - ADAPTADO
async function addProduct(event) {
    event.preventDefault();

    if (!currentUser || currentUser.tipo !== 'vendedor') {
        alert('Apenas vendedores podem adicionar produtos');
        return;
    }

    const nome = document.getElementById('product-nome').value.trim();
    const categoria = document.getElementById('product-categoria').value;
    const descricao = document.getElementById('product-descricao').value.trim();
    const preco = parseFloat(document.getElementById('product-preco').value);
    const estoque = parseInt(document.getElementById('product-estoque').value);
    const imagemUrl = document.getElementById('product-imagem').value.trim();
    const publicado = document.getElementById('product-publicado').checked;

    if (!nome || !categoria || isNaN(preco)) {
        alert('Preencha todos os campos obrigatórios');
        return;
    }

    try {
        await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify({
                nome,
                categoria,
                descricao,
                preco,
                estoque,
                imagemUrl,
                publicado
            })
        });

        document.getElementById('add-product-form').reset();
        showPage('products-list');
        await loadSellerProducts();
        alert('Produto adicionado com sucesso!');

    } catch (error) {
        alert('Erro ao adicionar produto: ' + error.message);
    }
}

// Delete Product - ADAPTADO
async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        await apiRequest(`/products/${productId}`, {
            method: 'DELETE'
        });

        await loadSellerProducts();
        alert('Produto excluído com sucesso!');

    } catch (error) {
        alert('Erro ao excluir produto: ' + error.message);
    }
}

// Update Navbar
function updateNavbar() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        document.getElementById('user-name').textContent = currentUser.nome;
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Render Products
function renderProducts() {
    const container = document.getElementById('products-grid');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.imagem_url ? `<img src="${product.imagem_url}" alt="${product.nome}">` : '<div class="no-image">Sem imagem</div>'}
            </div>
            <div class="product-info">
                <h3>${product.nome}</h3>
                <p class="product-description">${product.descricao || ''}</p>
                <p class="product-seller">Vendido por: ${product.nome_loja}</p>
                <p class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</p>
                <button onclick="addToCart(${product.id})" class="btn-primary">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
}

// Render Seller Products
function renderSellerProducts(sellerProducts) {
    const container = document.getElementById('seller-products-list');
    
    if (sellerProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Você ainda não tem produtos cadastrados.</p>
                <button onclick="showPage('add-product')" class="btn-primary">Adicionar Produto</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="products-table">
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${sellerProducts.map(product => `
                    <tr>
                        <td>
                            <strong>${product.nome}</strong><br>
                            <small>${product.descricao ? product.descricao.substring(0, 50) + '...' : ''}</small>
                        </td>
                        <td>${product.categoria}</td>
                        <td>R$ ${product.preco.toFixed(2).replace('.', ',')}</td>
                        <td>${product.estoque}</td>
                        <td>
                            <span class="badge ${product.publicado ? 'badge-success' : 'badge-warning'}">
                                ${product.publicado ? 'Publicado' : 'Rascunho'}
                            </span>
                        </td>
                        <td>
                            <button onclick="deleteProduct(${product.id})" class="btn-danger btn-sm">Excluir</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Shopping Cart Functions (mantém as mesmas)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = shoppingCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantidade++;
    } else {
        shoppingCart.push({
            ...product,
            quantidade: 1
        });
    }

    updateCartBadge();
    alert('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCart();
}

function updateCartQuantity(productId, newQuantity) {
    const item = shoppingCart.find(item => item.id === productId);
    if (item && newQuantity > 0) {
        item.quantidade = newQuantity;
    }
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantidade, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function showCart() {
    showPage('cart');
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('cart-subtotal');

    if (shoppingCart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">Seu carrinho está vazio</p>';
        subtotalElement.textContent = 'R$ 0,00';
        return;
    }

    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

    container.innerHTML = shoppingCart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.nome}</h4>
                <p>Vendido por: ${item.nome_loja}</p>
                <p class="product-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-actions">
                <input type="number" min="1" value="${item.quantidade}" 
                       onchange="updateCartQuantity(${item.id}, parseInt(this.value))" 
                       style="width: 60px;">
                <button onclick="removeFromCart(${item.id})" class="btn-danger btn-sm">Remover</button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(categoria) {
    currentFilter = categoria;
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.category-card').classList.add('active');
    loadProducts(categoria);
}

// Mobile Sidebar
function openMobileSidebar() {
    document.getElementById('mobile-sidebar').classList.add('active');
    document.getElementById('sidebar-overlay').classList.add('active');
}

function closeMobileSidebar() {
    document.getElementById('mobile-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar sessão do localStorage
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        updateNavbar();
    }

    navigateHome();
});
