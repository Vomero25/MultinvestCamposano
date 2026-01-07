
import React, { useState, useEffect } from 'react';
import { getWealthProtectionInsight } from '../services/geminiService.ts';

const ProductProtection: React.FC<{ gsWeight: number }> = ({ gsWeight }) => {
  const [insight, setInsight] = useState<string>('Analisi strategica in corso...');

  useEffect(() => {
    getWealthProtectionInsight(gsWeight).then(setInsight);
  }, [gsWeight]);

  const scenarios = [
    {
      title: "Tutela Legale",
      case: "Imprenditori e Liberi Professionisti.",
      benefit: "Il capitale in gestione Zurich è impignorabile e insequestrabile (art. 1923 c.c.).",
      icon: "🛡️"
    },
    {
      title: "Passaggio Generazionale",
      case: "Pianificazione successoria.",
      benefit: "Esenzione totale dall'imposta di successione e fuoriuscita dall'asse ereditario.",
      icon: "🏛️"
    },
    {
      title: "Efficienza Fiscale",
      case: "Ottimizzazione rendimenti.",
      benefit: "Tassazione agevolata sulla quota Titoli di Stato e compensazione minusvalenze.",
      icon: "📊"
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl">
        <h3 className="text-2xl font-black text-blue-900 mb-6 italic uppercase tracking-tighter">
          Advisory AI: Protezione Patrimoniale
        </h3>
        <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 text-blue-900 font-medium italic whitespace-pre-line leading-relaxed">
          {insight}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {scenarios.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-2">{s.title}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Focus: {s.case}</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{s.benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductProtection;
