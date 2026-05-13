import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Catalog = ({ goToCheckout, isAdmin, userPurchases }) => {
  const [modules, setModules] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const mods = await ModuleService.getAll();
      setModules(mods);
    };
    fetchData();
  }, []);

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(m => {
          const isOwned = userPurchases.includes(m.id);
          const isFree = m.price === 0;
          const hasError = imageErrors[m.id];
          
          return (
            <Card key={m.id}>
              {/* --- IMAGEN DEL MÓDULO --- */}
              <div className="w-full h-48 bg-[#161616] relative overflow-hidden flex items-center justify-center">
                {!hasError ? (
                  <img 
                    src={m.img} 
                    alt={m.title} 
                    className="w-full h-full object-cover" 
                    onError={() => handleImageError(m.id)} 
                  />
                ) : (
                  <span className="text-6xl font-bold text-[#bf522b]">
                    {m.title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* --- CONTENIDO DE LA TARJETA --- */}
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#bf522b]/10 text-[#bf522b] text-xs px-2 py-1 rounded-full font-bold uppercase">{m.category}</span>
                  <span className="text-xl font-bold text-[#bf522b]">{isFree ? 'GRATIS' : `${m.price}€`}</span>
                </div>
                <h3 className="text-lg font-bold text-[#161616] mb-2">{m.title}</h3>
                <p className="text-gray-500 text-sm flex-grow">{m.desc}</p>
                
                <div className="mt-4">
                  {isOwned ? (
                  <Button disabled variant="secondary" className="w-full text-sm">✅ Adquirido</Button>
                  ) : (
                  <Button onClick={() => goToCheckout(m)} className="w-full text-sm">
                  {isAdmin ? '🛒 Simular Compra' : (isFree ? '🆓 Unirse' : '🛒 Comprar')}
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