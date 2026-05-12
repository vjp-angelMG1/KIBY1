import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { APP_CONFIG } from "../config/constants";

const AdminPanel = () => { // Ya no recibe onPurchase
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({
    title: "", desc: "", category: "Programación", price: 0, img: ""
  });

  const categoryImages = {
    "Programación": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Diseño": "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Negocios": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  };

  useEffect(() => { loadModules(); }, []);

  const loadModules = () => { setModules(ModuleService.getAll()); };

  const handleOpenModal = (module = null) => {
    if (module) { setEditingModule(module); setFormData(module); } 
    else { setEditingModule(null); setFormData({ title: "", desc: "", category: "Programación", price: 0, img: "" }); }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", desc: "", category: "Programación", price: 0, img: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoFillImage = () => {
    const imageUrl = categoryImages[formData.category] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
    setFormData(prev => ({ ...prev, img: imageUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingModule) { ModuleService.update({ ...formData, id: editingModule.id }); } 
    else { ModuleService.create(formData); }
    handleCloseModal();
    loadModules();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este módulo?")) { ModuleService.delete(id); loadModules(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#161616]">Gestión de Módulos (Admin)</h1>
        <Button onClick={() => handleOpenModal()}>+ Nuevo Módulo</Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-[#161616] border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-300">Imagen</th>
              <th className="p-4 font-semibold text-gray-300">Título</th>
              <th className="p-4 font-semibold text-gray-300">Categoría</th>
              <th className="p-4 font-semibold text-gray-300">Precio Base</th>
              <th className="p-4 font-semibold text-gray-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#161616] flex items-center justify-center">
                      <img src={m.img} alt={m.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                      <span className="hidden text-[#bf522b] font-bold text-sm">{m.title.charAt(0)}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[#161616]">{m.title}</td>
                  <td className="p-4">
                    <span className="bg-[#bf522b]/10 text-[#bf522b] text-xs px-2 py-1 rounded-full font-bold uppercase">{m.category}</span>
                  </td>
                  <td className="p-4 font-bold text-[#161616]">{m.price === 0 ? 'Gratis' : `${m.price}€`}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(m)} className="text-[#bf522b] hover:bg-[#bf522b]/10 p-2 rounded transition" title="Editar">✎</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition" title="Borrar">🗑</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {modules.length === 0 && (<div className="p-8 text-center text-gray-500">No hay módulos creados aún.</div>)}
      </div>

      {/* MODAL DE CREAR/EDITAR (Igual que antes) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl bg-white relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#161616]">{editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input label="Título del Módulo" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Master en React" required />
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-[#161616]">Descripción</label>
                    <textarea name="desc" value={formData.desc} onChange={handleChange} placeholder="Descripción breve..." rows="3" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:border-[#bf522b] focus:outline-none transition"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-[#161616]">Categoría</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none">
                      {APP_CONFIG.CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <Input label="Precio (€)" type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
                </div>
                <div className="space-y-4 flex flex-col">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-[#161616]">URL de Imagen</label>
                    <div className="flex gap-2">
                      <input type="url" name="img" value={formData.img} onChange={handleChange} placeholder="https://ejulo.com/foto.jpg" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none transition text-sm" />
                      <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold whitespace-nowrap hover:bg-gray-800 transition">🌐 Foto Web</button>
                    </div>
                  </div>
                  <div className="flex-grow bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center mt-2">
                    <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Vista Previa</p>
                    <div className="w-full h-40 rounded-md overflow-hidden bg-[#161616] flex items-center justify-center shadow-inner">
                      {formData.img ? (
                        <img src={formData.img} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      ) : null}
                      <div className={`w-full h-full items-center justify-center ${formData.img ? 'hidden' : 'flex'}`}>
                        <span className="text-5xl font-bold text-[#bf522b]">?</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Guardar Módulo</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;