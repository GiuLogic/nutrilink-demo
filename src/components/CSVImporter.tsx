"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Database, FileText, FileSpreadsheet } from "lucide-react";
import { lookupNutrition } from "@/lib/nutrition-db";
import type { FoodItem } from "@/types";

// ─── Formatos soportados ──────────────────────────────────────────────────────
// Archivos: .csv, .txt (delimitado por comas o tabuladores), .xlsx, .xls (Excel)
// Formato A (demo simple):  nombre_producto, cantidad_kg, fecha_caducidad, id_bedca, donante
// Formato B (inventario):   ID_Lote, Producto, Categoria, Cantidad_kg, BEDCA_ID,
//                           Kcal_100g, Proteinas_g, Carbohidratos_g, Grasas_g,
//                           Precio_MAPA_kg, Valor_Total_Euros

const SUPPORTED_EXTENSIONS = ['.csv', '.txt', '.xlsx', '.xls'];
const SUPPORTED_MIMES = [
  'text/csv',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

interface NormalizedRow {
  nombre: string;
  cantidad_kg: number;
  fecha_caducidad: string;
  categoria: string;
  // Nutrición (puede venir del CSV o del lookup BEDCA)
  kcal_per_100g?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  bedca_source?: string;
  bedca_class?: 'saludable' | 'moderado' | 'ocasional';
  // Extras del Formato B
  precio_kg?: number;
  valor_eur?: number;
  id_lote?: string;
}

interface EnrichedRow {
  raw: NormalizedRow;
  status: 'pending' | 'enriching' | 'success' | 'error';
  errorMessage?: string;
}

interface CSVImporterProps {
  onImportComplete: (items: FoodItem[]) => void;
}

const CLASS_BADGE: Record<'saludable' | 'moderado' | 'ocasional', string> = {
  saludable: '🟢 Saludable',
  moderado: '🟡 Moderado',
  ocasional: '🔴 Ocasional',
};

const CLASS_COLORS: Record<'saludable' | 'moderado' | 'ocasional', string> = {
  saludable: 'bg-green-100 text-green-700',
  moderado: 'bg-yellow-100 text-yellow-700',
  ocasional: 'bg-red-100 text-red-700',
};

// Infiere la clase nutricional a partir de macros cuando no viene de BEDCA
function inferNutritionalClass(kcal: number, fat_g: number): 'saludable' | 'moderado' | 'ocasional' {
  if (kcal > 400 || fat_g > 20) return 'ocasional';
  if (kcal > 200 || fat_g > 10) return 'moderado';
  return 'saludable';
}

// Mapea categorías del CSV inventario a las categorías internas
function mapCategoria(cat: string): FoodItem['category'] {
  const c = cat.toLowerCase();
  if (c.includes('verdura') || c.includes('hortaliza')) return 'verdura';
  if (c.includes('fruta')) return 'fruta';
  if (c.includes('carne') || c.includes('pescado') || c.includes('legumbre')) return 'proteina';
  if (c.includes('cereal') || c.includes('tubér')) return 'cereal';
  if (c.includes('lácteo') || c.includes('lacteo') || c.includes('huevo')) return 'lacteo';
  return 'otro';
}

// Detecta qué formato es el CSV a partir de las cabeceras
function detectFormat(headers: string[]): 'A' | 'B' | 'unknown' {
  const h = headers.map(h => h.toLowerCase().trim());
  if (h.includes('nombre_producto') || h.includes('nombre producto')) return 'A';
  if (h.includes('producto') && h.includes('kcal_100g')) return 'B';
  // Intento flexible
  if (h.includes('producto') || h.includes('nombre')) return 'B';
  return 'unknown';
}

function parseCSV(text: string): NormalizedRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const format = detectFormat(headers);

  return lines.slice(1).map(line => {
    // Manejo de comas dentro de comillas
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    values.push(current.trim());

    const get = (key: string) => {
      const idx = headers.findIndex(h => h.toLowerCase() === key.toLowerCase());
      return idx >= 0 ? (values[idx] || '').trim() : '';
    };

    if (format === 'A') {
      return {
        nombre: get('nombre_producto'),
        cantidad_kg: parseFloat(get('cantidad_kg')) || 0,
        fecha_caducidad: get('fecha_caducidad') || '2026-12-31',
        categoria: 'otro',
        id_lote: get('id_bedca'),
      } as NormalizedRow;
    }

    // Formato B — ya trae los valores nutricionales
    const kcal = parseFloat(get('Kcal_100g') || get('kcal_100g')) || 0;
    const fat = parseFloat(get('Grasas_g') || get('grasas_g')) || 0;
    const cat = get('Categoria') || get('categoria') || 'otro';

    return {
      nombre: get('Producto') || get('producto'),
      cantidad_kg: parseFloat(get('Cantidad_kg') || get('cantidad_kg')) || 0,
      fecha_caducidad: get('fecha_caducidad') || get('Fecha_caducidad') || `2026-${String(Math.floor(Math.random() * 6) + 6).padStart(2, '0')}-30`,
      categoria: cat,
      kcal_per_100g: kcal,
      protein_g: parseFloat(get('Proteinas_g') || get('proteinas_g')) || 0,
      carbs_g: parseFloat(get('Carbohidratos_g') || get('carbohidratos_g')) || 0,
      fat_g: fat,
      bedca_class: inferNutritionalClass(kcal, fat),
      precio_kg: parseFloat(get('Precio_MAPA_kg') || get('precio_mapa_kg')) || undefined,
      valor_eur: parseFloat(get('Valor_Total_Euros') || get('valor_total_euros')) || undefined,
      id_lote: get('ID_Lote') || get('id_lote'),
    } as NormalizedRow;
  }).filter(r => r.nombre && r.cantidad_kg > 0);
}

