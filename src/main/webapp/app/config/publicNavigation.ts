import { publicRoutes } from './proRoutes';

export interface PublicNavItem {
  label: string;
  to: string;
  href: string;
  external?: boolean;
}

const item = (label: string, to: string, external = false): PublicNavItem => ({ label, to, href: to, external });

export const publicNavStandard: PublicNavItem[] = [
  item('Prix immobiliers', publicRoutes.prixImmobiliers),
  item('Acheter / Louer', publicRoutes.annonces),
  item('Estimation', publicRoutes.estimation),
  item('Investissement', publicRoutes.investissement),
  item('Ressources', publicRoutes.ressources),
];

export const publicNavMarketingPro: PublicNavItem[] = [
  item('Produit', '#produit'),
  item('Modules', '#modules'),
  item("Cas d'usage", '#cas-usage'),
  item('Ressources', publicRoutes.ressources),
];

export const publicNavigation = publicNavStandard;
export const proMarketingNavigation = publicNavMarketingPro;
