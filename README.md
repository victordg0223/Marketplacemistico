# 🔮 Marketplace Místico

Marketplace de produtos místicos e esotéricos conectando vendedores especializados e compradores interessados em sua jornada espiritual.

## 📋 Sobre o Projeto

O Marketplace Místico é uma plataforma web completa para compra e venda de produtos esotéricos, místicos e espirituais. A plataforma oferece um sistema robusto de gerenciamento de produtos, autenticação de usuários e permite que clientes se tornem vendedores facilmente.

## ✨ Funcionalidades Principais

### Para Todos os Usuários
- 🔍 **Explorar Produtos**: Navegue por diversos produtos místicos organizados por categorias
- 📱 **Interface Responsiva**: Acesso completo via desktop, tablet e dispositivos móveis
- 🔐 **Sistema de Autenticação Seguro**: Login e registro com criptografia de senhas (bcrypt)
- 🛡️ **Proteção JWT**: Autenticação baseada em tokens JWT com validade de 7 dias

### Para Clientes (Compradores)
- 🛒 **Carrinho de Compras**: Adicione produtos ao carrinho e gerencie suas compras
- 👤 **Perfil Personalizável**: Gerencie suas informações pessoais
- 📦 **Visualização de Pedidos**: Acompanhe o histórico de suas compras
- 📍 **Gerenciamento de Endereços**: Cadastre e gerencie endereços de entrega
- 🏪 **Upgrade para Vendedor**: Possibilidade de se tornar vendedor mantendo capacidade de compra

### Para Vendedores
- ➕ **Adicionar Produtos**: Cadastre novos produtos com nome, descrição, preço, estoque e imagem
- 📊 **Dashboard de Vendedor**: Visualize e gerencie todos os seus produtos
- ✏️ **Editar Produtos**: Atualize informações dos produtos existentes
- 🗑️ **Excluir Produtos**: Remova produtos do catálogo
- 🏪 **Perfil da Loja**: Configure nome da loja, categoria, descrição e CPF/CNPJ
- 📈 **Controle de Estoque**: Gerencie quantidade disponível de cada produto
- 👁️ **Publicação de Produtos**: Escolha quais produtos exibir publicamente (rascunho ou publicado)
- 🛒 **Comprar como Cliente**: Vendedores mantêm todas as funcionalidades de comprador

### Categorias de Produtos
- 🔮 Cristais e Pedras
- 🕯️ Velas e Incensos
- 📿 Amuletos e Talismãs
- 📚 Livros Esotéricos
- 🌿 Ervas e Óleos
- 🔯 Artigos Ritualísticos
- 🃏 Tarô e Oráculos
- ✨ Outros

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Vercel Serverless Functions** - Hospedagem de API
- **PostgreSQL** (Neon Database) - Banco de dados
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização (design system customizado)
- **JavaScript (Vanilla)** - Lógica da aplicação
- **LocalStorage** - Persistência de sessão no navegador

### Segurança
- ✅ Sanitização de inputs
- ✅ Validação de CPF/CNPJ
- ✅ Validação de email
- ✅ Senhas hasheadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ CORS configurado
- ✅ Prepared statements (SQL injection prevention)

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- Conta no Vercel
- Banco de dados PostgreSQL (recomendado: Neon)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/victordg0223/Marketplacemistico.git
cd Marketplacemistico
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```env
DATABASE_URL=sua_connection_string_postgresql
JWT_SECRET=sua_chave_secreta_jwt
```

4. Execute o schema SQL no seu banco de dados:
```bash
# Execute o arquivo schema.sql no seu banco PostgreSQL
psql -U seu_usuario -d seu_banco -f schema.sql
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse a aplicação em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
Marketplacemistico/
├── api/                      # Backend serverless functions
│   ├── auth/                 # Autenticação
│   │   ├── login.js          # Endpoint de login
│   │   └── register.js       # Endpoint de registro
│   ├── products/             # Produtos
│   │   ├── index.js          # Listar/criar produtos
│   │   └── [id].js           # Editar/excluir produto
│   ├── users/                # Usuários
│   │   ├── profile.js        # Perfil do usuário
│   │   └── upgrade-to-vendor.js  # Upgrade de cliente para vendedor
│   ├── db.js                 # Configuração do banco de dados
│   └── sanitize.js           # Funções de sanitização
├── public/                   # Frontend
│   ├── index.html            # Página principal
│   ├── app.js                # Lógica JavaScript
│   ├── style.css             # Estilos
│   └── favicon.svg           # Ícone do site
├── schema.sql                # Schema do banco de dados
├── vercel.json               # Configuração Vercel
└── package.json              # Dependências do projeto
```

## 🔑 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário (cliente ou vendedor)
- `POST /api/auth/login` - Login de usuário

### Produtos
- `GET /api/products` - Listar produtos (com filtros de categoria e vendedor)
- `POST /api/products` - Criar novo produto (requer autenticação de vendedor)
- `DELETE /api/products/[id]` - Excluir produto (requer autenticação de vendedor)

### Usuários
- `GET /api/users/profile` - Obter perfil do usuário
- `POST /api/users/upgrade-to-vendor` - Converter cliente em vendedor

## 💾 Modelo de Dados

### Principais Tabelas
- **users** - Informações dos usuários (clientes e vendedores)
- **sellers** - Dados específicos de vendedores (loja, categoria)
- **products** - Catálogo de produtos
- **addresses** - Endereços de entrega
- **orders** - Pedidos realizados
- **order_items** - Itens de cada pedido

## 🔄 Fluxo de Upgrade de Cliente para Vendedor

1. Cliente faz login na plataforma
2. Acessa opção "Tornar-se Vendedor" no dashboard
3. Preenche dados da loja (nome, categoria, descrição, CPF/CNPJ)
4. Sistema cria registro de vendedor e atualiza tipo do usuário
5. **Novo token JWT é gerado** com permissões de vendedor
6. Cliente imediatamente pode adicionar produtos (sem necessidade de logout/login)

> **Nota Técnica**: A atualização do token JWT após upgrade é essencial para que o vendedor tenha acesso imediato às funcionalidades de venda, já que as APIs validam permissões através do token.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

## 👥 Autores

- [@victordg0223](https://github.com/victordg0223)
- [@ojuras](https://github.com/oJuras)

## 📞 Suporte

email: miwoadm@gmail.com
whatsapp: (11)91199-3949
Para dúvidas ou sugestões, abra uma issue no repositório do GitHub.

---

✨ **Marketplace Místico** - Conectando o mundo espiritual através da tecnologia
