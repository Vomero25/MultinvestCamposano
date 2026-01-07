
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
    
    let initialBonusPercent = state.applyCampaignBonus ? cpp.bonusInitial : 0;
    if (state.applySacrificeBonus && cpp.canSacrifice) initialBonusPercent += SACRIFICE_BONUS_RATE;
    
    const initialBonusAmount = (state.initialPremium * initialBonusPercent) / 100;
    const emissionFee = state.initialPremium <= PRODUCT_SPECS.EMISSION_FEE_THRESHOLD ? PRODUCT_SPECS.EMISSION_FEE_AMOUNT : 0;
    const initialNetPremium = state.initialPremium - emissionFee;
    const totalStartingCapital = initialNetPremium + initialBonusAmount;

    let currentGS = totalStartingCapital * (state.gestioneSeparataWeight / 100);
    let currentLG = totalStartingCapital * (state.lineaGestitaWeight / 100);
    
    const startGS = currentGS;
    const timeline = [];
    
    timeline.push({
      year: 0,
      GS: Math.round(currentGS),
      LG: Math.round(currentLG),
      Total: Math.round(currentGS + currentLG)
    });

    for (let year = 1; year <= state.years; year++) {
      const lgGrossReturn = state.expectedReturnLG / 100;
      const gsGrossReturn = state.expectedReturnGS / 100;
      const lgFee = (year <= 5 ? cpp.lgFee5Y : cpp.lgFeeAfter5Y) / 100;
      const gsFee = cpp.gsFee / 100;
      const insCost = (year <= 5 ? cpp.insCost5Y : cpp.insCostAfter5Y) / 100;

      currentGS = currentGS * (1 + gsGrossReturn - gsFee - insCost);
      currentLG = currentLG * (1 + lgGrossReturn - lgFee - insCost);

      if (state.applyCampaignBonus) {
        if (year === 1) currentGS += startGS * 0.005;
        else if (year === 2) currentGS += startGS * 0.010;
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
      totalFinal,
      totalNetGain,
      totalBonusReceived,
      annualAvgNet: (Math.pow(totalFinal / state.initialPremium, 1 / state.years) - 1) * 100,
      finalGS: currentGS,
      finalLG: currentLG,
      emissionFee
    };
  }, [state, activeCPP]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <div className="space-y-6">
        {/* Card Risultato Principale */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-lg relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capitale Stimato a {state.years} Anni</h3>
            <span className="bg-blue-900 text-white text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
              {calculations.cpp.label}
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-blue-900 mb-2 tabular-nums tracking-tighter">
            €{calculations.totalFinal.toLocaleString('it-IT')}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-green-600 font-black text-[10px] sm:text-xs px-2 py-1 bg-green-50 rounded-lg border border-green-100 uppercase">
              +{calculations.annualAvgNet.toFixed(2)}% Annuo Netto
            </span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Mini Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900 p-5 rounded-2xl text-white shadow-xl">
            <p className="text-[9px] font-bold opacity-60 uppercase mb-1 tracking-widest">Bonus Totali</p>
            <p className="text-xl font-black text-amber-400 tracking-tighter">€{calculations.totalBonusReceived.toLocaleString('it-IT')}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Plusvalenza</p>
            <p className="text-xl font-black text-green-600 tracking-tighter">€{calculations.totalNetGain.toLocaleString('it-IT')}</p>
          </div>
        </div>

        {/* Grafico */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm h-72 sm:h-80">
          <div className="flex justify-between items-center mb-6">
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trend Evolutivo</h4>
             <div className="flex gap-2 text-[8px] font-black uppercase text-slate-400">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#003399]"></div>GS</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#0099CC]"></div>LG</div>
             </div>
          </div>
          <div className="h-full -ml-4">
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={calculations.timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(value: number) => `€${value.toLocaleString('it-IT')}`}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="GS" stackId="1" stroke={ZURICH_COLORS.primary} fill={ZURICH_COLORS.primary} fillOpacity={0.9} />
                <Area type="monotone" dataKey="LG" stackId="1" stroke={ZURICH_COLORS.secondary} fill={ZURICH_COLORS.secondary} fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-6">Composizione al Termine</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-900 uppercase">Ramo I - Zurich Trend</span>
                <span className="font-black text-blue-900 text-lg">€{Math.round(calculations.finalGS).toLocaleString('it-IT')}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-900 h-full" style={{ width: `${(calculations.finalGS / calculations.totalFinal) * 100}%` }}></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-sky-700 uppercase">Ramo III - Unit Linked</span>
                <span className="font-black text-sky-800 text-lg">€{Math.round(calculations.finalLG).toLocaleString('it-IT')}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-sky-500 h-full" style={{ width: `${(calculations.finalLG / calculations.totalFinal) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="pt-4 mt-2">
               <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                  <div className="text-base">🛡️</div>
                  <p className="text-[10px] text-green-700 leading-tight font-medium italic">
                    I calcoli includono costi di gestione, costi caso morte e spese emissione ({calculations.emissionFee}€), conformemente alla Scheda Prodotto (Ed. 09/2025).
                  </p>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 sm:p-8 rounded-[32px] text-white shadow-xl">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
            Overview Tecnica {calculations.cpp.label}
          </h5>
          <div className="space-y-4">
             {[
               { label: 'Comm. Trend (GS)', value: `${calculations.cpp.gsFee.toFixed(2)}%` },
               { label: 'Comm. Unit (Y1-5)', value: `${calculations.cpp.lgFee5Y.toFixed(2)}%` },
               { label: 'Caso Morte (Y1-5)', value: `${calculations.cpp.insCost5Y.toFixed(2)}%` },
               { label: 'Bollo Ramo III', value: '0.20% (Escluso GS)' }
             ].map((item, idx) => (
               <div key={idx} className="flex justify-between text-[11px] border-b border-slate-800 pb-2">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-black">{item.value}</span>
               </div>
             ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
             <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Penale Riscatto Y1</span>
             <span className="text-red-400 font-black text-lg">{calculations.cpp.penalties.y1.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
