import { APP_CONFIG } from "../config/constants";

// --- MÓDULOS (Mantén el código igual, solo asegúrate de que guarde bien) ---
const getModules = () => {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.MODULES);
  if (!data) {
    const defaults = [
      { 
        id: 1, 
        title: "Master en React", 
        desc: "Aprende desde cero.", 
        category: "Programación", 
        price: 49.99, 
        // Foto de código/programación real
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
      },
      { 
        id: 2, 
        title: "Diseño UI/UX", 
        desc: "Principios básicos.", 
        category: "Diseño", 
        price: 0, 
        // Foto de diseño de interfaces real
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
      },
      { 
        id: 3, 
        title: "Marketing 360", 
        desc: "Estrategias de mercado.", 
        category: "Marketing", 
        price: 29.99, 
        // Foto de marketing/negocios real
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
      }
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
  create: (moduleData) => {
    const list = getModules();
    const newModule = { ...moduleData, id: Date.now() };
    saveModules([...list, newModule]);
  },
  update: (updatedModule) => {
    let list = getModules();
    list = list.map(m => m.id == updatedModule.id ? updatedModule : m);
    saveModules(list);
  },
  delete: (id) => {
    let list = getModules();
    list = list.filter(m => m.id != id);
    saveModules(list);
  },
  getPurchases: () => JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [],
  isPurchased: (id) => {
    const purchases = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [];
    return purchases.includes(id);
  },
  addPurchase: (id) => {
    let purchases = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [];
    if (!purchases.includes(id)) {
      purchases.push(id);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    }
  },
  getMyModules: () => {
    const all = getModules();
    const myIds = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PURCHASES)) || [];
    return all.filter(m => myIds.includes(m.id));
  }
};

// --- CUPONES (Mejorado para gestión de estado y borrado) ---
export const CouponService = {
  getAll: () => JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.COUPONS)) || [],
  
  /** Crear con ID único */
  create: (code, discount, img) => {
    const list = CouponService.getAll();
    const newCoupon = { 
      id: Date.now(), // ID único para poder borrar
      code, 
      discount, 
      img, 
      active: true, 
      created: Date.now() // Para simular expiración
    };
    list.push(newCoupon);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  },

  /** Borrar cupón */
  delete: (id) => {
    let list = CouponService.getAll();
    list = list.filter(c => c.id !== id);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  },

  /** Cambiar estado Activo/Inactivo (Simular expiración) */
  toggleStatus: (id) => {
    let list = CouponService.getAll();
    list = list.map(c => c.id === id ? { ...c, active: !c.active } : c);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  }
};