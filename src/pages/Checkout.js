import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CouponService } from "../services/data";
import Button from "../components/ui/Button";
import toast from 'react-hot-toast';

const Checkout = ({ onPurchase, goBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtenemos los datos del módulo que le pasamos desde ModuleDetail.js
  const moduleData = location.state?.module;

  // Estados para el cupón
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Si alguien entra a /checkout directamente sin pasar por un módulo
  if (!moduleData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 text-[#161616] dark:text-white">No hay módulo seleccionado</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Parece que has accedido directamente a esta página.</p>
        <Button onClick={() => navigate('/')} className="text-[#bf522b] dark:text-white">🛒 Ir a la Tienda</Button>
      </div>
    );
  }

  // Función para validar y aplicar el cupón
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidating(true);
    setCouponError("");
    setAppliedCoupon(null);

    try {
      // Buscamos el cupón en la base de datos
      const coupons = await CouponService.getAll();
      const foundCoupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());

      if (foundCoupon && foundCoupon.active) {
        setAppliedCoupon(foundCoupon);
        toast.success(`¡Cupón aplicado! -${foundCoupon.discount}%`);
      } else {
        setCouponError("Cupón no válido o inactivo");
      }
    } catch (error) {
      setCouponError("Error al validar el cupón");
    } finally {
      setIsValidating(false);
    }
  };

  // Función para quitar el cupón manualmente
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Cálculos de precio
  const isFree = moduleData.price === 0;
  const originalPrice = moduleData.price;
  
  let finalPrice = originalPrice;
  let discountAmount = 0;

  if (appliedCoupon) {
    discountAmount = (originalPrice * appliedCoupon.discount) / 100;
    finalPrice = originalPrice - discountAmount;
    if (finalPrice < 0) finalPrice = 0; // Evitamos precios negativos
  }

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={goBack} className="text-[#bf522b] hover:underline mb-8 inline-flex items-center font-bold dark:text-[#bf522b]">
        ← Volver al módulo
      </button>

      <h1 className="text-3xl font-extrabold text-[#161616] dark:text-white mb-8">Finalizar Compra</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
        
        {/* Cabecera del producto */}
        <div className="flex items-center gap-4 pb-6 border-b dark:border-gray-700">
          <div className="w-20 h-20 bg-[#161616] dark:bg-gray-900 rounded-xl overflow-hidden flex-shrink-0">
            {moduleData.img ? (
              <img src={moduleData.img} alt={moduleData.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-black text-[#bf522b]/30">{moduleData.title.charAt(0)}</div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#161616] dark:text-white">{moduleData.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{moduleData.category}</p>
          </div>
        </div>

        {/* Sección de Cupón de Descuento */}
        {!isFree && (
          <div className="py-6 border-b dark:border-gray-700">
            <label className="block text-sm font-bold text-[#161616] dark:text-gray-200 mb-2">¿Tienes un cupón de descuento?</label>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3 rounded-lg">
                <div>
                  <span className="font-bold text-green-700 dark:text-green-400">{appliedCoupon.code}</span>
                  <span className="text-green-600 dark:text-green-500 text-sm ml-2">(-{appliedCoupon.discount}%)</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700 text-sm font-bold">Quitar</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Introduce tu código"
                  className="flex-grow px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#161616] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#bf522b]"
                />
                <Button type="submit" variant="secondary" disabled={isValidating} className="text-[#bf522b] dark:text-white">
                  {isValidating ? '...' : 'Aplicar'}
                </Button>
              </form>
            )}
            
            {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
          </div>
        )}

        {/* Desglose del precio */}
        <div className="py-6 space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Precio original</span>
            <span>{originalPrice === 0 ? 'Gratis' : `${originalPrice}€`}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
              <span>Descuento ({appliedCoupon.code})</span>
              <span>- {discountAmount.toFixed(2)}€</span>
            </div>
          )}
          
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Impuestos</span>
            <span>Incluidos</span>
          </div>
        </div>

        {/* Total a pagar */}
        <div className="pt-6 border-t dark:border-gray-700 flex justify-between items-center mb-8">
          <span className="text-xl font-bold text-[#161616] dark:text-white">Total a pagar</span>
          <div className="text-right">
            {appliedCoupon && originalPrice > 0 && (
              <span className="line-through text-gray-400 text-sm mr-2">{originalPrice}€</span>
            )}
            <span className="text-3xl font-extrabold text-[#bf522b]">
              {finalPrice === 0 ? 'GRATIS' : `${finalPrice.toFixed(2)}€`}
            </span>
          </div>
        </div>

        {/* Botón de Pago */}
        <Button 
          onClick={() => onPurchase(moduleData)} 
          className="w-full justify-center text-lg py-4 text-white dark:text-white"
        >
          {finalPrice === 0 ? '🚀 Obtener Módulo Gratis' : '💳 Pagar Ahora'}
        </Button>
        
        <p className="text-center text-xs text-gray-400 mt-4">Pago 100% seguro. Simulación de compra.</p>
      </div>
    </div>  
  );
};

export default Checkout;