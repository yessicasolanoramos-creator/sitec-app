
import React, { useState } from 'react';
import { Plus, X, Search, Phone, Mail, Briefcase } from 'lucide-react';
import { AppState, Technician } from '../types';

interface TechniciansModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const TechniciansModule: React.FC<TechniciansModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTech, setNewTech] = useState<Partial<Technician>>({
    name: '',
    specialty: '',
    phone: '',
    email: ''
  });

  const handleSave = () => {
    if (!newTech.name) return;
    const technician: Technician = {
      ...newTech as Technician,
      id: `t${Date.now()}`
    };
    setData({ ...data, technicians: [technician, ...data.technicians] });
    setIsFormOpen(false);
    setNewTech({ name: '', specialty: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Técnicos de SITEC</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Añadir Técnico</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.technicians.map(tech => (
          <div key={tech.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                {tech.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{tech.name}</h4>
                <p className="text-xs text-orange-500 font-bold uppercase">{tech.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex items-center space-x-2"><Phone size={14} /> <span>{tech.phone}</span></p>
              <p className="flex items-center space-x-2"><Mail size={14} /> <span>{tech.email}</span></p>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">Nuevo Personal Técnico</h3>
              <button onClick={() => setIsFormOpen(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input 
                placeholder="Nombre Completo" 
                className="w-full p-3 border rounded-xl outline-none"
                onChange={e => setNewTech({...newTech, name: e.target.value})}
              />
              <input 
                placeholder="Especialidad (CCTV, Redes, etc.)" 
                className="w-full p-3 border rounded-xl outline-none"
                onChange={e => setNewTech({...newTech, specialty: e.target.value})}
              />
              <input 
                placeholder="Celular" 
                className="w-full p-3 border rounded-xl outline-none"
                onChange={e => setNewTech({...newTech, phone: e.target.value})}
              />
              <input 
                placeholder="Correo corporativo" 
                className="w-full p-3 border rounded-xl outline-none"
                onChange={e => setNewTech({...newTech, email: e.target.value})}
              />
            </div>
            <div className="p-6 border-t flex space-x-4">
              <button onClick={() => setIsFormOpen(false)} className="flex-1 font-bold">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniciansModule;
