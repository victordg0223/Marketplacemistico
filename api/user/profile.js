import { query } from '../db.js';
import jwt from 'jsonwebtoken';

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

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // GET - Buscar perfil
  if (req.method === 'GET') {
    try {
      const users = await query(
        `SELECT u.*, s.id as seller_id, s.nome_loja, s.categoria, s.descricao_loja
         FROM users u
         LEFT JOIN sellers s ON u.id = s.user_id
         WHERE u.id = $1`,
        [user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const userData = users[0];
      delete userData.senha_hash;

      // Buscar endereço
      const addresses = await query(
        'SELECT * FROM addresses WHERE user_id = $1 AND is_default = true LIMIT 1',
        [user.id]
      );

      return res.status(200).json({
        success: true,
        user: userData,
        endereco: addresses.length > 0 ? addresses[0] : null
      });

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  // PUT - Atualizar perfil
  if (req.method === 'PUT') {
    try {
      const { nome, telefone, endereco } = req.body;

      if (nome) {
        await query('UPDATE users SET nome = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [nome, user.id]);
      }

      if (telefone) {
        await query('UPDATE users SET telefone = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [telefone, user.id]);
      }

      // Atualizar/criar endereço se fornecido
      if (endereco && user.tipo === 'cliente') {
        const existingAddresses = await query('SELECT id FROM addresses WHERE user_id = $1 AND is_default = true', [user.id]);
        
        if (existingAddresses.length > 0) {
          await query(
            `UPDATE addresses SET cep = $1, rua = $2, numero = $3, complemento = $4, bairro = $5, cidade = $6, estado = $7
             WHERE user_id = $8 AND is_default = true`,
            [endereco.cep, endereco.rua, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.estado, user.id]
          );
        } else {
          await query(
            `INSERT INTO addresses (user_id, cep, rua, numero, complemento, bairro, cidade, estado, is_default)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
            [user.id, endereco.cep, endereco.rua, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.estado]
          );
        }
      }

      return res.status(200).json({ success: true, message: 'Perfil atualizado' });

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
