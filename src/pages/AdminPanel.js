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
  const [formError, setFormError] = useState(""); // Estado para errores de validación
  const [formData, setFormData] = useState({ title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "" });

  // Diccionario de fotos reales por categoría (Se autocompleta)
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
    setFormError(""); // Limpiamos errores previos al abrir
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
  
  // Función mágica para rellenar la foto
  const handleAutoFillImage = () => { 
    setFormData(prev => ({ ...prev, img: categoryImages[prev.category] || "https://placehold.co/600x400/161616/bf522b?text=Curso" })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(""); // Limpiamos errores previos al enviar

    // --- VALIDACIONES ---
    if (formData.title.trim().length < 3) {
      setFormError("El título debe tener al menos 3 caracteres.");
      return;
    }
    if (formData.desc.trim().length < 10) {
      setFormError("La descripción corta es demasiado breve (mínimo 10 caracteres).");
      return;
    }
    if (formData.price === "" || parseFloat(formData.price) < 0) {
      setFormError("El precio no puede estar vacío ni ser negativo.");
      return;
    }
    // -------------------

    if (editingModule) { 
      await ModuleService.update({ ...formData, id: editingModule.id }); 
    } else { 
      await ModuleService.create(formData); 
    }
    handleCloseModal();
    loadModules();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) { await ModuleService.delete(id); loadModules(); }
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
              <tr key={m.id} className="hover:bg-gray-50">
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
                  <button onClick={() => handleOpenModal(m)} className="text-[#bf522b] hover:bg-[#bf522b]/10 p-2 rounded">✎</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modules.length === 0 && <div className="p-8 text-center text-gray-400">No hay módulos en la nube. Crea el primero.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white relative p-6">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingModule ? 'Editar' : 'Nuevo'} Módulo</h3>
            
            {/* MENSAJE DE ERROR DE VALIDACIÓN */}
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
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
              
              {/* CAMPO DE IMAGEN CON BOTÓN MÁGICO */}
              <div>
                <label className="block text-sm font-semibold mb-1">URL Imagen</label>
                <div className="flex gap-2">
                  <input type="url" name="img" value={formData.img} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" placeholder="Se rellena automáticamente" />
                  <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 whitespace-nowrap">🌐 Foto Web</button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Pulsa "Foto Web" o déjalo vacío para generar una automática.</p>
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