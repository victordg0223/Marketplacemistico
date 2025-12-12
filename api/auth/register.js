import { query } from '../db.js';
import bcryptjs from 'bcryptjs';
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeCpfCnpj } from '../sanitize.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  console.log('📝 Iniciando registro de usuário...');
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    let { tipo, nome, email, senha, telefone, cpf_cnpj, nomeLoja, categoria, descricaoLoja } = req.body;

    // Sanitize all inputs
    tipo = sanitizeString(tipo);
    nome = sanitizeString(nome);
    email = sanitizeEmail(email);
    telefone = sanitizePhone(telefone);
    cpf_cnpj = sanitizeCpfCnpj(cpf_cnpj);
    nomeLoja = sanitizeString(nomeLoja);
    categoria = sanitizeString(categoria);
    descricaoLoja = sanitizeString(descricaoLoja);

    // Validate required fields
    if (!tipo || !nome || !email || !senha) {
      console.log('❌ Campos obrigatórios faltando');
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Require telefone and cpf_cnpj for all users
    if (!telefone || !cpf_cnpj) {
      console.log('❌ Telefone e CPF/CNPJ são obrigatórios');
      return res.status(400).json({ error: 'Telefone e CPF/CNPJ são obrigatórios para completar o perfil' });
    }

    console.log('✅ Validação inicial OK');

    console.log('🔍 Verificando se email existe...');
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.length > 0) {
      console.log('❌ Email já cadastrado');
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    console.log('✅ Email disponível');

    console.log('🔐 Gerando hash da senha...');
    const senhaHash = await bcryptjs.hash(senha, 10);
    console.log('✅ Hash gerado');

    let tipoDocumento = null;
    if (cpf_cnpj) {
      const numbers = cpf_cnpj.replace(/\D/g, '');
      tipoDocumento = numbers.length === 11 ? 'CPF' : 'CNPJ';
    }

    console.log('💾 Inserindo usuário no banco...');
    const userResult = await query(
      `INSERT INTO users (tipo, nome, email, senha_hash, telefone, cpf_cnpj, tipo_documento)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, tipo, nome, email, telefone`,
      [tipo, nome, email, senhaHash, telefone, cpf_cnpj, tipoDocumento]
    );

    console.log('✅ Usuário inserido:', userResult);
    const user = userResult[0];

    if (tipo === 'vendedor') {
      console.log('🏪 Criando registro de vendedor...');
      const sellerResult = await query(
        `INSERT INTO sellers (user_id, nome_loja, categoria, descricao_loja)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [user.id, nomeLoja, categoria, descricaoLoja]
      );
      console.log('✅ Vendedor criado:', sellerResult);
      user.seller_id = sellerResult[0].id;
      user.nomeLoja = nomeLoja;
    }

    console.log('🎉 Registro concluído com sucesso!');
    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        tipo: user.tipo,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        nomeLoja: user.nomeLoja
      }
    });

  } catch (error) {
    console.error('💥 ERRO NO REGISTRO:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro ao criar usuário',
      details: error.message 
    });
  }
}
