import { db } from "./authService";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, getDoc, query, where 
} from "firebase/firestore";

// --- MÓDULOS ---
export const ModuleService = {
  /**
   * Obtiene todos los módulos de la base de datos.
   * @returns {Promise<Array>} Array de objetos de módulos.
   */
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, "modules"));
    return querySnapshot.docs.map(documentSnapshot => ({ id: documentSnapshot.id, ...documentSnapshot.data() }));
  },
  
  /**
   * Obtiene un módulo específico por su ID.
   * @param {string} moduleId - ID del módulo a buscar.
   * @returns {Promise<Object|null>} Objeto del módulo o null si no existe.
   */
  getById: async (moduleId) => {
    const documentReference = doc(db, "modules", moduleId);
    const documentSnapshot = await getDoc(documentReference);
    return documentSnapshot.exists() ? { id: documentSnapshot.id, ...documentSnapshot.data() } : null;
  },
  
  /**
   * Crea un nuevo módulo en la base de datos.
   * @param {Object} moduleInputData - Datos del formulario del módulo.
   */
  create: async (moduleInputData) => {
    const defaultImageUrl = "https://placehold.co/600x400/161616/bf522b?text=Kiby+Course";
    const finalImageUrl = moduleInputData.img || defaultImageUrl;
    
    const imageUrlsArray = moduleInputData.imgList 
      ? moduleInputData.imgList.split(',').map(url => url.trim()).filter(url => url !== '') 
      : [];
    
    const featuresArray = moduleInputData.features 
      ? moduleInputData.features.split(',').map(feature => feature.trim()).filter(feature => feature !== '') 
      : [];
    
    const finalPrice = parseFloat(moduleInputData.price) || 0;
    
    const moduleDataToSave = { 
      ...moduleInputData, 
      img: finalImageUrl, 
      images: imageUrlsArray, 
      features: featuresArray, 
      price: finalPrice 
    };
    
    // Eliminamos campos temporales que no deben guardarse en Firestore
    delete moduleDataToSave.imgList;
    
    await addDoc(collection(db, "modules"), moduleDataToSave);
  },
  
  /**
   * Actualiza un módulo existente.
   * @param {Object} updatedModuleData - Datos actualizados del módulo (incluye id).
   */
  update: async (updatedModuleData) => {
    const { id, ...dataWithoutId } = updatedModuleData;
    
    const imageUrlsArray = dataWithoutId.imgList 
      ? dataWithoutId.imgList.split(',').map(url => url.trim()).filter(url => url !== '') 
      : dataWithoutId.images;
    
    const featuresArray = dataWithoutId.features && typeof dataWithoutId.features === 'string' 
      ? dataWithoutId.features.split(',').map(feature => feature.trim()).filter(feature => feature !== '') 
      : dataWithoutId.features;
    
    const finalPrice = parseFloat(dataWithoutId.price) || 0;
    
    const finalDataToSave = { ...dataWithoutId, images: imageUrlsArray, features: featuresArray, price: finalPrice };
    delete finalDataToSave.imgList;
    
    const documentReference = doc(db, "modules", id);
    await updateDoc(documentReference, finalDataToSave);
  },
  
  /**
   * Elimina un módulo por su ID.
   * @param {string} moduleId - ID del módulo a eliminar.
   */
  delete: async (moduleId) => {
    await deleteDoc(doc(db, "modules", moduleId));
  },
  
  // --- COMPRAS ---
  /**
   * Registra la compra de un módulo para un usuario.
   * @param {string} userId - ID del usuario que compra.
   * @param {string} moduleId - ID del módulo comprado.
   */
  addPurchase: async (userId, moduleId) => {
    const userDocumentRef = doc(db, "users", userId);
    const userDocumentSnap = await getDoc(userDocumentRef);
    const currentPurchases = userDocumentSnap.data()?.purchases || [];
    
    if (!currentPurchases.includes(moduleId)) {
      await updateDoc(userDocumentRef, { purchases: [...currentPurchases, moduleId] });
    }
  },
  
  /**
   * Obtiene los módulos que ha comprado un usuario.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<Array>} Array de módulos comprados.
   */
  getMyModules: async (userId) => {
    const userDocumentSnap = await getDoc(doc(db, "users", userId));
    const purchasedModuleIds = userDocumentSnap.data()?.purchases || [];
    
    if (purchasedModuleIds.length === 0) return [];
    
    const allAvailableModules = await ModuleService.getAll();
    return allAvailableModules.filter(module => purchasedModuleIds.includes(module.id));
  },

  /**
   * Obtiene los correos de los usuarios que han comprado un módulo específico.
   * @param {string} moduleId - ID del módulo a consultar.
   * @returns {Promise<Array>} Array de strings (emails).
   */
  getBuyersForModule: async (moduleId) => {
    const purchaseQuery = query(collection(db, "users"), where("purchases", "array-contains", moduleId));
    const querySnapshot = await getDocs(purchaseQuery);
    return querySnapshot.docs.map(userDoc => userDoc.data().email);
  }
};

// --- CUPONES ---
export const CouponService = {
  /**
   * Obtiene todos los cupones existentes.
   * @returns {Promise<Array>} Array de objetos de cupones.
   */
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, "coupons"));
    return querySnapshot.docs.map(documentSnapshot => ({ id: documentSnapshot.id, ...documentSnapshot.data() }));
  },
  
  /**
   * Crea un nuevo cupón de descuento.
   * @param {string} couponCode - Código del cupón (ej: VERANO20).
   * @param {number} discountPercentage - Porcentaje de descuento.
   * @param {string} [imageUrl] - URL de la imagen del cupón (opcional).
   */
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
  
  /**
   * Elimina un cupón por su ID.
   * @param {string} couponId - ID del cupón a eliminar.
   */
  delete: async (couponId) => {
    await deleteDoc(doc(db, "coupons", couponId));
  },
  
  /**
   * Cambia el estado activo/inactivo de un cupón.
   * @param {string} couponId - ID del cupón a modificar.
   */
  toggleStatus: async (couponId) => {
    const couponDocRef = doc(db, "coupons", couponId);
    const couponDocSnap = await getDoc(couponDocRef);
    if (couponDocSnap.exists()) {
      const currentStatus = couponDocSnap.data().active;
      await updateDoc(couponDocRef, { active: !currentStatus });
    }
  },
  
  /**
   * Valida si un cupón es válido y está activo.
   * @param {string} inputCode - Código introducido por el usuario.
   * @returns {Promise<Object|null>} Objeto del cupón si es válido, null si no.
   */
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