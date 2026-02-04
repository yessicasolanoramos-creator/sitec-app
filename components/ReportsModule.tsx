
import React, { useState } from 'react';
import { Plus, Save, FileText, CheckCircle } from 'lucide-react';
import { AppState, ExecutionReport } from '../types';
import { generatePDF } from '../utils';

interface ReportsModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activities, setActivities] = useState('');
  const [selectedVisit, setSelectedVisit] = useState('');

  const handleSave = () => {
    if (!selectedVisit || !activities) return;
    const visit = data.visits.find(v => v.id === selectedVisit);
    const report: ExecutionReport = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      visitId: selectedVisit,
      clientId: visit?.clientId || '',
      date: new Date().toISOString().split('T')[0],
      activities,
      equipmentIntervened: '',
      observations: '',
      warrantyMonths: 12
    };
    setData({ ...data, reports: [report, ...data.reports] });
    setIsFormOpen(false);
    setActivities('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reportes de Trabajo</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors">
          <Plus size={20} /> <span>Nuevo Reporte</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.reports.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 italic">No hay reportes de ejecución</div>
        ) : data.reports.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
            <div>
              <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                <CheckCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Trabajo Ejecutado</span>
              </div>
              <h4 className="font-bold text-lg">{data.clients.find(c => c.id === r.clientId)?.name}</h4>
              <p className="text-sm text-gray-500 line-clamp-3 mt-2 leading-relaxed">{r.activities}</p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="text-xs text-gray-400 font-medium">{r.date}</span>
              <button onClick={() => generatePDF(`REPORTE DE SERVICIO ${r.id}`, `CLIENTE: ${data.clients.find(c => c.id === r.clientId)?.name}\nFECHA: ${r.date}\n\nACTIVIDADES REALIZADAS:\n${r.activities}`)} className="text-emerald-600 font-bold text-sm flex items-center hover:underline">
                <FileText size={14} className="mr-1"/> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold">Finalizar Trabajo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vincular Visita</label>
              <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={e => setSelectedVisit(e.target.value)}>
                <option value="">Seleccionar Visita Programada</option>
                {data.visits.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.date} - {data.clients.find(c => c.id === v.clientId)?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actividades Realizadas</label>
              <textarea className="w-full border border-gray-300 p-3 rounded-xl h-40 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Describa detalladamente el soporte o instalación realizada..." value={activities} onChange={e => setActivities(e.target.value)} />
            </div>
            <div className="border-2 border-dashed border-gray-200 h-32 rounded-xl flex flex-col items-center justify-center text-gray-400">
               <span className="text-xs uppercase font-bold tracking-widest">Firma Digital del Cliente</span>
               <span className="text-[10px] mt-1">(Área táctil para firma)</span>
            </div>
            <div className="flex space-x-3">
               <button onClick={() => setIsFormOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200">Cancelar</button>
               <button onClick={handleSave} className="flex-2 bg-emerald-600 text-white py-3 px-8 rounded-xl font-bold hover:bg-emerald-700 flex justify-center items-center">
                 <Save size={18} className="mr-2"/> Guardar Reporte
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
