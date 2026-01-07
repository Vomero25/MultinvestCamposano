
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0" 
              onClick={() => setActiveTab(ProductTab.OVERVIEW)}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg transition-all group-hover:bg-blue-800">Z</div>
              <div className="flex flex-col">
                 <h1 className="font-black text-sm sm:text-xl text-blue-900 tracking-tighter leading-none">Zurich Multinvest Plus</h1>
                 <span className="text-[8px] sm:text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-0.5">Advisor Ecosystem</span>
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
                className="bg-slate-100 border-none rounded-xl p-2.5 text-[10px] font-black uppercase text-blue-900 outline-none shadow-sm"
              >
                  {Object.values(ProductTab).map(tab => <option key={tab} value={tab}>{tab}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 animate-fade-in">
        {activeTab === ProductTab.OVERVIEW && (
          <section className="space-y-8 sm:space-y-16">
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-[32px] sm:rounded-[64px] p-8 sm:p-24 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10 max-w-4xl">
                  <div className="inline-flex items-center gap-2 bg-amber-400 text-blue-900 px-4 py-1.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-widest shadow-lg mb-8">
                    <span>Premium Tool</span>
                  </div>
                  <h2 className="text-4xl sm:text-8xl font-black mb-6 sm:mb-10 leading-[0.9] tracking-tighter italic">Valore che dura.</h2>
                  <p className="text-lg sm:text-2xl text-blue-100 mb-8 sm:mb-14 leading-relaxed font-medium opacity-90 max-w-2xl">
                    Proteggi il patrimonio con la Gestione Separata e cogli le opportunità dei mercati globali in un'unica soluzione d'eccellenza.
                  </p>
                  <button 
                    onClick={() => setActiveTab(ProductTab.SIMULATOR)} 
                    className="bg-white text-blue-900 px-8 py-4 sm:px-12 sm:py-6 rounded-2xl font-black text-sm sm:text-lg shadow-2xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
                  >
                    Calcola Bonus Campagna
                  </button>
               </div>
               <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-700/20 rounded-full blur-[100px]"></div>
            </div>
          </section>
        )}

        {activeTab === ProductTab.SIMULATOR && (
          <div className="space-y-6 sm:space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-12">
              <div className="xl:col-span-1 bg-white p-6 sm:p-12 rounded-[40px] border border-slate-200 shadow-xl space-y-10">
                <div className="space-y-5">
                   <h3 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tighter italic uppercase">Configurazione</h3>
                   <div className="flex gap-2">
                      {(['A', 'B', 'C'] as const).map((id) => (
                        <button key={id} onClick={() => setActiveCPP(id)} className={`flex-1 py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${activeCPP === id ? 'bg-blue-900 text-white border-blue-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}>CPP {id}</button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capitale Investito (€)</label>
                  <input type="number" step="5000" value={simState.initialPremium} onChange={(e) => setSimState({...simState, initialPremium: Number(e.target.value)})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 focus:border-blue-900 outline-none font-black text-3xl text-blue-900" />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <span>Orizzonte di Calcolo</span>
                    <span className="text-lg text-blue-900">{simState.years} anni</span>
                  </div>
                  <input type="range" min="1" max="25" step="1" value={simState.years} onChange={(e) => setSimState({...simState, years: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                </div>

                <div className="space-y-8 pt-6 border-t border-slate-100">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resa Gestione Separata</span><span className="text-xl font-black text-blue-900">{simState.expectedReturnGS.toFixed(2)}%</span></div>
                      <input type="range" min="0" max="6" step="0.1" value={simState.expectedReturnGS} onChange={(e) => setSimState({...simState, expectedReturnGS: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resa Linea Unit</span><span className="text-xl font-black text-sky-600">{simState.expectedReturnLG.toFixed(2)}%</span></div>
                      <input type="range" min="-5" max="15" step="0.5" value={simState.expectedReturnLG} onChange={(e) => setSimState({...simState, expectedReturnLG: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                   </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100">
                   <div className="flex justify-between font-black text-[10px] uppercase text-slate-400 tracking-widest"><span>Allocazione GS</span><span className="text-blue-900">{simState.gestioneSeparataWeight}%</span></div>
                   <input type="range" min="10" max="90" step="1" value={simState.gestioneSeparataWeight} onChange={(e) => handleWeightChange(Number(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${simState.applyCampaignBonus ? 'bg-blue-50/50 border-blue-900' : 'bg-slate-50 border-slate-100 opacity-60'}`} onClick={() => setSimState({...simState, applyCampaignBonus: !simState.applyCampaignBonus})}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${simState.applyCampaignBonus ? 'bg-blue-900 border-blue-900 text-white' : 'border-slate-300'}`}>
                        {simState.applyCampaignBonus && <span className="text-xs">✓</span>}
                      </div>
                      <div className="flex flex-col"><span className="text-xs font-black text-blue-900 uppercase">Campagna Zurich</span><span className="text-[9px] text-blue-600 font-bold uppercase">+1.0% Iniziale + Bonus Fedeltà</span></div>
                    </div>
                  </div>
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
          <div className="space-y-12 animate-fade-in">
            <div className="bg-white p-6 sm:p-12 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
              <h3 className="text-2xl font-black text-blue-900 mb-8 italic uppercase tracking-tighter">Costi di Gestione</h3>
              <div className="overflow-x-auto no-scrollbar -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="p-5">Classe Premio</th>
                      <th className="p-5">Gestione Separata</th>
                      <th className="p-5">Linea (1-5 Anni)</th>
                      <th className="p-5">Linea (Oltre 5 Anni)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-sm">
                    {CPP_CLASSES.map(c => (
                      <tr key={c.id} className={activeCPP === c.id ? "bg-blue-50/30" : ""}>
                        <td className="p-5 text-blue-900 font-black">{c.label}</td>
                        <td className="p-5">{c.gsFee.toFixed(2)}%</td>
                        <td className="p-5">{c.lgFee5Y.toFixed(2)}%</td>
                        <td className="p-5">{c.lgFeeAfter5Y.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-12 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
              <h3 className="text-2xl font-black text-red-600 mb-8 italic uppercase tracking-tighter">Penali di Riscatto</h3>
              <div className="overflow-x-auto no-scrollbar -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-red-50 text-[10px] font-black uppercase text-red-400 tracking-widest">
                    <tr>
                      <th className="p-5">Classe</th>
                      <th className="p-5">1 Anno</th>
                      <th className="p-5">2 Anno</th>
                      <th className="p-5">3 Anno</th>
                      <th className="p-5">4 Anno</th>
                      <th className="p-5">5 Anno</th>
                      <th className="p-5">Oltre 5 Anni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-sm">
                    {CPP_CLASSES.map(c => (
                      <tr key={c.id} className={activeCPP === c.id ? "bg-red-50/10" : ""}>
                        <td className="p-5 font-black">{c.label}</td>
                        <td className="p-5 text-red-600">{c.penalties.y1.toFixed(2)}%</td>
                        <td className="p-5 text-red-600">{c.penalties.y2.toFixed(2)}%</td>
                        <td className="p-5 text-red-600">{c.penalties.y3.toFixed(2)}%</td>
                        <td className="p-5 text-red-600">{c.penalties.y4.toFixed(2)}%</td>
                        <td className="p-5 text-red-600">{c.penalties.y5.toFixed(2)}%</td>
                        <td className="p-5 text-green-600 font-black">Nessuna</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-16 sm:py-24 mt-auto border-t-[16px] border-blue-900 text-center px-4">
         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-900 font-black text-3xl mb-8 mx-auto shadow-2xl">Z</div>
         <p className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-4">Zurich Multinvest Plus | Advisory Ecosystem</p>
         <div className="max-w-md mx-auto h-px bg-slate-800 mb-6"></div>
         <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.4em] leading-loose">
            editing: <span className="text-slate-300">Raffaele Camposano Gruppo Vomero</span><br/>
           RISERVATO AI PROFESSIONISTI DELLA CONSULENZA
         </p>
      </footer>
    </div>
  );
};

export default App;
