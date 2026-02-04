
import React, { useState, useRef } from 'react';
import { 
  ClipboardCheck, 
  PenTool, 
  Plus, 
  Save, 
  Trash2, 
  Download,
  AlertCircle,
  Camera,
  X,
  FileSearch
} from 'lucide-react';
import { AppState, ExecutionReport, Visit } from '../types';
import { generatePDF } from '../utils';

interface ReportsModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [report, setReport] = useState<Partial<ExecutionReport>>({
    visitId: '',
    quoteId: '',
    activities: '',
    equipmentIntervened: '',
    observations: '',
    warrantyMonths: 12,
  });
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.beginPath();
      setSignature(null);
    }
  };

  const handleSaveReport = () => {
    if (!report.visitId || !report.activities) {
        alert("Faltan datos requeridos (Visita y Actividades)");
        return;
    }
    const visit = data.visits.find(v => v.id === report.visitId);
    const newReport: ExecutionReport = {
      ...report as ExecutionReport,
      id: `REP-${Date.now().toString().slice(-6)}`,
      clientId: visit?.clientId || '',
      date: new Date().toISOString().split('T')[0],
      clientSignature: signature || undefined
    };

    setData({ ...data, reports: [newReport, ...data.reports] });
    setIsFormOpen(false);
    setReport({ visitId: '', quoteId: '', activities: '', equipmentIntervened: '', observations: '', warrantyMonths: 12 });
    setSignature(null);
  };

  const handleExportReport = (r: ExecutionReport) => {
    const client = data.clients.find(c => c.id === r.clientId);
    const quote = data.quotes.find(q => q.id === r.quoteId);
    const content = `REPORTE TÉCNICO SITEC\n------------------\nID: ${r.id}\nFECHA: ${r.date}\nCLIENTE: ${client?.name}\nCOTIZACIÓN ASOCIADA: ${r.quoteId || 'N/A'}\n------------------\nACTIVIDADES:\n${r.activities}\n------------------\nEQUIPOS INTERVENIDOS:\n${r.equipmentIntervened}\n------------------\nOBSERVACIONES:\n${r.observations}\n------------------\nGARANTÍA: ${r.warrantyMonths} meses`;
    generatePDF(`Reporte de Servicio ${r.id}`, content);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reportes de Ejecución</h2>
          <p className="text-gray-500 font-medium">Historial con trazabilidad de cotizaciones aprobadas</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg"
        >
          <Plus size={20} />
          <span>Nuevo Reporte</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.reports.map((r) => {
          const client = data.clients.find(c => c.id === r.clientId);
          return (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <ClipboardCheck size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded uppercase block">{r.id}</span>
                  {r.quoteId && <span className="text-[9px] font-bold text-orange-500 uppercase mt-1 block">Ref: {r.quoteId}</span>}
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{client?.name}</h4>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{r.activities}</p>
              <div className="mt-auto pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">{r.date}</span>
                <button onClick={() => handleExportReport(r)} className="text-emerald-600 font-bold text-sm">Descargar</button>
              </div>
            </div>
          ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase tracking-tighter">Finalizar Servicio</h3>
              <button onClick={() => setIsFormOpen(false)}><X size={24} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Seleccionar Visita</label>
                  <select 
                    className="w-full border rounded-xl p-3 bg-gray-50 outline-none"
                    onChange={(e) => setReport({...report, visitId: e.target.value})}
                  >
                    <option value="">-- Seleccionar Visita --</option>
                    {data.visits.map(v => (
                      <option key={v.id} value={v.id}>{v.date} - {data.clients.find(c => c.id === v.clientId)?.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Vincular Cotización Aprobada</label>
                  <select 
                    className="w-full border rounded-xl p-3 bg-gray-50 outline-none"
                    onChange={(e) => setReport({...report, quoteId: e.target.value})}
                  >
                    <option value="">-- Ninguna --</option>
                    {data.quotes.filter(q => q.status === 'Approved').map(q => (
                      <option key={q.id} value={q.id}>{q.id} - {data.clients.find(c => c.id === q.clientId)?.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Actividades Realizadas</label>
                <textarea 
                  className="w-full border rounded-xl p-3 h-24 text-sm"
                  placeholder="Detalle los trabajos..."
                  onChange={(e) => setReport({...report, activities: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Equipos Intervenidos</label>
                <input 
                  className="w-full border rounded-xl p-3 text-sm"
                  placeholder="Cámaras, Sensores, etc."
                  onChange={(e) => setReport({...report, equipmentIntervened: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Firma del Cliente</label>
                <div className="border-2 border-dashed rounded-2xl bg-gray-50 h-32 relative overflow-hidden">
                   <canvas 
                    ref={canvasRef}
                    className="w-full h-full touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                    width={600}
                    height={128}
                  />
                </div>
                <button onClick={clearSignature} className="text-xs text-red-500 font-bold mt-1">Limpiar Firma</button>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t">
              <button 
                onClick={handleSaveReport}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>Registrar Reporte y Trazabilidad</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
