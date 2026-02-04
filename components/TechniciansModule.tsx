
import React from 'react';
import { Briefcase, Phone, Mail } from 'lucide-react';
import { AppState } from '../types';

interface TechniciansModuleProps {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
}

const TechniciansModule: React.FC<TechniciansModuleProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Personal Técnico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.technicians.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{t.name}</h4>
                <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">{t.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500">
              <p className="flex items-center"><Phone size={14} className="mr-2"/> {t.phone}</p>
              <p className="flex items-center"><Mail size={14} className="mr-2"/> {t.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniciansModule;
