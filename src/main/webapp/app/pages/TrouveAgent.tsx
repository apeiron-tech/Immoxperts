import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Users, Lightbulb, Shield, ArrowRight, CheckCircle, Building2, TrendingUp, Map, Clock, Calendar, Mail } from 'lucide-react';

const values = [
  {
    icon: <Target className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Transparence',
    description: 'Nous rendons les données immobilières accessibles à tous, particuliers comme professionnels.',
  },
  {
    icon: <Users className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Simplicité',
    description: 'Des outils intuitifs et efficaces, pensés pour vous faire gagner du temps.',
  },
  {
    icon: <Lightbulb className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Innovation',
    description: "L'intelligence artificielle au service de décisions immobilières éclairées.",
  },
  {
    icon: <Shield className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Fiabilité',
    description: 'Des données officielles et vérifiées pour des estimations précises.',
  },
];

const stats = [
  { value: '20M+', label: 'Transactions DVF depuis 2014' },
  { value: '700 000', label: 'Annonces immobilières agrégées', breakValue: true },
  { value: 'IA', label: 'Estimation & Scoring intelligent' },
];

const blogPosts = [
  {
    title: 'Comment estimer la valeur de son bien immobilier en 2024 ?',
    excerpt: 'Découvrez les méthodes les plus fiables pour évaluer votre bien : comparaison DVF, analyse de marché et outils en ligne.',
    category: 'Guide',
    readTime: '8 min',
    date: '15 Nov 2024',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    tags: ['Estimation', 'DVF', 'Prix'],
  },
  {
    title: 'Investissement locatif : calculer sa rentabilité nette',
    excerpt: "Cashflow, rendement brut vs net, fiscalité... Tout ce qu'il faut savoir pour analyser un investissement immobilier.",
    category: 'Investissement',
    readTime: '12 min',
    date: '8 Nov 2024',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    tags: ['Rentabilité', 'Cashflow', 'Fiscalité'],
  },
  {
    title: 'Les données DVF : comprendre les prix réels du marché',
    excerpt: "Qu'est-ce que les données DVF ? Comment les utiliser pour prendre des décisions éclairées ?",
    category: 'Data',
    readTime: '6 min',
    date: '2 Nov 2024',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    tags: ['DVF', 'Open Data', 'Analyse'],
  },
  {
    title: 'Premier achat immobilier : les erreurs à éviter',
    excerpt: 'Budget, négociation, diagnostics... Les pièges classiques et comment les contourner pour réussir votre achat.',
    category: 'Guide',
    readTime: '10 min',
    date: '25 Oct 2024',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=250&fit=crop',
    tags: ['Premier achat', 'Conseils', 'Budget'],
  },
  {
    title: 'Tendances du marché immobilier : bilan T3 2024',
    excerpt: 'Évolution des prix, volumes de transactions, disparités régionales : notre analyse complète du trimestre.',
    category: 'Marché',
    readTime: '15 min',
    date: '18 Oct 2024',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
    tags: ['Marché', 'Tendances', '2024'],
  },
  {
    title: 'Location meublée vs vide : quel régime fiscal choisir ?',
    excerpt: 'LMNP, micro-foncier, régime réel... Comparatif détaillé pour optimiser la fiscalité de votre investissement.',
    category: 'Fiscalité',
    readTime: '11 min',
    date: '10 Oct 2024',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=250&fit=crop',
    tags: ['Fiscalité', 'LMNP', 'Location'],
  },
];

