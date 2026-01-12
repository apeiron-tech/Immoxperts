import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Quote, Home, TrendingUp, Building2, Briefcase, MapPin, Play } from 'lucide-react';

type TestimonialCategory = 'all' | 'achat' | 'vente' | 'investissement' | 'agent';

interface Testimonial {
  id: string;
  quote: string;
  context: string;
  problem: string;
  solution: string;
  result: string;
  author: string;
  role: string;
  city: string;
  rating: number;
  category: TestimonialCategory;
  hasVideo?: boolean;
}

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<TestimonialCategory>('all');

  const categories: { id: TestimonialCategory; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'Tous', icon: Star },
    { id: 'achat', label: 'Achat', icon: Home },
    { id: 'vente', label: 'Vente', icon: TrendingUp },
    { id: 'investissement', label: 'Investissement', icon: Building2 },
    { id: 'agent', label: 'Expertise agent', icon: Briefcase },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      quote: "J'ai économisé 18 000€ sur mon achat grâce aux données réelles du quartier.",
      context: "Recherche d'un appartement T3 à Lyon 7ème",
      problem: 'Le bien était affiché 15% au-dessus des dernières ventes comparables',
      solution: 'Analyse des transactions DVF sur les 12 derniers mois dans la rue',
      result: 'Négociation réussie, achat 18 000€ sous le prix affiché',
      author: 'Marie',
      role: 'Acheteur',
      city: 'Lyon',
      rating: 5,
      category: 'achat',
    },
    {
      id: '2',
      quote: "J'ai vendu en 3 semaines au bon prix, sans négociation à la baisse.",
      context: 'Vente d une maison familiale à Bordeaux',
      problem: 'Incertitude sur le prix de mise en vente après plusieurs estimations contradictoires',
      solution: 'Fixation du prix basée sur les ventes réelles du quartier',
      result: 'Vente rapide au prix demandé, sans négociation',
      author: 'Philippe',
      role: 'Vendeur',
      city: 'Bordeaux',
      rating: 5,
      category: 'vente',
    },
    {
      id: '3',
      quote: "Rentabilité réelle de 6.2% au lieu des 8% annoncés par l'agence.",
      context: 'Investissement locatif dans le Rhône',
      problem: 'Rendement affiché irréaliste par rapport au marché local',
      solution: 'Simulation avec les prix réels et loyers du secteur',
      result: "Évitement d'un investissement surcôté, recherche d'une meilleure opportunité",
      author: 'Thomas',
      role: 'Investisseur',
      city: 'Villeurbanne',
      rating: 5,
      category: 'investissement',
    },
    {
      id: '4',
      quote: 'Mes clients me font confiance car je leur montre les données réelles.',
      context: 'Agent immobilier indépendant depuis 8 ans',
      problem: 'Difficulté à justifier les estimations face à des acheteurs informés',
      solution: 'Intégration des analyses DVF dans les présentations clients',
      result: 'Taux de conversion augmenté de 30%, clients plus confiants',
      author: 'Sophie',
      role: 'Agent immobilier',
      city: 'Nantes',
      rating: 5,
      category: 'agent',
      hasVideo: true,
    },
    {
      id: '5',
      quote: 'Premier achat réussi grâce à une vision claire du marché local.',
      context: 'Primo-accédant à la recherche d un T2 à Toulouse',
      problem: 'Budget serré, peur de surpayer sans connaître le marché',
      solution: 'Suivi des prix réels du secteur pendant 3 mois avant de faire une offre',
      result: 'Achat au juste prix, dans le budget initial',
      author: 'Julien',
      role: 'Acheteur',
      city: 'Toulouse',
      rating: 5,
      category: 'achat',
    },
    {
      id: '6',
      quote: "Les données m'ont permis de choisir le bon régime fiscal dès le départ.",
      context: 'Investissement LMNP dans une ville étudiante',
      problem: 'Hésitation entre plusieurs régimes fiscaux sans simulation fiable',
      solution: 'Comparaison des scénarios avec les rendements réels du secteur',
      result: 'Optimisation fiscale dès la première année, +2% de rentabilité nette',
      author: 'Claire',
      role: 'Investisseur',
      city: 'Montpellier',
      rating: 5,
      category: 'investissement',
    },
    {
      id: '7',
      quote: 'Je suis devenu la référence data de mon secteur en 6 mois.',
      context: 'CGP souhaitant développer son activité immobilière',
      problem: "Manque d'outils pour conseiller objectivement ses clients",
      solution: 'Utilisation quotidienne des analyses sectorielles Propsight',
      result: 'Nouveau positionnement expert, +40% de mandats sur l année',
      author: 'Marc',
      role: 'CGP',
      city: 'Paris',
      rating: 5,
      category: 'agent',
    },
    {
      id: '8',
      quote: 'Vente plus rapide que prévu en ajustant le prix dès le départ.',
      context: 'Succession avec vente d un bien à Marseille',
      problem: 'Désaccord familial sur le prix, estimations très variables',
      solution: 'Analyse objective basée sur les transactions comparables',
      result: 'Consensus familial atteint, vente en 6 semaines',
      author: 'Isabelle',
      role: 'Vendeur',
      city: 'Marseille',
      rating: 5,
      category: 'vente',
    },
  ];

  const filteredTestimonials = activeCategory === 'all' ? testimonials : testimonials.filter(t => t.category === activeCategory);

  const getCTAByCategory = (category: TestimonialCategory) => {
    switch (category) {
      case 'achat':
        return { label: "Voir les prix réels avant d'acheter", href: '/PrixImmobliers' };
      case 'vente':
        return { label: 'Estimer votre bien au juste prix', href: '/estimation' };
      case 'investissement':
        return { label: 'Simuler un investissement', href: '/investisseurs' };
      case 'agent':
        return { label: 'Découvrir les outils professionnels', href: '/pack-pro' };
      default:
        return { label: 'Explorer la carte des prix', href: '/PrixImmobliers' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] opacity-30"
          style={{ background: 'radial-gradient(ellipse at top, hsl(245 58% 62% / 0.1), transparent)' }}
        />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)', color: 'hsl(245 58% 62%)' }}
            >
              <Star className="h-4 w-4" />
              Retours d'expérience
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ils ont utilisé Propsight pour leurs projets immobiliers
            </h1>
            <p className="text-xl text-gray-600">
              Des témoignages basés sur des cas réels : achat, vente, investissement ou expertise professionnelle.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200 bg-white sticky top-[76px] z-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                style={activeCategory === category.id ? { backgroundColor: 'hsl(245 58% 62%)' } : {}}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTestimonials.map(testimonial => (
              <article
                key={testimonial.id}
                className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Quote */}
                <div className="flex items-start gap-3 mb-6">
                  <Quote className="h-8 w-8 flex-shrink-0" style={{ color: 'hsl(245 58% 62% / 0.3)' }} />
                  <p className="text-lg md:text-xl font-medium text-gray-900 leading-snug">"{testimonial.quote}"</p>
                </div>

                {/* Case Study Details */}
                <div className="space-y-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'hsl(245 58% 62%)' }}>
                      Contexte
                    </p>
                    <p className="text-sm text-gray-900">{testimonial.context}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Problématique</p>
                    <p className="text-sm text-gray-600">{testimonial.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Solution</p>
                    <p className="text-sm text-gray-600">{testimonial.solution}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'hsl(245 58% 62%)' }}>
                      Résultat
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{testimonial.result}</p>
                  </div>
                </div>

                {/* Author & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)' }}
                    >
                      <span className="font-semibold" style={{ color: 'hsl(245 58% 62%)' }}>
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.author}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{testimonial.role}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {testimonial.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Video indicator */}
                {testimonial.hasVideo && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: 'hsl(245 58% 62%)' }}>
                      <Play className="h-4 w-4" />
                      Voir le témoignage vidéo
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Category CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate(getCTAByCategory(activeCategory).href)}
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90 group"
              style={{ backgroundColor: 'hsl(245 58% 62%)' }}
            >
              {getCTAByCategory(activeCategory).label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 md:py-20 bg-gray-100 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Des décisions basées sur des données, pas sur des intuitions
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Chaque témoignage illustre une situation réelle où l'accès aux prix du marché a fait la différence. Et vous, quel est votre
              projet ?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/PrixImmobliers')}
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: 'hsl(245 58% 62%)' }}
              >
                Explorer les prix réels
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/apropos')}
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg border-2 transition-all duration-200 hover:opacity-90"
                style={{ borderColor: 'hsl(245 58% 62%)', color: 'hsl(245 58% 62%)', backgroundColor: 'white' }}
              >
                Découvrir notre méthodologie
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
