import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-[#133b2e] text-white shadow-lg mb-6 border-b border-[#1b5240]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1b5240] p-2 rounded-lg border border-[#246b55]">
            <Users className="text-emerald-400" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Municipio de Emiliano Zapata</h1>
            <p className="text-xs text-emerald-200/80">Dashboard de Gestión y Afiliaciones Políticas</p>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2 bg-[#1b5240]/80 px-3 py-1.5 rounded-full border border-[#246b55] text-xs">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Sistema de Control y Enlace Territorial</span>
        </div>
      </div>
    </header>
  );
}