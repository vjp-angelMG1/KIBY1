import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { APP_CONFIG } from "../config/constants";

const Catalog = ({ onPurchase, refreshKey }) => {
  const [modules, setModules] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    const data = ModuleService.getAll();
    console.log("Catálogo cargado:", data);
    setModules(data);
  }, []);

  useEffect(() => {
    console.log("Actualizando catálogo...");
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

  const filtered = modules.filter(m => {
    const catMatch = filterCat === 'all' || m.category === filterCat;
    const priceMatch = filterPrice === 'all' 
      || (filterPrice === 'free' && m.price === 0) 
      || (filterPrice === 'paid' && m.price > 0);
    return catMatch && priceMatch;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select className="p-2 border rounded" onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">Todas las Categorías</option>
          {APP_CONFIG.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="p-2 border rounded" onChange={(e) => setFilterPrice(e.target.value)}>
          <option value="all">Todos los Precios</option>
          <option value="free">Solo Gratuitos</option>
          <option value="paid">Solo de Pago</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(m => {
          const isOwned = ModuleService.isPurchased(m.id);
          const isFree = m.price === 0;
          
          // Manejo de errores de imagen
          const handleImageError = (e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=Sin+Imagen";
          };
          
          return (
            <Card key={m.id}>
              {/* Fallback de imagen si falla la URL */}
              <img 
                src={m.img} 
                alt={m.title} 
                className="w-full h-48 object-cover bg-gray-200" 
                onError={handleImageError}
              />
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{m.category}</span>
                  <span className="text-xl font-bold">{isFree ? 'GRATIS' : `${m.price}€`}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{m.title}</h3>
                <p className="text-gray-600 text-sm flex-grow">{m.desc}</p>
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