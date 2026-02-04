
import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, X, Save } from 'lucide-react';
import { AppState, Client } from '../types';

interface ClientsModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const ClientsModule: React.FC<ClientsModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    nit: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: ''
  });

  const handleSaveClient = () => {
    if (!newClient.name || !newClient.nit) {
      alert("Nombre y NIT son obligatorios.");
      return;
    }
    const client: Client = {
      ...newClient as Client,
      id: Date.now().toString()
    };
    setData({ ...data, clients: [client, ...data.clients] });
    setIsFormOpen(false);
    setNewClient({ name: '', nit: '', address: '', phone: '', email: '', contactPerson: '' });
  };

  const filteredClients = data.clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nit.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
          <p className="text-gray-500">Base de datos de empresas y sectores atendidos</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg transition-all"
        >
          <Plus size={20} />
          <span>Añadir Cliente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o NIT..."
          className="flex-1 outline-none text-gray-700 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all flex flex-col group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {client.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">{client.name}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">NIT: {client.nit}</p>
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin size={16} /> <span className="truncate">{client.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Phone size={16} /> <span>{client.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Mail size={16} /> <span className="truncate">{client.email}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50">
               <p className="text-xs font-bold text-gray-400 uppercase mb-1">Contacto Principal</p>
               <p className="text-sm font-semibold text-gray-800">{client.contactPerson || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Registrar Nuevo Cliente</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nombre / Razón Social</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
                    placeholder="Ej: SITEC S.A.S."
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">NIT</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none" 
                    placeholder="900.123.456-1"
                    onChange={(e) => setNewClient({...newClient, nit: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Dirección</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none" 
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Celular</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none" 
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Correo</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none" 
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Persona de Contacto</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none" 
                  onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center space-x-4">
              <button onClick={() => setIsFormOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:underline">Cancelar</button>
              <button 
                onClick={handleSaveClient}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-100"
              >
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;
