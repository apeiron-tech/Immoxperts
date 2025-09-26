import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS, EXTERNAL_URLS } from 'app/config/api.config';
// Logos des plateformes immobilières
const seloger = `${EXTERNAL_URLS.seloger.mms}favicon.ico`; // Logo SeLoger officiel
const leboncoin = '/content/assets/leboncoin-e1561735918709.png'; // Logo LeBonCoin
const avendrealouer = `${EXTERNAL_URLS.avendrealouer.website}favicon.ico`; // Logo AvendreA
const figaroimmo = '/content/assets/figaroimmo.png'; // Logo Figaro Immo
const century21 = '/content/assets/century-21-logo.png'; // Logo Century 21 local

interface Property {
  id: number;
  price: string;
  type: string;
  description: string;
  surface: string;
  rooms: string;
  bathrooms: string;
  kitchen: string;
  balcony: string;
  address: string;
  tags: string[];
  Association: string[];
  Association_url: string[];
  images: string[];
  dynamicAttributes?: { [key: string]: string }; // New property for dynamic attributes
}

interface ApiProperty {
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

interface SearchParams {
  location: string;
  value: string;
  type: string;
  maxBudget: string;
  propertyType: string;
}

interface LocationState {
  searchResults: ApiProperty[];
  searchParams: SearchParams;
}

interface ImageGalleryProps {
  images: string[];
  tags: string[];
}

const RecherchLouer: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const searchParams = locationState?.searchParams;
  const preloadedResults = locationState?.searchResults || [];

