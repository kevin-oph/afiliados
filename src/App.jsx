import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import AfiliadosTable from './components/AfiliadosTable';
import LideresTable from './components/LideresTable';
import DuplicadosTable from './components/DuplicadosTable';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLider, setSelectedLider] = useState('TODOS');
  const [selectedSeccion, setSelectedSeccion] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/datos_afiliaciones.json')
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando los datos:', err);
        setLoading(false);
      });
  }, []);

  const lideres = useMemo(() => {
    const setL = new Set(data.map(item => item.LIDER).filter(Boolean));
    return ['TODOS', ...Array.from(setL)].sort();
  }, [data]);

  const secciones = useMemo(() => {
    let filtered = data;
    if (selectedLider !== 'TODOS') {
      filtered = data.filter(item => item.LIDER === selectedLider);
    }
    const setS = new Set(filtered.map(item => String(item.SECCION)).filter(Boolean));
    return ['TODAS', ...Array.from(setS)].sort((a, b) => Number(a) - Number(b));
  }, [data, selectedLider]);

  const globalFilteredData = useMemo(() => {
    return data.filter(item => {
      const matchLider = selectedLider === 'TODOS' || item.LIDER === selectedLider;
      const matchSeccion = selectedSeccion === 'TODAS' || String(item.SECCION) === String(selectedSeccion);
      return matchLider && matchSeccion;
    });
  }, [data, selectedLider, selectedSeccion]);

  const totalAfiliaciones = globalFilteredData.length;
  
  const totalLideres = useMemo(() => {
    const lideresSet = new Set(globalFilteredData.map(item => item.LIDER).filter(Boolean));
    return lideresSet.size;
  }, [globalFilteredData]);

  const totalSecciones = useMemo(() => {
    const seccionesSet = new Set(globalFilteredData.map(item => item.SECCION).filter(Boolean));
    return seccionesSet.size;
  }, [globalFilteredData]);

  const promedioPorLider = useMemo(() => {
    if (totalLideres === 0) return 0;
    return (totalAfiliaciones / totalLideres).toFixed(1);
  }, [totalAfiliaciones, totalLideres]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando inteligencia de afiliaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 space-y-6">
        
        <KPICards 
          totalAfiliaciones={totalAfiliaciones}
          totalLideres={totalLideres}
          totalSecciones={totalSecciones}
          promedioPorLider={promedioPorLider}
        />

        <ChartsSection data={globalFilteredData} />

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Filtro Operativo por Líder y Sección
            </h2>
            <p className="text-xs text-gray-500">Segmenta la estructura territorial de afiliación</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-gray-600 mb-1">Líder:</label>
              <select 
                value={selectedLider} 
                onChange={(e) => { setSelectedLider(e.target.value); setSelectedSeccion('TODAS'); }}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {lideres.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-gray-600 mb-1">Sección:</label>
              <select 
                value={selectedSeccion} 
                onChange={(e) => setSelectedSeccion(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {secciones.map(s => <option key={s} value={s}>Sección {s}</option>)}
              </select>
            </div>

            <button 
              onClick={() => { setSelectedLider('TODOS'); setSelectedSeccion('TODAS'); setSearchTerm(''); }}
              className="mt-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
            >
              Ver Todo
            </button>
          </div>
        </div>

        {/* Directorio General de Afiliados */}
        <AfiliadosTable data={globalFilteredData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Módulo Especial de Afiliados Duplicados / Cruce de Estructura y Colonias */}
        <DuplicadosTable data={data} />

        {/* Consolidado General por Líder (Estándar informativo) */}
        <LideresTable data={globalFilteredData} />

      </main>
    </div>
  );
}