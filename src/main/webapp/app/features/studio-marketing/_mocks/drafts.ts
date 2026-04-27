import type { AtelierDraftSummary } from '../types';

export const MOCK_DRAFTS_RECENT: AtelierDraftSummary[] = [
  {
    draft_id: 'drft_recent_001',
    source_type: 'bien',
    source_label: 'T3 Paris 15e — 8 av. Suffren',
    status: 'draft',
    updated_at: new Date(Date.now() - 30 * 60_000).toISOString(),
  },
  {
    draft_id: 'drft_recent_002',
    source_type: 'bien',
    source_label: 'Studio Paris 12e — 22 rue Daumesnil',
    status: 'draft',
    updated_at: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  },
  {
    draft_id: 'drft_recent_003',
    source_type: 'bien',
    source_label: 'Loft Bordeaux Chartrons',
    status: 'draft',
    updated_at: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
  },
];
