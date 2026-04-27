import type { MarketingTemplate } from '../types';

export const MOCK_TEMPLATES: MarketingTemplate[] = [
  {
    template_id: 'tpl_001',
    organization_id: 'org_demo',
    name: 'Charte agence Horizon',
    description: 'Logo, couleurs et signature email branding agence.',
    scope: 'organization',
    template_type: 'visual_charter',
    is_default: true,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    template_id: 'tpl_002',
    organization_id: 'org_demo',
    name: 'Ton "Premium 16e"',
    description: 'Vocabulaire haut-de-gamme, prestige, rareté.',
    scope: 'organization',
    template_type: 'tone_voice',
    is_default: false,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    template_id: 'tpl_003',
    organization_id: 'org_demo',
    name: 'Pack "Mandat exclusif"',
    description: 'Active +Reel + Story + DM base leads VIP.',
    scope: 'organization',
    template_type: 'channel_set',
    is_default: false,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
];
