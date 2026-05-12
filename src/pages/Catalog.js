import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { APP_CONFIG } from "../config/constants";

const Catalog = ({ onPurchase, refreshKey }) => {
  const [modules, setModules] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  
  // Estado para rastrear qué imágenes fallaron al cargar
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => { 
    setModules(ModuleService.getAll()); 
  }, []);

  useEffect(() => { 
    setModules(ModuleService.getAll()); 
  }, [refreshKey]);

  const handleBuy = (m) => {
    if (m.price === 0) {
      ModuleService.addPurchase(m.id);
      setModules(ModuleService.getAll());
      alert("Inscripción gratis completada");
    } else { 
      onPurchase(m); 
    }
  };

  // Función para marcar una imagen como errónea en el estado
  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const filtered = modules.filter(m => {
    const catMatch = filterCat === 'all' || m.category === filterCat;
    const priceMatch = filterPrice === 'all' 
      || (filterPrice === 'free' && m.price === 0) 
      || (filterPrice === 'paid' && m.price > 0);
    return catMatch && priceMatch;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select 
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:border-[#bf522b] focus:outline-none transition"
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="all">Todas las Categorías</option>
          {APP_CONFIG.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:border-[#bf522b] focus:outline-none transition"
          onChange={(e) => setFilterPrice(e.target.value)}
        >
          <option value="all">Todos los Precios</option>
          <option value="free">Solo Gratuitos</option>
          <option value="paid">Solo de Pago</option>
        </select>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(m => {
          const isOwned = ModuleService.isPurchased(m.id);
          const isFree = m.price === 0;
          const hasError = imageErrors[m.id];
          
          return (
            <Card key={m.id}>
              {/* Contenedor de Imagen con Placeholder integrado */}
              <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {!hasError ? (
                  <img 
                    src={m.img} 
                    alt={m.title} 
                    className="w-full h-full object-cover" 
                    onError={() => handleImageError(m.id)} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-xs text-center">Imagen no disponible</span>
                  </div>
                )}
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#bf522b]/10 text-[#bf522b] text-xs px-2 py-1 rounded-full font-bold uppercase">
                    {m.category}
                  </span>
                  <span className="text-xl font-bold text-[#bf522b]">
                    {isFree ? 'GRATIS' : `${m.price}€`}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-[#161616] mb-2">{m.title}</h3>
                <p className="text-gray-500 text-sm flex-grow">{m.desc}</p>
                
                <div className="mt-4">
                  {isOwned 
                    ? <Button disabled variant="secondary" className="w-full">Adquirido</Button>
                    : <Button onClick={() => handleBuy(m)} className="w-full">{isFree ? 'Unirse' : 'Comprar'}</Button>
                  }
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Catalog;