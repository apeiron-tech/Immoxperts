import React, { useEffect } from 'react';
import ProHero from './sections/ProHero';
import ProStatsBandSection from './sections/ProStatsBandSection';
import ProProblemSection from './sections/ProProblemSection';
import ProSolutionSection from './sections/ProSolutionSection';
import ProRadarSection from './sections/ProRadarSection';
import ProModulesSection from './sections/ProModulesSection';
import ProDifferentiatorsSection from './sections/ProDifferentiatorsSection';
import ProUseCasesSection from './sections/ProUseCasesSection';
import ProFinalCtaSection from './sections/ProFinalCtaSection';

const ProLanding: React.FC = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Propsight Pro — Le cockpit immobilier des professionnels';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <ProHero />
      <ProStatsBandSection />
      <ProProblemSection />
      <ProSolutionSection />
      <ProRadarSection />
      <ProModulesSection />
      <ProDifferentiatorsSection />
      <ProUseCasesSection />
      <ProFinalCtaSection />
    </>
  );
};

export default ProLanding;
