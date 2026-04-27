import React from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { Opportunity } from '../../types';

const TabPotentielPLU: React.FC<{ opp: Opportunity }> = ({ opp }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* ATF */}
      <div className="col-span-3 grid grid-cols-4 gap-3 mb-1">
        <Atf label="Signal urbanisme" value="Favorable" tone="emerald" />
        <Atf label="Permis à proximité" value="12 / 500 m" />
        <Atf label="Transformabilité" value="R+1 envisageable" />
        <div className="rounded-md border border-propsight-200 bg-propsight-50 p-3">
          <div className="text-[10px] uppercase tracking-wide text-propsight-600">Verdict</div>
          <div className="text-sm font-semibold text-propsight-700 mt-0.5">Potentiel long terme favorable</div>
        </div>
      </div>

      {/* Zonage PLU */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
          <MapPin size={13} className="text-propsight-600" />
          Zonage PLU & règles clés
        </h3>
        <div className="rounded border border-slate-100 bg-slate-50 p-3 mb-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Zone du PLU</div>
          <div className="text-xl font-bold text-slate-900">UG</div>
          <div className="text-[11px] text-slate-600">Zone urbaine générale</div>
        </div>
        <div className="space-y-1.5 text-xs">
          <Kv label="Hauteur max." value="31 m (R+8)" />
          <Kv label="Emprise au sol" value="60 %" />
          <Kv label="Pleine terre min." value="10 %" />
          <Kv label="COS non réglementé" value="—" />
          <Kv label="Stationnement" value="1 pl / 80 m² SDP" />
        </div>
      </div>

      {/* Carte zonage (placeholder) */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Contexte parcellaire</h3>
        <div className="rounded border border-slate-100 bg-gradient-to-br from-propsight-50 via-slate-50 to-emerald-50 aspect-[4/3] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={32} className="text-propsight-500" />
          </div>
          <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 bg-white/80 rounded px-1.5 py-0.5">Carte parcellaire</div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3 text-[10px]">
          <LegendDot color="bg-propsight-500" label="Parcelle" />
          <LegendDot color="bg-propsight-300" label="Zone UG" />
          <LegendDot color="bg-emerald-500" label="Espaces verts" />
          <LegendDot color="bg-amber-500" label="Équipements" />
        </div>
      </div>

      {/* Transformabilité */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
          <Building2 size={13} className="text-propsight-600" />
          Transformabilité du bien
        </h3>
        <div className="space-y-2 text-xs">
          <TransformLine label="Surélévation possible" value="Jusqu'à R+8 (+ 2 niveaux)" tone="Élevé" />
          <TransformLine label="Division possible" value="2 à 3 lots envisageables" tone="Moyen" />
          <TransformLine label="Changement d'usage" value="Habitation → Bureaux / Mixte" tone="Moyen" />
          <TransformLine label="Optimisation surface" value="Recomposition & gains de m²" tone="Élevé" />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 rounded bg-propsight-50/40 p-2">
          <div className="text-[10px] uppercase tracking-wide text-propsight-600">Potentiel constructible estimé</div>
          <div className="text-base font-bold text-propsight-700">+210 à +260 m² SDP</div>
        </div>
      </div>

      {/* Pipeline permis */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Pipeline de permis à proximité (500 m)</h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <PermitStat label="Dépôts" value="12" subtitle="12 derniers mois" />
          <PermitStat label="Instruction" value="7" subtitle="En cours" />
          <PermitStat label="Accordés" value="5" subtitle="12 derniers mois" />
          <PermitStat label="Refusés" value="1" subtitle="12 derniers mois" />
        </div>
        <div className="space-y-1.5 text-xs">
          <PermitRow label="22 Rue Desnouettes, 75015" statut="Accordé" detail="+ 420 m² SDP" date="12/03/2024" />
          <PermitRow label="18 Rue du Hameau, 75015" statut="Instruction" detail="+ 190 m² SDP" date="28/02/2024" />
          <PermitRow label="14 Rue du Hameau, 75015" statut="Accordé" detail="3 lots" date="05/12/2023" />
        </div>
      </div>

      {/* Uplift valeur */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Uplift de valeur estimé</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded border border-slate-100 bg-slate-50 p-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">Valeur actuelle</div>
            <div className="text-sm font-semibold">{(opp.prix_affiche).toLocaleString('fr-FR')} €</div>
          </div>
          <div className="rounded border border-propsight-200 bg-propsight-50/40 p-2">
            <div className="text-[10px] uppercase tracking-wide text-propsight-600">Après optimisation</div>
            <div className="text-sm font-semibold text-propsight-700">{Math.round(opp.prix_affiche * 1.3).toLocaleString('fr-FR')} €</div>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-br from-propsight-50 to-emerald-50 p-3 border border-propsight-100">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Uplift estimé</div>
          <div className="text-xl font-bold text-emerald-700">+{Math.round(opp.prix_affiche * 0.3).toLocaleString('fr-FR')} €</div>
          <div className="text-xs text-emerald-700">+29,7 %</div>
        </div>
      </div>
    </div>
  );
};

const Atf: React.FC<{ label: string; value: string; tone?: 'emerald' | 'amber' | 'rose' }> = ({ label, value, tone }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className={`text-sm font-semibold mt-0.5 ${tone === 'emerald' ? 'text-emerald-700' : tone === 'amber' ? 'text-amber-700' : tone === 'rose' ? 'text-rose-700' : 'text-slate-900'}`}>{value}</div>
  </div>
);

const Kv: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600">{label}</span>
    <span className="tabular-nums font-medium text-slate-900">{value}</span>
  </div>
);

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="inline-flex items-center gap-1 text-slate-600">
    <span className={`h-2 w-2 rounded-full ${color}`} />
    {label}
  </span>
);

const TransformLine: React.FC<{ label: string; value: string; tone: string }> = ({ label, value, tone }) => (
  <div className="rounded border border-slate-100 p-2 flex items-center justify-between">
    <div>
      <div className="font-medium text-slate-900">{label}</div>
      <div className="text-[10px] text-slate-500">{value}</div>
    </div>
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tone === 'Élevé' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{tone}</span>
  </div>
);

const PermitStat: React.FC<{ label: string; value: string; subtitle: string }> = ({ label, value, subtitle }) => (
  <div className="rounded border border-slate-200 p-2 text-center">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-lg font-bold">{value}</div>
    <div className="text-[9px] text-slate-400">{subtitle}</div>
  </div>
);

const PermitRow: React.FC<{ label: string; statut: string; detail: string; date: string }> = ({ label, statut, detail, date }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
    <div className="min-w-0 flex-1">
      <div className="font-medium text-slate-900 truncate">{label}</div>
      <div className="text-[10px] text-slate-500">{detail}</div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statut === 'Accordé' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{statut}</span>
      <span className="text-[10px] text-slate-500">{date}</span>
    </div>
  </div>
);

export default TabPotentielPLU;
