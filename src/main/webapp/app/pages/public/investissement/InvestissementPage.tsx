import React, { useEffect } from 'react';
import InvestHero from './InvestHero';
import InvestWhatYouGetSection from './InvestWhatYouGetSection';
import InvestHowItWorksSection from './InvestHowItWorksSection';
import InvestMiniCalculator from './InvestMiniCalculator';
import InvestResourcesTeaser from './InvestResourcesTeaser';
import InvestFinalCta from './InvestFinalCta';

const InvestissementPage: React.FC = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Investissement immobilier — Propsight';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <InvestHero />
      <InvestWhatYouGetSection />
      <InvestHowItWorksSection />
      <InvestMiniCalculator />
      <InvestResourcesTeaser />
      <InvestFinalCta />
    </>
  );
};

export default InvestissementPage;
