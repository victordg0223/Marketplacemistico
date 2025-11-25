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

  const { id } = req.query;

  // GET - Buscar produto por ID
  if (req.method === 'GET') {
    try {
      const products = await query(
        `SELECT p.*, s.nome_loja, s.user_id as vendedor_id
         FROM products p
         JOIN sellers s ON p.seller_id = s.id
         WHERE p.id = $1`,
        [id]
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

  // PUT - Atualizar produto
  if (req.method === 'PUT') {
    try {
      const user = verifyToken(req);
      if (!user || user.tipo !== 'vendedor') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { nome, categoria, descricao, preco, estoque, imagemUrl, publicado } = req.body;

      // Verificar se o produto pertence ao vendedor
      const sellers = await query('SELECT id FROM sellers WHERE user_id = $1', [user.id]);
      if (sellers.length === 0) {
        return res.status(403).json({ error: 'Vendedor não encontrado' });
      }
      const sellerId = sellers[0].id;

      const products = await query('SELECT * FROM products WHERE id = $1 AND seller_id = $2', [id, sellerId]);
      if (products.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado ou sem permissão' });
      }

      const result = await query(
        `UPDATE products
         SET nome = $1, categoria = $2, descricao = $3, preco = $4, estoque = $5, imagem_url = $6, publicado = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [nome, categoria, descricao, preco, estoque, imagemUrl, publicado, id]
      );

      return res.status(200).json({ success: true, product: result[0] });

    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  // DELETE - Deletar produto
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
        [id, sellerId]
      );

      if (result.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado ou sem permissão' });
      }

      return res.status(200).json({ success: true, message: 'Produto deletado' });

    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
