import { Comparaison } from '../types';

export const MOCK_COMPARATIFS: Comparaison[] = [
  {
    comparison_id: 'cmp_001',
    project_id: 'proj_paris15',
    type: 'biens',
    name: 'Lecourbe vs Suffren vs Théâtre',
    items: [
      { ref_id: 'opp_001', ref_type: 'opportunity', label: 'Rue Lecourbe' },
      { ref_id: 'opp_002', ref_type: 'opportunity', label: 'Avenue de Suffren' },
      { ref_id: 'opp_005', ref_type: 'opportunity', label: 'Rue du Théâtre' },
    ],
    source_context: 'opportunites_list',
    verdict_propsight: 'Rue Lecourbe : meilleur équilibre rendement/cohérence.',
    created_at: '2026-04-18T10:00:00Z',
    updated_at: '2026-04-18T10:00:00Z',
    created_by: 'user_me',
  },
  {
    comparison_id: 'cmp_002',
    project_id: 'proj_paris15',
    type: 'villes',
    name: 'Paris 15 vs Lyon 3 vs Grenoble',
    items: [
      { ref_id: 'paris15', ref_type: 'ville', label: 'Paris 15e' },
      { ref_id: 'lyon3', ref_type: 'ville', label: 'Lyon 3e' },
      { ref_id: 'grenoble3', ref_type: 'ville', label: 'Grenoble 3e' },
    ],
    source_context: 'projet_workspace',
    verdict_propsight: 'Grenoble 3e : meilleur compromis budget/rendement.',
    created_at: '2026-04-15T10:00:00Z',
    updated_at: '2026-04-15T10:00:00Z',
    created_by: 'user_me',
  },
  {
    comparison_id: 'cmp_003',
    project_id: 'proj_lyon3',
    type: 'scenarios',
    name: 'LMNP réel vs Nu réel — Rue Lecourbe',
    items: [
      { ref_id: 'opp_001_s1', ref_type: 'scenario', label: 'LMNP réel — apport 20%' },
      { ref_id: 'opp_001_s2', ref_type: 'scenario', label: 'Nu réel — apport 25%' },
    ],
    source_context: 'analyse_modal',
    verdict_propsight: 'LMNP réel plus performant sur le net-net.',
    created_at: '2026-04-10T10:00:00Z',
    updated_at: '2026-04-10T10:00:00Z',
    created_by: 'user_me',
  },
];
