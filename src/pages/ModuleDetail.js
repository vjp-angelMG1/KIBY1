import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModuleService } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const ModuleDetail = () => {
  const { moduloId } = useParams(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      const allModules = await ModuleService.getAll();
      const found = allModules.find(m => m.id === moduloId);
      setModuleData(found);
      setLoading(false);
    };
    fetchModule();
  }, [moduloId]);

  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-300 animate-pulse">Cargando detalle del módulo...</div>;
  if (!moduleData) return <div className="p-10 text-center text-gray-500 dark:text-gray-300">Módulo no encontrado.</div>;

  const isOwned = user?.purchases?.includes(moduleData.id);
  const isAdmin = user?.role === 'admin'; // 👈 Comprobamos si es admin

  // Lista de ejemplo para simular el temario del curso
  const syllabus = [
    "Introducción y conceptos básicos",
    "Configuración del entorno de trabajo",
    "Desarrollo del proyecto principal",
    "Buenas prácticas y optimización",
    "Despliegue y puesta en producción"
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-[#bf522b] hover:underline mb-8 inline-flex items-center font-bold dark:text-[#bf522b]">
        ← Volver atrás
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal (Contenido) */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-4xl font-extrabold text-[#161616] dark:text-white tracking-tight">{moduleData.title}</h1>
          
          <div className="flex flex-wrap gap-3 items-center text-sm">
            <span className="bg-[#bf522b]/10 text-[#bf522b] px-3 py-1 rounded-full font-bold">{moduleData.category}</span>
            {isAdmin && <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-bold">🛡️ Vista Admin</span>}
            {isOwned && !isAdmin && <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold">✅ Módulo Adquirido</span>}
          </div>

          {/* Imagen del curso */}
          <div className="w-full h-72 bg-[#161616] dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg mt-4">
            {moduleData.img ? (
              <img src={moduleData.img} alt={moduleData.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-8xl font-black text-[#bf522b]/20">{moduleData.title.charAt(0)}</div>
            )}
          </div>

          {/* Descripción extendida */}
          <div>
            <h2 className="text-2xl font-bold text-[#161616] dark:text-white mb-3">Descripción del Módulo</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{moduleData.desc}</p>
          </div>

          {/* Temario / Características */}
          <div>
            <h2 className="text-2xl font-bold text-[#161616] dark:text-white mb-4">Temario del Curso</h2>
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden divide-y dark:divide-gray-700">
              {syllabus.map((item, index) => (
                <div key={index} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="bg-[#bf522b]/10 text-[#bf522b] font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm">
                    {index + 1}
                  </div>
                  <span className="text-[#161616] dark:text-gray-200 font-medium">{item}</span>
                  {/* Solo mostramos el check de completado si lo ha comprado Y no es admin */}
                  {isOwned && !isAdmin && <span className="ml-auto text-green-500">✔</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Lateral (Precio y Acción) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700 sticky top-24">
            <div className="text-4xl font-extrabold text-[#161616] dark:text-white mb-4">
              {moduleData.price === 0 ? 'GRATIS' : `${moduleData.price}€`}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span className="mr-2">📚</span> {syllabus.length} Lecciones
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span className="mr-2">♾️</span> Acceso de por vida
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span className="mr-2">📜</span> Certificado de finalización
              </div>
            </div>

            {/* 👇 LÓGICA DE BOTONES SEGÚN EL ROL 👇 */}
            {isAdmin ? (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 p-4 rounded-xl text-center text-sm font-medium">
                🛡️ Modo Administrador<br />
                <span className="text-xs font-normal">Vista previa de descripción</span>
              </div>
            ) : isOwned ? (
              <Button className="w-full justify-center text-lg py-3 text-[#bf522b] dark:text-white" onClick={() => alert('Aquí iría el reproductor del curso')}>
                🚀 Entrar al Curso
              </Button>
            ) : (
              <Button className="w-full justify-center text-lg py-3 text-[#bf522b] dark:text-white" onClick={() => navigate('/checkout', { state: { module: moduleData } })}>
                ⚡ Comprar Ahora
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;