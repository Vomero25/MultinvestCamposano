
import React from 'react';

const ProductDetails: React.FC = () => {
  const sections = [
    {
      title: "Profili Soggettivi",
      items: [
        { label: "Contraente", value: "Persona Fisica con capacità di agire (min. 18 anni) o Persona Giuridica." },
        { label: "Assicurato", value: "Persona Fisica di età compresa tra 18 e 85 anni (età assicurativa)." },
        { label: "Beneficiari", value: "Designati in caso di vita (il Contraente stesso) o in caso di morte (designazione libera)." }
      ]
    },
    {
      title: "Versamenti Programmati (PVP)",
      description: "Possibilità di incrementare il capitale nel tempo.",
      items: [
        { label: "Frequenza CPP A/B", value: "Mensile (100€), Trimestrale (300€), Semestrale (600€), Annuale (1.200€)." },
        { label: "Frequenza CPP C", value: "Mensile (4.000€), Trimestrale (12.000€), Semestrale (24.000€), Annuale (48.000€)." },
        { label: "Note", value: "Attivabile su richiesta solo dopo il versamento unico iniziale." }
      ]
    },
    {
      title: "Copertura Caso Morte",
      items: [
        { label: "Incremento %", value: "Capitale maggiorato per età: 18-65 anni (+10%), 66-70 (+5%), Oltre 70 (+1%)." },
        { label: "Massimale", value: "Maggiorazione massima pari a 200.000 €." },
        { label: "Protezione Plus", value: "Entro il 5° anno: garantito il valore massimo tra premi versati e valore polizza x 110%." }
      ]
    },
    {
      title: "Opzioni Contrattuali",
      items: [
        { label: "Life Cycle", value: "Ri-bilanciamento automatico progressivo verso la Gestione Separata all'avanzare dell'età dell'Assicurato." },
        { label: "Take Profit", value: "Trasferimento automatico delle plusvalenze dei fondi Unit verso la Gestione Separata (Soglie 5% o 10%)." },
        { label: "Switch", value: "Possibilità di modificare l'allocazione tra i fondi della Linea Libera o Dinamica." }
      ]
    },
    {
      title: "Erogazioni Periodiche",
      description: "Opzione Decumulo per flussi di cassa costanti.",
      items: [
        { label: "Requisito", value: "Attivabile con capitale investito nella Linea superiore a 30.000 €." },
        { label: "Piano Standard", value: "Erogazione annuale del 3% o 5% del valore dei premi; semestrale 1,5% o 2,5%." },
        { label: "Flessibilità", value: "Possibilità di sospendere o riattivare il piano in qualsiasi momento." }
      ]
    },
    {
      title: "Opzioni di Rendita",
      description: "Conversione del capitale a maturazione (min. 5 anni).",
      items: [
        { label: "Rendita Vitalizia", value: "Erogata finché l'Assicurato è in vita (Rivalutabile annualmente)." },
        { label: "Controassicurata", value: "Rendita vitalizia con restituzione del capitale residuo ai beneficiari al decesso." },
        { label: "Certa e Vitalizia", value: "Erogata per 5 o 10 anni (anche in caso di decesso) e poi finché l'Assicurato è in vita." },
        { label: "Reversibile", value: "Rendita che continua ad essere erogata a un secondo beneficiario designato." }
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-blue-900 font-black text-lg mb-4 uppercase tracking-tighter border-b border-gray-50 pb-2">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-[10px] font-black text-blue-500 uppercase mb-4 italic tracking-tight">{section.description}</p>
            )}
            <div className="space-y-5">
              {section.items.map((item, i) => (
                <div key={i}>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-8 tracking-tighter uppercase italic">Matrice Life Cycle: Asset Allocation Strategica</h3>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest">Fascia Età Assicurato</th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest">% Linea Dinamica (Ramo III)</th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest">% Gestione Separata (Ramo I)</th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest">Profilo Rischio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {[
                  { eta: "Fino a 35 anni", lg: "90%", gs: "10%", risk: "Aggressivo" },
                  { eta: "36 - 40 anni", lg: "85%", gs: "15%", risk: "Dinamico" },
                  { eta: "41 - 45 anni", lg: "80%", gs: "20%", risk: "Moderato" },
                  { eta: "46 - 50 anni", lg: "70%", gs: "30%", risk: "Equilibrato" },
                  { eta: "51 - 55 anni", lg: "65%", gs: "35%", risk: "Prudente" },
                  { eta: "56 - 60 anni", lg: "50%", gs: "50%", risk: "Conservativo" },
                  { eta: "61 - 65 anni", lg: "35%", gs: "65%", risk: "Difensivo" },
                  { eta: "Oltre 65 anni", lg: "10%", gs: "90%", risk: "Protezione Max" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/10 transition-colors">
                    <td className="p-5 font-bold">{row.eta}</td>
                    <td className="p-5 text-sky-400 font-black">{row.lg}</td>
                    <td className="p-5 text-amber-400 font-black">{row.gs}</td>
                    <td className="p-5 text-gray-400 text-xs uppercase font-black">{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-[10px] text-blue-200 font-medium italic">
            * Lo switch automatico avviene annualmente nel giorno del compleanno dell'Assicurato, ottimizzando la stabilità del capitale verso il pensionamento.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-5 -mr-20 -mt-20">
           <div className="text-[200px] font-black">ZURICH</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
