import { EXTERNAL_URLS } from 'app/config/api.config';

const getLogoUrl = (key: keyof typeof EXTERNAL_URLS): string =>
  EXTERNAL_URLS[key] && 'logo' in EXTERNAL_URLS[key] ? (EXTERNAL_URLS[key] as { logo: string }).logo : '';

export const ASSOCIATION_LOGOS: Record<string, string> = {
  bienici: getLogoUrl('bienici'),
  century21: getLogoUrl('century21'),
  figaroimmo: getLogoUrl('figaroimmo'),
  guyhoquet: getLogoUrl('guyhoquet'),
  iad: getLogoUrl('iad'),
  leboncoin: getLogoUrl('leboncoin'),
  orpi: getLogoUrl('orpi'),
  paruvendu: getLogoUrl('paruvendu'),
  safti: getLogoUrl('safti'),
  seloger: getLogoUrl('seloger'),
  avendrealouer: getLogoUrl('avendrealouer'),
};

export const getAssociationFromSource = (source: string): string => {
  const s = source?.toLowerCase() || '';
  if (s.includes('bienici')) return 'bienici';
  if (s.includes('century21') || s.includes('century 21')) return 'century21';
  if (s.includes('figaro')) return 'figaroimmo';
  if (s.includes('guy') && s.includes('hoquet')) return 'guyhoquet';
  if (s.includes('iad')) return 'iad';
  if (s.includes('leboncoin')) return 'leboncoin';
  if (s.includes('orpi')) return 'orpi';
  if (s.includes('paruvendu')) return 'paruvendu';
  if (s.includes('safti')) return 'safti';
  if (s.includes('seloger')) return 'seloger';
  if (s.includes('avendrealouer') || s.includes('avendre')) return 'avendrealouer';
  return 'seloger';
};

export const getAssociationUrlFromSource = (source: string): string => {
  const assoc = getAssociationFromSource(source);
  const entry = EXTERNAL_URLS[assoc as keyof typeof EXTERNAL_URLS];
  const website = entry && 'website' in entry ? (entry as { website: string }).website : null;
  if (website) return website;
  return EXTERNAL_URLS.seloger.website;
};

export const getLogoFromSource = (source: string): string => {
  const assoc = getAssociationFromSource(source);
  return ASSOCIATION_LOGOS[assoc] || ASSOCIATION_LOGOS.seloger;
};

const extractSurfaceTotale = (details: string): string => {
  const totalMatch = details.match(/Surface\s+totale\s*:\s*(\d+(?:\s?\d{3})*(?:[,.]\d+)?)\s*m[²2]/i);
  return totalMatch ? `${totalMatch[1].replace(/\s/g, '')} m²` : 'N/A';
};

const extractSurfaceHabitable = (details: string): string => {
  const habitableMatch = details.match(/Surface\s+habitable\s*:\s*(\d+(?:\s?\d{3})*(?:[,.]\d+)?)\s*m[²2]/i);
  return habitableMatch ? `${habitableMatch[1].replace(/\s/g, '')} m²` : 'N/A';
};

const extractSurfaceGeneral = (details: string): string => {
  // "Surface: 58 m²" or "Surface : 58 m²"
  const labelMatch = details.match(/Surface\s*:\s*(\d+(?:[,.]\d+)?)\s*m[²2]/i);
  if (labelMatch) return `${labelMatch[1].replace(',', '.')} m²`;
  // Bare surface at start of string or after a separator: "141.22 m²"
  const bareMatch = details.match(/(?:^|[\s|,;])(\d+(?:[,.]\d+)?)\s*m[²2]/);
  if (bareMatch) return `${bareMatch[1].replace(',', '.')} m²`;
  return 'N/A';
};

const extractChambres = (details: string): string => {
  // "Chambres: 3 ch." or "Chambres : 2"
  const labelMatch = details.match(/Chambres?\s*:\s*(\d+)/i);
  if (labelMatch) return labelMatch[1];
  // "3 chambre(s)", "3 chambres"
  const inlineMatch = details.match(/(\d+)\s*chambre(?:s|\(s\))?/i);
  if (inlineMatch) return inlineMatch[1];
  // "3 ch." abbreviation
  const abbrMatch = details.match(/(\d+)\s*ch\.?(\s|$|\|)/i);
  if (abbrMatch) return abbrMatch[1];
  return 'N/A';
};

