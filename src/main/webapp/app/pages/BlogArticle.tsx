import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ArrowRight, MapPin } from 'lucide-react';

const BlogArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Article data - pour l'instant, on utilise l'article DVF
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
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-[76px] z-30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)', color: 'hsl(245 58% 62%)' }}
              >
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {article.readTime} min de lecture
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Quand on parle de "prix immobilier", on confond souvent deux choses :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
                <li>le prix affiché dans les annonces (prix demandé),</li>
                <li>et le prix réellement payé lors d'une vente (prix de vente final).</li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed">
                Pour prendre une bonne décision (acheter, vendre, investir), le plus fiable est de partir des ventes réelles. C'est
                exactement ce que permet une carte DVF bien conçue : visualiser les transactions et filtrer pour comparer des biens vraiment
                comparables.
              </p>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 md:p-8 text-white mb-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Explorer la carte dès maintenant</h2>
              <p className="mb-6 text-indigo-100">
                Entrez une adresse, une rue ou zoomez sur un quartier pour consulter les ventes réelles disponibles.
              </p>
              <Link
                to="/PrixImmobliers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Explorer la carte des ventes immobilières
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Section 1 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                1) Carte des prix immobiliers : comment consulter les ventes réelles DVF
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Une carte des prix immobiliers utile n'est pas une estimation : c'est une carte qui affiche des ventes réelles, avec la
                possibilité de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                <li>rechercher une adresse, une rue, un quartier ou une ville,</li>
                <li>filtrer par type de bien, surface, pièces, période, prix,</li>
                <li>cliquer sur une vente pour consulter les informations disponibles.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Objectif :</strong> obtenir des références concrètes pour se positionner au juste prix.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                2) DVF (Demandes de valeurs foncières) : explication et source officielle
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                DVF signifie "Demandes de valeurs foncières". Il s'agit de données publiques issues de l'administration fiscale, permettant
                de consulter des transactions immobilières déjà réalisées.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>À retenir :</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2 ml-4">
                  <li>DVF = prix réellement vendus (transactions enregistrées),</li>
                  <li>annonces = prix affichés aujourd'hui (souvent négociables).</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Source officielle :</strong> data.gouv.fr – "Demandes de valeurs foncières (DVF)".
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">3) Pourquoi les ventes DVF ne sont pas en temps réel ?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les données DVF font l'objet d'une mise à jour semestrielle : fin avril et fin octobre. La mise à jour d'avril ajoute des
                données jusqu'à fin décembre de l'année précédente, et celle d'octobre jusqu'à fin juin de l'année en cours.
              </p>
              <p className="text-gray-700 leading-relaxed">
                C'est ce calendrier qui explique le décalage entre la date réelle d'une vente et sa disponibilité dans les fichiers.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">4) DVF couvre-t-il toute la France ?</h2>
              <p className="text-gray-700 leading-relaxed">
                Non. À ce jour, "Demande de valeurs foncières" ne couvre pas les ventes situées dans certains départements : Bas-Rhin,
                Haut-Rhin, Moselle, Mayotte.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                5) Comment fonctionne la carte des ventes immobilières Propsight ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Propsight transforme DVF en un outil simple à utiliser pour l'immobilier.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Recherche</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Recherche par adresse / rue / ville</li>
                  <li>Navigation sur la carte (zoom sur un micro-quartier)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Filtres (pour comparer des biens comparables)</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Type de bien (appartement, maison, terrain, local)</li>
                  <li>Nombre de pièces</li>
                  <li>Surface</li>
                  <li>Prix et prix au m²</li>
                  <li>Période (date de vente)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Lecture</h3>
                <p className="text-gray-700">
                  Chaque vente affichée sert de référence : vous pouvez construire une fourchette réaliste de prix à partir de ventes
                  comparables.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm text-gray-600">
                <strong>Historique :</strong> la base DVF+ open data (Cerema) couvre notamment une période à partir du 1er janvier 2014
                selon ses versions publiées.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                6) Carte DVF de l'État vs carte Propsight : quelle différence ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                La carte DVF officielle est une porte d'entrée utile, mais elle est souvent plus "administrative", avec une navigation
                structurée par département, commune, section cadastrale et parcelle cadastrale.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">Propsight se différencie par :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                <li>une recherche plus directe par adresse / zone,</li>
                <li>des filtres orientés décision (type de bien, pièces, surface, période),</li>
                <li>une lecture plus rapide pour analyser un micro-marché.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>En résumé :</strong> la carte officielle donne accès à la donnée, Propsight vise à la rendre actionnable dans un
                usage immobilier quotidien.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                7) Méthode simple pour analyser un quartier : 4 étapes (acheter, vendre, investir)
              </h2>
              <div className="space-y-6">
                <div className="bg-white border-l-4 border-indigo-500 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Étape 1 : partir d'une zone précise</h3>
                  <p className="text-gray-700">Adresse, rue, quartier : plus la zone est précise, plus l'analyse est utile.</p>
                </div>
                <div className="bg-white border-l-4 border-indigo-500 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Étape 2 : filtrer pour comparer des biens comparables</h3>
                  <p className="text-gray-700">Ne comparez pas une maison avec un appartement, ni un studio avec un T4.</p>
                </div>
                <div className="bg-white border-l-4 border-indigo-500 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Étape 3 : choisir une période cohérente</h3>
                  <p className="text-gray-700">Si la zone a peu de ventes, élargissez progressivement la période.</p>
                </div>
                <div className="bg-white border-l-4 border-indigo-500 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Étape 4 : construire une fourchette de références</h3>
                  <p className="text-gray-700">
                    L'objectif n'est pas un prix unique, mais une fourchette basée sur des ventes comparables.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                8) Pourquoi les statistiques de marché sont masquées au lancement ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les statistiques (prix moyen, tendances, variations, indicateurs) demandent un algorithme robuste pour éviter :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                <li>les biais liés aux faibles volumes,</li>
                <li>les biens atypiques,</li>
                <li>les comparaisons incohérentes,</li>
                <li>les effets de composition (ex : une période avec surtout des studios, puis surtout des T3).</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Propsight lance d'abord la carte (ventes + filtres) et activera les statistiques quand l'algorithme sera finalisé et validé.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">Être prévenu dès que les statistiques locales sont disponibles :</p>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => navigate('/TrouverAgent')}
                >
                  Être prévenu quand les statistiques seront disponibles
                </button>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">9) Modules Propsight : ce qui arrive ensuite</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Propsight est conçu comme une plateforme modulaire autour de la carte.</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>À venir (progressivement) :</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                <li>Statistiques locales de marché (quand l'algorithme est validé)</li>
                <li>Estimation (fourchette + indice de confiance)</li>
                <li>Simulateur d'investissement (rendement, cash-flow, fiscalité)</li>
                <li>Agrégateur d'annonces (multi-sites, alertes, suivi)</li>
              </ul>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">Être prévenu à l'ouverture des prochains modules :</p>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => navigate('/TrouverAgent')}
                >
                  Être prévenu quand les modules seront disponibles
                </button>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">10) Checklist anti-erreurs</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Ne confondez pas prix affiché (annonce) et prix vendu (DVF).</li>
                <li>Comparez des biens comparables (type, surface, pièces).</li>
                <li>Évitez de conclure sur une zone avec trop peu de ventes.</li>
                <li>Gardez en tête le délai de publication (mise à jour semestrielle).</li>
              </ul>
            </section>

            {/* Mini-FAQ */}
            <section className="mb-12 bg-gray-50 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Mini-FAQ</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">DVF, c'est quoi ?</h3>
                  <p className="text-gray-700">
                    DVF signifie "Demandes de valeurs foncières". Ce sont des données publiques permettant de consulter des transactions
                    immobilières déjà réalisées.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pourquoi certaines ventes récentes n'apparaissent pas ?</h3>
                  <p className="text-gray-700">Parce que DVF est publié selon un calendrier semestriel (fin avril / fin octobre).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">DVF couvre-t-il toute la France ?</h3>
                  <p className="text-gray-700">Non. Bas-Rhin, Haut-Rhin, Moselle et Mayotte ne sont pas couverts.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Propsight remplace-t-il la carte officielle ?</h3>
                  <p className="text-gray-700">
                    Non. Propsight s'appuie sur la donnée publique DVF et propose une expérience plus orientée analyse et décision.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Est-ce que je peux utiliser la carte Propsight sans frais ?</h3>
                  <p className="text-gray-700">
                    Oui. La carte des ventes immobilières DVF est accessible gratuitement. Les modules avancés (statistiques, estimation,
                    simulateur, agrégateur d'annonces) arriveront progressivement.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 md:p-8 text-white text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Explorer la carte</h2>
              <Link
                to="/PrixImmobliers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Explorer la carte des ventes immobilières
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* References */}
            <section className="mb-12 bg-white rounded-xl p-6 md:p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Références (sources officielles)</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Demandes de valeurs foncières (DVF) – data.gouv.fr</li>
                <li>• FAQ DVF (calendrier de mise à jour) – app.dvf.etalab.gouv.fr</li>
                <li>• Départements non couverts – economie.gouv.fr</li>
                <li>• Application DVF (navigation cadastrale) – app.dvf.etalab.gouv.fr</li>
                <li>• DVF+ open data – Cerema</li>
              </ul>
            </section>

            {/* Note importante */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Note importante :</strong> Les fichiers DVF contiennent des données à caractère personnel. La DGFiP rappelle des
                obligations de réutilisation, notamment sur l'indexation par des moteurs de recherche externes.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogArticle;
