
import { AppState } from './types';

const STORAGE_KEY = 'sitec_app_data';

export const DEFAULT_QUOTE_OBSERVATIONS = `- Cliente suministra todos los accesos requeridos de altura, escaleras, manlift, andamios, etc.\n- No incluye recargo de trabajo nocturno, ni presencia de personal siso, de ser necesario o requerido, el costo será asumido por el cliente.\n- Tiempo de trabajo estimado: 7 días.\n- No incluye canaletas, tuberías y puntos de corriente.`;

export const DEFAULT_COMMERCIAL_CONDITIONS = `Moneda: Pesos colombianos\nForma de pago: 50% anticipo – 50% contra entrega\nVigencia: 15 días\nGarantía: Un (1) año en equipos.\nEntrega: Sujeta a disponibilidad.`;

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
  visits: [],
  reports: [],
  maintenance: []
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
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            h1 { color: #f97316; }
            .header { border-bottom: 2px solid #f97316; margin-bottom: 20px; padding-bottom: 10px; }
            .footer { margin-top: 40px; font-size: 0.8em; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SITEC SOLUCIONES TECNOLOGICAS INTEGRALES S.A.S.</h1>
            <p>NIT 901806525-3</p>
          </div>
          <h2>${title}</h2>
          <pre style="white-space: pre-wrap;">${content}</pre>
          <div class="footer">
            <p>${SITEC_BANK_INFO}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

export const shareWhatsApp = (message: string) => {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
