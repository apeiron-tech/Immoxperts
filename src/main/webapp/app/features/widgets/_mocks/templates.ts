import type { MessageTemplate } from '../types';

export const SELLER_TEMPLATES: Record<string, MessageTemplate> = {
  email_initial: {
    channel: 'email_initial',
    subject: 'Votre première estimation pour le {{property_address}}',
    body: `Bonjour {{first_name}},

Vous trouverez ci-joint votre avis de valeur détaillé pour {{property_address}}.

Notre estimation : entre {{valuation_min}} € et {{valuation_max}} €.
Prix médian secteur : {{median_price}} €/m².

N'hésitez pas à me contacter pour en discuter.

Bien à vous,
{{agent_name}} — {{agency_name}}`,
  },
  email_relance: {
    channel: 'email_relance',
    subject: 'Avez-vous eu le temps de consulter votre estimation ?',
    body: `Bonjour {{first_name}},

J'espère que vous allez bien. Avez-vous eu l'occasion de consulter l'avis de valeur que je vous ai transmis pour {{property_address}} ?

Je reste à votre disposition pour toute question.

Bien à vous,
{{agent_name}}`,
  },
  whatsapp_initial: {
    channel: 'whatsapp_initial',
    body: `Bonjour {{first_name}} 👋

Merci pour votre demande d'estimation de votre bien situé à {{property_address}}.

D'après notre analyse, la valeur de votre bien est estimée entre {{valuation_min}} € et {{valuation_max}} €.

Vous trouverez ci-joint votre avis de valeur détaillé en PDF 📎

Nos 3 insights clés pour votre bien :
📈 Le prix médian dans votre secteur est de {{median_price}} €/m².
🏙 Le marché local est dynamique : +{{market_trend}}% sur 6 mois.
⏱ Délai de vente estimé : {{days_on_market}} jours.

Je reste à votre disposition pour en discuter et vous accompagner dans votre projet.

À très bientôt,
{{agent_name}} — {{agency_name}}`,
  },
  whatsapp_relance: {
    channel: 'whatsapp_relance',
    body: `Bonjour {{first_name}}, je me permets de revenir vers vous concernant l'estimation de votre bien à {{property_address}}. Êtes-vous disponible pour un court échange cette semaine ?

{{agent_name}}`,
  },
  confirmation_interne: {
    channel: 'confirmation_interne',
    subject: '[Widget] Nouveau lead vendeur — {{first_name}} {{last_name}}',
    body: `Nouveau lead du widget Estimation vendeur.

Nom : {{first_name}} {{last_name}}
Email : {{email}}
Téléphone : {{phone}}
Bien : {{property_address}}
Valorisation : {{valuation_min}} € — {{valuation_max}} €

Source : {{agency_name}}`,
  },
};

export const INVESTOR_TEMPLATES: Record<string, MessageTemplate> = {
  email_initial: {
    channel: 'email_initial',
    subject: 'Votre stratégie d\'investissement pour {{target_zone}}',
    body: `Bonjour {{first_name}},

Merci pour votre intérêt. Sur la base de votre projet, nous recommandons la stratégie suivante : {{recommended_strategy}}.

Rendement brut estimé : {{estimated_yield}} %
Loyer cible : {{target_rent}} €/mois
Tension locative : {{rental_tension}}

Je reste à votre disposition pour affiner cette sélection de biens avec vous.

Bien à vous,
{{agent_name}} — {{agency_name}}`,
  },
  email_relance: {
    channel: 'email_relance',
    subject: 'Sélection de biens pour votre projet d\'investissement',
    body: `Bonjour {{first_name}},

Avez-vous eu le temps de parcourir la stratégie d'investissement que je vous ai proposée ? Je peux vous soumettre une première sélection de biens compatibles.

Bien à vous,
{{agent_name}}`,
  },
  whatsapp_initial: {
    channel: 'whatsapp_initial',
    body: `Bonjour {{first_name}} 👋

Merci pour votre projet d'investissement. Notre recommandation : {{recommended_strategy}} avec un rendement brut estimé de {{estimated_yield}} %.

Je peux vous proposer une sélection de biens adaptée. Êtes-vous disponible cette semaine pour un court échange ?

{{agent_name}} — {{agency_name}}`,
  },
  whatsapp_relance: {
    channel: 'whatsapp_relance',
    body: `Bonjour {{first_name}}, je reviens vers vous concernant votre projet d'investissement. Je tiens à votre disposition une sélection de biens adaptée.

{{agent_name}}`,
  },
  confirmation_interne: {
    channel: 'confirmation_interne',
    subject: '[Widget] Nouveau lead investisseur — {{first_name}} {{last_name}}',
    body: `Nouveau lead du widget Projet investisseur.

Nom : {{first_name}} {{last_name}}
Budget : {{budget}} €
Zone ciblée : {{target_zone}}
Stratégie recommandée : {{recommended_strategy}}`,
  },
};

export const COMMON_VARIABLES = [
  '{{first_name}}',
  '{{last_name}}',
  '{{property_address}}',
  '{{agent_name}}',
  '{{agency_name}}',
  '{{rdv_link}}',
  '{{agency_phone}}',
  '{{agency_email}}',
  '{{submission_date}}',
];

export const SELLER_VARIABLES = [
  '{{valuation_min}}',
  '{{valuation_max}}',
  '{{property_type}}',
  '{{surface}}',
  '{{confidence_level}}',
  '{{median_price}}',
  '{{market_trend}}',
  '{{days_on_market}}',
  '{{comparables_count}}',
  '{{main_insight_seller}}',
  '{{avis_valeur_pdf_url}}',
];

export const INVESTOR_VARIABLES = [
  '{{budget}}',
  '{{down_payment}}',
  '{{recommended_strategy}}',
  '{{target_zone}}',
  '{{estimated_yield}}',
  '{{target_rent}}',
  '{{rental_tension}}',
  '{{main_warning}}',
  '{{next_best_action}}',
];
