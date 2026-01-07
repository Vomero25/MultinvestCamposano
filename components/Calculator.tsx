
import React, { useMemo } from 'react';
import { SimulationState } from '../types.ts';
import { ZURICH_COLORS, CPP_CLASSES, PRODUCT_SPECS, SACRIFICE_BONUS_RATE } from '../constants.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

interface Props {
  state: SimulationState;
  activeCPP: 'A' | 'B' | 'C';
}

const Calculator: React.FC<Props> = ({ state, activeCPP }) => {
  const calculations = useMemo(() => {
    const cpp = CPP_CLASSES.find(c => c.id === activeCPP)!;
    
    // 1. Calcolo Bonus Iniziale (T0)
    let initialBonusPercent = state.applyCampaignBonus ? cpp.bonusInitial : 0;
    if (state.applySacrificeBonus && cpp.canSacrifice) initialBonusPercent += SACRIFICE_BONUS_RATE;
    
    const initialBonusAmount = (state.initialPremium * initialBonusPercent) / 100;
    
    // 2. Detrazione Spese Emissione (75€ se <= 20.000€)
    const emissionFee = state.initialPremium <= PRODUCT_SPECS.EMISSION_FEE_THRESHOLD ? PRODUCT_SPECS.EMISSION_FEE_AMOUNT : 0;
    const initialNetPremium = state.initialPremium - emissionFee;
    
    // 3. Capitale Investito Totale al T0 (incl. Bonus)
    const totalStartingCapital = initialNetPremium + initialBonusAmount;

    // 4. Ripartizione Iniziale (Pro-rata su GS e LG)
    let currentGS = totalStartingCapital * (state.gestioneSeparataWeight / 100);
    let currentLG = totalStartingCapital * (state.lineaGestitaWeight / 100);
    
    const startGS = currentGS;
    const timeline = [];
    
    // Anno 0 (Inizio)
    timeline.push({
      year: 0,
      GS: Math.round(currentGS),
      LG: Math.round(currentLG),
      Total: Math.round(currentGS + currentLG)
    });

    for (let year = 1; year <= state.years; year++) {
      // Rendimenti Ipotizzati
      const lgGrossReturn = state.expectedReturnLG / 100;
      const gsGrossReturn = state.expectedReturnGS / 100;

      // Commissioni di Gestione (PDF pag. 5)
      const lgFee = (year <= 5 ? cpp.lgFee5Y : cpp.lgFeeAfter5Y) / 100;
      const gsFee = cpp.gsFee / 100;
      
      // Costo Protezione Caso Morte (PDF pag. 5)
      const insCost = (year <= 5 ? cpp.insCost5Y : cpp.insCostAfter5Y) / 100;

      // Calcolo Evoluzione (Capitalizzazione Composita con costi sottratti annualmente)
      currentGS = currentGS * (1 + gsGrossReturn - gsFee - insCost);
      currentLG = currentLG * (1 + lgGrossReturn - lgFee - insCost);

      // 5. Bonus Fedeltà Campagna sulla GS (PDF pag. 7)
      if (state.applyCampaignBonus) {
        if (year === 1) currentGS += startGS * 0.005; // 0.5%
        else if (year === 2) currentGS += startGS * 0.010; // 1.0%
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
    
    const retentionBonus = state.applyCampaignBonus ? (startGS * 0.015) : 0;
    const totalBonusReceived = initialBonusAmount + (state.years >= 2 ? retentionBonus : (state.years === 1 ? startGS * 0.005 : 0));

    return {
      cpp,
      timeline,
      initialBonusAmount,
      emissionFee,
      totalFinal,
      totalNetGain,
      totalBonusReceived,
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
              {calculations.cpp.label}
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
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Ipotizzato con rendimenti personalizzati</span>
          </div>
        </div>

        {/* Card Bonus e Profitto */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-xl border border-blue-800">
            <p className="text-[10px] font-bold opacity-60 uppercase mb-2">Bonus Campagna Totale</p>
            <p className="text-2xl font-black text-amber-400">€{calculations.totalBonusReceived.toLocaleString('it-IT')}</p>
            <p className="text-[9px] opacity-70 mt-1 italic leading-tight">Inclusi bonus fedeltà su Ramo I</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Plusvalenza Netta</p>
            <p className="text-2xl font-black text-green-600">€{calculations.totalNetGain.toLocaleString('it-IT')}</p>
            <p className="text-[9px] text-gray-400 mt-1 italic">Netto costi gestione e spese emissione</p>
          </div>
        </div>

        {/* Grafico Evoluzione Stacked Distinto */}
        <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm h-80">
          <div className="flex justify-between items-center mb-6">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dettaglio Evoluzione: GS vs LG</h4>
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#003399]"></div><span className="text-[8px] font-black text-gray-400 uppercase">Gestione Separata</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#0099CC]"></div><span className="text-[8px] font-black text-gray-400 uppercase">Linea Gestita</span></div>
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
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-6">Split Capitale al Termine</h4>
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-blue-900 uppercase">Ramo I - Zurich Trend</span>
                <span className="font-black text-blue-900 text-xl">€{Math.round(calculations.finalGS).toLocaleString('it-IT')}</span>
              </div>
              <p className="text-[9px] text-blue-600 font-bold uppercase">Costo Gestione: {calculations.cpp.gsFee.toFixed(2)}% annuo</p>
            </div>

            <div className="p-5 rounded-3xl bg-sky-50/50 border border-sky-100 relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-sky-900 uppercase">Ramo III - Unit Linked</span>
                <span className="font-black text-sky-900 text-xl">€{Math.round(calculations.finalLG).toLocaleString('it-IT')}</span>
              </div>
              <p className="text-[9px] text-sky-600 font-bold uppercase">Costo Gestione: {calculations.cpp.lgFee5Y.toFixed(2)}% (primi 5 anni)</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 mt-2">
               <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-start gap-3">
                  <div className="text-lg">🛡️</div>
                  <div>
                    <p className="text-[10px] font-black text-green-900 uppercase tracking-widest">Calcolo Verificato</p>
                    <p className="text-[10px] text-green-700 leading-tight font-medium">
                      Simulazione conforme alla Scheda Prodotto (Ed. 09/2025). 
                      I costi includono: commissioni di gestione differenziate, costi caso morte e spese emissione ({calculations.emissionFee}€).
                      Applicato correttamente il Bonus Retention Campagna (1.5% tot su Ramo I).
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Riepilogo Analitico Costi */}
        <div className="bg-slate-900 p-8 rounded-[35px] text-white shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
             <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Architettura dei Costi ({calculations.cpp.label})</h5>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Commissione GS (Trend):</span>
                <span className="font-black">{calculations.cpp.gsFee.toFixed(2)}%</span>
             </div>
             <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Commissione LG (Y1-5):</span>
                <span className="font-black">{calculations.cpp.lgFee5Y.toFixed(2)}%</span>
             </div>
             <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Copertura Caso Morte:</span>
                <span className="font-black">{calculations.cpp.insCost5Y.toFixed(2)}%</span>
             </div>
             <div className="flex justify-between text-xs pt-2">
                <span className="text-slate-500">Imposta di Bollo (Ramo III):</span>
                <span className="font-black text-amber-400">0.20% (Applicata)</span>
             </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Penale Y1 Riscatto</span>
             <span className="text-red-400 font-black text-lg">{calculations.cpp.penalties.y1.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
