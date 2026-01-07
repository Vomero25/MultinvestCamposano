
import React, { useState, useEffect, useMemo } from 'react';
import { SimulationState, ProductTab } from './types';
import { ZURICH_COLORS, CPP_CLASSES, PRODUCT_SPECS, CAMPAIGN_DATES, SACRIFICE_BONUS_RATE } from './constants';
import Calculator from './components/Calculator';
import ProductDetails from './components/ProductDetails';
import ProductTechnicalSheet from './components/ProductTechnicalSheet';
import { getWealthProtectionInsight } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductTab>(ProductTab.OVERVIEW);
  const [activeCPP, setActiveCPP] = useState<'A' | 'B' | 'C'>('B');
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [homeFeatureTab, setHomeFeatureTab] = useState<'SOGGETTI' | 'PREMI' | 'COPERTURE' | 'OPZIONI' | 'RENDITE'>('SOGGETTI');

  const [simState, setSimState] = useState<SimulationState>({
    initialPremium: 100000,
    gestioneSeparataWeight: 50,
    lineaGestitaWeight: 50,
    expectedReturnGS: 2.87, // Rendimento certificato Settembre 2025
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

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const text = await getWealthProtectionInsight(simState.gestioneSeparataWeight);
      setInsight(text || '');
      setLoadingInsight(false);
    };
    if (activeTab === ProductTab.PROTECTION) {
      fetchInsight();
    }
  }, [activeTab, simState.gestioneSeparataWeight]);

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">Z</div>
            <div>
               <h1 className="font-black text-lg text-blue-900 leading-none">Zurich Multinvest Plus</h1>
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter leading-tight">Advisor Gruppo Vomero Gm Camposano</span>
                 <span className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">Platform 2025/2026</span>
               </div>
            </div>
          </div>
          <nav className="hidden xl:flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {Object.values(ProductTab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-black rounded-full transition-all uppercase tracking-widest whitespace-nowrap ${
                  activeTab === tab ? 'bg-blue-900 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {activeTab === ProductTab.OVERVIEW && (
          <section className="space-y-12 animate-in fade-in duration-700">
            <div className="bg-blue-900 rounded-[40px] p-16 text-white relative overflow-hidden shadow-2xl border-4 border-white/10">
               <div className="relative z-10 max-w-3xl">
                  <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Offerta Premium</span>
                  <h2 className="text-6xl font-black mb-6 leading-tight tracking-tighter">Solidità Zurich, Visione Advisor.</h2>
                  <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium">
                    Gestione Separata Zurich Trend certificata al 2.87%. Un'opportunità multiramo per bilanciare rendimento finanziario e stabilità assicurativa con bonus fedeltà fino al 2.5%.
                  </p>
                  <div className="flex gap-4">
                     <button onClick={() => setActiveTab(ProductTab.SIMULATOR)} className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-50 transition-all">Lancia Simulatore</button>
                     <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                        <span className="text-[10px] font-bold text-blue-200 uppercase block mb-1">Periodo Campagna</span>
                        <span className="font-black">{CAMPAIGN_DATES}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-50 bg-slate-50/50 p-6">
                <h3 className="text-blue-900 font-black uppercase tracking-tighter text-xl mb-6">Caratteristiche Prodotto in Sintesi</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'SOGGETTI', label: 'Soggetti' },
                    { id: 'PREMI', label: 'Premi e Versamenti' },
                    { id: 'COPERTURE', label: 'Caso Morte' },
                    { id: 'OPZIONI', label: 'Opzioni' },
                    { id: 'RENDITE', label: 'Rendite' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHomeFeatureTab(tab.id as any)}
                      className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        homeFeatureTab === tab.id 
                          ? 'bg-blue-900 text-white shadow-md scale-105' 
                          : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-10 min-h-[220px]">
                {homeFeatureTab === 'SOGGETTI' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 text-xl font-black">C</div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contraente</p>
                          <p className="text-sm font-bold text-blue-900">Persona Fisica (min. 18 anni) o Persona Giuridica.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 text-xl font-black">A</div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assicurato</p>
                          <p className="text-sm font-bold text-blue-900">Persona Fisica con età 18-85 anni (età assicurativa).</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3">Forma Tariffaria</p>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                        "Contratto di assicurazione di tipo Multiramo a vita intera e a premio unico, integrabile con premi unici aggiuntivi e versamenti programmati."
                      </p>
                    </div>
                  </div>
                )}
                {homeFeatureTab === 'PREMI' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest border-l-4 border-blue-900 pl-3">Premi Unici Iniziali</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                          <p className="text-[9px] font-black text-blue-900 uppercase">CPP A e B</p>
                          <p className="text-lg font-black text-blue-900">15.000 €</p>
                        </div>
                        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                          <p className="text-[9px] font-black text-sky-900 uppercase">CPP C</p>
                          <p className="text-lg font-black text-sky-900">250.000 €</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest border-l-4 border-blue-900 pl-3">Premi Aggiuntivi</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-500 uppercase">CPP A e B</p>
                          <p className="text-lg font-black text-slate-700">1.200 €</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-500 uppercase">CPP C</p>
                          <p className="text-lg font-black text-slate-700">48.000 €</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {homeFeatureTab === 'COPERTURE' && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest border-l-4 border-blue-900 pl-3">1) Copertura Standard</h4>
                        <p className="text-xs text-slate-500 mb-4">Maggiorazione valida per tutta la durata del Contratto:</p>
                        <div className="space-y-2">
                          {[
                            { eta: "Fino a 65 anni", val: "+10%" },
                            { eta: "Da 66 a 70 anni", val: "+5%" },
                            { eta: "Oltre 70 anni", val: "+1%" }
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                              <span className="text-xs font-bold text-slate-600">{item.eta}</span>
                              <span className="text-sm font-black text-blue-900">{item.val}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-gray-400 italic">L'incremento non può superare 200.000 €.</p>
                      </div>
                      
                      <div className="bg-blue-50 p-8 rounded-[35px] border border-blue-100">
                         <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4">Note sulla Protezione</h4>
                         <p className="text-xs text-blue-800 leading-relaxed font-medium italic">
                           "In caso di decesso dell'Assicurato, il controvalore delle quote ed il capitale maturato nella Gestione Separata viene incrementato delle percentuali indicate, garantendo un surplus di liquidità immediata ai beneficiari."
                         </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest border-l-4 border-blue-900 pl-3">2) Prestazione caso morte minima garantita</h4>
                      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-50">
                            <tr className="border-b border-slate-100">
                              <th className="p-4 font-black text-slate-400 uppercase">Età al decesso</th>
                              <th className="p-4 font-black text-slate-400 uppercase">Decesso entro il 5° anno</th>
                              <th className="p-4 font-black text-slate-400 uppercase">Decesso dopo il 5° anno</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 font-bold">
                            <tr>
                              <td className="p-4 text-blue-900">≤ 65 anni*</td>
                              <td className="p-4 text-slate-700">Max tra: <br/>• Premio versato <br/>• Valore Polizza x 110%</td>
                              <td className="p-4 text-slate-700">Valore Totale Polizza x 110%</td>
                            </tr>
                            <tr>
                              <td className="p-4 text-blue-900">Oltre 65 e fino a 70 anni*</td>
                              <td className="p-4 text-slate-700">Max tra: <br/>• Premio versato <br/>• Valore Polizza x 105%</td>
                              <td className="p-4 text-slate-700">Valore Totale Polizza x 105%</td>
                            </tr>
                            <tr>
                              <td className="p-4 text-blue-900">> 70 anni*</td>
                              <td className="p-4 text-slate-700">Valore Totale Polizza x 101%</td>
                              <td className="p-4 text-slate-700">Valore Totale Polizza x 101%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[9px] text-slate-400">*Età assicurativa. Con Valore Polizza si intende Controvalore quote + Gestione Separata rivalutata.</p>
                    </div>
                  </div>
                )}
                {homeFeatureTab === 'OPZIONI' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    {[
                      { title: "Life Cycle", desc: "Switch automatico verso GS basato sull'età." },
                      { title: "Take Profit", desc: "Consolidamento automatico plusvalenze (soglia 5%/10%)." },
                      { title: "Switch", desc: "Illimitati e gratuiti tra fondi (esclusa GS)." },
                      { title: "Decumulo", desc: "Erogazioni periodiche (3%/5%) se capitale > 30k €." }
                    ].map((opt, i) => (
                      <div key={i} className="p-5 border border-gray-100 rounded-3xl hover:bg-slate-50 transition-all">
                        <p className="text-xs font-black text-blue-900 uppercase tracking-tighter mb-2">{opt.title}</p>
                        <p className="text-[10px] text-gray-500 font-medium leading-tight">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                {homeFeatureTab === 'RENDITE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2 border-b border-blue-100 pb-1">Opzioni di Conversione (min. 5 anni)</p>
                      {[
                        "Rendita annua vitalizia rivalutabile",
                        "Rendita vitalizia con controassicurazione",
                        "Rendita certa nei primi 5 o 10 anni e poi vitalizia",
                        "Rendita vitalizia reversibile",
                        "Rendita certa per 5 o 10 anni (pagata posticipata)"
                      ].map((rend, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
                          <span className="text-xs font-bold text-slate-700">{rend}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center">
                      <p className="text-[11px] text-amber-900 font-medium leading-relaxed italic">
                        "L'opzione di rendita permette di trasformare il capitale maturato in un flusso di reddito periodico, garantendo sicurezza economica a lungo termine."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Incentivo Iniziale", val: "1.0%", desc: "Bonus immediato sul premio unico per tutto il portafoglio.", icon: "🎯" },
                { 
                  title: "Loyalty Ramo I", 
                  val: "0.5% + 1.0%", 
                  desc: "Bonus fedeltà sulla Gestione Separata: 0.5% alla fine del 1° anno e 1.0% alla fine del 2° anno.", 
                  icon: "💎" 
                },
                { title: "Cap Protezione", val: "90%", desc: "Allocation Ramo I fino al 90% per una protezione patrimoniale massima.", icon: "🛡️" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                   <span className="text-4xl mb-6 block group-hover:rotate-12 transition-transform">{item.icon}</span>
                   <h3 className="text-blue-900 font-black text-xl mb-1">{item.title}</h3>
                   <p className="text-3xl font-black text-blue-600 mb-4">{item.val}</p>
                   <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === ProductTab.SIMULATOR && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-1 bg-white p-10 rounded-[35px] border border-gray-100 shadow-sm space-y-8">
                <div>
                   <h3 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tighter">Setting Parametri</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Profilo Investimento</p>
                   <div className="flex gap-2 mb-8">
                      {['A', 'B', 'C'].map((id) => (
                        <button
                          key={id}
                          onClick={() => setActiveCPP(id as any)}
                          className={`flex-1 py-3 rounded-2xl text-xs font-black border transition-all ${
                            activeCPP === id ? 'bg-blue-900 text-white border-blue-900 shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          CPP {id}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capitale Investito (€)</label>
                  <input 
                    type="number"
                    value={simState.initialPremium}
                    onChange={(e) => setSimState({...simState, initialPremium: Number(e.target.value)})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-blue-900 outline-none transition-all font-black text-2xl text-blue-900"
                  />
                  <p className="text-[10px] text-gray-400 font-medium italic">Minimo per Classe {activeCPP}: {selectedCPP.minInitial.toLocaleString()} €</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                   <div className="flex justify-between items-center">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orizzonte Temporale</label>
                     <span className="text-lg font-black text-blue-900">{simState.years} anni</span>
                   </div>
                   <input 
                    type="range" min="1" max="25"
                    value={simState.years}
                    onChange={(e) => setSimState({...simState, years: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                </div>

                <div className="space-y-5 pt-4 border-t border-gray-50">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      <span>Rendimento Annuo GS (%)</span>
                      <span className="text-blue-900 font-black">{simState.expectedReturnGS.toFixed(2)}%</span>
                   </div>
                   <input 
                    type="range" min="0" max="8" step="0.1"
                    value={simState.expectedReturnGS}
                    onChange={(e) => setSimState({...simState, expectedReturnGS: Number(e.target.value)})}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest pt-2">
                      <span>Rendimento Annuo LG (%)</span>
                      <span className="text-sky-600 font-black">{simState.expectedReturnLG.toFixed(2)}%</span>
                   </div>
                   <input 
                    type="range" min="-10" max="20" step="0.5"
                    value={simState.expectedReturnLG}
                    onChange={(e) => setSimState({...simState, expectedReturnLG: Number(e.target.value)})}
                    className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div className="space-y-5 pt-4 border-t border-gray-50">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      <span>Allocation Ramo I / Ramo III</span>
                   </div>
                   <div className="flex justify-between font-black text-sm">
                      <span className="text-blue-900">GS: {simState.gestioneSeparataWeight}%</span>
                      <span className="text-sky-500">LG: {simState.lineaGestitaWeight}%</span>
                   </div>
                   <input 
                    type="range" min="10" max="90" step="5"
                    value={simState.gestioneSeparataWeight}
                    onChange={(e) => handleWeightChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Incentivi Advisor</h4>
                  
                  <div className={`p-4 rounded-2xl border transition-all ${simState.applyCampaignBonus ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input 
                        type="checkbox" checked={simState.applyCampaignBonus}
                        onChange={(e) => setSimState({...simState, applyCampaignBonus: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-blue-900"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-blue-900">Bonus Campagna (+1%)</span>
                        <span className="text-[9px] text-blue-700 font-bold uppercase tracking-tight">Sull'intero versamento</span>
                      </div>
                    </label>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-all ${selectedCPP.canSacrifice ? (simState.applySacrificeBonus ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100') : 'opacity-20 grayscale cursor-not-allowed'}`}>
                    <label className={`flex items-center gap-4 ${selectedCPP.canSacrifice ? 'cursor-pointer' : ''}`}>
                      <input 
                        type="checkbox" disabled={!selectedCPP.canSacrifice}
                        checked={simState.applySacrificeBonus}
                        onChange={(e) => setSimState({...simState, applySacrificeBonus: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-amber-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-amber-900">Sacrifice Bonus CF (+{SACRIFICE_BONUS_RATE}%)</span>
                        <span className="text-[9px] text-amber-700 font-bold uppercase tracking-tight">Esclusivo per Classe A</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-2">
                <Calculator state={simState} activeCPP={activeCPP} />
              </div>
            </div>
          </div>
        )}

        {activeTab === ProductTab.TECHNICAL_SHEET && (
          <ProductDetails />
        )}

        {activeTab === ProductTab.FULL_SHEET && (
          <ProductTechnicalSheet />
        )}

        {activeTab === ProductTab.COSTS && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
            <section className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-blue-900 mb-10 text-center uppercase tracking-tighter italic">Griglia Costi Gestione</h2>
              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-inner">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Classe Premi</th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">GS (Ramo I)</th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Linea (Y1-5)</th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Linea (Y6+)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-bold text-sm">
                    {CPP_CLASSES.map(c => (
                      <tr key={c.id} className={activeCPP === c.id ? "bg-blue-50/50" : ""}>
                        <td className="p-5">
                          <span className="text-blue-900 block font-black">{c.label}</span>
                          <span className="text-[10px] text-gray-400 font-medium">Soglia: {c.minInitial.toLocaleString()} €</span>
                        </td>
                        <td className="p-5 text-blue-800 font-black">{c.gsFee.toFixed(2)}%</td>
                        <td className="p-5 text-sky-700 font-black">{c.lgFee5Y.toFixed(2)}%</td>
                        <td className="p-5 text-sky-500 font-black">{c.lgFeeAfter5Y.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === ProductTab.PROTECTION && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
              <h2 className="text-4xl font-black text-blue-900 mb-8 tracking-tighter">Valore dello Scudo Assicurativo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                 <div className="p-10 bg-blue-50 rounded-[35px] border border-blue-100 group hover:bg-blue-900 hover:text-white transition-all duration-500">
                    <div className="text-4xl mb-6">🏦</div>
                    <h4 className="font-black text-lg mb-3 uppercase tracking-tighter">Protezione Civile</h4>
                    <p className="text-sm leading-relaxed font-medium opacity-80">Capitale impignorabile e insequestrabile ex art. 1923 c.c. Ideale per la tutela del patrimonio familiare dai rischi professionali.</p>
                 </div>
                 <div className="p-10 bg-sky-50 rounded-[35px] border border-sky-100 group hover:bg-blue-900 hover:text-white transition-all duration-500">
                    <div className="text-4xl mb-6">📜</div>
                    <h4 className="font-black text-lg mb-3 uppercase tracking-tighter">Efficienza Fiscale</h4>
                    <p className="text-sm leading-relaxed font-medium opacity-80">Esclusione totale dall'asse ereditario. Esenzione dall'imposta di successione e tassazione agevolata sulle plusvalenze (fino al 12.5% per quota Titoli di Stato).</p>
                 </div>
              </div>
              <div className="pt-8 border-t border-gray-100">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
                    <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest">Analisi Patrimonio (Gemini AI)</h4>
                 </div>
                 {loadingInsight ? (
                   <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                   </div>
                 ) : (
                   <div className="bg-slate-50 p-8 rounded-3xl text-slate-700 leading-relaxed italic text-sm border border-slate-100 shadow-inner">
                      {insight}
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {activeTab === ProductTab.CASES && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
            {[
              {
                title: "Passaggio Generazionale Imprenditore",
                scenario: "Imprenditore di 55 anni con 1M in CPP C, allocato al 90% in Ramo I per minimizzare volatilità.",
                solution: "Protezione massima dal rischio d'impresa e trasmissione agevolata ai figli fuori dall'attivo ereditario, garantendo liquidità immediata.",
                impact: "Impignorabilità | Tassa Successione 0%"
              },
              {
                title: "Ottimizzazione Fiscale Professionista",
                scenario: "Professionista con 50k in CPP A, attiva Sacrifice CF (+1%) e Bonus Campagna (+1%).",
                solution: "Bonus d'ingresso del 2% che neutralizza i costi di gestione del primo anno. Focus sulla stabilità del Ramo I certificato al 2.87%.",
                impact: "Bonus 2% | Stabilità Garantita"
              },
              {
                title: "Tutela del Patrimonio Immobiliare",
                scenario: "Liquidità derivante da vendita asset, reinvestita al 70% in GS per creare uno scudo civile.",
                solution: "Utilizzo della Gestione Separata come 'Asset Class di Protezione' per bilanciare l'esposizione al mercato immobiliare.",
                impact: "Scudo Civile | Rendimento 2.87%"
              },
              {
                title: "Life Cycle per il Pensionamento",
                scenario: "Soggetto di 45 anni con orizzonte 20 anni. Allocation dinamica iniziale.",
                solution: "Uso del Life Cycle per spostare progressivamente il capitale verso la Gestione Separata man mano che si avvicina l'età della pensione.",
                impact: "Automazione | Riduzione Rischio"
              }
            ].map((c, i) => (
              <div key={i} className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-2xl transition-all border-b-8 border-transparent hover:border-blue-900">
                <div>
                  <h3 className="text-2xl font-black text-blue-900 mb-6 leading-tight uppercase tracking-tighter">{c.title}</h3>
                  <div className="space-y-6">
                     <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Scenario Advisor</span>
                        <p className="text-gray-600 text-sm italic font-medium leading-relaxed">"{c.scenario}"</p>
                     </div>
                     <div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Soluzione Zurich</span>
                        <p className="text-blue-900 font-bold text-sm leading-relaxed">{c.solution}</p>
                     </div>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{c.impact}</span>
                  <span className="text-xl">🛡️</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 py-20 mt-20 border-t-8 border-blue-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-8 flex items-center justify-center text-blue-900 font-black text-3xl shadow-2xl">Z</div>
           <div className="flex justify-center items-center gap-10 text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <span>Advisor Gruppo Vomero Gm Camposano</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Platform Ed. 09.2025</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
