import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import NegotiationArticlePage from './NegotiationArticlePage';

const BlogArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Article "Pourquoi vous payez trop..." → page dédiée
  if (id === 'negociation-immobiliere-vrais-chiffres') {
    return <NegotiationArticlePage />;
  }

  // Article DVF (par défaut)
  const article = {
    id: 'carte-prix-immobiliers-dvf-guide',
    title: 'Carte des prix immobiliers : guide complet pour comprendre les ventes réelles (DVF) et analyser un quartier',
    date: '2026-01-02',
    readTime: 12,
    category: 'Comprendre les données',
    tags: ['DVF', 'Carte des prix', 'Guide', 'Analyse quartier'],
  };

  useEffect(() => {
    // SEO Meta Tags
    document.title = `${article.title} | Propsight`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content',
      "Guide complet : comprendre DVF (ventes réelles), le délai de mise à jour et comment analyser un quartier avant d'acheter, vendre ou investir.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        article h1, article h2, article h3, article h4 { color: #000000 !important; }
        article p { font-size: 1rem; line-height: 1.5rem; color: #000000; }
        article .dvf-article-content p,
        article .dvf-article-content ul li,
        article .dvf-article-content ol li,
        article .dvf-article-content td { font-size: 1rem !important; line-height: 1.5rem !important; color: #000000 !important; }
        article .dvf-article-content h2,
        article .dvf-article-content h3 { margin-bottom: 1rem !important; }
        .dvf-article-content.prose ul li::marker,
        .dvf-article-content .prose ul li::marker,
        article .dvf-article-content ul li::marker { color: #000000 !important; }
        .dvf-article-content.prose ul li,
        .dvf-article-content .prose ul li,
        article .dvf-article-content ul li { margin-top: 0 !important; margin-bottom: 0 !important; color: #000000 !important; }
        .dvf-article-content.prose ul li + li,
        .dvf-article-content .prose ul li + li,
        article .dvf-article-content ul li + li { margin-top: 0.25rem !important; }
        article .dvf-article-content ul.list-none li + li { margin-top: 0.5rem !important; }
      `}</style>
      {/* Header with back button */}
      <div className="bg-gray-50 sticky top-[76px] z-30">
        <div className="container mx-auto px-2 py-3 md:py-4">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'hsl(245 58% 62%)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-2 md:py-3 bg-gray-50">
        <div className="container mx-auto px-2 max-w-4xl">
          {/* Article Header */}
          <header className="mb-6 bg-gray-50 rounded-2xl pt-0 pb-0 px-2 sm:px-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight text-black">{article.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-900">Propsight</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
              <span>·</span>
              <span>{new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'hsl(245 58% 62% / 0.05)', color: 'hsl(245 58% 62%)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Body */}
          <div className="dvf-article-content prose prose-lg max-w-none space-y-6">
            <div
              className="bg-gray-50 rounded-xl px-2 sm:px-3 mb-2"
              style={{
                background: 'linear-gradient(to bottom right, hsl(245 58% 62% / 0.02), white)',
              }}
            >
              <p className="text-gray-800 leading-relaxed mb-0 font-medium">
                Quand on parle de "prix immobilier", on confond souvent deux choses :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-0 ml-2 sm:ml-4">
                <li>le prix affiché dans les annonces (prix demandé),</li>
                <li>et le prix réellement payé lors d'une vente (prix de vente final).</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Pour prendre une bonne décision (acheter, vendre, investir), le plus fiable est de partir des ventes réelles. C'est
                exactement ce que permet une carte DVF bien conçue : visualiser les transactions et filtrer pour comparer des biens vraiment
                comparables.
              </p>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 rounded-xl px-2 sm:px-3 py-2 sm:py-3 mb-2 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0 text-black">Explorer la carte dès maintenant</h2>
              <p className="mb-0 text-black max-w-2xl mx-auto">
                Entrez une adresse, une rue ou zoomez sur un quartier pour consulter les ventes réelles disponibles.
              </p>
              <Link
                to="/PrixImmobliers"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base w-full sm:w-auto text-white"
                style={{ backgroundColor: 'hsl(245 58% 62%)' }}
              >
                <span className="whitespace-normal sm:whitespace-nowrap">Explorer la carte des ventes immobilières</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              </Link>
            </div>

            {/* Section 1 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">
                1) Carte des prix immobiliers : comment consulter les ventes réelles DVF
              </h2>
              <p className="text-gray-700 leading-relaxed mb-0">
                Une carte des prix immobiliers utile n'est pas une estimation : c'est une carte qui affiche des ventes réelles, avec la
                possibilité de :
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-2 sm:ml-4">
                <li>rechercher une adresse, une rue, un quartier ou une ville,</li>
                <li>filtrer par type de bien, surface, pièces, période, prix,</li>
                <li>cliquer sur une vente pour consulter les informations disponibles.</li>
              </ul>
              <div className="bg-gray-50 rounded-lg px-2 sm:px-3">
                <p className="text-gray-800 font-medium">
                  <strong>Objectif :</strong> obtenir des références concrètes pour se positionner au juste prix.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                2) DVF (Demandes de valeurs foncières) : explication et source officielle
              </h2>
              <p className="text-gray-700 leading-relaxed ">
                DVF signifie "Demandes de valeurs foncières". Il s'agit de données publiques issues de l'administration fiscale, permettant
                de consulter des transactions immobilières déjà réalisées.
              </p>
              <div className="rounded-lg px-2 sm:px-3">
                <p className="font-semibold " style={{ color: 'hsl(245 58% 62%)' }}>
                  À retenir :
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-0 ml-2 sm:ml-4">
                  <li>DVF = prix réellement vendus (transactions enregistrées),</li>
                  <li>annonces = prix affichés aujourd'hui (souvent négociables).</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Source officielle :</strong> data.gouv.fr – "Demandes de valeurs foncières (DVF)".
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">3) Pourquoi les ventes DVF ne sont pas en temps réel ?</h2>
              <p className="text-gray-700 leading-relaxed mb-0">
                Les données DVF font l'objet d'une mise à jour semestrielle : fin avril et fin octobre. La mise à jour d'avril ajoute des
                données jusqu'à fin décembre de l'année précédente, et celle d'octobre jusqu'à fin juin de l'année en cours.
              </p>
              <p className="text-gray-700 leading-relaxed">
                C'est ce calendrier qui explique le décalage entre la date réelle d'une vente et sa disponibilité dans les fichiers.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">4) DVF couvre-t-il toute la France ?</h2>
              <p className="text-gray-700 leading-relaxed">
                Non. À ce jour, "Demande de valeurs foncières" ne couvre pas les ventes situées dans certains départements : Bas-Rhin,
                Haut-Rhin, Moselle, Mayotte.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">
                5) Comment fonctionne la carte des ventes immobilières Propsight ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-0">
                Propsight transforme DVF en un outil simple à utiliser pour l'immobilier.
              </p>
              <div className="rounded-lg px-2 sm:px-3 mb-0">
                <h3 className="text-base font-semibold mb-0" style={{ color: 'hsl(245 58% 62%)' }}>
                  Recherche
                </h3>
                <ul className="list-disc list-inside text-gray-700 ml-2 sm:ml-4">
                  <li>Recherche par adresse / rue / ville</li>
                  <li>Navigation sur la carte (zoom sur un micro-quartier)</li>
                </ul>
              </div>
              <div className="rounded-lg px-2 sm:px-3 mb-0">
                <h3 className="text-base font-semibold mb-0" style={{ color: 'hsl(245 58% 62%)' }}>
                  Filtres (pour comparer des biens comparables)
                </h3>
                <ul className="list-disc list-inside text-gray-700 ml-2 sm:ml-4">
                  <li>Type de bien (appartement, maison, terrain, local)</li>
                  <li>Nombre de pièces</li>
                  <li>Surface</li>
                  <li>Prix et prix au m²</li>
                  <li>Période (date de vente)</li>
                </ul>
              </div>
              <div className="rounded-lg px-2 sm:px-3 mb-0">
                <h3 className="text-base font-semibold mb-0" style={{ color: 'hsl(245 58% 62%)' }}>
                  Lecture
                </h3>
                <p className="text-gray-700">
                  Chaque vente affichée sert de référence : vous pouvez construire une fourchette réaliste de prix à partir de ventes
                  comparables.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 sm:px-3">
                <p className="text-gray-600 leading-relaxed text-sm">
                  <strong>Historique :</strong> la base DVF+ open data (Cerema) couvre notamment une période à partir du 1er janvier 2014
                  selon ses versions publiées.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">
                6) Carte DVF de l'État vs carte Propsight : quelle différence ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-0">
                La carte DVF officielle est une porte d'entrée utile, mais elle est souvent plus "administrative", avec une navigation
                structurée par département, commune, section cadastrale et parcelle cadastrale.
              </p>
              <p className="text-gray-700 leading-relaxed mb-0 font-medium">Propsight se différencie par :</p>
              <ul className="list-disc list-inside text-gray-700 mb-0 ml-2 sm:ml-4">
                <li>une recherche plus directe par adresse / zone,</li>
                <li>des filtres orientés décision (type de bien, pièces, surface, période),</li>
                <li>une lecture plus rapide pour analyser un micro-marché.</li>
              </ul>
              <div className="bg-gray-50 rounded-lg px-2 sm:px-3">
                <p className="text-gray-800 font-medium">
                  <strong>En résumé :</strong> la carte officielle donne accès à la donnée, Propsight vise à la rendre actionnable dans un
                  usage immobilier quotidien.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">
                7) Méthode simple pour analyser un quartier : 4 étapes (acheter, vendre, investir)
              </h2>
              <div className="space-y-0">
                <div className="rounded-lg  px-2 sm:px-3">
                  <h3 className="text-base font-semibold mb-0 text-black">Étape 1 : partir d'une zone précise</h3>
                  <p className="text-black">Adresse, rue, quartier : plus la zone est précise, plus l'analyse est utile.</p>
                </div>
                <div className="rounded-lg  px-2 sm:px-3">
                  <h3 className="text-base font-semibold mb-0 text-black">Étape 2 : filtrer pour comparer des biens comparables</h3>
                  <p className="text-black">Ne comparez pas une maison avec un appartement, ni un studio avec un T4.</p>
                </div>
                <div className="rounded-lg   px-2 sm:px-3">
                  <h3 className="text-base font-semibold mb-0 text-black">Étape 3 : choisir une période cohérente</h3>
                  <p className="text-black">Si la zone a peu de ventes, élargissez progressivement la période.</p>
                </div>
                <div className="rounded-lg  px-2 sm:px-3">
                  <h3 className="text-base font-semibold mb-0 text-black">Étape 4 : construire une fourchette de références</h3>
                  <p className="text-black">L'objectif n'est pas un prix unique, mais une fourchette basée sur des ventes comparables.</p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">
                8) Pourquoi les statistiques de marché sont masquées au lancement ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-0">
                Les statistiques (prix moyen, tendances, variations, indicateurs) demandent un algorithme robuste pour éviter :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-0 ml-2 sm:ml-4">
                <li>les biais liés aux faibles volumes,</li>
                <li>les biens atypiques,</li>
                <li>les comparaisons incohérentes,</li>
                <li>les effets de composition (ex : une période avec surtout des studios, puis surtout des T3).</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-10">
                Propsight lance d'abord la carte (ventes + filtres) et activera les statistiques quand l'algorithme sera finalisé et validé.
              </p>
              <div className="rounded-lg px-2 sm:px-3 text-center">
                <button
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                  style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  onClick={() => navigate('/apropos')}
                >
                  <span className="whitespace-normal sm:whitespace-nowrap">Être prévenu quand les statistiques seront disponibles</span>
                </button>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">9) Modules Propsight : ce qui arrive ensuite</h2>
              <p className="text-gray-700 leading-relaxed mb-0">Propsight est conçu comme une plateforme modulaire autour de la carte.</p>
              <p className="text-gray-700 leading-relaxed mb-0 font-medium">
                <strong>À venir (progressivement) :</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-10 ml-2 sm:ml-4">
                <li>Statistiques locales de marché (quand l'algorithme est validé)</li>
                <li>Estimation (fourchette + indice de confiance)</li>
                <li>Simulateur d'investissement (rendement, cash-flow, fiscalité)</li>
                <li>Agrégateur d'annonces (multi-sites, alertes, suivi)</li>
              </ul>
              <div className="rounded-lg px-2 sm:px-3 text-center">
                <button
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                  style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  onClick={() => navigate('/apropos')}
                >
                  <span className="whitespace-normal sm:whitespace-nowrap">Être prévenu quand les modules seront disponibles</span>
                </button>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">10) Checklist anti-erreurs</h2>
              <ul className="list-disc list-inside text-gray-700 mb-0 ml-2 sm:ml-4">
                <li>Ne confondez pas prix affiché (annonce) et prix vendu (DVF).</li>
                <li>Comparez des biens comparables (type, surface, pièces).</li>
                <li>Évitez de conclure sur une zone avec trop peu de ventes.</li>
                <li>Gardez en tête le délai de publication (mise à jour semestrielle).</li>
              </ul>
            </section>

            {/* Mini-FAQ */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0">Mini-FAQ</h2>
              <div className="space-y-0">
                <div>
                  <h3 className="text-base font-semibold mb-0 text-black">DVF, c'est quoi ?</h3>
                  <p className="text-gray-700">
                    DVF signifie "Demandes de valeurs foncières". Ce sont des données publiques permettant de consulter des transactions
                    immobilières déjà réalisées.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-0 text-black">Pourquoi certaines ventes récentes n'apparaissent pas ?</h3>
                  <p className="text-gray-700">Parce que DVF est publié selon un calendrier semestriel (fin avril / fin octobre).</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-0 text-black">DVF couvre-t-il toute la France ?</h3>
                  <p className="text-gray-700">Non. Bas-Rhin, Haut-Rhin, Moselle et Mayotte ne sont pas couverts.</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-0 text-black">Propsight remplace-t-il la carte officielle ?</h3>
                  <p className="text-gray-700">
                    Non. Propsight s'appuie sur la donnée publique DVF et propose une expérience plus orientée analyse et décision.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-0 text-black">Est-ce que je peux utiliser la carte Propsight sans frais ?</h3>
                  <p className="text-gray-700">
                    Oui. La carte des ventes immobilières DVF est accessible gratuitement. Les modules avancés (statistiques, estimation,
                    simulateur, agrégateur d'annonces) arriveront progressivement.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="bg-gray-100 rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-center mb-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0 text-black">Explorer la carte</h2>
              <Link
                to="/PrixImmobliers"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base w-full sm:w-auto text-white"
                style={{ backgroundColor: 'hsl(245 58% 62%)' }}
              >
                <span className="whitespace-normal sm:whitespace-nowrap">Explorer la carte des ventes immobilières</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              </Link>
            </div>

            {/* References */}
            <section className="mb-2 bg-gray-50 rounded-xl pt-0 pb-0 px-2 sm:px-3">
              <h2 className="text-lg sm:text-xl font-bold mb-0">Références (sources officielles)</h2>
              <ul className="space-y-0 text-gray-700 mb-0 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>Demandes de valeurs foncières (DVF) – data.gouv.fr</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>FAQ DVF (calendrier de mise à jour) – app.dvf.etalab.gouv.fr</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>Départements non couverts – economie.gouv.fr</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>Application DVF (navigation cadastrale) – app.dvf.etalab.gouv.fr</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>DVF+ open data – Cerema</span>
                </li>
              </ul>
            </section>

            {/* Note importante */}
            <div className="rounded-lg px-2 sm:px-3">
              <p className="text-gray-700">
                <strong style={{ color: 'hsl(245 58% 62%)' }}>Note importante :</strong> Les fichiers DVF contiennent des données à
                caractère personnel. La DGFiP rappelle des obligations de réutilisation, notamment sur l'indexation par des moteurs de
                recherche externes.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogArticle;
