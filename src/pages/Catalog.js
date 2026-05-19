import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModuleService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

/**
 * Componente de Catálogo de Módulos.
 * Muestra una cuadrícula responsiva con todos los módulos disponibles.
 * Cambia el comportamiento de los botones y etiquetas según si el usuario 
 * es administrador o si ya ha adquirido el módulo.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.isAdmin - Indica si el usuario actual tiene rol de administrador.
 * @param {Array<string>} props.userPurchases - Array de IDs de los módulos que el usuario ya ha comprado.
 * @returns {JSX.Element} La vista del catálogo con skeleton loading y tarjetas de módulos.
 */
const Catalog = ({ isAdmin, userPurchases }) => {
  /** @type {[Array<Object>, Function]} Lista de módulos obtenidos de la base de datos */
  const [catalogModules, setCatalogModules] = useState([]);
  
  /** @type {[boolean, Function]} Estado de carga inicial para mostrar el skeleton UI */
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  
  /** @type {[Object, Function]} Registro de IDs de módulos cuya imagen falló al cargar */
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  
  /** Hook de navegación de React Router para redirigir al detalle del módulo */
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Obtiene los datos de todos los módulos desde el servicio y actualiza el estado.
     * @returns {Promise<void>}
     */
    const fetchCatalogData = async () => {
      setIsCatalogLoading(true); 
      const fetchedModules = await ModuleService.getAll();
      setCatalogModules(fetchedModules);
      setIsCatalogLoading(false);
    };
    fetchCatalogData();
  }, []);

  /**
   * Maneja el error de carga de imágenes.
   * Marca el ID del módulo para mostrar un fallback (letra inicial) en lugar de la imagen rota.
   * 
   * @param {string} moduleId - El ID del módulo cuya imagen falló.
   */
  const handleImageLoadingError = (moduleId) => {
    setImageLoadErrors(previousErrors => ({ ...previousErrors, [moduleId]: true }));
  };

  // Interfaz de carga (Skeleton) mientras se obtienen los datos
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
          /** @type {boolean} Determina si el usuario actual ya compró este módulo */
          const isModuleOwned = userPurchases.includes(moduleItem.id);
          
          /** @type {boolean} Determina si el módulo es gratuito (precio 0) */
          const isModuleFree = moduleItem.price === 0;
          
          /** @type {boolean} Determina si la imagen de este módulo falló al cargar */
          const hasImageError = imageLoadErrors[moduleItem.id];
          
          return (
            <Card key={moduleItem.id}>
              {/* 👇 IMAGEN RESTAURADA COMPLETAMENTE 👇 */}
              <div className="w-full h-56 bg-[#161616] dark:bg-gray-900 relative overflow-hidden rounded-t-2xl cursor-pointer" onClick={() => navigate(`/modulo/${moduleItem.id}`)}>
                {!hasImageError ? (
                  <img 
                    src={moduleItem.img} 
                    alt={moduleItem.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                    onError={() => handleImageLoadingError(moduleItem.id)} 
                  />
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
                <h3 className="text-xl font-bold text-[#161616] dark:text-white mb-2 leading-tight cursor-pointer hover:text-[#bf522b] dark:hover:text-[#bf522b]" onClick={() => navigate(`/modulo/${moduleItem.id}`)}>{moduleItem.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow leading-relaxed">{moduleItem.desc}</p>
                
                {/* Características */}
                {moduleItem.features && moduleItem.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {moduleItem.features.slice(0, 3).map((feature, featureIndex) => (
                      <span key={featureIndex} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded font-medium">{feature}</span>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  {isModuleOwned ? (
                    <Button onClick={() => navigate(`/modulo/${moduleItem.id}`)} className="w-full justify-center text-[#bf522b] dark:text-white">✅ Ver Módulo</Button>
                  ) : isAdmin ? (
                    <Button onClick={() => navigate(`/modulo/${moduleItem.id}`)} variant="dark" className="w-full justify-center text-[#bf522b] dark:text-white">👁 Vista Previa Admin</Button>
                  ) : (
                    <Button onClick={() => navigate(`/modulo/${moduleItem.id}`)} className="w-full justify-center text-[#bf522b] dark:text-white">
                      {isModuleFree ? '🚀 Unirse Gratis' : '⚡ Ver Detalles'}
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