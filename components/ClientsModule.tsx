
import React, { useState } from 'react';
import { Plus, Users, MapPin, Phone, Mail, X } from 'lucide-react';
import { AppState, Client } from '../types';

interface ClientsModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const ClientsModule: React.FC<ClientsModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({ name: '', nit: '', address: '', phone: '', email: '' });

  const handleSave = () => {
    if (!newClient.name || !newClient.nit) return;
    const client: Client = { 
      ...newClient as Client, 
      id: Date.now().toString(), 
      contactPerson: '' 
    };
    setData({ ...data, clients: [client, ...data.clients] });
    setIsFormOpen(false);
    setNewClient({ name: '', nit: '', address: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Base de Datos de Clientes</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors">
          <Plus size={20} /> <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.clients.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {c.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">{c.name}</h4>
                <p className="text-xs text-gray-400 font-medium">NIT: {c.nit}</p>
              </div>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm text-gray-600 flex items-center"><MapPin size={14} className="mr-2 text-slate-400"/> {c.address}</p>
              <p className="text-sm text-gray-600 flex items-center"><Phone size={14} className="mr-2 text-slate-400"/> {c.phone}</p>
              <p className="text-sm text-gray-600 flex items-center"><Mail size={14} className="mr-2 text-slate-400"/> {c.email}</p>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
            <h3 className="text-xl font-bold mb-4 flex items-center"><Users className="mr-2 text-orange-500" /> Registro de Cliente</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre o Razón Social</label>
                <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ej: Clínica Salud S.A." onChange={e => setNewClient({...newClient, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="000.000.000-0" onChange={e => setNewClient({...newClient, nit: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Física</label>
                <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Calle/Carrera #..." onChange={e => setNewClient({...newClient, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                  <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="300..." onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="correo@..." onChange={e => setNewClient({...newClient, email: e.target.value})} />
                </div>
              </div>
            </div>
            
            <button onClick={handleSave} className="w-full mt-6 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">Guardar Cliente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;
