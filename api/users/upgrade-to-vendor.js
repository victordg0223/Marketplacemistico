import { query } from '../db.js';
import jwt from 'jsonwebtoken';
import { sanitizeString, sanitizeCpfCnpj } from '../sanitize.js';

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret_padrao_mude_isso');
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    // Check current user type
    const users = await query(
      'SELECT tipo FROM users WHERE id = $1',
      [user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const currentTipo = users[0].tipo;

    // Prevent downgrade - vendors cannot go back to cliente
    if (currentTipo === 'vendedor') {
      return res.status(400).json({ 
        error: 'Você já é um vendedor',
        success: false 
      });
    }

    // Only clientes can upgrade
    if (currentTipo !== 'cliente') {
      return res.status(400).json({ 
        error: 'Apenas clientes podem se tornar vendedores',
        success: false 
      });
    }

    const { nome_loja, categoria, descricao_loja, cpf_cnpj } = req.body;

    // Sanitize inputs
    const sanitizedNomeLoja = sanitizeString(nome_loja);
    const sanitizedCategoria = sanitizeString(categoria);
    const sanitizedDescricaoLoja = sanitizeString(descricao_loja);
    const sanitizedCpfCnpj = sanitizeCpfCnpj(cpf_cnpj);

    if (!sanitizedNomeLoja || !sanitizedCategoria || !sanitizedCpfCnpj) {
      return res.status(400).json({ 
        error: 'Nome da loja, categoria e CPF/CNPJ são obrigatórios',
        success: false 
      });
    }

    // Start transaction - update user tipo and create seller record
    
    // 1. Update user tipo to vendedor
    await query(
      'UPDATE users SET tipo = $1, cpf_cnpj = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['vendedor', sanitizedCpfCnpj, user.id]
    );

    // 2. Create seller record
    const sellerResult = await query(
      `INSERT INTO sellers (user_id, nome_loja, categoria, descricao_loja)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user.id, sanitizedNomeLoja, sanitizedCategoria, sanitizedDescricaoLoja || '']
    );

    const sellerId = sellerResult[0].id;

    // 3. Fetch updated user data
    const updatedUsers = await query(
      `SELECT u.*, s.id as seller_id, s.nome_loja, s.categoria, s.descricao_loja
       FROM users u
       LEFT JOIN sellers s ON u.id = s.user_id
       WHERE u.id = $1`,
      [user.id]
    );

    const updatedUser = updatedUsers[0];
    const { senha_hash, ...userData } = updatedUser;

    // 4. Generate new JWT token with updated user type
    const newToken = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, tipo: updatedUser.tipo },
      process.env.JWT_SECRET || 'secret_padrao_mude_isso',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Parabéns! Você agora é um vendedor!',
      token: newToken,
      user: userData
    });

  } catch (error) {
    console.error('Erro ao fazer upgrade para vendedor:', error);
    return res.status(500).json({ 
      error: 'Erro ao fazer upgrade para vendedor. Tente novamente.',
      success: false 
    });
  }
}
