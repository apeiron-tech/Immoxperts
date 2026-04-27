import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Card, Chip } from '../../components/primitives';
import { CONTEXTE_PROFIL, CONTEXTE_PROFIL_INSIGHTS } from '../../_mocks/observatoire';

const InsightBlock: React.FC = () => (
  <Card>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-amber-100 text-amber-600">
        <Lightbulb size={9} />
      </span>
      <h3 className="text-[11.5px] font-semibold text-slate-900">Lecture du quartier</h3>
    </div>
    <ul className="space-y-0.5">
      {CONTEXTE_PROFIL_INSIGHTS.map((t, i) => (
        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
          <ArrowRight size={10} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
      <Chip color="violet">Quartier central</Chip>
      <Chip color="emerald">Profil mixte</Chip>
      <Chip color="amber">Petites surfaces</Chip>
    </div>
  </Card>
);

const SocioDemoBlock: React.FC = () => {
  const p = CONTEXTE_PROFIL;
  const maxAge = Math.max(...p.age_distribution.map(a => a.share_pct));
  return (
    <Card title="Profil socio-démographique" sources="INSEE · RP 2021">
      <div className="grid grid-cols-[120px_1fr] gap-2.5">
        <div className="space-y-0.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-slate-500">Ménages</span>
            <span className="text-[10.5px] font-semibold text-slate-800">{p.households.toLocaleString('fr-FR')}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-slate-500">Taille moy.</span>
            <span className="text-[10.5px] font-semibold text-slate-800">1,61 pers</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-slate-500">Chômage</span>
            <span className="text-[10.5px] font-semibold text-slate-800">{p.unemployment_pct} %</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-slate-500">Étudiants</span>
            <span className="text-[10.5px] font-semibold text-slate-800">{p.students_pct} %</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 mb-0.5">Répartition par âge</div>
          <div className="space-y-0.5">
            {p.age_distribution.map(a => (
              <div key={a.bucket} className="flex items-center gap-1.5">
                <span className="w-9 text-[9.5px] text-slate-500">{a.bucket}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-propsight-500 rounded-sm" style={{ width: `${(a.share_pct / maxAge) * 100}%` }} />
                </div>
                <span className="w-9 text-[9.5px] text-slate-600 text-right font-medium">{a.share_pct} %</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-slate-100">
        <div className="text-[10px] text-slate-500 mb-0.5">Catégories socio-professionnelles</div>
        <div className="flex h-2 rounded-sm overflow-hidden">
          {p.csp_distribution.map((c, i) => {
            const colors = ['#7C3AED', '#A78BFA', '#CBD5E1', '#94A3B8', '#E2E8F0'];
            return (
              <div
                key={c.label}
                className="h-full"
                style={{ width: `${c.share_pct}%`, backgroundColor: colors[i] }}
                title={`${c.label} · ${c.share_pct} %`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {p.csp_distribution.map((c, i) => {
            const colors = ['#7C3AED', '#A78BFA', '#CBD5E1', '#94A3B8', '#E2E8F0'];
            return (
              <span key={c.label} className="inline-flex items-center gap-1 text-[9px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors[i] }} />
                {c.label} <span className="text-slate-700 font-medium">{c.share_pct}%</span>
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const HabitatBlock: React.FC = () => {
  const p = CONTEXTE_PROFIL;
  return (
    <Card title="Habitat & occupation" sources="INSEE · RP 2021">
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-slate-50 rounded px-2 py-1.5">
          <div className="text-[9.5px] text-slate-500">Résidences princ.</div>
          <div className="text-[13px] font-semibold text-slate-900 leading-none mt-0.5">96,1 %</div>
        </div>
        <div className="bg-slate-50 rounded px-2 py-1.5">
          <div className="text-[9.5px] text-slate-500">Taux vacance</div>
          <div className="text-[13px] font-semibold text-slate-900 leading-none mt-0.5">3,2 %</div>
        </div>
        <div className="bg-slate-50 rounded px-2 py-1.5">
          <div className="text-[9.5px] text-slate-500">Nb pièces</div>
          <div className="text-[13px] font-semibold text-slate-900 leading-none mt-0.5">1,95</div>
        </div>
      </div>
      <div className="mt-1.5">
        <div className="text-[10px] text-slate-500 mb-0.5">Locataires / propriétaires</div>
        <div className="flex h-2.5 rounded-sm overflow-hidden">
          <div className="bg-propsight-500" style={{ width: `${p.tenant_share_pct}%` }} />
          <div className="bg-emerald-500" style={{ width: `${p.owner_share_pct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-0.5 text-[9.5px]">
          <span className="inline-flex items-center gap-1 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-propsight-500" />
            Loc. <span className="text-slate-900 font-medium">{p.tenant_share_pct}%</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Prop. <span className="text-slate-900 font-medium">{p.owner_share_pct}%</span>
          </span>
        </div>
      </div>
      <div className="mt-1.5">
        <div className="text-[10px] text-slate-500 mb-0.5">Typologie du parc</div>
        <div className="grid grid-cols-4 gap-1">
          {p.housing_typology.map(t => (
            <div key={t.bucket} className="bg-slate-50 rounded px-1.5 py-1 text-center">
              <div className="text-[9.5px] text-slate-500">{t.bucket}</div>
              <div className="text-[11.5px] font-semibold text-propsight-700 leading-none mt-0.5">{t.share_pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const CadreBlock: React.FC = () => {
  const dims: { label: string; stars: number; description: string }[] = [
    { label: 'Transports', stars: 5, description: 'Excellente desserte' },
    { label: 'Écoles', stars: 5, description: 'Offre scolaire complète' },
    { label: 'Commerces', stars: 5, description: 'Offre très dense' },
    { label: 'Espaces verts', stars: 4, description: 'Parcs et squares' },
    { label: 'Services', stars: 4, description: 'Proximité nombreuse' },
  ];
  return (
    <Card title="Cadre de vie" sources="INSEE / OSM">
      <ul className="space-y-0.5">
        {dims.map(d => (
          <li key={d.label} className="flex items-center gap-1.5 text-[11px]">
            <span className="w-20 text-slate-700">{d.label}</span>
            <span className="flex items-center gap-0.5 text-amber-500 text-[10px]">
              {[0, 1, 2, 3, 4].map(s => (
                <span key={s}>{s < d.stars ? '★' : <span className="text-slate-200">★</span>}</span>
              ))}
            </span>
            <span className="text-slate-500 truncate text-[10.5px]">{d.description}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const ProfilTab: React.FC = () => (
  <>
    <div className="grid grid-cols-2 gap-2">
      <InsightBlock />
      <SocioDemoBlock />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <HabitatBlock />
      <CadreBlock />
    </div>
  </>
);

export default ProfilTab;
