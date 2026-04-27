import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Save, Check, Loader2 } from 'lucide-react';
import { MOCK_ESTIMATIONS } from '../_mocks/estimations';
import { Estimation, EstimationFormData, AvmResult } from '../types';
import { computeAvm } from '../utils/avmEngine';
import { StatusBadge } from '../components/shared/StatusBadge';
import FormulaireEstimation from './components/FormulaireEstimation';
import PanneauResultat from './components/PanneauResultat';
import HistoriqueRecent from './components/HistoriqueRecent';

type SaveStatus = 'unsaved' | 'saving' | 'saved';

const EstimationRapideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const source = MOCK_ESTIMATIONS.find(e => e.id === id) || null;
  const [estimation, setEstimation] = useState<Estimation | null>(source);
  const [formData, setFormData] = useState<Partial<EstimationFormData>>(source?.bien || {});
  const [avmResult, setAvmResult] = useState<AvmResult | null>(source?.avm || null);
  const [avmLoading, setAvmLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [isDirty, setIsDirty] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const found = MOCK_ESTIMATIONS.find(e => e.id === id);
    if (found) {
      setEstimation(found);
      setFormData(found.bien);
      setAvmResult(found.avm);
      setSaveStatus('saved');
      setIsDirty(false);
    }
  }, [id]);

  const handleFieldChange = useCallback((field: keyof EstimationFormData, value: unknown) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      setSaveStatus('unsaved');
      setIsDirty(true);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setAvmLoading(true);
        setTimeout(() => {
          setAvmResult(computeAvm(updated));
          setAvmLoading(false);
        }, 300);
      }, 500);

      return updated;
    });
  }, []);

  const handleSave = () => {
    console.warn('[EstimationRapideDetail] Sauvegarde', id, formData);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 800);
    setIsDirty(false);
  };

  const handlePromouvoir = () => {
    console.warn('[EstimationRapideDetail] Promouvoir en avis de valeur', id);
  };

  useEffect(() => {
    if (isDirty) {
      if (dirtyTimerRef.current) clearTimeout(dirtyTimerRef.current);
      dirtyTimerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => {
          setSaveStatus('saved');
          setIsDirty(false);
          console.warn('[EstimationRapideDetail] Auto-save', id);
        }, 500);
      }, 60000);
    }
    return () => {
      if (dirtyTimerRef.current) clearTimeout(dirtyTimerRef.current);
    };
  }, [isDirty, id]);

  if (!estimation) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Estimation introuvable.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/estimation/rapide')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={13} />
            Estimation rapide
          </button>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-medium text-slate-700 truncate max-w-xs">
            {formData.adresse || 'Nouvelle estimation'}{formData.ville ? `, ${formData.ville}` : ''}
          </span>
          <StatusBadge statut={estimation.statut} />
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === 'unsaved' && (
            <span className="text-xs text-slate-400">Modifications non sauvegardées</span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Loader2 size={11} className="animate-spin" />
              Sauvegarde…
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check size={11} />
              Sauvegardé
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saveStatus !== 'unsaved'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={13} />
            Sauvegarder
          </button>

          <div className="flex">
            <button
              onClick={handlePromouvoir}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-propsight-600 text-white rounded-l-md hover:bg-propsight-700 transition-colors"
            >
              Promouvoir
            </button>
            <button className="px-2 py-1.5 bg-propsight-700 text-white rounded-r-md border-l border-propsight-500 hover:bg-propsight-800 transition-colors">
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Split 60/40 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Formulaire 60% */}
        <div className="w-[60%] overflow-y-auto border-r border-slate-200 bg-white">
          <div className="px-6 py-5">
            <FormulaireEstimation value={formData} onChange={handleFieldChange} />
          </div>
        </div>

        {/* Panneau résultat 40% */}
        <div className="w-[40%] overflow-y-auto bg-slate-50">
          <PanneauResultat
            avm={avmResult}
            loading={avmLoading}
            bien={formData}
            onPromouvoir={handlePromouvoir}
          />
        </div>
      </div>

      {/* Historique */}
      <div className="flex-shrink-0">
        <HistoriqueRecent
          currentId={estimation.id}
          onSelect={selectedId => navigate(`/app/estimation/rapide/${selectedId}`)}
        />
      </div>
    </div>
  );
};

export default EstimationRapideDetail;
