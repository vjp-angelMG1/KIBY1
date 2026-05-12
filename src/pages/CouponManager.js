import React, { useState, useEffect } from "react";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CouponManager = () => {
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

  // Generar foto web automáticamente basada en el código
  const handleAutoFillImage = () => {
    const text = code || "CUPON";
    const finalImg = `https://placehold.co/600x400/161616/bf522b?text=${text}`;
    setImg(finalImg);
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
        <h1 className="text-2xl font-bold text-[#161616]">Mis Cupones</h1>
        
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow border flex flex-wrap gap-3 items-end">
           <Input label="Código" name="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="VERANO20" />
           <Input label="%" type="number" name="discount" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="10" className="w-20"/>
           
           <div className="flex flex-col">
             <label className="block text-sm font-semibold mb-1 text-[#161616]">Imagen</label>
             <div className="flex gap-2">
               <input type="url" value={img} onChange={e => setImg(e.target.value)} placeholder="URL o autogenerar" className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" />
               <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 transition">🌐</button>
             </div>
           </div>

           <Button type="submit">Crear</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <Card key={c.id} className={`relative overflow-hidden transition-colors duration-300 ${!c.active ? 'opacity-50 grayscale' : ''}`}>
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white ${c.active ? 'bg-green-500' : 'bg-[#161616]'}`}>
              {c.active ? 'ACTIVO' : 'INACTIVO'}
            </div>
            <div className="absolute top-0 left-0 px-2 py-1 text-[10px] bg-[#bf522b]/10 text-[#bf522b] font-bold">
              CADUCA PRONTO
            </div>
            
            <div className="w-full h-32 bg-[#161616] flex items-center justify-center">
              <img src={c.img} className="w-full h-full object-cover" alt="Coupon" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <div className="hidden w-full h-full items-center justify-center">
                <span className="text-4xl font-bold text-[#bf522b]">{c.code.charAt(0)}</span>
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="font-mono font-bold text-[#bf522b] text-lg">{c.code}</div>
              <div className="text-3xl font-black text-[#161616]">-{c.discount}%</div>
              <div className="mt-4 flex gap-2 justify-center">
                <button onClick={() => handleToggleStatus(c.id)} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">{c.active ? 'ON' : 'OFF'}</button>
                <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">🗑</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CouponManager;