import React from 'react';

const SimulatorLegalDisclaimer: React.FC = () => (
  <div className="bg-slate-50 py-8 mt-12">
    <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
      <p className="text-[13px] text-slate-600 leading-relaxed">
        Cet outil fournit une simulation à titre indicatif. Les résultats dépendent des paramètres que vous saisissez et d&rsquo;hypothèses
        simplifiées (régimes micro uniquement, prélèvements sociaux fixes à 17,2 %, absence de plafonds de recettes). Propsight ne constitue pas un
        conseil fiscal, financier ou en investissement. Pour une analyse personnalisée, rapprochez-vous d&rsquo;un conseiller professionnel.
      </p>
    </div>
  </div>
);

export default SimulatorLegalDisclaimer;
