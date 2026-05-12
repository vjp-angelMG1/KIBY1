import { APP_CONFIG } from "../config/constants";

/**
 * Servicio central de datos y Lógica de Negocio.
 * Define implicitamente los roles a través de los métodos disponibles:
 * - Admin: Usa métodos CRUD (create, update, delete).
 * - User: Usa métodos de Consumo (addPurchase, CouponService.create).
 * 
 * @namespace DataLayer
 */

// =======================
// MÓDULOS (Gestión de Cursos)
// =======================

/**
 * Obtiene la lista maestra de módulos desde LocalStorage.
 * Si no existen, devuelve los módulos por defecto.
 * @returns {Array<Module>} 
 */
const getModules = () => {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.MODULES);
  if (!data) {
    const defaults = [
      { id: 1, title: "Master en React", desc: "Aprende desde cero.", category: "Programación", price: 49.99, img: "https://picsum.photos/seed/react/400/200" },
      { id: 2, title: "Diseño UI/UX", desc: "Principios básicos.", category: "Diseño", price: 0, img: "https://picsum.photos/seed/ui/400/200" },
      { id: 3, title: "Marketing 360", desc: "Estrategias de mercado.", category: "Marketing", price: 29.99, img: "https://picsum.photos/seed/mkt/400/200" }
    ];
    saveModules(defaults);
    return defaults;
  }
  return JSON.parse(data);
};

const saveModules = (modules) => {
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.MODULES, JSON.stringify(modules));
};

export const ModuleService = {
  getAll: getModules,
  
  getById: (id) => getModules().find(m => m.id == id),

  // --- LÓGICA DE ROLES: ADMIN (CRUD) ---
  /** 
   * Crea un nuevo módulo. Solo Admin.
   * @param {Module} moduleData 
   */
  create: (moduleData) => {
    const list = getModules();
    const newModule = { ...moduleData, id: Date.now() };
    saveModules([...list, newModule]);
  },

  /** 
   * Actualiza un módulo existente. Solo Admin.
   * @param {Module} updatedModule 
   */
  update: (updatedModule) => {
    let list = getModules();
    list = list.map(m => m.id == updatedModule.id ? updatedModule : m);
    saveModules(list);
  },

  /** 
   * Elimina un módulo. Solo Admin.
   * @param {number} id 
   */
  delete: (id) => {
    let list = getModules();
    list = list.filter(m => m.id != id);
    saveModules(list);
  },

  // --- LÓGICA DE ROLES: USER (Compras/Inscripciones) ---
  /**
   * Obtiene lista de IDs de módulos comprados.
   * @returns {Array<number>}
   */
  getPurchases: () => JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [],

  /**
   * Verifica si el usuario posee el módulo.
   * @param {number} id 
   * @returns {boolean}
   */
  isPurchased: (id) => {
    const purchases = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [];
    return purchases.includes(id);
  },

  /**
   * Registra una compra o inscripción. Simula la persistencia de estado 'Pago'.
   * @param {number} id 
   */
  addPurchase: (id) => {
    let purchases = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [];
    if (!purchases.includes(id)) {
      purchases.push(id);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    }
  },

  /**
   * Filtra módulos que el usuario posee. Para el Menú Dinámico.
   * @returns {Array<Module>}
   */
  getMyModules: () => {
    const all = getModules();
    const myIds = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [];
    return all.filter(m => myIds.includes(m.id));
  }
};

// =======================
// CUPONES (Gestión de Descuentos)
// =======================

/**
 * Servicio de Cupones.
 * El Rol User debe ser capaz de crear sus propios cupones.
 */
export const CouponService = {
  /** 
   * @returns {Array<Coupon>} 
   */
  getAll: () => JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.COUPONS)) || [],

  /** 
   * Crea un nuevo cupón.
   * @param {string} code 
   * @param {number} discount 
   * @param {string} img 
   */
  create: (code, discount, img) => {
    const list = CouponService.getAll();
    list.push({ code, discount, img, active: true });
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  }
};