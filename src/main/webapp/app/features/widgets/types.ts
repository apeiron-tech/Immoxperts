// Types pour la feature Widgets publics (maquette statique)

export type WidgetType = 'estimation_vendeur' | 'projet_investisseur';
export type WidgetSlug = 'estimation-vendeur' | 'projet-investisseur';

export type WidgetStatus = 'active' | 'inactive';

export type WidgetTab =
  | 'vue-ensemble'
  | 'etapes'
  | 'apparence'
  | 'formulaire'
  | 'contenu-resultat'
  | 'automatisations'
  | 'templates'
  | 'integration'
  | 'performance';

export interface KpiValue {
  label: string;
  value: string | number;
  delta?: number;
  deltaUnit?: '%' | 'pts';
  format?: 'number' | 'percent';
}

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  slug: WidgetSlug;
  title: string;
  domain: string;
  domainUrl: string;
  status: WidgetStatus;
  version: string;
  leadsLast30d: number;
  conversionRate: number;
  lastActivity: string;
  previewThumb: string; // path or placeholder
}

export type ActivityEventType =
  | 'lead_created'
  | 'code_copied'
  | 'widget_updated'
  | 'widget_viewed'
  | 'whatsapp_prepared'
  | 'email_sent'
  | 'rdv_proposed';

export interface ActivityEntry {
  id: string;
  type: ActivityEventType;
  widget: WidgetType;
  user: string;
  date: string; // ISO
  label?: string;
}

export interface WidgetStep {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  active: boolean;
  complete: boolean;
  formFields?: string[];
}

export interface ResultField {
  id: string;
  label: string;
  visiblePublic: boolean;
  visibleAgent: boolean;
  format?: string;
}

// Stratégie investisseur (résultat public)
export interface InvestorStrategy {
  strategy_primary: {
    id: string;
    title: string;
    description: string;
    icon: string;
    badge: string;
    kpi: {
      target_rent: number;
      gross_yield: number;
      rental_tension: string;
    };
  };
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    kpi: { target_rent: number; gross_yield: number };
  }>;
  key_points: Array<{
    type: string;
    title: string;
    text: string;
    severity: 'success' | 'warning' | 'danger';
  }>;
}

export interface SellerValuation {
  min: number;
  max: number;
  median_per_sqm_min: number;
  median_per_sqm_max: number;
  confidence: 'high' | 'medium' | 'low';
  days_on_market: number;
  market_trend: 'dynamic' | 'balanced' | 'tight';
  comparables_count: number;
  median_price: number;
}

export type TemplateChannel =
  | 'email_initial'
  | 'email_relance'
  | 'whatsapp_initial'
  | 'whatsapp_relance'
  | 'confirmation_interne';

export interface MessageTemplate {
  channel: TemplateChannel;
  subject?: string;
  body: string;
  attachments?: string[];
}

export interface WidgetLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: WidgetType;
  createdAt: string;
  property: {
    address: string;
    type: string;
    surface: number;
    rooms: number;
  };
  insights: {
    medianPricePerSqm: number;
    trend6m: number;
    daysOnMarket: number;
    comparablesCount: number;
    mainStrength: string;
    mainWarning: string;
    nextBestAction: string;
  };
}

export interface WebhookHistoryEntry {
  event: string;
  status: number;
  timestamp: string;
}

export interface FunnelStep {
  label: string;
  value: number;
  rate?: number;
}
