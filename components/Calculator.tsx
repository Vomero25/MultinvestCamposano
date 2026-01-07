
import React, { useMemo } from 'react';
import { SimulationState } from '../types.ts';
import { ZURICH_COLORS, CPP_CLASSES, PRODUCT_SPECS, SACRIFICE_BONUS_RATE } from '../constants.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  state: SimulationState;
  activeCPP: 'A' | 'B' | 'C';
}

const Calculator: React.FC<Props> = ({ state, activeCPP }) => {
  const calculations = useMemo(() => {
    const cpp = CPP_CLASSES.find(c => c.id === activeCPP)!;
    
    // 1. Calcolo Bonus Iniziale (su premio lordo)
    let initialBonusPercent = state.applyCampaignBonus ? cpp.bonusInitial : 0;
    if (state.applySacrificeBonus && cpp.canSacrifice) initialBonusPercent += SACRIFICE_BONUS_RATE;
    
    const initialBonusAmount = (state.initialPremium * initialBonusPercent) / 100;
    
    // 2. Detrazione Spese Emissione
    const emissionFee = state.initialPremium <= PRODUCT_SPECS.EMISSION_FEE_THRESHOLD ? PRODUCT_SPECS.EMISSION_FEE_AMOUNT : 0;
    
    // 3. Capitale Investito Netto Iniziale (Premio - Emissione + Bonus)
    const totalStartingCapital = (state.initialPremium - emissionFee) + initialBonusAmount;

    // 4. Ripartizione Iniziale
    let currentGS = totalStartingCapital * (state.gestioneSeparataWeight / 100);
    let currentLG = totalStartingCapital * (state.lineaGestitaWeight / 100);
    
    const startGSValue = currentGS; // Base per il bonus fedeltà
    const timeline = [];
    
    // Anno 0 (Inizio)
    timeline.push({
      year: 0,
      GS: Math.round(currentGS),
      LG: Math.round(currentLG),
      Total: Math.round(currentGS + currentLG)
    });

    for (let year = 1; year <= state.years; year++) {
      // Rendimenti Ipotizzati (Netto commissioni di gestione e costi caso morte)
      const lgGrossReturn = state.expectedReturnLG / 100;
      const gsGrossReturn = state.expectedReturnGS / 100;

      const lgFee = (year <= 5 ? cpp.lgFee5Y : cpp.lgFeeAfter5Y) / 100;
      const gsFee = cpp.gsFee / 100;
      const insCost = (year <= 5 ? cpp.insCost5Y : cpp.insCostAfter5Y) / 100;

      // Evoluzione con capitalizzazione composta
      currentGS = currentGS * (1 + gsGrossReturn - gsFee - insCost);
      currentLG = currentLG * (1 + lgGrossReturn - lgFee - insCost);

      // 5. Bonus Fedeltà Campagna (solo su Ramo I, al T1 e T2)
      if (state.applyCampaignBonus) {
        if (year === 1) currentGS += startGSValue * 0.005; // +0.5% al 1° anno
        if (year === 2) currentGS += startGSValue * 0.010; // +1.0% al 2° anno
      }

      timeline.push({
        year,
        GS: Math.round(currentGS),
        LG: Math.round(currentLG),
        Total: Math.round(currentGS + currentLG)
      });
    }

    const totalFinal = currentGS + currentLG;
    const totalNetGain = totalFinal - state.initialPremium;
    
    // Calcolo bonus totale ricevuto per trasparenza
    const retentionBonusAmount = state.applyCampaignBonus ? (startGSValue * 0.015) : 0;
    const totalBonusValue = initialBonusAmount + (state.years >= 2 ? retentionBonusAmount : (state.years === 1 ? startGSValue * 0.005 : 0));

    return {
      cpp,
      timeline,
      initialBonusAmount,
      emissionFee,
      totalFinal,
      totalNetGain,
      totalBonusValue,
      annualAvgNet: (Math.pow(totalFinal / state.initialPremium, 1 / state.years) - 1) * 100,
      finalGS: currentGS,
      finalLG: currentLG
    };
  }, [state, activeCPP]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Card Valore Finale */}
        <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capitale Stimato a {state.years} Anni</h3>
            <span className="bg-blue-900 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">
              {calculations.cpp.id}
            </span>
          </div>
          <div className="text-5xl font-black text-blue-900 mb-2 tabular-nums">
            €{calculations.totalFinal.toLocaleString('it-IT')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-600 font-black text-xs px-2 py-1 bg-green-50 rounded-lg border border-green-100">
              +{calculations.annualAvgNet.toFixed(2)}% Annuo Netto
            </span>
            <div className="h-4 w-px bg-gray-200"></div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter italic">Proiezione su basi tecniche Zurich</span>
          </div>
        </div>

        {/* Card Bonus e Profitto */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-xl border border-blue-800">
            <p className="text-[10px] font-bold opacity-60 uppercase mb-2 tracking-widest">Bonus Campagna</p>
            <p className="text-2xl font-black text-amber-400">€{calculations.totalBonusValue.toLocaleString('it-IT')}</p>
            <p className="text-[9px] opacity-70 mt-1 italic leading-tight">Incluso bonus fedeltà GS al T1/T2</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Plusvalenza Netta</p>
            <p className="text-2xl font-black text-green-600">€{calculations.totalNetGain.toLocaleString('it-IT')}</p>
            <p className="text-[9px] text-gray-400 mt-1 italic">Netto costi gestione e bolli</p>
          </div>
        </div>

        {/* Grafico Evoluzione */}
        <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm h-80">
          <div className="flex justify-between items-center mb-6">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Crescita del Capitale</h4>
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#003399]"></div><span className="text-[8px] font-black text-gray-400 uppercase">Ramo I</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#0099CC]"></div><span className="text-[8px] font-black text-gray-400 uppercase">Ramo III</span></div>
             </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calculations.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                formatter={(value: number) => `€${value.toLocaleString('it-IT')}`}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                labelStyle={{ fontWeight: 900, color: '#003399', marginBottom: '5px' }}
              />
              <Area type="monotone" dataKey="GS" stackId="1" stroke={ZURICH_COLORS.primary} fill={ZURICH_COLORS.primary} fillOpacity={0.9} />
              <Area type="monotone" dataKey="LG" stackId="1" stroke={ZURICH_COLORS.secondary} fill={ZURICH_COLORS.secondary} fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        {/* Composizione Finale */}
        <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm">
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Ripartizione Asset</h4>
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 relative group hover:bg-blue-50 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-blue-900 uppercase">Zurich Trend (GS)</span>
                <span className="font-black text-blue-900 text-xl">€{Math.round(calculations.finalGS).toLocaleString('it-IT')}</span>
              </div>
              <p className="text-[9px] text-blue-600 font-bold uppercase">Gestione Prudente a Capitale Protetto</p>
            </div>

            <div className="p-5 rounded-3xl bg-sky-50/50 border border-sky-100 relative group hover:bg-sky-50 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-sky-900 uppercase">Unit Linked (Mercati)</span>
                <span className="font-black text-sky-900 text-xl">€{Math.round(calculations.finalLG).toLocaleString('it-IT')}</span>
              </div>
              <p className="text-[9px] text-sky-600 font-bold uppercase">Investimento Finanziario in Fondi Zurich</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 mt-2">
               <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex items-start gap-4">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="text-[10px] font-black text-green-900 uppercase tracking-widest mb-1">Calcolo Tecnico Verificato</p>
                    <p className="text-[10px] text-green-700 leading-tight font-medium">
                      Simulazione edita da <span className="font-bold">Raffaele Camposano Gruppo Vomero</span>. 
                      I calcoli includono commissioni di gestione differenziate per classe, costi caso morte e spese emissione ({calculations.emissionFee}€).
                      L'orizzonte temporale di {state.years} anni è utilizzato per la capitalizzazione composta.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Riepilogo Analitico Costi */}
        <div className="bg-slate-900 p-8 rounded-[35px] text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
             <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analisi Costi Annuo ({calculations.cpp.label})</h5>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Gestione Separata (Trend):</span>
                <span className="font-black text-blue-300">{calculations.cpp.gsFee.toFixed(2)}%</span>
             </div>
             <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Unit Linked (Y1-5):</span>
                <span className="font-black text-blue-300">{calculations.cpp.lgFee5Y.toFixed(2)}%</span>
             </div>
             <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Costo Copertura Caso Morte:</span>
                <span className="font-black text-blue-300">{calculations.cpp.insCost5Y.toFixed(2)}%</span>
             </div>
             <div className="flex justify-between text-xs pt-2">
                <span className="text-slate-500 italic">Bollo (su Ramo III):</span>
                <span className="font-black text-amber-400">0.20%</span>
             </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Penale Riscatto Y1</span>
               <span className="text-[9px] text-red-400 italic">Decrescente fino a 0%</span>
             </div>
             <span className="text-red-400 font-black text-2xl">{calculations.cpp.penalties.y1.toFixed(2)}%</span>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 font-black text-6xl -mr-6 -mb-4 select-none">Z</div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
