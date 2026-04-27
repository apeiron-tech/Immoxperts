import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  Music2,
  MapPin,
  Mail,
  MessageSquare,
  Video,
  ClipboardList,
} from 'lucide-react';
import type { MarketingAssetType, MarketingChannelGroup } from '../types';

export interface OutputDescriptor {
  asset_type: MarketingAssetType;
  channel_group: MarketingChannelGroup;
  label: string;
  short_label: string;
  description: string;
  requires_module?: 'observatoire' | 'estimation' | 'leads' | 'investissement';
  min_datapoints: number;
}

export const OUTPUT_DESCRIPTORS: OutputDescriptor[] = [
  { asset_type: 'titre_court', channel_group: 'texte', label: 'Titre court', short_label: 'Titre court', description: '30-60 caractères', min_datapoints: 1 },
  { asset_type: 'titre_seo', channel_group: 'texte', label: 'Titre SEO', short_label: 'Titre SEO', description: '50-120 caractères', min_datapoints: 1 },
  { asset_type: 'description_portail', channel_group: 'texte', label: 'Description portail', short_label: 'Description portail', description: 'Leboncoin / SeLoger / Bien\'ici · 800-1500 caractères', min_datapoints: 3 },
  { asset_type: 'description_site_agence', channel_group: 'texte', label: 'Description site agence', short_label: 'Description site agence', description: '1500-3000 caractères · SEO local', min_datapoints: 4 },
  { asset_type: 'post_instagram_carousel', channel_group: 'instagram', label: 'Post Instagram — Carrousel', short_label: 'Carrousel', description: '800-2200 caractères + 3-5 visuels', min_datapoints: 3 },
  { asset_type: 'post_instagram_reel', channel_group: 'instagram', label: 'Post Instagram — Reel', short_label: 'Reel', description: 'Script 30-45 s + cover', min_datapoints: 2 },
  { asset_type: 'post_instagram_story', channel_group: 'instagram', label: 'Post Instagram — Story', short_label: 'Story', description: '80-150 caractères + stickers', min_datapoints: 1 },
  { asset_type: 'post_facebook', channel_group: 'facebook', label: 'Post Facebook', short_label: 'Facebook', description: '600-1200 caractères', min_datapoints: 3 },
  { asset_type: 'post_linkedin', channel_group: 'linkedin', label: 'Post LinkedIn', short_label: 'LinkedIn', description: '1000-2000 caractères · ton expertise', min_datapoints: 3 },
  { asset_type: 'script_tiktok', channel_group: 'tiktok', label: 'Script TikTok', short_label: 'TikTok', description: '30-60 s · format storytelling', min_datapoints: 2 },
  { asset_type: 'texte_google_business', channel_group: 'google', label: 'Google Business Profile', short_label: 'Google', description: '300-1500 caractères · post Quartier', min_datapoints: 2 },
  { asset_type: 'email_base_leads', channel_group: 'email', label: 'Email base leads', short_label: 'Email', description: 'Sujet + corps + CTA · personnalisable', requires_module: 'leads', min_datapoints: 3 },
  { asset_type: 'sms_court', channel_group: 'sms', label: 'SMS court', short_label: 'SMS', description: '140-320 caractères · 1 ou 2 SMS', min_datapoints: 1 },
  { asset_type: 'brief_video', channel_group: 'video', label: 'Brief vidéo (script 30 s)', short_label: 'Brief vidéo', description: 'Découpage plan / voix off / B-roll', min_datapoints: 2 },
];

export const PLAN_MARKETING_DESCRIPTOR: OutputDescriptor = {
  asset_type: 'plan_marketing_adv',
  channel_group: 'plan_adv',
  label: 'Plan marketing AdV',
  short_label: 'Plan AdV',
  description: '5 sections : cible, canaux, budget, exemples, reporting',
  requires_module: 'estimation',
  min_datapoints: 4,
};

export const CHANNEL_GROUP_LABELS: Record<MarketingChannelGroup, string> = {
  texte: 'Texte',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  google: 'Google',
  email: 'Email',
  sms: 'SMS',
  video: 'Vidéo',
  plan_adv: 'Plan AdV',
};

export const CHANNEL_GROUP_ICONS: Record<MarketingChannelGroup, LucideIcon> = {
  texte: FileText,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music2,
  google: MapPin,
  email: Mail,
  sms: MessageSquare,
  video: Video,
  plan_adv: ClipboardList,
};

export const CHANNEL_GROUP_ORDER: MarketingChannelGroup[] = [
  'texte',
  'instagram',
  'facebook',
  'linkedin',
  'tiktok',
  'google',
  'email',
  'sms',
  'video',
  'plan_adv',
];

export const ASSET_TYPE_LABEL: Record<MarketingAssetType, string> = OUTPUT_DESCRIPTORS.reduce(
  (acc, d) => ({ ...acc, [d.asset_type]: d.label }),
  { plan_marketing_adv: 'Plan marketing AdV' } as Record<MarketingAssetType, string>,
);
