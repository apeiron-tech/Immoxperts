import React from 'react';
import { CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Opportunity } from '../../types';
import { formatPrice } from '../../utils/finances';
import { DPEBadge } from '../../shared/StatutBadge';

const TabAnnonce: React.FC<{ opp: Opportunity }> = ({ opp }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* ATF */}
      <div className="col-span-3 grid grid-cols-4 gap-3 mb-1">
        <Atf label="Prix affiché" value={formatPrice(opp.prix_affiche)} />
        <Atf label="Prix/m²" value={`${opp.prix_m2.toLocaleString('fr-FR')} €`} />
        <Atf label="Ancienneté annonce" value={`${opp.ancienneté_annonce_jours} jours`} />
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Verdict</div>
          <div className="text-sm font-semibold text-emerald-700 mt-0.5">Annonce propre</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Complétude : 8/10</div>
        </div>
      </div>

      {/* Identité bien */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Identité du bien</h3>
        <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
          <InfoLine label="Adresse" value={`${opp.bien.adresse}, ${opp.bien.code_postal} ${opp.bien.ville}`} />
          <InfoLine label="Quartier" value={opp.bien.quartier} />
          <InfoLine label="Type" value={`Appartement (${opp.bien.pieces}p)`} />
          <InfoLine label="Surface" value={`${opp.bien.surface} m²`} />
          <InfoLine label="Étage" value={`${opp.bien.etage} / ${opp.bien.nb_etages}`} />
          <InfoLine label="Année" value={String(opp.bien.annee)} />
          <InfoLine label="Charges copro" value={`${opp.bien.charges_copro} €/mois`} />
          <InfoLine label="Taxe foncière" value={`${opp.bien.taxe_fonciere} €/an`} />
          <div className="flex items-center gap-2">
            <dt className="text-[11px] text-slate-500 w-32">DPE</dt>
            <dd><DPEBadge value={opp.bien.dpe} /></dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-[11px] text-slate-500 w-32">GES</dt>
            <dd><DPEBadge value={opp.bien.ges} /></dd>
          </div>
        </dl>
      </div>

      {/* Synthèse */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Synthèse Propsight</h3>
        <p className="text-xs text-slate-700 mb-3">
          Annonce bien renseignée. Prix affiché cohérent avec le marché de secteur. À valider : charges copropriété et état réel du bien.
        </p>
        <div className="space-y-1.5">
          <ForceItem label="Emplacement recherché" />
          <ForceItem label="Proximité métro & commerces" />
          <ForceItem label="Rendement brut attractif" />
          <VigilanceItem label="DPE E (travaux énergétiques à prévoir)" />
          <VigilanceItem label="Charges de copropriété élevées" />
        </div>
      </div>

      {/* Galerie */}
      <div className="col-span-3 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Galerie & description</h3>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <img key={i} src={`https://picsum.photos/seed/${opp.opportunity_id}_g${i}/400/300`} className="rounded w-full aspect-[4/3] object-cover" alt="" />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600 italic">
          "Bel appartement lumineux exposé Sud, rénovation récente de la cuisine, proche métro. Idéal premier investissement."
        </p>
        <div className="mt-3">
          <button type="button" className="inline-flex items-center gap-1 text-xs text-propsight-700 hover:text-propsight-800 font-medium">
            <ExternalLink size={12} />
            Voir l'annonce originale
          </button>
        </div>
      </div>
    </div>
  );
};

const Atf: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-base font-semibold text-slate-900 tabular-nums mt-0.5">{value}</div>
  </div>
);

const InfoLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <dt className="text-[11px] text-slate-500 w-32">{label}</dt>
    <dd className="text-xs text-slate-900">{value}</dd>
  </div>
);

const ForceItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-xs text-slate-700">
    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
    {label}
  </div>
);

const VigilanceItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-xs text-slate-700">
    <AlertTriangle size={13} className="text-amber-500 shrink-0" />
    {label}
  </div>
);

export default TabAnnonce;
