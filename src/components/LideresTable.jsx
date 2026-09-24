import React, { useState, useMemo } from 'react';
import { Award, Search, Download } from 'lucide-react';

export default function LideresTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');

  const lideresConsolidados = useMemo(() => {
    const counts = {};
    data.forEach(item => {
      const lider = item.LIDER || item.lider || 'SIN LIDER';
      const cleanLider = String(lider).trim().toUpperCase();
      counts[cleanLider] = (counts[cleanLider] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([lider, cantidad]) => ({ lider, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [data]);

  const filteredLideres = useMemo(() => {
    return lideresConsolidados.filter(item => 
      item.lider.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lideresConsolidados, searchTerm]);

  const exportLideresToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,LIDER,TOTAL AFILIADOS / GESTIONES\n";
    lideresConsolidados.forEach(row => {
      csvContent += `"${row.lider}",${row.cantidad}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "resumen_lideres_afiliacion.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Award size={18} className="text-emerald-600" />
            Consolidado General de Estructura por Líder
          </h3>
          <p className="text-xs text-gray-500">Total de {lideresConsolidados.length} líderes evaluados en el padrón</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar líder..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg pl-9 pr-3 py-2 w-full focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={exportLideresToCSV}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            Exportar Resumen
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 uppercase sticky top-0 border-b border-gray-200">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">Nombre del Líder</th>
              <th className="py-2.5 px-4 text-right">Volumen Asignado / Capturado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredLideres.length > 0 ? (
              filteredLideres.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition">
                  <td className="py-2.5 px-4 text-gray-400 font-medium">{idx + 1}</td>
                  <td className="py-2.5 px-4 text-gray-800 font-medium">{item.lider}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-700">
                    {item.cantidad.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">registros</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-400 text-xs">
                  No se encontró ningún líder con ese nombre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}