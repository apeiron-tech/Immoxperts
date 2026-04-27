import React, { useEffect } from 'react';
import HomeHero from './sections/HomeHero';
import PublicProductCards from './sections/PublicProductCards';
import WhyPropsightSection from './sections/WhyPropsightSection';
import UseCasesSection from './sections/UseCasesSection';
import DataSourcesSection from './sections/DataSourcesSection';
import ProTeaserSection from './sections/ProTeaserSection';

const PublicHome: React.FC = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Propsight — La donnée immobilière enfin claire, locale et actionnable';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <HomeHero />
      <PublicProductCards />
      <WhyPropsightSection />
      <UseCasesSection />
      <DataSourcesSection />
      <ProTeaserSection />
    </>
  );
};

export default PublicHome;
