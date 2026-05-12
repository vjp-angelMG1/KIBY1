import { APP_CONFIG } from "../config/constants";

// Versión de los datos para forzar la actualización de fotos
const DATA_VERSION = "v2_fotos_unsplash";

const getModules = () => {
  const version = localStorage.getItem('kiby_data_version');
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.MODULES);
  
  if (!data || version !== DATA_VERSION) {
    const defaults = [
      { 
        id: 1, 
        title: "Master en React", 
        desc: "Aprende desde cero.", 
        category: "Programación", 
        price: 49.99, 
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
      },
      { 
        id: 2, 
        title: "Diseño UI/UX", 
        desc: "Principios básicos.", 
        category: "Diseño", 
        price: 0, 
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
      },
      { 
        id: 3, 
        title: "Marketing 360", 
        desc: "Estrategias de mercado.", 
        category: "Marketing", 
        price: 29.99, 
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
      }
    ];
    saveModules(defaults);
    localStorage.setItem('kiby_data_version', DATA_VERSION);
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
    const finalImg = moduleData.img || "https://placehold.co/600x400/161616/bf522b?text=Kiby+Course";
    const newModule = { ...moduleData, img: finalImg, id: Date.now() };
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

// --- CUPONES ---
export const CouponService = {
  getAll: () => JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.COUPONS)) || [],
  
  create: (code, discount, img) => {
    const list = CouponService.getAll();
    const finalImg = img || `https://placehold.co/600x400/161616/bf522b?text=${code}`;
    const newCoupon = { id: Date.now(), code, discount, img: finalImg, active: true, created: Date.now() };
    list.push(newCoupon);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  },

  delete: (id) => {
    let list = CouponService.getAll();
    list = list.filter(c => c.id !== id);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  },

  toggleStatus: (id) => {
    let list = CouponService.getAll();
    list = list.map(c => c.id === id ? { ...c, active: !c.active } : c);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  },

  // 🚀 AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA 🚀
  applyCoupon: (code) => {
    const list = CouponService.getAll();
    // Busca el cupón ignorando mayúsculas/minúsculas y que esté activo
    const coupon = list.find(c => c.code.toLowerCase() === code.toLowerCase() && c.active);
    return coupon || null; // Devuelve el cupón o null si no es válido
  }
};