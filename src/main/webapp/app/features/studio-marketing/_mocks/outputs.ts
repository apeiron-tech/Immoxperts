import type { MarketingAsset } from '../types';

const now = new Date().toISOString();
const ORG = 'org_demo';

const baseAsset = (
  asset_id: string,
  asset_type: MarketingAsset['asset_type'],
  channel_group: MarketingAsset['channel_group'],
  title: string,
  content: string,
  data_points_cited: string[],
  extras: Partial<MarketingAsset> = {},
): MarketingAsset => ({
  asset_id,
  organization_id: ORG,
  asset_type,
  channel_group,
  title,
  content,
  content_format: 'plain',
  metadata: {},
  data_points_cited,
  version: 1,
  is_edited_by_user: false,
  is_validated: false,
  status: 'ready',
  legal_mentions: [],
  created_at: now,
  updated_at: now,
  ...extras,
});

export const MOCK_OUTPUTS: MarketingAsset[] = [
  baseAsset(
    'asst_titre_court',
    'titre_court',
    'texte',
    'Titre court',
    'T3 lumineux Paris 15e — 720 000 €',
    ['prix', 'type_bien', 'localite'],
  ),
  baseAsset(
    'asst_titre_seo',
    'titre_seo',
    'texte',
    'Titre SEO',
    'Appartement T3 65 m² avenue Suffren, Paris 15e — Tour Eiffel à 5 min',
    ['type_bien', 'surface', 'rue', 'transport'],
    { metadata: { length: 78 } },
  ),
  baseAsset(
    'asst_desc_portail',
    'description_portail',
    'texte',
    'Description portails (Leboncoin / SeLoger / Bien\'ici)',
    `Idéalement situé au 4ᵉ étage avec ascenseur d'un immeuble de 1962, ce T3 de 65 m² avenue Suffren bénéficie d'une orientation traversante et d'une luminosité exceptionnelle.

Composition : entrée, séjour double exposé sud, cuisine séparée équipée, deux chambres calmes sur cour, salle de bains et WC indépendants.

Atouts différenciants :
• Quartier Tour Eiffel · transports M6, M8, RER C à 4 min à pied
• Vue dégagée sur les toits de Paris depuis le séjour
• Cave + double vitrage récent · DPE D (215 kWh/m²/an)
• Marché local actif : 47 ventes en 12 mois · délai moyen 38 jours
• Prix au m² aligné sur la médiane du quartier (11 080 €/m²)

À deux pas des écoles, commerces de bouche et marché Grenelle. Mandat exclusif Agence Horizon.

Honoraires charge vendeur. Surface Carrez : 65 m² (loi Carrez). DPE communiqué (D).`,
    ['mediane_dvf', 'nb_ventes_12m', 'delai_moyen', 'transports_score', 'dpe'],
    {
      legal_mentions: [
        { type: 'hoguet', text: 'Mandat n° 2026-0042 — honoraires charge vendeur', required: true },
        { type: 'carrez', text: 'Surface Carrez : 65 m²', required: true },
        { type: 'dpe', text: 'DPE D · 215 kWh/m²/an', required: true },
      ],
    },
  ),
  baseAsset(
    'asst_desc_site',
    'description_site_agence',
    'texte',
    'Description site agence',
    `## Un T3 d'exception à deux pas de la Tour Eiffel

Au cœur du 15ᵉ arrondissement, l'avenue Suffren conjugue prestige haussmannien et énergie de quartier. C'est ici, au 4ᵉ étage d'un bel immeuble de 1962, que nous avons le plaisir de vous présenter ce T3 traversant de 65 m².

### Le bien
Composé d'un séjour double exposé sud, d'une cuisine séparée équipée et de deux chambres calmes sur cour, l'appartement offre un volume rare pour le quartier. Salle de bains et WC indépendants. Cave en sous-sol.

### L'environnement
Quartier vivant et recherché par les jeunes actifs cadres : tension marché 7,8 / 10, profil acheteur dominant aux revenus mensuels 4 800 € à 7 200 €. Transports d'excellence (M6 Bir-Hakeim, M8 La Motte-Picquet, RER C Champ-de-Mars). Marché Grenelle, écoles publiques et privées, commerces de bouche.

### Le marché
Médiane DVF du quartier : 11 080 €/m². Notre bien : 11 077 €/m², au juste prix du marché. 47 ventes ces 12 derniers mois (marché actif). Délai moyen de transaction : 38 jours.

### À retenir
Un bien mandat exclusif, prêt à séduire les 1 240 foyers solvables identifiés sur la zone par notre observatoire local.

Demande de visite ou estimation gratuite via [agencehorizon.fr](#).`,
    ['mediane_dvf', 'tension_zone', 'profondeur_solvable', 'profil_demographique', 'nb_ventes_12m'],
  ),
  baseAsset(
    'asst_post_insta_carousel',
    'post_instagram_carousel',
    'instagram',
    'Post Instagram carrousel',
    `📍 Paris 15e | Appartement T3 lumineux à 720 000 €

Nouveau bien à découvrir au 8 avenue Suffren — un T3 de 65 m² au 4e étage avec ascenseur, idéalement positionné dans un quartier où le prix médian s'établit à 11 080 €/m² (notre bien : 11 077 €/m², au juste prix du marché).

✨ Pourquoi ce quartier ?
• 47 ventes en 12 mois (marché actif)
• Délai moyen : 38 jours
• Tension recherchée par jeunes actifs (revenus 4 800 €+)

📩 Pour visiter ou en savoir plus, DM ou estimation gratuite via le lien en bio !

#ImmobilierParis #Paris15 #T3 #AppartementParis #NouveauBien #AgenceHorizon`,
    ['mediane_dvf', 'nb_ventes_12m', 'delai_moyen', 'profondeur_solvable'],
    {
      visual_format: '1:1',
      visual_overlays: [
        { type: 'price', position: 'top_left', value: '720 000 €', style: 'badge_violet' },
        { type: 'dpe', position: 'bottom_right', value: 'DPE D', style: 'badge_outline' },
      ],
      metadata: {
        slides: ['Photo principale', 'Datapoint marché', 'CTA visite'],
        hashtags: ['#ImmobilierParis', '#Paris15', '#T3', '#AppartementParis', '#NouveauBien', '#AgenceHorizon'],
      },
    },
  ),
  baseAsset(
    'asst_post_insta_reel',
    'post_instagram_reel',
    'instagram',
    'Script Instagram Reel (30s)',
    `[Hook 0-3s] "À Paris 15e, ce T3 part au juste prix du marché."

[Storytelling 3-23s]
- Plan extérieur immeuble + voix off : "Avenue Suffren, 4e étage, 65 m²."
- Plan séjour : "Double exposition sud, vue dégagée."
- Plan cuisine + chambres : "Deux chambres calmes côté cour."
- Insert data overlay : "Médiane quartier 11 080 €/m² · ce bien 11 077 €/m²."

[CTA 23-30s] "DM ou lien en bio pour visiter — mandat exclusif Agence Horizon."

🎵 Son suggéré : Lo-fi house chill / Trending immobilier #FR
#ReelImmobilier #Paris15 #T3Paris`,
    ['mediane_dvf', 'localite'],
    {
      visual_format: '9:16',
      metadata: {
        duration_s: 30,
        broll: ['Façade', 'Séjour exposé sud', 'Cuisine', 'Chambres', 'Vue toits'],
      },
    },
  ),
  baseAsset(
    'asst_post_insta_story',
    'post_instagram_story',
    'instagram',
    'Story Instagram',
    `🆕 Nouveau mandat exclu — T3 Paris 15e à 720 k€
👉 Swipe up pour visiter

Sticker localisation : Paris 15e
Sticker question : "Vous cherchez un T3 ?"`,
    ['prix'],
    {
      visual_format: '9:16',
      metadata: { stickers: ['localisation', 'question', 'CTA swipe'] },
    },
  ),
  baseAsset(
    'asst_post_facebook',
    'post_facebook',
    'facebook',
    'Post Facebook',
    `🏡 Coup de cœur du jour — un T3 de 65 m² avenue Suffren, à deux pas de la Tour Eiffel.

Au 4e étage avec ascenseur, double exposition, vue dégagée sur les toits, deux chambres calmes côté cour : un bien rare dans un quartier où l'on compte 47 ventes en 12 mois et où le délai moyen de transaction n'est que de 38 jours.

Prix de présentation : 720 000 € (11 077 €/m²) — exactement aligné sur la médiane DVF du quartier (11 080 €/m²). Mandat exclusif Agence Horizon.

📩 Pour visiter, écrivez-nous en message privé.

#Paris15 #ImmobilierParis #AgenceHorizon`,
    ['mediane_dvf', 'nb_ventes_12m', 'delai_moyen'],
    { visual_format: '4:5' },
  ),
  baseAsset(
    'asst_post_linkedin',
    'post_linkedin',
    'linkedin',
    'Post LinkedIn',
    `Pourquoi le 15ᵉ arrondissement reste un marché de référence en 2026.

Quelques chiffres pour cadrer la conversation :
• Médiane DVF : 11 080 €/m² (-3,2 % sur 12 mois, correction modérée)
• Volume de transactions : 47 ventes en 12 mois (marché actif)
• Délai moyen de vente : 38 jours
• Profil acheteur dominant : jeune actif cadre, revenus 4 800 € - 7 200 €
• Profondeur solvable : 1 240 foyers identifiés sur le secteur

Dans ce contexte, nous présentons en mandat exclusif un T3 de 65 m² avenue Suffren, positionné précisément à la médiane (11 077 €/m²). C'est à ce niveau de prix que l'on observe les meilleurs délais de mise sous compromis et la qualité de leads la plus élevée — un point souvent oublié des stratégies de pricing.

#ImmobilierParis #Paris15 #PricingImmobilier #DVF`,
    ['mediane_dvf', 'evolution_12m', 'tension_zone', 'profondeur_solvable', 'profil_demographique'],
  ),
  baseAsset(
    'asst_script_tiktok',
    'script_tiktok',
    'tiktok',
    'Script TikTok (45s)',
    `[0-2s · Hook face caméra] "Combien coûte vraiment un T3 à Paris 15e en 2026 ?"

[2-12s · Storytelling rue] "Avenue Suffren, à 5 min de la Tour Eiffel. La médiane DVF c'est 11 080 €/m². Et ce bien-là ?"

[12-30s · Plan intérieur] "65 m² traversants, 4ᵉ étage avec ascenseur, double expo sud, deux chambres calmes côté cour. Refait, prêt à vivre."

[30-40s · Révélation] "Prix de présentation : 720 000 €. Soit 11 077 €/m². Exactement le prix du marché — pas un euro de plus."

[40-45s · CTA] "Lien en bio pour visiter ou estimer ton bien gratuitement."

🎵 Son trending immobilier · #ImmoTok #TipsImmobilier #Paris15 #T3`,
    ['mediane_dvf', 'prix_m2'],
    {
      visual_format: '9:16',
      metadata: {
        duration_s: 45,
        sons_suggeres: ['Trending immo FR 2026 #1', 'Lo-fi house chill', 'Voiceover narratif'],
      },
    },
  ),
  baseAsset(
    'asst_google_business',
    'texte_google_business',
    'google',
    'Post Google Business Profile',
    `🏡 Nouveauté — T3 65 m² avenue Suffren, Paris 15e

Mandat exclusif. Au juste prix du marché : 720 000 € (11 077 €/m², médiane quartier 11 080 €/m²). 4e étage avec ascenseur, double exposition, vue dégagée.

📩 Visite sur RDV — Agence Horizon Paris 15e.`,
    ['mediane_dvf', 'prix_m2'],
    { metadata: { tag: 'Nouveauté' } },
  ),
  baseAsset(
    'asst_email_base',
    'email_base_leads',
    'email',
    'Email à la base de leads',
    `Sujet : T3 65 m² Paris 15e à découvrir avant publication

Pre-header : Mandat exclusif · au juste prix du marché DVF · à 5 min de la Tour Eiffel

Bonjour {{prenom}},

Vous m'aviez confié votre recherche d'un T2 / T3 sur Paris 15e avec un budget autour de {{budget}}. Je voulais vous présenter, avant publication sur les portails, un bien que nous venons de prendre en mandat exclusif.

🏡 T3 traversant de 65 m² au 4ᵉ étage avec ascenseur — 8 avenue Suffren, Paris 15e.
- Double exposition sud, vue dégagée sur les toits
- Deux chambres calmes côté cour, cuisine équipée séparée
- DPE D (215 kWh/m²/an) · cave · double vitrage récent
- Prix de présentation : 720 000 € (11 077 €/m²) — exactement la médiane DVF du quartier

Quelques éléments de marché pour vous aider à vous décider :
• 47 ventes en 12 mois sur le micro-marché (marché actif)
• Délai moyen de transaction : 38 jours
• Tension marché 7,8 / 10

Souhaitez-vous que je vous organise une visite cette semaine ?

À très vite,
[Signature]`,
    ['mediane_dvf', 'nb_ventes_12m', 'delai_moyen', 'tension_zone'],
    {
      metadata: {
        matching_leads_count: 47,
        personalisation: ['{{prenom}}', '{{budget}}', '{{zone_recherchee}}'],
      },
    },
  ),
  baseAsset(
    'asst_sms',
    'sms_court',
    'sms',
    'SMS court',
    `Bonjour {{prenom}}, nouveau T3 mandat exclusif Paris 15e à 720 k€ (juste prix marché). Visite cette semaine ? RDV : prop.si/v15a · Agence Horizon`,
    ['prix'],
    { metadata: { sms_count: 2, length: 158 } },
  ),
  baseAsset(
    'asst_brief_video',
    'brief_video',
    'video',
    'Brief vidéo (30s)',
    `Plan 1 · 0-3s · Voix off : "T3 lumineux Paris 15e." · Visuel : façade + entrée immeuble.
Plan 2 · 3-10s · Voix off : "65 m², 4ᵉ étage, double exposition." · Visuel : séjour traversant.
Plan 3 · 10-18s · Voix off : "Deux chambres calmes côté cour." · Visuel : chambres + couloir.
Plan 4 · 18-25s · Voix off : "Au juste prix du marché — 11 077 €/m² vs médiane 11 080 €/m²." · Visuel : insert data + cuisine.
Plan 5 · 25-30s · Voix off : "Mandat exclusif Agence Horizon. Visite sur RDV." · Visuel : signature agence + numéro.

Conseils techniques : tournage iPhone 15 Pro · 4K 24 fps · gimbal · lumière naturelle matinée · son original puis voix off post.`,
    ['mediane_dvf', 'prix_m2'],
    { metadata: { duration_s: 30 } },
  ),
];

export const MOCK_PLAN_MARKETING_OUTPUTS: MarketingAsset[] = [
  baseAsset(
    'asst_plan_marketing',
    'plan_marketing_adv',
    'plan_adv',
    'Plan marketing AdV',
    'Plan marketing complet en 5 sections (cible, canaux, budget, exemples, reporting).',
    ['profondeur_solvable', 'tension_zone', 'delai_moyen', 'mediane_dvf'],
  ),
];
