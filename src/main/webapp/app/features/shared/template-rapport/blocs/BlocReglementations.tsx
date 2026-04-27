import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Info, Scale, XCircle } from 'lucide-react';
import { BlocComponentProps } from '../types';
import { getReglementations } from 'app/features/estimation/_mocks/reglementations';

const PINEL_LABELS: Record<string, string> = {
  A_bis: 'A bis',
  A: 'A',
  B1: 'B1',
  B2: 'B2',
  C: 'C',
};

const BlocReglementations: React.FC<BlocComponentProps> = ({ data }) => {
  const { estimation } = data;
  const { bien } = estimation;

  const reg = useMemo(
    () => getReglementations(bien.code_postal, bien.surface || 0, bien.dpe),
    [bien.code_postal, bien.surface, bien.dpe],
  );

  const loyerHc = estimation.valeur_retenue_locatif?.loyer_hc ?? estimation.avm?.loyer.estimation ?? 0;
  const loyerM2 = bien.surface > 0 && loyerHc > 0 ? loyerHc / bien.surface : 0;

  return (
    <div className="rapport-bloc rapport-reglementations px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-5 flex items-center gap-2">
        <Scale size={14} /> Réglementations locatives
      </h2>

      <div className="space-y-5">
        {/* Encadrement des loyers */}
        <Section
          titre="Encadrement des loyers"
          etat={
            reg.encadrement.zone_tendue ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                <AlertTriangle size={10} /> Zone tendue
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                <CheckCircle2 size={10} /> Non applicable
              </span>
            )
          }
        >
          {reg.encadrement.zone_tendue ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Ce bien est situé à <strong>{reg.encadrement.commune}</strong>, commune soumise à l'encadrement des loyers.
                Le loyer hors charges doit rester dans la fourchette ci-dessous (sauf complément de loyer justifié).
              </p>

              <div className="grid grid-cols-3 gap-2">
                <FourchetteCell
                  label="Minoré"
                  value={`${reg.encadrement.loyer_minore_m2.toFixed(2)} €/m²`}
                  sub={bien.surface > 0 ? `~ ${Math.round(reg.encadrement.loyer_minore_m2 * bien.surface)} €` : undefined}
                />
                <FourchetteCell
                  label="Référence"
                  value={`${reg.encadrement.loyer_reference_m2.toFixed(2)} €/m²`}
                  sub={bien.surface > 0 ? `~ ${Math.round(reg.encadrement.loyer_reference_m2 * bien.surface)} €` : undefined}
                  highlight
                />
                <FourchetteCell
                  label="Majoré"
                  value={`${reg.encadrement.loyer_majore_m2.toFixed(2)} €/m²`}
                  sub={bien.surface > 0 ? `~ ${Math.round(reg.encadrement.loyer_majore_m2 * bien.surface)} €` : undefined}
                />
              </div>

              {loyerM2 > 0 && (
                <BadgeConformite
                  loyerM2={loyerM2}
                  loyerMin={reg.encadrement.loyer_minore_m2}
                  loyerMax={reg.encadrement.loyer_majore_m2}
                />
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              Cette commune n'est pas soumise au dispositif d'encadrement des loyers. Aucun plafond n'est imposé par arrêté préfectoral.
            </p>
          )}
        </Section>

        {/* Permis de louer */}
        <Section
          titre="Permis de louer"
          etat={
            reg.permis_louer ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                <AlertTriangle size={10} /> Requis
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                <CheckCircle2 size={10} /> Non concerné
              </span>
            )
          }
        >
          <p className="text-xs text-slate-600 leading-relaxed">
            {reg.permis_louer
              ? 'Cette commune applique le permis de louer (article L. 634-1 du CCH). Une déclaration ou une autorisation préalable auprès de la mairie sera nécessaire avant mise en location.'
              : "Cette commune n'est pas inscrite sur la liste des communes soumises au permis de louer. Aucune démarche spécifique n'est requise."}
          </p>
        </Section>

        {/* Dispositif Pinel */}
        <Section
          titre="Dispositif Pinel"
          etat={
            reg.pinel ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-propsight-50 text-propsight-700">
                <Info size={10} /> Zone {PINEL_LABELS[reg.pinel.zone]}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                Hors zone
              </span>
            )
          }
        >
          {reg.pinel ? (
            <div className="space-y-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                Zone <strong>{PINEL_LABELS[reg.pinel.zone]}</strong> — plafond de loyer Pinel :
                {' '}
                <strong className="tabular-nums">{reg.pinel.plafond_m2.toFixed(2)} €/m²</strong>
                {' '}(location nue, résidence principale).
              </p>
              {bien.surface > 0 && (
                <p className="text-xs text-slate-500">
                  Loyer Pinel maximum pour ce bien : ~{' '}
                  <span className="font-semibold text-slate-700 tabular-nums">
                    {Math.round(reg.pinel.plafond_m2 * bien.surface * Math.min(1, 0.7 + 19 / (bien.surface || 1))).toLocaleString('fr-FR')} €
                  </span>
                  {' '}(avec coefficient multiplicateur).
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">Ce secteur n'est pas éligible au dispositif Pinel.</p>
          )}
        </Section>

        {/* Logement décent */}
        <Section
          titre="Critères de logement décent"
          etat={
            reg.logement_decent.surface_ok && reg.logement_decent.dpe_ok && reg.logement_decent.equipements_ok ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                <CheckCircle2 size={10} /> Conforme
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700">
                <XCircle size={10} /> À vérifier
              </span>
            )
          }
        >
          <ul className="space-y-1 text-xs text-slate-700">
            <Critere ok={reg.logement_decent.surface_ok} label={`Surface habitable ≥ 9 m² (ici : ${bien.surface} m²)`} />
            <Critere ok={reg.logement_decent.dpe_ok} label={`DPE ≠ F, G (ici : ${bien.dpe})`} />
            <Critere ok={reg.logement_decent.equipements_ok} label="Équipements minimums (chauffage, cuisine, sanitaires)" />
          </ul>
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ titre: string; etat: React.ReactNode; children: React.ReactNode }> = ({ titre, etat, children }) => (
  <div className="border border-slate-200 rounded-md p-4 bg-white">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-slate-800">{titre}</h3>
      {etat}
    </div>
    {children}
  </div>
);

