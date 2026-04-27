import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { calcInvest } from './lib/calcInvest';
import { useSimulatorState } from './hooks/useSimulatorState';
import { useUrlSync } from './hooks/useUrlSync';
import SimulatorForm from './SimulatorForm';
import SimulatorResults from './SimulatorResults';
import SimulatorLegalDisclaimer from './SimulatorLegalDisclaimer';

const SimulateurPage: React.FC = () => {
  const { state, update, reset, replaceAll } = useSimulatorState();
  const { buildShareUrl } = useUrlSync(state, replaceAll);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Simulateur d’investissement locatif — Propsight';
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const result = useMemo(() => calcInvest(state), [state]);

  const handleCopyLink = async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setToast('Lien copié');
    } catch {
      setToast('Impossible de copier le lien');
    }
  };

  const handleReset = () => {
    reset();
    setToast('Simulation réinitialisée');
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-8">
          <nav aria-label="fil d’ariane" className="text-[13px] text-slate-500 flex items-center gap-1.5">
            <Link to="/investissement" className="hover:text-slate-700">
              Investissement
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-900 font-medium">Simulateur</span>
          </nav>

          <div className="mt-6 mb-8">
            <h1 className="text-[28px] md:text-[36px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]">
              Simulateur d&rsquo;investissement locatif
            </h1>
            <p className="mt-2 text-[15px] md:text-[16px] text-slate-600">
              Chiffrez votre projet en quelques secondes. Aucune inscription.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
            <div className="lg:col-span-5">
              <SimulatorForm state={state} update={update} onReset={handleReset} onCopyLink={handleCopyLink} />
            </div>
            <div className="lg:col-span-7">
              <SimulatorResults state={state} result={result} />
            </div>
          </div>
        </div>
      </div>

      <SimulatorLegalDisclaimer />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-[13px] px-4 py-2 rounded-md shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
};

export default SimulateurPage;
