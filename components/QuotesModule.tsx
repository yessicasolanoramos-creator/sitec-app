
import React, { useState } from 'react';
import { Plus, X, Download, MessageCircle } from 'lucide-react';
import { AppState, Quote, QuoteItem } from '../types';
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
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, unitPrice: 0 });

  const handleAddItem = () => {
    if (!newItem.description) return;
    setItems([...items, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const handleSaveQuote = () => {
    if (!selectedClient) return;
    const subtotal = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0) + laborCost;
    const newQuote: Quote = {
      id: `COT-${data.quotes.length + 101}`,
      clientId: selectedClient,
      date: new Date().toISOString().split('T')[0],
      items,
      laborCost,
      total: subtotal * 1.19,
      status: 'Sent',
      observations: DEFAULT_QUOTE_OBSERVATIONS,
      commercialConditions: DEFAULT_COMMERCIAL_CONDITIONS
    };
    setData({ ...data, quotes: [newQuote, ...data.quotes] });
    setIsFormOpen(false);
    setItems([]);
    setLaborCost(0);
  };

  const createQuoteText = (q: Quote) => {
    const client = data.clients.find(c => c.id === q.clientId);
    return `SITEC - Cotización ${q.id}\nCliente: ${client?.name}\nTotal: ${formatCurrency(q.total)}\nGracias por preferirnos.`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cotizaciones</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors">
          <Plus size={20} /> <span>Nueva Cotización</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-6 py-4">No.</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.quotes.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">No hay cotizaciones registradas</td></tr>
            ) : data.quotes.map(q => (
              <tr key={q.id}>
                <td className="px-6 py-4 font-bold">{q.id}</td>
                <td className="px-6 py-4">{data.clients.find(c => c.id === q.clientId)?.name}</td>
                <td className="px-6 py-4 font-bold">{formatCurrency(q.total)}</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{q.status}</span></td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => generatePDF(q.id, `Cliente: ${data.clients.find(c => c.id === q.clientId)?.name}\n\n${q.observations}`)} className="p-2 hover:bg-gray-100 rounded-lg text-slate-600" title="Descargar PDF"><Download size={18}/></button>
                  <button onClick={() => shareWhatsApp(createQuoteText(q))} className="p-2 hover:bg-green-50 rounded-lg text-green-500" title="Enviar WhatsApp"><MessageCircle size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold">Nueva Cotización</h3>
               <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                 <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" onChange={e => setSelectedClient(e.target.value)}>
                   <option value="">Seleccionar Cliente</option>
                   {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>

               <div className="border-t pt-4">
                 <p className="text-sm font-bold text-gray-700 mb-3">Agregar Equipos/Materiales</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   <input className="col-span-1 md:col-span-1 border border-gray-300 p-3 rounded-xl" placeholder="Descripción" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                   <input type="number" className="border border-gray-300 p-3 rounded-xl" placeholder="Cant." value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: +e.target.value})} />
                   <input type="number" className="border border-gray-300 p-3 rounded-xl" placeholder="Precio Unit." value={newItem.unitPrice} onChange={e => setNewItem({...newItem, unitPrice: +e.target.value})} />
                 </div>
                 <button onClick={handleAddItem} className="w-full mt-3 bg-slate-800 text-white p-3 rounded-xl font-medium hover:bg-slate-700 transition-colors">Añadir Item</button>
               </div>

               {items.length > 0 && (
                 <div className="bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                    {items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span>{it.description} (x{it.quantity})</span>
                        <span className="font-bold">{formatCurrency(it.quantity * it.unitPrice)}</span>
                      </div>
                    ))}
                 </div>
               )}

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Mano de Obra</label>
                 <input type="number" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="$0" onChange={e => setLaborCost(+e.target.value)} />
               </div>
             </div>

             <button onClick={handleSaveQuote} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">Generar Cotización</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesModule;
