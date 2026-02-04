
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  AlertTriangle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { AppState, VisitStatus } from '../types';
import { formatCurrency } from '../utils';

interface DashboardProps {
  data: AppState;
  setActiveTab: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, setActiveTab }) => {
  const pendingVisits = data.visits.filter(v => v.status === VisitStatus.PENDING).length;
  const maintenanceAlerts = data.maintenance.filter(m => m.status === 'Upcoming' || m.status === 'Overdue').length;
  const activeQuotes = data.quotes.filter(q => q.status === 'Sent' || q.status === 'Draft').length;

  const stats = [
    { label: 'Clientes Registrados', value: data.clients.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Visitas Pendientes', value: pendingVisits, icon: CalendarIcon, color: 'bg-orange-500' },
    { label: 'Alertas Mantenimiento', value: maintenanceAlerts, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Cotizaciones Activas', value: activeQuotes, icon: FileText, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actualizado</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Visits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-lg">Próximas Visitas</h3>
            <button 
              onClick={() => setActiveTab('agenda')}
              className="text-orange-500 text-sm font-semibold flex items-center hover:underline"
            >
              Ver agenda <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {data.visits.length > 0 ? (
              data.visits.slice(0, 5).map((visit) => {
                const client = data.clients.find(c => c.id === visit.clientId);
                return (
                  <div key={visit.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-50 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-orange-600">
                        <span className="text-[10px] font-bold uppercase leading-none">{visit.date.split('-')[1]}</span>
                        <span className="text-lg font-bold leading-none">{visit.date.split('-')[2]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{client?.name}</p>
                        <p className="text-sm text-gray-500 truncate w-48 lg:w-64">{visit.description}</p>
                      </div>
                    </div>
                    <span className="hidden sm:inline px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {visit.time}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="p-6 text-center text-gray-400 italic">No hay visitas programadas</p>
            )}
          </div>
        </div>

        {/* Maintenance Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-lg">Alertas de Mantenimiento</h3>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className="text-red-500 text-sm font-semibold flex items-center hover:underline"
            >
              Ver todas <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {data.maintenance.length > 0 ? (
              data.maintenance.filter(m => m.status !== 'Done').slice(0, 5).map((alert) => {
                const client = data.clients.find(c => c.id === alert.clientId);
                return (
                  <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-50 w-10 h-10 rounded-full flex items-center justify-center text-red-600">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{client?.name}</p>
                        <p className="text-sm text-gray-500">{alert.systemType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">Vence en</p>
                      <p className="text-sm text-gray-800 font-medium">{alert.nextMaintenanceDate}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-6 text-center text-gray-400 italic">Todo al día</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
