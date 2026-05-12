import React, { useState, useEffect } from "react";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CouponManager = ({ isAdmin }) => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => { setCoupons(CouponService.getAll()); }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    CouponService.create(code, discount, img);
    setCoupons(CouponService.getAll());
    setCode(""); setDiscount(""); setImg("");
  };

  const handleAutoFillImage = () => {
    const text = code || "CUPON";
    setImg(`https://placehold.co/600x400/161616/bf522b?text=${text}`);
  };

  const handleDelete = (id) => {
    if(window.confirm("¿Eliminar este cupón?")) { CouponService.delete(id); setCoupons(CouponService.getAll()); }
  };

  const handleToggleStatus = (id) => {
    CouponService.toggleStatus(id); setCoupons(CouponService.getAll());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-[#161616]">
          {isAdmin ? 'Gestión de Cupones (Admin)' : '🎁 Cupones Disponibles'}
        </h1>
        
        {isAdmin && (
          <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow border flex flex-wrap gap-3 items-end">
             <Input label="Código" name="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="VERANO20" />
             <Input label="Descuento (%)" type="number" name="discount" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="10" className="w-24"/>
             <div className="flex flex-col">
               <label className="block text-sm font-semibold mb-1 text-[#161616]">Imagen</label>
               <div className="flex gap-2">
                 <input type="url" value={img} onChange={e => setImg(e.target.value)} placeholder="Autogenerar" className="p-2 border border-gray-300 rounded-md text-sm w-28 focus:outline-none focus:ring-1 focus:ring-[#bf522b]" />
                 <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 transition">🌐</button>
               </div>
             </div>
             <Button type="submit">Crear Cupón</Button>
          </form>
        )}
      </div>

      {!isAdmin && (
        <p className="text-gray-500 mb-6">Utiliza estos códigos en el proceso de compra para obtener descuentos.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <Card key={c.id} className={`relative overflow-hidden transition-colors duration-300 ${!c.active ? 'opacity-40 grayscale' : ''}`}>
            
            {isAdmin && (
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg ${c.active ? 'bg-green-500' : 'bg-[#161616]'}`}>
                {c.active ? 'ACTIVO' : 'INACTIVO'}
              </div>
            )}

            <div className="w-full h-32 bg-[#161616] flex items-center justify-center">
              <img src={c.img} className="w-full h-full object-cover" alt="Coupon" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <div className="hidden w-full h-full items-center justify-center">
                <span className="text-4xl font-bold text-[#bf522b]">{c.code.charAt(0)}</span>
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="font-mono font-bold text-[#bf522b] text-lg tracking-wider bg-gray-100 py-1 px-2 rounded border border-dashed border-gray-300 inline-block mb-2">{c.code}</div>
              <div className="text-3xl font-black text-[#161616]">-{c.discount}%</div>
              
              {!isAdmin && c.active && (
                <p className="text-xs text-green-600 font-semibold mt-3 bg-green-50 py-1 rounded">Cópialo y úsalo al comprar</p>
              )}
              {!isAdmin && !c.active && (
                <p className="text-xs text-red-400 font-semibold mt-3">Cupón expirado</p>
              )}

              {isAdmin && (
                <div className="mt-4 flex gap-2 justify-center border-t pt-3">
                  <button onClick={() => handleToggleStatus(c.id)} className="px-3 py-1 text-xs border rounded hover:bg-gray-50 transition">{c.active ? 'Desactivar' : 'Activar'}</button>
                  <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition">🗑 Eliminar</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CouponManager;