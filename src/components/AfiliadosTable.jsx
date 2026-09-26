import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AfiliadosTable({ data, searchTerm, setSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const pageSize = 15;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Depurar duplicados exactos (mismo nombre + mismo líder + misma colonia)
  const uniqueData = useMemo(() => {
    const seen = new Set();
    return data.filter(item => {
      const nombre = String(item.NOMBRE || '').trim().toUpperCase();
      const lider = String(item.LIDER || '').trim().toUpperCase();
      const colonia = String(item.COLONIA || item.colonia || '').trim().toUpperCase();
      
      const key = `${nombre}_${lider}_${colonia}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const filteredAfiliados = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return uniqueData;

    return uniqueData.filter(item => {
      const nombre = String(item.NOMBRE || '').toLowerCase();
      const telefono = String(item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || '').toLowerCase();
      const seccion = String(item.SECCION || '').toLowerCase();
      const lider = String(item.LIDER || '').toLowerCase();
      const colonia = String(item.COLONIA || item.colonia || '').toLowerCase();

      return nombre.includes(query) || telefono.includes(query) || seccion.includes(query) || lider.includes(query) || colonia.includes(query);
    });
  }, [uniqueData, debouncedSearch]);

  const totalPages = Math.ceil(filteredAfiliados.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAfiliados.slice(start, start + pageSize);
  }, [filteredAfiliados, currentPage, pageSize]);

  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,NOMBRE,TELEFONO,SECCION,COLONIA,LIDER\n";
    filteredAfiliados.forEach(item => {
      const tel = item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || '';
      const col = item.COLONIA || item.colonia || '';
      csvContent += `"${item.NOMBRE}","${tel}","${item.SECCION}","${col}","${item.LIDER}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "directorio_afiliados_depurado.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-emerald-600" />
            Directorio General de Afiliados (Depurado)
          </h3>
          <p className="text-xs text-gray-500">Mostrando registros únicos ({filteredAfiliados.length} encontrados)</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por Nombre, Tel, Sección..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg pl-9 pr-3 py-2 w-full focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={exportToExcel}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            Exportar a Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 uppercase border-b border-gray-200">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">Nombre del Afiliado</th>
              <th className="py-2.5 px-4">Teléfono</th>
              <th className="py-2.5 px-4">Sección</th>
              <th className="py-2.5 px-4">Colonia</th>
              <th className="py-2.5 px-4">Liderazgo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => {
                const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                const tel = item.NUMERO_DE_TEL || item['NUMERO DE TEL'] || 'NO CAPTURADO';
                const colonia = item.COLONIA || item.colonia || 'S/N';
                return (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-2.5 px-4 text-gray-400 font-medium">{globalIdx}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-800">{item.NOMBRE}</td>
                    <td className="py-2.5 px-4 text-blue-600 font-medium">{tel}</td>
                    <td className="py-2.5 px-4">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                        Sección {item.SECCION}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-gray-700">{colonia}</td>
                    <td className="py-2.5 px-4 text-gray-700 font-medium">{item.LIDER}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400 text-xs">
                  No se encontraron registros que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs text-gray-500">
          Página <span className="font-semibold text-gray-700">{currentPage}</span> de <span className="font-semibold text-gray-700">{totalPages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}