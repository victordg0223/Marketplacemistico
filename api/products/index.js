import { query } from '../db.js';
import jwt from 'jsonwebtoken';
import { sanitizeString, sanitizeNumber, sanitizeInteger, sanitizeUrl, sanitizeBoolean } from '../sanitize.js';

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

  if (req.method === 'GET') {
    try {
      const { categoria, seller_id } = req.query;

      let queryText = `
        SELECT p.*, s.nome_loja, s.user_id as vendedor_id
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        WHERE p.publicado = true
      `;
      const params = [];
      let paramCount = 1;

      if (categoria && categoria !== 'Todos') {
        queryText += ` AND p.categoria = $${paramCount}`;
        params.push(categoria);
        paramCount++;
      }

      if (seller_id) {
        queryText += ` AND s.id = $${paramCount}`;
        params.push(seller_id);
        paramCount++;
      }

      queryText += ' ORDER BY p.created_at DESC';

      const products = await query(queryText, params);

      return res.status(200).json({ success: true, products });

    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = verifyToken(req);
      if (!user || user.tipo !== 'vendedor') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const sellers = await query('SELECT id FROM sellers WHERE user_id = $1', [user.id]);
      if (sellers.length === 0) {
        return res.status(404).json({ error: 'Vendedor não encontrado' });
      }
      const sellerId = sellers[0].id;

      let { nome, categoria, descricao, preco, estoque, imagemUrl, publicado } = req.body;

      // Sanitize all inputs
      nome = sanitizeString(nome);
      categoria = sanitizeString(categoria);
      descricao = sanitizeString(descricao);
      preco = sanitizeNumber(preco);
      estoque = sanitizeInteger(estoque);
      imagemUrl = sanitizeUrl(imagemUrl);
      publicado = sanitizeBoolean(publicado);

      if (!nome || !categoria || preco === null) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      // Ensure estoque is at least 0
      if (estoque === null || estoque < 0) {
        estoque = 0;
      }

      const result = await query(
        `INSERT INTO products (seller_id, nome, categoria, descricao, preco, estoque, imagem_url, publicado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [sellerId, nome, categoria, descricao, preco, estoque, imagemUrl || '', publicado]
      );

      console.log('✅ Produto criado:', result);
      return res.status(201).json({ success: true, product: result[0] });

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
