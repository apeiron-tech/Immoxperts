import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, TrendingUp, MapPin, BarChart3, Home, Building2, Calculator, FileText, Briefcase, Search } from 'lucide-react';

type BlogCategory = 'all' | 'prix' | 'marche' | 'local' | 'achat-vente' | 'investir' | 'data' | 'pro';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
  date: string;
}

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: BlogCategory; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'Tous les articles', icon: FileText },
    { id: 'prix', label: 'Prix & valeur', icon: TrendingUp },
    { id: 'marche', label: 'Tendances marché', icon: BarChart3 },
    { id: 'local', label: 'Analyses locales', icon: MapPin },
    { id: 'achat-vente', label: 'Acheter & vendre', icon: Home },
    { id: 'investir', label: 'Investir', icon: Building2 },
    { id: 'data', label: 'Comprendre les données', icon: Calculator },
    { id: 'pro', label: 'Expertise pro', icon: Briefcase },
  ];

  const articles: BlogArticle[] = [
    {
      id: 'carte-prix-immobiliers-dvf-guide',
      title: 'Carte des prix immobiliers : comprendre les ventes réelles DVF et analyser un quartier',
      excerpt:
        "Guide complet : comprendre DVF (ventes réelles), le délai de mise à jour et comment analyser un quartier avant d'acheter, vendre ou investir.",
      category: 'data',
      categoryLabel: 'Comprendre les données',
      readTime: 12,
      tags: ['DVF', 'Carte des prix', 'Guide', 'Analyse quartier'],
      featured: true,
      date: '2026-01-02',
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(a => a.featured);

  // SEO Meta Tags
  useEffect(() => {
    // Update document title
    document.title = 'Carte des prix immobiliers : comprendre les ventes réelles DVF et analyser un quartier | Propsight';

    // Update or create meta description
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

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://propsight.fr/blog/carte-prix-immobiliers-dvf-guide');

    // OG Tags
    const ogTags = [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: 'Carte des prix immobiliers : comprendre les ventes réelles DVF et analyser un quartier' },
      {
        property: 'og:description',
        content:
          "DVF (ventes réelles), délai de publication, méthode d'analyse d'un quartier, et différences entre la carte officielle et une carte orientée usage.",
      },
      { property: 'og:image', content: 'https://propsight.fr/og-carte-dvf.jpg' },
      { property: 'og:url', content: 'https://propsight.fr/blog/carte-prix-immobiliers-dvf-guide' },
    ];

    ogTags.forEach(({ property, content }) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    });

    // JSON-LD Schema
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Carte des prix immobiliers : guide complet pour comprendre les ventes réelles (DVF) et analyser un quartier',
          description:
            "Guide complet pour comprendre DVF (ventes réelles), le délai de mise à jour et comment analyser un quartier avant d'acheter, vendre ou investir.",
          datePublished: '2026-01-02',
          dateModified: '2026-01-02',
          inLanguage: 'fr-FR',
          author: { '@type': 'Organization', name: 'Propsight' },
          publisher: { '@type': 'Organization', name: 'Propsight' },
          image: 'https://propsight.fr/og-carte-dvf.jpg',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://propsight.fr/blog/carte-prix-immobiliers-dvf-guide',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: "DVF, c'est quoi ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'DVF signifie Demandes de valeurs foncières. Ce sont des données publiques qui permettent de consulter des transactions immobilières déjà réalisées (ventes réelles). Les annonces correspondent à des prix affichés, souvent négociables.',
              },
            },
            {
              '@type': 'Question',
              name: 'Pourquoi les ventes DVF ne sont pas en temps réel ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Les données DVF sont publiées selon un calendrier officiel semestriel (mise à jour fin avril et fin octobre), ce qui crée un décalage entre la date de vente et la date de disponibilité dans les fichiers.',
              },
            },
            {
              '@type': 'Question',
              name: 'Comment analyser un quartier avec DVF ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Méthode en 4 étapes : 1) choisir une zone précise, 2) filtrer des biens comparables (type, surface, pièces), 3) sélectionner une période cohérente, 4) construire une fourchette à partir de ventes comparables.',
              },
            },
          ],
        },
      ],
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLd);

    // Cleanup function
    return () => {
      // Optionally reset title on unmount
      document.title = 'Propsight';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, hsl(245 58% 62% / 0.1), transparent)',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)', color: 'hsl(245 58% 62%)' }}
            >
              <BarChart3 className="h-4 w-4" />
              Analyses & décryptages
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Le marché immobilier décrypté par les données
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Analyses sectorielles, tendances et conseils basés sur les transactions réelles. Pas d'opinion, que des faits.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-6 sm:py-8 border-b border-gray-200 bg-white sticky top-[76px] z-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Search */}
          <div className="max-w-md mx-auto mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article, une ville..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base"
                style={{ '--tw-ring-color': 'hsl(245 58% 62%)' } as React.CSSProperties & { '--tw-ring-color'?: string }}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 px-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                style={activeCategory === category.id ? { backgroundColor: 'hsl(245 58% 62%)' } : {}}
              >
                <category.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {activeCategory === 'all' && searchQuery === '' && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">À la une</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles.map(article => (
                <article
                  key={article.id}
                  className="group relative p-6 md:p-8 rounded-2xl border transition-all duration-300"
                  style={{
                    background: 'linear-gradient(to bottom right, hsl(245 58% 62% / 0.05), transparent)',
                    borderColor: 'hsl(245 58% 62% / 0.2)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)', color: 'hsl(245 58% 62%)' }}
                    >
                      {article.categoryLabel}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min
                    </span>
                  </div>

                  <h3
                    className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 transition-colors group-hover:opacity-80"
                    style={{ color: 'hsl(245 58% 62%)' }}
                  >
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-6">{article.excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {article.id === 'carte-prix-immobiliers-dvf-guide' && (
                    <button
                      onClick={() => navigate(`/blog/${article.id}`)}
                      className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-80 group/btn"
                      style={{ color: 'hsl(245 58% 62%)' }}
                    >
                      Lire l'analyse
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {activeCategory === 'all' ? 'Tous les articles' : categories.find(c => c.id === activeCategory)?.label}
            </h2>
            <span className="text-xs sm:text-sm text-gray-600">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun article trouvé pour cette recherche.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <article
                  key={article.id}
                  className="group p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/blog/${article.id}`)}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-900">{article.categoryLabel}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min
                    </span>
                  </div>

                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2 transition-colors line-clamp-2 group-hover:opacity-80"
                    style={{ color: 'hsl(245 58% 62%)' }}
                  >
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {article.id === 'carte-prix-immobiliers-dvf-guide' && (
                    <button
                      onClick={() => navigate(`/blog/${article.id}`)}
                      className="inline-flex items-center gap-1 text-sm hover:underline"
                      style={{ color: 'hsl(245 58% 62%)' }}
                    >
                      Lire l'analyse
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div
            className="max-w-4xl mx-auto p-8 md:p-12 rounded-2xl border"
            style={{
              background: 'linear-gradient(to bottom right, hsl(245 58% 62% / 0.1), hsl(245 58% 62% / 0.05))',
              borderColor: 'hsl(245 58% 62% / 0.2)',
            }}
          >
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">Passez de la lecture à l'action</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Les analyses c'est bien, les appliquer c'est mieux. Explorez les prix réels de votre secteur dès maintenant.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end flex-shrink-0">
                <button
                  onClick={() => navigate('/PrixImmobliers')}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90 group whitespace-nowrap text-sm sm:text-base"
                  style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                >
                  Voir les ventes réelles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                {/* <button
                  onClick={() => navigate('/estimation')}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 font-medium rounded-lg border-2 transition-all duration-200 hover:opacity-90 whitespace-nowrap text-sm sm:text-base"
                  style={{ borderColor: 'hsl(245 58% 62%)', color: 'hsl(245 58% 62%)', backgroundColor: 'white' }}
                >
                  Estimer un bien
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tags Cloud */}
      <section className="py-12 md:py-16 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Thématiques populaires</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {[
              'Prix au m²',
              'Lyon',
              'Paris',
              'Bordeaux',
              'Investissement locatif',
              'LMNP',
              'Estimation',
              'DVF',
              'Tendances 2024',
              'Négociation',
              'Rentabilité',
              'Fiscalité',
            ].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:text-gray-900 hover:border-opacity-50 transition-all"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'hsl(245 58% 62%)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
