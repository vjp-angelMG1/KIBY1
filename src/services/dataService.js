import { db } from "./authService";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, getDoc, query, where 
} from "firebase/firestore";

// --- MÓDULOS ---
export const ModuleService = {
  /**
   * Obtiene todos los módulos.
   */
  getAll: async () => {
    const collectionRef = collection(db, "modules");
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  },
  
  /**
   * Obtiene un módulo por su ID.
   */
  getById: async (moduleId) => {
    const docRef = doc(db, "modules", moduleId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  /**
   * Crea un nuevo módulo.
   */
  create: async (moduleData) => {
    const defaultImageUrl = "https://placehold.co/600x400/161616/bf522b?text=Kiby+Course";
    const finalImageUrl = moduleData.img || defaultImageUrl;
    
    const galleryUrls = moduleData.imgList 
      ? moduleData.imgList.split(',').map(urlString => urlString.trim()).filter(validUrl => validUrl !== '') 
      : [];
    
    const featureList = moduleData.features 
      ? moduleData.features.split(',').map(featureString => featureString.trim()).filter(validFeature => validFeature !== '') 
      : [];
    
    const finalPrice = parseFloat(moduleData.price) || 0;
    
    const dataToSave = { 
      ...moduleData, 
      img: finalImageUrl, 
      images: galleryUrls, 
      features: featureList, 
      price: finalPrice 
    };
    
    delete dataToSave.imgList; // Limpiamos campo temporal
    await addDoc(collection(db, "modules"), dataToSave);
  },
  
  /**
   * Actualiza un módulo existente.
   */
  update: async (updatedData) => {
    const { id, ...dataWithoutId } = updatedData;
    
    const galleryUrls = dataWithoutId.imgList 
      ? dataWithoutId.imgList.split(',').map(urlString => urlString.trim()).filter(validUrl => validUrl !== '') 
      : dataWithoutId.images;
    
    const featureList = dataWithoutId.features && typeof dataWithoutId.features === 'string' 
      ? dataWithoutId.features.split(',').map(featureString => featureString.trim()).filter(validFeature => validFeature !== '') 
      : dataWithoutId.features;
    
    const finalPrice = parseFloat(dataWithoutId.price) || 0;
    
    const finalData = { ...dataWithoutId, images: galleryUrls, features: featureList, price: finalPrice };
    delete finalData.imgList;
    
    const docRef = doc(db, "modules", id);
    await updateDoc(docRef, finalData);
  },
  
  /**
   * Elimina un módulo.
   */
  delete: async (moduleId) => {
    await deleteDoc(doc(db, "modules", moduleId));
  },
  
  // --- COMPRAS ---
  addPurchase: async (userId, moduleId) => {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const currentPurchases = userDocSnap.data()?.purchases || [];
    
    if (!currentPurchases.includes(moduleId)) {
      await updateDoc(userDocRef, { purchases: [...currentPurchases, moduleId] });
    }
  },
  
  getMyModules: async (userId) => {
    const userDocSnap = await getDoc(doc(db, "users", userId));
    const purchasedIds = userDocSnap.data()?.purchases || [];
    
    if (purchasedIds.length === 0) return [];
    const allAvailableModules = await ModuleService.getAll();
    return allAvailableModules.filter(moduleItem => purchasedIds.includes(moduleItem.id));
  },

  getBuyersForModule: async (moduleId) => {
    const purchaseQuery = query(collection(db, "users"), where("purchases", "array-contains", moduleId));
    const querySnapshot = await getDocs(purchaseQuery);
    return querySnapshot.docs.map(userDoc => userDoc.data().email);
  }
};

// --- CUPONES ---
export const CouponService = {
  getAll: async () => {
    const collectionRef = collection(db, "coupons");
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  },
  
  create: async (couponCode, discountPercentage, imageUrl) => {
    const finalImageUrl = imageUrl || `https://placehold.co/600x400/161616/bf522b?text=${couponCode}`;
    const newCouponData = { 
      code: couponCode, 
      discount: parseFloat(discountPercentage) || 0, 
      img: finalImageUrl, 
      active: true, 
      created: new Date() 
    };
    await addDoc(collection(db, "coupons"), newCouponData);
  },
  
  delete: async (couponId) => {
    await deleteDoc(doc(db, "coupons", couponId));
  },
  
  toggleStatus: async (couponId) => {
    const docRef = doc(db, "coupons", couponId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentStatus = docSnap.data().active;
      await updateDoc(docRef, { active: !currentStatus });
    }
  },
  
  applyCoupon: async (inputCode) => {
    const validationQuery = query(
      collection(db, "coupons"), 
      where("code", "==", inputCode), 
      where("active", "==", true)
    );
    const querySnapshot = await getDocs(validationQuery);
    
    if (!querySnapshot.empty) {
      const validCouponDoc = querySnapshot.docs[0];
      return { id: validCouponDoc.id, ...validCouponDoc.data() };
    }
    return null;
  }
};