import React, { useState, useEffect } from "react";
import { ModuleService, CouponService } from "../services/dataService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { APP_CONFIG } from "../config/constants";

const AdminPanel = () => {
  const [modulesList, setModulesList] = useState([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formValidationError, setFormValidationError] = useState("");
  const [moduleFormData, setModuleFormData] = useState({ 
    title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "", features: "" 
  });
  
  // Estado para la validación de la imagen
  const [imageValidation, setImageValidation] = useState({ status: 'idle', message: '' }); // idle, loading, valid, error
  
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [buyersModalData, setBuyersModalData] = useState({ isOpen: false, moduleId: null, buyersList: [], isLoading: false });

  const categoryDefaultImages = {
    "Programación": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Diseño": "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "Negocios": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  };

  useEffect(() => { loadModulesFromDatabase(); }, []);

  const loadModulesFromDatabase = async () => {
    const fetchedModules = await ModuleService.getAll();
    setModulesList(fetchedModules);
  };

  const handleOpenModuleModal = (moduleToEdit = null) => {
    setFormValidationError("");
    setImageValidation({ status: 'idle', message: '' }); // Reset validación
    if (moduleToEdit) { 
      setEditingModule(moduleToEdit); 
      setModuleFormData({ 
        ...moduleToEdit, 
        imgList: moduleToEdit.images ? moduleToEdit.images.join(', ') : '', 
        features: moduleToEdit.features ? moduleToEdit.features.join(', ') : '' 
      }); 
      if (moduleToEdit.img) validateImageUrl(moduleToEdit.img); // Validar la imagen existente
    } else { 
      setEditingModule(null); 
      setModuleFormData({ title: "", desc: "", category: "Programación", price: 0, img: "", longDesc: "", imgList: "", features: "" }); 
    }
    setIsModuleModalOpen(true);
  };

  const handleCloseModuleModal = () => { setIsModuleModalOpen(false); };
  
  const handleFormInputChange = (event) => { 
    const { name, value } = event.target; 
    setModuleFormData(previousData => ({ ...previousData, [name]: value }));
    
    // Si cambia la URL, reseteamos la validación hasta que el usuario quite el foco
    if (name === 'img') {
      setImageValidation({ status: 'idle', message: '' });
    }
  };
  
  // 🚀 FUNCIÓN: Validar si una URL de imagen es real y carga correctamente
  const validateImageUrl = (urlToValidate) => {
    if (!urlToValidate) {
      setImageValidation({ status: 'idle', message: 'Se usará imagen por defecto.' });
      return;
    }

    // 1. Validación de sintaxis básica (Regex)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(urlToValidate)) {
      setImageValidation({ status: 'error', message: 'URL mal formada (debe empezar por http:// o https://)' });
      return;
    }

    // 2. Validación de red (Intentar cargar la imagen real)
    setImageValidation({ status: 'loading', message: 'Comprobando imagen...' });
    
    const testImage = new Image();
    
    testImage.onload = () => {
      setImageValidation({ status: 'valid', message: '¡Imagen válida y accesible!' });
    };
    
    testImage.onerror = () => {
      setImageValidation({ status: 'error', message: 'La URL no devuelve una imagen válida o está caída (404).' });
    };

    testImage.src = urlToValidate;
  };

  const handleAutoFillImage = () => { 
    const defaultImage = categoryDefaultImages[moduleFormData.category] || "https://placehold.co/600x400/161616/bf522b?text=Curso";
    setModuleFormData(previousData => ({ ...previousData, img: defaultImage })); 
    validateImageUrl(defaultImage); // Validamos la que ponemos automáticamente
  };

  const handleModuleSubmit = async (event) => {
    event.preventDefault();
    setFormValidationError("");
    
    if (moduleFormData.title.trim().length < 3) { setFormValidationError("El título debe tener al menos 3 caracteres."); return; }
    if (moduleFormData.price === "" || parseFloat(moduleFormData.price) < 0) { setFormValidationError("El precio no puede ser negativo."); return; }
    
    // Bloquear envío si la imagen dio error explícitamente
    if (imageValidation.status === 'error') {
      setFormValidationError("Corrige la URL de la imagen antes de guardar.");
      return;
    }

    if (editingModule) { 
      await ModuleService.update({ ...moduleFormData, id: editingModule.id }); 
    } else { 
      await ModuleService.create(moduleFormData); 
    }
    handleCloseModuleModal();
    loadModulesFromDatabase();
  };

  const handleModuleDelete = async (moduleIdToDelete) => {
    if (window.confirm("¿Estás seguro de eliminar este módulo?")) { 
      await ModuleService.delete(moduleIdToDelete); 
      loadModulesFromDatabase(); 
    }
  };

  const handleViewBuyers = async (moduleIdToQuery) => {
    setBuyersModalData({ isOpen: true, moduleId: moduleIdToQuery, buyersList: [], isLoading: true });
    const buyerEmails = await ModuleService.getBuyersForModule(moduleIdToQuery);
    setBuyersModalData({ isOpen: true, moduleId: moduleIdToQuery, buyersList: buyerEmails, isLoading: false });
  };

  const handleCouponCreation = async (event) => {
    event.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    const defaultCouponImg = `https://placehold.co/600x400/161616/bf522b?text=${newCouponCode}`;
    await CouponService.create(newCouponCode, newCouponDiscount, defaultCouponImg);
    setNewCouponCode(""); 
    setNewCouponDiscount(""); 
    setIsCouponModalOpen(false);
    alert("✅ Cupón creado con éxito.");
  };

  // Función auxiliar para los colores del validador
  const getValidationColor = () => {
    switch(imageValidation.status) {
      case 'valid': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'loading': return 'text-gray-500';
      default: return 'text-gray-400';
    }
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
          <Button onClick={() => handleOpenModuleModal()}>+ Nuevo Módulo</Button>
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
              {modulesList.map(moduleItem => (
                <tr key={moduleItem.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#161616] flex items-center justify-center shadow-sm flex-shrink-0">
                        <img src={moduleItem.img} alt={moduleItem.title} className="w-full h-full object-cover" onError={(imgEvent) => { imgEvent.target.style.display='none'; imgEvent.target.nextSibling.style.display='block'; }} />
                        <span className="hidden text-[#bf522b] font-bold text-sm">{moduleItem.title.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#161616]">{moduleItem.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{moduleItem.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {moduleItem.features && moduleItem.features.length > 0 ? (
                        moduleItem.features.map((featureName, featureIndex) => (
                          <span key={featureIndex} className="bg-[#bf522b]/10 text-[#bf522b] text-[10px] px-2 py-0.5 rounded font-bold uppercase">{featureName}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Sin características</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider block w-fit mb-2">{moduleItem.category}</span>
                    <span className="font-extrabold text-[#161616]">{moduleItem.price === 0 ? 'Gratis' : `${moduleItem.price}€`}</span>
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <button onClick={() => handleViewBuyers(moduleItem.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition" title="Compradores">👥</button>
                    <button onClick={() => handleOpenModuleModal(moduleItem)} className="text-[#bf522b] hover:bg-[#bf522b]/10 p-2 rounded-lg transition" title="Editar">✎</button>
                    <button onClick={() => handleModuleDelete(moduleItem.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Borrar">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modulesList.length === 0 && <div className="p-12 text-center text-gray-400">No hay módulos.</div>}
      </div>

      {/* MODAL COMPRADORES */}
      {buyersModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white relative p-8">
            <button onClick={() => setBuyersModalData({ ...buyersModalData, isOpen: false })} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-2xl font-bold mb-6 text-[#161616]">👥 Compradores</h3>
            {buyersModalData.isLoading ? <div className="py-8 text-center text-gray-500">Cargando...</div> : 
              buyersModalData.buyersList.length === 0 ? <div className="py-8 text-center text-gray-400">Nadie lo ha comprado aún.</div> : (
                <div className="space-y-3">{buyersModalData.buyersList.map((buyerEmail, emailIndex) => (
                  <div key={emailIndex} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-[#bf522b]/10 rounded-full flex items-center justify-center text-[#bf522b] font-bold text-sm">{buyerEmail.charAt(0)}</div>
                    <span className="text-sm font-medium">{buyerEmail}</span>
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
            <form onSubmit={handleCouponCreation} className="space-y-5">
              <Input label="Código" value={newCouponCode} onChange={inputEvent=>setNewCouponCode(inputEvent.target.value.toUpperCase())} placeholder="VERANO20" required />
              <Input label="Descuento (%)" type="number" value={newCouponDiscount} onChange={inputEvent=>setNewCouponDiscount(inputEvent.target.value)} placeholder="10" required />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setIsCouponModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Crear ☁️</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL CREAR/EDITAR MÓDULO (CON VALIDACIÓN DE IMAGEN) */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white relative p-8 overflow-y-auto max-h-[90vh]">
            <button onClick={handleCloseModuleModal} className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingModule ? 'Editar' : 'Nuevo'} Módulo</h3>
            {formValidationError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{formValidationError}</div>}
            <form onSubmit={handleModuleSubmit} className="space-y-4">
              <Input label="Título" name="title" value={moduleFormData.title} onChange={handleFormInputChange} required />
              <Input label="Descripción Corta" name="desc" value={moduleFormData.desc} onChange={handleFormInputChange} required />
              <div>
                <label className="block text-sm font-semibold mb-1">Características del Módulo</label>
                <textarea name="features" value={moduleFormData.features} onChange={handleFormInputChange} placeholder="Ej: 50h de video, Certificado (separadas por coma)" rows="2" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Categoría</label>
                <select name="category" value={moduleFormData.category} onChange={handleFormInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none">
                  {APP_CONFIG.CATEGORIES.map(categoryOption => <option key={categoryOption} value={categoryOption}>{categoryOption}</option>)}
                </select>
              </div>
              <Input label="Precio (€)" type="number" name="price" value={moduleFormData.price} onChange={handleFormInputChange} required />
              
              {/* --- CAMPO URL IMAGEN CON VALIDACIÓN EN TIEMPO REAL --- */}
              <div>
                <label className="block text-sm font-semibold mb-1">URL Imagen</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    name="img" 
                    value={moduleFormData.img} 
                    onChange={handleFormInputChange} 
                    onBlur={(e) => validateImageUrl(e.target.value)} // Se valida al quitar el foco
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-sm" 
                    placeholder="https://ejemplo.com/foto.jpg" 
                  />
                  <button type="button" onClick={handleAutoFillImage} className="bg-[#161616] text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-gray-800 whitespace-nowrap">🌐 Foto</button>
                </div>
                
                {/* Indicador de estado de la validación */}
                {imageValidation.status !== 'idle' && (
                  <div className={`flex items-center gap-2 mt-2 text-xs font-semibold ${getValidationColor()}`}>
                    {imageValidation.status === 'loading' && <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {imageValidation.status === 'valid' && '✅'}
                    {imageValidation.status === 'error' && '❌'}
                    {imageValidation.message}
                  </div>
                )}
              </div>

              {/* Vista previa si la imagen es válida */}
              {imageValidation.status === 'valid' && moduleFormData.img && (
                <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50 p-2">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Vista Previa</p>
                  <img src={moduleFormData.img} alt="Preview" className="h-32 w-full object-cover rounded-md" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={handleCloseModuleModal}>Cancelar</Button>
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