import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Globe,
  Users,
  Search,
  Calculator,
  Settings,
  CheckCircle2,
  Star,
  Award,
  Target,
  Briefcase,
  TrendingUp,
  Map,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Mail,
  Clock,
} from 'lucide-react';

const proTestimonials = [
  {
    name: 'Jean-Marc R.',
    role: 'Agent immobilier',
    location: 'Paris 16e',
    content:
      'Les avis de valeur en marque blanche ont transformé ma relation client. Je gagne en crédibilité et mes mandats exclusifs ont augmenté de 40%.',
    rating: 5,
  },
  {
    name: 'Caroline B.',
    role: "Directrice d'agence",
    location: 'Toulouse',
    content:
      'La vitrine locale nous positionne comme experts du secteur. Le SEO fonctionne vraiment, nous recevons des leads qualifiés chaque semaine.',
    rating: 5,
  },
  {
    name: 'Philippe M.',
    role: 'Chasseur immobilier',
    location: 'Nice',
    content:
      "La pige intelligente me fait gagner 2h par jour. L'historique des prix et les alertes sont indispensables pour repérer les bonnes affaires.",
    rating: 5,
  },
  {
    name: 'Stéphanie L.',
    role: 'CGP - Investissement',
    location: 'Lyon',
    content:
      "Les dossiers d'investissement personnalisés impressionnent mes clients. Le calcul du TRI et l'analyse fiscale sont très professionnels.",
    rating: 4,
  },
];

const proFAQs = [
  {
    question: "Comment fonctionne l'avis de valeur en marque blanche ?",
    answer:
      'Notre IA croise les données DVF avec les annonces en temps réel pour générer une estimation précise. Vous pouvez personnaliser le PDF avec votre logo, vos couleurs et vos coordonnées. Le rapport inclut une analyse comparative du marché local.',
  },
  {
    question: "Qu'est-ce que la vitrine locale et comment améliore-t-elle mon SEO ?",
    answer:
      "Nous créons des pages optimisées 'Prix de l'immobilier à [Ville]' avec votre branding. Ces pages incluent la carte DVF interactive et des statistiques locales. Elles sont conçues pour le référencement local et génèrent des leads qualifiés.",
  },
  {
    question: 'Comment fonctionne la pige intelligente multi-portails ?',
    answer:
      "Notre outil agrège les annonces de tous les portails majeurs avec des filtres avancés. Vous accédez à l'historique des prix, les données DPE ADEME, la durée de publication et un scoring d'opportunités pour identifier les biens à fort potentiel.",
  },
  {
    question: "Les dossiers d'investissement sont-ils personnalisables ?",
    answer:
      'Oui, les dossiers incluent le calcul du cashflow, TRI, analyse fiscale et profil bancaire. Vous pouvez les exporter en PDF aux couleurs de votre agence pour présenter à vos clients investisseurs.',
  },
  {
    question: 'Puis-je intégrer Propsight à mon CRM existant ?',
    answer:
      'Oui, nous proposons des connecteurs avec les principaux CRM du marché : HubSpot, Pipedrive, Orisha. Le mini-CRM intégré permet aussi de gérer votre pipeline, vos tâches et relances automatiques.',
  },
  {
    question: "Y a-t-il une période d'essai ?",
    answer:
      "L'offre Découverte est gratuite et vous permet de tester la carte DVF sur votre secteur. Pour les offres Pro et Business, nous proposons une démo personnalisée pour vous montrer toutes les fonctionnalités.",
  },
];

const proFeatures = [
  {
    icon: <FileText className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Devenir la référence prix du secteur',
    subtitle: 'Avis de valeur IA + DVF',
    description:
      "Estimations IA croisant DVF + annonces temps réel + données locales. Rapport PDF personnalisable en marque blanche aux couleurs de l'agence.",
    features: ['Croisement DVF + annonces en temps réel', 'PDF marque blanche agence', 'Indice de confiance IA'],
    available: false,
  },
  {
    icon: <Globe className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Vitrine locale',
    subtitle: 'SEO & génération de contacts',
    description:
      'Pages "Prix de l\'immobilier à [Ville]" + carte historique DVF en marque blanche. Optimisées pour le référencement local.',
    features: ['Pages "Prix de l\'immo à [Ville]"', 'Carte DVF intégrée', 'Optimisation SEO locale'],
    available: false,
  },
  {
    icon: <Users className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Machine à leads',
    subtitle: 'Formulaires + scoring',
    description: 'Formulaires estimation / simulation / recherche intégrés avec scoring automatique. Leads entrants centralisés.',
    features: ['Formulaires estimation & simulation', 'Scoring automatique', 'Centralisation des leads'],
    available: false,
  },
  {
    icon: <Search className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Prospection & pige intelligente',
    subtitle: 'Multi-portails avancé',
    description:
      "Agrégateur multi-portails, filtres avancés, historique des prix, DPE ADEME, durée de publication. Scoring d'opportunités.",
    features: ['Agrégation multi-portails', 'Historique des prix', 'DPE + durée de publication'],
    available: false,
  },
  {
    icon: <Calculator className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Analyse investissement pro',
    subtitle: 'Dossiers bancaires',
    description:
      "Études d'investissement complètes (cashflow, TRI, fiscalité) au format PDF. Intégration du profil bancaire de l'acquéreur.",
    features: ['Cashflow, TRI, fiscalité', 'Profil bancaire acquéreur', 'Export PDF client'],
    available: false,
  },
  {
    icon: <Settings className="w-8 h-8" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Mini-CRM & automatisations',
    subtitle: 'Pipeline & connecteurs',
    description: 'Gestion des leads, pipeline, tâches automatiques (rappels, visites, relances). Connecteurs HubSpot / Pipedrive / Orisha.',
    features: ['Pipeline visuel', 'Tâches automatiques', 'Connecteurs CRM'],
    available: false,
  },
];

