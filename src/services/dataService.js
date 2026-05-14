import { db } from "./authService";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, getDoc, query, where 
} from "firebase/firestore";

// --- MÓDULOS ---
export const ModuleService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "modules"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  
  getById: async (id) => {
    const docRef = doc(db, "modules", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  create: async (moduleData) => {
    const finalImg = moduleData.img || "https://placehold.co/600x400/161616/bf522b?text=Kiby+Course";
    const images = moduleData.imgList ? moduleData.imgList.split(',').map(url => url.trim()).filter(url => url !== '') : [];
    const price = parseFloat(moduleData.price) || 0;
    const finalModuleData = { ...moduleData, img: finalImg, images, price };
    delete finalModuleData.imgList;
    
    await addDoc(collection(db, "modules"), finalModuleData);
  },
  
  update: async (updatedModule) => {
    const { id, ...data } = updatedModule;
    const images = data.imgList ? data.imgList.split(',').map(url => url.trim()).filter(url => url !== '') : data.images;
    const price = parseFloat(data.price) || 0;
    const finalData = { ...data, images, price };
    delete finalData.imgList;
    
    const docRef = doc(db, "modules", id);
    await updateDoc(docRef, finalData);
  },
  
  delete: async (id) => {
    await deleteDoc(doc(db, "modules", id));
  },
  
  // --- COMPRAS ---
  addPurchase: async (userId, moduleId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentPurchases = userSnap.data()?.purchases || [];
    
    if (!currentPurchases.includes(moduleId)) {
      await updateDoc(userRef, { purchases: [...currentPurchases, moduleId] });
    }
  },
  
  getMyModules: async (userId) => {
    const userSnap = await getDoc(doc(db, "users", userId));
    const myIds = userSnap.data()?.purchases || [];
    
    if (myIds.length === 0) return [];
    const allModules = await ModuleService.getAll();
    return allModules.filter(m => myIds.includes(m.id));
  },

  // 🚀 NUEVA FUNCIÓN: Obtener los compradores de un módulo específico
  getBuyersForModule: async (moduleId) => {
    const q = query(collection(db, "users"), where("purchases", "array-contains", moduleId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data().email);
  }
};

// --- CUPONES ---
export const CouponService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "coupons"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  
  create: async (code, discount, img) => {
    const finalImg = img || `https://placehold.co/600x400/161616/bf522b?text=${code}`;
    const newCoupon = { code, discount: parseFloat(discount) || 0, img: finalImg, active: true, created: new Date() };
    await addDoc(collection(db, "coupons"), newCoupon);
  },
  
  delete: async (id) => {
    await deleteDoc(doc(db, "coupons", id));
  },
  
  toggleStatus: async (id) => {
    const docRef = doc(db, "coupons", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { active: !docSnap.data().active });
    }
  },
  
  applyCoupon: async (code) => {
    const q = query(collection(db, "coupons"), where("code", "==", code), where("active", "==", true));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  }
};