import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Catalog = ({ goToCheckout, refreshKey, isAdmin }) => {
  const [modules, setModules] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => { setModules(ModuleService.getAll()); }, []);
  useEffect(() => { setModules(ModuleService.getAll()); }, [refreshKey]);

  const handleBuyClick = (m) => {
    if (m.price === 0) {
      ModuleService.addPurchase(m.id);
      setModules(ModuleService.getAll());
      alert("✅ Inscripción gratis completada");
    } else {
      goToCheckout(m); // Redirigir a la pantalla de pago con cupones
    }
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const filtered = modules.filter(m => {
    const catMatch = filterCat === 'all' || m.category === filterCat;
    const priceMatch = filterPrice === 'all' || (filterPrice === 'free' && m.price === 0) || (filterPrice === 'paid' && m.price > 0);
    return catMatch && priceMatch;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-[#161616]" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">Todas las Categorías</option>
          <option value="Programación">Programación</option>
          <option value="Diseño">Diseño</option>
          <option value="Marketing">Marketing</option>
          <option value="Negocios">Negocios</option>
        </select>
        <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bf522b] focus:outline-none text-[#161616]" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
          <option value="all">Todos los Precios</option>
          <option value="free">Solo Gratuitos</option>
          <option value="paid">Solo de Pago</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(m => {
          const isOwned = ModuleService.isPurchased(m.id);
          const isFree = m.price === 0;
          const hasError = imageErrors[m.id];
          
          return (
            <Card key={m.id}>
              {/* Imagen fija arriba */}
              <div className="w-full h-48 bg-[#161616] relative overflow-hidden flex items-center justify-center flex-shrink-0 rounded-t-xl">
                {!hasError ? (
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover" onError={() => handleImageError(m.id)} />
                ) : (
                  <span className="text-6xl font-bold text-[#bf522b]">{m.title.charAt(0).toUpperCase()}</span>
                )}
              </div>
              
              {/* Contenido flexible */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#bf522b]/10 text-[#bf522b] text-xs px-2 py-1 rounded-full font-bold uppercase">{m.category}</span>
                  <span className="text-xl font-bold text-[#bf522b]">{isFree ? 'GRATIS' : `${m.price}€`}</span>
                </div>
                <h3 className="text-lg font-bold text-[#161616] mb-1">{m.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{m.desc}</p>
                
                {/* BOTÓN DE COMPRA SIEMPRE VISIBLE Y NARANJA */}
                <div className="mt-auto">
                  {isOwned ? (
                    <Button disabled variant="secondary" className="w-full text-sm">✅ Adquirido</Button>
                  ) : isAdmin ? (
                    <Button variant="dark" className="w-full text-sm" onClick={() => handleBuyClick(m)}>👨‍💼 Simular Compra</Button>
                  ) : (
                    <Button onClick={() => handleBuyClick(m)} className="w-full text-sm">
                      {isFree ? '🆓 Unirse Gratis' : '🛒 Comprar Módulo'}
                    </Button>
                  )}
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