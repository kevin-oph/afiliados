import React, { useMemo } from 'react';
import { X, Award, Users, Copy, MapPin } from 'lucide-react';

export default function LiderModal({ liderNombre, data, onClose }) {
  if (!liderNombre) return null;

  // 1. Filtrar los afiliados de este líder y eliminar duplicados exactos (mismo nombre, líder y colonia)
  const afiliadosLider = useMemo(() => {
    const rawList = data.filter(item => {
      const lider = String(item.LIDER || item.lider || '').trim().toUpperCase();
      return lider === liderNombre.trim().toUpperCase();
    });

    const seen = new Set();
    return rawList.filter(item => {
      const nombre = String(item.NOMBRE || '').trim().toUpperCase();
      const colonia = String(item.COLONIA || item.colonia || '').trim().toUpperCase();
      const key = `${nombre}_${colonia}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data, liderNombre]);

  // 2. Obtener las colonias donde opera este líder
  const coloniasLider = useMemo(() => {
    const cols = new Set(afiliadosLider.map(item => item.COLONIA || item.colonia).filter(Boolean));
    return Array.from(cols).join(', ') || 'No especificada';
  }, [afiliadosLider]);

  // 3. Detectar si este líder tiene verdaderos cruces con OTROS líderes
  const duplicadosLider = useMemo(() => {
    const globalNameCounts = {};
    data.forEach(item => {
      const nombre = String(item.NOMBRE || item.nombre || '').trim().toUpperCase();
      if (nombre) globalNameCounts[nombre] = (globalNameCounts[nombre] || 0) + 1;
    });

    return afiliadosLider.filter(item => {
      const nombre = String(item.NOMBRE || item.nombre || '').trim().toUpperCase();
      return globalNameCounts[nombre] > 1;
    });
  }, [data, afiliadosLider]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Modal */}
        <div className="bg-[#133b2e] text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-[#1b5240] p-2.5 rounded-xl border border-[#246b55]">
              <Award className="text-emerald-400" size={26} />
            </div>
            <div>
              <p className="text-xs text-emerald-300 font-medium uppercase tracking-wider">Ficha de Auditoría de Líder</p>
              <h2 className="text-xl font-bold tracking-wide">{liderNombre}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="bg-[#1b5240] hover:bg-[#2d7a61] text-white p-2 rounded-xl transition border border-[#2d7a61]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo con scroll */}
        <div className="p-6 space-y-6 overflow-y-auto bg-gray-50/50">
          
          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Afiliados Únicos</p>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{afiliadosLider.length}</h3>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
                <Users size={20} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Colonias / Zonas</p>
                <h3 className="text-sm font-bold text-gray-800 mt-1 truncate max-w-[200px]" title={coloniasLider}>
                  {coloniasLider}
                </h3>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <MapPin size={20} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Cruces con otros Líderes</p>
                <h3 className="text-xl font-bold text-amber-600 mt-1">{duplicadosLider.length}</h3>
              </div>
              <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
                <Copy size={20} />
              </div>
            </div>
          </div>

          {/* Tabla 1: Afiliados Depurados */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
              <Users size={16} className="text-emerald-600" />
              Padrón Depurado de Afiliados ({afiliadosLider.length})
            </h3>
            <div className="overflow-x-auto max-h-64 overflow-y-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 uppercase sticky top-0 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Nombre del Afiliado</th>
                    <th className="py-2.5 px-3">Teléfono</th>
                    <th className="py-2.5 px-3">Sección</th>
                    <th className="py-2.5 px-3">Colonia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {afiliadosLider.length > 0 ? (
                    afiliadosLider.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-gray-800">{item.NOMBRE}</td>
                        <td className="py-2 px-3 text-blue-600 font-medium">{item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || 'N/A'}</td>
                        <td className="py-2 px-3"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">Sec. {item.SECCION}</span></td>
                        <td className="py-2 px-3 font-medium text-gray-700">{item.COLONIA || item.colonia || 'S/N'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="py-4 text-center text-gray-400 text-xs">No hay afiliados registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla 2: Cruces con otros Líderes */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-200 bg-gradient-to-r from-amber-50/20 to-white">
            <h3 className="text-xs font-bold text-amber-900 uppercase mb-3 flex items-center gap-2">
              <Copy size={16} className="text-amber-600" />
              Afiliados con Cruce en otras Estructuras ({duplicadosLider.length})
            </h3>
            <div className="overflow-x-auto max-h-56 overflow-y-auto border border-amber-100 rounded-lg bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-amber-50 text-[11px] font-semibold text-amber-900 uppercase sticky top-0 border-b border-amber-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Nombre del Afiliado</th>
                    <th className="py-2.5 px-3">Teléfono</th>
                    <th className="py-2.5 px-3">Sección</th>
                    <th className="py-2.5 px-3">Colonia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-xs">
                  {duplicadosLider.length > 0 ? (
                    duplicadosLider.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/50 transition">
                        <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-gray-800">{item.NOMBRE}</td>
                        <td className="py-2 px-3 text-blue-600 font-medium">{item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || 'N/A'}</td>
                        <td className="py-2 px-3"><span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">Sec. {item.SECCION}</span></td>
                        <td className="py-2 px-3 font-semibold text-emerald-800">{item.COLONIA || item.colonia || 'S/N'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="py-4 text-center text-gray-400 text-xs">Este líder no presenta cruces con otras estructuras.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="bg-gray-100 px-6 py-4 flex justify-end shrink-0 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-5 py-2 rounded-xl transition shadow-sm"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
}