const categoryColors: Record<string, string> = {
  Guide: 'bg-purple-100 text-purple-600',
  Investissement: 'bg-emerald-100 text-emerald-600',
  Data: 'bg-blue-100 text-blue-600',
  Marché: 'bg-amber-100 text-amber-600',
  Fiscalité: 'bg-rose-100 text-rose-600',
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{title}</h2>
    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const TrouveAgent: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    setEmail('');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 md:px-8">
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background: 'var(--gradient-hero)',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6">
              Démocratiser l'accès aux données immobilières
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90">
              Propsight est né d'une conviction simple : tout le monde mérite d'avoir accès aux informations nécessaires pour prendre les
              bonnes décisions immobilières.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-20 bg-white px-4 sm:px-6 md:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-sm uppercase tracking-wider font-semibold" style={{ color: 'hsl(245 58% 62%)' }}>
                Notre mission
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4 md:mb-6">
                Rendre l'immobilier plus transparent
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6">
                Le marché immobilier français a longtemps souffert d'un manque de transparence. Les particuliers peinent à évaluer le juste
                prix d'un bien, tandis que les professionnels manquent d'outils pour optimiser leur activité.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8">
                Propsight change la donne en centralisant les données publiques (DVF) et les annonces du marché dans une plateforme unique,
                accessible et intuitive.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-900">Accès gratuit aux données de ventes immobilières</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-900">Outils d'analyse et de simulation pour tous</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-900">Solutions professionnelles pour les agents et agences</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-200">
              <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 items-end">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center flex flex-col items-center">
                    <p
                      className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-pre-line leading-tight mb-2 sm:mb-3"
                      style={{
                        color: 'hsl(245 58% 62%)',
                      }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight whitespace-nowrap">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 bg-gray-50 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto">
          <SectionTitle title="Nos valeurs" subtitle="Les principes qui guident notre action au quotidien." />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)' }}
                >
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 md:py-20 bg-white px-4 sm:px-6 md:px-8">
        <div className="container mx-auto">
          <SectionTitle title="Le blog Propsight" subtitle="Guides, analyses et actualités pour réussir vos projets immobiliers." />

          {/* Featured Post */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto">
                  <img src={blogPosts[0].image} alt={blogPosts[0].title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[blogPosts[0].category]}`}>
                      {blogPosts[0].category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {blogPosts[0].readTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {blogPosts[0].date}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{blogPosts[0].title}</h3>
                  <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blogPosts[0].tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 w-fit"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Lire l'article
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>{post.category}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2 transition-all duration-200 hover:opacity-90"
              style={{
                borderColor: 'hsl(245 58% 62%)',
                backgroundColor: 'white',
                color: 'hsl(245 58% 62%)',
              }}
            >
              Voir tous les articles
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* What we offer - Hidden */}
      {/* <section className="py-12 md:py-20 bg-gray-50 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto">
          <SectionTitle title="Ce que nous proposons" subtitle="Des outils pour tous vos projets immobiliers." />

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--gradient-primary)' }}>
                <Map className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Carte des ventes DVF</h3>
              <p className="text-sm text-gray-600 mb-4">Explorez les transactions immobilières réelles de votre quartier.</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Disponible
              </span>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--gradient-primary)' }}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agrégateur d'annonces</h3>
              <p className="text-sm text-gray-600 mb-4">Toutes les annonces du marché centralisées en un seul endroit.</p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)', color: 'hsl(245 58% 62%)' }}
              >
                Bientôt disponible
              </span>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--gradient-primary)' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Outils pros</h3>
              <p className="text-sm text-gray-600 mb-4">Solutions complètes pour les professionnels de l'immobilier.</p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)', color: 'hsl(245 58% 62%)' }}
              >
                Bientôt disponible
              </span>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-12 md:py-20 relative overflow-hidden px-4 sm:px-6 md:px-8">
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background: 'var(--gradient-hero)',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              Prêt à explorer le marché immobilier ?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 md:mb-8">
              Commencez dès maintenant avec notre carte des ventes DVF, 100% gratuite.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/PrixImmobliers">
                <button
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium bg-white transition-all duration-200 hover:opacity-90 text-sm sm:text-base w-full sm:w-auto"
                  style={{ color: 'hsl(245 58% 62%)' }}
                >
                  Explorer la carte DVF
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              {/* <Link to="/pack-pro">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2 transition-all duration-200 hover:opacity-90"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'transparent',
                    color: 'white',
                  }}
                >
                  Découvrir le Pack Pro
                </button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-white px-4 sm:px-6 md:px-8">
        <div className="container mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Restez informé</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6">
              Recevez nos actualités et soyez prévenu du lancement des nouvelles fonctionnalités.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail size={20} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none text-sm sm:text-base"
                  style={
                    {
                      '--tw-ring-color': 'hsl(245 58% 62%)',
                    } as React.CSSProperties & { '--tw-ring-color'?: string }
                  }
                  onFocus={e => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px hsl(245 58% 62%)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Être prévenu
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrouveAgent;
