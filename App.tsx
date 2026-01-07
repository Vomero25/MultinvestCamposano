
import React, { useState, useMemo } from 'react';
import { SimulationState, ProductTab } from './types.ts';
import { CPP_CLASSES, PRODUCT_SPECS } from './constants.ts';
import Calculator from './components/Calculator.tsx';
import ProductDetails from './components/ProductDetails.tsx';
import ProductTechnicalSheet from './components/ProductTechnicalSheet.tsx';
import ProductProtection from './components/ProductProtection.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductTab>(ProductTab.OVERVIEW);
  const [activeCPP, setActiveCPP] = useState<'A' | 'B' | 'C'>('B');

  const [simState, setSimState] = useState<SimulationState>({
    initialPremium: 100000,
    gestioneSeparataWeight: 40,
    lineaGestitaWeight: 60,
    expectedReturnGS: 2.87,
    expectedReturnLG: 5.0,
    applyCampaignBonus: true,
    applySacrificeBonus: false,
    years: 10
  });

  const selectedCPP = useMemo(() => CPP_CLASSES.find(c => c.id === activeCPP)!, [activeCPP]);

  const handleWeightChange = (val: number) => {
    const limitedGS = Math.min(val, PRODUCT_SPECS.MAX_GS_PERCENT);
    setSimState(prev => ({
      ...prev,
      gestioneSeparataWeight: limitedGS,
      lineaGestitaWeight: 100 - limitedGS
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0" 
              onClick={() => setActiveTab(ProductTab.OVERVIEW)}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg transition-transform group-hover:scale-105">Z</div>
              <div className="flex flex-col">
                 <h1 className="font-black text-base sm:text-xl text-blue-900 tracking-tighter leading-none">Zurich Multinvest Plus</h1>
                 <span className="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                   Advisor Platform
                 </span>
              </div>
            </div>
            
            <nav className="hidden lg:flex gap-1">
              {Object.values(ProductTab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-[9px] font-black rounded-full transition-all uppercase tracking-widest ${
                    activeTab === tab ? 'bg-blue-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="lg:hidden">
                <select 
                  value={activeTab} 
                  onChange={(e) => setActiveTab(e.target.value as ProductTab)}
                  className="bg-slate-100 border-none rounded-lg p-2 text-[10px] font-black uppercase text-blue-900 outline-none"
                >
                    {Object.values(ProductTab).map(tab => <option key={tab} value={tab}>{tab}</option>)}
                </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
        {activeTab === ProductTab.OVERVIEW && (
          <section className="space-y-8 sm:space-y-12">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-[32px] sm:rounded-[48px] p-8 sm:p-20 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-2 mb-6 sm:mb-8">
                    <span className="bg-amber-400 text-blue-900 px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-widest shadow-lg">Esclusivo Advisor</span>
                  </div>
                  <h2 className="text-4xl sm:text-7xl font-black mb-6 sm:mb-8 leading-[1] tracking-tighter italic">Evoluzione e Protezione.</h2>
                  <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 leading-relaxed opacity-90 font-medium">
                    Sfrutta la stabilità della Gestione Separata Zurich Trend e l'opportunità dei mercati finanziari.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => setActiveTab(ProductTab.SIMULATOR)} 
                        className="bg-white text-blue-900 px-8 py-4 rounded-xl font-black text-sm sm:text-base shadow-xl hover:bg-blue-50 transition-all active:scale-95"
                    >
                        Inizia Simulazione
                    </button>
                  </div>
               </div>
               {/* Background Elements */}
               <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-blue-700/30 rounded-full blur-[80px]"></div>
               <div className="absolute -bottom-12 -left-12 w-48 sm:w-72 h-48 sm:h-72 bg-sky-500/20 rounded-full blur-[60px]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">🛡️</div>
                    <h3 className="text-blue-900 font-black text-sm uppercase tracking-widest mb-2">Multiramo</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Equilibrio perfetto tra Ramo I (Trend) e Ramo III (Unit Linked) con switch gratuiti.</p>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl mb-4">✨</div>
                    <h3 className="text-blue-900 font-black text-sm uppercase tracking-widest mb-2">Bonus Campagna</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">+1.00% sul premio iniziale e bonus fedeltà progressivi fino all'1.50% su Ramo I.</p>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4">📊</div>
                    <h3 className="text-blue-900 font-black text-sm uppercase tracking-widest mb-2">Vantaggi Fiscali</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Esenzione imposta di successione e tassazione agevolata per la quota Titoli di Stato.</p>
                </div>
            </div>
          </section>
        )}

        {activeTab === ProductTab.SIMULATOR && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-10">
              <div className="xl:col-span-1 bg-white p-6 sm:p-10 rounded-[32px] border border-slate-200 shadow-lg space-y-8">
                <div className="space-y-4">
                   <h3 className="text-xl font-black text-blue-900 tracking-tighter italic uppercase">Personalizza Simulazione</h3>
                   <div className="flex gap-2">
                      {(['A', 'B', 'C'] as const).map((id) => (
                        <button key={id} onClick={() => setActiveCPP(id)} className={`flex-1 py-3 rounded-xl text-[10px] font-black border-2 transition-all ${activeCPP === id ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}>CPP {id}</button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Premio Unico (€)</label>
                  <input type="number" step="5000" value={simState.initialPremium} onChange={(e) => setSimState({...simState, initialPremium: Number(e.target.value)})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-900 outline-none font-black text-2xl text-blue-900" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <span>Orizzonte Temporale</span>
                      <span className="text-blue-900">{simState.years} anni</span>
                  </div>
                  <input type="range" min="1" max="25" step="1" value={simState.years} onChange={(e) => setSimState({...simState, years: Number(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                   <div className="space-y-3">
                      <div className="flex justify-between items-end"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rendimento Trend (GS)</span><span className="text-lg font-black text-blue-900">{simState.expectedReturnGS.toFixed(2)}%</span></div>
                      <input type="range" min="0" max="6" step="0.1" value={simState.expectedReturnGS} onChange={(e) => setSimState({...simState, expectedReturnGS: Number(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex justify-between items-end"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rendimento Linea Unit</span><span className="text-lg font-black text-sky-600">{simState.expectedReturnLG.toFixed(2)}%</span></div>
                      <input type="range" min="-5" max="15" step="0.5" value={simState.expectedReturnLG} onChange={(e) => setSimState({...simState, expectedReturnLG: Number(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                   </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                   <div className="flex justify-between font-black text-[9px] uppercase text-slate-400 tracking-widest">
                       <span>Composizione Portafoglio</span>
                       <span className="text-blue-900">{simState.gestioneSeparataWeight}% GS</span>
                   </div>
                   <input type="range" min="10" max="90" step="1" value={simState.gestioneSeparataWeight} onChange={(e) => handleWeightChange(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${simState.applyCampaignBonus ? 'bg-blue-50/50 border-blue-900' : 'bg-slate-50 border-slate-100 opacity-60'}`} onClick={() => setSimState({...simState, applyCampaignBonus: !simState.applyCampaignBonus})}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${simState.applyCampaignBonus ? 'bg-blue-900 border-blue-900 text-white' : 'border-slate-300'}`}>
                        {simState.applyCampaignBonus && '✓'}
                      </div>
                      <div className="flex flex-col"><span className="text-[11px] font-black text-blue-900 uppercase">Campagna Dec 2025</span><span className="text-[8px] text-blue-600 font-bold uppercase">+1.0% Iniziale + Fedeltà</span></div>
                    </div>
                  </div>
                  {selectedCPP.canSacrifice && (
                    <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${simState.applySacrificeBonus ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-slate-100 opacity-60'}`} onClick={() => setSimState({...simState, applySacrificeBonus: !simState.applySacrificeBonus})}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${simState.applySacrificeBonus ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'}`}>
                          {simState.applySacrificeBonus && '✓'}
                        </div>
                        <div className="flex flex-col"><span className="text-[11px] font-black text-amber-900 uppercase">Opzione Sacrifice</span><span className="text-[8px] text-amber-600 font-bold uppercase">+1.0% Premio Lordo</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="xl:col-span-2">
                <Calculator state={simState} activeCPP={activeCPP} />
              </div>
            </div>
          </div>
        )}

        {activeTab === ProductTab.PROTECTION && <ProductProtection gsWeight={simState.gestioneSeparataWeight} />}
        {activeTab === ProductTab.TECHNICAL_SHEET && <ProductDetails />}
        {activeTab === ProductTab.FULL_SHEET && <ProductTechnicalSheet />}
        {activeTab === ProductTab.COSTS && (
          <div className="space-y-8 sm:space-y-12 animate-fade-in">
            <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-200 shadow-lg overflow-hidden">
              <h3 className="text-xl sm:text-2xl font-black text-blue-900 mb-6 italic uppercase tracking-tighter">Architettura Costi Gestione</h3>
              <div className="overflow-x-auto no-scrollbar -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="p-4 sm:p-5">Classe Premio</th>
                      <th className="p-4 sm:p-5">Gestione Separata</th>
                      <th className="p-4 sm:p-5">Linea (1-5 Anni)</th>
                      <th className="p-4 sm:p-5">Linea (Oltre 5 Anni)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-xs sm:text-sm">
                    {CPP_CLASSES.map(c => (
                      <tr key={c.id} className={activeCPP === c.id ? "bg-blue-50/40" : ""}>
                        <td className="p-4 sm:p-5 text-blue-900 font-black">{c.label}</td>
                        <td className="p-4 sm:p-5">{c.gsFee.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5">{c.lgFee5Y.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5">{c.lgFeeAfter5Y.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-200 shadow-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl sm:text-2xl font-black text-red-600 italic uppercase tracking-tighter">Penali di Riscatto</h3>
                <span className="text-[10px] font-black bg-red-50 text-red-600 px-3 py-1 rounded-full uppercase">Nessuna penale dal 6° anno</span>
              </div>
              <div className="overflow-x-auto no-scrollbar -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-red-50 text-[10px] font-black uppercase text-red-400 tracking-widest">
                    <tr>
                      <th className="p-4 sm:p-5">Classe</th>
                      <th className="p-4 sm:p-5">1° Anno</th>
                      <th className="p-4 sm:p-5">2° Anno</th>
                      <th className="p-4 sm:p-5">3° Anno</th>
                      <th className="p-4 sm:p-5">4° Anno</th>
                      <th className="p-4 sm:p-5">5° Anno</th>
                      <th className="p-4 sm:p-5">6°+ Anno</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-xs sm:text-sm">
                    {CPP_CLASSES.map(c => (
                      <tr key={c.id} className={activeCPP === c.id ? "bg-red-50/10" : ""}>
                        <td className="p-4 sm:p-5 font-black">{c.label}</td>
                        <td className="p-4 sm:p-5 text-red-600">{c.penalties.y1.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5 text-red-600">{c.penalties.y2.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5 text-red-600">{c.penalties.y3.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5 text-red-600">{c.penalties.y4.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5 text-red-600">{c.penalties.y5.toFixed(2)}%</td>
                        <td className="p-4 sm:p-5 text-green-600 font-black">0.00%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-12 sm:py-20 mt-auto border-t-[10px] sm:border-t-[16px] border-blue-900 text-center px-4">
         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-900 font-black text-2xl mb-6 mx-auto shadow-2xl transition-transform hover:scale-110">Z</div>
         <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-2">Zurich Multinvest Plus | Advisory Ecosystem</p>
         <p className="text-slate-500 font-bold text-[8px] uppercase tracking-[0.4em] max-w-xs mx-auto">
           Riservato agli intermediari assicurativi e consulenti finanziari. 
           Editing: <span className="text-slate-300">Raffaele Camposano Gruppo Vomero</span>
         </p>
      </footer>
    </div>
  );
};

export default App;
