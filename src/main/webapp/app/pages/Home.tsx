import React, { useState } from 'react';
import {
  Home,
  Search,
  BarChart2,
  Users,
  Map,
  FileCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First FAQ is open by default
  const [email, setEmail] = useState<string>('');
  const showTestimonials = false; // Section not finished yet
  const showAgentSection = false; // Section not finished yet

  const faqData = [
    {
      question: "Qu'est-ce que Propsight ?",
      answer:
        "Propsight est une plateforme immobilière qui regroupe les données essentielles pour décider : carte des prix DVF, annonces immobilières, estimation de biens et simulation d'investissement locatif — le tout dans une interface unique, simple et connectée.",
    },
    {
      question: 'Comment fonctionne la carte des prix immobiliers de Propsight ?',
      answer:
        "La carte Propsight permet de consulter les transactions immobilières réelles en France grâce aux données DVF (Demandes de valeurs foncières), disponibles depuis janvier 2014. Vous pouvez rechercher une adresse précise ou naviguer sur la carte, puis consulter les détails d'une vente : prix, date, surface, pièces, type de bien et prix au m².",
    },
    {
      question: "Quelle différence entre la carte DVF de l'État et la carte Propsight ?",
      answer:
        "Les deux s'appuient sur DVF, mais l'expérience et les fonctionnalités ne sont pas comparables. Propsight permet de rechercher une adresse précise, de filtrer (type de bien, pièces, surface, prix, période, prix/m²) et de consulter des statistiques de marché locales (prix moyen, nombre de ventes, etc.). Le service de l'État est davantage orienté parcelle/cadastre, avec une exploration plus administrative, moins de filtres et une lecture moins pratique pour analyser rapidement un micro-marché. En résumé : DVF public = consultation brute, Propsight = analyse immobilière utilisable (filtres + statistiques + lecture locale).",
    },
    {
      question: 'À quelle fréquence les données DVF sont-elles mises à jour ?',
      answer:
        "Les données DVF sont mises à jour deux fois par an, avec un décalage d'environ 6 mois entre une vente et sa disponibilité dans la base officielle.",
    },
    {
      question: "Comment rechercher les prix immobiliers dans ma ville ou mon quartier et voir l'historique depuis 2014 ?",
      answer:
        "Tapez une adresse, une ville ou un quartier, puis zoomez sur la carte. Propsight affiche les ventes DVF disponibles et vous pouvez filtrer (type de bien, pièces, surface, prix, période…). L'historique est consultable depuis janvier 2014 lorsqu'il existe des transactions sur le secteur.",
    },
    {
      question: 'Quelle est la différence entre DVF (ventes réelles) et les annonces immobilières ?',
      answer:
        "DVF regroupe les prix réellement vendus (transactions conclues chez le notaire). Les annonces affichent les prix demandés aujourd'hui (souvent négociables). Comparer DVF et annonces aide à évaluer le juste prix et repérer une surcote.",
    },
    {
      question: "Comment Propsight estime la valeur d'un bien immobilier ?",
      answer:
        "Propsight propose un module d'estimation basé sur DVF, les annonces et les données INSEE pour produire une fourchette de prix et un indice de confiance (selon les caractéristiques et les comparables disponibles).",
    },
    {
      question: 'Comment simuler un investissement locatif avec Propsight ?',
      answer:
        "Le simulateur d'investissement permet de tester un projet : financement, charges, fiscalité, rendements et cash-flow mensuel. L'objectif est de simuler directement à partir d'un bien, sans tableur.",
    },
    {
      question: "Comment fonctionne l'agrégateur d'annonces multi-sites ?",
      answer:
        "L'agrégateur centralise les annonces de plusieurs portails et les enrichit (par exemple : durée de publication, historique de prix, alertes). Il permet aussi de comparer un prix affiché avec les ventes DVF du secteur.",
    },
    {
      question: "Propsight est-il gratuit ? Qui peut l'utiliser ?",
      answer:
        "La carte DVF est accessible gratuitement. Des fonctionnalités avancées peuvent être proposées via des formules payantes. Propsight s'adresse aux acheteurs, vendeurs, investisseurs, et à toute personne voulant comprendre les prix réels dans son secteur.",
    },
  ];

  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription logic
    // Email submitted: email
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-6 md:pt-12 pb-12 md:pb-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Notification Bubble */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Nouveau : Carte des prix immobiliers disponible (DVF) </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            La <span style={{ color: 'hsl(245 58% 62%)' }}>data</span> au service de vos décisions immobilières.
          </h1>

          {/* Descriptive Paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed">
            Une plateforme immobilière tout-en-un pour rechercher un bien, estimer sa valeur, tester sa rentabilité et décrypter le marché.
          </p>

          {/* Call-to-Action Button */}
          <button
            onClick={() => navigate('/PrixImmobliers')}
            className="inline-flex items-center gap-2 px-8 py-4 text-white text-base font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{ backgroundColor: 'hsl(245 58% 62%)' }}
          >
            <Map size={20} className="text-white" />
            <span>Explorer la carte des ventes</span>
          </button>
        </div>
      </section>

      {/* 4 Outils Gratuits Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Title and Subtitle */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              4 outils gratuits pour réussir votre projet
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour acheter, vendre ou investir dans l'immobilier.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1: Recherche multi-sites */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'hsl(245 58% 62% / 0.1)' }}
              >
                <Search size={24} style={{ color: 'hsl(245 58% 62%)' }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recherche multi-sites</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Explorez toutes les annonces de vente et location en une seule recherche.
              </p>
            </div>

            {/* Card 2: Estimation gratuite */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileCheck size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Estimation gratuite</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Estimez le prix de votre bien immobilier en 2 minutes grâce aux données du marché et aux ventes récentes.
              </p>
            </div>

            {/* Card 3: Simulateur investisseur */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Simulateur investisseur</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Calculez votre rentabilité locative en quelques clics.</p>
            </div>

            {/* Card 4: Explorer les ventes */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Explorer les ventes</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Consultez les prix de vente immobilières passées (DVF) dans votre quartier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualisez les prix réels Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
            {/* Left Section - Text and Statistics */}
            <div className="space-y-8">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{ backgroundColor: 'hsl(142 76% 36% / 0.1)', color: 'hsl(142 76% 36%)' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span>Déjà disponible</span>
              </div>
              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">Visualisez les prix réels de votre quartier</h2>

              {/* Descriptive Paragraph */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Accédez gratuitement aux données officielles de ventes immobilières (DVF). Découvrez les prix au m² et les tendances de
                votre commune.
              </p>

              {/* Statistical Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {/* Card 1: Transactions DVF */}
                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2" style={{ color: 'hsl(245 58% 62%)' }}>
                    +20M
                  </div>
                  <div className="text-sm sm:text-base text-black leading-tight font-bold">Transactions immobilières</div>
                </div>

                {/* Card 2: Communes couvertes */}
                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 whitespace-nowrap"
                    style={{ color: 'hsl(245 58% 62%)' }}
                  >
                    36 000
                  </div>
                  <div className="text-sm sm:text-base text-black leading-tight font-bold">Communes couvertes</div>
                </div>

                {/* Card 3: Accès illimité */}
                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2" style={{ color: 'hsl(245 58% 62%)' }}>
                    Gratuit
                  </div>
                  <div className="text-sm sm:text-base text-black leading-tight font-bold">Accès illimité</div>
                </div>
              </div>

              {/* Call-to-Action Button */}
              <button
                onClick={() => navigate('/PrixImmobliers')}
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: 'hsl(245 58% 62%)' }}
              >
                <span>Explorer la carte</span>
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Right Section - Visual Card */}
            <div className="relative">
              {/* Large Gradient Card */}
              <div
                className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(to bottom, #ede9fe, #fef3c7)',
                }}
              >
                {/* Map Icon */}
                <Map
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
                  style={{ color: 'hsl(245 58% 62% / 0.6)' }}
                  strokeWidth={1.5}
                />

                {/* Small Price Indicator Box */}
                <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1 text-green-600 font-semibold mb-1">
                    <ArrowRight size={16} className="rotate-45" />
                    <span>+12%</span>
                  </div>
                  <div className="text-xs text-gray-600">Prix moyen Paris 15e</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toutes les annonces immobilières Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Property Cards Grid (appears second on mobile, left on desktop) */}
            <div className="relative order-2 lg:order-1">
              {/* Large White Card with Grid */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                {/* Grid of 6 Property Placeholders */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg aspect-square"></div>
                  ))}
                </div>

                {/* Sources Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 inline-flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 mr-2">Sources</span>
                  {/* Source Icons */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      L
                    </div>
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">P</div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                    >
                      L
                    </div>
                    <div className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-600">+2</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Text and Features (appears first on mobile, right on desktop) */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-sm font-medium mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>Bientôt disponible</span>
              </div>
              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                Toutes les annonces immobilières en un seul endroit
              </h2>

              {/* Descriptive Paragraph */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Ne perdez plus de temps à naviguer entre les sites. Notre agrégateur centralise les annonces de tous les portails majeurs.
              </p>

              {/* Feature List */}
              <div className="space-y-4">
                {/* Feature 1 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className=" text-gray-900 mb-1">Une seule recherche pour accéder à plusieurs portails immobiliers</h3>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className=" text-gray-900 mb-1">Annonces immobilières mises à jour en continu </h3>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className=" text-gray-900 mb-1">Alertes personnalisées selon vos critères</h3>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Button */}
              {/* <button
                onClick={() => navigate('/louer')}
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: 'hsl(245 58% 62%)' }}
              >
                <span>Lancer ma recherche</span>
                <ArrowRight size={20} />
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Estimez votre bien Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Text and Features */}
            <div className="space-y-6">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-sm font-medium mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <line x1="8" x2="16" y1="6" y2="6" />
                  <line x1="16" x2="16" y1="14" y2="18" />
                  <path d="M16 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                </svg>
                <span>Bientôt disponible</span>
              </div>

              {/* Main Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                Estimez votre bien en 2 minutes grâce a l'IA{' '}
              </h2>

              {/* Descriptive Paragraph */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Notre algorithme d’estimation immobilière analyse les données INSEE, les ventes immobilières réelles (DVF) et les annonces
                du marché local pour fournir une estimation instantanée et fiable.
              </p>

              {/* Benefits List */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Estimation immobilière basée sur des modèles d’intelligence artificielle récents</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Croisement des données officielles INSEE, DVF et du marché immobilier local</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Fourchette de prix avec indice de confiance</span>
                </div>
              </div>

              {/* Call-to-Action Button */}
              {/* <button
                onClick={() => navigate('/estimation')}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  borderColor: 'hsl(245 58% 62%)',
                  backgroundColor: 'white',
                  color: 'hsl(245 58% 62%)',
                }}
              >
                <span>Estimer mon bien</span>
                <ArrowRight size={20} />
              </button> */}
            </div>

            {/* Right Section - Estimation Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 md:mb-6">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Estimation de votre bien</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">285 000€ - 315 000€</p>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full mb-2">
                  <div
                    className="h-full w-3/4 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, hsl(245 58% 62%), #10b981)',
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">Indice de confiance : 78%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulez votre investissement locatif Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Simulation Card (appears second on mobile, left on desktop) */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                {/* Three Metric Boxes */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Cash-flow Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-1">+250€</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                      Cash-flow
                      <br />
                      /mois
                    </div>
                  </div>

                  {/* Rendement Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">5.2%</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                      Rendement
                      <br />
                      net
                    </div>
                  </div>

                  {/* Score Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">58/100</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Score</div>
                  </div>
                </div>

                {/* Graph Placeholder */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex items-center justify-center">
                  <TrendingUp size={48} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Right Section - Text and Features (appears first on mobile, right on desktop) */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-sm font-medium mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>Bientôt disponible</span>
              </div>

              {/* Main Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                Analysez la rentabilité de votre investissement immobilier
              </h2>

              {/* Descriptive Paragraph */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Simulateur immobilier conçu pour les investisseurs : cash-flow mensuel,TRI, rendement net, fiscalité et score global du
                projet.
              </p>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Importation des données automatique depuis une annonce</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Calculs financiers et fiscaux réalistes</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Aide à la décision avant acquisition</span>
                </div>
              </div>

              {/* Call-to-Action Button */}
              {/* <button
                onClick={() => navigate('/estimation')}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  borderColor: 'hsl(245 58% 62%)',
                  backgroundColor: 'white',
                  color: 'hsl(245 58% 62%)',
                }}
              >
                <span>Simuler un investissement</span>
                <ArrowRight size={20} />
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      {showTestimonials && (
        <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Ils ont trouvé leur bien avec Propsight
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Découvrez les témoignages de nos utilisateurs qui ont réussi leur projet immobilier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Grâce à Propsight, j'ai pu comparer les prix réels du quartier avant de faire mon offre. J'ai économisé près de 15 000€
                  sur mon achat !"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  >
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Marie L.</div>
                    <div className="text-sm text-gray-600">Acheteuse • Lyon</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Le simulateur de rentabilité m'a permis de valider mon projet d'investissement locatif. Les données DVF sont vraiment
                  précieuses."
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  >
                    T
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Thomas D.</div>
                    <div className="text-sm text-gray-600">Investisseur particulier • Bordeaux</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star size={20} className="text-yellow-400" />
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "J'ai estimé mon appartement gratuitement et le prix était très proche de l'estimation finale de l'agent. Très fiable !"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: 'hsl(245 58% 62%)' }}
                  >
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sophie M.</div>
                    <div className="text-sm text-gray-600">Vendeuse • Nantes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Questions fréquentes Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Title and Subtitle */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Questions fréquentes</h2>
            <p className="text-sm sm:text-base text-gray-600">Tout ce que vous devez savoir sur Propsight.</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
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
      </section>

      {/* Vous êtes agent immobilier Section */}
      {showAgentSection && (
        <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div
              className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-lg"
              style={{ backgroundColor: 'hsl(245 58% 62% / 0.05)' }}
            >
              <div className="text-center md:text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Vous êtes agent immobilier?</h2>
                <p className="text-base sm:text-lg font-bold" style={{ color: 'hsl(245 58% 62%)' }}>
                  Rejoignez les 20,000 professionels déjà inscrits.
                </p>
              </div>

              <button
                onClick={() => navigate('/investisseurs')}
                className="px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ background: 'linear-gradient(to right, hsl(245 58% 62%), hsl(245 58% 50%))' }}
              >
                Découvrir nos offres pro
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Propsight se construit avec vous Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Propsight se construit avec vous</h2>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8">
            Plusieurs outils arrivent très bientôt. Inscrivez-vous pour être prévenu en avant-première.
          </p>

          {/* Email Subscription Form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent"
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
              className="px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: 'linear-gradient(to right, hsl(245 58% 62%), #2563eb)' }}
            >
              Être prévenu
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
