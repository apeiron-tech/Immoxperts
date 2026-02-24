import React from 'react';
import { motion } from 'framer-motion';
import { ASSOCIATION_LOGOS } from './propertySearchUtils';

export interface PropertySearchCardData {
  id: number;
  price: string;
  type: string;
  description: string;
  surface: string;
  rooms: string;
  chambres: string;
  bathrooms: string;
  kitchen: string;
  balcony: string;
  address: string;
  tags: string[];
  Association: string[];
  Association_url: string[];
  images: string[];
  dynamicAttributes?: { [key: string]: string };
}

interface PropertySearchCardProps {
  property: PropertySearchCardData;
  index: number;
  mode: 'louer' | 'achat';
  associationDisplayNames: Record<string, string>;
  ImageGallery: React.FC<{ images: string[]; tags: string[] }>;
  priceLabel: string;
  priceSuffix: string;
}

const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    Appartement: 'bg-[#504CC5]',
    Maison: 'bg-[#7A72D5]',
    Terrain: 'bg-[#4F96D6]',
    'Local Commercial': 'bg-[#205F9D]',
    'Bien Multiple': 'bg-[#022060]',
    Local: 'bg-[#205F9D]',
  };
  return classes[type] ?? 'bg-gray-500';
};

const getPricePerSqm = (price: string, surface: string): string => {
  const priceNum = parseFloat(price.replace(/[^\d]/g, ''));
  const surfaceNum = surface ? parseFloat(surface.replace(/[^\d,]/g, '').replace(',', '.')) : null;
  if (surfaceNum && surfaceNum > 0) {
    return `${Math.round(priceNum / surfaceNum)}€/m²`;
  }
  return '';
};

const hasAttr = (attrs: PropertySearchCardData['dynamicAttributes'], key: string): boolean =>
  !!(attrs?.[key] && attrs[key] !== 'N/A');

/** Extract DPE class letter (A–G). Use the letter after "DPE", not the D in "DPE". */
const getEnergyClassLetter = (attrs: PropertySearchCardData['dynamicAttributes']): string | null => {
  const raw = attrs?.['Classe énergétique'];
  if (!raw || raw === 'N/A') return null;
  // Match letter after "DPE" or "DPE :" so we get E from "DPE: E", not D from "DPE"
  const m = raw.match(/DPE\s*:?\s*([A-Ga-g])\b/);
  if (m) return m[1].toUpperCase();
  const fallback = raw.match(/\b([A-Ga-g])\s*$/); // last A-G in string (e.g. "Classe E")
  return fallback ? fallback[1].toUpperCase() : null;
};

/** Official DPE colors (France) */
const DPE_COLORS: Record<string, string> = {
  A: '#009639',
  B: '#33a652',
  C: '#b8d530',
  D: '#ffcc00',
  E: '#f7941d',
  F: '#e64c3c',
  G: '#c41230',
};

/** DPE badge: bond style sticking out from the card corner */
const EnergyClassBadge: React.FC<{ letter: string }> = ({ letter }) => {
  const bg = DPE_COLORS[letter] ?? '#6b7280';
  const isLight = ['C', 'D'].includes(letter);
  return (
    <span
      className="absolute -top-0.5 -left-0.5 z-20 flex h-9 w-9 items-center justify-center rounded-md border-2 border-white"
      style={{
        backgroundColor: bg,
        transform: 'rotate(-12deg)',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
      }}
      title={`DPE - Classe énergétique ${letter}`}
      data-testid="card-mfe-energy-performance-class"
    >
      <span
        className="text-sm font-bold uppercase leading-none"
        style={{ color: isLight ? '#1a1a1a' : '#fff' }}
      >
        {letter}
      </span>
    </span>
  );
};

