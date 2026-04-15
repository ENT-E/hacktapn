import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Box, Hammer, Link as ChainIcon, Sparkles, 
  Gem, ShieldCheck, MapPin, Cpu, LayoutDashboard, Search
} from 'lucide-react';

// --- COMPONENTES DE VISTA ---

// 1. INVENTARIO (Tablas con distribución profesional)
const InventoryView = ({ data }) => (
  <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
    <section>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Gem size={18} className="text-amber-500"/> Joyería Terminada
      </h3>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Pieza</th>
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold text-center">Referencia</th>
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold text-center">Stock</th>
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold text-right">Costo (COP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.inventory.jewelry.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover border shadow-sm" />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </td>
                <td className="p-4 text-center text-slate-500 font-mono text-xs">{item.ref}</td>
                <td className="p-4 text-center">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[11px] font-bold">{item.qty} u.</span>
                </td>
                <td className="p-4 text-right font-bold text-slate-900">${item.cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Box size={18} className="text-amber-500"/> Materias Primas
      </h3>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Material</th>
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold text-center">Pureza / Calidad</th>
              <th className="p-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold text-right">Precio Mercado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.inventory.materials.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700">{item.name}</td>
                <td className="p-4 text-center text-slate-500 italic text-sm">{item.purity}</td>
                <td className="p-4 text-right font-bold text-emerald-600">${item.priceUnit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

// 2. PRODUCCIÓN
const ProductionView = ({ data }) => (
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
    {data.production.map(piece => (
      <div key={piece.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="h-48 overflow-hidden">
          <img src={piece.img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={piece.name} />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">{piece.name}</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono">REF: {piece.ref}</span>
          </div>
          <ul className="space-y-3">
            {piece.steps.map((step, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">{idx+1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

// 3. TRAZABILIDAD (BLOCKCHAIN)
const TraceabilityView = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const startScanner = () => {
    setScanning(true);

    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
  try {
    const parsed = JSON.parse(decodedText);
    setResult(parsed);
  } catch (err) {
    console.error("QR inválido", err);
    setResult({ error: "Formato inválido" });
  }

  html5QrCode.stop();
  setScanning(false);
},
      //(error) => {}
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">

      {/* BOTÓN */}
      <button
        onClick={startScanner}
        className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold"
      >
        Escanear QR
      </button>

      {/* CÁMARA */}
      {scanning && (
        <div
          id="qr-reader"
          className="w-full max-w-md mx-auto border rounded-xl overflow-hidden"
        />
      )}

      {/* RESULTADO */}
      {result && !result.error && (
  <div className="bg-white rounded-2xl border shadow-md overflow-hidden">
    
    <div className="bg-slate-900 text-white p-4 font-bold">
      Información del Material
    </div>

    <table className="w-full text-sm">
      <tbody>
        <tr className="border-b">
          <td className="p-3 font-bold text-slate-500">ID</td>
          <td className="p-3 font-mono text-xs">{result.id}</td>
        </tr>
        <tr className="border-b">
          <td className="p-3 font-bold text-slate-500">Tipo</td>
          <td className="p-3 capitalize">{result.type}</td>
        </tr>
        <tr className="border-b">
          <td className="p-3 font-bold text-slate-500">Peso</td>
          <td className="p-3">{result.weight} mg</td>
        </tr>
        <tr>
          <td className="p-3 font-bold text-slate-500">Origen</td>
          <td className="p-3">{result.origin}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}
{result?.error && (
  <div className="bg-red-100 text-red-600 p-4 rounded-xl font-bold">
    QR inválido
  </div>
)}
    </div>
  );
};

// 4. DISEÑOS IA
const AIDesignView = () => (
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 h-[550px] animate-in fade-in duration-700">
    <div className="w-full md:w-80 bg-white p-8 rounded-3xl border border-slate-200 flex flex-col shadow-sm">
      <Sparkles className="text-amber-400 mb-4" size={30} />
      <h3 className="text-lg font-bold text-slate-800 mb-2">Modelado IA</h3>
      <p className="text-xs text-slate-400 mb-6 italic">Visualiza la pieza antes de usar el metal real.</p>
      <textarea 
        placeholder="Ej: Anillo de compromiso con diamantes laterales y zafiro central..."
        className="flex-1 w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-200 outline-none resize-none mb-6"
      />
      <button className="w-full py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all">
        Generar Render 3D
      </button>
    </div>
    <div className="flex-1 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center">
      <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.3em]">Visor de Prototipos IA</p>
    </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function JewelryTech() {
  const [activeTab, setActiveTab] = useState('inventory');

  const mockData = {
    inventory: {
      jewelry: [
        { id: 1, name: "Anillo Gala Oro 18k", ref: "BGA-A1", cost: 1450000, qty: 5, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format" },
        { id: 2, name: "Pendientes Esmeralda Muzo", ref: "BGA-P2", cost: 3800000, qty: 2, img: "https://images.unsplash.com/photo-1535633302704-b0292395c750?q=80&w=200&auto=format" },
      ],
      materials: [
        { id: 1, name: "Oro Fino (Granalla)", purity: "24k Pureza", priceUnit: 285000 },
        { id: 2, name: "Diamante Certificado", purity: "VS1 - Corte Ideal", priceUnit: 4200000 },
      ]
    },
    production: [
      { id: 1, name: "Anillo Filigrana", ref: "BGA-F01", steps: ["Modelado IA", "Fundición", "Pulido", "Engaste"], img: "https://images.unsplash.com/photo-1598560912005-796729c8ba82?q=80&w=500&auto=format" },
      { id: 2, name: "Collar Santandereano", ref: "BGA-C12", steps: ["Laminado", "Tejido manual", "Rodinado"], img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format" },
    ]
  };

  const getTitle = () => {
    if (activeTab === 'inventory') return 'Control de Inventario';
    if (activeTab === 'production') return 'Línea de Producción';
    if (activeTab === 'traceability') return 'Seguridad Blockchain';
    return 'Laboratorio de Diseño IA';
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-64 bg-slate-900 fixed h-full left-0 top-0 flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Gem size={20} className="text-slate-900" />
          </div>
          <span className="text-white font-bold tracking-tighter text-lg uppercase">Jewelry<span className="text-amber-500 font-light">BGA</span></span>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {[
            { id: 'inventory', label: 'Inventario', icon: <LayoutDashboard size={18}/> },
            { id: 'production', label: 'Producción', icon: <Hammer size={18}/> },
            { id: 'traceability', label: 'Trazabilidad', icon: <ChainIcon size={18}/> },
            { id: 'ai', label: 'Diseños IA', icon: <Sparkles size={18}/> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${activeTab === item.id ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-slate-950 text-center">
          <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Manufacturing 4.0</p>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 flex flex-col">
        
        {/* CABECERA TOP CENTER */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 border-b z-40 flex items-center justify-center">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 italic">
            {getTitle()}
          </h2>
        </header>

        <div className="p-10 flex-1">
          {activeTab === 'inventory' && <InventoryView data={mockData} />}
          {activeTab === 'production' && <ProductionView data={mockData} />}
          {activeTab === 'traceability' && <TraceabilityView />}
          {activeTab === 'ai' && <AIDesignView />}
        </div>

        {/* FOOTER */}
        <footer className="p-10 border-t border-slate-50 bg-slate-50/30 text-center">
          <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">© 2024 Joyería Bucaramanga Tech</p>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">
            Todos los derechos reservados a <span className="text-slate-900 font-bold underline decoration-amber-500 underline-offset-4">"si funciona no lo toques Team"</span>
          </p>
        </footer>
      </main>
    </div>
  );
}