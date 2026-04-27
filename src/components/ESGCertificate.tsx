"use client";

import { FileDown } from "lucide-react";

interface CertificateData {
  entity_name: string;
  period: string;
  economic_value: string;
  co2_saved: string;
  portions: number;
  balanced_pct: number;
  families: number;
  kg_rescued: number;
}

export function ESGCertificate({ data }: { data: CertificateData }) {
  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const trees = Math.round(data.kg_rescued * 2.1 / 30);
    const kmAvoided = Math.round(data.kg_rescued * 2.1 / 0.12);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Certificado ESG — NutriLink</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 40px; }
          .certificate { max-width: 700px; margin: 0 auto; border: 3px solid #16a34a; border-radius: 16px; padding: 48px; position: relative; }
          .badge { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: #16a34a; color: white; font-size: 12px; font-weight: 700; padding: 6px 24px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase; }
          .logo { text-align: center; margin-bottom: 24px; }
          .logo h1 { font-size: 28px; color: #16a34a; }
          .logo p { font-size: 13px; color: #6b7280; margin-top: 4px; }
          .title { text-align: center; margin: 24px 0; }
          .title h2 { font-size: 22px; color: #1f2937; }
          .title p { font-size: 14px; color: #6b7280; margin-top: 4px; }
          .entity { text-align: center; font-size: 20px; font-weight: 700; color: #16a34a; margin: 16px 0 32px; }
          .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
          .metric { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center; }
          .metric .value { font-size: 24px; font-weight: 700; color: #15803d; }
          .metric .label { font-size: 11px; color: #6b7280; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
          .equivalences { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 24px 0; }
          .equivalences h3 { font-size: 13px; font-weight: 600; color: #1e40af; margin-bottom: 8px; }
          .equivalences ul { list-style: none; font-size: 13px; color: #374151; }
          .equivalences li { padding: 4px 0; }
          .equivalences li::before { content: '✓ '; color: #16a34a; font-weight: bold; }
          .legal { background: #fefce8; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; margin: 24px 0; font-size: 12px; color: #92400e; }
          .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
          .footer p { font-size: 11px; color: #9ca3af; }
          .footer .code { font-family: monospace; font-size: 13px; color: #6b7280; margin-top: 8px; }
          .sources { margin-top: 24px; font-size: 10px; color: #9ca3af; text-align: center; }
          @media print { body { padding: 20px; } .certificate { border-width: 2px; } }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="badge">Certificado Verificado</div>
          <div class="logo">
            <h1>🥗 NutriLink</h1>
            <p>Inteligencia Nutricional para la Seguridad Alimentaria</p>
          </div>
          <div class="title">
            <h2>Certificado de Impacto Social y Ambiental</h2>
            <p>Período: ${data.period}</p>
          </div>
          <div class="entity">${data.entity_name}</div>
          <div class="metrics">
            <div class="metric">
              <div class="value">${data.economic_value}</div>
              <div class="label">Valor económico recuperado</div>
            </div>
            <div class="metric">
              <div class="value">${data.co2_saved}</div>
              <div class="label">CO₂ evitado</div>
            </div>
            <div class="metric">
              <div class="value">${data.portions.toLocaleString('es-ES')}</div>
              <div class="label">Raciones saludables</div>
            </div>
            <div class="metric">
              <div class="value">${data.families}</div>
              <div class="label">Familias beneficiadas</div>
            </div>
          </div>
          <div class="equivalences">
            <h3>🌍 Equivalencias de impacto ambiental</h3>
            <ul>
              <li>${trees} árboles equivalentes plantados</li>
              <li>${kmAvoided.toLocaleString('es-ES')} km de conducción evitados</li>
              <li>${data.families} familias alimentadas con menús equilibrados</li>
              <li>${data.balanced_pct}% de las raciones nutricionalmente equilibradas</li>
            </ul>
          </div>
          <div class="legal">
            <strong>⚖️ Cumplimiento Ley 1/2025</strong> — Este certificado acredita la contribución a la prevención del desperdicio alimentario conforme a la Ley 1/2025, de 1 de abril, priorizando el consumo humano como destino principal de los excedentes.
          </div>
          <div class="footer">
            <p>Generado automáticamente por NutriLink · ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p class="code">Código de verificación: NL-${Date.now().toString(36).toUpperCase()}</p>
          </div>
          <div class="sources">
            Fuentes: BEDCA (AESAN) · MAPA Observatorio de Precios · EU FUSIONS/FAO (factor CO₂ 2.1 kg/kg) · Mercamadrid
          </div>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md"
    >
      <FileDown className="w-5 h-5" />
      Descargar Certificado ESG (PDF)
    </button>
  );
}
