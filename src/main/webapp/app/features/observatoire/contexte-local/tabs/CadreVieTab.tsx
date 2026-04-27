import React from 'react';
import { Lightbulb, ArrowRight, Utensils, Landmark, Shield, Pill, Heart } from 'lucide-react';
import { Card, Chip } from '../../components/primitives';
import { CONTEXTE_LIFESTYLE, CONTEXTE_CADRE_INSIGHTS } from '../../_mocks/observatoire';

const Stars: React.FC<{ stars: number }> = ({ stars }) => (
  <span className="flex items-center gap-0.5 text-amber-500 text-[9.5px]">
    {[0, 1, 2, 3, 4].map(s => (
      <span key={s}>{s < stars ? '★' : <span className="text-slate-200">★</span>}</span>
    ))}
  </span>
);

const MobiliteBlock: React.FC = () => (
  <Card title="Mobilité & accessibilité" sources="OSM / BAN / IDFM">
    <ul className="space-y-0.5">
      {CONTEXTE_LIFESTYLE.transports_detail.map(m => (
        <li key={m.mode} className="flex items-center gap-2 text-[11px]">
          <span className="w-16 text-slate-700 font-medium">{m.mode}</span>
          <Stars stars={m.stars} />
          <span className="text-slate-500 truncate flex-1 text-[10.5px]">{m.description}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const COMMERCE_ICONS: Record<string, React.ReactNode> = {
  food: <Utensils size={12} />,
  restaurant: <Utensils size={12} />,
  pharma: <Pill size={12} />,
  health: <Heart size={12} />,
  bank: <Landmark size={12} />,
  service: <Shield size={12} />,
};

const COMMERCE_ACCENTS: string[] = [
  'bg-propsight-100 text-propsight-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-slate-100 text-slate-700',
  'bg-sky-100 text-sky-700',
];

const CommercesBlock: React.FC = () => (
  <Card title="Commerces & services du quotidien" sources="OSM / BPE">
    <div className="grid grid-cols-3 gap-1">
      {CONTEXTE_LIFESTYLE.commerces_detail.map((c, i) => (
        <div key={c.label} className="flex items-center gap-1.5 bg-slate-50 rounded px-1.5 py-1">
          <span className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${COMMERCE_ACCENTS[i % COMMERCE_ACCENTS.length]}`}>
            {COMMERCE_ICONS[c.icon] ?? <Utensils size={12} />}
          </span>
          <div className="min-w-0">
            <div className="text-[9.5px] text-slate-500 truncate">{c.label}</div>
            <div className="text-[12px] font-semibold text-slate-900 leading-none">{c.count}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-1.5 text-[9.5px] text-slate-500 italic">
      Quartier très animé avec une offre dense et diversifiée.
    </div>
  </Card>
);

const EducationBlock: React.FC = () => (
  <Card title="Éducation & vie de quartier" sources="INSEE / OSM / BPE">
    <ul className="space-y-0.5">
      {CONTEXTE_LIFESTYLE.education_detail.map(e => (
        <li key={e.label} className="flex items-center gap-2 text-[11px]">
          <span className="w-32 text-slate-700 font-medium">{e.label}</span>
          <Stars stars={e.stars} />
          <span className="text-slate-500 truncate flex-1 text-[10.5px]">{e.detail}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const EnvironnementBlock: React.FC = () => (
  <Card title="Environnement résidentiel" sources="INSEE / OSM">
    <ul className="space-y-0.5">
      {CONTEXTE_LIFESTYLE.environnement_detail.map(e => (
        <li key={e.label} className="flex items-center gap-2 text-[11px]">
          <span className="w-28 text-slate-700 font-medium">{e.label}</span>
          <Stars stars={e.stars} />
          <span className="text-slate-500 truncate flex-1 text-[10.5px]">{e.detail}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const LectureRapideBlock: React.FC = () => (
  <Card>
    <div className="flex items-center gap-2 mb-1">
      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-100 text-amber-600">
        <Lightbulb size={10} />
      </span>
      <h3 className="text-[11.5px] font-semibold text-slate-900">Lecture rapide du cadre de vie</h3>
    </div>
    <div className="grid grid-cols-[1fr_auto] gap-3">
      <ul className="space-y-0.5">
        {CONTEXTE_CADRE_INSIGHTS.map((t, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
            <ArrowRight size={10} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1 items-end">
        <Chip color="violet">Forte accessibilité</Chip>
        <Chip color="emerald">Quotidien facilité</Chip>
        <Chip color="amber">Densité urbaine</Chip>
      </div>
    </div>
  </Card>
);

const CadreVieTab: React.FC = () => (
  <>
    <div className="grid grid-cols-2 gap-2">
      <MobiliteBlock />
      <CommercesBlock />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <EducationBlock />
      <EnvironnementBlock />
    </div>
    <LectureRapideBlock />
  </>
);

export default CadreVieTab;
