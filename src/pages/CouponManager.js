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

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    const data = await CouponService.getAll();
    setCoupons(data);
  };

  const handleOpenModal = () => { setCode(""); setDiscount(""); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); };

  const handleCreate = async (e) => {
    e.preventDefault();
    const finalImg = `https://placehold.co/600x400/161616/bf522b?text=${code}`;
    await CouponService.create(code, discount, finalImg);
    loadCoupons();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Eliminar este cupón?")) { await CouponService.delete(id); loadCoupons(); }
  };

  const handleToggleStatus = async (id) => {
    await CouponService.toggleStatus(id);
    loadCoupons();
  };

  const displayedCoupons = isAdmin ? coupons : coupons.filter(c => c.active);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-[#161616] dark:text-white tracking-tight">
            {isAdmin ? 'Gestión de Cupones' : '🎁 Cupones Disponibles'}
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mt-1">
            {isAdmin ? 'Crea y gestiona los descuentos para tus alumnos.' : 'Utiliza estos códigos en el proceso de pago para obtener descuentos.'}
          </p>
        </div>
        {/* 👇 Botón arreglado para modo oscuro 👇 */}
        {isAdmin && <Button onClick={handleOpenModal} className="text-[#bf522b] dark:text-white">+ Crear Cupón</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCoupons.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            No hay cupones disponibles actualmente.
          </div>
        ) : (
          displayedCoupons.map((c) => (
            <Card key={c.id} className={`relative overflow-hidden transition-all duration-300 ${!c.active ? 'opacity-50 grayscale' : 'hover:scale-[1.02]'}`}>
              {isAdmin && <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg z-10 ${c.active ? 'bg-green-500' : 'bg-[#161616]'}`}>{c.active ? 'ACTIVO' : 'INACTIVO'}</div>}
              
              <div className="p-6 text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="font-mono font-extrabold text-[#bf522b] text-2xl tracking-wider bg-white dark:bg-gray-700 py-2 px-4 rounded-xl border-2 border-dashed border-[#bf522b]/30 dark:border-[#bf522b]/70 inline-block mb-3 shadow-sm">
                  {c.code}
                </div>
                <div className="text-5xl font-black text-[#161616] dark:text-white my-4">-{c.discount}%</div>
                
                {!isAdmin && c.active && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 py-2 px-3 rounded-lg border border-green-100 dark:border-green-800 mt-2">
                    ¡Copia este código y úsalo al comprar! 🛒
                  </p>
                )}

                {isAdmin && (
                  <div className="mt-6 flex gap-2 justify-center border-t dark:border-gray-700 pt-4">
                    <button onClick={() => handleToggleStatus(c.id)} className="px-4 py-2 text-xs font-bold border dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      {c.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="px-4 py-2 text-xs font-bold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 transition">
                      🗑 Eliminar
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Crear Cupón (Solo Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 relative p-8">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] dark:hover:text-white text-2xl">&times;</button>
            <h3 className="text-2xl font-bold mb-6 text-[#161616] dark:text-white">Crear Nuevo Cupón</h3>
            <form onSubmit={handleCreate} className="space-y-5">
              <Input label="Código del Cupón" name="code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="VERANO20" required />
              <Input label="Descuento (%)" type="number" name="discount" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="10" required />
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Crear y Guardar ☁️</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CouponManager;