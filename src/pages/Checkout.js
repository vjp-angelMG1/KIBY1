import React, { useState } from "react";
import { CouponService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Checkout = ({ module, onPurchase, goBack }) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  if (!module) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No has seleccionado ningún módulo para comprar.</p>
        <Button onClick={goBack}>Volver al Catálogo</Button>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const coupon = CouponService.applyCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("Cupón no válido, inactivo o no existe.");
    }
  };

  const calculateFinalPrice = () => {
    if (appliedCoupon) {
      return (module.price - (module.price * appliedCoupon.discount / 100)).toFixed(2);
    }
    return module.price.toFixed(2);
  };

  const handleConfirmPurchase = () => {
    alert(`✅ Pago de ${calculateFinalPrice()}€ procesado con éxito.`);
    onPurchase(module); // Registra la compra en el sistema
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={goBack} className="text-[#bf522b] hover:underline mb-6 inline-block font-semibold">
        ← Volver al Catálogo
      </button>

      <h1 className="text-3xl font-bold text-[#161616] mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Columna Izquierda: Detalles y Cupón */}
        <div className="md:col-span-3 space-y-6">
          
          <Card className="p-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#161616] flex-shrink-0 flex items-center justify-center">
              <img src={module.img} alt={module.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span className="hidden text-2xl font-bold text-[#bf522b]">{module.title.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-bold text-[#161616] text-lg">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.category}</p>
              <p className="text-[#bf522b] font-bold mt-1">Precio base: {module.price.toFixed(2)}€</p>
            </div>
          </Card>

          {/* Sección de Cupón de Descuento */}
          <Card className="p-6 bg-gray-50 border border-dashed border-gray-300">
            <h3 className="font-bold text-[#161616] mb-3">🎫 ¿Tienes un cupón de descuento?</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                placeholder="Introduce tu código aquí"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none tracking-widest text-sm"
              />
              <Button variant="secondary" onClick={handleApplyCoupon}>Aplicar</Button>
            </div>
            
            {couponError && <p className="text-red-500 text-xs mt-2 font-semibold">{couponError}</p>}
            
            {appliedCoupon && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm font-semibold flex justify-between items-center">
                <span>🎉 Cupón <span className="font-mono">{appliedCoupon.code}</span> aplicado</span>
                <span>-{appliedCoupon.discount}%</span>
              </div>
            )}
          </Card>

        </div>

        {/* Columna Derecha: Resumen de Pago */}
        <div className="md:col-span-2">
          <Card className="p-6 bg-[#161616] text-white sticky top-24">
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Resumen del Pedido</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{module.price.toFixed(2)}€</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-400">
                  <span>Descuento ({appliedCoupon.code})</span>
                  <span>-{(module.price * appliedCoupon.discount / 100).toFixed(2)}€</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-gray-700">
                <span>Total</span>
                <span className="text-[#bf522b]">{calculateFinalPrice()}€</span>
              </div>
            </div>

            <Button className="w-full mt-6" onClick={handleConfirmPurchase}>
              Confirmar y Pagar
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Checkout;