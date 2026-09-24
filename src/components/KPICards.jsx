import React from 'react';
import { Users, UserCheck, MapPin, Award } from 'lucide-react';

export default function KPICards({ totalAfiliaciones, totalLideres, totalSecciones, promedioPorLider }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Tarjeta 1: Total Afiliaciones */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Total Afiliaciones</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalAfiliaciones.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Registros consolidados</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
          <Users size={22} />
        </div>
      </div>

      {/* Tarjeta 2: Líderes Únicos */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Líderes Activos</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalLideres.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Estructura territorial</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
          <UserCheck size={22} />
        </div>
      </div>

      {/* Tarjeta 3: Secciones Atendidas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Secciones Atendidas</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalSecciones.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Zonas geográficas</p>
        </div>
        <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
          <MapPin size={22} />
        </div>
      </div>

      {/* Tarjeta 4: Promedio por Líder */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Promedio / Líder</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{promedioPorLider}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Afiliados por estructura</p>
        </div>
        <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
          <Award size={22} />
        </div>
      </div>

    </div>
  );
}