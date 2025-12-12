import { query } from '../db.js';
import jwt from 'jsonwebtoken';
import { sanitizeInteger } from '../sanitize.js';

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

  const { id } = req.query;
  const sanitizedId = sanitizeInteger(id);

  if (!sanitizedId) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (req.method === 'GET') {
    try {
      const products = await query(
        `SELECT p.*, s.nome_loja, s.user_id as vendedor_id
         FROM products p
         JOIN sellers s ON p.seller_id = s.id
         WHERE p.id = $1`,
        [sanitizedId]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.status(200).json({ success: true, product: products[0] });

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = verifyToken(req);
      if (!user || user.tipo !== 'vendedor') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const sellers = await query('SELECT id FROM sellers WHERE user_id = $1', [user.id]);
      if (sellers.length === 0) {
        return res.status(403).json({ error: 'Vendedor não encontrado' });
      }
      const sellerId = sellers[0].id;

      const result = await query(
        'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING id',
        [sanitizedId, sellerId]
      );

      if (result.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado ou sem permissão' });
      }

      console.log('✅ Produto deletado:', sanitizedId);
      return res.status(200).json({ success: true, message: 'Produto deletado' });

    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
