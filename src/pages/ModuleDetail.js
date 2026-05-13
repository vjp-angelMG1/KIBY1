import React from "react";
import Card from "../components/ui/Card";

const ModuleDetail = ({ module }) => {
  if (!module) {
    return <div className="text-center py-20 text-gray-500">Módulo no encontrado.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Cabecera del Curso */}
      <div className="mb-8">
        <span className="bg-[#bf522b]/10 text-[#bf522b] text-sm px-3 py-1 rounded-full font-bold uppercase">{module.category}</span>
        <h1 className="text-4xl font-extrabold text-[#161616] mt-3 mb-2">{module.title}</h1>
        <p className="text-gray-500 text-lg">{module.desc}</p>
      </div>

      {/* Imagen Principal del Curso */}
      <div className="w-full h-72 md:h-[450px] rounded-2xl overflow-hidden bg-[#161616] mb-10 flex items-center justify-center shadow-xl relative">
        <img src={module.img} alt={module.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
        <div className="hidden w-full h-full items-center justify-center absolute inset-0 bg-[#161616]">
          <span className="text-9xl font-bold text-[#bf522b]">{module.title.charAt(0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Contenido Detallado y Galería */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Descripción Completa */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-[#161616] mb-4 border-b-2 border-[#bf522b] pb-2 inline-block">Descripción Completa</h2>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {module.longDesc || "No hay descripción detallada para este módulo aún."}
            </p>
          </Card>

          {/* Galería de Imágenes Detalladas */}
          {module.images && module.images.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-[#161616] mb-4 border-b-2 border-[#bf522b] pb-2 inline-block">Contenido en Detalle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {module.images.map((imgSrc, index) => (
                  <div key={index} className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <img src={imgSrc} alt={`Detalle ${index+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-[#161616]"><span class="text-4xl font-bold text-[#bf522b]">?</span></div>'; }} />
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>

        {/* Columna Derecha: Reproductor de Video */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-[#161616] text-white sticky top-24">
            <h3 className="font-bold text-xl mb-4">Clases en Vivo</h3>
            <div className="bg-gray-800 p-6 rounded-lg text-gray-400 flex flex-col items-center justify-center h-48 mb-4 border border-gray-700">
              <svg className="w-12 h-12 mb-2 text-[#bf522b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              [ REPRODUCTOR DE VIDEO ]
            </div>
            <p className="text-sm text-gray-400">Acceso ilimitado a todas las lecciones del módulo.</p>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default ModuleDetail;