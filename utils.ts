
import { AppState, Quote, Visit, ExecutionReport, MaintenanceAlert, Client, Technician } from './types';

const STORAGE_KEY = 'sitec_app_data';

export const DEFAULT_QUOTE_OBSERVATIONS = `- Cliente suministra todos los accesos requeridos de altura, escaleras, manlift, andamios, etc.\n- No incluye recargo de trabajo nocturno, ni presencia de personal siso, de ser necesario o requerido, el costo será asumido por el cliente.\n- Tiempo de trabajo estimado: 7 días, dependiendo de la operación del cliente y de la disponibilidad de los recursos para trabajos en altura.\n- No incluye canaletas, tuberías y puntos de corriente.`;

export const DEFAULT_COMMERCIAL_CONDITIONS = `Moneda: Pesos colombianos\nForma de pago: 50% anticipo – 50% contra entrega del proyecto\nVigencia: 15 días\nGarantía: Un (1) año en equipos por defectos de fabricación. Garantía limitada según fabricante.\nEntrega: Sujeta a disponibilidad en bodega previa consignación del anticipo.\nObras civiles e infraestructura: NO INCLUIDAS.`;

export const SITEC_BANK_INFO = "BANCOLOMBIA N° CUENTA AHORRO: 67800017190 - SITEC SOLUCIONES TECNOLOGICAS INTEGRALES SAS NIT 901806525-3";

export const initialData: AppState = {
  clients: [
    { id: '1', name: 'Clínica Salud Total', nit: '900.123.456-1', address: 'Calle 100 #15-20', phone: '3001234567', email: 'mantenimiento@saludtotal.com', contactPerson: 'Ing. Carlos Ruiz' },
    { id: '2', name: 'Edificio Horizonte', nit: '800.987.654-2', address: 'Av. Siempre Viva 123', phone: '3117654321', email: 'admin@horizonte.com', contactPerson: 'Marta Lucia' }
  ],
  technicians: [
    { id: 't1', name: 'Juan Pérez', specialty: 'CCTV y Seguridad', phone: '3001112233', email: 'juan.perez@sitec.com' },
    { id: 't2', name: 'Andrés Gómez', specialty: 'Redes y Telecomunicaciones', phone: '3004445566', email: 'andres.gomez@sitec.com' }
  ],
  quotes: [],
  visits: [
    { id: 'v1', clientId: '1', technicianId: 't1', date: '2024-05-20', time: '09:00', description: 'Revisión CCTV Piso 2', status: 'Pendiente' as any, address: 'Calle 100 #15-20' }
  ],
  reports: [],
  maintenance: [
    { id: 'm1', clientId: '1', systemType: 'CCTV Hikvision', lastMaintenanceDate: '2023-11-20', nextMaintenanceDate: '2024-05-20', status: 'Upcoming' }
  ]
};

export const loadData = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
};

export const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

export const generatePDF = (title: string, content: string) => {
  // Simple simulation of PDF generation
  alert(`SITEC S.A.S.\n------------------\n${title}\n\n${content}\n\n${SITEC_BANK_INFO}`);
};

export const shareWhatsApp = (message: string) => {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