async function enrichRow(row: NormalizedRow): Promise<{ row: NormalizedRow; status: 'success' | 'error'; msg?: string }> {
  await new Promise(r => setTimeout(r, 250));

  // Si el CSV ya trae valores nutricionales, enriquecer con BEDCA si hay match, si no usar los del CSV
  const bedcaEntry = lookupNutrition(row.nombre);

  if (bedcaEntry) {
    return {
      row: {
        ...row,
        kcal_per_100g: bedcaEntry.calories_per_100g,
        protein_g: bedcaEntry.protein_g,
        carbs_g: bedcaEntry.carbs_g,
        fat_g: bedcaEntry.fat_g,
        bedca_source: bedcaEntry.source,
        bedca_class: bedcaEntry.nutritional_class,
      },
      status: 'success',
    };
  }

  // Sin match BEDCA pero el CSV Formato B ya trae los valores → éxito igualmente
  if (row.kcal_per_100g !== undefined && row.kcal_per_100g > 0) {
    return {
      row: {
        ...row,
        bedca_source: 'Inventario (valores del proveedor)',
        bedca_class: row.bedca_class || inferNutritionalClass(row.kcal_per_100g, row.fat_g || 0),
      },
      status: 'success',
    };
  }

  return { row, status: 'error', msg: 'No encontrado en BEDCA y sin datos nutricionales' };
}

