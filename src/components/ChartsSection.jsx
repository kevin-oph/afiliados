import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function ChartsSection({ data }) {
  // Top 5 Líderes con mayor número de afiliados
  const lideresCount = {};
  data.forEach(item => {
    const lider = item.LIDER || 'SIN LIDER';
    lideresCount[lider] = (lideresCount[lider] || 0) + 1;
  });

  const topLideres = Object.entries(lideresCount)
    .map(([lider, count]) => ({ lider, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top 5 Secciones con mayor concentración
  const seccionesCount = {};
  data.forEach(item => {
    const seccion = String(item.SECCION || 'S/N');
    seccionesCount[seccion] = (seccionesCount[seccion] || 0) + 1;
  });

  const topSecciones = Object.entries(seccionesCount)
    .map(([name, value]) => ({ name: `Sección ${name}`, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Gráfica 1: Top 5 Líderes (Barras) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
          <span>Top 5 Líderes con Mayor Número de Afiliados</span>
          <span className="text-xs font-normal text-gray-400">Volumen de estructura</span>
        </h3>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topLideres} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis dataKey="lider" type="category" tick={{ fontSize: 10 }} width={100} stroke="#4b5563" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica 2: Top 5 Secciones (Dona) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center justify-between">
          <span>Top 5 Secciones con Mayor Concentración</span>
          <span className="text-xs font-normal text-gray-400">Distribución porcentual</span>
        </h3>
        
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topSecciones}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ percent }) => percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
              >
                {topSecciones.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px' }} />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                height={50} 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-[10px] text-gray-700 font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}