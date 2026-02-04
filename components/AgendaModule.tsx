
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Check
} from 'lucide-react';
import { AppState, Visit, VisitStatus } from '../types';

interface AgendaModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const AgendaModule: React.FC<AgendaModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newVisit, setNewVisit] = useState<Partial<Visit>>({
    clientId: '',
    technicianId: 'tech-01',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    description: '',
    status: VisitStatus.PENDING,
    address: ''
  });

  const handleSaveVisit = () => {
    if (!newVisit.clientId || !newVisit.description) return;
    const visit: Visit = {
      ...newVisit as Visit,
      id: `VIS-${Date.now().toString().slice(-6)}`
    };
    setData({ ...data, visits: [visit, ...data.visits] });
    setIsFormOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: VisitStatus) => {
    setData({
      ...data,
      visits: data.visits.map(v => v.id === id ? { ...v, status: newStatus } : v)
    });
  };

  const getStatusColor = (status: VisitStatus) => {
    switch(status) {
      case VisitStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case VisitStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case VisitStatus.IN_PROGRESS: return 'bg-orange-100 text-orange-700';
      case VisitStatus.COMPLETED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agenda de Visitas</h2>
          <p className="text-gray-500">Programación técnica y seguimiento de servicios</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Programar Visita</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Simplified List for current day / upcoming */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 text-gray-500 font-semibold mb-2">
            <CalendarIcon size={18} />
            <span>Próximos 7 días</span>
          </div>
          
          <div className="space-y-4">
            {data.visits.length > 0 ? data.visits.map((visit) => {
              const client = data.clients.find(c => c.id === visit.clientId);
              return (
                <div key={visit.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-gray-500 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                        <span className="text-xs font-bold uppercase">{visit.date.split('-')[1]}</span>
                        <span className="text-xl font-bold leading-tight">{visit.date.split('-')[2]}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-gray-900 text-lg">{client?.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium">{visit.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1"><Clock size={14} /> <span>{visit.time}</span></span>
                          <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{client?.address || visit.address}</span></span>
                          <span className="flex items-center space-x-1"><User size={14} /> <span>Téc: {visit.technicianId}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:self-start">
                      {visit.status === VisitStatus.PENDING && (
                        <button 
                          onClick={() => handleStatusChange(visit.id, VisitStatus.CONFIRMED)}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 flex items-center space-x-1"
                        >
                          <Check size={14} /> <span>Confirmar</span>
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 text-gray-400">
                <CalendarIcon className="mx-auto mb-4 opacity-20" size={48} />
                <p>No hay visitas programadas para el periodo seleccionado</p>
              </div>
            )}
          </div>
        </div>

        {/* Mini Calendar / Side Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Mayo 2024</h3>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 uppercase mb-2">
              <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }).map((_, i) => (
                <button 
                  key={i} 
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                    ${i + 1 === 20 ? 'bg-orange-500 text-white font-bold' : 'hover:bg-gray-50 text-gray-600'}
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-100">
            <h3 className="font-bold text-lg mb-2">Consejo Técnico</h3>
            <p className="text-orange-100 text-sm leading-relaxed">
              Recuerda siempre verificar el estado de la conexión a internet antes de finalizar una instalación de cámaras WiFi.
            </p>
          </div>
        </div>
      </div>

      {/* New Visit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Programar Nueva Visita</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Cliente</label>
                <select 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none"
                  onChange={(e) => setNewVisit({...newVisit, clientId: e.target.value})}
                >
                  <option value="">-- Seleccionar --</option>
                  {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Fecha</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none" 
                    onChange={(e) => setNewVisit({...newVisit, date: e.target.value})}
                    value={newVisit.date}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Hora</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none"
                    onChange={(e) => setNewVisit({...newVisit, time: e.target.value})}
                    value={newVisit.time}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Descripción del Trabajo</label>
                <textarea 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none h-24 resize-none"
                  placeholder="Ej: Mantenimiento preventivo anual CCTV"
                  onChange={(e) => setNewVisit({...newVisit, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Técnico Asignado</label>
                <select className="w-full border border-gray-200 rounded-xl p-3 outline-none">
                  <option value="tech-01">Juan Pérez (CCTV)</option>
                  <option value="tech-02">Andrés Gómez (Redes)</option>
                  <option value="tech-03">Ricardo Díaz (Acceso)</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center space-x-3">
               <button onClick={() => setIsFormOpen(false)} className="flex-1 py-3 text-gray-600 font-bold">Cancelar</button>
               <button onClick={handleSaveVisit} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg">Agendar Visita</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaModule;
