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
        <Button onClick={goBack}>Volver a la Tienda</Button>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    setCouponError("");
    setAppliedCoupon(null);
    
    // Busca el cupón en la nube (Firestore)
    const coupon = await CouponService.applyCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      setCouponError("Cupón no válido o inactivo.");
    }
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(module.price) || 0;
    if (appliedCoupon) {
      return (price - (price * appliedCoupon.discount / 100)).toFixed(2);
    }
    return price.toFixed(2);
  };

  const handleConfirmPurchase = () => {
    onPurchase(module); // Ejecuta la compra y redirige (App.js maneja esto)
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={goBack} className="text-[#bf522b] hover:underline mb-8 inline-block font-semibold text-sm">
        ← Volver a la Tienda
      </button>

      <h2 className="text-4xl font-extrabold text-[#161616] tracking-tight mb-8">Finalizar Compra</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Columna Izquierda: Detalles y Cupón */}
        <div className="md:col-span-3 space-y-6">
          
          <Card className="p-6 flex items-center gap-5 shine-effect">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#161616] flex-shrink-0 flex items-center justify-center shadow-md">
              <img src={module.img} alt={module.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span className="hidden text-3xl font-bold text-[#bf522b]">{module.title.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-bold text-[#161616] text-lg">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.category}</p>
            </div>
          </Card>

          {/* Sección de Cupón de Descuento */}
          <Card className="p-6 bg-gray-50 border border-dashed border-gray-300">
            <h3 className="font-bold text-[#161616] mb-3 text-lg">🎫 ¿Tienes un cupón?</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                placeholder="Introduce tu código"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf522b] focus:outline-none tracking-widest text-sm font-mono"
              />
              <Button variant="secondary" onClick={handleApplyCoupon}>Aplicar</Button>
            </div>
            
            {couponError && <p className="text-red-500 text-xs mt-2 font-semibold">{couponError}</p>}
            
            {appliedCoupon && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm font-bold flex justify-between items-center shadow-sm">
                <span>🎉 Cupón <span className="font-mono">{appliedCoupon.code}</span> aplicado</span>
                <span>-{appliedCoupon.discount}%</span>
              </div>
            )}
          </Card>

        </div>

        {/* Columna Derecha: Resumen de Pago */}
        <div className="md:col-span-2">
          <Card className="p-6 bg-[#161616] text-white sticky top-24 shadow-2xl">
            <h3 className="font-bold text-lg mb-5 border-b border-gray-700 pb-2">Resumen del Pedido</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{parseFloat(module.price).toFixed(2)}€</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Descuento ({appliedCoupon.code})</span>
                  <span>-{(module.price * appliedCoupon.discount / 100).toFixed(2)}€</span>
                </div>
              )}
              
              <div className="flex justify-between font-extrabold text-2xl mt-5 pt-5 border-t border-gray-700">
                <span>Total</span>
                <span className="text-[#bf522b]">{calculateFinalPrice()}€</span>
              </div>
            </div>

            <Button className="w-full mt-6 justify-center text-base py-3" onClick={handleConfirmPurchase}>
              ⚡ Confirmar y Pagar
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Checkout;