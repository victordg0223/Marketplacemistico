import { query } from '../db.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sanitizeEmail } from '../sanitize.js';

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

  console.log('🔑 Tentativa de login...');

  try {
    let { email, senha } = req.body;

    // Sanitize email input
    email = sanitizeEmail(email);

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    console.log('🔍 Buscando usuário:', email);
    const users = await query(
      `SELECT u.*, s.id as seller_id, s.nome_loja, s.categoria, s.descricao_loja
       FROM users u
       LEFT JOIN sellers s ON u.id = s.user_id
       WHERE u.email = $1`,
      [email]
    );

    if (users.length === 0) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = users[0];
    console.log('✅ Usuário encontrado:', user.nome);

    console.log('🔐 Verificando senha...');
    const senhaValida = await bcryptjs.compare(senha, user.senha_hash);
    
    if (!senhaValida) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    console.log('✅ Senha válida');

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET || 'secret_padrao_mude_isso',
      { expiresIn: '7d' }
    );

    let endereco = null;
    if (user.tipo === 'cliente') {
      const addresses = await query(
        'SELECT * FROM addresses WHERE user_id = $1 AND is_default = true LIMIT 1',
        [user.id]
      );
      if (addresses.length > 0) {
        endereco = addresses[0];
      }
    }

    console.log('🎉 Login bem-sucedido!');
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        tipo: user.tipo,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        cpf_cnpj: user.cpf_cnpj,
        seller_id: user.seller_id,
        nomeLoja: user.nome_loja,
        categoria: user.categoria,
        descricaoLoja: user.descricao_loja,
        endereco
      }
    });

  } catch (error) {
    console.error('💥 ERRO NO LOGIN:', error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
}
