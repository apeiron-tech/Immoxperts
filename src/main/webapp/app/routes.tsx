import React from 'react';
import { Navigate, Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';

// Shells
import PublicShell from 'app/layouts/public/PublicShell';
import WidgetShell from 'app/layouts/widget/WidgetShell';
import ReportShell from 'app/layouts/report/ReportShell';
import AuthShell from 'app/layouts/auth/AuthShell';
import AppShellPro from 'app/layouts/pro/AppShellPro';
import ProPlaceholderPage from 'app/layouts/pro/ProPlaceholderPage';
import RequireAuth from 'app/shared/auth/RequireAuth';

// Public pages (existing + new)
import PublicHome from './features/public/home/PublicHome';
import ProLanding from './features/public/pro-landing/ProLanding';
import PrixImmobiliersPage from './pages/public/prix-immobiliers/PrixImmobiliersPage';
import Achat from './pages/Achat';
import Louer from './pages/Louer';
import PropertySearch from './features/property/PropertySearch';
import Estimation from './features/estimation/Estimation';
import EstimationRechercher from './features/estimation/EstimationSearch';
import EstimationPage from './pages/public/estimation/EstimationPage';
import InvestissementPage from './pages/public/investissement/InvestissementPage';
import SimulateurPage from './pages/public/investissement/simulateur/SimulateurPage';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import MentionsLegales from './pages/MentionsLegales';
import CGU from './pages/CGU';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Cookies from './pages/Cookies';
import TrouveAgent from './pages/TrouveAgent';
import VoirLagence from './pages/VoirLagence';
import Testimonials from './pages/Testimonials';
import PackPro from './pages/PackPro';
import Home from './pages/Home';
import StreetStats from 'app/features/property/StreetStats';
import GeatMapPage from 'app/pages/GeatMapPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import ResetPage from './pages/auth/ResetPage';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';

// Widgets publics (iframes)
import SellerWidget from './features/widgets/public/SellerWidget';
import InvestorWidget from './features/widgets/public/InvestorWidget';

// Rapport partagé
import RapportPublic from './features/estimation/avis-valeur/RapportPublic';
import TestTemplate from './features/shared/template-rapport/__test/TestTemplate';

// Pro pages
import DashboardPage from './features/dashboard/DashboardPage';
import PilotageCommercial from './features/activite/pilotage/PilotageCommercial';
import LeadsPage from './features/activite/leads/LeadsPage';
import PerformancePage from './features/activite/performance/PerformancePage';
import PortefeuillePage from './features/biens/portefeuille/PortefeuillePage';
import AnnoncesPage from './features/biens/annonces/AnnoncesPage';
import DvfPage from './features/biens/dvf/DvfPage';
import RadarPage from './features/prospection/radar/RadarPage';
import SignauxDvfPage from './features/prospection/signaux-dvf/SignauxDvfPage';
import SignauxDpePage from './features/prospection/signaux-dpe/SignauxDpePage';
import WidgetsHub from './features/widgets/pages/WidgetsHub';
import WidgetPage from './features/widgets/pages/WidgetPage';
import WidgetLeadDetail from './features/widgets/leads/WidgetLeadDetail';
import EstimationRapideList from './features/estimation/rapide/EstimationRapideList';
import EstimationRapideDetail from './features/estimation/rapide/EstimationRapideDetail';
import AvisValeurList from './features/estimation/avis-valeur/AvisValeurList';
import AvisValeurDetail from './features/estimation/avis-valeur/AvisValeurDetail';
import EtudeLocativeList from './features/estimation/etude-locative/EtudeLocativeList';
import EtudeLocativeDetail from './features/estimation/etude-locative/EtudeLocativeDetail';
import ExpertList from './features/estimation/expert/ExpertList';
import ExpertDetail from './features/estimation/expert/ExpertDetail';
import OpportunitesPage from './features/investissement/opportunites/OpportunitesPage';
import DossiersLanding from './features/investissement/dossiers/DossiersLanding';
import ProjetWorkspace from './features/investissement/dossiers/ProjetWorkspace';
import DossierEditeur from './features/investissement/dossiers/DossierEditeur';
import MarchePage from './features/observatoire/marche/MarchePage';
import TensionPage from './features/observatoire/tension/TensionPage';
import ContexteLocalPage from './features/observatoire/contexte-local/ContexteLocalPage';
import AlertesPage from './features/veille/alertes/AlertesPage';
import NotificationsPage from './features/veille/notifications/NotificationsPage';
import BiensSuivisPage from './features/veille/biens-suivis/BiensSuivisPage';
import AgencesPage from './features/veille/agences/AgencesPage';
import StudioOverviewPage from './features/studio-marketing/overview/StudioOverviewPage';
import AtelierPage from './features/studio-marketing/atelier/AtelierPage';
import MarketingAnnoncesPage from './features/studio-marketing/annonces/MarketingAnnoncesPage';
import DiffusionPage from './features/studio-marketing/diffusion/DiffusionPage';
import InteractionsPage from './features/studio-marketing/interactions/InteractionsPage';
import PerformanceMarketingPage from './features/studio-marketing/performance/PerformanceMarketingPage';
import BibliothequePage from './features/studio-marketing/bibliotheque/BibliothequePage';
import VueEquipePage from './features/equipe/vue/VueEquipePage';
import ActiviteEquipePage from './features/equipe/activite/ActiviteEquipePage';
import PortefeuilleEquipePage from './features/equipe/portefeuille/PortefeuillePage';
import AgendaEquipePage from './features/equipe/agenda/AgendaPage';
import PerformanceEquipePage from './features/equipe/performance/PerformancePage';

const AppRoutes: React.FC = () => (
  <div className="view-routes">
    <ErrorBoundaryRoutes>
      {/* Public — marketing + outils freemium */}
      <Route element={<PublicShell variant="marketing" footer="full" />}>
        <Route index element={<PublicHome />} />
        <Route path="home-legacy" element={<Home />} />
        <Route path="ressources" element={<Blog />} />
        <Route path="ressources/:id" element={<BlogArticle />} />
        <Route path="blog" element={<Navigate to="/ressources" replace />} />
        <Route path="blog/:id" element={<BlogArticle />} />
        <Route path="estimation" element={<EstimationPage />} />
        <Route path="investissement" element={<InvestissementPage />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="cgu" element={<CGU />} />
        <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="cookies" element={<Cookies />} />
        <Route path="apropos" element={<TrouveAgent />} />
        <Route path="VoirLagence" element={<VoirLagence />} />
        <Route path="temoignages" element={<Testimonials />} />
        <Route path="pack-pro" element={<PackPro />} />
      </Route>

      {/* Landing Pro */}
      <Route element={<PublicShell variant="marketing-pro" footer="full" header="marketing-pro" />}>
        <Route path="pro" element={<ProLanding />} />
      </Route>

      {/* Carte DVF publique */}
      <Route element={<PublicShell variant="map" footer="minimal" />}>
        <Route path="prix-immobiliers" element={<PrixImmobiliersPage />} />
        <Route path="PrixImmobliers" element={<Navigate to="/prix-immobiliers" replace />} />
      </Route>

      {/* Annonces / Acheter / Louer */}
      <Route element={<PublicShell variant="search" footer="minimal" />}>
        <Route path="annonces" element={<Achat />} />
        <Route path="achat" element={<Achat />} />
        <Route path="louer" element={<Louer />} />
        <Route path="RecherchAchat" element={<PropertySearch mode="achat" />} />
        <Route path="RecherchLouer" element={<PropertySearch mode="louer" />} />
      </Route>

      {/* Estimateur / simulateurs */}
      <Route element={<PublicShell variant="simulator" footer="minimal" />}>
        <Route path="investissement/simulateur" element={<SimulateurPage />} />
        <Route path="estimation-legacy" element={<Estimation />} />
        <Route path="EstimationRechercher" element={<EstimationRechercher />} />
      </Route>

      {/* Outils legacy publics (pas de footer) */}
      <Route element={<PublicShell variant="map" footer="minimal" />}>
        <Route path="streetStats" element={<StreetStats />} />
        <Route path="geatmap" element={<GeatMapPage />} />
      </Route>

      {/* Widgets iframes */}
      <Route element={<WidgetShell />}>
        <Route path="widget/estimation" element={<SellerWidget />} />
        <Route path="widget/investissement" element={<InvestorWidget />} />
      </Route>

      {/* Rapport partagé */}
      <Route element={<ReportShell />}>
        <Route path="rapport/:token" element={<RapportPublic />} />
        <Route path="test-template" element={<TestTemplate />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthShell />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="login/reset" element={<ResetPage />} />
        <Route path="account/activate/:key" element={<Activate />} />
        <Route path="account/reset/finish" element={<PasswordResetFinish />} />
      </Route>

      <Route path="logout" element={<Logout />} />

      {/* Application Pro — tout sous AppShellPro */}
      <Route element={<RequireAuth />}>
        <Route path="app" element={<AppShellPro />}>
          <Route index element={<Navigate to="tableau-de-bord" replace />} />
          <Route path="tableau-de-bord" element={<DashboardPage />} />

          <Route path="activite">
            <Route index element={<Navigate to="pilotage" replace />} />
            <Route path="pilotage" element={<PilotageCommercial />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<WidgetLeadDetail />} />
            <Route path="performance" element={<PerformancePage />} />
          </Route>

          <Route path="biens">
            <Route index element={<Navigate to="portefeuille" replace />} />
            <Route path="portefeuille" element={<PortefeuillePage />} />
            <Route path="annonces" element={<AnnoncesPage />} />
            <Route path="dvf" element={<DvfPage />} />
          </Route>

          <Route path="prospection">
            <Route index element={<Navigate to="radar" replace />} />
            <Route path="radar" element={<RadarPage />} />
            <Route path="signaux-dvf" element={<SignauxDvfPage />} />
            <Route path="signaux-dpe" element={<SignauxDpePage />} />
          </Route>

          <Route path="widgets">
            <Route index element={<WidgetsHub />} />
            <Route path="estimation-vendeur" element={<WidgetPage />} />
            <Route path="projet-investisseur" element={<WidgetPage />} />
            <Route path=":slug" element={<WidgetPage />} />
          </Route>

          <Route path="estimation">
            <Route index element={<Navigate to="rapide" replace />} />
            <Route path="rapide" element={<EstimationRapideList />} />
            <Route path="rapide/:id" element={<EstimationRapideDetail />} />
            <Route path="avis-valeur" element={<AvisValeurList />} />
            <Route path="avis-valeur/:id" element={<AvisValeurDetail />} />
            <Route path="etude-locative" element={<EtudeLocativeList />} />
            <Route path="etude-locative/:id" element={<EtudeLocativeDetail />} />
            <Route path="expert" element={<ExpertList />} />
            <Route path="expert/:id" element={<ExpertDetail />} />
          </Route>

          <Route path="investissement">
            <Route index element={<Navigate to="opportunites" replace />} />
            <Route path="opportunites" element={<OpportunitesPage />} />
            <Route path="dossiers" element={<DossiersLanding />} />
            <Route path="dossiers/projets/:id" element={<ProjetWorkspace />} />
            <Route path="dossiers/:id" element={<DossierEditeur />} />
          </Route>

          <Route path="observatoire">
            <Route index element={<Navigate to="marche" replace />} />
            <Route path="marche" element={<MarchePage />} />
            <Route path="tension" element={<TensionPage />} />
            <Route path="contexte-local" element={<ContexteLocalPage />} />
            <Route path="contexte" element={<Navigate to="/app/observatoire/contexte-local" replace />} />
          </Route>

          <Route path="veille">
            <Route index element={<Navigate to="notifications" replace />} />
            <Route path="alertes" element={<AlertesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="biens-suivis" element={<BiensSuivisPage />} />
            <Route path="agences-concurrentes" element={<AgencesPage />} />
          </Route>

          <Route path="studio-marketing">
            <Route index element={<StudioOverviewPage />} />
            <Route path="annonces" element={<MarketingAnnoncesPage />} />
            <Route path="atelier" element={<AtelierPage />} />
            <Route path="diffusion" element={<DiffusionPage />} />
            <Route path="campagnes" element={<Navigate to="/app/studio-marketing/diffusion" replace />} />
            <Route path="interactions" element={<InteractionsPage />} />
            <Route path="performance" element={<PerformanceMarketingPage />} />
            <Route path="bibliotheque" element={<BibliothequePage />} />
          </Route>

          <Route path="equipe">
            <Route index element={<Navigate to="vue" replace />} />
            <Route path="vue" element={<VueEquipePage />} />
            <Route path="activite" element={<ActiviteEquipePage />} />
            <Route path="portefeuille" element={<PortefeuilleEquipePage />} />
            <Route path="agenda" element={<AgendaEquipePage />} />
            <Route path="performance" element={<PerformanceEquipePage />} />
          </Route>

          <Route path="parametres" element={<ProPlaceholderPage />} />
          <Route path="parametres/*" element={<ProPlaceholderPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<PageNotFound />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default AppRoutes;
