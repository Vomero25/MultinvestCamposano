
import React from 'react';

const ProductTechnicalSheet: React.FC = () => {
  const data = [
    {
      category: "Informazioni Generali",
      details: [
        { label: "Forma Tariffaria", value: "Vita intera, di tipo Multiramo." },
        { label: "Contraente", value: "Persona Fisica (min. 18 anni) o Persona Giuridica." },
        { label: "Assicurato", value: "Persona Fisica con età assicurativa tra 18 e 85 anni." }
      ]
    },
    {
      category: "Premi Minimi",
      details: [
        { label: "CPP A e B", value: "Iniziale: 15.000 € | Aggiuntivo: 1.200 €" },
        { label: "CPP C", value: "Iniziale: 250.000 € | Aggiuntivo: 48.000 €" }
      ]
    },
    {
      category: "Investimento Premi",
      details: [
        { label: "Linee Guidate", value: "Prudente, Moderata, Bilanciata ESG, Dinamica, Obiettivo Cedola." },
        { label: "Linea Libera", value: "Min. 2, Max 9 fondi (min. 5% per fondo)." },
        { label: "Gestione Separata", value: "Zurich Trend (fino al 40% di ciascun premio). Max 1.000.000 € totali." }
      ]
    },
    {
      category: "Operazioni Contrattuali",
      details: [
        { label: "Switch", value: "Illimitati tra Linee Guidate e Libera. Gratuiti (tranne da GS verso Linee, possibile dopo 1 anno)." },
        { label: "Ridirezionamento", value: "Possibilità di modificare le % di allocazione dei PVP (max 4 richieste/anno)." },
        { label: "Recesso", value: "Entro 30 giorni dalla ricezione della lettera di accettazione." }
      ]
    },
    {
      category: "Riscatti",
      details: [
        { label: "Disponibilità", value: "Dopo 30 giorni dalla conclusione del contratto." },
        { label: "Importo Parziale", value: "CPP A/B: Min. 2.500 € (residuo 5.000 €). CPP C: Min. 50.000 € (residuo 150.000 €). Max 80% del totale." },
        { label: "Calcolo GS", value: "Capitale rivalutato al 31/12 precedente + rivalutazione pro-rata (75% ultimo rendimento netto)." }
      ]
    },
    {
      category: "Prestazioni Caso Morte",
      details: [
        { label: "Maggiorazione Standard", value: "Età < 65: +10% | 66-70: +5% | > 70: +1%. Max incremento 200.000 €." },
        { label: "Garanzia Minima", value: "Entro 5° anno: Max tra premi versati e Valore Polizza x 110% (se età < 65)." }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-blue-900 p-8 text-white">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">Dati Tecnici di Prodotto</h2>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">Sintesi integrale Scheda Prodotto 09.2025</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
          {data.map((section, idx) => (
            <div key={idx} className="bg-white p-8 group hover:bg-slate-50 transition-colors">
              <h3 className="text-blue-900 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-900 rounded-full"></span>
                {section.category}
              </h3>
              <div className="space-y-4">
                {section.details.map((item, i) => (
                  <div key={i} className="flex flex-col border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{item.label}</span>
                    <span className="text-sm text-gray-800 font-bold leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100">
        <h4 className="text-amber-900 font-black text-lg mb-4 uppercase tracking-tighter italic">Classi di Premi Potenziali (CPP)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/50 p-6 rounded-3xl border border-amber-200">
            <p className="text-xs font-black text-amber-900 mb-2">CPP A</p>
            <p className="text-[10px] text-amber-800 font-medium">Previsione versamenti futuri fino a 749.999,99 €.</p>
          </div>
          <div className="bg-white/50 p-6 rounded-3xl border border-amber-200">
            <p className="text-xs font-black text-amber-900 mb-2">CPP B</p>
            <p className="text-[10px] text-amber-800 font-medium">Previsione da 750.000 € a 2.499.999,99 €.</p>
          </div>
          <div className="bg-white/50 p-6 rounded-3xl border border-amber-200">
            <p className="text-xs font-black text-amber-900 mb-2">CPP C</p>
            <p className="text-[10px] text-amber-800 font-medium">Previsione a partire da 2,5 milioni di €. (Min. iniziale 250k).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTechnicalSheet;
