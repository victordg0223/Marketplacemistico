/**
 * Sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize string input by removing potentially harmful characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    // Remove HTML tags using a simple and efficient approach
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Limit length to prevent DoS
    .slice(0, 10000);
}

/**
 * Sanitize email address
 * @param {string} email - The email to sanitize
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return email;
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/g, '')
    .slice(0, 255);
}

/**
 * Sanitize numeric input
 * @param {any} input - The input to sanitize as number
 * @returns {number|null} - Sanitized number or null
 */
export function sanitizeNumber(input) {
  const num = parseFloat(input);
  return isNaN(num) ? null : num;
}

/**
 * Sanitize integer input
 * @param {any} input - The input to sanitize as integer
 * @returns {number|null} - Sanitized integer or null
 */
export function sanitizeInteger(input) {
  const num = parseInt(input, 10);
  return isNaN(num) ? null : num;
}

/**
 * Sanitize URL
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  
  url = url.trim();
  
  // Only allow http, https, and relative URLs
  if (url && !url.match(/^(https?:\/\/|\/)/)) {
    return '';
  }
  
  // Remove javascript: and data: protocols
  if (url.match(/^(javascript|data):/i)) {
    return '';
  }
  
  return url.slice(0, 2000);
}

/**
 * Sanitize CPF/CNPJ
 * @param {string} cpfCnpj - The CPF/CNPJ to sanitize
 * @returns {string} - Sanitized CPF/CNPJ (only digits and formatting chars)
 */
export function sanitizeCpfCnpj(cpfCnpj) {
  if (typeof cpfCnpj !== 'string') return '';
  
  // Only allow digits, dots, hyphens, and slashes
  return cpfCnpj
    .trim()
    .replace(/[^\d.\-\/]/g, '')
    .slice(0, 18);
}

/**
 * Sanitize phone number
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - Sanitized phone
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  
  // Only allow digits, spaces, parentheses, hyphens, and plus
  return phone
    .trim()
    .replace(/[^\d\s()\-+]/g, '')
    .slice(0, 20);
}

/**
 * Sanitize boolean input
 * @param {any} input - The input to convert to boolean
 * @returns {boolean} - Sanitized boolean
 */
export function sanitizeBoolean(input) {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') {
    return input.toLowerCase() === 'true' || input === '1';
  }
  return Boolean(input);
}

/**
 * Sanitize an object's string properties
 * @param {object} obj - The object to sanitize
 * @param {string[]} stringFields - Array of field names to sanitize as strings
 * @param {string[]} emailFields - Array of field names to sanitize as emails
 * @param {string[]} urlFields - Array of field names to sanitize as URLs
 * @returns {object} - Object with sanitized fields
 */
export function sanitizeObject(obj, stringFields = [], emailFields = [], urlFields = []) {
  const sanitized = { ...obj };
  
  stringFields.forEach(field => {
    if (sanitized[field] !== undefined) {
      sanitized[field] = sanitizeString(sanitized[field]);
    }
  });
  
  emailFields.forEach(field => {
    if (sanitized[field] !== undefined) {
      sanitized[field] = sanitizeEmail(sanitized[field]);
    }
  });
  
  urlFields.forEach(field => {
    if (sanitized[field] !== undefined) {
      sanitized[field] = sanitizeUrl(sanitized[field]);
    }
  });
  
  return sanitized;
}
