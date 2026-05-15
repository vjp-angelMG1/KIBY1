import React, { useState, useEffect } from "react";
import { ModuleService, CouponService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { APP_CONFIG } from "../config/constants";

const AdminPanel = () => {
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({ title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "", features: "" });
  
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");
  const [buyersModal, setBuyersModal] = useState({ isOpen: false, moduleId: null, buyers: [], loading: false });

  const categoryImages = {
    "Programación": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Diseño": "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Negocios": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  };

  useEffect(() => { loadModules(); }, []);

  const loadModules = async () => {
    const data = await ModuleService.getAll();
    setModules(data);
  };

  const handleOpenModal = (module = null) => {
    setFormError("");
    if (module) { 
      setEditingModule(module); 
      setFormData({ 
        ...module, 
        imgList: module.images ? module.images.join(', ') : '', 
        features: module.features ? module.features.join(', ') : '' // Convertimos array a texto
      }); 
    } else { 
      setEditingModule(null); 
      setFormData({ title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "", features: "" }); 
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); };
  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleAutoFillImage = () => { 
    setFormData(prev => ({ ...prev, img: categoryImages[prev.category] || "https://placehold.co/600x400/161616/bf522b?text=Curso" })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (formData.title.trim().length < 3) { setFormError("El título debe tener al menos 3 caracteres."); return; }
    if (formData.price === "" || parseFloat(formData.price) < 0) { setFormError("El precio no puede ser negativo."); return; }

    // Preparamos los datos (dataService se encargará de convertir features e imgList a arrays)
    if (editingModule) { await ModuleService.update({ ...formData, id: editingModule.id }); } 
    else { await ModuleService.create(formData); }
    handleCloseModal();
    loadModules();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) { await ModuleService.delete(id); loadModules(); }
  };

  const handleViewBuyers = async (moduleId) => {
    setBuyersModal({ isOpen: true, moduleId, buyers: [], loading: true });
    const emails = await ModuleService.getBuyersForModule(moduleId);
    setBuyersModal({ isOpen: true, moduleId, buyers: emails, loading: false });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount) return;
    const finalImg = `https://placehold.co/600x400/161616/bf522b?text=${couponCode}`;
    await CouponService.create(couponCode, couponDiscount, finalImg);
    setCouponCode(""); setCouponDiscount(""); setIsCouponModalOpen(false);
    alert("✅ Cupón creado con éxito.");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">Gestiona tus módulos y cupones.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsCouponModalOpen(true)}>🎫 Crear Cupón</Button>
          <Button onClick={() => handleOpenModal()}>+ Nuevo Módulo</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-[#161616]">Módulos Creados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#161616] border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Info</th>
                <th className="p-4 font-semibold text-gray-300">Características</th>
                <th className="p-4 font-semibold text-gray-300">Categoría / Precio</th>
                <th className="p-4 font-semibold text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modules.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#161616] flex items-center justify-center shadow-sm flex-shrink-0">
                        <img src={m.img} alt={m.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                        <span className="hidden text-[#bf522b] font-bold text-sm">{m.title.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#161616]">{m.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{m.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {m.features && m.features.length > 0 ? (
                        m.features.map((f, i) => (
                          <span key={i} className="bg-[#bf522b]/10 text-[#bf522b] text-[10px] px-2 py-0.5 rounded font-bold uppercase">{f}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Sin características</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider block w-fit mb-2">{m.category}</span>
                    <span className="font-extrabold text-[#161616]">{m.price === 0 ? 'Gratis' : `${m.price}€`}</span>
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <button onClick={() => handleViewBuyers(m.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition" title="Compradores">👥</button>
                    <button onClick={() => handleOpenModal(m)} className="text-[#bf522b] hover:bg-[#bf522b]/10 p-2 rounded-lg transition" title="Editar">✎</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Borrar">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modules.length === 0 && <div className="p-12 text-center text-gray-400">No hay módulos.</div>}
      </div>

      {/* MODAL COMPRADORES */}
      {buyersModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white relative p-8">
            <button onClick={() => setBuyersModal({ ...buyersModal, isOpen: false })} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-2xl font-bold mb-6 text-[#161616]">👥 Compradores</h3>
            {buyersModal.loading ? <div className="py-8 text-center text-gray-500">Cargando...</div> : 
              buyersModal.buyers.length === 0 ? <div className="py-8 text-center text-gray-400">Nadie lo ha comprado aún.</div> : (
                <div className="space-y-3">{buyersModal.buyers.map((email, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-[#bf522b]/10 rounded-full flex items-center justify-center text-[#bf522b] font-bold text-sm">{email.charAt(0)}</div>
                    <span className="text-sm font-medium">{email}</span>
                  </div>
                ))}</div>
              )
            }
          </Card>
        </div>
      )}

      {/* MODAL CREAR CUPÓN */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white relative p-8">
            <button onClick={() => setIsCouponModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-2xl font-bold mb-6">🎫 Crear Cupón</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-5">
              <Input label="Código" value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder="VERANO20" required />
              <Input label="Descuento (%)" type="number" value={couponDiscount} onChange={e=>setCouponDiscount(e.target.value)} placeholder="10" required />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setIsCouponModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Crear ☁️</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL CREAR/EDITAR MÓDULO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white relative p-8 overflow-y-auto max-h-[90vh]">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingModule ? 'Editar' : 'Nuevo'} Módulo</h3>
            {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Título" name="title" value={formData.title} onChange={handleChange} required />
              <Input label="Descripción Corta" name="desc" value={formData.desc} onChange={handleChange} required />
              
              {/* NUEVO CAMPO: CARACTERÍSTICAS */}
              <div>
                <label className="block text-sm font-semibold mb-1">Características del Módulo</label>
                <textarea 
                  name="features" 
                  value={formData.features} 
                  onChange={handleChange} 
                  placeholder="Ej: 50h de video, Certificado PDF, Soporte prioritario (separadas por coma)"
                  rows="2"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Categoría</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none">
                  {APP_CONFIG.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Precio (€)" type="number" name="price" value={formData.price} onChange={handleChange} required />
              <div>
                <label className="block text-sm font-semibold mb-1">URL Imagen</label>
                <div className="flex gap-2">
                  <input type="url" name="img" value={formData.img} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" placeholder="Automático" />
                  <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 whitespace-nowrap">🌐 Foto</button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Guardar ☁️</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;