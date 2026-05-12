import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input"; // Asegúrate de que este archivo existe
import { APP_CONFIG } from "../config/constants";

/**
 * Panel de Administración (CRUD).
 * Solo accesible para el rol Admin.
 * Permite Crear, Leer, Actualizar y Eliminar módulos.
 */
const AdminPanel = () => {
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "Programación",
    price: 0,
    img: ""
  });

  // Cargar módulos al iniciar
  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = () => {
    setModules(ModuleService.getAll());
  };

  // Abrir modal para Crear o Editar
  const handleOpenModal = (module = null) => {
    if (module) {
      setEditingModule(module);
      setFormData(module);
    } else {
      setEditingModule(null);
      setFormData({
        title: "",
        desc: "",
        category: "Programación",
        price: 0,
        img: ""
      });
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingModule) {
      ModuleService.update({ ...formData, id: editingModule.id });
    } else {
      ModuleService.create(formData);
    }
    handleCloseModal();
    loadModules();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este módulo?")) {
      ModuleService.delete(id);
      loadModules();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Módulos (Admin)</h1>
        <Button onClick={() => handleOpenModal()}>+ Nuevo Módulo</Button>
      </div>

      {/* Tabla de Módulos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Imagen</th>
              <th className="p-4 font-semibold text-gray-600">Título</th>
              <th className="p-4 font-semibold text-gray-600">Categoría</th>
              <th className="p-4 font-semibold text-gray-600">Precio</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={m.img} alt={m.title} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                </td>
                <td className="p-4 font-medium text-gray-900">{m.title}</td>
                <td className="p-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold uppercase">
                    {m.category}
                  </span>
                </td>
                <td className="p-4 font-bold text-gray-700">
                  {m.price === 0 ? 'Gratis' : `${m.price}€`}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenModal(m)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded transition mr-1">
                    ✎ Editar
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition">
                    🗑 Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modules.length === 0 && (
          <div className="p-8 text-center text-gray-500">No hay módulos creados aún.</div>
        )}
      </div>

      {/* MODAL DE CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-lg bg-white relative animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Título del Módulo" 
                name="title"
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Ej: Master en React"
                required 
              />
              
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Descripción</label>
                <textarea 
                  name="desc"
                  value={formData.desc} 
                  onChange={handleChange} 
                  placeholder="Descripción breve del curso..."
                  rows="3"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Categoría</label>
                <select 
                  name="category"
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {APP_CONFIG.CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <Input 
                label="Precio (€)" 
                type="number"
                name="price"
                value={formData.price} 
                onChange={handleChange} 
                step="0.01"
                required 
              />

              <Input 
                label="URL de Imagen" 
                type="url"
                name="img"
                value={formData.img} 
                onChange={handleChange} 
                placeholder="https://picsum.photos/..."
                required 
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;