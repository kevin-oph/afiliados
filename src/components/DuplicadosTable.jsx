import React, { useState, useMemo } from 'react';
import { Copy, Search, Download, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export default function DuplicadosTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filtrar exclusivamente los VERDADEROS cruces de estructura (diferente líder o diferente colonia)
  const duplicadosData = useMemo(() => {
    // 1. Agrupar registros por el nombre del afiliado
    const afiliadoMap = {};
    data.forEach(item => {
      const nombre = String(item.NOMBRE || item.nombre || '').trim().toUpperCase();
      if (!nombre || nombre === 'NAN' || nombre === '') return;

      if (!afiliadoMap[nombre]) {
        afiliadoMap[nombre] = [];
      }
      afiliadoMap[nombre].push(item);
    });

    // 2. Filtrar únicamente aquellos nombres que tengan registros donde CAMBIE el líder o la colonia
    const crucesRealesList = [];
    
    Object.entries(afiliadoMap).forEach(([nombre, registros]) => {
      if (registros.length > 1) {
        // Verificamos si hay más de un líder distinto o más de una colonia distinta
        const lideresUnicos = new Set(registros.map(r => String(r.LIDER || r.lider || '').trim().toUpperCase()));
        const coloniasUnicas = new Set(registros.map(r => String(r.COLONIA || r.colonia || '').trim().toUpperCase()));

        // Si el líder cambia, o la colonia cambia, es un cruce o duplicado sospechoso que vale la pena auditar
        // (Si es exactamente el mismo líder y la misma colonia, se considera captura doble y se omite del reporte de cruces)
        const esCruceReal = lideresUnicos.size > 1 || coloniasUnicas.size > 1;

        if (esCruceReal) {
          registros.forEach(reg => {
            crucesRealesList.push({
              ...reg,
              esConflictoLider: lideresUnicos.size > 1 // Bandera si está con otro líder diferente
            });
          });
        }
      }
    });

    return crucesRealesList.sort((a, b) => {
      const nomA = String(a.NOMBRE || '').trim();
      const nomB = String(b.NOMBRE || '').trim();
      return nomA.localeCompare(nomB);
    });
  }, [data]);

  // Filtrado por barra de búsqueda local
  const filteredDuplicados = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return duplicadosData;

    return duplicadosData.filter(item => {
      const nombre = String(item.NOMBRE || '').toLowerCase();
      const telefono = String(item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || '').toLowerCase();
      const lider = String(item.LIDER || '').toLowerCase();
      const seccion = String(item.SECCION || '').toLowerCase();
      const colonia = String(item.COLONIA || item.colonia || '').toLowerCase();

      return nombre.includes(query) || telefono.includes(query) || lider.includes(query) || seccion.includes(query) || colonia.includes(query);
    });
  }, [duplicadosData, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filteredDuplicados.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDuplicados.slice(start, start + pageSize);
  }, [filteredDuplicados, currentPage, pageSize]);

  // Exportar a Excel / CSV
  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,NOMBRE,TELEFONO,SECCION,COLONIA,LIDER,TIPO_CRUCE\n";
    filteredDuplicados.forEach(item => {
      const tel = item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || '';
      const col = item.COLONIA || item.colonia || '';
      const tipo = item.esConflictoLider ? "CRUCE DE LIDERES" : "MISMO LIDER / DIFERENTE COLONIA";
      csvContent += `"${item.NOMBRE}","${tel}","${item.SECCION}","${col}","${item.LIDER}","${tipo}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cruces_estructuras_auditoria.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-200 mt-6 bg-gradient-to-r from-amber-50/30 to-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <Copy size={18} className="text-amber-600" />
            Auditoría de Cruce de Estructuras (Diferente Líder o Colonia)
          </h3>
          <p className="text-xs text-amber-700/80">
            Se excluyeron capturas dobles idénticas del mismo líder. Mostrando {filteredDuplicados.length} cruces detectados.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar afiliado, colonia, líder..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-amber-300 text-gray-800 text-xs rounded-lg pl-9 pr-3 py-2 w-full focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <button 
            onClick={exportToExcel}
            className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            Exportar Cruces
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-amber-100 rounded-lg bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-amber-50 text-[11px] font-semibold text-amber-900 uppercase border-b border-amber-200">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">Nombre del Afiliado</th>
              <th className="py-2.5 px-4">Teléfono</th>
              <th className="py-2.5 px-4">Sección</th>
              <th className="py-2.5 px-4">Colonia / Ubicación</th>
              <th className="py-2.5 px-4">Liderazgo Asignado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 text-xs">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => {
                const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                const tel = item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || 'NO CAPTURADO';
                const colonia = item.COLONIA || item.colonia || 'S/N';
                
                // Si el afiliado está registrado con OTRO líder diferente, resaltamos la fila con un color rojo/rosa suave de alerta
                const esConflicto = item.esConflictoLider;

                return (
                  <tr 
                    key={idx} 
                    className={`transition ${
                      esConflicto 
                        ? 'bg-rose-50/80 hover:bg-rose-100/75 border-l-4 border-rose-500' 
                        : 'hover:bg-amber-50/50'
                    }`}
                  >
                    <td className="py-2.5 px-4 text-gray-400 font-medium">{globalIdx}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                      {item.NOMBRE}
                      {esConflicto && (
                        <span title="¡Conflicto! Registrado con diferentes líderes" className="inline-flex items-center text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded text-[10px] font-bold gap-0.5">
                          <AlertTriangle size={12} /> Cruce de Líder
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-blue-600 font-medium">{tel}</td>
                    <td className="py-2.5 px-4">
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[11px] border border-amber-300">
                        Sección {item.SECCION}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-emerald-800">{colonia}</td>
                    <td className={`py-2.5 px-4 font-bold ${esConflicto ? 'text-rose-700' : 'text-purple-700'}`}>
                      {item.LIDER}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400 text-xs">
                  No se encontraron cruces de estructuras con ese criterio de búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs text-amber-900">
          Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-amber-200 hover:bg-amber-50 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            <ChevronLeft size= {14} /> Anterior
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white border border-amber-200 hover:bg-amber-50 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}