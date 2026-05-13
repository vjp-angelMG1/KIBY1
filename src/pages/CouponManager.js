import React, { useState, useEffect } from "react";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CouponManager = ({ isAdmin }) => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    const data = await CouponService.getAll();
    setCoupons(data);
  };

  const handleOpenModal = () => { setCode(""); setDiscount(""); setImg(""); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); };

  const handleCreate = async (e) => {
    e.preventDefault();
    await CouponService.create(code, discount, img);
    loadCoupons();
    handleCloseModal();
  };

  // Función mágica para generar imagen de cupón automática
  const handleAutoFillImage = () => {
    const text = code || "CUPON";
    setImg(`https://placehold.co/600x400/161616/bf522b?text=${text}`);
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Eliminar?")) { await CouponService.delete(id); loadCoupons(); }
  };

  const handleToggleStatus = async (id) => {
    await CouponService.toggleStatus(id);
    loadCoupons();
  };

  const displayedCoupons = isAdmin ? coupons : coupons.filter(c => c.active);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#161616]">{isAdmin ? 'Gestión de Cupones' : '🎁 Cupones'}</h1>
        {isAdmin && <Button onClick={handleOpenModal}>+ Crear Cupón</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedCoupons.map((c) => (
          <Card key={c.id} className={`relative overflow-hidden transition-colors duration-300 ${!c.active ? 'opacity-50 grayscale' : ''}`}>
            {isAdmin && <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg z-10 ${c.active ? 'bg-green-500' : 'bg-[#161616]'}`}>{c.active ? 'ACTIVO' : 'INACTIVO'}</div>}
            
            {/* IMAGEN DEL CUPÓN */}
            <div className="w-full h-32 bg-[#161616] flex items-center justify-center">
              <img src={c.img} className="w-full h-full object-cover" alt="Coupon" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <div className="hidden w-full h-full items-center justify-center">
                <span className="text-4xl font-bold text-[#bf522b]">{c.code.charAt(0)}</span>
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="font-mono font-bold text-[#bf522b] text-lg tracking-wider bg-gray-100 py-1 px-2 rounded border border-dashed border-gray-300 inline-block mb-2">{c.code}</div>
              <div className="text-3xl font-black text-[#161616]">-{c.discount}%</div>
              {!isAdmin && c.active && <p className="text-xs text-green-600 font-semibold mt-3">Úsalo al comprar</p>}
              {isAdmin && (
                <div className="mt-4 flex gap-2 justify-center border-t pt-3">
                  <button onClick={() => handleToggleStatus(c.id)} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">{c.active ? 'Desactivar' : 'Activar'}</button>
                  <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">🗑</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white relative p-6">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-6">Crear Nuevo Cupón</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Código" name="code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="VERANO20" required />
              <Input label="Descuento (%)" type="number" name="discount" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="10" required />
              
              {/* CAMPO DE IMAGEN CON BOTÓN MÁGICO */}
              <div>
                <label className="block text-sm font-semibold mb-1">Imagen del Cupón</label>
                <div className="flex gap-2">
                  <input type="url" value={img} onChange={e => setImg(e.target.value)} placeholder="Se autogenera abajo" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" />
                  <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 whitespace-nowrap">🌐 Auto</button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Pulsa "Auto" para generar una con tus colores corporativos.</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Crear Cupón ☁️</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CouponManager;