import { useState, useCallback, useMemo } from 'react';
import { SignalDVF, SignalDPE, MetaSignalRadar, SignalStatus, SignalProspection } from '../types';
import { signauxDvf as dvfInitial } from '../_mocks/signauxDvf';
import { signauxDpe as dpeInitial } from '../_mocks/signauxDpe';
import { metaSignalsRadar as radarInitial } from '../_mocks/signauxRadar';

// Store local partagé (simule un slice Redux) — basé sur useState, pas de Redux pour la démo
export interface ProspectionState {
  dvf: SignalDVF[];
  dpe: SignalDPE[];
  radar: MetaSignalRadar[];
}

export const useProspectionStore = () => {
  const [state, setState] = useState<ProspectionState>({
    dvf: dvfInitial,
    dpe: dpeInitial,
    radar: radarInitial,
  });

  const setStatusDvf = useCallback((id: string, status: SignalStatus) => {
    setState(s => ({
      ...s,
      dvf: s.dvf.map(x => (x.signal_id === id ? { ...x, status } : x)),
    }));
  }, []);
  const setStatusDpe = useCallback((id: string, status: SignalStatus) => {
    setState(s => ({
      ...s,
      dpe: s.dpe.map(x => (x.signal_id === id ? { ...x, status } : x)),
    }));
  }, []);
  const setStatusRadar = useCallback((id: string, status: SignalStatus) => {
    setState(s => ({
      ...s,
      radar: s.radar.map(x => (x.meta_id === id ? { ...x, status_agrege: status } : x)),
    }));
  }, []);

  const setAssigneeDvf = useCallback((id: string, userId: string | undefined) => {
    setState(s => ({
      ...s,
      dvf: s.dvf.map(x => (x.signal_id === id ? { ...x, assignee_id: userId } : x)),
    }));
  }, []);
  const setAssigneeDpe = useCallback((id: string, userId: string | undefined) => {
    setState(s => ({
      ...s,
      dpe: s.dpe.map(x => (x.signal_id === id ? { ...x, assignee_id: userId } : x)),
    }));
  }, []);
  const setAssigneeRadar = useCallback((id: string, userId: string | undefined) => {
    setState(s => ({
      ...s,
      radar: s.radar.map(x => (x.meta_id === id ? { ...x, assignee_id: userId } : x)),
    }));
  }, []);

  return {
    state,
    setStatusDvf,
    setStatusDpe,
    setStatusRadar,
    setAssigneeDvf,
    setAssigneeDpe,
    setAssigneeRadar,
  };
};

// Filtrage et tri
export interface SignalFiltersState {
  search: string;
  preset: string;
  period: string;
  sort: string;
  showIgnored: boolean;
}

export const useFilteredSignals = <T extends SignalDVF | SignalDPE>(
  signals: T[],
  filters: SignalFiltersState
): T[] => {
  return useMemo(() => {
    let list = [...signals];

    // Hide ignored
    if (!filters.showIgnored) {
      list = list.filter(s => s.status !== 'ignore');
    }

    // Search
    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter(s => {
        const t = `${s.adresse || ''} ${s.ville} ${s.code_postal || ''} ${s.title} ${s.subtitle}`.toLowerCase();
        return t.includes(q);
      });
    }

    // Preset
    if (filters.preset && filters.preset !== 'tous') {
      list = list.filter(s => {
        switch (filters.preset) {
          case 'haute_priorite':
            return s.score >= 80 && (s.status === 'nouveau' || s.status === 'a_traiter');
          case 'non_traites':
            return s.status === 'nouveau' || s.status === 'a_traiter';
          case 'detention_longue':
            return s.source === 'dvf' && s.type === 'detention_longue';
          case 'revente_rapide':
            return s.source === 'dvf' && s.type === 'revente_rapide';
          case 'zones_actives':
            return s.source === 'dvf' && s.type === 'zone_rotation_forte';
          case 'comparables':
            return s.source === 'dvf' && s.type === 'comparables_denses';
          case 'vendeurs_probables':
            return s.source === 'dpe' && s.type === 'vendeur_probable';
          case 'bailleurs_arbitrer':
            return s.source === 'dpe' && s.type === 'bailleur_a_arbitrer';
          case 'potentiel_renovation':
            return s.source === 'dpe' && s.type === 'potentiel_renovation';
          case 'opportunites_invest':
            return s.source === 'dpe' && s.type === 'opportunite_investisseur';
          case 'passoires':
            return (
              s.source === 'dpe' &&
              (s.type === 'passoire_thermique' ||
                ('dpe_payload' in s && (s.dpe_payload.classe_dpe === 'F' || s.dpe_payload.classe_dpe === 'G')))
            );
          default:
            return true;
        }
      });
    }

    // Sort
    list.sort((a, b) => {
      switch (filters.sort) {
        case 'score_asc':
          return a.score - b.score;
        case 'date_detection_desc':
          return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime();
        case 'date_vente_desc':
          if (a.source === 'dvf' && b.source === 'dvf') {
            return (
              new Date(b.dvf_payload.date_vente || 0).getTime() -
              new Date(a.dvf_payload.date_vente || 0).getTime()
            );
          }
          return 0;
        case 'classe_dpe_desc':
          if (a.source === 'dpe' && b.source === 'dpe') {
            return (b.dpe_payload.classe_dpe || '').localeCompare(a.dpe_payload.classe_dpe || '');
          }
          return 0;
        default:
          return b.score - a.score;
      }
    });

    return list;
  }, [signals, filters]);
};

export const useFilteredRadar = (signals: MetaSignalRadar[], filters: SignalFiltersState) => {
  return useMemo(() => {
    let list = [...signals];
    if (!filters.showIgnored) list = list.filter(s => s.status_agrege !== 'ignore');
    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter(s => {
        const t = `${s.adresse || ''} ${s.ville} ${s.code_postal || ''}`.toLowerCase();
        return t.includes(q);
      });
    }
    if (filters.preset && filters.preset !== 'tous') {
      if (filters.preset === 'haute_priorite') {
        list = list.filter(s => s.score_agrege >= 80);
      } else if (filters.preset === 'non_traites') {
        list = list.filter(s => s.status_agrege === 'nouveau' || s.status_agrege === 'a_traiter');
      }
    }
    list.sort((a, b) => {
      if (filters.sort === 'score_asc') return a.score_agrege - b.score_agrege;
      if (filters.sort === 'date_detection_desc')
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return b.score_agrege - a.score_agrege;
    });
    return list;
  }, [signals, filters]);
};
