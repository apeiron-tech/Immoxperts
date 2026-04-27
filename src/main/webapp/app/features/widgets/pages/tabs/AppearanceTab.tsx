import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import type { WidgetInstance } from '../../types';
import PreviewPane from '../../components/PreviewPane';
import WidgetStepPreview from '../../components/WidgetStepPreview';
import { SELLER_STEPS, INVESTOR_STEPS } from '../../_mocks/widgets';

interface Props {
  widget: WidgetInstance;
}

const AppearanceTab: React.FC<Props> = ({ widget }) => {
  const steps = widget.type === 'estimation_vendeur' ? SELLER_STEPS : INVESTOR_STEPS;
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [bg, setBg] = useState<'white' | 'grey' | 'transparent'>('white');
  const [primary, setPrimary] = useState('#6366F1');
  const [secondary, setSecondary] = useState('#A78BFA');
  const [radius, setRadius] = useState(8);
  const [logoHeight, setLogoHeight] = useState(40);
  const [density, setDensity] = useState<'compact' | 'standard'>('standard');
  const [mode, setMode] = useState<'inline' | 'popin' | 'hero'>('inline');
  const [shape, setShape] = useState<'sm' | 'md' | 'full'>('md');
  const [shadow, setShadow] = useState<'none' | 'light' | 'standard'>('light');
  const [partnerName, setPartnerName] = useState("Maison d'Exception");
  const [baseline, setBaseline] = useState('Immobilier haut de gamme');
  const [poweredBy, setPoweredBy] = useState(true);

  return (
    <div className="grid grid-cols-[minmax(0,360px)_1fr] gap-4 h-[calc(100vh-220px)]">
      <div className="bg-white border border-slate-200 rounded-md overflow-y-auto">
        <Section title="Logo">
          <div className="border-2 border-dashed border-slate-200 rounded-md px-4 py-5 text-center">
            <Upload size={18} className="mx-auto text-slate-400" />
            <div className="text-xs text-slate-600 mt-1.5">Glissez un fichier ou cliquez</div>
            <div className="text-[10px] text-slate-400">PNG, SVG ou JPG · max 2 Mo</div>
          </div>
          <LabeledRow label="Alignement">
            <SegmentedControl
              value="left"
              onChange={() => {}}
              options={[
                { v: 'left', label: 'Gauche' },
                { v: 'center', label: 'Centre' },
              ]}
            />
          </LabeledRow>
          <LabeledRow label={`Hauteur (${logoHeight}px)`}>
            <input
              type="range"
              min={24}
              max={64}
              value={logoHeight}
              onChange={e => setLogoHeight(Number(e.target.value))}
              className="w-full accent-propsight-500"
            />
          </LabeledRow>
        </Section>

        <Section title="Identité">
          <TextField label="Nom du partenaire" value={partnerName} onChange={setPartnerName} />
          <TextField label="Baseline" value={baseline} onChange={setBaseline} />
        </Section>

        <Section title="Couleurs">
          <ColorField label="Couleur principale" value={primary} onChange={setPrimary} />
          <ColorField label="Couleur secondaire" value={secondary} onChange={setSecondary} />
          <LabeledRow label="Fond du widget">
            <SegmentedControl
              value={bg}
              onChange={v => setBg(v as 'white' | 'grey' | 'transparent')}
              options={[
                { v: 'white', label: 'Blanc' },
                { v: 'grey', label: 'Grey 50' },
                { v: 'transparent', label: 'Transparent' },
              ]}
            />
          </LabeledRow>
        </Section>

        <Section title="Formes">
          <LabeledRow label="Boutons">
            <SegmentedControl
              value={shape}
              onChange={v => setShape(v as 'sm' | 'md' | 'full')}
              options={[
                { v: 'sm', label: 'Sm' },
                { v: 'md', label: 'Md' },
                { v: 'full', label: 'Pill' },
              ]}
            />
          </LabeledRow>
          <LabeledRow label={`Radius global (${radius}px)`}>
            <input
              type="range"
              min={0}
              max={24}
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full accent-propsight-500"
            />
          </LabeledRow>
          <LabeledRow label="Ombre">
            <SegmentedControl
              value={shadow}
              onChange={v => setShadow(v as 'none' | 'light' | 'standard')}
              options={[
                { v: 'none', label: 'Aucune' },
                { v: 'light', label: 'Légère' },
                { v: 'standard', label: 'Standard' },
              ]}
            />
          </LabeledRow>
        </Section>

        <Section title="Densité">
          <SegmentedControl
            value={density}
            onChange={v => setDensity(v as 'compact' | 'standard')}
            options={[
              { v: 'compact', label: 'Compact' },
              { v: 'standard', label: 'Standard' },
            ]}
          />
        </Section>

        <Section title="Mode d'affichage">
          <div className="grid grid-cols-3 gap-2">
            {(['inline', 'popin', 'hero'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2.5 py-2 text-xs rounded-md border text-center ${
                  mode === m ? 'border-propsight-400 bg-propsight-50 text-propsight-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m === 'inline' ? 'Inline' : m === 'popin' ? 'Pop-in' : 'Bloc hero'}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Powered by Propsight">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={poweredBy}
              onChange={e => setPoweredBy(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-slate-200 peer-checked:bg-propsight-500 rounded-full transition-colors flex-shrink-0">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-slate-700">Afficher le badge Propsight</span>
          </label>
        </Section>
      </div>

      <PreviewPane device={device} onDeviceChange={setDevice} title="Aperçu live" footerNote="Changements appliqués en direct">
        <div style={{ backgroundColor: bg === 'grey' ? '#f8fafc' : bg === 'transparent' ? 'transparent' : 'white' }}>
          <WidgetStepPreview widget={widget} step={steps[0]} stepsCount={steps.length} agencyName={partnerName} />
        </div>
      </PreviewPane>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-4 border-b border-slate-100 space-y-3">
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</h3>
    {children}
  </div>
);

const LabeledRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-xs text-slate-500 mb-1 block">{label}</label>
    {children}
  </div>
);

const TextField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <LabeledRow label={label}>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none"
    />
  </LabeledRow>
);

const ColorField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <LabeledRow label={label}>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-9 h-8 rounded cursor-pointer border border-slate-200"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded font-mono uppercase focus:border-propsight-400 focus:ring-1 focus:ring-propsight-200 focus:outline-none"
      />
    </div>
  </LabeledRow>
);

const SegmentedControl: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: Array<{ v: string; label: string }>;
}> = ({ value, onChange, options }) => (
  <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
    {options.map(o => (
      <button
        key={o.v}
        onClick={() => onChange(o.v)}
        className={`px-2.5 py-1 text-xs rounded transition-colors ${
          value === o.v ? 'bg-white shadow-sm text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default AppearanceTab;
