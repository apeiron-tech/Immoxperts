import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';

const Group: React.FC<{ title: string; premium?: boolean; children?: React.ReactNode; missing?: string }> = ({
  title,
  premium,
  children,
  missing,
}) => (
  <div>
    <div className="flex items-center gap-1 mb-1">
      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h4>
      {premium && <Sparkles size={10} className="text-propsight-500" />}
    </div>
    {missing ? (
      <div className="text-[11px] text-neutral-500 italic px-2 py-1.5 bg-propsight-50/40 border border-dashed border-propsight-200 rounded-md">
        {missing}
      </div>
    ) : (
      <ul className="space-y-0.5">{children}</ul>
    )}
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="text-[11.5px] text-neutral-700 leading-snug flex items-start gap-1.5">
    <span className="text-neutral-300 mt-1">•</span>
    <span className="flex-1">{children}</span>
  </li>
);

const DataAnchorsList: React.FC = () => {
  const snapshot = useAtelierStore(s => s.snapshot);
  const modules = useAtelierStore(s => s.modules);

  if (!snapshot) {
    return (
      <div className="text-[11.5px] text-neutral-500 italic">
        Sélectionnez une source pour afficher les datapoints disponibles.
      </div>
    );
  }

  const { bien, dvf, dpe, observatoire, profondeur_solvable, estimation, concurrence } = snapshot;

  return (
    <div className="space-y-3.5">
      {bien && (
        <Group title="Bien">
          <Row>
            {bien.type} · {bien.surface} m² · {bien.pieces} pces
            {bien.etage != null && ` · ${bien.etage}e`}
          </Row>
          {bien.dpe && <Row>DPE {bien.dpe} · GES {bien.ges ?? '—'}</Row>}
          {bien.annee_construction && <Row>Année {bien.annee_construction}</Row>}
          {bien.prix && (
            <Row>
              Prix {bien.prix.toLocaleString('fr-FR')} €
              {bien.prix_m2 && ` (${bien.prix_m2.toLocaleString('fr-FR')} €/m²)`}
            </Row>
          )}
        </Group>
      )}

      {dvf && (
        <Group title="Marché DVF">
          <Row>Médiane quartier : {dvf.mediane_quartier_m2.toLocaleString('fr-FR')} €/m²</Row>
          <Row>
            Évolution 12 m :{' '}
            <span className={dvf.evolution_12m_pct >= 0 ? 'text-success-700' : 'text-danger-500'}>
              {dvf.evolution_12m_pct >= 0 ? '+' : ''}
              {dvf.evolution_12m_pct.toFixed(1)} %
            </span>
          </Row>
          <Row>{dvf.nb_ventes_12m} ventes 12 m</Row>
          {dvf.ecart_bien_vs_mediane_pct != null && (
            <Row>Écart bien vs médiane : {dvf.ecart_bien_vs_mediane_pct.toFixed(1)} %</Row>
          )}
        </Group>
      )}

      {dpe && (
        <Group title="DPE & rénovation">
          <Row>Note actuelle : {dpe.note_actuelle}</Row>
          <Row>Conso : {dpe.consommation_kwh} kWh/m²/an</Row>
          {dpe.note_projetee_apres_renovation && (
            <Row>Note projetée après rénovation : {dpe.note_projetee_apres_renovation}</Row>
          )}
        </Group>
      )}

      {modules.observatoire === 'active' ? (
        observatoire ? (
          <Group title="Tension Observatoire" premium>
            <Row>Score {observatoire.tension_score.toFixed(1)}/10</Row>
            <Row>Délai moyen : {observatoire.delai_vente_moyen_jours} jours</Row>
            <Row>Type recherché : {observatoire.types_demandes_dominants.join(', ')}</Row>
            <Row>Profil : {observatoire.profil_demographique_dominant}</Row>
          </Group>
        ) : (
          <Group title="Tension Observatoire" premium missing="Données Observatoire en cours de calcul." />
        )
      ) : (
        <Group
          title="Tension Observatoire"
          premium
          missing="Activez Observatoire pour enrichir le texte avec la tension de zone (+12 % de richesse contenu)."
        />
      )}

      {modules.observatoire === 'active' && profondeur_solvable && (
        <Group title="Profondeur solvable" premium>
          <Row>{profondeur_solvable.nb_foyers_solvables_zone.toLocaleString('fr-FR')} foyers solvables zone</Row>
          <Row>
            Revenu cible : {profondeur_solvable.fourchette_revenu_cible.min} € -{' '}
            {profondeur_solvable.fourchette_revenu_cible.max} € /mois
          </Row>
          <Row>Distance max : {profondeur_solvable.distance_max_recherche_km} km</Row>
        </Group>
      )}

      {modules.estimation === 'active' ? (
        estimation ? (
          <Group title="Estimation AVM" premium>
            <Row>AVM : {estimation.avm_estimation.toLocaleString('fr-FR')} €</Row>
            <Row>
              Fourchette : {(estimation.avm_fourchette_basse / 1000).toFixed(0)} -{' '}
              {(estimation.avm_fourchette_haute / 1000).toFixed(0)} k€
            </Row>
            <Row>Indice confiance : {estimation.avm_indice_confiance} %</Row>
            <Row>{estimation.nb_comparables_utilises} comparables</Row>
          </Group>
        ) : null
      ) : (
        <Group
          title="Estimation AVM"
          premium
          missing="Activez Estimation pour intégrer la fourchette AVM et les comparables."
        />
      )}

      {modules.veille === 'active' && concurrence && (
        <Group title="Concurrence Veille" premium>
          <Row>{concurrence.nb_biens_similaires_zone} biens similaires zone</Row>
          <Row>Prix moyen : {concurrence.prix_moyen_concurrence_m2.toLocaleString('fr-FR')} €/m²</Row>
          <Row>Délai moyen : {concurrence.delai_moyen_concurrence} jours</Row>
        </Group>
      )}
    </div>
  );
};

export default DataAnchorsList;