  const associationLogos = {
    seloger,
    leboncoin,
    avendrealouer,
    figaroimmo,
    century21,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [apiProperties, setApiProperties] = useState<ApiProperty[]>(preloadedResults);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to extract all possible attributes from details
  const extractAllAttributes = (allText: string) => {
    const attributes: { [key: string]: string } = {};

    // Surface attributes - only keep one surface (prioritize surface totale)
    const surfaceTotale = extractSurfaceTotale(allText);
    const surfaceHabitable = extractSurfaceHabitable(allText);

    if (surfaceTotale !== 'N/A') {
      attributes['Surface'] = surfaceTotale;
    } else if (surfaceHabitable !== 'N/A') {
      attributes['Surface'] = surfaceHabitable;
    }

    // Property type and rooms with exact format
    const apartmentType = extractApartmentType(allText);
    if (apartmentType !== 'N/A') attributes["Type d'appartement"] = apartmentType;

    // Floor with exact format
    const floor = extractFloor(allText);
    if (floor !== 'N/A') attributes['Étage'] = floor;

    // Construction info with exact format
    const constructionType = extractConstructionType(allText);
    if (constructionType !== 'N/A') attributes['Type de construction'] = constructionType;

    const constructionYear = extractConstructionYear(allText);
    if (constructionYear !== 'N/A') attributes['Année construction'] = constructionYear;

    // Other amenities (only if apartment type not found)
    if (apartmentType === 'N/A') {
      const rooms = extractRooms(allText);
      if (rooms !== 'N/A') attributes['Pièces'] = rooms;
    }

    const bathrooms = extractBathrooms(allText);
    if (bathrooms !== 'N/A') attributes['Salles de bain'] = bathrooms;

    const kitchen = extractKitchen(allText);
    if (kitchen !== 'N/A') attributes['Cuisine'] = kitchen;

    const balcony = extractBalcony(allText);
    if (balcony !== 'N/A') attributes['Balcon/Terrasse'] = balcony;

    const terrain = extractGardenTerrain(allText);
    if (terrain !== 'N/A') attributes['Terrain'] = terrain;

    const parking = extractParking(allText);
    if (parking !== 'N/A') attributes['Parking'] = parking;

    const energyClass = extractEnergyClass(allText);
    if (energyClass !== 'N/A') attributes['Classe énergétique'] = energyClass;

    return attributes;
  };

  // Function to convert API property to display property
  const convertApiPropertyToProperty = (apiProp: ApiProperty): Property => {
    const details = apiProp.details || '';
    const description = apiProp.description || '';
    const allText = `${details} ${description}`.trim();

    // Extract all attributes dynamically
    const attributes = extractAllAttributes(allText);

    return {
      id: apiProp.id,
      price: apiProp.priceText,
      type: apiProp.propertyType,
      description: '', // Remove description to avoid duplication with attributes
      surface: attributes['Surface'] || 'N/A',
      rooms: attributes['Pièces'] || 'N/A',
      bathrooms: attributes['Salles de bain'] || 'N/A',
      kitchen: attributes['Cuisine'] || 'N/A',
      balcony: attributes['Balcon'] || 'N/A',
      // Add dynamic attributes as a new property
      dynamicAttributes: attributes,
      address: apiProp.address || `${apiProp.commune}, ${apiProp.department}`,
      tags: [extractFurnishing(allText), 'À louer'].filter(tag => tag !== 'N/A'), // Add furnishing info and rental tag
      Association: [getAssociationFromSource(apiProp.source)], // Get association from source
      Association_url: [getAssociationUrlFromSource(apiProp.source)],
      images: apiProp.images && apiProp.images.length > 0 ? apiProp.images : ['/content/assets/logo.png'], // Images are now array
    };
  };

  // Helper function to get association from source
  const getAssociationFromSource = (source: string): string => {
    if (source.toLowerCase().includes('century21')) return 'century21';
    if (source.toLowerCase().includes('seloger')) return 'seloger';
    if (source.toLowerCase().includes('leboncoin')) return 'leboncoin';
    return 'seloger'; // Default
  };

  // Helper function to get association URL from source
  const getAssociationUrlFromSource = (source: string): string => {
    if (source.toLowerCase().includes('century21')) return 'https://www.century21.fr/';
    if (source.toLowerCase().includes('seloger')) return EXTERNAL_URLS.seloger.mms;
    if (source.toLowerCase().includes('leboncoin')) return 'https://www.leboncoin.fr/';
    return EXTERNAL_URLS.seloger.mms; // Default
  };

  // Helper function to get logo URL from source
  const getLogoFromSource = (source: string): string => {
    if (source.toLowerCase().includes('century21')) return century21;
    if (source.toLowerCase().includes('seloger')) return seloger;
    if (source.toLowerCase().includes('leboncoin')) return leboncoin;
    return seloger; // Default
  };

  // Helper functions to extract data from details string
  const extractSurfaceTotale = (details: string): string => {
    // Extract "Surface totale : XX m2" with exact format
    const totalMatch = details.match(/Surface totale\s*:\s*(\d+(?:\s?\d{3})*(?:[,.]\d+)?)\s*m2/i);
    return totalMatch ? `${totalMatch[1].replace(/\s/g, '')} m²` : 'N/A';
  };

  const extractSurfaceHabitable = (details: string): string => {
    // Extract "Surface habitable : XX m2" with exact format
    const habitableMatch = details.match(/Surface habitable\s*:\s*(\d+(?:\s?\d{3})*(?:[,.]\d+)?)\s*m2/i);
    return habitableMatch ? `${habitableMatch[1].replace(/\s/g, '')} m²` : 'N/A';
  };

  const extractRooms = (details: string): string => {
    // Look for T1, T2, T3, etc. patterns first
    const tMatch = details.match(/T(\d+)/i);
    if (tMatch) {
      return `${tMatch[1]} pièces`;
    }

    // Look for F1, F2, F3, etc. patterns
    const fMatch = details.match(/F(\d+)/i);
    if (fMatch) {
      return `${fMatch[1]} pièces`;
    }

    // Look for patterns like "3 pièces", "4 pieces", etc.
    const piecesMatch = details.match(/(\d+)\s*pièces?/i);
    return piecesMatch ? `${piecesMatch[1]} pièces` : 'N/A';
  };

  const extractBathrooms = (details: string): string => {
    // Look for patterns like "2 salles de bain", "1 salle de bain", "2 SDB"
    const match = details.match(/(\d+)\s*(?:salles?\s*de\s*bains?|SDB)/i);
    return match ? `${match[1]} ${parseInt(match[1], 10) > 1 ? 'salles de bain' : 'salle de bain'}` : 'N/A';
  };

  const extractKitchen = (details: string): string => {
    // Look for kitchen information
    if (/cuisine\s*équipée/i.test(details)) return 'Équipée';
    if (/cuisine\s*aménagée/i.test(details)) return 'Aménagée';
    if (/cuisine\s*ouverte/i.test(details)) return 'Ouverte';
    if (/cuisine/i.test(details)) return 'Oui';
    return 'N/A';
  };

  const extractBalcony = (details: string): string => {
    // Look for balcony/terrace information
    if (/balcon/i.test(details)) return 'Oui';
    if (/terrasse/i.test(details)) return 'Terrasse';
    if (/loggia/i.test(details)) return 'Loggia';
    return 'N/A';
  };

  const extractFurnishing = (details: string): string => {
    // Extract furnishing information
    if (/meublée?/i.test(details)) return 'Meublé';
    if (/non\s*meublée?/i.test(details)) return 'Non meublé';
    return 'N/A';
  };

  const extractFloor = (details: string): string => {
    // Extract floor information with exact format "Étage : XXX"
    const match = details.match(/Étage\s*:\s*([^|]+)/i);
    if (match) return match[1].trim();

    // Fallback patterns
    const floorMatch = details.match(/(\d+)(?:er|ème|e)\s*étage/i);
    if (floorMatch) return `${floorMatch[1]}${floorMatch[1] === '1' ? 'er' : 'ème'}`;

    if (/rez.de.chaussée/i.test(details)) return 'RDC';
    return 'N/A';
  };

  const extractApartmentType = (details: string): string => {
    // Extract apartment type with exact format "Type d'appartement : XXX"
    const match = details.match(/Type\s*d'appartement\s*:\s*([^|]+)/i);
    if (match) return match[1].trim();

    // Fallback patterns
    const directTMatch = details.match(/\b(T\d+)\b/i);
    if (directTMatch) return directTMatch[1];

    const directFMatch = details.match(/\b(F\d+)\b/i);
    if (directFMatch) return directFMatch[1];

    return 'N/A';
  };

  const extractConstructionType = (details: string): string => {
    // Extract construction type
    const match = details.match(/Type\s*de\s*construction\s*:\s*([^|]+)/i);
    return match ? match[1].trim() : 'N/A';
  };

  const extractConstructionYear = (details: string): string => {
    // Extract construction year
    const match = details.match(/Année\s*construction\s*:\s*(\d{4})/i);
    return match ? match[1] : 'N/A';
  };

  const extractGardenTerrain = (details: string): string => {
    // Extract garden or terrain information
    const terrainMatch = details.match(/Surface terrain\s*:\s*(\d+(?:\s?\d{3})*(?:[,.]\d+)?)\s*m2?/i);
    if (terrainMatch) return `${terrainMatch[1].replace(/\s/g, '')} m² terrain`;

    if (/jardin/i.test(details)) return 'Jardin';
    if (/terrasse/i.test(details)) return 'Terrasse';

    return 'N/A';
  };

  const extractParking = (details: string): string => {
    // Extract parking information
    if (/garage/i.test(details)) return 'Garage';
    if (/parking/i.test(details)) return 'Parking';
    if (/place\s*de\s*stationnement/i.test(details)) return 'Stationnement';

    return 'N/A';
  };

  const extractEnergyClass = (details: string): string => {
    // Extract energy class (DPE)
    const match = details.match(/DPE\s*[:\s]*([A-G])/i);
    if (match) return `DPE ${match[1]}`;

    const classMatch = details.match(/Classe\s*énergétique\s*[:\s]*([A-G])/i);
    if (classMatch) return `Classe ${classMatch[1]}`;

    return 'N/A';
  };

  // Initialize with preloaded results - no need to fetch from API
  useEffect(() => {
    if (preloadedResults.length > 0) {
      setApiProperties(preloadedResults);
    }
  }, [preloadedResults]);

  // Simple retry function for error cases
  const handleRetry = () => {
    setError(null);
    if (preloadedResults.length > 0) {
      setApiProperties(preloadedResults);
    } else {
      // If no preloaded results, redirect back to search
      window.history.back();
    }
  };

  // Convert API properties to display properties
  const properties: Property[] = apiProperties.map(convertApiPropertyToProperty);

  // Function to render tags
  const renderTags = (tags: string[]): JSX.Element[] => {
    const tagColorMap: Record<string, string> = {
      'En vente': 'bg-green-500',
      Géolocalisé: 'bg-orange-400',
      SeLoger: 'bg-indigo-500',
      'Baisse de prix': 'bg-green-500',
      leboncoin: 'bg-indigo-400',
      Expiré: 'bg-red-500',
      default: 'bg-gray-500',
    };

    return tags.map((tag, index) => (
      <motion.span
        key={index}
        className={`${tagColorMap[tag] || tagColorMap['default']} text-white text px-2 py-1 rounded-lg mr-1`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      >
        {tag}
      </motion.span>
    ));
  };

  const ImageGallery: React.FC<ImageGalleryProps> = ({ images, tags }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const handleDotClick = (index: number): void => {
      setCurrentImageIndex(index);
    };

    const handleMouseEnter = (): void => {
      setIsHovering(true);
    };

    const handleMouseLeave = (): void => {
      setIsHovering(false);
    };

    // Auto-cycle images when hovering
    React.useEffect(() => {
      let intervalId: ReturnType<typeof setInterval>;
      if (isHovering && images.length > 1) {
        intervalId = setInterval(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 1500); // Change image every 1.5 seconds
      }

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [isHovering, images.length]);

    return (
      <motion.div
        className="relative h-60 overflow-hidden rounded-2xl group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`Property image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-3xl absolute"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-2 left-2 flex pb-1 flex-wrap gap-1 z-10">{renderTags(tags)}</div>
          <motion.button
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </motion.button>

          {/* Image Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="mt-10 rounded-2xl">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pt-4">
            {/* Desktop Menu */}
            <motion.div
              className="hidden sm:flex space-x-4 rounded-xl border py-2 pr-60 px-4 bg-white shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                className="px-5 py-3 rounded-xl text-sm font-medium text-gray-900 bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Paris (75)
              </motion.button>
              <motion.button
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-900 bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Biens publiés (Annonces)
              </motion.button>
              <motion.button
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-900 bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Professionnel
              </motion.button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden flex items-center w-full justify-between">
              <motion.button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>

              <div className="flex items-center space-x-4">
                <motion.button
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                  whileTap={{ scale: 0.95 }}
                >
                  Date de la vente
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
                <motion.button
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                  whileTap={{ scale: 0.95 }}
                >
                  Exporter
                </motion.button>
              </div>
            </div>

            {/* Desktop Right Side Menu */}
            <motion.div
              className="hidden sm:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Date de la vente
                <ChevronDown className="ml-1 h-4 w-4" />
              </motion.button>
              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.87915 0.00012207C10.2934 0.00012207 10.6292 0.335909 10.6292 0.750122V12.7911C10.6292 13.2053 10.2934 13.5411 9.87915 13.5411C9.46494 13.5411 9.12915 13.2053 9.12915 12.7911V0.750122C9.12915 0.335909 9.46494 0.00012207 9.87915 0.00012207Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.43389 9.3329C6.72739 9.04061 7.20226 9.04158 7.49455 9.33508L9.87913 11.7295L12.2637 9.33508C12.556 9.04158 13.0309 9.04061 13.3244 9.3329C13.6179 9.62519 13.6188 10.1001 13.3266 10.3936L10.4106 13.3216C10.2698 13.4629 10.0786 13.5423 9.87913 13.5423C9.67969 13.5423 9.48846 13.4629 9.34772 13.3216L6.43172 10.3936C6.13943 10.1001 6.1404 9.62519 6.43389 9.3329Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.6234 5.18995C13.6614 4.77748 14.0266 4.47394 14.4391 4.51198C16.2864 4.6823 17.7854 5.12903 18.7549 6.43724C19.6845 7.69153 20.0002 9.5813 20.0002 12.2588C20.0002 15.8083 19.4434 17.9905 17.6199 19.1104C16.7508 19.6441 15.6745 19.88 14.4424 19.9946C13.2152 20.1088 11.741 20.1088 10.0319 20.1088H9.96862C8.25902 20.1088 6.78452 20.1088 5.55723 19.9946C4.3251 19.88 3.24883 19.6442 2.37983 19.1104C0.556514 17.9904 0.000244141 15.8081 0.000244141 12.2588C0.000244141 9.58138 0.3157 7.69159 1.24515 6.43728C2.2146 5.129 3.71369 4.68229 5.5614 4.51197C5.97387 4.47395 6.33906 4.7775 6.37708 5.18997C6.4151 5.60243 6.11155 5.96762 5.69909 6.00564C3.96679 6.16532 3.02589 6.55362 2.45034 7.33033C1.83479 8.16102 1.50024 9.60623 1.50024 12.2588C1.50024 15.8095 2.09847 17.1772 3.16491 17.8322C3.74079 18.186 4.5432 18.3938 5.69617 18.5011C6.84641 18.6081 8.2528 18.6088 10.0002 18.6088C11.7472 18.6088 13.1533 18.6081 14.3035 18.5011C15.4563 18.3938 16.2588 18.186 16.8349 17.8322C17.9016 17.1771 18.5002 15.8094 18.5002 12.2588C18.5002 9.60632 18.1655 8.16109 17.5498 7.33038C16.9741 6.55359 16.0331 6.16531 14.3014 6.00564C13.8889 5.96761 13.5854 5.60241 13.6234 5.18995Z"
                    fill="black"
                  />
                </svg>
                Exporter
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="sm:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <motion.button
                    className="text-gray-900 bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Paris (75)
                  </motion.button>
                  <motion.button
                    className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Biens publiés (Annonces)
                  </motion.button>
                  <motion.button
                    className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Professionnel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search parameters display */}
        {searchParams && (
          <motion.div
            className="mb-6 p-4 bg-white rounded-lg shadow-sm border"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Résultats de recherche</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                <strong>Localisation:</strong> {searchParams.location}
              </span>
              <span>
                <strong>Budget max:</strong> {searchParams.maxBudget} €/mois
              </span>
              <span>
                <strong>Type:</strong> {searchParams.propertyType}
              </span>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-800">Erreur lors de la recherche: {error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {/* Properties grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {properties.length > 0 ? (
              properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="bg-white rounded-3xl p-3 shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <ImageGallery images={property.images} tags={property.tags} />

                  <div className="p-4">
                    <motion.div
                      className="flex justify-between items-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <motion.h2 className="text-xl font-bold text-gray-900" whileHover={{ scale: 1.05 }}>
                        {property.price}
                      </motion.h2>
                    </motion.div>
                    <motion.p
                      className="text-gray-700 font-medium mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      {property.type}
                    </motion.p>
                    {property.description && property.description.trim() && (
                      <motion.p
                        className="text-gray-600 text-sm mt-1 line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        {property.description}
                      </motion.p>
                    )}

                    <motion.div
                      className="mt-3 grid grid-cols-2 gap-2 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      {property.dynamicAttributes &&
                        Object.entries(property.dynamicAttributes).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500">{key}: </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      {/* Fallback to old attributes if no dynamic attributes */}
                      {(!property.dynamicAttributes || Object.keys(property.dynamicAttributes).length === 0) && (
                        <>
                          {property.surface !== 'N/A' && (
                            <div>
                              <span className="text-gray-500">Surface: </span>
                              <span className="font-medium">{property.surface}</span>
                            </div>
                          )}
                          {property.rooms !== 'N/A' && (
                            <div>
                              <span className="text-gray-500">Pièces: </span>
                              <span className="font-medium">{property.rooms}</span>
                            </div>
                          )}
                          {property.bathrooms !== 'N/A' && (
                            <div>
                              <span className="text-gray-500">Salles de bain: </span>
                              <span className="font-medium">{property.bathrooms}</span>
                            </div>
                          )}
                          {property.kitchen !== 'N/A' && (
                            <div>
                              <span className="text-gray-500">Cuisine: </span>
                              <span className="font-medium">{property.kitchen}</span>
                            </div>
                          )}
                          {property.balcony !== 'N/A' && (
                            <div>
                              <span className="text-gray-500">Balcon: </span>
                              <span className="font-medium">{property.balcony}</span>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>

                    <motion.div
                      className="mt-3 flex items-center text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {property.address}
                    </motion.div>

                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <div className="flex items-center space-x-2">
                        {property.Association.map((assoc, assocIndex) => (
                          <motion.a
                            key={assocIndex}
                            href={property.Association_url[assocIndex]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img src={associationLogos[assoc]} alt={assoc} className="h-4 w-4 object-contain" />
                            <span>{assoc}</span>
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-lg">Aucun bien trouvé pour cette recherche.</p>
                <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos critères de recherche.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default RecherchLouer;
