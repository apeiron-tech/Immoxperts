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
          {/* SVG Icons overlay - Fixed on top */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            {/* Custom SVG icons - Fixed row */}
            <div className="flex gap-1">
              {/* Icon 1 - House */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M17.5554 21C17.2544 20.9047 16.9352 20.8461 16.6487 20.7106C15.5715 20.2013 14.9948 18.9483 15.2886 17.7869C15.3285 17.6257 15.2922 17.5635 15.1508 17.4902C13.8886 16.8454 12.63 16.1932 11.3715 15.5411C11.328 15.5191 11.2844 15.4971 11.2337 15.4715C10.6533 16.2262 9.89893 16.6182 8.95229 16.5669C8.28856 16.534 7.7155 16.2629 7.25125 15.7829C6.25384 14.7424 6.25021 13.167 7.23674 12.1082C8.1725 11.1081 9.9352 10.9285 11.0741 12.2035C12.5067 11.3315 13.943 10.4596 15.3756 9.58763C14.8207 8.09284 15.6694 6.65668 16.8301 6.19505C18.0668 5.70046 19.4088 6.16941 20.0871 7.34179C20.7145 8.41891 20.4498 9.84775 19.4741 10.6684C18.5202 11.4708 16.9207 11.5733 15.829 10.3423C15.7891 10.3643 15.7492 10.3863 15.7093 10.412C14.3601 11.2326 13.0109 12.0533 11.658 12.8703C11.5565 12.9326 11.5311 12.9802 11.571 13.0974C11.7342 13.5591 11.7704 14.028 11.6399 14.508C11.6254 14.5592 11.6181 14.6105 11.6072 14.6765C12.9746 15.3836 14.3383 16.0907 15.6948 16.7904C15.887 16.6072 16.0611 16.4167 16.2606 16.2592C17.7985 15.0538 20.1306 16.0211 20.3917 17.9701C20.5912 19.4539 19.6264 20.7472 18.1539 20.9744C18.1249 20.978 18.0995 20.9927 18.0705 21C17.9036 21 17.7295 21 17.5554 21Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Icon 2 - User */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M13.148 6.00001C15.2678 5.99565 16.9863 7.70981 16.995 9.82961C16.9994 11.9451 15.2809 13.6679 13.1611 13.6723C11.0413 13.6767 9.31837 11.9581 9.31837 9.84269C9.31401 7.71853 11.0282 6.00437 13.148 6.00001Z"
                    fill="white"
                  />
                  <path
                    d="M14.1374 20.3021C14.0632 20.3065 14.024 20.3109 13.9804 20.3109C11.7254 20.3109 9.46598 20.3109 7.21096 20.3109C6.61341 20.3109 6.14234 19.9314 6.02457 19.3644C5.9984 19.2422 5.9984 19.1157 6.00276 18.9892C6.00713 18.588 5.98096 18.178 6.0333 17.781C6.12925 17.0526 6.5567 16.5031 7.09756 16.0364C7.73001 15.4999 8.46278 15.1466 9.24353 14.8849C10.8268 14.3527 12.4538 14.1957 14.1112 14.3135C14.1243 14.3135 14.1418 14.3222 14.1767 14.3309C13.4046 15.1727 12.9946 16.1585 12.9815 17.2925C12.9728 18.4309 13.3654 19.4254 14.1374 20.3021Z"
                    fill="white"
                  />
                  <path
                    d="M17.3396 21C15.3158 20.9956 13.6801 19.36 13.6758 17.3405C13.6758 15.321 15.3332 13.6636 17.3527 13.6723C19.3766 13.681 21.0079 15.3254 21.0035 17.3449C20.9991 19.3731 19.3635 21 17.3396 21ZM17.863 17.8552C18.116 17.8552 18.3472 17.8596 18.574 17.8552C18.8139 17.8508 19.0058 17.6982 19.0669 17.4757C19.1585 17.1355 18.9142 16.8258 18.5435 16.8127C18.321 16.8084 18.0986 16.8127 17.863 16.8127C17.863 16.5598 17.8674 16.333 17.863 16.1061C17.8587 15.875 17.7409 15.7136 17.5272 15.6307C17.1826 15.4955 16.8293 15.7441 16.8206 16.1367C16.8119 16.3591 16.8206 16.5772 16.8206 16.8127C16.7377 16.8127 16.6767 16.8127 16.62 16.8127C16.4498 16.8127 16.2797 16.8084 16.114 16.8171C15.8654 16.8302 15.6865 16.9785 15.6255 17.2053C15.5644 17.4147 15.6386 17.6502 15.8305 17.7636C15.9308 17.8247 16.0616 17.8508 16.1838 17.8596C16.3931 17.8726 16.6025 17.8639 16.825 17.8639C16.825 18.1038 16.8206 18.3175 16.825 18.5269C16.8293 18.8453 17.0518 19.0852 17.344 19.0896C17.645 19.0939 17.8674 18.8584 17.8718 18.5225C17.8674 18.3088 17.863 18.0951 17.863 17.8552Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>

              {/* Icon 3 - Building */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M17.5242 12.447C17.5242 13.9684 17.5242 15.4942 17.5242 17.0156C17.5242 17.1384 17.5155 17.2699 17.4763 17.3883C17.3065 17.9144 16.6708 18.0591 16.2572 17.6777C15.9611 17.4058 15.6781 17.1121 15.3559 16.8665C14.0888 15.8976 12.652 15.424 11.0583 15.4284C10.2746 15.4328 9.49086 15.4284 8.70711 15.4284C7.33556 15.424 6.25138 14.5252 6.06415 13.166C5.97272 12.5083 5.95095 11.8331 6.19042 11.1842C6.57794 10.1363 7.54021 9.46552 8.67228 9.46113C9.54311 9.45675 10.4139 9.47428 11.2848 9.45236C13.1701 9.40413 14.7811 8.69385 16.1179 7.35658C16.2746 7.19874 16.4226 7.04966 16.6578 7.0102C17.0496 6.94444 17.4328 7.20312 17.5068 7.59772C17.5242 7.69418 17.5286 7.79503 17.5286 7.89149C17.5242 9.40852 17.5242 10.9255 17.5242 12.447Z"
                    fill="white"
                  />
                  <path
                    d="M8.25781 16.1302C9.34199 16.1302 10.4044 16.1302 11.4799 16.1302C11.5452 16.3976 11.6192 16.6431 11.6671 16.8931C11.7934 17.5288 12.0067 18.1339 12.3115 18.7082C12.5815 19.2168 12.3376 19.7956 11.8151 19.9578C11.7063 19.9929 11.5887 20.0017 11.4799 20.006C10.9791 20.0104 10.4784 20.0104 9.9777 20.006C9.29845 20.0017 8.8195 19.5807 8.70629 18.9011C8.5626 18.0111 8.41456 17.121 8.26652 16.2266C8.26652 16.1959 8.26217 16.1608 8.25781 16.1302Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M19.962 11.921C20.1361 11.921 20.3103 11.9167 20.4845 11.921C20.7805 11.9298 20.9982 12.1578 20.9982 12.4472C20.9982 12.7366 20.7805 12.9646 20.4801 12.9689C20.1318 12.9733 19.7834 12.9733 19.4351 12.9689C19.139 12.9646 18.9126 12.7366 18.9083 12.4516C18.9039 12.1578 19.1347 11.9254 19.4351 11.921C19.6136 11.9167 19.7878 11.921 19.962 11.921Z"
                    fill="white"
                  />
                  <path
                    d="M20.1719 15.6172C20.1414 15.8364 20.05 15.9986 19.8627 16.0907C19.6712 16.1872 19.4709 16.1828 19.3141 16.0337C19.0268 15.7662 18.7481 15.49 18.4825 15.1963C18.304 15.0033 18.3344 14.6964 18.5173 14.5079C18.7002 14.3194 19.005 14.2799 19.1966 14.4597C19.4926 14.7271 19.767 15.0165 20.0369 15.3059C20.1153 15.3892 20.1327 15.5163 20.1719 15.6172Z"
                    fill="white"
                  />
                  <path
                    d="M20.1531 9.34297C20.1226 9.40435 20.0791 9.54466 19.992 9.6455C19.7613 9.8998 19.5174 10.1409 19.2692 10.3777C19.0472 10.5926 18.7293 10.5882 18.5247 10.3777C18.3244 10.1716 18.3244 9.85596 18.529 9.63673C18.7729 9.38243 19.0254 9.12813 19.2779 8.8826C19.4434 8.72476 19.6437 8.69845 19.8527 8.79053C20.0443 8.8826 20.1401 9.04921 20.1531 9.34297Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Icon 4 - Star */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M13.4887 8.22351C14.6031 6.95906 16.3891 6.78764 17.6791 7.20007C20.6183 8.14657 21.5361 11.5486 20.7006 14.1571C19.397 18.3023 14.8396 20.4745 13.4994 20.4745C11.9978 20.4744 7.61379 18.2612 6.29529 14.1581V14.1571C5.4599 11.548 6.37601 8.14621 9.31189 7.20104C10.5929 6.78554 12.3179 6.96801 13.4887 8.22351Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Horizontal separator line - Full width across image */}
          <div className="absolute top-10 left-0 right-0 h-px bg-white/30 z-15"></div>

          {/* Tags below the separator line */}
          <div className="absolute top-12 left-2 flex pb-1 flex-wrap gap-1 z-10">{renderTags(tags)}</div>

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
                      <div className="flex-1">
                        {/* Prix et prix par m² sur la même ligne */}
                        <div className="flex items-center gap-3">
                          <motion.h2 className="text-xl font-bold text-gray-900" whileHover={{ scale: 1.05 }}>
                            <span className="text-lg  font-normal text-gray-600">Loyer</span> {property.price}/mois
                          </motion.h2>
                          <span className="text-sm text-gray-600">
                            {(() => {
                              const price = parseFloat(property.price.replace(/[^\d]/g, ''));
                              const surface = property.surface
                                ? parseFloat(property.surface.replace(/[^\d,]/g, '').replace(',', '.'))
                                : null;
                              if (surface && surface > 0) {
                                const pricePerSqm = Math.round(price / surface);
                                return `${pricePerSqm}€/m²`;
                              }
                              return '';
                            })()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="mt-2 flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <span
                        className={`inline-block text-white text-sm font-semibold px-3 py-1 rounded-full ${
                          property.type === 'Appartement'
                            ? 'bg-[#504CC5]'
                            : property.type === 'Maison'
                              ? 'bg-[#7A72D5]'
                              : property.type === 'Terrain'
                                ? 'bg-[#4F96D6]'
                                : property.type === 'Local Commercial'
                                  ? 'bg-[#205F9D]'
                                  : property.type === 'Bien Multiple'
                                    ? 'bg-[#022060]'
                                    : property.type === 'Local'
                                      ? 'bg-[#205F9D]'
                                      : 'bg-gray-500'
                        }`}
                      >
                        {property.type}
                      </span>
                      <div className="text-sm text-gray-600">
                        {property.rooms && property.rooms !== 'N/A' && <span>{property.rooms} pièces</span>}
                        {property.surface && property.surface !== 'N/A' && <span className="ml-2">{property.surface}</span>}
                      </div>
                    </motion.div>
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

                    {/* Détails supplémentaires simplifiés */}
                    {(property.bathrooms && property.bathrooms !== 'N/A') ||
                    (property.kitchen && property.kitchen !== 'N/A') ||
                    (property.balcony && property.balcony !== 'N/A') ? (
                      <motion.div
                        className="mt-3 flex flex-wrap gap-2 text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        {property.bathrooms && property.bathrooms !== 'N/A' && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{property.bathrooms} SDB</span>
                        )}
                        {property.kitchen && property.kitchen !== 'N/A' && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{property.kitchen}</span>
                        )}
                        {property.balcony && property.balcony !== 'N/A' && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{property.balcony}</span>
                        )}
                      </motion.div>
                    ) : null}

                    {/* SVG Icons Section with Text Labels */}
                    <motion.div
                      className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.65 }}
                    >
                      {/* Terrain */}
                      {property.dynamicAttributes?.['Terrain'] && property.dynamicAttributes['Terrain'] !== 'N/A' && (
                        <div className="flex items-center gap-1">
                          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.5" clipPath="url(#clip0_696_762)">
                              <path
                                d="M6.93498 15.9998C5.14607 15.0069 3.35322 14.014 1.56431 13.0211C1.11905 12.7748 0.677737 12.5246 0.23248 12.2823C0.070926 12.1963 0 12.0829 0 11.8992C0.00394033 9.29569 0.00394033 6.68831 0 4.08093C0 3.90502 0.0669856 3.79166 0.224599 3.70566C2.41148 2.49383 4.59443 1.28201 6.77343 0.0662746C6.9271 -0.0197259 7.06108 -0.023635 7.21475 0.0623655C9.40951 1.28201 11.6003 2.50165 13.7951 3.71739C13.9409 3.79948 13.9961 3.90893 13.9961 4.07312C13.9921 6.6844 13.9921 9.29569 13.9961 11.907C13.9961 12.0946 13.9133 12.2002 13.7557 12.2862C11.6516 13.4511 9.55137 14.6199 7.45117 15.7848C7.32902 15.8513 7.21081 15.9255 7.08866 15.9998C7.04137 15.9998 6.99015 15.9998 6.93498 15.9998Z"
                                fill="black"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_696_762">
                                <rect width="14" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>Terrain : {property.dynamicAttributes['Terrain']}</span>
                        </div>
                      )}

                      {/* Piscine */}
                      <div className="flex items-center gap-1">
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.5" clipPath="url(#clip0_696_773)">
                            <path
                              d="M12.681 0C12.7802 0.0333333 12.8877 0.0625 12.9828 0.108333C13.4128 0.308333 13.6733 0.65 13.7312 1.125C13.9048 2.575 14.0702 4.02917 14.2356 5.48333C14.31 6.1125 14.3844 6.74583 14.4547 7.375C14.4754 7.55417 14.3968 7.67083 14.2521 7.68333C14.1157 7.69583 14.0165 7.60833 13.9958 7.43333C13.9048 6.67917 13.8221 5.925 13.7312 5.17083C13.603 4.05417 13.4707 2.9375 13.3425 1.82083C13.3177 1.6125 13.2929 1.40833 13.2681 1.2C13.2185 0.766667 12.896 0.475 12.4619 0.470833C12.0443 0.466667 11.6267 0.470833 11.205 0.470833C8.34804 0.470833 5.49109 0.470833 2.63001 0.470833C2.07599 0.470833 1.78657 0.716667 1.72042 1.275C1.58398 2.4 1.45581 3.52917 1.32764 4.65417C1.19947 5.77083 1.06717 6.8875 0.938999 8.00417C0.810829 9.11667 0.682659 10.2292 0.554489 11.3375C0.529682 11.5667 0.50074 11.7917 0.471799 12.0208C0.409781 12.5125 0.761215 12.9417 1.25322 12.9417C2.98558 12.9458 4.71381 12.9458 6.44617 12.9417C6.46684 12.9417 6.48751 12.9375 6.52059 12.9333C6.52059 12.7458 6.52059 12.5542 6.52059 12.3458C6.45443 12.3458 6.39655 12.3458 6.33453 12.3458C4.77996 12.3458 3.22538 12.3458 1.66667 12.3458C1.24082 12.3458 1.05063 12.1167 1.10024 11.6917C1.26149 10.3208 1.4186 8.95 1.57985 7.58333C1.72869 6.3 1.88167 5.02083 2.03051 3.7375C2.11733 3.00833 2.20002 2.27917 2.28685 1.55C2.32406 1.2375 2.51011 1.0625 2.82434 1.0625C4.18459 1.0625 5.54071 1.0625 6.90096 1.0625C7.07875 1.0625 7.18624 1.15417 7.18624 1.3C7.18624 1.44167 7.07875 1.53333 6.89683 1.53333C5.58619 1.53333 4.27141 1.53333 2.96077 1.53333C2.89876 1.53333 2.83674 1.53333 2.75405 1.53333C2.35714 4.97917 1.95195 8.42083 1.55091 11.8708C2.29098 11.8708 3.01866 11.8708 3.767 11.8708C3.767 11.6417 3.767 11.4125 3.767 11.1875C3.77527 10.4458 4.06469 9.84167 4.65592 9.4C5.68128 8.63333 7.13249 8.92083 7.80642 10.0208C7.83536 10.0667 7.86017 10.1083 7.89324 10.1667C7.92218 10.1208 7.94699 10.0792 7.9718 10.0417C8.48448 9.1875 9.48503 8.78333 10.4194 9.04583C11.3662 9.3125 12.0154 10.1625 12.0278 11.1583C12.0319 11.3917 12.0278 11.625 12.0278 11.8708C12.5074 11.8708 12.9746 11.8708 13.4542 11.8708C13.0531 8.425 12.6479 4.9875 12.2469 1.53333C12.1766 1.53333 12.1187 1.53333 12.0567 1.53333C10.7585 1.53333 9.46436 1.53333 8.16612 1.53333C8.11651 1.53333 8.06276 1.5375 8.01314 1.52917C7.89324 1.50417 7.81882 1.425 7.81882 1.3C7.81882 1.18333 7.88497 1.10417 7.99661 1.075C8.04622 1.0625 8.09997 1.06667 8.14958 1.06667C9.47263 1.06667 10.7957 1.06667 12.1187 1.06667C12.5115 1.06667 12.6769 1.20833 12.7224 1.6C12.8877 3 13.049 4.4 13.2144 5.8C13.3756 7.17083 13.5368 8.5375 13.6981 9.90833C13.7725 10.5333 13.8469 11.1583 13.9172 11.7833C13.9503 12.0917 13.7312 12.3417 13.4169 12.3458C13.02 12.35 12.6231 12.3458 12.2221 12.3458C12.1642 12.3458 12.1104 12.3458 12.0443 12.3458C12.0443 12.5458 12.0443 12.7375 12.0443 12.9333C12.0898 12.9375 12.127 12.9417 12.1683 12.9417C12.6851 12.9417 13.202 12.9458 13.7188 12.9417C14.248 12.9375 14.5953 12.5167 14.5333 11.9917C14.401 10.8917 14.2769 9.79167 14.1488 8.6875C14.1446 8.65833 14.1446 8.625 14.1405 8.59583C14.1322 8.43333 14.2108 8.32917 14.3431 8.31667C14.4754 8.30417 14.5787 8.39167 14.5994 8.55C14.6366 8.82917 14.6656 9.10833 14.6986 9.3875C14.7979 10.2458 14.8888 11.1042 14.9963 11.9625C15.0914 12.7167 14.5333 13.3917 13.7808 13.4125C13.2598 13.425 12.7389 13.4167 12.2138 13.4167C12.1601 13.4167 12.1022 13.4167 12.0278 13.4167C12.0278 13.4875 12.0278 13.5417 12.0278 13.6C12.0278 14.2333 12.0278 14.8708 12.0278 15.5042C12.0278 15.8458 11.8748 16.0042 11.5399 16.0042C11.3332 16.0042 11.1264 16.0042 10.9197 16.0042C10.622 16.0042 10.498 15.9042 10.4318 15.6125C10.4277 15.5917 10.4194 15.575 10.4112 15.55C9.65454 15.55 8.90206 15.55 8.14958 15.55C8.04209 15.9375 7.9594 16 7.56248 16C7.3723 16 7.17797 16 6.98779 16C6.69424 15.9958 6.53712 15.8417 6.53712 15.5458C6.53299 14.9 6.53712 14.2542 6.53712 13.6083C6.53712 13.55 6.53712 13.4958 6.53712 13.4125C6.4627 13.4125 6.39655 13.4125 6.33453 13.4125C4.66006 13.4125 2.98558 13.4125 1.3111 13.4125C0.525548 13.4125 -0.0656873 12.7833 0.0128684 12.0292C0.0790205 11.3875 0.161711 10.7458 0.236132 10.1042C0.356033 9.075 0.475933 8.04583 0.595834 7.01667C0.728139 5.89583 0.856308 4.775 0.988613 3.65C1.08371 2.82917 1.1788 2.00833 1.27389 1.18333C1.33591 0.579167 1.68321 0.175 2.27031 0.0291667C2.28685 0.025 2.30339 0.0125 2.32406 0C5.77637 0 9.22869 0 12.681 0Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_696_773">
                              <rect width="15" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>Piscine</span>
                      </div>

                      {/* Meublé */}
                      {property.tags.includes('Meublé') && (
                        <div className="flex items-center gap-1">
                          <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.5" clipPath="url(#clip0_697_782)">
                              <path
                                d="M21.0007 7.30979C20.9295 7.55435 20.8748 7.80979 20.7763 8.04348C20.5081 8.67935 20.0538 9.15761 19.4244 9.45652C19.2821 9.52174 19.2438 9.60326 19.2438 9.75C19.2493 10.712 19.2164 11.6794 19.2548 12.6413C19.2985 13.7065 18.6254 14.538 17.5034 14.625C17.5034 14.7174 17.5034 14.8098 17.5034 14.9022C17.4924 15.5652 17.0601 15.9946 16.3924 16C15.7411 16.0054 15.0953 16 14.444 16C13.7215 16 13.2946 15.5761 13.2946 14.8641C13.2946 14.788 13.2946 14.7174 13.2946 14.625C11.4338 14.625 9.58393 14.625 7.69573 14.625C7.69573 14.7174 7.69573 14.8152 7.69573 14.9185C7.68479 15.5652 7.24694 16 6.59018 16C5.93342 16.0054 5.27666 16 4.61989 16C3.91387 16 3.48698 15.5707 3.4815 14.8696C3.4815 14.788 3.4815 14.712 3.4815 14.6522C3.22974 14.587 2.9944 14.5543 2.7919 14.462C2.14061 14.163 1.76297 13.6522 1.75203 12.9348C1.73013 11.875 1.74108 10.8152 1.74655 9.75544C1.74655 9.59783 1.6973 9.52174 1.555 9.45109C0.389244 8.88044 -0.218262 7.58696 0.0718082 6.32609C0.361879 5.09239 1.49479 4.19022 2.78096 4.17935C3.00535 4.17935 3.22974 4.21739 3.48698 4.23913C3.48698 4.14674 3.4815 4.04892 3.48698 3.95109C3.51981 3.41305 3.48698 2.85326 3.60738 2.33152C3.91935 0.978264 5.16719 0.0163074 6.56282 0.00543787C9.16798 -0.00543169 11.7731 -0.0108665 14.3783 0.00543787C16.1187 0.0163074 17.4706 1.38587 17.4979 3.13044C17.5034 3.49457 17.4979 3.86413 17.4979 4.20109C17.8701 4.20109 18.2204 4.16848 18.5706 4.20652C19.7747 4.34239 20.7653 5.29348 20.9569 6.47826C20.9623 6.52174 20.9842 6.56522 20.9952 6.6087C21.0007 6.84783 21.0007 7.07609 21.0007 7.30979Z"
                                fill="black"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_697_782">
                                <rect width="21" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>Meublé</span>
                        </div>
                      )}

                      {/* Balcon */}
                      {property.dynamicAttributes?.['Balcon/Terrasse'] && property.dynamicAttributes['Balcon/Terrasse'] !== 'N/A' && (
                        <div className="flex items-center gap-1">
                          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.5" clipPath="url(#clip0_697_793)">
                              <path
                                d="M0 15.5385C0 13.7962 0 12.05 0 10.3077C0.15625 9.96539 0.425781 9.83077 0.800781 9.86539C0.945312 9.88077 1.09375 9.86923 1.19141 9.86923C1.25781 9.65769 1.26172 9.43462 1.37891 9.33462C1.5 9.23077 1.72656 9.25 1.92188 9.21154C1.82422 8.86923 1.88672 8.55 2.15234 8.28462C2.42188 8.01538 2.75781 7.97692 3.12891 8.06538C3.12891 7.96923 3.12891 7.89231 3.12891 7.81538C3.12891 5.45 3.12891 3.08462 3.12891 0.723077C3.12891 0.226923 3.35938 0 3.85547 0C7.94922 0 12.043 0 16.1367 0C16.6445 0 16.8711 0.223077 16.8711 0.726923C16.8711 2.75 16.8711 4.77692 16.8711 6.8C16.8711 6.86539 16.8789 6.93077 16.8789 6.95C17.1172 6.89231 17.3438 6.79231 17.5742 6.79231C18.0039 6.79615 18.3281 7.1 18.418 7.51538C18.5 7.89615 18.3086 8.28462 17.9492 8.48846C17.8984 8.51538 17.8242 8.56538 17.8203 8.60769C17.8086 8.81538 17.8125 9.02692 17.8125 9.25C18.0195 9.25 18.1992 9.24615 18.3828 9.25C18.6484 9.25385 18.7461 9.35385 18.75 9.61154C18.75 9.69231 18.75 9.77308 18.75 9.86923C18.918 9.86923 19.0625 9.88077 19.2031 9.86539C19.5781 9.83077 19.8477 9.96539 20 10.3077C20 12.05 20 13.7962 20 15.5385C19.8555 15.8846 19.5859 16 19.2109 16C13.0703 15.9923 6.92969 15.9923 0.785156 16C0.414062 16 0.148438 15.8846 0 15.5385Z"
                                fill="black"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_697_793">
                                <rect width="20" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>Balcon</span>
                        </div>
                      )}

                      {/* Jardin */}
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.5">
                            <path d="M8 0C8 0 4 3 4 6C4 7.656 5.344 9 7 9V16H9V9C10.656 9 12 7.656 12 6C12 3 8 0 8 0Z" fill="black" />
                          </g>
                        </svg>
                        <span>Jardin</span>
                      </div>

                      {/* Parking */}
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.5">
                            <circle cx="8" cy="8" r="7.5" stroke="black" />
                            <path
                              d="M5 4H8.5C10.433 4 12 5.567 12 7.5C12 9.433 10.433 11 8.5 11H7V13H5V4ZM7 6V9H8.5C9.328 9 10 8.328 10 7.5C10 6.672 9.328 6 8.5 6H7Z"
                              fill="black"
                            />
                          </g>
                        </svg>
                        <span>Parking</span>
                      </div>

                      {/* Terrasse */}
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.5">
                            <rect x="2" y="6" width="12" height="8" stroke="black" fill="none" />
                            <path d="M1 6L8 2L15 6" stroke="black" fill="none" />
                          </g>
                        </svg>
                        <span>Terrasse</span>
                      </div>

                      {/* Cave */}
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.5">
                            <rect x="3" y="5" width="10" height="9" stroke="black" fill="none" />
                            <rect x="5" y="7" width="2" height="5" fill="black" />
                            <rect x="9" y="7" width="2" height="5" fill="black" />
                          </g>
                        </svg>
                        <span>Cave</span>
                      </div>

                      {/* Dernier étage */}
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.5">
                            <rect x="3" y="10" width="10" height="2" fill="black" />
                            <rect x="3" y="7" width="10" height="2" fill="black" />
                            <rect x="3" y="4" width="10" height="2" fill="black" />
                            <path d="M8 0L11 3H5L8 0Z" fill="black" />
                          </g>
                        </svg>
                        <span>Dernier étage</span>
                      </div>
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
