import React from 'react';
import { Home, Search, BarChart2, Users } from 'lucide-react';

// Temporary placeholder images - these should be replaced with actual images
const logo = '../../content/home/image1.svg';
const logo2 = '../../content/home/image2.svg';
const logo3 = '../../content/home/image3.svg';
const logo4 = '../../content/home/image4.svg';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-100 rounded-2xl py-8 px-4 mt-6 mx-4 sm:mx-8 md:mx-16 lg:mx-40 sm:py-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">Où les rêves immobiliers prennent vie</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            IMMOXPERT, l'outil essentiel pour simplifier tous vos projets immobiliers, que vous soyez particulier ou professionnel.
          </p>
        </div>
      </section>

      {/* Explorer Section */}
      <section className="rounded-2xl py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10 mx-4 sm:mx-8 md:mx-16 lg:mx-40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="space-y-4 order-1 md:order-2">
              <div className="flex items-center gap-3">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="30" fill="#7069F9" />
                  <path
                    opacity="0.4"
                    d="M28.8457 39.3567C34.6511 39.3567 39.3573 34.6504 39.3573 28.845C39.3573 23.0396 34.6511 18.3333 28.8457 18.3333C23.0402 18.3333 18.334 23.0396 18.334 28.845C18.334 34.6504 23.0402 39.3567 28.8457 39.3567Z"
                    fill="white"
                  />
                  <path
                    d="M41.6554 38.1083C41.2704 37.3967 40.4537 37 39.3571 37C38.5287 37 37.8171 37.3383 37.3971 37.9217C36.9771 38.505 36.8837 39.2867 37.1404 40.0683C37.6421 41.585 38.5171 41.9233 38.9954 41.9817C39.0654 41.9933 39.1354 41.9933 39.2171 41.9933C39.7304 41.9933 40.5237 41.7717 41.2937 40.6167C41.9121 39.7183 42.0287 38.82 41.6554 38.1083Z"
                    fill="white"
                  />
                </svg>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Explorer</h2>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    les <span style={{ color: '#7069F9' }}>biens disponibles</span>
                  </h2>
                </div>
              </div>

              <p className="text-gray-600">
                Effectuez une recherche approfondie pour découvrir le bien immobilier qui répond parfaitement à vos attentes et besoins.
              </p>
            </div>

            <div className="relative order-1 md:order-2">
              <img src={logo} alt="Keeey Logo" className="object-contain cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* Past Sales Section */}
      <section className="bg-purple-100 rounded-2xl py-8 sm:py-10 md:py-10 px-4 sm:px-6 md:px-10 mx-4 sm:mx-8 md:mx-16 lg:mx-40">
        <div className="max-w-6xl mx-auto text-center mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">On vous guide à chaque étape de votre projet immobilier !</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Nous vous offrons toutes les infos nécessaires pour mieux comprendre le marché immobilier et faire un choix éclairé.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="relative">
            <img src={logo2} alt="Keeey Logo" className="object-contain cursor-pointer w-full" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Ventes Passées</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Informations détaillées pour une analyse approfondie des transactions immobilières dans votre région.
            </p>
            <button className="font-semibold hover:underline" style={{ color: '#7069F9' }}>
              Découvrez-les dès maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Estimation */}
      <div className="py-6 sm:py-8 rounded-xl mt-6 sm:mt-10 mx-4 sm:mx-8 md:mx-16 lg:mx-40">
        <div className="flex items-center gap-3 mb-4">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="#FF9763" />
            <path
              opacity="0.4"
              d="M20.8654 33.8501L26.1504 39.1351C28.3204 41.3051 31.8438 41.3051 34.0254 39.1351L39.1471 34.0134C41.3171 31.8434 41.3171 28.3201 39.1471 26.1384L33.8504 20.8651C32.7421 19.7567 31.2138 19.1617 29.6504 19.2434L23.8171 19.5234C21.4838 19.6284 19.6288 21.4834 19.5121 23.8051L19.2321 29.6384C19.1621 31.2134 19.7571 32.7417 20.8654 33.8501Z"
              fill="white"
            />
            <path
              d="M27.0827 30.4434C28.9383 30.4434 30.4427 28.9391 30.4427 27.0834C30.4427 25.2277 28.9383 23.7234 27.0827 23.7234C25.227 23.7234 23.7227 25.2277 23.7227 27.0834C23.7227 28.9391 25.227 30.4434 27.0827 30.4434Z"
              fill="white"
            />
          </svg>

          <h3 className="text-lg sm:text-xl font-bold">Estimation</h3>
        </div>

        <div className="flex flex-col md:flex-row items-center">
          {/* Left Section (Text) */}
          <ul className="space-y-2 bg-red-100 w-full md:w-1/2 p-4 sm:p-6 md:p-10 rounded-xl text-sm md:text-base mb-4 md:mb-0">
            <li>• Estimation rapide d'un bien immobilier.</li>
            <li>• Rapports d'estimation immobilière précis et détaillés.</li>
            <li>
              • Présentez vos dossiers d'investissement à votre banque grâce à nos outils de simulation de rentabilité pour investisseurs.
            </li>
          </ul>

          {/* Right Section (Image) */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={logo3} alt="Keeey Logo" className="object-contain cursor-pointer max-w-md" />
          </div>
        </div>
      </div>

      {/* Market Study */}
      <div className="py-6 sm:py-8 mt-6 sm:mt-10 mx-4 sm:mx-8 md:mx-16 lg:mx-40">
        <div className="flex items-center gap-3 mb-6">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="#7DCEB5" />
            <path
              opacity="0.4"
              d="M39.3806 23.9566L32.6606 19.255C30.8289 17.9716 28.0173 18.0416 26.2556 19.4066L20.4106 23.9683C19.2439 24.8783 18.3223 26.745 18.3223 28.215V36.265C18.3223 39.24 20.7373 41.6666 23.7123 41.6666H36.2889C39.2639 41.6666 41.6789 39.2516 41.6789 36.2766V28.3666C41.6789 26.7916 40.6639 24.855 39.3806 23.9566Z"
              fill="white"
            />
            <path
              d="M35.6359 29.1483C35.5543 28.9499 35.3909 28.7866 35.1926 28.7049C35.0876 28.6583 34.9826 28.6466 34.8776 28.6466H32.7076C32.2526 28.6466 31.8909 29.0083 31.8909 29.4633C31.8909 29.9183 32.2526 30.2799 32.7076 30.2799H32.9176L30.4559 32.7416L29.2659 30.9683C29.1259 30.7699 28.9159 30.6299 28.6709 30.6066C28.4143 30.5833 28.1926 30.6649 28.0176 30.8399L24.5409 34.3166C24.2259 34.6316 24.2259 35.1449 24.5409 35.4716C24.7043 35.6349 24.9026 35.7049 25.1126 35.7049C25.3226 35.7049 25.5326 35.6233 25.6843 35.4716L28.4609 32.6949L29.6509 34.4683C29.7909 34.6666 30.0009 34.8066 30.2459 34.8299C30.5026 34.8533 30.7243 34.7716 30.8993 34.5966L34.0726 31.4233V31.6333C34.0726 32.0883 34.4343 32.4499 34.8893 32.4499C35.3443 32.4499 35.7059 32.0883 35.7059 31.6333V29.4633C35.6943 29.3466 35.6826 29.2416 35.6359 29.1483Z"
              fill="white"
            />
          </svg>

          <h3 className="text-lg sm:text-xl font-bold">Étude du marché</h3>
        </div>
        <ul className="space-y-2 bg-green-100 p-4 sm:p-6 md:p-8 rounded-xl text-sm md:text-base">
          <li>
            • Explorez les tendances immobilières grâce à nos indicateurs clés de performance, qui vous offrent une vision claire du marché.
          </li>
          <li>
            • Consultez notre carte interactive des prix au m² et suivez l'évolution des tarifs en France pour mieux orienter vos décisions.
          </li>
        </ul>
      </div>

      {/* Real Estate Agents Section */}
      <section className="py-8 sm:py-10 md:py-10 px-4 sm:px-6 md:px-10 mt-6 sm:mt-2 mx-4 sm:mx-8 md:mx-16 lg:mx-40">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
          <div className="relative order-2 md:order-1">
            <img src={logo4} alt="Keeey Logo" className="object-contain cursor-pointer" />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <div className="flex items-center gap-3">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="#7069F9" />
                <path
                  opacity="0.4"
                  d="M18.4492 41.6667V23.0351C18.4492 20.6901 19.6159 19.5117 21.9376 19.5117H29.2059C31.5276 19.5117 32.6826 20.6901 32.6826 23.0351V41.6667"
                  fill="white"
                />
                <path
                  d="M28.5426 26.5H22.7676C22.2892 26.5 21.8926 26.1033 21.8926 25.625C21.8926 25.1467 22.2892 24.75 22.7676 24.75H28.5426C29.0209 24.75 29.4176 25.1467 29.4176 25.625C29.4176 26.1033 29.0209 26.5 28.5426 26.5Z"
                  fill="white"
                />
                <path
                  d="M28.5426 30.875H22.7676C22.2892 30.875 21.8926 30.4783 21.8926 30C21.8926 29.5217 22.2892 29.125 22.7676 29.125H28.5426C29.0209 29.125 29.4176 29.5217 29.4176 30C29.4176 30.4783 29.0209 30.875 28.5426 30.875Z"
                  fill="white"
                />
                <path
                  d="M25.625 42.5417C25.1467 42.5417 24.75 42.1451 24.75 41.6667V37.2917C24.75 36.8134 25.1467 36.4167 25.625 36.4167C26.1033 36.4167 26.5 36.8134 26.5 37.2917V41.6667C26.5 42.1451 26.1033 42.5417 25.625 42.5417Z"
                  fill="white"
                />
                <path
                  d="M42.8327 40.7916H40.1843V37.2916C41.2927 36.93 42.0977 35.8916 42.0977 34.6666V32.3333C42.0977 30.805 40.8493 29.5566 39.321 29.5566C37.7927 29.5566 36.5443 30.805 36.5443 32.3333V34.6666C36.5443 35.88 37.3376 36.9066 38.4226 37.28V40.7916H17.166C16.6877 40.7916 16.291 41.1883 16.291 41.6666C16.291 42.145 16.6877 42.5416 17.166 42.5416H39.251C39.2743 42.5416 39.286 42.5533 39.3093 42.5533C39.3327 42.5533 39.3444 42.5416 39.3677 42.5416H42.8327C43.311 42.5416 43.7077 42.145 43.7077 41.6666C43.7077 41.1883 43.311 40.7916 42.8327 40.7916Z"
                  fill="white"
                />
              </svg>

              <div>
                <h2 className="text-2xl font-bold">Agents</h2>
                <h2 className="text-2xl font-bold">
                  <span style={{ color: '#7069F9' }}>Immobiliers</span>
                </h2>
              </div>
            </div>

            <p className="text-gray-600">
              Trouvez un agent immobilier ou une agence près de chez vous pour vous accompagner dans votre projet immobilier.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
