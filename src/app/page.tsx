import Link from "next/link";
import { Utensils, LayoutDashboard, Settings, Heart, Brain, ShieldCheck, TrendingUp, Database, Plug, ArrowRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
      {/* Hero */}
      <div className="text-center mb-8 max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-5xl">🥗</span>
        </div>
        <h1 className="text-4xl font-bold text-green-800 mb-3">NutriLink</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          La <strong>capa de inteligencia nutricional, económica y predictiva</strong> que transforma excedentes alimentarios en un recurso estratégico para la seguridad alimentaria de las familias más vulnerables.
        </p>
        <p className="mt-2 text-sm text-green-700 font-medium bg-green-50 inline-block px-4 py-1.5 rounded-full border border-green-200">
          🔌 No es una plataforma — es la inteligencia que se integra en los sistemas que ya usas
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Heart className="w-4 h-4 text-red-400" />
          <span>Impulsado por <strong>Acción Contra el Hambre</strong></span>
        </div>
      </div>

      {/* ⭐ DEMO CTA — tarjeta destacada para la demo del 27 abril */}
      <div className="w-full max-w-2xl mb-6">
        <Link href="/demo" className="block">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 rounded-full p-2">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-base leading-tight">🎯 Ver la demo en vivo</p>
                <p className="text-orange-200 text-xs">Flujo completo: CSV → BEDCA → Menús verificados</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto flex-shrink-0" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="bg-white/15 rounded-xl p-2">
                <p className="text-lg mb-0.5">📥</p>
                <p className="font-medium">Importa CSV</p>
                <p className="text-orange-200">con excedentes</p>
              </div>
              <div className="bg-white/15 rounded-xl p-2">
                <p className="text-lg mb-0.5">🔬</p>
                <p className="font-medium">BEDCA enriquece</p>
                <p className="text-orange-200">datos oficiales</p>
              </div>
              <div className="bg-white/15 rounded-xl p-2">
                <p className="text-lg mb-0.5">✅</p>
                <p className="font-medium">Menús verificados</p>
                <p className="text-orange-200">badge trazable</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* API Integration Banner */}
      <div className="w-full max-w-2xl bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-5 mb-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Plug className="w-5 h-5" />
          <p className="font-semibold text-sm">Capa integrable — No sustituye, potencia</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-lg mb-1">🏦</p>
            <p className="font-medium">Bancos de Alimentos</p>
            <p className="text-green-200">Se conecta a su ERP</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-lg mb-1">🍽️</p>
            <p className="font-medium">Comedores sociales</p>
            <p className="text-green-200">Planifica sus menús</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-lg mb-1">📋</p>
            <p className="font-medium">Gestión actual (Excel)</p>
            <p className="text-green-200">Lee y mejora lo que hay</p>
          </div>
        </div>
        <p className="text-xs text-green-200 mt-3 text-center">
          NutriLink se integra mediante API con cualquier sistema existente · No duplica infraestructura logística
        </p>
      </div>

      {/* Demo scenario */}
      <div className="w-full max-w-2xl bg-white border border-green-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-semibold text-green-800">🏢 Demo: Banco de Alimentos de Vallecas</p>
          <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Simulación interactiva</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Así se vería la inteligencia de NutriLink integrada en el día a día de un banco de alimentos real.
          Esta mañana han llegado <strong>15 donaciones</strong> de 3 supermercados.
          NutriLink enriquece cada alimento con datos BEDCA y precios MAPA, y genera <strong>menús equilibrados</strong> automáticamente.
        </p>
        <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
          <div className="bg-green-50 rounded-lg p-2"><Database className="w-4 h-4 text-green-600 mx-auto mb-1" /><p className="text-green-700 font-bold">BEDCA</p><p className="text-gray-400">Datos reales</p></div>
          <div className="bg-yellow-50 rounded-lg p-2"><TrendingUp className="w-4 h-4 text-yellow-600 mx-auto mb-1" /><p className="text-yellow-700 font-bold">MAPA</p><p className="text-gray-400">Precios €/kg</p></div>
          <div className="bg-purple-50 rounded-lg p-2"><Brain className="w-4 h-4 text-purple-600 mx-auto mb-1" /><p className="text-purple-700 font-bold">IA + BEDCA</p><p className="text-gray-400">Recetas validadas</p></div>
          <div className="bg-blue-50 rounded-lg p-2"><ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" /><p className="text-blue-700 font-bold">ESG</p><p className="text-gray-400">Informe donantes</p></div>
        </div>
      </div>

      {/* National context banner */}
      <div className="w-full max-w-2xl bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center text-sm text-amber-900 mb-6">
        <p className="font-semibold mb-1">📊 El problema en España</p>
        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
          <div><p className="font-bold text-amber-700 text-base">1.125M kg</p><p className="text-amber-600">desperdiciados en hogares/año</p></div>
          <div><p className="font-bold text-amber-700 text-base">1,2M personas</p><p className="text-amber-600">atendidas por 6.000 entidades</p></div>
          <div><p className="font-bold text-amber-700 text-base">+140.000 t</p><p className="text-amber-600">redistribuidas al año — sin inteligencia nutricional</p></div>
        </div>
        <p className="text-xs text-amber-500 mt-2">Fuente: Acción Contra el Hambre · Ley 1/2025 de prevención del desperdicio alimentario</p>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-2xl mb-2">
        <p className="text-center text-xs text-gray-400 font-medium mb-3">EXPLORA LA DEMO INTERACTIVA</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <Link href="/familia" className="group bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:border-green-400 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Utensils className="w-7 h-7 text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Vista familia</p>
            <p className="text-xs text-gray-500 mt-1">Menús equilibrados, multiidioma, filtros dietéticos</p>
          </div>
          <span className="mt-auto text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">Ver demo →</span>
        </Link>

        <Link href="/admin" className="group bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:border-orange-400 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <Settings className="w-7 h-7 text-orange-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Vista ONG</p>
            <p className="text-xs text-gray-500 mt-1">Inventario enriquecido + generación IA de menús</p>
          </div>
          <span className="mt-auto text-xs font-medium text-orange-700 bg-orange-50 px-3 py-1 rounded-full">Ver demo →</span>
        </Link>

        <Link href="/dashboard" className="group bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <LayoutDashboard className="w-7 h-7 text-blue-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Dashboard ESG</p>
            <p className="text-xs text-gray-500 mt-1">Impacto, predicciones, certificado ESG</p>
          </div>
          <span className="mt-auto text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Ver demo →</span>
        </Link>
      </div>

      {/* Stats teaser */}
      <div className="mt-10 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-green-700">177 kg</p>
          <p className="text-xs text-gray-500">rescatados esta semana</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-orange-600">471</p>
          <p className="text-xs text-gray-500">raciones BEDCA validadas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">117</p>
          <p className="text-xs text-gray-500">familias servidas</p>
        </div>
      </div>

      {/* Compliance checklist */}
      <div className="mt-8 w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-center text-xs text-gray-400 font-medium mb-3">✅ CUMPLIMIENTO DE REQUISITOS DEL RETO ACH</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 mt-0.5">✓</span>
            <div><p className="font-medium text-gray-700">Datos reales, no inventados</p><p className="text-gray-400">BEDCA (AESAN) + MAPA + Mercamadrid</p></div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 mt-0.5">✓</span>
            <div><p className="font-medium text-gray-700">No es una plataforma logística</p><p className="text-gray-400">Capa API integrable sobre sistemas existentes</p></div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 mt-0.5">✓</span>
            <div><p className="font-medium text-gray-700">Recetas validadas post-IA</p><p className="text-gray-400">IA genera → BEDCA valida → trazabilidad completa</p></div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 mt-0.5">✓</span>
            <div><p className="font-medium text-gray-700">Multi-actor, no solo usuario final</p><p className="text-gray-400">Familias + ONGs + Empresas donantes + Administración</p></div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 mt-0.5">✓</span>
            <div><p className="font-medium text-gray-700">Escalable y replicable</p><p className="text-gray-400">Cualquier banco de alimentos de España puede usarlo</p></div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 mt-0.5">✓</span>
            <div><p className="font-medium text-gray-700">Accesible para poblaciones vulnerables</p><p className="text-gray-400">4 idiomas, halal, alto contraste, WCAG</p></div>
          </div>
        </div>
      </div>

      {/* 4 pillars of the challenge */}
      <div className="mt-8 w-full max-w-2xl">
        <p className="text-center text-xs text-gray-400 font-medium mb-3">LOS 4 PILARES DEL RETO ACH — TODOS CUBIERTOS</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
          <div className="bg-green-50 rounded-xl p-3 border border-green-200"><p className="text-lg mb-1">🥦</p><p className="font-medium text-green-700">Categorización nutricional</p><p className="text-green-500 text-[10px] mt-1">BEDCA · 45 alimentos</p></div>
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200"><p className="text-lg mb-1">💶</p><p className="font-medium text-yellow-700">Valor económico</p><p className="text-yellow-500 text-[10px] mt-1">MAPA + Mercamadrid</p></div>
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200"><p className="text-lg mb-1">🍳</p><p className="font-medium text-purple-700">Recetas optimizadas</p><p className="text-purple-500 text-[10px] mt-1">IA + validación BEDCA</p></div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200"><p className="text-lg mb-1">📈</p><p className="font-medium text-blue-700">Predicciones</p><p className="text-blue-500 text-[10px] mt-1">FESBAL + eventos culturales</p></div>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        II Concurso Retos Innovadores · Acción Contra el Hambre · Madrid Innovation iLAB · 2026
      </p>
    </main>
  );
}
