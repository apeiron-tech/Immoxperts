import React from 'react';
import { FiHome, FiGrid } from 'react-icons/fi';
import { FaBuilding, FaLayerGroup } from 'react-icons/fa';
import logo from '../../content/assets/logo.png';

interface Property {
  address: string;
  city: string;
  price: string;
  pricePerSqm: string;
  type: string;
  surface: string;
  rooms: string | number;
  soldDate: string;
}

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, onMouseEnter, onMouseLeave }) => {
  const { address, city, price, pricePerSqm, type, surface, rooms, soldDate } = property;

  // Add hover state
  const [isHovered, setIsHovered] = React.useState(false);

  // Helper to format the sold date in French style (DD/MM/YYYY)
  const formatFrenchDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Helper to get color for property type (advanced color map)
  const getPropertyTypeColor = propertyType => {
    // Use the same order and color as the stats panel
    const colorMap = {
      Appartement: '#4F46E5', // bg-indigo-600
      Maison: '#8B5CF6', // bg-violet-500
      Local: '#60A5FA', // bg-blue-400
      Terrain: '#2563EB', // bg-blue-600
      'Bien Multiple': '#1E3A8A', // bg-blue-900
    };
    // Use getShortTypeName to normalize
    const shortType = getShortTypeName(propertyType);
    return colorMap[shortType] || '#9CA3AF';
  };

  const getShortTypeName = typeBien => {
    const names = {
      Appartement: 'Appartement',
      Maison: 'Maison',
      'Local industriel. commercial ou assimilé': 'Local',
      Terrain: 'Terrain',
      'Bien Multiple': 'Bien Multiple',
    };
    return names[typeBien] || typeBien.split(' ')[0];
  };

  // Format property type label (capitalize each word)
  const formatPropertyTypeLabel = (propertyType: string) => {
    return (
      propertyType
        ?.toLowerCase()
        ?.split(' ')
        ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        ?.join(' ') || 'Type inconnu'
    );
  };

  // Format price and price per sqm
  const numericPrice = Number(price?.toString().replace(/[^\d]/g, ''));
  const numericSurface = Number(surface?.toString().replace(/[^\d]/g, ''));
  const priceFormatted = !isNaN(numericPrice) && numericPrice > 0 ? numericPrice.toLocaleString('fr-FR') + ' €' : price;
  const pricePerSqmFormatted =
    !isNaN(numericPrice) && !isNaN(numericSurface) && numericSurface > 0
      ? Math.round(numericPrice / numericSurface).toLocaleString('fr-FR') + ' €/m²'
      : pricePerSqm || 'N/A';

  const propertyTypeLabel = formatPropertyTypeLabel(type);
  return (
    <div
      style={{
        background: '#fff',
        padding: 24,
        fontFamily: `'Maven Pro', sans-serif`,
        maxWidth: 480,
        width: '100%',
        borderRadius: 16,
        cursor: onClick ? 'pointer' : undefined,
        boxShadow: isHovered ? '0 4px 20px rgba(36,28,131,0.18)' : '0 2px 12px rgba(36,28,131,0.08)',
        border: isHovered ? '2px solid #4F46E5' : '1px solid #e5e7eb',
        margin: 'auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row', // main container is now horizontal
        overflow: 'hidden',
        gap: 16,
        transition: 'box-shadow 0.2s, border 0.2s', // smooth transition
      }}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (onMouseLeave) onMouseLeave();
      }}
    >
      {/* LEFT COLUMN */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Address/Title */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: '#1a1a1a',
            letterSpacing: 0.5,
            lineHeight: 1.2,
            textShadow: '0 1px 0rgb(243, 243, 250)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {(address || '').toUpperCase()}
        </div>
        {/* Property Type, Rooms, Surface */}
        <div
          style={{
            fontSize: 15,
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 8,
          }}
        >
          <span style={{ color: getPropertyTypeColor(propertyTypeLabel), fontWeight: 900, fontSize: 15 }}>
            {getShortTypeName(propertyTypeLabel)}
          </span>
          <span style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>
            {rooms || 'N/A'} pièces - {surface || 'N/A'}
          </span>
        </div>
        {/* Sold Date */}
        <div
          style={{
            marginTop: 8,
            display: 'inline-block',
            border: '1px solid #e5e7eb',
            padding: '8px 14px',
            borderRadius: 12,
            fontSize: 14,
            color: '#444',
            background: '#fafbfc',
            alignSelf: 'flex-start',
          }}
        >
          Vendu le <strong style={{ color: '#000' }}>{soldDate}</strong>
        </div>
      </div>
      {/* RIGHT COLUMN: PRICE BOX */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          padding: '10px 14px',
          borderRadius: 12,
          textAlign: 'right',
          minWidth: 110,
          boxShadow: '0 1px 4px rgba(36,28,131,0.04)',
          flexShrink: 0,
          alignSelf: 'flex-start', // align top
        }}
      >
        <div style={{ color: '#241c83', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{priceFormatted}</div>
        <div style={{ color: '#888', fontSize: 14 }}>{pricePerSqmFormatted}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