const FourchetteCell: React.FC<{ label: string; value: string; sub?: string; highlight?: boolean }> = ({ label, value, sub, highlight }) => (
  <div className={`rounded-md border px-3 py-2 ${highlight ? 'bg-propsight-50 border-propsight-200' : 'bg-slate-50 border-slate-200'}`}>
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
    <p className={`text-sm font-semibold tabular-nums ${highlight ? 'text-propsight-700' : 'text-slate-800'}`}>{value}</p>
    {sub && <p className="text-[10px] text-slate-400 tabular-nums">{sub}</p>}
  </div>
);

const BadgeConformite: React.FC<{ loyerM2: number; loyerMin: number; loyerMax: number }> = ({ loyerM2, loyerMin, loyerMax }) => {
  if (loyerM2 > loyerMax) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 flex items-start gap-2">
        <XCircle size={13} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold">Loyer proposé hors plafond : {loyerM2.toFixed(2)} €/m²</p>
          <p className="text-[11px] mt-0.5">
            Dépasse le loyer majoré de {(loyerM2 - loyerMax).toFixed(2)} €/m² (+{((loyerM2 - loyerMax) / loyerMax * 100).toFixed(1)}%).
            Un complément de loyer doit être justifié par un caractère exceptionnel du bien.
          </p>
        </div>
      </div>
    );
  }
  if (loyerM2 < loyerMin) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
        <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold">Loyer proposé sous le minoré : {loyerM2.toFixed(2)} €/m²</p>
          <p className="text-[11px] mt-0.5">Possibilité de revalorisation à la prochaine relocation.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800 flex items-start gap-2">
      <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold">Loyer proposé dans la fourchette : {loyerM2.toFixed(2)} €/m²</p>
        <p className="text-[11px] mt-0.5">Compris entre {loyerMin.toFixed(2)} et {loyerMax.toFixed(2)} €/m².</p>
      </div>
    </div>
  );
};

const Critere: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <li className="flex items-center gap-2">
    {ok ? <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" /> : <XCircle size={12} className="text-red-500 flex-shrink-0" />}
    <span className={ok ? 'text-slate-700' : 'text-red-700 font-medium'}>{label}</span>
  </li>
);

export default BlocReglementations;
