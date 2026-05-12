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

  useEffect(() => {
    setCoupons(CouponService.getAll());
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    const finalImg = img || `https://picsum.photos/seed/${code}/300/200`;
    CouponService.create(code, discount, finalImg);
    setCoupons(CouponService.getAll());
    setCode(""); setDiscount(""); setImg("");
  };

  const handleDelete = (id) => {
    if(window.confirm("¿Eliminar este cupón?")) {
      CouponService.delete(id);
      setCoupons(CouponService.getAll());
    }
  };

  const handleToggleStatus = (id) => {
    CouponService.toggleStatus(id);
    setCoupons(CouponService.getAll());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Cupones</h1>
        {/* Formulario de creación (Podría ser un modal, pero lo dejamos inline) */}
        <div className="bg-white p-4 rounded shadow border flex gap-2 items-end">
           <Input label="Código" name="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="VERANO20" />
           <Input label="%" type="number" name="discount" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="10" className="w-20"/>
           <Button onClick={handleCreate}>Crear</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <Card key={c.id} className={`relative overflow-hidden transition-colors duration-300 ${!c.active ? 'opacity-50 grayscale' : ''}`}>
            {/* Estado en la tarjeta */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white ${c.active ? 'bg-green-500' : 'bg-gray-500'}`}>
              {c.active ? 'ACTIVO' : 'INACTIVO'}
            </div>

            {/* Etiqueta simulada de caducidad */}
            <div className="absolute top-0 left-0 px-2 py-1 text-[10px] bg-orange-100 text-orange-700 font-bold">
              CADUCA PRONTO
            </div>

            <img src={c.img} className="w-full h-32 object-cover" />
            <div className="p-4 text-center">
              <div className="font-mono font-bold text-indigo-600 text-lg">{c.code}</div>
              <div className="text-3xl font-black text-gray-800">-{c.discount}%</div>
              
              {/* Botones de gestión */}
              <div className="mt-4 flex gap-2 justify-center">
                <button 
                  onClick={() => handleToggleStatus(c.id)}
                  className="px-3 py-1 text-xs border rounded hover:bg-gray-50"
                  title={c.active ? 'Desactivar' : 'Activar'}
                >
                  {c.active ? 'ON' : 'OFF'}
                </button>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                  title="Eliminar"
                >
                  🗑
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CouponManager;