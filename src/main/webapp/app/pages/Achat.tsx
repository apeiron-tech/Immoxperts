import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiCheckSquare, FiSearch, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { API_ENDPOINTS } from 'app/config/api.config';

interface City {
  name: string;
  url: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  text: string;
}

interface LocationSuggestion {
  value: string;
  adresse: string;
  type: 'commune' | 'postal_code' | 'search_postal_code' | 'department' | 'adresse';
  count: number;
}

interface PropertySearchResult {
  id: number;
  source: string;
  searchPostalCode: string;
  department: string;
  departmentName: string;
  commune: string;
  codeDepartment: string;
  propertyType: string;
  priceText: string;
  price: number;
  address: string | null;
  details: string;
  description: string | null;
  propertyUrl: string | null;
  images: string[];
}

const Achat: React.FC = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState<'maison' | 'appartement'>('maison');
  const [location, setLocation] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<LocationSuggestion | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchOsmSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    try {
      const osmResponse = await fetch(`${API_ENDPOINTS.adresses.osmPlaces}?q=${encodeURIComponent(query)}`);
      if (!osmResponse.ok) return [];
      const osmList: Array<{ display_name: string; address?: { postcode?: string; city?: string; town?: string; village?: string } }> =
        await osmResponse.json();
      if (!Array.isArray(osmList) || osmList.length === 0) return [];
      return osmList.slice(0, 10).map(place => {
        const addr = place.address || {};
        const postcode = addr.postcode || '';
        const city = addr.city || addr.town || addr.village || place.display_name;
        const value = postcode || city;
        const adresse = place.display_name;
        const type: LocationSuggestion['type'] = postcode ? 'search_postal_code' : 'commune';
        return { value, adresse, type, count: 0 };
      });
    } catch {
      return [];
    }
  };

  const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 1) {
      return [];
    }

    // 1) Try DVF suggestions
    try {
      const response = await fetch(`${API_ENDPOINTS.achat.suggestions}?q=${encodeURIComponent(query)}&limit=10`);
      if (response.ok) {
        const data: LocationSuggestion[] = await response.json();
        if (data && data.length > 0) return data;
      }
    } catch (error) {
      console.warn('DVF suggestions failed, trying OSM fallback:', error);
    }

    // 2) Fallback: OSM when DVF is empty or failed
    return fetchOsmSuggestions(query);
  };

  const searchPropertiesWithFilters = async (
    value: string,
    type: string,
    propType: string,
    budget: string,
    page: number = 0,
  ): Promise<{ content: PropertySearchResult[]; totalPages: number; totalElements: number }> => {
    try {
      const params = new URLSearchParams();
      params.append('value', value);
      params.append('type', type);
      if (budget) params.append('maxBudget', budget);
      params.append('propertyType', propType === 'maison' ? 'Maison' : 'Appartement');
      params.append('page', String(page));
      params.append('size', '30');

      const response = await fetch(`${API_ENDPOINTS.achat.search}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search properties');
      }
      const data = await response.json();
      return {
        content: data.content || [],
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0,
      };
    } catch (error) {
      console.warn('Error searching properties:', error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!location.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      if (selectedSuggestion && location.trim() === selectedSuggestion.adresse.trim()) {
        setShowSuggestions(false);
        return;
      }
      setIsLoading(true);
      const results = await fetchLocationSuggestions(location.trim());
      setSuggestions(results);
      setShowSuggestions(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [location, selectedSuggestion]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (selectedSuggestion && e.target.value !== selectedSuggestion.adresse) {
      setSelectedSuggestion(null);
    }
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.adresse);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearch = async () => {
    if (!selectedSuggestion) {
      alert('Veuillez sélectionner une localisation dans la liste de suggestions');
      return;
    }

    try {
      setIsLoading(true);
      const { content, totalPages, totalElements } = await searchPropertiesWithFilters(
        selectedSuggestion.value,
        selectedSuggestion.type,
        propertyType,
        maxBudget,
        0,
      );

      const apiType = selectedSuggestion.type === 'postal_code' ? 'search_postal_code' : selectedSuggestion.type;

      navigate('/RecherchAchat', {
        state: {
          searchResults: content,
          searchParams: {
            location: selectedSuggestion.adresse,
            value: selectedSuggestion.value,
            type: apiType,
            maxBudget,
            propertyType,
          },
          totalPages,
          totalElements,
        },
      });
    } catch (error) {
      console.warn('Search error:', error);
      alert("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const cities: City[] = [
    { name: 'Paris', url: '#' },
    { name: 'Lyon', url: '#' },
    { name: 'Marseille', url: '#' },
    { name: 'Toulouse', url: '#' },
    { name: 'Bordeaux', url: '#' },
    { name: 'Nice', url: '#' },
    { name: 'Nantes', url: '#' },
    { name: 'Strasbourg', url: '#' },
    { name: 'Montpellier', url: '#' },
    { name: 'Lille', url: '#' },
    { name: 'Rennes', url: '#' },
  ];

  const benefits: Benefit[] = [
    {
      title: 'Démarches faciles',
      description: 'Simplifiez vos formalités en ligne',
      icon: <FiCheckSquare className="text-indigo-600 w-5 h-5 flex-shrink-0" />,
    },
    {
      title: 'Large choix',
      description: 'Appartements et maisons',
      icon: <FiHome className="text-indigo-600 w-5 h-5 flex-shrink-0" />,
    },
    {
      title: 'Agents fiables',
      description: "Profitez de conseils d'experts locaux",
      icon: <FiCheckSquare className="text-indigo-600 w-5 h-5 flex-shrink-0" />,
    },
    {
      title: 'Interface intuitive',
      description: 'Navigation simple et rapide',
      icon: <FiCheckSquare className="text-indigo-600 w-5 h-5 flex-shrink-0" />,
    },
    {
      title: 'Estimation de prix',
      description: 'Accès direct aux contacts',
      icon: <FiCheckSquare className="text-indigo-600 w-5 h-5 flex-shrink-0" />,
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Pierre Martin',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: "Un large choix de biens immobiliers, avec une navigation fluide et agréable. J'ai pu organiser plusieurs visites en quelques clics. Un service au top !",
    },
    {
      id: 2,
      name: 'Chloé Dubois',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: "Grâce à Propsight, j'ai trouvé ma maison en un temps record. Le site est intuitif et très bien conçu. Une vraie aide pour la recherche immobilière.",
    },
    {
      id: 3,
      name: 'Camille Durand',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      text: "Une plateforme vraiment bien pensée pour acheter un bien. J'ai trouvé exactement ce que je voulais, et le service client est réactif.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-xl mb-16">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              filter: 'brightness(0.85)',
            }}
          ></div>

          <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start items-center">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Acheter le bien qui correspond à mes attentes</h1>
                <p className="text-gray-600 mb-6">
                  Appartements ou maisons, découvrez une large sélection pour donner vie à votre projet d&apos;achat.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ville, quartier, région"
                        value={location}
                        onChange={handleLocationChange}
                        onFocus={handleInputFocus}
                        className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="off"
                      />

                      {showSuggestions && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {isLoading ? (
                            <div className="px-4 py-3 text-gray-500 text-sm">Recherche en cours...</div>
                          ) : suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                              <div
                                key={`${suggestion.value}-${suggestion.type}-${index}`}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                                onClick={() => handleSuggestionSelect(suggestion)}
                              >
                                <div className="flex items-center">
                                  <FiMapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{suggestion.adresse}</div>
                                    <div className="text-xs text-gray-500 capitalize">
                                      {suggestion.type === 'commune' && 'Commune'}
                                      {(suggestion.type === 'postal_code' || suggestion.type === 'search_postal_code') && 'Code postal'}
                                      {suggestion.type === 'department' && 'Département'}
                                      {suggestion.type === 'adresse' && 'Adresse'}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{suggestion.count}</div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm">Aucune suggestion trouvée</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget maximum</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        placeholder="Ex: 250000"
                        value={maxBudget}
                        onChange={e => setMaxBudget(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="maison"
                        checked={propertyType === 'maison'}
                        onChange={() => setPropertyType('maison')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="maison" className="ml-2 text-sm font-medium text-gray-700">
                        Maison
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="appartement"
                        checked={propertyType === 'appartement'}
                        onChange={() => setPropertyType('appartement')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="appartement" className="ml-2 text-sm font-medium text-gray-700">
                        Appartement
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSearch className="mr-2 h-5 w-5" />
                    {isLoading ? 'Recherche en cours...' : 'Rechercher'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Acheter en France | Top villes</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 text-gray-700 text-sm">
              {cities.map(city => (
                <Link
                  key={city.name}
                  to={city.url}
                  className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition duration-200"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Facilitez l&apos;achat d&apos;un bien immobilier</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-0.5">{benefit.icon}</div>
                    <div>
                      <span className="font-medium text-gray-800">{benefit.title}: </span>
                      <span className="text-gray-600">{benefit.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Couple looking at property"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="px-8 py-12 text-white">
            <h2 className="text-2xl font-bold mb-4">Propsight vous offre une plateforme moderne</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl">
              Grâce à nos filtres de recherche intuitifs, vous trouverez rapidement la propriété qui correspond à vos besoins.
            </p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out font-medium shadow-md">
              S&apos;inscrire maintenant
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-10">Ce que disent nos clients satisfaits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                  />
                  <span className="font-medium text-gray-800">{testimonial.name}</span>
                </div>
                <p className="text-gray-600 text-sm italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm max-w-3xl mx-auto">
            Propsight est votre plateforme de référence pour la location et l&apos;achat de maisons et d&apos;appartements en France - Découvrez une
            large sélection de biens immobiliers adaptés à vos besoins
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achat;
