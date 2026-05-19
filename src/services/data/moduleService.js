import { db } from "../authService";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, getDoc, query, where 
} from "firebase/firestore";

/**
 * Servicio para gestionar las operaciones CRUD de los módulos (cursos) y las compras en Firestore.
 */
const ModuleService = {
  /**
   * Obtiene todos los módulos de la base de datos.
   * @returns {Promise<Array<import('../../models/Module').Module>>} Un array de objetos con los datos de los módulos.
   */
  getAll: async () => {
    const collectionRef = collection(db, "modules");
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  },
  
  /**
   * Obtiene un módulo específico por su ID.
   * @param {string} moduleId - El ID del módulo a buscar.
   * @returns {Promise<import('../../models/Module').Module | null>} El objeto del módulo o null si no existe.
   */
  getById: async (moduleId) => {
    const docRef = doc(db, "modules", moduleId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  /**
   * Crea un nuevo módulo en la base de datos.
   * Procesa los campos de formulario (imgList, features) para adaptarlos a la estructura de la BD.
   * @param {Object} moduleData - Los datos del formulario de creación del módulo.
   * @returns {Promise<void>}
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
   * Actualiza un módulo existente en la base de datos.
   * @param {Object} updatedData - Los datos actualizados (debe contener la propiedad 'id').
   * @returns {Promise<void>}
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
   * Elimina un módulo de la base de datos por su ID.
   * @param {string} moduleId - El ID del módulo a eliminar.
   * @returns {Promise<void>}
   */
  delete: async (moduleId) => {
    await deleteDoc(doc(db, "modules", moduleId));
  },
  
  /**
   * Añade un ID de módulo al array de compras de un usuario si no lo tenía ya.
   * @param {string} userId - El ID del usuario que realiza la compra.
   * @param {string} moduleId - El ID del módulo comprado.
   * @returns {Promise<void>}
   */
  addPurchase: async (userId, moduleId) => {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const currentPurchases = userDocSnap.data()?.purchases || [];
    
    if (!currentPurchases.includes(moduleId)) {
      await updateDoc(userDocRef, { purchases: [...currentPurchases, moduleId] });
    }
  },
  
  /**
   * Obtiene los datos completos de los módulos que un usuario ha comprado.
   * @param {string} userId - El ID del usuario.
   * @returns {Promise<Array<import('../../models/Module').Module>>} Array de módulos comprados.
   */
  getMyModules: async (userId) => {
    const userDocSnap = await getDoc(doc(db, "users", userId));
    const purchasedIds = userDocSnap.data()?.purchases || [];
    
    if (purchasedIds.length === 0) return [];
    const allAvailableModules = await ModuleService.getAll();
    return allAvailableModules.filter(moduleItem => purchasedIds.includes(moduleItem.id));
  },

  /**
   * Obtiene los emails de los usuarios que han comprado un módulo específico.
   * @param {string} moduleId - El ID del módulo a consultar.
   * @returns {Promise<Array<string>>} Array de correos electrónicos.
   */
  getBuyersForModule: async (moduleId) => {
    const purchaseQuery = query(collection(db, "users"), where("purchases", "array-contains", moduleId));
    const querySnapshot = await getDocs(purchaseQuery);
    return querySnapshot.docs.map(userDoc => userDoc.data().email);
  }
};

export default ModuleService;