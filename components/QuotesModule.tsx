
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  X, 
  CheckCircle2, 
  MessageCircle,
  UserPlus,
  Info,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AppState, Quote, QuoteItem, Client } from '../types';
import { formatCurrency, generatePDF, shareWhatsApp, DEFAULT_QUOTE_OBSERVATIONS, DEFAULT_COMMERCIAL_CONDITIONS } from '../utils';

interface QuotesModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const QuotesModule: React.FC<QuotesModuleProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [observations, setObservations] = useState(DEFAULT_QUOTE_OBSERVATIONS);
  const [commercialConditions, setCommercialConditions] = useState(DEFAULT_COMMERCIAL_CONDITIONS);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, unitPrice: 0 });

  const handleAddItem = () => {
    if (!newItem.description || newItem.quantity <= 0) return;
    setItems([...items, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const calculateSubtotalItems = () => items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  const calculateTotal = () => calculateSubtotalItems() + Number(laborCost);
  const calculateIVA = (total: number) => total * 0.19;

  const handleSaveQuote = () => {
    if (!selectedClient || items.length === 0) {
      alert("Por favor seleccione un cliente y agregue equipos.");
      return;
    }

    const totalBeforeIVA = calculateTotal();
    const newQuote: Quote = {
      id: `2026-${data.quotes.length + 1}`,
      clientId: selectedClient,
      date: new Date().toISOString().split('T')[0],
      items,
      laborCost,
      total: totalBeforeIVA + calculateIVA(totalBeforeIVA),
      status: 'Sent',
      observations,
      commercialConditions
    };

    setData({ ...data, quotes: [newQuote, ...data.quotes] });
    setIsFormOpen(false);
    resetForm();
  };

  const updateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setData({
      ...data,
      quotes: data.quotes.map(q => q.id === id ? { ...q, status } : q)
    });
  };

  const resetForm = () => {
    setItems([]);
    setLaborCost(0);
    setSelectedClient('');
    setObservations(DEFAULT_QUOTE_OBSERVATIONS);
    setCommercialConditions(DEFAULT_COMMERCIAL_CONDITIONS);
  };

  const handleExport = (quote: Quote) => {
    const client = data.clients.find(c => c.id === quote.clientId);
    const content = `COTIZACIÓN: ${quote.id}\nFECHA: ${quote.date}\nCLIENTE: ${client?.name}\n------------------\nITEMS:\n${quote.items.map(i => `${i.description} x${i.quantity} - ${formatCurrency(i.unitPrice)}`).join('\n')}\nM.O.: ${formatCurrency(quote.laborCost)}\n------------------\nOBSERVACIONES:\n${quote.observations}\n------------------\nCONDICIONES COMERCIALES:\n${quote.commercialConditions}\n------------------\nTOTAL (INC. IVA): ${formatCurrency(quote.total)}`;
    generatePDF(`Cotización ${quote.id}`, content);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cotizaciones Formales</h2>
          <p className="text-gray-500 font-medium">Gestione el estado y trace sus servicios</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl"
        >
          <Plus size={20} />
          <span>Nueva Cotización</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">No.</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right">Total c/ IVA</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.quotes.length > 0 ? data.quotes.map((quote) => {
                const client = data.clients.find(c => c.id === quote.clientId);
                return (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-bold">{quote.id}</td>
                    <td className="px-6 py-5 font-semibold">{client?.name}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase 
                        ${quote.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          quote.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-black">{formatCurrency(quote.total)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center space-x-1">
                        <button onClick={() => handleExport(quote)} className="p-2 text-slate-900 hover:bg-gray-100 rounded-lg"><Download size={18} /></button>
                        {quote.status === 'Sent' && (
                          <>
                            <button onClick={() => updateStatus(quote.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Aprobar"><CheckCircle size={18} /></button>
                            <button onClick={() => updateStatus(quote.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rechazar"><XCircle size={18} /></button>
                          </>
                        )}
                        <button onClick={() => shareWhatsApp(`SITEC: Cotización ${quote.id} por ${formatCurrency(quote.total)}`)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><MessageCircle size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400 italic">No hay cotizaciones</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-8 border-b flex items-center justify-between">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Nueva Cotización SITEC</h3>
              <button onClick={() => setIsFormOpen(false)}><X size={32} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase">Cliente</label>
                    <select 
                      value={selectedClient} 
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full border-2 rounded-2xl p-4 bg-gray-50 outline-none"
                    >
                      <option value="">-- Seleccionar --</option>
                      {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase">Observaciones Técnicas</label>
                    <textarea 
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      className="w-full border-2 rounded-2xl p-4 bg-gray-50 h-32 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase">Condiciones Comerciales</label>
                    <textarea 
                      value={commercialConditions}
                      onChange={(e) => setCommercialConditions(e.target.value)}
                      className="w-full border-2 rounded-2xl p-4 bg-gray-50 h-32 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black uppercase text-sm">Cargar Items</h4>
                  <div className="bg-slate-900 p-4 rounded-3xl space-y-3">
                    <input 
                      placeholder="Equipo/Suministro"
                      className="w-full bg-transparent text-white border-b border-slate-700 p-2 outline-none"
                      value={newItem.description}
                      onChange={e => setNewItem({...newItem, description: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Cant." className="bg-transparent text-white border-b border-slate-700 p-2" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})}/>
                      <input type="number" placeholder="Unitario" className="bg-transparent text-white border-b border-slate-700 p-2" value={newItem.unitPrice} onChange={e => setNewItem({...newItem, unitPrice: Number(e.target.value)})}/>
                    </div>
                    <button onClick={handleAddItem} className="w-full bg-orange-500 text-white p-2 rounded-xl font-bold">Añadir Item</button>
                  </div>
                  <div className="border rounded-2xl max-h-40 overflow-auto">
                     <table className="w-full text-xs">
                       <tbody className="divide-y">
                         {items.map(i => (
                           <tr key={i.id}><td className="p-2">{i.description}</td><td className="p-2 text-right">x{i.quantity}</td><td className="p-2 text-right">{formatCurrency(i.unitPrice * i.quantity)}</td></tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Total con IVA</p>
                <p className="text-3xl font-black">{formatCurrency(calculateTotal() * 1.19)}</p>
              </div>
              <div className="flex space-x-4">
                <input type="number" placeholder="Valor M.O." className="p-3 rounded-xl border w-32" value={laborCost} onChange={e => setLaborCost(Number(e.target.value))}/>
                <button onClick={handleSaveQuote} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold">Guardar Cotización</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesModule;
