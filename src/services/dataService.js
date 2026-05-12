import { APP_CONFIG } from "../config/constants";

// Versión de los datos. Si cambiamos la estructura, cambiamos la versión 
// para que el navegador actualice los cursos automáticamente.
const DATA_VERSION = "v3_contenido_detallado";

const getModules = () => {
  const version = localStorage.getItem('kiby_data_version');
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.MODULES);
  
  // Si la versión no coincide o no hay datos, forzamos la carga de los cursos por defecto
  if (!data || version !== DATA_VERSION) {
    const defaults = [
      { 
        id: 1, 
        title: "Master en React", 
        desc: "Aprende desde cero.", 
        category: "Programación", 
        price: 49.99, 
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        longDesc: "Sumérgete en el ecosistema de React desde sus fundamentos hasta conceptos avanzados. En este curso aprenderás a configurar tu entorno con Vite, crear componentes reutilizables, manejar el estado con Hooks (useState, useEffect, useContext) y gestionar enrutamiento con React Router. Ideal para quienes quieren dar el salto al desarrollo frontend moderno.",
        images: [
          "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ]
      },
      { 
        id: 2, 
        title: "Diseño UI/UX", 
        desc: "Principios básicos.", 
        category: "Diseño", 
        price: 0, 
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        longDesc: "Comprende la mentalidad del diseño centrado en el usuario. Abordaremos los principios fundamentales de la interfaz de usuario (UI) y la experiencia de usuario (UX), creación de wireframes, tipografía efectiva, teoría del color y cómo usar Figma para prototipar tus primeras aplicaciones de manera profesional.",
        images: [
          "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ]
      },
      { 
        id: 3, 
        title: "Marketing 360", 
        desc: "Estrategias de mercado.", 
        category: "Marketing", 
        price: 29.99, 
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        longDesc: "Domina las estrategias de marketing digital integral. Desde SEO y posicionamiento en buscadores hasta la creación de campañas de pago en Google Ads y Meta Ads. Aprende a analizar métricas clave, fidelizar clientes por email marketing y crear una marca personal sólida que atraiga a tu público objetivo.",
        images: [
          "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ]
      }
    ];
    saveModules(defaults);
    localStorage.setItem('kiby_data_version', DATA_VERSION); // Guardamos la nueva versión
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
    // Convertimos el string de imágenes separadas por coma en un Array
    const images = moduleData.imgList ? moduleData.imgList.split(',').map(url => url.trim()).filter(url => url !== '') : [];
    // 🚀 ARREGLO: Convertimos el precio a Número (Float) para evitar el error .toFixed()
    const price = parseFloat(moduleData.price) || 0;
    
    const finalModuleData = { ...moduleData, img: finalImg, images, price };
    delete finalModuleData.imgList; // Borramos el string temporal
    
    const newModule = { ...finalModuleData, id: Date.now() };
    saveModules([...list, newModule]);
  },
  
  update: (updatedModule) => {
    let list = getModules();
    const images = updatedModule.imgList ? updatedModule.imgList.split(',').map(url => url.trim()).filter(url => url !== '') : updatedModule.images;
    // 🚀 ARREGLO: Convertimos el precio a Número (Float) para evitar el error .toFixed()
    const price = parseFloat(updatedModule.price) || 0;
    
    const finalModuleData = { ...updatedModule, images, price };
    delete finalModuleData.imgList;
    
    list = list.map(m => m.id == finalModuleData.id ? finalModuleData : m);
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
    const newCoupon = { 
      id: Date.now(), 
      code, 
      discount: parseFloat(discount) || 0, // Aseguramos que el descuento sea número
      img: finalImg, 
      active: true, 
      created: Date.now() 
    };
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

  // 🚀 FUNCIÓN PARA APLICAR CUPONES EN EL CHECKOUT
  applyCoupon: (code) => {
    const list = CouponService.getAll();
    // Busca el cupón ignorando mayúsculas/minúsculas y que esté activo
    const coupon = list.find(c => c.code.toLowerCase() === code.toLowerCase() && c.active);
    return coupon || null; // Devuelve el cupón o null si no es válido
  }
};