import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const NegotiationArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const article = {
    id: 'negociation-immobiliere-vrais-chiffres',
    title: 'Pourquoi vous payez trop (ou vendez trop bas) : les vrais chiffres de la négociation immobilière',
    date: '2026-02-04',
    readTime: 7,
    category: 'Acheter & vendre',
    tags: ['Négociation', 'Prix réels', 'Marché'],
  };

  useEffect(() => {
    document.title = `${article.title} | Propsight`;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content',
      "Un article sur les données réelles de l'immobilier français — et pourquoi presque personne ne les consulte.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        article h1, article h2, article h3, article h4 { color: #000000 !important; }
        article p { font-size: 1rem; line-height: 1.5rem; color: #000000; }
        article .negotiation-article-content p,
        article .negotiation-article-content ul li,
        article .negotiation-article-content ol li,
        article .negotiation-article-content td { font-size: 1rem !important; line-height: 1.5rem !important; color: #000000 !important; }
        article .negotiation-article-content h2,
        article .negotiation-article-content h3 { margin-bottom: 1rem !important; }
        /* Override Tailwind Typography (prose): black bullets, equal spacing between all li */
        .negotiation-article-content.prose ul li::marker,
        .negotiation-article-content .prose ul li::marker,
        article .negotiation-article-content ul li::marker { color: #000000 !important; }
        .negotiation-article-content.prose ul li,
        .negotiation-article-content .prose ul li,
        article .negotiation-article-content ul li { margin-top: 0 !important; margin-bottom: 0 !important; color: #000000 !important; }
        .negotiation-article-content.prose ul li + li,
        .negotiation-article-content .prose ul li + li,
        article .negotiation-article-content ul li + li { margin-top: 0.25rem !important; }
        article .negotiation-article-content ul.list-none li + li { margin-top: 0.5rem !important; }
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

      <article className="py-2 md:py-3 bg-gray-50">
        <div className="container mx-auto px-2 max-w-4xl">
          <header className="mb-6 bg-gray-50 rounded-2xl pt-0 pb-0 px-2 sm:px-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight text-black">{article.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-900">Propsight</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
              <span>·</span>
              <span>22 hours ago</span>
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

          <div className="negotiation-article-content prose prose-lg max-w-none space-y-6">
            <p className="text-gray-800">
              Un article sur les données réelles de l&apos;immobilier français — et pourquoi presque personne ne les consulte.
            </p>

            <p>
              Vous venez de trouver l&apos;appartement de vos rêves. Le prix : 420 000 €. Vous faites une offre à 405 000 € (3,5 % de
              réduction). L&apos;agent répond : &quot;C&apos;est déjà très serré.&quot; Vous négociez. Finalement : 395 000 €. Vous vous
              félicitez. Vous avez économisé 25 000 €.
            </p>

            <p>
              Mais voilà la question : aviez-vous vraiment cette marge ? Ou aviez-vous pu l&apos;avoir à 385 000 € ? Ou au contraire,
              payez-vous plus que la réalité du marché ?
            </p>
            <p>La plupart des gens n&apos;en ont aucune idée.</p>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-black">
                Le problème : les chiffres qu&apos;on consulte ne disent rien
              </h2>
              <p className="mb-2">Avant de négocier, vous avez fait ce que tout le monde fait :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Googler &quot;prix immobilier [quartier]&quot;</li>
                <li>Consulter 2-3 sites pour voir ce qui s&apos;affiche</li>
                <li>Appeler un agent pour &quot;une estimation&quot;</li>
                <li>Demander à des amis : &quot;À combien tu as acheté ?&quot;</li>
              </ul>
              <p className="mb-3">Vous avez récolté des chiffres. Beaucoup. Contradictoires.</p>
              <ul className="list-disc list-inside ml-2">
                <li>&quot;Les T3 se vendent en moyenne 5 200 €/m².&quot;</li>
                <li>&quot;Mon agent dit 5 500 €/m².&quot;</li>
                <li>&quot;Mon voisin l&apos;a eu à 4 900 €/m².&quot;</li>
                <li>&quot;Sur LeBonCoin, j&apos;en vois à 5 800 €/m².&quot;</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Qui croire ?</h2>
              <p className="mb-4">Voici le problème : tous ces chiffres sont vrais ET faux en même temps.</p>
              <h3 className="text-lg font-bold mb-2 text-black">Ce qui se passe vraiment : les statistiques de la négociation</h3>
              <p className="mb-4">Parlons des faits mesurés.</p>
              <h4 className="font-bold mb-2">Stat 1 : La marge de négociation (le prix affiché vs le prix réellement payé)</h4>
              <p className="mb-4">
                Entre l&apos;affichage et la signature chez le notaire, il y a un écart systématique et mesurable. Voici les marges
                observées en 2024-2025 :
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">Situation</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Marge de négociation</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Île-de-France (Paris + périphérie)</td>
                      <td className="border border-gray-300 px-3 py-2">6,3 % (appartements)</td>
                      <td className="border border-gray-300 px-3 py-2">Early Birds Paris, données 2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">France (moyenne nationale, fin 2024)</td>
                      <td className="border border-gray-300 px-3 py-2">7,5 % (global : 8,7 % maisons, 6,1 % appartements)</td>
                      <td className="border border-gray-300 px-3 py-2">Observatoire des prix de l&apos;immobilier, fin 2024</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">France (juillet 2025)</td>
                      <td className="border border-gray-300 px-3 py-2">9,3 % (maisons 10,3 %, appartements 8,1 %)</td>
                      <td className="border border-gray-300 px-3 py-2">LPI-iad Baromètre, juillet 2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">France (janvier 2026 – record)</td>
                      <td className="border border-gray-300 px-3 py-2">10 %</td>
                      <td className="border border-gray-300 px-3 py-2">MoteurImmo, niveau record depuis 10 ans</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold mb-2">Comment ça se traduit en euros ?</h4>
              <p className="font-medium mb-1">Exemple 1 : À Paris/Île-de-France</p>
              <ul className="list-disc list-inside mb-4 ml-2">
                <li>T3 affiché à 300 000 €</li>
                <li>Marge : 6,3 %</li>
                <li>Prix réel attendu : ~281 000 €</li>
                <li>Vous pensez avoir négocié = vous êtes juste au prix du marché</li>
              </ul>
              <p className="font-medium mb-1">Exemple 2 : En région dynamique (juillet 2025)</p>
              <ul className="list-disc list-inside mb-4 ml-2">
                <li>Maison affichée à 400 000 €</li>
                <li>Marge pour maisons : 10,3 %</li>
                <li>Prix réel attendu : ~359 000 €</li>
                <li>Écart : 41 000 €</li>
              </ul>

              <p className="mb-3">Ce que ça veut dire : vous ne savez pas où est la marge réelle sans ces données.</p>
              <p className="mb-6 text-sm text-gray-600">
                Source des calculs : Chiffres du Baromètre LPI-iad (juillet 2025) et Early Birds Paris (2025). Les pourcentages reflètent la
                différence moyenne entre prix affiché et prix vendu observée sur des années de transactions.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">Stat 2 : La durée en annonce influence votre pouvoir de négociation</h3>
              <p className="mb-3">Plus un bien reste longtemps affiché, plus la marge augmente.</p>
              <p className="mb-2 font-medium">Corrélation observée :</p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full max-w-md border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">Temps en annonce</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Marge estimée</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">0-3 mois</td>
                      <td className="border border-gray-300 px-3 py-2">5-8 %</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">3-6 mois</td>
                      <td className="border border-gray-300 px-3 py-2">8-12 %</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">6-12 mois</td>
                      <td className="border border-gray-300 px-3 py-2">12-18 %</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">12+ mois</td>
                      <td className="border border-gray-300 px-3 py-2">18-25 %</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="font-bold mb-2">Délai moyen de vente avant signature (mars 2024, Meilleurs Agents) :</p>
              <ul className="grid gap-1 md:grid-cols-2 list-none ml-0 mb-6">
                <li>Montpellier : 90 jours</li>
                <li>Toulouse : 86 jours</li>
                <li>Bordeaux : 85 jours</li>
                <li>Nantes : 83 jours</li>
                <li>Nice : 81 jours</li>
                <li>Lyon : 79 jours</li>
                <li>Marseille : 76 jours</li>
                <li>Rennes : 74 jours</li>
                <li>Paris : 73 jours</li>
                <li>Lille : 62 jours</li>
                <li>Strasbourg : 60 jours</li>
                <li>France (moyenne) : 77 jours</li>
              </ul>

              <p className="mb-3 font-medium">Mécanisme psychologique :</p>
              <p className="mb-3">
                Un bien en vente depuis 6+ mois signale un problème aux acheteurs – prix trop haut, défaut structurel, ou désintérêt du
                vendeur. Les vendeurs qui dépassent 120 jours acceptent généralement des réductions de 15-20 %.
              </p>
              <p className="mb-6 text-sm text-gray-600">
                Source : Seloger (2024) enquête sur les délais de vente, Meilleurs Agents (mars 2024).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">Stat 3 : Les variables qui créent les écarts réels de prix</h3>
              <p className="mb-2">Pourquoi deux T3 identiques à la même rue peuvent avoir 15-20 % d&apos;écart ?</p>
              <p className="mb-4">Parce que le marché paye pour des variables mesurables, pas du hasard.</p>
              <p className="mb-2 font-medium">Variables d&apos;ajustement typiques :</p>
              <ul className="list-disc list-inside ml-2 mb-6">
                <li>État général (bon état vs à rénover) : ±8–12 %</li>
                <li>Rénovation énergétique (classe E/F → classe C) : +4–5 %</li>
                <li>Étage/Exposition (rez vs 3e étage avec vue) : ±5–10 %</li>
                <li>Année rénovation (&lt; 3 ans vs &gt; 15 ans) : ±5–8 %</li>
                <li>Ascenseur (pour 4+ étages) : ±4–7 %</li>
                <li>Balcon/Terrasse (vs sans) : ±2–5 %</li>
                <li>Parking (place incluse vs pas de parking) : ±3–6 %</li>
                <li>Vis-à-vis/Bruit (rue calme vs bruyante) : ±3–8 %</li>
                <li>Proximité transports (50 m métro vs 400 m) : ±2–4 %</li>
              </ul>

              <p className="font-bold mb-2">Exemple concret – Deux T3, 65 m², même rue à Lyon :</p>
              <p className="font-medium mb-1">T3 n°1 :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Année : 2004</li>
                <li>État : non rénové</li>
                <li>Étage : 4e sans ascenseur</li>
                <li>Exposition : mauvaise</li>
                <li>Balcon : non</li>
                <li>Prix vendu : 180 000 € (2 769 €/m²)</li>
              </ul>
              <p className="font-medium mb-1">T3 n°2 :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Année : 2019</li>
                <li>État : rénové (cuisine + salle de bain)</li>
                <li>Étage : 2e avec ascenseur</li>
                <li>Exposition : bonne</li>
                <li>Balcon : oui</li>
                <li>Prix vendu : 220 000 € (3 385 €/m²)</li>
              </ul>
              <p className="mb-3">Écart : 40 000 € (22 %) – Totalement explicable par les variables.</p>
              <p className="mb-6 text-sm text-gray-600">
                Source : Données Brickmeup (2024) sur impact rénovation énergétique, Capital/Meilleurs Agents (2021) sur impact
                étage/exposition, Pretto/Crédit Agricole (2025) sur variables ajustement.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">La donnée que presque personne ne consulte</h2>
              <p className="mb-4">
                Il existe <strong>UNE</strong> source officielle qui enregistre <strong>TOUS</strong> les prix réellement payés en France.
                Elle s&apos;appelle DVF (Demandes de Valeurs Foncières).
              </p>
              <h3 className="text-lg font-bold mb-2">Qu&apos;est-ce que c&apos;est ?</h3>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Base de données publique, open data, gratuite</li>
                <li>Enregistre le prix réel de vente (pas annoncé, vraiment payé)</li>
                <li>Couvre ~95 % des transactions immobilières France métropolitaine</li>
                <li>Regroupe toutes les transactions immobilières depuis 2014</li>
                <li>~1 million de transactions par an</li>
                <li>Contient : prix exact, surface, type de bien, date, adresse précise</li>
              </ul>
              <p className="mb-2 font-medium">Où la trouver :</p>
              <p className="mb-4">data.gouv.fr (ressource officielle DGFIP).</p>
              <p className="mb-2">
                Cette base est retravaillée dans une interface intuitive avec des données fiables sur Propsight, plateforme gratuite
                d&apos;analyse du marché immobilier.
              </p>
              <p className="mb-6 text-sm text-gray-600">Source : DGFIP.</p>

              <div className="bg-gray-100 rounded-xl px-4 py-6 text-center max-w-md mx-auto">
                <p className="font-bold mb-1">Get Propsight&apos;s stories in your Inbox</p>
                <p className="text-gray-600 mb-4">Join Medium for free to get updates from this writer.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <button type="button" className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-gray-800 hover:bg-gray-700">
                    Subscribe
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Exemple comparé : comment les données changent la donne</h2>

              <h3 className="text-lg font-bold mb-3">Scénario A : Négociation à l&apos;aveugle (90 % des gens)</h3>
              <p className="mb-3">Vous envisagez un T2, 55 m², rue Jean-Macé, Lyon 7e. Affiché à 250 000 €.</p>
              <p className="mb-2 font-medium">Vous cherchez :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Un site dit &quot;Lyon 7e : 4 800 €/m² moyenne&quot;</li>
                <li>55 m² x 4 800 € = 264 000 €</li>
                <li>Conclusion : &quot;C&apos;est en dessous, c&apos;est bon&quot;</li>
              </ul>
              <p className="mb-2">Vous proposez 240 000 €.</p>
              <p className="mb-2">Agent : &quot;C&apos;est trop bas.&quot;</p>
              <p className="mb-2">Vous négociez.</p>
              <p className="mb-4">Vous signez : 248 000 €</p>
              <p className="mb-6">Vous pensez avoir économisé 2 000 €. Mais aviez-vous vraiment une marge ?</p>

              <h3 className="text-lg font-bold mb-3">Scénario B : Négociation avec données réelles</h3>
              <p className="mb-3">Même T2, 55 m², rue Jean-Macé, Lyon 7e. Affiché à 250 000 €.</p>
              <p className="mb-2 font-medium">Vous cherchez dans Propsight :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>T2 de 50-60 m²</li>
                <li>Rue Jean-Macé + adjacentes (200 m)</li>
                <li>12 derniers mois</li>
              </ul>
              <p className="mb-2 font-medium">Vous trouvez :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>T2 54 m² (juillet 2024) : 228 000 € → 4 222 €/m²</li>
                <li>T2 57 m² (octobre 2024) : 235 000 € → 4 123 €/m²</li>
                <li>T2 56 m² (janvier 2025) : 238 000 € → 4 250 €/m²</li>
                <li>T2 55 m² (février 2025) : 240 000 € → 4 364 €/m²</li>
              </ul>
              <p className="mb-2">Moyenne locale : 4 240 €/m²</p>
              <p className="mb-2">Votre T2 à 250 000 € = 4 545 €/m²</p>
              <p className="mb-2">Écart : +7,2 % vs la réalité locale</p>
              <p className="mb-2">Vous proposez 238 000 € (4 327 €/m² – légèrement au-dessus local).</p>
              <p className="mb-2">L&apos;agent sait que vous avez les données.</p>
              <p className="mb-2">Vous négociez avec certitude.</p>
              <p className="mb-4">Vous signez : 240 000 €</p>

              <p className="font-bold mb-2">Différence entre A et B :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Scénario A : +2 000 € économisé, aucune certitude</li>
                <li>Scénario B : +10 000 € économisé, certitude basée sur données réelles</li>
              </ul>
              <p className="mb-6 text-sm text-gray-600">
                Source : Méthode de comparaison basée sur les données DVF mises en valeur par Propsight. Les données sont fictives (exemple
                pédagogique).
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Pourquoi les ventes réelles battent les annonces</h2>
              <p className="mb-3 font-medium">Un prix affiché ≠ un prix de marché.</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Prix affiché = espoir du vendeur</li>
                <li>Prix payé = réalité de l&apos;équilibre offre-demande</li>
                <li>DVF = la vérité du marché</li>
              </ul>
              <p className="mb-2 font-medium">Quand le marché est surchauffé (peu de biens, beaucoup d&apos;acheteurs) :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Marge de négociation faible (3-5 %)</li>
                <li>Les vendeurs prennent les prix affichés</li>
              </ul>
              <p className="mb-2 font-medium">Quand le marché est calme (beaucoup de biens, peu d&apos;acheteurs) :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Marge de négociation grosse (15-25 %)</li>
                <li>Les vendeurs affichent haut, les acheteurs négocient fort</li>
              </ul>
              <p className="mb-4">
                <strong>Actuellement (2026) : marge record de 10 %</strong> = marché acheteur exceptionnellement favorable.
              </p>
              <p className="mb-6 text-sm text-gray-600">Source : LPI-iad Baromètre (juillet 2025), Observatoire des prix (fin 2024).</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Les limites (parce qu&apos;il n&apos;y a pas de magie)</h2>
              <p className="mb-4">DVF capture 95 % des transactions, mais :</p>
              <p className="mb-2 font-medium">Délai de publication :</p>
              <p className="mb-4 pl-4">6 mois entre signature et enregistrement. → Les données récentes ne sont pas encore là.</p>
              <p className="mb-2 font-medium">Bruit dans les données :</p>
              <p className="mb-4 pl-4">
                Certains prix extrêmes peuvent être des erreurs ou des cas spéciaux (héritage, échange). → À filtrer avec bon sens.
              </p>
              <p className="mb-2 font-medium">Variables non-enregistrées :</p>
              <p className="mb-4 pl-4">
                DVF enregistre prix et adresse, pas l&apos;état détaillé du bien. → Vous voyez &quot;T3 : 200 000 €&quot; et &quot;T3 : 280
                000 € rue d&apos;à côté&quot; mais vous ne savez pas immédiatement lequel était rénové.
              </p>
              <p className="mb-2 font-medium">Zones non couvertes :</p>
              <p className="mb-4 pl-4">Alsace-Moselle, Mayotte, quelques communes. → 5 % des transactions manquent.</p>
              <p className="mb-2 font-bold">Conclusion :</p>
              <p className="mb-4">les données éclairent le jugement. Elles ne le remplacent pas.</p>
              <p className="mb-6 text-sm text-gray-600">Source : DGFIP (notes sur DVF).</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Ce qui change maintenant (2025-2026)</h2>
              <p className="mb-4">Depuis 2023, des plateformes structurent enfin DVF de manière exploitable comme Propsight.</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Cartes interactives montrant les ventes rue par rue</li>
                <li>Filtres précis (T2 55-65 m², pas rénové, 12 derniers mois)</li>
                <li>Indicateurs de tendance locale</li>
                <li>Durée de vente moyen par secteur</li>
              </ul>
              <p className="mb-4">Ce n&apos;est pas de la magie. C&apos;est rendre accessible ce qui existait déjà.</p>
              <p className="mb-4">
                Pour la première fois : n&apos;importe qui peut chercher les vraies ventes comparables. Pas juste les notaires et agents.
              </p>
              <p className="mb-6 text-sm text-gray-600">Plateforme exemple : Propsight.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Le chiffre final : l&apos;impact en euros</h2>
              <p className="font-bold mb-2">Sur un achat de 300 000 € :</p>
              <p className="font-medium mb-1">Sans données :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Vous négociez sans repère</li>
                <li>Réduction typique : 5–10 % (15 000 à 30 000 €)</li>
                <li>Vous ne savez pas si c&apos;est bon</li>
              </ul>
              <p className="font-medium mb-1">Avec Propsight :</p>
              <ul className="list-disc list-inside ml-2 mb-6">
                <li>Optimisation : 18 000 à 30 000 € sur la fourchette possible</li>
                <li>Vous savez exactement où vous êtes</li>
              </ul>

              <p className="font-bold mb-2">Sur une vente à 300 000 € :</p>
              <p className="font-medium mb-1">Vendeur qui affiche au hasard :</p>
              <ul className="list-disc list-inside ml-2 mb-4">
                <li>Risque : rester 6–12+ mois en annonce</li>
                <li>Décote finale : 12–18 % (36 000 à 54 000 €)</li>
              </ul>
              <p className="font-medium mb-1">Vendeur qui affiche au prix réel (basé DVF) :</p>
              <ul className="list-disc list-inside ml-2 mb-6">
                <li>Vente en 60–80 jours (moyenne villes dynamiques)</li>
                <li>Pas de décote surprise</li>
              </ul>

              <h3 className="text-lg font-bold mb-3">Le message clé</h3>
              <p className="mb-4">
                La donnée immobilière n&apos;a de valeur que si elle vous dit : &quot;À combien ça s&apos;est vraiment vendu à côté,
                récemment, et pourquoi l&apos;écart existe.&quot;
              </p>
              <ul className="list-none ml-0 mb-4">
                <li>Les prix affichés ? Des points de départ.</li>
                <li>Les moyennes de quartier ? Des cadres utiles, insuffisants.</li>
                <li>Les estimations génériques ? Juste du bruit.</li>
              </ul>
              <p className="font-medium mb-4">Les ventes réelles structurées = le signal.</p>
              <p>
                Ça change les règles. Ça rend transparent ce qui était opaque. Ça met acheteurs et vendeurs sur le même pied d&apos;égalité.
              </p>
            </section>

            <div className="bg-gray-100 rounded-xl px-4 py-6 text-center">
              <h2 className="text-xl font-bold mb-2">Explorer les ventes réelles</h2>
              <Link
                to="/PrixImmobliers"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg text-white"
                style={{ backgroundColor: 'hsl(245 58% 62%)' }}
              >
                Voir la carte des prix
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NegotiationArticlePage;
