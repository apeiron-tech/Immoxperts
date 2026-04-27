import React, { useEffect, useRef, useState } from 'react';
import EstimationHero from './EstimationHero';
import EstimationResult from './EstimationResult';
import HowItWorksSection from './HowItWorksSection';
import LimitationsSection from './LimitationsSection';
import ProTeaserSection from 'app/features/public/home/sections/ProTeaserSection';
import type { EstimationRequest, EstimationResult as EstimationResultModel } from './lib/api';

const EstimationPage: React.FC = () => {
  const [result, setResult] = useState<EstimationResultModel | null>(null);
  const [request, setRequest] = useState<EstimationRequest | null>(null);
  const resetKey = useRef(0);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Estimation immobilière gratuite — Propsight';
    return () => {
      document.title = prev;
    };
  }, []);

  const handleResult = (r: EstimationResultModel, req: EstimationRequest) => {
    setResult(r);
    setRequest(req);
    // scroll vers la section résultat après render
    requestAnimationFrame(() => {
      const el = document.getElementById('resultat');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleReset = () => {
    setResult(null);
    setRequest(null);
    resetKey.current += 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <EstimationHero key={resetKey.current} onResult={handleResult} />
      {result && request ? <EstimationResult result={result} request={request} onReset={handleReset} /> : null}
      <HowItWorksSection />
      <LimitationsSection />
      <ProTeaserSection />
    </>
  );
};

export default EstimationPage;
