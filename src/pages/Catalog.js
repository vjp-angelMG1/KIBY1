import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { APP_CONFIG } from "../config/constants";

/**
 * Vista del Catálogo de Módulos.
 * Filtros por categoría y precio.
 * Lógica de compra simulada para módulos de pago.
 */
const Catalog = ({ onPurchase }) => {
  const [modules, setModules] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    setModules(ModuleService.getAll());
  }, []);

  /**
   * Maneja la lógica de compra o inscripción.
   * Simula proceso de pago para módulos > 0€.
   * @param {Module} m 
   */
  const handleBuy = (m) => {
    if (m.price === 0) {
      // Inscripción gratuita inmediata
      ModuleService.addPurchase(m.id);
      setModules(ModuleService.getAll());
      alert("Inscripción gratis completada");
    } else {
      // Simulación de compra (Lógica Rol User)
      onPurchase(m);
    }
  };

  /**
   * Filtra los módulos basado en el estado local.
   */
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
        {/* Filtros fuera del grid, como solicitado */}
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
          
          return (
            <Card key={m.id}>
              <img src={m.img} alt={m.title} className="w-full h-48 object-cover" />
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