import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Catalog = ({ goToCheckout, isAdmin, userPurchases }) => {
  const [catalogModules, setCatalogModules] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    const fetchCatalogData = async () => {
      setIsCatalogLoading(true); 
      const fetchedModules = await ModuleService.getAll();
      setCatalogModules(fetchedModules);
      setIsCatalogLoading(false);
    };
    fetchCatalogData();
  }, []);

  const handleImageLoadingError = (moduleId) => {
    setImageLoadErrors(previousErrors => ({ ...previousErrors, [moduleId]: true }));
  };

  if (isCatalogLoading) {
    return (
      <div>
        <div className="mb-10">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(skeletonIndex => (
            <div key={skeletonIndex} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
              <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6 space-y-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-4"></div>
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
        <h2 className="text-3xl font-extrabold text-[#161616] dark:text-white tracking-tight">Explora el Catálogo</h2>
        <p className="text-gray-500 dark:text-gray-300 mt-1 text-lg">Encuentra el curso perfecto para ti y lleva tus habilidades al siguiente nivel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {catalogModules.map(moduleItem => {
          const isModuleOwned = userPurchases.includes(moduleItem.id);
          const isModuleFree = moduleItem.price === 0;
          const hasImageError = imageLoadErrors[moduleItem.id];
          
          return (
            <Card key={moduleItem.id}>
              <div className="w-full h-56 bg-[#161616] dark:bg-gray-900 relative overflow-hidden rounded-t-2xl">
                {!hasImageError ? (
                  <img src={moduleItem.img} alt={moduleItem.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" onError={() => handleImageLoadingError(moduleItem.id)} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <span className="text-7xl font-black text-[#bf522b]/20">{moduleItem.title.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-[#161616] dark:text-white text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">{moduleItem.category}</span>
                </div>
                <div className="absolute bottom-4 right-4 z-10">
                  {isModuleFree ? (
                     <span className="bg-green-500 text-white text-sm px-3 py-1 font-bold rounded-full shadow-md">GRATIS</span>
                  ) : (
                     <span className="bg-[#161616]/80 dark:bg-gray-950/80 backdrop-blur-sm text-white text-lg px-3 py-1 font-extrabold rounded-full shadow-md">{moduleItem.price}€</span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col dark:bg-gray-800 rounded-b-2xl">
                <h3 className="text-xl font-bold text-[#161616] dark:text-white mb-2 leading-tight">{moduleItem.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow leading-relaxed">{moduleItem.desc}</p>
                
                {/* Módulo de Características en la tarjeta */}
                {moduleItem.features && moduleItem.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {moduleItem.features.slice(0, 3).map((feature, featureIndex) => (
                      <span key={featureIndex} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded font-medium">{feature}</span>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  {isModuleOwned ? (
                    <Button disabled variant="secondary" className="w-full justify-center">✅ Adquirido</Button>
                  ) : isAdmin ? (
                    <Button variant="dark" className="w-full justify-center">👁 Vista Admin</Button>
                  ) : (
                    <Button onClick={() => goToCheckout(moduleItem)} className="w-full justify-center">
                      {isModuleFree ? '🚀 Unirse Gratis' : '⚡ Inscribirme Ahora'}
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