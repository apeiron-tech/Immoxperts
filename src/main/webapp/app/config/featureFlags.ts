export type FeatureFlag =
  | 'equipe'
  | 'widgets'
  | 'investissement'
  | 'observatoire'
  | 'veille'
  | 'ai-assistant'
  | 'studio-marketing'
  | 'studio-plan-marketing-adv'
  | 'leads';

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  equipe: true,
  widgets: true,
  investissement: true,
  observatoire: true,
  veille: true,
  'ai-assistant': false,
  'studio-marketing': true,
  'studio-plan-marketing-adv': true,
  leads: true,
};

export const isFeatureEnabled = (flag: FeatureFlag): boolean => DEFAULT_FLAGS[flag] ?? false;