const proHighlights = [
  {
    icon: <Award className="w-6 h-6" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Plus de mandats exclusifs',
    description: "Devenez l'expert data de votre secteur",
  },
  {
    icon: <Target className="w-6 h-6" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: "Image d'expert local",
    description: 'Vitrine digitale et référencement',
  },
  {
    icon: <Users className="w-6 h-6" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Leads qualifiés',
    description: 'Scoring et centralisation',
  },
  {
    icon: <Briefcase className="w-6 h-6" style={{ color: 'hsl(245 58% 62%)' }} />,
    title: 'Cockpit investissement',
    description: 'Dossiers pro pour vos clients',
  },
];

const pricingPlans = [
  {
    name: 'Gratuit',
    subtitle: 'Découverte',
    price: '0€',
    period: '/mois',
    description: 'Pour tester la carte DVF sur votre secteur.',
    features: ['Accès à la carte DVF', 'Quelques alertes secteur', 'Aperçu des prix au m²'],
    cta: 'Commencer gratuitement',
    popular: false,
  },
  {
    name: 'Pro',
    subtitle: 'Agent Data',
    price: '49€',
    period: 'HT/mois',
    description: 'Pour les agents qui veulent dominer leur secteur.',
    features: [
      'Pige immo avancée + historique prix',
      'Analyse marché : carte DVF, heat map, export',
      'Avis de valeur PDF marque blanche',
      'Accès aux prospects secteur',
    ],
    cta: 'Demander une démo',
    popular: true,
  },
  {
    name: 'Business',
    subtitle: 'Agence 360°',
    price: '89€',
    period: 'HT/mois',
    description: 'Pour les agences qui veulent une solution complète.',
    features: [
      'Vitrine locale marque blanche',
      'Dossiers investissement personnalisés',
      'Analyse pro + dossier bancaire',
      'CRM intégré + connecteurs',
    ],
    cta: 'Demander une démo',
    popular: false,
  },
];

const PackPro: React.FC = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [email, setEmail] = useState<string>('');

  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription logic
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'var(--gradient-hero)',
        }}
      >
        <div className="container mx-auto px-4 pt-0 md:pt-24 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <div className="text-center lg:text-left px-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/10 backdrop-blur-sm">
                <Star className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Pour les professionnels de l'immobilier</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                La data au service de vos mandats.
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Avis de valeur en marque blanche, vitrine numérique locale, génération de leads, pige immo, analyse investissement et CRM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{
                    background: 'var(--gradient-primary)',
                  }}
                >
                  Être prévenu
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Features Sections */}
      <section className="py-16 md:py-20 bg-white px-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">6 usages pour transformer votre activité</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Des outils pensés par et pour les professionnels de l'immobilier.
            </p>
          </div>

          <div className="space-y-16">
            {proFeatures.map((feature, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  {!feature.available && (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-xs font-medium"
                      style={{
                        backgroundColor: 'hsl(25 95% 53% / 0.1)',
                        color: 'hsl(25 95% 53%)',
                      }}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Bientôt disponible</span>
                    </div>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="font-medium mb-4" style={{ color: 'hsl(245 58% 62%)' }}>
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'hsl(245 58% 62%)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`rounded-2xl p-8 flex items-center justify-center min-h-[250px] ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    borderColor: 'hsl(var(--border))',
                  }}
                >
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)' }}
                    >
                      {feature.icon}
                    </div>
                    <p className="text-gray-600 text-sm">{feature.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Highlights */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proHighlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)' }}
                >
                  {highlight.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{highlight.title}</h3>
                <p className="text-sm text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nos offres pour les pros</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Choisissez le plan adapté à vos besoins.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular ? 'border-gray-300 shadow-xl relative' : 'border-gray-200 shadow-md'
                }`}
                style={plan.popular ? { borderColor: 'hsl(245 58% 62%)' } : {}}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-xs font-semibold rounded-full"
                    style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  >
                    Le plus populaire
                  </span>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.subtitle}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/contact')}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 ${
                    plan.popular ? 'text-white' : 'border-2'
                  }`}
                  style={
                    plan.popular
                      ? { backgroundColor: 'hsl(245 58% 62%)' }
                      : {
                          borderColor: 'hsl(245 58% 62%)',
                          backgroundColor: 'white',
                          color: 'hsl(245 58% 62%)',
                        }
                  }
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl max-w-2xl mx-auto text-center">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Note :</strong> Seul le module DVF est actuellement disponible. Les autres fonctionnalités
              arrivent prochainement. Les premiers abonnés bénéficient des nouveautés en avant-première.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ils font confiance à Propsight</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Agents, directeurs d'agence, chasseurs et CGP partagent leur expérience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {proTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Questions fréquentes - Pack Pro</h2>
              <p className="text-base sm:text-lg text-gray-600">Tout ce que vous devez savoir sur nos offres professionnelles.</p>
            </div>

            <div className="space-y-4">
              {proFAQs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div
                    onClick={() => handleFAQToggle(index)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900 font-medium pr-4">{faq.question}</span>
                    {openFAQ === index ? (
                      <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 " style={{ backgroundColor: '#211e3b' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Prêt à transformer votre activité ?</h2>
            <p className="text-gray-300 mb-8">Rejoignez les premiers professionnels à bénéficier de Propsight.</p>
            <div className="bg-white rounded-2xl p-6 inline-block">
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Votre email"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent"
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
                  className="px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{ background: 'linear-gradient(to right, hsl(245 58% 62%), #2563eb)' }}
                >
                  Être prévenu
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackPro;
