import React, { useState } from 'react';
import { X, Link, Loader2, CheckCircle, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { EstimationFormData } from '../../types';
import WizardCreation from '../../components/shared/WizardCreation';
import { ClientInfo } from '../../types';

interface ParsedField {
  value: string;
  fiabilite: 'fiable' | 'a_verifier' | 'manquant';
}

interface ParsedAnnonce {
  photo_url: string;
  type: ParsedField;
  surface: ParsedField;
  prix: ParsedField;
  dpe: ParsedField;
  adresse: ParsedField;
  nb_pieces: ParsedField;
  annee_construction: ParsedField;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => void;
}

const MOCK_PARSED: ParsedAnnonce = {
  photo_url: 'https://picsum.photos/seed/scrapedprop/600/400',
  type: { value: 'Appartement', fiabilite: 'fiable' },
  surface: { value: '68 m²', fiabilite: 'fiable' },
  prix: { value: '349 000 €', fiabilite: 'fiable' },
  dpe: { value: 'C', fiabilite: 'a_verifier' },
  adresse: { value: '12 rue de la République, Lyon 2e', fiabilite: 'fiable' },
  nb_pieces: { value: '3 pièces', fiabilite: 'fiable' },
  annee_construction: { value: '', fiabilite: 'manquant' },
};

const MOCK_INITIAL_DATA: Partial<EstimationFormData> = {
  adresse: '12 rue de la République',
  ville: 'Lyon',
  code_postal: '69002',
  type_bien: 'appartement',
  surface: 68,
  nb_pieces: 3,
  dpe: 'C',
};

const FiabiliteIcon: React.FC<{ f: 'fiable' | 'a_verifier' | 'manquant' }> = ({ f }) => {
  if (f === 'fiable') return <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} /> fiable</span>;
  if (f === 'a_verifier') return <span className="flex items-center gap-1 text-orange-500"><AlertTriangle size={12} /> à vérifier</span>;
  return <span className="flex items-center gap-1 text-slate-400"><HelpCircle size={12} /> manquant</span>;
};

const ModaleCreationUrl: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedAnnonce | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleAnalyser = () => {
    if (!url.trim()) return;
    setLoading(true);
    setParsed(null);
    setTimeout(() => {
      setLoading(false);
      setParsed(MOCK_PARSED);
      console.warn('[ModaleCreationUrl] Analyse simulée pour URL:', url);
    }, 1500);
  };

  const handleClose = () => {
    setUrl('');
    setLoading(false);
    setParsed(null);
    setWizardOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-md shadow-sm w-full max-w-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Link size={15} className="text-propsight-600" />
              <h2 className="text-sm font-semibold text-slate-900">Estimation depuis une annonce</h2>
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {!parsed && (
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">URL de l'annonce (SeLoger, LeBonCoin, PAP…)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnalyser()}
                    placeholder="https://www.seloger.com/annonces/..."
                    className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                  />
                  <button
                    onClick={handleAnalyser}
                    disabled={!url.trim() || loading}
                    className="px-4 py-2 bg-propsight-600 text-white rounded-md text-sm hover:bg-propsight-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                    Analyser
                  </button>
                </div>
                {loading && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 size={16} className="animate-spin text-propsight-500" />
                    Analyse de l'annonce en cours…
                  </div>
                )}
              </div>
            )}

            {parsed && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <img src={parsed.photo_url} alt="" className="w-24 h-20 object-cover rounded-md flex-shrink-0 border border-slate-200" />
                  <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                      { label: 'Type', field: parsed.type },
                      { label: 'Surface', field: parsed.surface },
                      { label: 'Prix annoncé', field: parsed.prix },
                      { label: 'DPE', field: parsed.dpe },
                      { label: 'Adresse', field: parsed.adresse },
                      { label: 'Pièces', field: parsed.nb_pieces },
                      { label: 'Année constr.', field: parsed.annee_construction },
                    ].map(({ label, field }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className={`text-xs font-medium ${field.fiabilite === 'manquant' ? 'text-slate-400 italic' : 'text-slate-800'}`}>
                          {field.value || '—'}
                        </p>
                        <FiabiliteIcon f={field.fiabilite} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  <p className="text-xs text-green-700">5 champs importés avec succès · 1 à vérifier · 1 manquant</p>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setParsed(null); setUrl(''); }}
                    className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Nouvelle URL
                  </button>
                  <button
                    onClick={() => setWizardOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-propsight-600 text-white rounded-md hover:bg-propsight-700 transition-colors"
                  >
                    Continuer dans le wizard
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <WizardCreation
        isOpen={wizardOpen}
        onClose={() => { setWizardOpen(false); handleClose(); }}
        onSubmit={onSubmit}
        initialData={MOCK_INITIAL_DATA}
      />
    </>
  );
};

export default ModaleCreationUrl;
