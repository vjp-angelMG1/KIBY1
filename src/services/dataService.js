import { APP_CONFIG } from "../config/constants";

// --- MÓDULOS ---
const getModules = () => {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.MODULES);
  // Datos iniciales por defecto si está vacío
  if (!data) {
    const defaults = [
      { id: 1, title: "Master en React", desc: "Aprende desde cero.", category: "Programación", price: 49.99, img: "https://picsum.photos/seed/react/400/200" },
      { id: 2, title: "Diseño UI/UX", desc: "Principios básicos.", category: "Diseño", price: 0, img: "https://picsum.photos/seed/ui/400/200" }
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
  create: (module) => {
    const list = getModules();
    const newModule = { ...module, id: Date.now() };
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
  // --- Lógica de Compras ---
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
    list.push({ code, discount, img, active: true });
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.COUPONS, JSON.stringify(list));
  }
};