import { query } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // CORS headers
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

  try {
    const { tipo, nome, email, senha, telefone, cpf_cnpj, nomeLoja, categoria, descricaoLoja } = req.body;

    // Validações
    if (!tipo || !nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se email já existe
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Determinar tipo de documento
    let tipoDocumento = null;
    if (cpf_cnpj) {
      const numbers = cpf_cnpj.replace(/\D/g, '');
      tipoDocumento = numbers.length === 11 ? 'CPF' : 'CNPJ';
    }

    // Inserir usuário
    const userResult = await query(
      `INSERT INTO users (tipo, nome, email, senha_hash, telefone, cpf_cnpj, tipo_documento)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, tipo, nome, email, telefone`,
      [tipo, nome, email, senhaHash, telefone, cpf_cnpj, tipoDocumento]
    );

    const user = userResult[0];

    // Se for vendedor, criar registro de seller
    if (tipo === 'vendedor') {
      const sellerResult = await query(
        `INSERT INTO sellers (user_id, nome_loja, categoria, descricao_loja)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [user.id, nomeLoja, categoria, descricaoLoja]
      );
      user.seller_id = sellerResult[0].id;
      user.nomeLoja = nomeLoja;
    }

    return res.status(201).json({
      success: true,
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
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}
