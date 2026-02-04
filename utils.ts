
import { AppState, Quote, Client } from './types';

const STORAGE_KEY = 'sitec_app_data';

export const DEFAULT_QUOTE_OBSERVATIONS = `- Cliente suministra todos los accesos requeridos de altura, escaleras, manlift, andamios, etc.\n- No incluye recargo de trabajo nocturno, ni presencia de personal siso, de ser necesario o requerido, el costo será asumido por el cliente.\n- Tiempo de trabajo estimado: Según cronograma.\n- No incluye canaletas, tuberías y puntos de corriente.`;

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
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 20px; }
          .logo-text { color: #10b981; font-size: 32px; font-weight: bold; margin: 0; }
          h1 { color: #1e293b; font-size: 20px; margin-top: 0; }
          pre { white-space: pre-wrap; font-family: 'Helvetica', sans-serif; font-size: 14px; background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; color: #374151; }
          .footer { margin-top: 40px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="logo-text">SITEC</p>
          <div style="text-align: right; font-size: 12px; color: #666;">
            <strong>SITEC SOLUCIONES TECNOLOGICAS INTEGRALES S.A.S.</strong><br>
            NIT 901806525-3
          </div>
        </div>
        <h1>${title}</h1>
        <pre>${content}</pre>
        <div class="footer">
          <p>SITEC SOLUCIONES TECNOLOGICAS INTEGRALES S.A.S. - Reporte Generado el ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

export const generateQuotePDF = (quote: Quote, client: Client | undefined) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const itemsHtml = quote.items.map((item, index) => `
    <tr>
      <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
      <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
      <td style="text-align: right; border: 1px solid #ddd; padding: 8px;">${formatCurrency(item.unitPrice)}</td>
      <td style="text-align: right; border: 1px solid #ddd; padding: 8px;">${formatCurrency(item.quantity * item.unitPrice)}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Cotización SITEC - ${quote.id}</title>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 20px; }
          .logo-text { color: #f97316; font-size: 32px; font-weight: bold; margin: 0; }
          .company-info { font-size: 11px; color: #666; }
          .quote-title { text-align: right; }
          .quote-title h2 { color: #f97316; margin: 0; font-size: 24px; }
          .client-info { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; border: 1px solid #e5e7eb; }
          .client-info table { width: 100%; border-collapse: collapse; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          .items-table th { background: #1e293b; color: white; padding: 10px; text-transform: uppercase; }
          .totals-table { width: 300px; margin-left: auto; border-collapse: collapse; font-size: 13px; }
          .totals-table td { padding: 5px; }
          .totals-table .total-row { border-top: 2px solid #f97316; font-weight: bold; font-size: 15px; }
          .conditions { font-size: 11px; margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .conditions-box { border: 1px solid #eee; padding: 10px; border-radius: 5px; }
          .footer { margin-top: 40px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <p class="logo-text">SITEC</p>
            <div class="company-info">
              <strong>SITEC SOLUCIONES TECNOLOGICAS INTEGRALES S.A.S.</strong><br>
              NIT 901806525-3<br>
              Servicios de Seguridad Electrónica y Redes
            </div>
          </div>
          <div class="quote-title">
            <h2>COTIZACIÓN</h2>
            <p><strong>N°:</strong> ${quote.id}</p>
            <p><strong>Fecha:</strong> ${quote.date}</p>
            <p><strong>Servicio:</strong> ${quote.serviceTypes.join(' / ')}</p>
          </div>
        </div>

        <div class="client-info">
          <table>
            <tr>
              <td><strong>Cliente:</strong> ${client?.name || 'N/A'}</td>
              <td><strong>NIT/CC:</strong> ${client?.nit || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong> ${client?.address || 'N/A'}</td>
              <td><strong>Contacto:</strong> ${client?.contactPerson || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th width="40">Item</th>
              <th>Descripción</th>
              <th width="60">Cant.</th>
              <th width="100">Vr. Unit</th>
              <th width="120">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Subtotal Equipos:</td>
            <td style="text-align: right;">${formatCurrency(quote.subtotalItems)}</td>
          </tr>
          <tr>
            <td>Instalación y Config:</td>
            <td style="text-align: right;">${formatCurrency(quote.laborCost)}</td>
          </tr>
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">${formatCurrency(quote.subtotalGeneral)}</td>
          </tr>
          <tr>
            <td>IVA (19%):</td>
            <td style="text-align: right;">${formatCurrency(quote.iva)}</td>
          </tr>
          <tr class="total-row">
            <td>TOTAL:</td>
            <td style="text-align: right;">${formatCurrency(quote.total)}</td>
          </tr>
        </table>

        <div class="conditions">
          <div class="conditions-box">
            <strong>OBSERVACIONES ESPECIALES</strong><br>
            <pre style="white-space: pre-wrap; margin-top: 5px;">${quote.observations || DEFAULT_QUOTE_OBSERVATIONS}</pre>
          </div>
          <div class="conditions-box">
            <strong>CONDICIONES COMERCIALES</strong><br>
            <table style="width: 100%; margin-top: 5px;">
              <tr><td>Moneda:</td><td>Pesos Colombianos</td></tr>
              <tr><td>Forma de pago:</td><td>50% Anticipo - 50% Entrega</td></tr>
              <tr><td>Vigencia:</td><td>15 días calendario</td></tr>
              <tr><td>Garantía:</td><td>Un (1) año por defectos de fábrica</td></tr>
              <tr><td>Entrega:</td><td>Según disponibilidad técnica</td></tr>
              <tr><td>Obras Civiles:</td><td>No incluidas</td></tr>
              <tr><td>Infraestructura:</td><td>Suministrada por el cliente</td></tr>
            </table>
          </div>
        </div>

        <div class="footer">
          <p>${SITEC_BANK_INFO}</p>
          <p>SITEC SOLUCIONES TECNOLOGICAS INTEGRALES S.A.S. - Transformando su seguridad</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

export const shareWhatsApp = (message: string) => {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