const extractRooms = (details: string): string => {
  // "Pièces: 6" or "Pièces : 6" (label: value format)
  const labelMatch = details.match(/Pi[eè]ces?\s*:\s*(\d+)/i);
  if (labelMatch) return `${labelMatch[1]} pièces`;
  // "6 pièces" or "6 pièce"
  const piecesMatch = details.match(/(\d+)\s*pièces?/i);
  if (piecesMatch) return `${piecesMatch[1]} pièces`;
  // T3, F4 apartment codes
  const tMatch = details.match(/\bT(\d+)\b/i);
  if (tMatch) return `${tMatch[1]} pièces`;
  const fMatch = details.match(/\bF(\d+)\b/i);
  if (fMatch) return `${fMatch[1]} pièces`;
  return 'N/A';
};

const extractBathrooms = (details: string): string => {
  const match = details.match(/(\d+)\s*(?:salles?\s*de\s*bains?|SDB)/i);
  return match ? `${match[1]} ${parseInt(match[1], 10) > 1 ? 'salles de bain' : 'salle de bain'}` : 'N/A';
};

const extractKitchen = (details: string): string => {
  if (/cuisine\s*équipée/i.test(details)) return 'Équipée';
  if (/cuisine\s*aménagée/i.test(details)) return 'Aménagée';
  if (/cuisine\s*ouverte/i.test(details)) return 'Ouverte';
  if (/cuisine/i.test(details)) return 'Oui';
  return 'N/A';
};

const extractBalcony = (details: string): string => {
  if (/balcon/i.test(details)) return 'Oui';
  if (/terrasse/i.test(details)) return 'Terrasse';
  if (/loggia/i.test(details)) return 'Loggia';
  return 'N/A';
};

export const extractFurnishing = (details: string): string => {
  if (/meublée?/i.test(details)) return 'Meublé';
  if (/non\s*meublée?/i.test(details)) return 'Non meublé';
  return 'N/A';
};

const extractFloor = (details: string): string => {
  const match = details.match(/Étage\s*:\s*([^|]+)/i);
  if (match) return match[1].trim();
  const floorMatch = details.match(/(\d+)(?:er|ème|e)\s*étage/i);
  if (floorMatch) return `${floorMatch[1]}${floorMatch[1] === '1' ? 'er' : 'ème'}`;
  if (/rez.de.chaussée/i.test(details)) return 'RDC';
  return 'N/A';
};

