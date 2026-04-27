import React from 'react';
import ProgressBar from '../components/ProgressBar';

interface Props {
  agencyName?: string;
  agencyNav?: string[];
  steps: Array<{ id: string; name: string }>;
  currentIndex: number;
  children: React.ReactNode;
  withPartnerChrome?: boolean;
  backgroundImageUrl?: string;
}

// Shell commun aux parcours publics : header agence + progress bar + footer "Powered by Propsight"
const PublicShell: React.FC<Props> = ({
  agencyName = 'MAISON D\'EXCEPTION',
  agencyNav = ['Acheter', 'Vendre', 'Estimer', 'Nos biens', 'L\'agence', 'Actualités'],
  steps,
  currentIndex,
  children,
  withPartnerChrome = true,
  backgroundImageUrl,
}) => {
  return (
    <div
      className="min-h-screen bg-slate-50"
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(248,250,252,1) 60%), url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      {withPartnerChrome && (
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border-2 border-slate-900 rounded-sm flex items-center justify-center">
                <span className="text-xs font-bold text-slate-900">M</span>
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider text-slate-900">{agencyName}</div>
                <div className="text-[9px] tracking-[0.2em] text-slate-500 uppercase">Immobilier</div>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-7 text-sm text-slate-700">
              {agencyNav.map(item => (
                <a key={item} href="#" className="hover:text-slate-900">
                  {item}
                </a>
              ))}
            </nav>
            <button className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
              Nous contacter
            </button>
          </div>
        </header>
      )}

      <main className="max-w-[1040px] mx-auto px-6 py-10">
        {/* Titre section + sous-titre */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] md:text-[32px] font-serif text-slate-900">
            {currentIndex <= 2 ? 'Estimez votre bien en quelques minutes' : ''}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress */}
          <div className="px-8 pt-6 pb-4 border-b border-slate-100">
            <ProgressBar steps={steps} currentIndex={currentIndex} />
          </div>
          {/* Content */}
          <div className="p-8 md:p-10">{children}</div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          Powered by <span className="font-semibold text-propsight-600">⬥ Propsight</span>
        </div>
      </main>
    </div>
  );
};

export default PublicShell;