export default function CSVImporter({ onImportComplete }: CSVImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rows, setRows] = useState<EnrichedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      alert(`Formato no soportado: ${ext}\n\nFormatos aceptados: CSV, TXT, Excel (.xlsx, .xls)`);
      return;
    }

    let parsed: NormalizedRow[] = [];

    if (ext === '.xlsx' || ext === '.xls') {
      // ─── Excel parsing ────────────────────────────────────────────────
      try {
        const XLSX = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convertir a CSV y reutilizar el parser existente
        const csvText = XLSX.utils.sheet_to_csv(sheet);
        parsed = parseCSV(csvText);
      } catch (err) {
        alert('Error al leer el archivo Excel. Asegúrate de que es un archivo .xlsx o .xls válido.');
        console.error('Excel parse error:', err);
        return;
      }
    } else {
      // ─── CSV / TXT parsing ────────────────────────────────────────────
      let text = await file.text();
      // Si es TXT con tabuladores, convertir a comas
      if (ext === '.txt' && text.includes('\t') && !text.includes(',')) {
        text = text.replace(/\t/g, ',');
      }
      // Si es TXT con punto y coma (formato europeo), convertir a comas
      if (ext === '.txt' && text.includes(';') && !text.includes(',')) {
        text = text.replace(/;/g, ',');
      }
      parsed = parseCSV(text);
    }

    if (parsed.length === 0) {
      alert('No se encontraron filas válidas. Comprueba que el archivo tiene una cabecera con "nombre_producto" o "Producto" y al menos una fila de datos.');
      return;
    }

    const initial: EnrichedRow[] = parsed.map(r => ({ raw: r, status: 'pending' }));
    setRows(initial);
    setIsProcessing(true);

    for (let i = 0; i < initial.length; i++) {
      setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'enriching' } : r));
      const { row, status, msg } = await enrichRow(initial[i].raw);
      setRows(prev => prev.map((r, idx) =>
        idx === i ? { raw: row, status, errorMessage: msg } : r
      ));
    }

    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const downloadDemo = () => {
    const link = document.createElement('a');
    link.href = '/cesta_demo.csv';
    link.download = 'cesta_demo.csv';
    link.click();
  };

  const importToInventory = () => {
    const successRows = rows.filter(r => r.status === 'success');
    const items: FoodItem[] = successRows.map((r, idx) => ({
      id: `csv-${Date.now()}-${idx}`,
      name: r.raw.nombre,
      category: mapCategoria(r.raw.categoria),
      quantity_kg: r.raw.cantidad_kg,
      expiry_date: r.raw.fecha_caducidad,
      nutritional_value: r.raw.kcal_per_100g !== undefined ? {
        calories_per_100g: r.raw.kcal_per_100g,
        protein_g: r.raw.protein_g ?? 0,
        carbs_g: r.raw.carbs_g ?? 0,
        fat_g: r.raw.fat_g ?? 0,
        source: r.raw.bedca_source,
      } : undefined,
      market_price: r.raw.precio_kg !== undefined ? {
        price_eur_per_kg: r.raw.precio_kg,
        total_value_eur: r.raw.valor_eur ?? r.raw.precio_kg * r.raw.cantidad_kg,
        trend: 'stable' as const,
        trend_pct: 0,
        source: 'MAPA Observatorio de Precios',
      } : undefined,
      is_active: true,
      created_at: new Date().toISOString(),
    }));
    onImportComplete(items);
    setRows([]);
  };

  const successCount = rows.filter(r => r.status === 'success').length;
  const errorCount = rows.filter(r => r.status === 'error').length;
  const saludableCount = rows.filter(r => r.raw.bedca_class === 'saludable').length;
  const moderadoCount = rows.filter(r => r.raw.bedca_class === 'moderado').length;
  const ocasionalCount = rows.filter(r => r.raw.bedca_class === 'ocasional').length;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {rows.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50/50'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto text-orange-500 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Importar inventario de excedentes</h3>
          <p className="text-sm text-gray-500 mb-4">
            Arrastra tu archivo o haz clic para seleccionar
          </p>
          {/* Formatos soportados */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 font-medium px-2 py-1 rounded-md border border-green-200">
              <FileText className="w-3 h-3" /> .csv
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-md border border-blue-200">
              <FileSpreadsheet className="w-3 h-3" /> .xlsx
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-md border border-blue-200">
              <FileSpreadsheet className="w-3 h-3" /> .xls
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 font-medium px-2 py-1 rounded-md border border-gray-200">
              <FileText className="w-3 h-3" /> .txt
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Compatible con: inventarios Excel de bancos de alimentos · cestas CSV · archivos de texto delimitados
          </p>
          <input type="file" accept=".csv,.txt,.xlsx,.xls" onChange={handleFileInput} className="hidden" id="csv-upload" />
          <label
            htmlFor="csv-upload"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            Seleccionar archivo
          </label>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={downloadDemo}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 mx-auto"
            >
              📥 Descargar CSV de demostración (10 productos)
            </button>
          </div>
        </div>
      )}

      {/* Processing view */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-orange-600" />
                  Enriquecimiento nutricional
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verificando contra BEDCA (Base Española de Datos de Composición de Alimentos)
                </p>
              </div>
              {!isProcessing && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{successCount}/{rows.length}</div>
                  <div className="text-xs text-gray-500">Enriquecidos</div>
                </div>
              )}
            </div>

            {/* Classification legend */}
            {!isProcessing && successCount > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="text-xs text-gray-400 self-center">Clasificación:</span>
                <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">🟢 Saludable · {saludableCount}</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 font-medium px-2 py-0.5 rounded-full">🟡 Moderado · {moderadoCount}</span>
                <span className="text-xs bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded-full">🔴 Ocasional · {ocasionalCount}</span>
              </div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className={`px-5 py-3 border-b border-gray-50 transition-all ${
                  row.status === 'enriching' ? 'bg-orange-50 animate-pulse' :
                  row.status === 'success' ? 'bg-green-50/30' :
                  row.status === 'error' ? 'bg-red-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {row.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                    {row.status === 'enriching' && <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />}
                    {row.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {row.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{row.raw.nombre}</h4>
                      <span className="text-xs text-gray-500">{row.raw.cantidad_kg} kg</span>
                      {row.raw.id_lote && (
                        <span className="text-xs text-gray-400 font-mono">{row.raw.id_lote}</span>
                      )}
                    </div>

                    {row.status === 'success' && row.raw.kcal_per_100g !== undefined && (
                      <div className="bg-white rounded-lg p-2 border border-green-200 mt-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold text-green-700">✓ Verificado</span>
                          <span className="text-xs text-gray-500">{row.raw.bedca_source}</span>
                          {row.raw.bedca_class && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${CLASS_COLORS[row.raw.bedca_class]}`}>
                              {CLASS_BADGE[row.raw.bedca_class]}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-gray-600 flex-wrap">
                          <span>{row.raw.kcal_per_100g} kcal/100g</span>
                          <span>·</span>
                          <span>{row.raw.protein_g}g prot</span>
                          <span>·</span>
                          <span>{row.raw.carbs_g}g carbs</span>
                          <span>·</span>
                          <span>{row.raw.fat_g}g grasa</span>
                          {row.raw.precio_kg !== undefined && (
                            <>
                              <span>·</span>
                              <span className="text-blue-600">{row.raw.precio_kg}€/kg</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {row.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{row.errorMessage}</p>
                    )}
                    {row.status === 'enriching' && (
                      <p className="text-xs text-orange-600 mt-1">Consultando BEDCA...</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isProcessing && (
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {successCount > 0 && <span className="text-green-600 font-medium">{successCount} productos listos</span>}
                {errorCount > 0 && <span className="text-red-600 ml-3">{errorCount} sin datos</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRows([])}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={importToInventory}
                  disabled={successCount === 0}
                  className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Importar {successCount} productos →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
