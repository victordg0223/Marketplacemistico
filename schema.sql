-- Tabela de Usuários (unificada)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('vendedor', 'cliente')),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf_cnpj VARCHAR(18),
    tipo_documento VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vendedores (dados específicos)
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome_loja VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    descricao_loja TEXT,
    logo_url VARCHAR(500),
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_vendas INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Endereços
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cep VARCHAR(9),
    rua VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    is_default BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER DEFAULT 0,
    imagem_url VARCHAR(500),
    publicado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    comprador_id INTEGER NOT NULL REFERENCES users(id),
    vendedor_id INTEGER NOT NULL REFERENCES sellers(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_categoria ON products(categoria);
CREATE INDEX idx_products_publicado ON products(publicado);
CREATE INDEX idx_orders_comprador ON orders(comprador_id);
CREATE INDEX idx_orders_vendedor ON orders(vendedor_id);
CREATE INDEX idx_users_email ON users(email);

-- Inserir dados de teste
INSERT INTO users (tipo, nome, email, senha_hash, telefone, cpf_cnpj, tipo_documento) VALUES
('vendedor', 'Ana Mística', 'ana@tarotmistico.com', '$2b$10$abcdefghijklmnopqrstuvwxyz', '(11) 99999-9999', '12345678000190', 'CNPJ'),
('vendedor', 'Roberto Herbalista', 'roberto@ervasraizes.com', '$2b$10$abcdefghijklmnopqrstuvwxyz', '(11) 88888-8888', '12345678900', 'CPF'),
('cliente', 'Carlos Oliveira', 'carlos@email.com', '$2b$10$abcdefghijklmnopqrstuvwxyz', '(11) 77777-7777', NULL, NULL);

INSERT INTO sellers (user_id, nome_loja, categoria, descricao_loja) VALUES
(1, 'Tarot Místico', 'Tarô e Oráculos', 'Especialista em leituras de tarô com mais de 15 anos de experiência.'),
(2, 'Ervas & Raízes', 'Cristais e Pedras', 'Loja especializada em ervas medicinais, cristais e produtos naturais.');

INSERT INTO products (seller_id, nome, categoria, descricao, preco, estoque, publicado) VALUES
(1, 'Tiragem de 5 Cartas', 'Tarô e Oráculos', 'A tiragem é utilizada para ajudar em assuntos financeiros', 15.00, 50, true),
(2, 'Raiz Kumbaya', 'Cristais e Pedras', 'Raiz do sono vem para te auxiliar no stress do dia dia', 25.00, 30, true),
(1, 'Consulta de Tarô Completa', 'Tarô e Oráculos', 'Consulta completa de tarô com análise detalhada', 80.00, 10, true),
(2, 'Cristal de Ametista', 'Cristais e Pedras', 'Cristal de ametista natural para meditação', 45.00, 15, true),
(1, 'Baralho de Tarô Rider-Waite', 'Tarô e Oráculos', 'Baralho clássico Rider-Waite em português', 60.00, 25, true);
