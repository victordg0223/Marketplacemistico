
        // Application State
        let currentUser = null;
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
        let products = [
            {
                id: 1729623000000,
                vendedorId: 'test_seller_1',
                nomeLoja: 'Tarot Místico',
                nome: 'Tiragem de 5 Cartas',
                categoria: 'Tarô e Oráculos',
                descricao: 'A tiragem é utilizada para ajudar em assuntos financeiros',
                preco: 15.00,
                estoque: 50,
                imagemUrl: '',
                publicado: true,
                dataCriacao: 1729623000000
            },
            {
                id: 1729623001000,
                vendedorId: 'test_seller_2',
                nomeLoja: 'Ervas & Raízes',
                nome: 'Raiz Kumbaya',
                categoria: 'Cristais e Pedras',
                descricao: 'Raiz do sono vem para te auxiliar no stress do dia dia, promovendo relaxamento e tranquilidade natural.',
                preco: 25.00,
                estoque: 30,
                imagemUrl: '',
                publicado: true,
                dataCriacao: 1729623001000
            },
            {
                id: 1729623002000,
                vendedorId: 'test_seller_1',
                nomeLoja: 'Tarot Místico',
                nome: 'Consulta de Tarô Completa',
                categoria: 'Tarô e Oráculos',
                descricao: 'Consulta completa de tarô com análise detalhada do passado, presente e futuro. Sessão de 1 hora via videochamada.',
                preco: 80.00,
                estoque: 10,
                imagemUrl: '',
                publicado: true,
                dataCriacao: 1729623002000
            },
            {
                id: 1729623003000,
                vendedorId: 'test_seller_2',
                nomeLoja: 'Ervas & Raízes',
                nome: 'Cristal de Ametista',
                categoria: 'Cristais e Pedras',
                descricao: 'Cristal de ametista natural para meditação e harmonização dos chakras. Pedra de alta qualidade.',
                preco: 45.00,
                estoque: 15,
                imagemUrl: '',
                publicado: true,
                dataCriacao: 1729623003000
            },
            {
                id: 1729623004000,
                vendedorId: 'test_seller_1',
                nomeLoja: 'Tarot Místico',
                nome: 'Baralho de Tarô Rider-Waite',
                categoria: 'Tarô e Oráculos',
                descricao: 'Baralho clássico Rider-Waite em português. Perfeito para iniciantes e praticantes experientes.',
                preco: 60.00,
                estoque: 25,
                imagemUrl: '',
                publicado: true,
                dataCriacao: 1729623004000
            }
        ];
        let shoppingCart = [];
        let currentFilter = 'Todos';
        let users = [
            {
                id: 'test_seller_1',
                tipo: 'vendedor',
                nome: 'Ana Mística',
                email: 'ana@tarotmistico.com',
                senha: '12345678',
                telefone: '(11) 99999-9999',
                nomeLoja: 'Tarot Místico',
                cpf_cnpj: '12345678000190',
                tipo_documento: 'CNPJ',
                categoria: 'Tarô e Oráculos',
                descricaoLoja: 'Especialista em leituras de tarô com mais de 15 anos de experiência. Oferecemos consultas personalizadas e produtos autênticos para sua jornada espiritual.'
            },
            {
                id: 'test_seller_2',
                tipo: 'vendedor',
                nome: 'Roberto Herbalista',
                email: 'roberto@ervasraizes.com',
                senha: '12345678',
                telefone: '(11) 88888-8888',
                nomeLoja: 'Ervas & Raízes',
                cpf_cnpj: '12345678900',
                tipo_documento: 'CPF',
                categoria: 'Cristais e Pedras',
                descricaoLoja: 'Loja especializada em ervas medicinais, cristais e produtos naturais para bem-estar e equilíbrio energético. Todos os nossos produtos são cuidadosamente selecionados.'
            },
            {
                id: Date.now() - 250,
                tipo: 'cliente',
                nome: 'Carlos Oliveira',
                email: 'carlos@email.com',
                senha: '12345678',
                telefone: '(11) 77777-7777',
                endereco: {
                    cep: '',
                    rua: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: ''
                }
            }
        ];

        // Navigation Functions
        function navigateHome() {
            const currentUser = getCurrentUser();

            if (!currentUser) {
                // Not logged in → public marketplace
                showPage('marketplace');
            } else if (currentUser.tipo === 'vendedor') {
                // Seller → Dashboard Vendedor
                showPage('dashboard-vendedor');
            } else if (currentUser.tipo === 'cliente') {
                // Customer → Dashboard Cliente
                showPage('dashboard-cliente');
            } else {
                // Fallback to marketplace
                showPage('marketplace');
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
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show requested page
            document.getElementById(pageId).classList.add('active');

            // Clear any messages
            clearMessages();
        }

        function setUserTypeAndRegister(userType) {
            showPage('registro');

            // Pre-select user type
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

        // CPF/CNPJ Formatting and Validation Functions
        function formatCpfCnpj(input) {
            let value = input.value.replace(/\D/g, '');

            if (value.length <= 11) {
                // Format as CPF: 000.000.000-00
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                // Format as CNPJ: 00.000.000/0000-00
                value = value.replace(/(\d{2})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1/$2');
                value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
            }

            input.value = value;
        }

        function validateCpfCnpj(cpfCnpj) {
            if (!cpfCnpj) return true; // Optional field

            const numbers = cpfCnpj.replace(/\D/g, '');

            // Check if it's a valid CPF (11 digits) or CNPJ (14 digits)
            if (numbers.length === 11 || numbers.length === 14) {
                return true;
            }

            return false;
        }

        function getDocumentType(cpfCnpj) {
            if (!cpfCnpj) return null;
            const numbers = cpfCnpj.replace(/\D/g, '');
            if (numbers.length === 11) return 'CPF';
            if (numbers.length === 14) return 'CNPJ';
            return null;
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

        // Validation Functions
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

        function checkEmailExists(email) {
            return users.some(user => user.email === email);
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

        // Registration Form Handler
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            const telefone = document.getElementById('telefone').value.trim();

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });

            let hasError = false;

            // Validate required fields
            if (!tipo) {
                showMessage('registration-messages', 'Por favor, selecione o tipo de usuário.', true);
                return;
            }

            if (!nome) {
                document.getElementById('nome-error').style.display = 'block';
                hasError = true;
            }

            if (!email) {
                document.getElementById('email-error').textContent = 'Email é obrigatório';
                document.getElementById('email-error').style.display = 'block';
                hasError = true;
            } else if (!validateEmail()) {
                hasError = true;
            } else if (checkEmailExists(email)) {
                showMessage('registration-messages', 'Este email já está cadastrado.', true);
                return;
            }

            if (!senha) {
                document.getElementById('senha-error').textContent = 'Senha é obrigatória';
                document.getElementById('senha-error').style.display = 'block';
                hasError = true;
            } else if (!validatePassword()) {
                hasError = true;
            }

            if (!confirmarSenha) {
                document.getElementById('confirmar-senha-error').textContent = 'Confirmação de senha é obrigatória';
                document.getElementById('confirmar-senha-error').style.display = 'block';
                hasError = true;
            } else if (!validatePasswordMatch()) {
                hasError = true;
            }

            // Validate seller-specific fields
            if (tipo === 'vendedor') {
                const nomeLoja = document.getElementById('nome-loja').value.trim();
                const categoria = document.getElementById('categoria').value;
                const cpfCnpj = document.getElementById('cpf-cnpj').value.trim();

                if (!nomeLoja) {
                    document.getElementById('nome-loja-error').style.display = 'block';
                    hasError = true;
                }

                if (!categoria) {
                    document.getElementById('categoria-error').style.display = 'block';
                    hasError = true;
                }

                if (cpfCnpj && !validateCpfCnpj(cpfCnpj)) {
                    document.getElementById('cpf-cnpj-error').style.display = 'block';
                    hasError = true;
                }
            }

            if (hasError) {
                showMessage('registration-messages', 'Por favor, corrija os erros abaixo.', true);
                return;
            }

            // Create user object
            const newUser = {
                id: Date.now(),
                tipo,
                nome,
                email,
                senha,
                telefone
            };

            // Add endereco for clientes
            if (tipo === 'cliente') {
                newUser.endereco = {
                    cep: '',
                    rua: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: ''
                };
            }

            // Add seller-specific fields
            if (tipo === 'vendedor') {
                newUser.nomeLoja = document.getElementById('nome-loja').value.trim();
                const cpfCnpjValue = document.getElementById('cpf-cnpj').value.trim();
                newUser.cpf_cnpj = cpfCnpjValue.replace(/\D/g, ''); // Store only numbers
                newUser.tipo_documento = getDocumentType(cpfCnpjValue);
                newUser.categoria = document.getElementById('categoria').value;
                newUser.descricaoLoja = document.getElementById('descricao-loja').value.trim();
            }

            // Save user
            users.push(newUser);

            // Reset form
            document.getElementById('registrationForm').reset();
            toggleSellerFields();

            // Show success and redirect to login
            showPage('login');
            showMessage('login-messages', 'Cadastro realizado com sucesso! Faça login para continuar.');
        });

        // Login Form Handler
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-senha').value;

            // Find user
            const user = users.find(u => u.email === email && u.senha === senha);

            if (user) {
                // Set current user
                currentUser = user;

                // Update navigation
                updateNavigation();

                // Redirect to appropriate dashboard
                if (user.tipo === 'vendedor') {
                    showSellerDashboard(user);
                } else {
                    showCustomerDashboard(user);
                }
            } else {
                showMessage('login-messages', 'Email ou senha incorretos.', true);
            }
        });

        // Dashboard Functions
        function showSellerDashboard(user) {
            document.getElementById('seller-name').textContent = user.nome;
            document.getElementById('store-name').textContent = user.nomeLoja;
            showPage('dashboard-vendedor');
            updateSellerOverview();
        }

        function showSellerProfile() {
            if (!currentUser || currentUser.tipo !== 'vendedor') return;

            showPage('seller-profile');
            loadSellerProfileData();
        }

        function loadSellerProfileData() {
            if (!currentUser || currentUser.tipo !== 'vendedor') return;

            // Load profile view mode data
            document.getElementById('display-nome-loja').textContent = currentUser.nomeLoja || 'Não informado';
            document.getElementById('display-descricao-loja').textContent = currentUser.descricaoLoja || 'Nenhuma descrição cadastrada';
            document.getElementById('display-categoria').textContent = currentUser.categoria || 'Não informado';

            // Format and display CPF/CNPJ
            let cpfCnpjDisplay = 'Não informado';
            if (currentUser.cpf_cnpj) {
                const numbers = currentUser.cpf_cnpj.replace(/\D/g, '');
                if (numbers.length === 11) {
                    cpfCnpjDisplay = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                } else if (numbers.length === 14) {
                    cpfCnpjDisplay = numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                } else {
                    cpfCnpjDisplay = currentUser.cpf_cnpj;
                }
            }
            document.getElementById('display-cpf-cnpj').textContent = cpfCnpjDisplay;

            document.getElementById('display-email').textContent = currentUser.email;

            // Calculate and display total products
            const sellerProducts = products.filter(p => p.vendedorId === currentUser.id.toString());
            const totalProducts = sellerProducts.length;
            document.getElementById('display-total-produtos').textContent = totalProducts;

            // Load products list in profile
            loadProfileProductsList(sellerProducts);
        }

        function loadProfileProductsList(sellerProducts) {
            const container = document.getElementById('profile-products-list');

            if (sellerProducts.length === 0) {
                container.innerHTML = `
                    <div class="text-center" style="padding: var(--space-6); background: var(--color-surface-light); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                        <p style="color: var(--color-text-secondary);">Você ainda não tem produtos cadastrados.</p>
                        <button class="btn" onclick="showDashboardSection('vendedor', 'adicionar')" style="margin-top: var(--space-4);">➕ Adicionar Produto</button>
                    </div>
                `;
                return;
            }

            let html = '<div class="products-grid">';

            sellerProducts.forEach(product => {
                const icon = getCategoryIcon(product.categoria);
                const stockStatus = getStockStatus(product.estoque);

                html += `
                    <div class="product-card" onclick="showProductDetail(${product.id})">
                        <div class="product-image">${icon}</div>
                        <div class="product-category">${product.categoria}</div>
                        <div class="product-name">${product.nome}</div>
                        <div class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="product-description">${product.descricao.length > 60 ? product.descricao.substring(0, 60) + '...' : product.descricao}</div>
                        <div class="product-stock ${stockStatus.class}">${stockStatus.text}</div>
                    </div>
                `;
            });

            html += '</div>';
            container.innerHTML = html;
        }

        function enterEditMode() {
            if (!currentUser || currentUser.tipo !== 'vendedor') return;

            // Hide view mode, show edit mode
            document.getElementById('profile-view-mode').style.display = 'none';
            document.getElementById('profile-edit-mode').style.display = 'block';

            // Pre-fill form with current data
            document.getElementById('edit-nome-loja').value = currentUser.nomeLoja || '';
            document.getElementById('edit-descricao-loja').value = currentUser.descricaoLoja || '';
            document.getElementById('edit-categoria').value = currentUser.categoria || '';

            // Format CPF/CNPJ for display
            let cpfCnpjFormatted = '';
            if (currentUser.cpf_cnpj) {
                const numbers = currentUser.cpf_cnpj.replace(/\D/g, '');
                if (numbers.length === 11) {
                    cpfCnpjFormatted = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                } else if (numbers.length === 14) {
                    cpfCnpjFormatted = numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                } else {
                    cpfCnpjFormatted = currentUser.cpf_cnpj;
                }
            }
            document.getElementById('edit-cpf-cnpj').value = cpfCnpjFormatted;
            document.getElementById('edit-display-email').textContent = currentUser.email;

            // Clear any previous error messages
            document.querySelectorAll('#profile-edit-mode .error-message').forEach(error => {
                error.style.display = 'none';
            });
            document.getElementById('profile-edit-messages').innerHTML = '';
        }

        function cancelEditMode() {
            // Show view mode, hide edit mode
            document.getElementById('profile-view-mode').style.display = 'block';
            document.getElementById('profile-edit-mode').style.display = 'none';

            // Clear form
            document.getElementById('editProfileForm').reset();
        }

        function validateEditCpfCnpjField() {
            const cpfCnpj = document.getElementById('edit-cpf-cnpj').value.trim();
            const cpfCnpjError = document.getElementById('edit-cpf-cnpj-error');

            if (cpfCnpj && !validateCpfCnpj(cpfCnpj)) {
                cpfCnpjError.style.display = 'block';
                return false;
            } else {
                cpfCnpjError.style.display = 'none';
                return true;
            }
        }

        function showCustomerDashboard(user) {
            document.getElementById('customer-name').textContent = user.nome;
            showPage('dashboard-cliente'); // Show customer dashboard
        }

        function showDashboardSection(userType, section) {
            if (userType === 'vendedor') {
                if (section === 'adicionar') {
                    showPage('add-product');
                } else if (section === 'produtos') {
                    showSellerProducts();
                } else if (section === 'perfil') {
                    showSellerProfile();
                } else {
                    showPage('dashboard-vendedor');
                    updateSellerOverview();
                }
            } else if (userType === 'cliente') {
                if (section === 'explorar') {
                    showPage('marketplace');
                } else if (section === 'perfil') {
                    showClienteProfile();
                } else if (section === 'carrinho') {
                    showPage('carrinho');
                } else {
                    showPage('dashboard-cliente');
                }
            }
        }

        // Product Management Functions
        function showSellerProducts() {
            showPage('seller-products');
            loadSellerProducts();
        }

        function loadSellerProducts() {
            if (!currentUser) return;

            const sellerProducts = products.filter(p => p.vendedorId === currentUser.id.toString());
            const container = document.getElementById('seller-products-content');

            if (sellerProducts.length === 0) {
                container.innerHTML = `
                    <div class="text-center" style="padding: var(--space-8); background: var(--color-surface-light); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                        <h3 style="color: var(--color-secondary); margin-bottom: var(--space-4);">Você ainda não tem produtos cadastrados.</h3>
                        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-6);">Adicione seu primeiro produto!</p>
                        <button class="btn" onclick="showDashboardSection('vendedor', 'adicionar')">➕ Adicionar Novo Produto</button>
                    </div>
                `;
                return;
            }

            let tableHTML = `
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
            `;

            sellerProducts.forEach(product => {
                const statusBadge = product.publicado ?
                    '<span style="color: var(--color-success);">✅ Publicado</span>' :
                    '<span style="color: var(--color-text-secondary);">⏸️ Rascunho</span>';

                tableHTML += `
                    <tr>
                        <td>
                            <strong>${product.nome}</strong><br>
                            <small style="color: var(--color-text-secondary);">${product.descricao.substring(0, 50)}...</small>
                        </td>
                        <td>${product.categoria}</td>
                        <td>R$ ${product.preco.toFixed(2).replace('.', ',')}</td>
                        <td>${product.estoque}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn delete" onclick="deleteProduct(${product.id})">🗑️ Excluir</button>
                        </td>
                    </tr>
                `;
            });

            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        }

        function deleteProduct(productId) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                products = products.filter(p => p.id !== productId);
                loadSellerProducts();
                updateSellerStats();
            updateSellerOverview();
                showNotification('Produto removido com sucesso!', 'success');
            }
        }

        function updateSellerStats() {
            if (!currentUser || currentUser.tipo !== 'vendedor') return;

            const sellerProducts = products.filter(p => p.vendedorId === currentUser.id.toString());
            const totalProducts = sellerProducts.length;

            const statsCards = document.querySelectorAll('.stat-number');
            if (statsCards.length > 0) {
                statsCards[0].textContent = totalProducts;
            }
        }

        function updateSellerOverview() {
            if (!currentUser || currentUser.tipo !== 'vendedor') return;

            const sellerProducts = products.filter(p => p.vendedorId === currentUser.id.toString());
            const totalProducts = sellerProducts.length;

            // Update stats cards
            const statsCards = document.querySelectorAll('.stat-number');
            if (statsCards.length > 0) {
                statsCards[0].textContent = totalProducts;
            }

            // Update overview content based on products count
            const overviewDiv = document.getElementById('vendedor-overview');
            if (overviewDiv) {
                const existingContent = overviewDiv.querySelector('.text-center');
                if (totalProducts === 0) {
                    // Show "no products" message
                    if (!existingContent) {
                        overviewDiv.innerHTML += `
                            <div class="text-center" style="padding: var(--space-8); background: var(--color-surface-light); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                                <h3 style="color: var(--color-secondary); margin-bottom: var(--space-4);">Você ainda não tem produtos cadastrados</h3>
                                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-6);">Comece adicionando seus primeiros produtos místicos para começar a vender!</p>
                                <button class="btn" onclick="showDashboardSection('vendedor', 'adicionar')">➕ Adicionar Novo Produto</button>
                            </div>
                        `;
                    }
                } else {
                    // Remove "no products" message if it exists
                    if (existingContent) {
                        existingContent.remove();
                    }
                }
            }
        }

        // Edit Profile Form Handler
        document.getElementById('editProfileForm').addEventListener('submit', function(e) {
            e.preventDefault();

            if (!currentUser || currentUser.tipo !== 'vendedor') {
                showMessage('profile-edit-messages', 'Erro: Usuário não autorizado', true);
                return;
            }

            const nomeLoja = document.getElementById('edit-nome-loja').value.trim();
            const descricaoLoja = document.getElementById('edit-descricao-loja').value.trim();
            const categoria = document.getElementById('edit-categoria').value;
            const cpfCnpj = document.getElementById('edit-cpf-cnpj').value.trim();

            // Clear previous errors
            document.querySelectorAll('#profile-edit-mode .error-message').forEach(error => {
                error.style.display = 'none';
            });

            let hasError = false;

            // Validate required fields
            if (!nomeLoja) {
                document.getElementById('edit-nome-loja-error').style.display = 'block';
                hasError = true;
            }

            if (!categoria) {
                document.getElementById('edit-categoria-error').style.display = 'block';
                hasError = true;
            }

            if (cpfCnpj && !validateCpfCnpj(cpfCnpj)) {
                document.getElementById('edit-cpf-cnpj-error').style.display = 'block';
                hasError = true;
            }

            if (hasError) {
                showMessage('profile-edit-messages', 'Por favor, corrija os erros abaixo.', true);
                return;
            }

            // Update user data
            currentUser.nomeLoja = nomeLoja;
            currentUser.descricaoLoja = descricaoLoja;
            currentUser.categoria = categoria;

            if (cpfCnpj) {
                currentUser.cpf_cnpj = cpfCnpj.replace(/\D/g, ''); // Store only numbers
                currentUser.tipo_documento = getDocumentType(cpfCnpj);
            }

            // Update all products with new store name
            products.forEach(product => {
                if (product.vendedorId === currentUser.id.toString()) {
                    product.nomeLoja = nomeLoja;
                }
            });

            // Update user in users array
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = { ...currentUser };
            }

            // Update dashboard display names
            const storeNameElements = document.querySelectorAll('#store-name');
            storeNameElements.forEach(element => {
                element.textContent = nomeLoja;
            });

            // Show success message and return to view mode
            showNotification('Perfil atualizado com sucesso!', 'success');

            // Reload profile data and return to view mode
            setTimeout(() => {
                loadSellerProfileData();
                cancelEditMode();
            }, 1000);
        });

        // Add Product Form Handler
        document.getElementById('addProductForm').addEventListener('submit', function(e) {
            e.preventDefault();

            if (!currentUser || currentUser.tipo !== 'vendedor') {
                showNotification('Erro: Usuário não autorizado', 'error');
                return;
            }

            const nome = document.getElementById('product-name').value.trim();
            const categoria = document.getElementById('product-category').value;
            const descricao = document.getElementById('product-description').value.trim();
            const preco = parseFloat(document.getElementById('product-price').value);
            const estoque = parseInt(document.getElementById('product-stock').value);
            const imagemUrl = document.getElementById('product-image').value.trim();
            const publicado = document.getElementById('product-published').checked;

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });

            let hasError = false;

            if (!nome) {
                document.getElementById('product-name-error').style.display = 'block';
                hasError = true;
            }

            if (!categoria) {
                document.getElementById('product-category-error').style.display = 'block';
                hasError = true;
            }

            if (!descricao) {
                document.getElementById('product-description-error').style.display = 'block';
                hasError = true;
            }

            if (isNaN(preco) || preco <= 0) {
                document.getElementById('product-price-error').style.display = 'block';
                hasError = true;
            }

            if (isNaN(estoque) || estoque < 0) {
                document.getElementById('product-stock-error').style.display = 'block';
                hasError = true;
            }

            if (hasError) {
                showMessage('add-product-messages', 'Por favor, corrija os erros abaixo.', true);
                return;
            }

            // Create new product
            const newProduct = {
                id: Date.now(),
                vendedorId: currentUser.id.toString(),
                nomeLoja: currentUser.nomeLoja,
                nome,
                categoria,
                descricao,
                preco,
                estoque,
                imagemUrl,
                publicado,
                dataCriacao: Date.now()
            };

            products.push(newProduct);

            // Reset form
            document.getElementById('addProductForm').reset();
            document.getElementById('product-published').checked = true;

            showNotification('Produto adicionado com sucesso!', 'success');
            updateSellerStats();
            updateSellerOverview();

            // Redirect to products list
            setTimeout(() => {
                showSellerProducts();
            }, 1500);
        });

        function cancelAddProduct() {
            if (currentUser && currentUser.tipo === 'vendedor') {
                showPage('dashboard-vendedor');
            } else {
                showPage('marketplace');
            }
        }

        // Marketplace Functions
        function loadMarketplace() {
            renderProducts();
        }

        function renderProducts(filteredProducts = null) {
            const productsToShow = filteredProducts || products.filter(p => p.publicado);
            const container = document.getElementById('products-grid');
            const noProductsDiv = document.getElementById('no-products');

            if (productsToShow.length === 0) {
                container.innerHTML = '';
                noProductsDiv.style.display = 'block';
                return;
            }

            noProductsDiv.style.display = 'none';

            let html = '';
            productsToShow.forEach(product => {
                const icon = getCategoryIcon(product.categoria);
                const stockStatus = getStockStatus(product.estoque);

                html += `
                    <div class="product-card" onclick="showProductDetail(${product.id})">
                        <div class="product-image">${icon}</div>
                        <div class="product-category">${product.categoria}</div>
                        <div class="product-name">${product.nome}</div>
                        <div class="product-seller" onclick="event.stopPropagation(); navigateToStore('${product.vendedorId}')">Vendido por: ${product.nomeLoja}</div>
                        <div class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="product-description">${product.descricao.length > 60 ? product.descricao.substring(0, 60) + '...' : product.descricao}</div>
                        <div class="product-stock ${stockStatus.class}">${stockStatus.text}</div>
                        <button class="btn btn-add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">🛒 Adicionar ao Carrinho</button>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function getCategoryIcon(category) {
            const icons = {
                'Cristais e Pedras': '🔮',
                'Tarô e Oráculos': '🃏',
                'Incensos e Velas': '🕯️',
                'Amuletos e Talismãs': '🧿',
                'Livros Esotéricos': '📚',
                'Serviços Místicos': '✨',
                'Outros': '🌟'
            };
            return icons[category] || '✨';
        }

        function getStockStatus(estoque) {
            if (estoque === 0) {
                return { text: 'Produto esgotado', class: 'out' };
            } else if (estoque <= 5) {
                return { text: `Estoque baixo! Apenas ${estoque} unidades`, class: 'low' };
            } else {
                return { text: `${estoque} unidades disponíveis`, class: '' };
            }
        }

        function filterByCategory(category) {
            currentFilter = category;

            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            event.target.classList.add('active');

            // Filter products
            let filteredProducts;
            if (category === 'Todos') {
                filteredProducts = products.filter(p => p.publicado);
            } else {
                filteredProducts = products.filter(p => p.publicado && p.categoria === category);
            }

            renderProducts(filteredProducts);
        }

        function filterProducts() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();

            let filteredProducts = products.filter(p => {
                if (!p.publicado) return false;

                const matchesCategory = currentFilter === 'Todos' || p.categoria === currentFilter;
                const matchesSearch = searchTerm === '' ||
                    p.nome.toLowerCase().includes(searchTerm) ||
                    p.descricao.toLowerCase().includes(searchTerm) ||
                    p.nomeLoja.toLowerCase().includes(searchTerm) ||
                    p.categoria.toLowerCase().includes(searchTerm);

                return matchesCategory && matchesSearch;
            });

            renderProducts(filteredProducts);
        }

        function showProductDetail(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const icon = getCategoryIcon(product.categoria);
            const stockStatus = getStockStatus(product.estoque);

            const content = document.getElementById('product-detail-content');
            content.innerHTML = `
                <div class="product-detail">
                    <div class="product-detail-image">${icon}</div>
                    <div class="product-detail-info">
                        <h1>${product.nome}</h1>
                        <div class="product-detail-seller">Vendido por: <strong><a href="javascript:void(0)" onclick="navigateToStore('${product.vendedorId}')" style="color: var(--color-accent); text-decoration: underline;">${product.nomeLoja}</a></strong></div>
                        <div style="margin-bottom: var(--space-4);">
                            <button class="btn btn-outline" onclick="navigateToStore('${product.vendedorId}')" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">👁️ Ver Todos os Produtos desta Loja</button>
                        </div>
                        <div class="product-category">${product.categoria}</div>
                        <div class="product-detail-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="product-stock ${stockStatus.class}" style="margin-bottom: var(--space-6);">${stockStatus.text}</div>
                        <div style="color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-8);">${product.descricao}</div>
                        <div class="product-details-actions" style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
                            <button class="btn btn-outline btn-add-to-cart" onclick="addToCart(${product.id})" ${product.estoque === 0 ? 'disabled' : ''} style="flex: 1; min-width: 200px;">🛒 Adicionar ao Carrinho</button>
                            <button class="btn" onclick="comprarAgora(${product.id})" ${product.estoque === 0 ? 'disabled' : ''} style="flex: 1; min-width: 200px; background: var(--color-secondary); color: var(--color-background);">⚡ Comprar Agora</button>
                        </div>
                        <div style="margin-top: var(--space-4);">
                            <button class="btn btn-outline" onclick="showPage('marketplace')" style="width: 100%;">← Voltar para Produtos</button>
                        </div>

                        <!-- Mobile responsive styles -->
                        <style>
                            @media (max-width: 768px) {
                                .product-details-actions {
                                    flex-direction: column !important;
                                }
                                .product-details-actions button {
                                    width: 100% !important;
                                    min-width: auto !important;
                                }
                            }
                        </style>
                    </div>
                </div>
            `;

            showPage('product-detail');
        }

        function addToCart(productId, showNotif = true) {
            // Check if user is logged in
            if (!currentUser) {
                showLoginModal();
                return;
            }

            const product = products.find(p => p.id === productId);
            if (!product || product.estoque === 0) {
                showNotification('Produto não disponível', 'error');
                return;
            }

            const existingItem = shoppingCart.find(item => item.produtoId === productId);
            if (existingItem) {
                if (existingItem.quantidade < product.estoque) {
                    existingItem.quantidade++;
                    if (showNotif) showNotification('Produto adicionado ao carrinho!', 'success');
                } else {
                    showNotification('Quantidade máxima atingida', 'error');
                }
            } else {
                shoppingCart.push({
                    produtoId: productId,
                    nome: product.nome,
                    preco: product.preco,
                    imagemUrl: product.imagemUrl,
                    nomeLoja: product.nomeLoja,
                    quantidade: 1,
                    vendedorId: product.vendedorId
                });
                if (showNotif) showNotification('Produto adicionado ao carrinho!', 'success');
            }

            updateCartBadge();
        }

        function comprarAgora(productId) {
            // Check if user is logged in
            if (!currentUser) {
                showLoginModal();
                return;
            }

            // Add product to cart (without notification)
            addToCart(productId, false);

            // Navigate to cart page immediately
            showPage('carrinho');
        }

        function updateCartBadge() {
            const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantidade, 0);
            const cartBadge = document.getElementById('cart-badge');
            const mobileCartCount = document.getElementById('mobile-cart-count');

            if (cartBadge) {
                cartBadge.textContent = totalItems;
                cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
            }

            if (mobileCartCount) {
                mobileCartCount.textContent = totalItems;
            }
        }

        function calculateCartTotal() {
            return shoppingCart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        }

        function removeFromCart(productId) {
            if (confirm('Remover este produto do carrinho?')) {
                shoppingCart = shoppingCart.filter(item => item.produtoId !== productId);
                updateCartBadge();
                renderCartPage();
                showNotification('Produto removido do carrinho', 'info');
            }
        }

        function updateCartQuantity(productId, change) {
            const item = shoppingCart.find(item => item.produtoId === productId);
            const product = products.find(p => p.id === productId);

            if (!item || !product) return;

            const newQuantity = item.quantidade + change;

            if (newQuantity <= 0) {
                removeFromCart(productId);
                return;
            }

            if (newQuantity > product.estoque) {
                showNotification('Quantidade máxima atingida', 'error');
                return;
            }

            item.quantidade = newQuantity;
            updateCartBadge();
            renderCartPage();
        }

        function renderCartPage() {
            const cartContent = document.getElementById('cart-content');
            const cartSubtitle = document.getElementById('cart-subtitle');
            const emptyCartState = document.getElementById('empty-cart-state');

            const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantidade, 0);
            cartSubtitle.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`;

            if (shoppingCart.length === 0) {
                cartContent.innerHTML = '';
                emptyCartState.style.display = 'block';
                return;
            }

            emptyCartState.style.display = 'none';

            const total = calculateCartTotal();

            let html = `
                <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); align-items: start;">
                    <!-- Cart Items -->
                    <div>
            `;

            shoppingCart.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                const icon = getCategoryIcon(products.find(p => p.id === item.produtoId)?.categoria || 'Outros');

                html += `
                    <div style="display: grid; grid-template-columns: auto 1fr auto auto; gap: var(--space-4); align-items: center; padding: var(--space-4); background: var(--color-surface-light); border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: var(--space-4);">
                        <!-- Product Image -->
                        <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; border-radius: var(--radius-md);">
                            ${icon}
                        </div>

                        <!-- Product Info -->
                        <div>
                            <h4 style="margin: 0 0 var(--space-1) 0; color: var(--color-text);">${item.nome}</h4>
                            <p style="margin: 0 0 var(--space-1) 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">Vendido por: ${item.nomeLoja}</p>
                            <p style="margin: 0; color: var(--color-success); font-weight: 600;">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                        </div>

                        <!-- Quantity Controls -->
                        <div style="display: flex; align-items: center; gap: var(--space-2); background: var(--color-surface); border-radius: var(--radius-md); padding: var(--space-1);">
                            <button onclick="updateCartQuantity(${item.produtoId}, -1)" style="width: 32px; height: 32px; border: none; background: var(--color-secondary); color: white; border-radius: var(--radius-sm); cursor: pointer; font-weight: bold;">-</button>
                            <span style="min-width: 40px; text-align: center; font-weight: 600;">${item.quantidade}</span>
                            <button onclick="updateCartQuantity(${item.produtoId}, 1)" style="width: 32px; height: 32px; border: none; background: var(--color-secondary); color: white; border-radius: var(--radius-sm); cursor: pointer; font-weight: bold;">+</button>
                        </div>

                        <!-- Subtotal & Remove -->
                        <div style="text-align: right;">
                            <p style="margin: 0 0 var(--space-2) 0; font-weight: 600; color: var(--color-success);">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
                            <button onclick="removeFromCart(${item.produtoId})" style="background: var(--color-error); color: white; border: none; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); font-size: var(--font-size-sm); cursor: pointer;">Remover</button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>

                    <!-- Cart Summary -->
                    <div style="background: var(--color-surface-light); padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--color-border); position: sticky; top: 100px; min-width: 300px;">
                        <h3 style="color: var(--color-secondary); margin-bottom: var(--space-4);">Resumo do Pedido</h3>

                        <div style="border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-4); margin-bottom: var(--space-4);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                <span>Subtotal:</span>
                                <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                                <span>Frete:</span>
                                <span>Calcular no checkout</span>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; font-size: var(--font-size-lg); font-weight: bold; color: var(--color-success); margin-bottom: var(--space-6);">
                            <span>Total:</span>
                            <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                            <button class="btn" onclick="checkout()" style="width: 100%;">Finalizar Compra</button>
                            <button class="btn btn-outline" onclick="showPage('marketplace')" style="width: 100%;">Continuar Comprando</button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Layout -->
                <style>
                    @media (max-width: 768px) {
                        #cart-content > div:first-child {
                            grid-template-columns: 1fr !important;
                        }

                        #cart-content .sticky {
                            position: relative !important;
                            top: auto !important;
                            margin-top: var(--space-6);
                        }
                    }
                </style>
            `;

            cartContent.innerHTML = html;
        }

        function checkout() {
            showNotification('Funcionalidade de checkout será implementada em breve', 'info');
        }

        function showNotification(message, type = 'success') {
            // Remove existing notification
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();

            // Create new notification
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Show with animation
            setTimeout(() => notification.classList.add('show'), 100);

            // Hide after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Close mobile sidebar when clicking outside or on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileSidebar();
                closeLoginModal();
            }
        });

        // Close mobile sidebar on window resize if it becomes desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
        });

        // Mobile Navigation Functions
        function toggleMobileSidebar() {
            const sidebar = document.querySelector('.mobile-sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            const hamburger = document.querySelector('.hamburger-menu');

            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            hamburger.classList.toggle('open');

            // Prevent body scroll when sidebar is open
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        function closeMobileSidebar() {
            const sidebar = document.querySelector('.mobile-sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            const hamburger = document.querySelector('.hamburger-menu');

            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('open');
            document.body.style.overflow = '';
        }

        function navigateFromSidebar(pageId) {
            closeMobileSidebar();
            showPage(pageId);
        }

        function logoutFromSidebar() {
            closeMobileSidebar();
            logout();
        }

        // Login Modal Functions
        function showLoginModal() {
            const modal = document.getElementById('loginModal');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeLoginModal() {
            const modal = document.getElementById('loginModal');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        function goToLogin() {
            closeLoginModal();
            showPage('login');
        }

        function goToRegister() {
            closeLoginModal();
            showPage('registro');
        }

        // Google Authentication Functions (UI only for now)
        function handleGoogleLogin() {
            showNotification('Login com Google será implementado em breve', 'info');
            console.log('Google login - coming soon');
        }

        function handleGoogleRegister() {
            showNotification('Registro com Google será implementado em breve', 'info');
            console.log('Google register - coming soon');
        }

        // Update navigation for logged in users
        function updateNavigation() {
            const logoutLink = document.querySelector('#logout-link');
            const mobileLogoutLink = document.querySelector('#mobile-logout-link');
            const mobileLoginLink = document.querySelector('#mobile-login-link');
            const mobileRegisterLink = document.querySelector('#mobile-register-link');
            const cartNavLink = document.querySelector('#cart-nav-link');
            const mobileCartLink = document.querySelector('#mobile-cart-link');
            const navLoginLink = document.querySelector('#nav-login-link');
            const navRegisterLink = document.querySelector('#nav-register-link');

            if (currentUser) {
                logoutLink.classList.remove('hidden');
                mobileLogoutLink.classList.remove('hidden');
                cartNavLink.classList.remove('hidden');
                mobileCartLink.classList.remove('hidden');

                mobileLoginLink.style.display = 'none';
                mobileRegisterLink.style.display = 'none';
                navLoginLink.style.display = 'none';
                navRegisterLink.style.display = 'none';
            } else {
                logoutLink.classList.add('hidden');
                mobileLogoutLink.classList.add('hidden');
                cartNavLink.classList.add('hidden');
                mobileCartLink.classList.add('hidden');

                mobileLoginLink.style.display = 'block';
                mobileRegisterLink.style.display = 'block';
                navLoginLink.style.display = 'block';
                navRegisterLink.style.display = 'block';
            }
        }

        // Logout Function
        function logout() {
            currentUser = null;
            shoppingCart = []; // Clear cart on logout
            updateCartBadge();
            updateNavigation();
            showPage('marketplace');
        }

        // Category card click function for client dashboard
        function goToMarketplaceWithCategory(category) {
            showPage('marketplace');

            // Update filter
            currentFilter = category;

            // Update active filter button
            setTimeout(() => {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.textContent.includes(category) || (category === 'Todos' && btn.textContent === 'Todos')) {
                        btn.classList.add('active');
                    }
                });

                // Filter and render products
                let filteredProducts;
                if (category === 'Todos') {
                    filteredProducts = products.filter(p => p.publicado);
                } else {
                    filteredProducts = products.filter(p => p.publicado && p.categoria === category);
                }

                renderProducts(filteredProducts);

                // Scroll to top
                window.scrollTo(0, 0);
            }, 100);
        }

        // Page navigation with marketplace loading
        const originalShowPage = showPage;
        showPage = function(pageId) {
            originalShowPage(pageId);

            // Load specific page content
            if (pageId === 'marketplace') {
                loadMarketplace();
            } else if (pageId === 'seller-profile') {
                loadSellerProfileData();
            } else if (pageId === 'carrinho') {
                renderCartPage();
            } else if (pageId === 'cliente-profile') {
                loadClienteProfileData();
            }
        }

        // Store Page Functions
        function navigateToStore(vendedorId) {
            showStorePage(vendedorId);
        }

        function showStorePage(vendedorId) {
            // Find the seller
            const seller = users.find(u => u.id.toString() === vendedorId && u.tipo === 'vendedor');
            if (!seller) {
                showNotification('Loja não encontrada', 'error');
                return;
            }

            // Get seller's products
            const sellerProducts = products.filter(p => p.vendedorId === vendedorId && p.publicado);

            // Load store page data
            loadStorePageData(seller, sellerProducts);

            // Show store page
            showPage('store-page');
        }

        function loadStorePageData(seller, sellerProducts) {
            // Update breadcrumb
            document.getElementById('store-breadcrumb-name').textContent = seller.nomeLoja;

            // Generate store avatar (initials from store name)
            const initials = generateStoreInitials(seller.nomeLoja);
            document.getElementById('store-avatar').textContent = initials;

            // Update store header info
            document.getElementById('store-name-display').textContent = seller.nomeLoja;
            document.getElementById('store-category-display').textContent = seller.categoria || 'Categoria não informada';
            document.getElementById('store-description-display').textContent = seller.descricaoLoja || 'Esta loja ainda não tem uma descrição.';
            document.getElementById('store-products-count').textContent = sellerProducts.length;

            // Format member since date
            const memberDate = new Date(seller.id);
            const memberSince = memberDate.toLocaleDateString('pt-BR', {
                month: 'short',
                year: 'numeric'
            }).replace('.', '');
            document.getElementById('store-member-since').textContent = memberSince;

            // Update products section title
            document.getElementById('store-products-title').textContent = seller.nomeLoja;

            // Load store category filters
            loadStoreCategoryFilters(sellerProducts);

            // Load store products
            renderStoreProducts(sellerProducts);
        }

        function generateStoreInitials(storeName) {
            if (!storeName) return '🏪';

            const words = storeName.split(' ');
            if (words.length === 1) {
                return words[0].substring(0, 2).toUpperCase();
            } else {
                return (words[0][0] + words[1][0]).toUpperCase();
            }
        }

        function loadStoreCategoryFilters(sellerProducts) {
            // Get unique categories from seller's products
            const categories = [...new Set(sellerProducts.map(p => p.categoria))];

            const filtersContainer = document.getElementById('store-category-filters');
            let filtersHTML = '<button class="filter-btn active" onclick="filterStoreByCategory(\'Todos\')">Todos</button>';

            categories.forEach(category => {
                const icon = getCategoryIcon(category);
                filtersHTML += `<button class="filter-btn" onclick="filterStoreByCategory('${category}')">${icon} ${category}</button>`;
            });

            filtersContainer.innerHTML = filtersHTML;
        }

        function renderStoreProducts(productsToShow, filterCategory = 'Todos') {
            const container = document.getElementById('store-products-grid');
            const emptyState = document.getElementById('store-empty-state');

            if (productsToShow.length === 0) {
                container.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';

            let html = '';
            productsToShow.forEach(product => {
                const icon = getCategoryIcon(product.categoria);
                const stockStatus = getStockStatus(product.estoque);

                html += `
                    <div class="product-card" onclick="showProductDetail(${product.id})">
                        <div class="product-image">${icon}</div>
                        <div class="product-category">${product.categoria}</div>
                        <div class="product-name">${product.nome}</div>
                        <div class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="product-description">${product.descricao.length > 60 ? product.descricao.substring(0, 60) + '...' : product.descricao}</div>
                        <div class="product-stock ${stockStatus.class}">${stockStatus.text}</div>
                        <button class="btn btn-add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">🛒 Adicionar ao Carrinho</button>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function filterStoreByCategory(category) {
            // Update active filter button
            document.querySelectorAll('#store-category-filters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            event.target.classList.add('active');

            // Get current store's vendedor ID from the page state
            const storeName = document.getElementById('store-name-display').textContent;
            const seller = users.find(u => u.nomeLoja === storeName && u.tipo === 'vendedor');

            if (!seller) return;

            // Filter products
            let sellerProducts = products.filter(p => p.vendedorId === seller.id.toString() && p.publicado);

            if (category !== 'Todos') {
                sellerProducts = sellerProducts.filter(p => p.categoria === category);
            }

            renderStoreProducts(sellerProducts, category);
        }

        function showMyStore() {
            if (!currentUser || currentUser.tipo !== 'vendedor') {
                showNotification('Acesso negado', 'error');
                return;
            }

            showStorePage(currentUser.id.toString());
        }

        function contactSeller() {
            showNotification('Funcionalidade de contato será implementada em breve', 'info');
        }

        // Cliente Profile Functions
        function showClienteProfile() {
            if (!currentUser || currentUser.tipo !== 'cliente') {
                showNotification('Acesso negado', 'error');
                return;
            }

            showPage('cliente-profile');
        }

        function loadClienteProfileData() {
            if (!currentUser || currentUser.tipo !== 'cliente') return;

            // Initialize endereco if it doesn't exist
            if (!currentUser.endereco) {
                currentUser.endereco = {
                    cep: '',
                    rua: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: ''
                };
            }

            // Load profile view mode data
            document.getElementById('cliente-display-nome').textContent = currentUser.nome || 'Não informado';
            document.getElementById('cliente-display-email').textContent = currentUser.email || 'Não informado';
            document.getElementById('cliente-display-telefone').textContent = currentUser.telefone || 'Não informado';

            // Load endereco data
            document.getElementById('cliente-display-cep').textContent = currentUser.endereco.cep || 'Não informado';
            document.getElementById('cliente-display-rua').textContent = currentUser.endereco.rua || 'Não informado';
            document.getElementById('cliente-display-numero').textContent = currentUser.endereco.numero || 'Não informado';
            document.getElementById('cliente-display-complemento').textContent = currentUser.endereco.complemento || 'Não informado';
            document.getElementById('cliente-display-bairro').textContent = currentUser.endereco.bairro || 'Não informado';
            document.getElementById('cliente-display-cidade').textContent = currentUser.endereco.cidade || 'Não informado';
            document.getElementById('cliente-display-estado').textContent = currentUser.endereco.estado ?
                (estadosBrasileiros.find(e => e.code === currentUser.endereco.estado)?.name || currentUser.endereco.estado) :
                'Não informado';
        }

        function populateEstadoDropdown(elementId) {
            const select = document.getElementById(elementId);
            if (!select) return;

            // Clear existing options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }

            estadosBrasileiros.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.code;
                option.textContent = estado.name;
                select.appendChild(option);
            });
        }

        function enterClienteEditMode() {
            if (!currentUser || currentUser.tipo !== 'cliente') return;

            // Hide view mode, show edit mode
            document.getElementById('cliente-profile-view-mode').style.display = 'none';
            document.getElementById('cliente-profile-edit-mode').style.display = 'block';

            // Populate the state dropdown
            populateEstadoDropdown('edit-cliente-estado');

            // Pre-fill form with current data
            document.getElementById('edit-cliente-nome').value = currentUser.nome || '';
            document.getElementById('edit-cliente-telefone').value = currentUser.telefone || '';
            document.getElementById('edit-cliente-display-email').textContent = currentUser.email;

            // Pre-fill endereco if it exists
            if (currentUser.endereco) {
                document.getElementById('edit-cliente-cep').value = currentUser.endereco.cep || '';
                document.getElementById('edit-cliente-rua').value = currentUser.endereco.rua || '';
                document.getElementById('edit-cliente-numero').value = currentUser.endereco.numero || '';
                document.getElementById('edit-cliente-complemento').value = currentUser.endereco.complemento || '';
                document.getElementById('edit-cliente-bairro').value = currentUser.endereco.bairro || '';
                document.getElementById('edit-cliente-cidade').value = currentUser.endereco.cidade || '';
                document.getElementById('edit-cliente-estado').value = currentUser.endereco.estado || '';
            }

            // Clear any previous error messages
            document.querySelectorAll('#cliente-profile-edit-mode .error-message').forEach(error => {
                error.style.display = 'none';
            });
            document.getElementById('cliente-profile-edit-messages').innerHTML = '';
        }

        function cancelClienteEditMode() {
            // Show view mode, hide edit mode
            document.getElementById('cliente-profile-view-mode').style.display = 'block';
            document.getElementById('cliente-profile-edit-mode').style.display = 'none';

            // Clear form
            document.getElementById('editClienteProfileForm').reset();
        }

        function formatCep(input) {
            let value = input.value.replace(/\D/g, '');

            if (value.length > 8) {
                value = value.substring(0, 8);
            }

            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }

            input.value = value;
        }

        // Edit Cliente Profile Form Handler
        document.addEventListener('DOMContentLoaded', function() {
            const editClienteForm = document.getElementById('editClienteProfileForm');
            if (editClienteForm) {
                editClienteForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    if (!currentUser || currentUser.tipo !== 'cliente') {
                        showMessage('cliente-profile-edit-messages', 'Erro: Usuário não autorizado', true);
                        return;
                    }

                    const nome = document.getElementById('edit-cliente-nome').value.trim();
                    const telefone = document.getElementById('edit-cliente-telefone').value.trim();
                    const cep = document.getElementById('edit-cliente-cep').value.trim();
                    const rua = document.getElementById('edit-cliente-rua').value.trim();
                    const numero = document.getElementById('edit-cliente-numero').value.trim();
                    const complemento = document.getElementById('edit-cliente-complemento').value.trim();
                    const bairro = document.getElementById('edit-cliente-bairro').value.trim();
                    const cidade = document.getElementById('edit-cliente-cidade').value.trim();
                    const estado = document.getElementById('edit-cliente-estado').value;

                    // Clear previous errors
                    document.querySelectorAll('#cliente-profile-edit-mode .error-message').forEach(error => {
                        error.style.display = 'none';
                    });

                    let hasError = false;

                    // Validate required fields
                    if (!nome || nome.length < 3) {
                        document.getElementById('edit-cliente-nome-error').style.display = 'block';
                        hasError = true;
                    }

                    if (hasError) {
                        showMessage('cliente-profile-edit-messages', 'Por favor, corrija os erros abaixo.', true);
                        return;
                    }

                    // Update user data
                    currentUser.nome = nome;
                    currentUser.telefone = telefone;

                    // Initialize endereco if it doesn't exist
                    if (!currentUser.endereco) {
                        currentUser.endereco = {};
                    }

                    // Update endereco
                    currentUser.endereco.cep = cep;
                    currentUser.endereco.rua = rua;
                    currentUser.endereco.numero = numero;
                    currentUser.endereco.complemento = complemento;
                    currentUser.endereco.bairro = bairro;
                    currentUser.endereco.cidade = cidade;
                    currentUser.endereco.estado = estado;

                    // Update user in users array
                    const userIndex = users.findIndex(u => u.id === currentUser.id);
                    if (userIndex !== -1) {
                        users[userIndex] = { ...currentUser };
                    }

                    // Update dashboard display name
                    const customerNameElement = document.getElementById('customer-name');
                    if (customerNameElement) {
                        customerNameElement.textContent = nome;
                    }

                    // Show success message and return to view mode
                    showNotification('Perfil atualizado com sucesso!', 'success');

                    // Reload profile data and return to view mode
                    setTimeout(() => {
                        loadClienteProfileData();
                        cancelClienteEditMode();
                    }, 1000);
                });
            }
        });

        // Initialize application
        document.addEventListener('DOMContentLoaded', function() {
            // Show marketplace (Explorar Produtos) page by default instead of home
            showPage('marketplace');

            // Initialize navigation state
            updateNavigation();

            // Initialize cart badge
            updateCartBadge();
        });