const extractApartmentType = (details: string): string => {
  const match = details.match(/Type\s*d'appartement\s*:\s*([^|]+)/i);
  if (match) return match[1].trim();
  const directTMatch = details.match(/\b(T\d+)\b/i);
  if (directTMatch) return directTMatch[1];
  const directFMatch = details.match(/\b(F\d+)\b/i);
  if (directFMatch) return directFMatch[1];
  return 'N/A';
};

const extractConstructionType = (details: string): string => {
  const match = details.match(/Type\s*de\s*construction\s*:\s*([^|]+)/i);
  return match ? match[1].trim() : 'N/A';
};

const extractConstructionYear = (details: string): string => {
  const match = details.match(/Année\s*construction\s*:\s*(\d{4})/i);
  return match ? match[1] : 'N/A';
};

const extractGardenTerrain = (details: string): string => {
  const terrainMatch = details.match(/Surface terrain\s*:\s*(\d+(?:\s?\d{3})*(?:[,.]\d+)?)\s*m2?/i);
  if (terrainMatch) return `${terrainMatch[1].replace(/\s/g, '')} m² terrain`;
  if (/jardin/i.test(details)) return 'Jardin';
  if (/terrasse/i.test(details)) return 'Terrasse';
  return 'N/A';
};

const extractParking = (details: string): string => {
  if (/garage/i.test(details)) return 'Garage';
  if (/parking/i.test(details)) return 'Parking';
  if (/place\s*de\s*stationnement/i.test(details)) return 'Stationnement';
  return 'N/A';
};

const extractPiscine = (details: string): string => (/piscine/i.test(details) ? 'Oui' : 'N/A');
const extractJardin = (details: string): string => (/jardin/i.test(details) ? 'Oui' : 'N/A');
const extractCave = (details: string): string => (/cave/i.test(details) ? 'Oui' : 'N/A');
const extractTerrasse = (details: string): string => (/terrasse/i.test(details) ? 'Oui' : 'N/A');
const extractDernierEtage = (details: string): string =>
  /dernier\s*étage|dernier etage|étage\s*élevé|dernier étage/i.test(details) ? 'Oui' : 'N/A';

/** Extract DPE energy class (A–G) from details text. Tries multiple common formats. */
const extractEnergyClass = (details: string): string => {
  if (!details || !details.trim()) return 'N/A';
  const d = details;
  // DPE : E | DPE: E | DPE E
  let m = d.match(/DPE\s*[:\s]*([A-Ga-g])\b/);
  if (m) return `DPE ${m[1].toUpperCase()}`;
  // Classe énergétique : E (with or without accent)
  m = d.match(/Classe\s*[eé]nerg[eé]tique\s*[:\s]*([A-Ga-g])\b/);
  if (m) return `DPE ${m[1].toUpperCase()}`;
  // Performance énergétique : E
  m = d.match(/Performance\s*[eé]nerg[eé]tique\s*[:\s]*([A-Ga-g])\b/);
  if (m) return `DPE ${m[1].toUpperCase()}`;
  // Énergie : E
  m = d.match(/[EÉ]nergie\s*[:\s]*([A-Ga-g])\b/);
  if (m) return `DPE ${m[1].toUpperCase()}`;
  // " ... | DPE E | " or " ... DPE E " (letter right after DPE)
  m = d.match(/DPE\s+([A-Ga-g])(?:\s|[|,]|$)/);
  if (m) return `DPE ${m[1].toUpperCase()}`;
  // Standalone class letter after common labels (last resort)
  m = d.match(/(?:DPE|classe|énergétique|énergie)\s*[:\s]*([A-Ga-g])\b/);
  if (m) return `DPE ${m[1].toUpperCase()}`;
  return 'N/A';
};

export const extractAllAttributes = (allText: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  const surfaceTotale = extractSurfaceTotale(allText);
  const surfaceHabitable = extractSurfaceHabitable(allText);

  if (surfaceTotale !== 'N/A') {
    attributes['Surface'] = surfaceTotale;
  } else if (surfaceHabitable !== 'N/A') {
    attributes['Surface'] = surfaceHabitable;
  } else {
    const surfaceGeneral = extractSurfaceGeneral(allText);
    if (surfaceGeneral !== 'N/A') attributes['Surface'] = surfaceGeneral;
  }

  const apartmentType = extractApartmentType(allText);
  if (apartmentType !== 'N/A') attributes["Type d'appartement"] = apartmentType;

  const floor = extractFloor(allText);
  if (floor !== 'N/A') attributes['Étage'] = floor;

  const constructionType = extractConstructionType(allText);
  if (constructionType !== 'N/A') attributes['Type de construction'] = constructionType;

  const constructionYear = extractConstructionYear(allText);
  if (constructionYear !== 'N/A') attributes['Année construction'] = constructionYear;

  const chambres = extractChambres(allText);
  if (chambres !== 'N/A') attributes['Chambres'] = chambres;

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

  const piscine = extractPiscine(allText);
  if (piscine !== 'N/A') attributes['Piscine'] = piscine;

  const jardin = extractJardin(allText);
  if (jardin !== 'N/A') attributes['Jardin'] = jardin;

  const cave = extractCave(allText);
  if (cave !== 'N/A') attributes['Cave'] = cave;

  const terrasse = extractTerrasse(allText);
  if (terrasse !== 'N/A') attributes['Terrasse'] = terrasse;

  const dernierEtage = extractDernierEtage(allText);
  if (dernierEtage !== 'N/A') attributes['Dernier étage'] = dernierEtage;

  const energyClass = extractEnergyClass(allText);
  if (energyClass !== 'N/A') attributes['Classe énergétique'] = energyClass;

  return attributes;
};