const PropertyCharacteristics: React.FC<{ property: PropertySearchCardData }> = ({ property }) => {
  const attrs = property.dynamicAttributes;
  const showTerrain = hasAttr(attrs, 'Terrain');
  const showPiscine = hasAttr(attrs, 'Piscine');
  const showMeuble = property.tags.includes('Meublé');
  const showBalcon =
    attrs?.['Balcon/Terrasse'] && attrs['Balcon/Terrasse'] !== 'N/A' && attrs['Balcon/Terrasse'] !== 'Terrasse';
  const showJardin = hasAttr(attrs, 'Jardin');
  const showParking = hasAttr(attrs, 'Parking');
  const showTerrasse = hasAttr(attrs, 'Terrasse') || attrs?.['Balcon/Terrasse'] === 'Terrasse';
  const showCave = hasAttr(attrs, 'Cave');
  const showDernierEtage = hasAttr(attrs, 'Dernier étage');

  const items: Array<{ show: boolean; label: string; svg: React.ReactNode }> = [
    {
      show: showTerrain,
      label: `Terrain : ${attrs?.['Terrain']}`,
      svg: (
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5" clipPath="url(#clip0_search_762)">
            <path
              d="M6.93498 15.9998C5.14607 15.0069 3.35322 14.014 1.56431 13.0211C1.11905 12.7748 0.677737 12.5246 0.23248 12.2823C0.070926 12.1963 0 12.0829 0 11.8992C0.00394033 9.29569 0.00394033 6.68831 0 4.08093C0 3.90502 0.0669856 3.79166 0.224599 3.70566C2.41148 2.49383 4.59443 1.28201 6.77343 0.0662746C6.9271 -0.0197259 7.06108 -0.023635 7.21475 0.0623655C9.40951 1.28201 11.6003 2.50165 13.7951 3.71739C13.9409 3.79948 13.9961 3.90893 13.9961 4.07312C13.9921 6.6844 13.9921 9.29569 13.9961 11.907C13.9961 12.0946 13.9133 12.2002 13.7557 12.2862C11.6516 13.4511 9.55137 14.6199 7.45117 15.7848C7.32902 15.8513 7.21081 15.9255 7.08866 15.9998C7.04137 15.9998 6.99015 15.9998 6.93498 15.9998Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_search_762">
              <rect width="14" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      show: showPiscine,
      label: 'Piscine',
      svg: (
        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5" clipPath="url(#clip0_search_773)">
            <path
              d="M12.681 0C12.7802 0.0333333 12.8877 0.0625 12.9828 0.108333C13.4128 0.308333 13.6733 0.65 13.7312 1.125C13.9048 2.575 14.0702 4.02917 14.2356 5.48333C14.31 6.1125 14.3844 6.74583 14.4547 7.375C14.4754 7.55417 14.3968 7.67083 14.2521 7.68333C14.1157 7.69583 14.0165 7.60833 13.9958 7.43333C13.9048 6.67917 13.8221 5.925 13.7312 5.17083C13.603 4.05417 13.4707 2.9375 13.3425 1.82083C13.3177 1.6125 13.2929 1.40833 13.2681 1.2C13.2185 0.766667 12.896 0.475 12.4619 0.470833C12.0443 0.466667 11.6267 0.470833 11.205 0.470833C8.34804 0.470833 5.49109 0.470833 2.63001 0.470833C2.07599 0.470833 1.78657 0.716667 1.72042 1.275C1.58398 2.4 1.45581 3.52917 1.32764 4.65417C1.19947 5.77083 1.06717 6.8875 0.938999 8.00417C0.810829 9.11667 0.682659 10.2292 0.554489 11.3375C0.529682 11.5667 0.50074 11.7917 0.471799 12.0208C0.409781 12.5125 0.761215 12.9417 1.25322 12.9417C2.98558 12.9458 4.71381 12.9458 6.44617 12.9417C6.46684 12.9417 6.48751 12.9375 6.52059 12.9333C6.52059 12.7458 6.52059 12.5542 6.52059 12.3458C6.45443 12.3458 6.39655 12.3458 6.33453 12.3458C4.77996 12.3458 3.22538 12.3458 1.66667 12.3458C1.24082 12.3458 1.05063 12.1167 1.10024 11.6917C1.26149 10.3208 1.4186 8.95 1.57985 7.58333C1.72869 6.3 1.88167 5.02083 2.03051 3.7375C2.11733 3.00833 2.20002 2.27917 2.28685 1.55C2.32406 1.2375 2.51011 1.0625 2.82434 1.0625C4.18459 1.0625 5.54071 1.0625 6.90096 1.0625C7.07875 1.0625 7.18624 1.15417 7.18624 1.3C7.18624 1.44167 7.07875 1.53333 6.89683 1.53333C5.58619 1.53333 4.27141 1.53333 2.96077 1.53333C2.89876 1.53333 2.83674 1.53333 2.75405 1.53333C2.35714 4.97917 1.95195 8.42083 1.55091 11.8708C2.29098 11.8708 3.01866 11.8708 3.767 11.8708C3.767 11.6417 3.767 11.4125 3.767 11.1875C3.77527 10.4458 4.06469 9.84167 4.65592 9.4C5.68128 8.63333 7.13249 8.92083 7.80642 10.0208C7.83536 10.0667 7.86017 10.1083 7.89324 10.1667C7.92218 10.1208 7.94699 10.0792 7.9718 10.0417C8.48448 9.1875 9.48503 8.78333 10.4194 9.04583C11.3662 9.3125 12.0154 10.1625 12.0278 11.1583C12.0319 11.3917 12.0278 11.625 12.0278 11.8708C12.5074 11.8708 12.9746 11.8708 13.4542 11.8708C13.0531 8.425 12.6479 4.9875 12.2469 1.53333C12.1766 1.53333 12.1187 1.53333 12.0567 1.53333C10.7585 1.53333 9.46436 1.53333 8.16612 1.53333C8.11651 1.53333 8.06276 1.5375 8.01314 1.52917C7.89324 1.50417 7.81882 1.425 7.81882 1.3C7.81882 1.18333 7.88497 1.10417 7.99661 1.075C8.04622 1.0625 8.09997 1.06667 8.14958 1.06667C9.47263 1.06667 10.7957 1.06667 12.1187 1.06667C12.5115 1.06667 12.6769 1.20833 12.7224 1.6C12.8877 3 13.049 4.4 13.2144 5.8C13.3756 7.17083 13.5368 8.5375 13.6981 9.90833C13.7725 10.5333 13.8469 11.1583 13.9172 11.7833C13.9503 12.0917 13.7312 12.3417 13.4169 12.3458C13.02 12.35 12.6231 12.3458 12.2221 12.3458C12.1642 12.3458 12.1104 12.3458 12.0443 12.3458C12.0443 12.5458 12.0443 12.7375 12.0443 12.9333C12.0898 12.9375 12.127 12.9417 12.1683 12.9417C12.6851 12.9417 13.202 12.9458 13.7188 12.9417C14.248 12.9375 14.5953 12.5167 14.5333 11.9917C14.401 10.8917 14.2769 9.79167 14.1488 8.6875C14.1446 8.65833 14.1446 8.625 14.1405 8.59583C14.1322 8.43333 14.2108 8.32917 14.3431 8.31667C14.4754 8.30417 14.5787 8.39167 14.5994 8.55C14.6366 8.82917 14.6656 9.10833 14.6986 9.3875C14.7979 10.2458 14.8888 11.1042 14.9963 11.9625C15.0914 12.7167 14.5333 13.3917 13.7808 13.4125C13.2598 13.425 12.7389 13.4167 12.2138 13.4167C12.1601 13.4167 12.1022 13.4167 12.0278 13.4167C12.0278 13.4875 12.0278 13.5417 12.0278 13.6C12.0278 14.2333 12.0278 14.8708 12.0278 15.5042C12.0278 15.8458 11.8748 16.0042 11.5399 16.0042C11.3332 16.0042 11.1264 16.0042 10.9197 16.0042C10.622 16.0042 10.498 15.9042 10.4318 15.6125C10.4277 15.5917 10.4194 15.575 10.4112 15.55C9.65454 15.55 8.90206 15.55 8.14958 15.55C8.04209 15.9375 7.9594 16 7.56248 16C7.3723 16 7.17797 16 6.98779 16C6.69424 15.9958 6.53712 15.8417 6.53712 15.5458C6.53299 14.9 6.53712 14.2542 6.53712 13.6083C6.53712 13.55 6.53712 13.4958 6.53712 13.4125C6.4627 13.4125 6.39655 13.4125 6.33453 13.4125C4.66006 13.4125 2.98558 13.4125 1.3111 13.4125C0.525548 13.4125 -0.0656873 12.7833 0.0128684 12.0292C0.0790205 11.3875 0.161711 10.7458 0.236132 10.1042C0.356033 9.075 0.475933 8.04583 0.595834 7.01667C0.728139 5.89583 0.856308 4.775 0.988613 3.65C1.08371 2.82917 1.1788 2.00833 1.27389 1.18333C1.33591 0.579167 1.68321 0.175 2.27031 0.0291667C2.28685 0.025 2.30339 0.0125 2.32406 0C5.77637 0 9.22869 0 12.681 0Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_search_773">
              <rect width="15" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      show: showMeuble,
      label: 'Meublé',
      svg: (
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5" clipPath="url(#clip0_search_782)">
            <path
              d="M21.0007 7.30979C20.9295 7.55435 20.8748 7.80979 20.7763 8.04348C20.5081 8.67935 20.0538 9.15761 19.4244 9.45652C19.2821 9.52174 19.2438 9.60326 19.2438 9.75C19.2493 10.712 19.2164 11.6794 19.2548 12.6413C19.2985 13.7065 18.6254 14.538 17.5034 14.625C17.5034 14.7174 17.5034 14.8098 17.5034 14.9022C17.4924 15.5652 17.0601 15.9946 16.3924 16C15.7411 16.0054 15.0953 16 14.444 16C13.7215 16 13.2946 15.5761 13.2946 14.8641C13.2946 14.788 13.2946 14.7174 13.2946 14.625C11.4338 14.625 9.58393 14.625 7.69573 14.625C7.69573 14.7174 7.69573 14.8152 7.69573 14.9185C7.68479 15.5652 7.24694 16 6.59018 16C5.93342 16.0054 5.27666 16 4.61989 16C3.91387 16 3.48698 15.5707 3.4815 14.8696C3.4815 14.788 3.4815 14.712 3.4815 14.6522C3.22974 14.587 2.9944 14.5543 2.7919 14.462C2.14061 14.163 1.76297 13.6522 1.75203 12.9348C1.73013 11.875 1.74108 10.8152 1.74655 9.75544C1.74655 9.59783 1.6973 9.52174 1.555 9.45109C0.389244 8.88044 -0.218262 7.58696 0.0718082 6.32609C0.361879 5.09239 1.49479 4.19022 2.78096 4.17935C3.00535 4.17935 3.22974 4.21739 3.48698 4.23913C3.48698 4.14674 3.4815 4.04892 3.48698 3.95109C3.51981 3.41305 3.48698 2.85326 3.60738 2.33152C3.91935 0.978264 5.16719 0.0163074 6.56282 0.00543787C9.16798 -0.00543169 11.7731 -0.0108665 14.3783 0.00543787C16.1187 0.0163074 17.4706 1.38587 17.4979 3.13044C17.5034 3.49457 17.4979 3.86413 17.4979 4.20109C17.8701 4.20109 18.2204 4.16848 18.5706 4.20652C19.7747 4.34239 20.7653 5.29348 20.9569 6.47826C20.9623 6.52174 20.9842 6.56522 20.9952 6.6087C21.0007 6.84783 21.0007 7.07609 21.0007 7.30979Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_search_782">
              <rect width="21" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      show: showBalcon,
      label: 'Balcon',
      svg: (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5" clipPath="url(#clip0_search_793)">
            <path
              d="M0 15.5385C0 13.7962 0 12.05 0 10.3077C0.15625 9.96539 0.425781 9.83077 0.800781 9.86539C0.945312 9.88077 1.09375 9.86923 1.19141 9.86923C1.25781 9.65769 1.26172 9.43462 1.37891 9.33462C1.5 9.23077 1.72656 9.25 1.92188 9.21154C1.82422 8.86923 1.88672 8.55 2.15234 8.28462C2.42188 8.01538 2.75781 7.97692 3.12891 8.06538C3.12891 7.96923 3.12891 7.89231 3.12891 7.81538C3.12891 5.45 3.12891 3.08462 3.12891 0.723077C3.12891 0.226923 3.35938 0 3.85547 0C7.94922 0 12.043 0 16.1367 0C16.6445 0 16.8711 0.223077 16.8711 0.726923C16.8711 2.75 16.8711 4.77692 16.8711 6.8C16.8711 6.86539 16.8789 6.93077 16.8789 6.95C17.1172 6.89231 17.3438 6.79231 17.5742 6.79231C18.0039 6.79615 18.3281 7.1 18.418 7.51538C18.5 7.89615 18.3086 8.28462 17.9492 8.48846C17.8984 8.51538 17.8242 8.56538 17.8203 8.60769C17.8086 8.81538 17.8125 9.02692 17.8125 9.25C18.0195 9.25 18.1992 9.24615 18.3828 9.25C18.6484 9.25385 18.7461 9.35385 18.75 9.61154C18.75 9.69231 18.75 9.77308 18.75 9.86923C18.918 9.86923 19.0625 9.88077 19.2031 9.86539C19.5781 9.83077 19.8477 9.96539 20 10.3077C20 12.05 20 13.7962 20 15.5385C19.8555 15.8846 19.5859 16 19.2109 16C13.0703 15.9923 6.92969 15.9923 0.785156 16C0.414062 16 0.148438 15.8846 0 15.5385Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_search_793">
              <rect width="20" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    { show: showJardin, label: 'Jardin', svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><g opacity="0.5"><path d="M8 0C8 0 4 3 4 6C4 7.656 5.344 9 7 9V16H9V9C10.656 9 12 7.656 12 6C12 3 8 0 8 0Z" fill="black" /></g></svg> },
    { show: showParking, label: 'Parking', svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><g opacity="0.5"><circle cx="8" cy="8" r="7.5" stroke="black" /><path d="M5 4H8.5C10.433 4 12 5.567 12 7.5C12 9.433 10.433 11 8.5 11H7V13H5V4ZM7 6V9H8.5C9.328 9 10 8.328 10 7.5C10 6.672 9.328 6 8.5 6H7Z" fill="black" /></g></svg> },
    { show: showTerrasse, label: 'Terrasse', svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><g opacity="0.5"><rect x="2" y="6" width="12" height="8" stroke="black" fill="none" /><path d="M1 6L8 2L15 6" stroke="black" fill="none" /></g></svg> },
    { show: showCave, label: 'Cave', svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><g opacity="0.5"><rect x="3" y="5" width="10" height="9" stroke="black" fill="none" /><rect x="5" y="7" width="2" height="5" fill="black" /><rect x="9" y="7" width="2" height="5" fill="black" /></g></svg> },
    { show: showDernierEtage, label: 'Dernier étage', svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><g opacity="0.5"><rect x="3" y="10" width="10" height="2" fill="black" /><rect x="3" y="7" width="10" height="2" fill="black" /><rect x="3" y="4" width="10" height="2" fill="black" /><path d="M8 0L11 3H5L8 0Z" fill="black" /></g></svg> },
  ];

  return (
    <motion.div
      className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.65 }}
    >
      {items
        .filter(item => item.show)
        .map((item, i) => (
          <div key={`${item.label}-${i}`} className="flex items-center gap-1">
            {item.svg}
            <span>{item.label}</span>
          </div>
        ))}
    </motion.div>
  );
};

export const PropertySearchCard: React.FC<PropertySearchCardProps> = ({
  property,
  index,
  mode,
  associationDisplayNames,
  ImageGallery,
  priceLabel,
  priceSuffix,
}) => {
  const pricePerSqm = getPricePerSqm(property.price, property.surface);
  const typeBadgeClass = getTypeBadgeClass(property.type);
  const hasExtraDetails = property.bathrooms !== 'N/A' || property.kitchen !== 'N/A' || property.balcony !== 'N/A';

  const energyLetter = getEnergyClassLetter(property.dynamicAttributes);

  return (
    <motion.div
      className="relative bg-white rounded-3xl p-3 shadow-md overflow-visible"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {energyLetter && (
        <EnergyClassBadge letter={energyLetter} />
      )}
      <ImageGallery images={property.images} tags={property.tags} />

      <div className="p-4">
        <motion.div className="flex justify-between items-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <motion.h2 className="text-xl font-bold text-gray-900" whileHover={{ scale: 1.05 }}>
                <span className="text-lg font-normal text-gray-600">{priceLabel}</span>{' '}
                {property.price.replace(/[€*]/g, '').replace(/\s{2,}/g, ' ').trim()}
                {priceSuffix}
              </motion.h2>
              {pricePerSqm && <span className="text-sm text-gray-600">{pricePerSqm}</span>}
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-2 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <span className={`inline-block text-white text-sm font-semibold px-3 py-1 rounded-full ${typeBadgeClass}`}>
            {property.type}
          </span>
          <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 gap-y-0">
            {property.rooms && property.rooms !== 'N/A' && <span>{property.rooms}</span>}
            {property.chambres && property.chambres !== 'N/A' && (
              <span>{property.chambres} Chambre{property.chambres !== '1' ? 's' : ''}</span>
            )}
            {property.surface && property.surface !== 'N/A' && <span>{property.surface}</span>}
          </div>
        </motion.div>

        {property.description?.trim() && (
          <motion.p className="text-gray-600 text-sm mt-1 line-clamp-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
            {property.description}
          </motion.p>
        )}

        {hasExtraDetails && (
          <motion.div className="mt-3 flex flex-wrap gap-2 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>
            {property.bathrooms && property.bathrooms !== 'N/A' && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {property.bathrooms.includes('salle') || property.bathrooms.includes('SDB') ? property.bathrooms : `${property.bathrooms} SDB`}
              </span>
            )}
            {property.kitchen && property.kitchen !== 'N/A' && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{property.kitchen === 'Oui' ? 'Cuisine' : property.kitchen}</span>
            )}
            {property.balcony && property.balcony !== 'N/A' && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{property.balcony === 'Oui' ? 'Balcon' : property.balcony}</span>
            )}
          </motion.div>
        )}

        <PropertyCharacteristics property={property} />

        <motion.div className="mt-3 flex items-center text-xs text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.7 }}>
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.address}
        </motion.div>

        <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.8 }}>
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
                <img src={ASSOCIATION_LOGOS[assoc] || ASSOCIATION_LOGOS.seloger} alt={assoc} className="h-4 w-4 object-contain" />
                <span>{associationDisplayNames[assoc] || assoc}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
