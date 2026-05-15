import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Catalog = ({ goToCheckout, isAdmin, userPurchases }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const mods = await ModuleService.getAll();
      setModules(mods);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // SKELETON LOADING: Mientras carga, mostramos esto
  if (loading) {
    return (
      <div>
        <div className="mb-10">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-[#161616] tracking-tight">Explora el Catálogo</h2>
        <p className="text-gray-500 mt-1 text-lg">Encuentra el curso perfecto para ti y lleva tus habilidades al siguiente nivel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map(m => {
          const isOwned = userPurchases.includes(m.id);
          const isFree = m.price === 0;
          const hasError = imageErrors[m.id];
          
          return (
            <Card key={m.id}>
              <div className="w-full h-56 bg-[#161616] relative overflow-hidden rounded-t-2xl">
                {!hasError ? (
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" onError={() => handleImageError(m.id)} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <span className="text-7xl font-black text-[#bf522b]/20">{m.title.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-[#161616] text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">{m.category}</span>
                </div>
                <div className="absolute bottom-4 right-4 z-10">
                  {isFree ? (
                     <span className="bg-green-500 text-white text-sm px-3 py-1 font-bold rounded-full shadow-md">GRATIS</span>
                  ) : (
                     <span className="bg-[#161616]/80 backdrop-blur-sm text-white text-lg px-3 py-1 font-extrabold rounded-full shadow-md">{m.price}€</span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-bold text-[#161616] mb-2 leading-tight">{m.title}</h3>
                <p className="text-gray-500 text-sm flex-grow leading-relaxed">{m.desc}</p>
                <div className="mt-6">
                  {isOwned ? (
                    <Button disabled variant="secondary" className="w-full justify-center">✅ Adquirido</Button>
                  ) : isAdmin ? (
                    <Button variant="dark" className="w-full justify-center">👁 Vista Admin</Button>
                  ) : (
                    <Button onClick={() => goToCheckout(m)} className="w-full justify-center">
                      {isFree ? '🚀 Unirse Gratis' : '⚡ Inscribirme Ahora'}
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