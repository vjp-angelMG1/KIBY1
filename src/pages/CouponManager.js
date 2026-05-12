import React, { useState, useEffect } from "react";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CouponManager = ({ isAdmin }) => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado del formulario
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = () => {
    setCoupons(CouponService.getAll());
  };

  const handleOpenModal = () => {
    setCode("");
    setDiscount("");
    setImg("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    CouponService.create(code, discount, img);
    loadCoupons();
    handleCloseModal();
  };

  const handleAutoFillImage = () => {
    const text = code || "CUPON";
    setImg(`https://placehold.co/600x400/161616/bf522b?text=${text}`);
  };

  const handleDelete = (id) => {
    if(window.confirm("¿Eliminar este cupón?")) { 
      CouponService.delete(id); 
      loadCoupons(); 
    }
  };

  const handleToggleStatus = (id) => {
    CouponService.toggleStatus(id); 
    loadCoupons(); 
  };

  // Filtrar solo los activos para los usuarios normales
  const displayedCoupons = isAdmin ? coupons : coupons.filter(c => c.active);

  return (
    <div>
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#161616]">
            {isAdmin ? 'Gestión de Cupones' : '🎁 Cupones Disponibles'}
          </h1>
          {!isAdmin && (
            <p className="text-gray-500 mt-1">Utiliza estos códigos al comprar un módulo para obtener descuentos.</p>
          )}
        </div>
        
        {/* Botón de crear solo para Admin */}
        {isAdmin && (
          <Button onClick={handleOpenModal}>+ Crear Cupón</Button>
        )}
      </div>

      {/* Grid de Cupones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCoupons.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            No hay cupones disponibles actualmente.
          </div>
        ) : (
          displayedCoupons.map((c) => (
            <Card key={c.id} className={`relative overflow-hidden transition-colors duration-300 ${!c.active ? 'opacity-50 grayscale' : ''}`}>
              
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
                <div className="font-mono font-bold text-[#bf522b] text-lg tracking-wider bg-gray-100 py-1 px-2 rounded border border-dashed border-gray-300 inline-block mb-2">
                  {c.code}
                </div>
                <div className="text-3xl font-black text-[#161616]">-{c.discount}%</div>
                
                {!isAdmin && c.active && (
                  <p className="text-xs text-green-600 font-semibold mt-3 bg-green-50 py-1 rounded">Cópialo y úsalo al comprar</p>
                )}

                {isAdmin && (
                  <div className="mt-4 flex gap-2 justify-center border-t pt-3">
                    <button onClick={() => handleToggleStatus(c.id)} className="px-3 py-1 text-xs border rounded hover:bg-gray-50 transition">
                      {c.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition">
                      🗑 Eliminar
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* MODAL DE CREAR CUPÓN (Solo visible para Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white relative p-6">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            
            <h3 className="text-xl font-bold text-[#161616] mb-6">Crear Nuevo Cupón</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Código del Cupón" 
                  name="code" 
                  value={code} 
                  onChange={e=>setCode(e.target.value.toUpperCase())} 
                  placeholder="VERANO20" 
                  required 
                  className="col-span-2"
                />
                <Input 
                  label="Descuento (%)" 
                  type="number" 
                  name="discount" 
                  value={discount} 
                  onChange={e=>setDiscount(e.target.value)} 
                  placeholder="10" 
                  required 
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#161616]">Imagen del Cupón (Opcional)</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    value={img} 
                    onChange={e => setImg(e.target.value)} 
                    placeholder="URL o autogenerar" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" 
                  />
                  <button 
                    type="button" 
                    onClick={handleAutoFillImage} 
                    className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 transition whitespace-nowrap"
                  >
                    🌐 Auto
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Si lo dejas vacío, se generará una imagen corporativa automáticamente.</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Crear Cupón</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CouponManager;