import { db } from "../authService";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, getDoc, query, where 
} from "firebase/firestore";

/**
 * Servicio para gestionar las operaciones CRUD de los cupones de descuento en Firestore.
 */
const CouponService = {
  /**
   * Obtiene todos los cupones de la base de datos.
   * @returns {Promise<Array<import('../../models/Coupon').Coupon>>} Un array de objetos de cupones.
   */
  getAll: async () => {
    const collectionRef = collection(db, "coupons");
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  },
  
  /**
   * Crea un nuevo cupón en la base de datos.
   * @param {string} couponCode - El código del cupón.
   * @param {number} discountPercentage - El porcentaje de descuento.
   * @param {string} [imageUrl] - La URL de la imagen (opcional, genera una por defecto).
   * @returns {Promise<void>}
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
   * Elimina un cupón de la base de datos.
   * @param {string} couponId - El ID del cupón a eliminar.
   * @returns {Promise<void>}
   */
  delete: async (couponId) => {
    await deleteDoc(doc(db, "coupons", couponId));
  },
  
  /**
   * Alterna el estado activo/inactivo de un cupón existente.
   * @param {string} couponId - El ID del cupón a modificar.
   * @returns {Promise<void>}
   */
  toggleStatus: async (couponId) => {
    const docRef = doc(db, "coupons", couponId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentStatus = docSnap.data().active;
      await updateDoc(docRef, { active: !currentStatus });
    }
  },
  
  /**
   * Valida si un código de cupón introducido es válido y está activo.
   * Realiza una consulta a Firestore buscando coincidencia exacta de código y estado activo.
   * @param {string} inputCode - El código introducido por el usuario.
   * @returns {Promise<import('../../models/Coupon').Coupon | null>} El objeto del cupón si es válido, o null si no.
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

export default CouponService;