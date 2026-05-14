import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { APP_CONFIG } from "../config/constants";

const AdminPanel = () => {
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({ title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "" });
  
  // Estado para el modal de compradores
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
      setFormData({ ...module, imgList: module.images ? module.images.join(', ') : '' }); 
    } else { 
      setEditingModule(null); 
      setFormData({ title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "" }); 
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
    if (formData.desc.trim().length < 10) { setFormError("La descripción es demasiado corta."); return; }
    if (formData.price === "" || parseFloat(formData.price) < 0) { setFormError("El precio no puede ser negativo."); return; }

    if (editingModule) { await ModuleService.update({ ...formData, id: editingModule.id }); } 
    else { await ModuleService.create(formData); }
    handleCloseModal();
    loadModules();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) { await ModuleService.delete(id); loadModules(); }
  };

  // FUNCIÓN PARA VER COMPRADORES
  const handleViewBuyers = async (moduleId) => {
    setBuyersModal({ isOpen: true, moduleId, buyers: [], loading: true });
    const emails = await ModuleService.getBuyersForModule(moduleId);
    setBuyersModal({ isOpen: true, moduleId, buyers: emails, loading: false });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#161616]">Gestión de Módulos (Nube ☁️)</h1>
        <Button onClick={() => handleOpenModal()}>+ Nuevo Módulo</Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-[#161616] border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-300">Imagen</th>
              <th className="p-4 font-semibold text-gray-300">Título</th>
              <th className="p-4 font-semibold text-gray-300">Categoría</th>
              <th className="p-4 font-semibold text-gray-300">Precio</th>
              <th className="p-4 font-semibold text-gray-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {modules.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#161616] flex items-center justify-center">
                    <img src={m.img} alt={m.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                    <span className="hidden text-[#bf522b] font-bold text-sm">{m.title.charAt(0)}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-[#161616]">{m.title}</td>
                <td className="p-4"><span className="bg-[#bf522b]/10 text-[#bf522b] text-xs px-2 py-1 rounded-full font-bold uppercase">{m.category}</span></td>
                <td className="p-4 font-bold">{m.price === 0 ? 'Gratis' : `${m.price}€`}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleViewBuyers(m.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition" title="Ver Compradores">👥</button>
                  <button onClick={() => handleOpenModal(m)} className="text-[#bf522b] hover:bg-[#bf522b]/10 p-2 rounded transition" title="Editar">✎</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition" title="Borrar">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modules.length === 0 && <div className="p-8 text-center text-gray-400">No hay módulos en la nube. Crea el primero.</div>}
      </div>

      {/* MODAL DE COMPRADORES */}
      {buyersModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white relative p-8">
            <button onClick={() => setBuyersModal({ ...buyersModal, isOpen: false })} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-2xl font-bold mb-6 text-[#161616]">👥 Clientes que lo compraron</h3>
            
            {buyersModal.loading ? (
              <div className="text-center text-gray-500 py-8">Buscando en la base de datos...</div>
            ) : buyersModal.buyers.length === 0 ? (
              <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-lg border border-dashed">
                Nadie ha comprado este módulo aún.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {buyersModal.buyers.map((email, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-[#bf522b]/10 rounded-full flex items-center justify-center text-[#bf522b] font-bold text-sm">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[#161616] font-medium text-sm">{email}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* MODAL DE CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white relative p-8">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingModule ? 'Editar' : 'Nuevo'} Módulo</h3>
            
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Título" name="title" value={formData.title} onChange={handleChange} required />
              <Input label="Descripción Corta" name="desc" value={formData.desc} onChange={handleChange} required />
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
                  <input type="url" name="img" value={formData.img} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" placeholder="Se rellena automáticamente" />
                  <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 whitespace-nowrap">🌐 Foto</button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Guardar en Nube ☁️</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;