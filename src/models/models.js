/**
 * @typedef {Object} User
 * @property {string} email - El correo electrónico del usuario.
 * @property {string} uid - El ID único de autenticación.
 */

/**
 * @typedef {Object} Module
 * @property {number} id - Identificador único del módulo.
 * @property {string} title - Título del curso.
 * @property {string} desc - Despción del contenido.
 * @property {string} category - Categoría (Ej: 'Programación').
 * @property {number} price - Precio del módulo.
 * @property {string} img - URL de la imagen principal.
 */

/**
 * @typedef {Object} Coupon
 * @property {string} code - Código único del cupón.
 * @property {number} discount - Porcentaje de descuento.
 * @property {string} img - URL de la imagen del cupón.
 * @property {boolean} active - Estado del cupón.
 */

/**
 * @typedef {Object} Purchase
 * @property {number} moduleId - ID del módulo comprado.
 */