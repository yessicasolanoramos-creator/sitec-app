
import React from 'react';
import { 
  Bell, 
  Calendar, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  History,
  Mail,
  MessageCircle,
  Plus
} from 'lucide-react';
import { AppState, MaintenanceAlert } from '../types';
import { shareWhatsApp } from '../utils';

interface MaintenanceModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ data, setData }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-600';
      case 'Overdue': return 'bg-red-100 text-red-600';
      case 'Done': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleNotify = (alert: MaintenanceAlert) => {
    const client = data.clients.find(c => c.id === alert.clientId);
    const message = `SITEC SAS - Recordatorio: El mantenimiento preventivo de su sistema ${alert.systemType} está programado para el ${alert.nextMaintenanceDate}. Por favor confirme su disponibilidad.`;
    shareWhatsApp(message);
  };

  const handleComplete = (id: string) => {
    setData({
      ...data,
      maintenance: data.maintenance.map(m => {
        if (m.id === id) {
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 6);
          return {
            ...m,
            lastMaintenanceDate: new Date().toISOString().split('T')[0],
            nextMaintenanceDate: nextDate.toISOString().split('T')[0],
            status: 'Upcoming' as any
          };
        }
        return m;
      })
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mantenimiento Preventivo</h2>
          <p className="text-gray-500">Programación automática cada 6 meses para CCTV y seguridad</p>
        </div>
        <button className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={20} />
          <span>Registrar Sistema</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 mb-4">Filtrar por Estado</h3>
            {['Todos', 'Vencidos', 'Próximos', 'Completados'].map((f) => (
              <button key={f} className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-gray-600 font-medium group-hover:text-orange-500">{f}</span>
                <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded">12</span>
              </button>
            ))}
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Bell size={20} className="animate-bounce" />
              <h3 className="font-bold">Mantenimiento Programado</h3>
            </div>
            <p className="text-blue-100 text-xs">
              El sistema genera alertas automáticas 15 días antes del vencimiento (6 meses desde la última intervención).
            </p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-3 space-y-4">
          {data.maintenance.length > 0 ? data.maintenance.map((alert) => {
            const client = data.clients.find(c => c.id === alert.clientId);
            return (
              <div key={alert.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-blue-200 transition-all">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl ${alert.status === 'Overdue' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      <Settings size={28} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{client?.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(alert.status)}`}>
                          {alert.status === 'Upcoming' ? 'Próximo' : alert.status === 'Overdue' ? 'Vencido' : 'Al Día'}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium mb-2">{alert.systemType}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1"><History size={14} /> <span>Último: {alert.lastMaintenanceDate}</span></span>
                        <span className="flex items-center space-x-1 font-bold text-blue-500"><Calendar size={14} /> <span>Próximo: {alert.nextMaintenanceDate}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleNotify(alert)}
                      className="flex-1 sm:flex-none p-3 bg-gray-50 text-green-600 rounded-xl hover:bg-green-50 transition-colors border border-gray-100" 
                      title="Notificar por WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </button>
                    <button 
                      onClick={() => handleComplete(alert.id)}
                      className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-md flex items-center space-x-2"
                    >
                      <CheckCircle size={18} />
                      <span>Completar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="bg-white p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl italic">
               No hay sistemas registrados para mantenimiento preventivo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModule;
