import React from 'react';

// --- TYPE DEFINITIONS ---
// It's best practice to have a single source of truth for this interface,
// e.g., in a shared types file.
interface Property {
  address: string;
  city: string;
  price: string;
  pricePerSqm: string;
  type: string;
  surface: string;
  rooms: string | number;
  soldDate: string;
  terrain?: string; // Add terrain attribute
}

// 1. UPDATE THE PROPS INTERFACE
// We need to accept the `isHovered` boolean from the parent.
// The onMouseEnter/Leave props are now handled by the parent.
interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean; // This prop will control the hover style
  isMapHovered?: boolean; // **NEW**: Highlight when hovered from map
}

// --- HELPER FUNCTIONS ---
// These helpers are great, no changes needed.
const getShortTypeName = (typeBien: string) => {
  const names = {
    Appartement: 'Appartement',
    Maison: 'Maison',
    'Local industriel. commercial ou assimilé': 'Local',
    Terrain: 'Terrain',
    'Bien Multiple': 'Bien Multiple',
  };
  return names[typeBien as keyof typeof names] || typeBien.split(' ')[0];
};

// Helper function to check if a value exists and is not empty
const hasValue = (value: any): boolean => {
  return value && value !== 'N/A' && value !== '' && value !== null && value !== undefined;
};

// Helper function to format property details
const formatPropertyDetails = (rooms: any, surface: string, terrain?: string): string => {
  const details: string[] = [];

  if (hasValue(rooms)) {
    details.push(`Piece: ${rooms}`);
  }
  if (hasValue(surface)) {
    details.push(`Surface ${surface}`);
  }
  if (hasValue(terrain)) {
    details.push(`Terrain ${terrain}`);
  }

  return details.length > 0 ? details.join(', ') : '';
};

const getPropertyTypeColor = (propertyType: string) => {
  const colorMap = {
    Appartement: '#504CC5', // #504CC5 - Violet
    Maison: '#7A72D5', // #7A72D5 - Violet clair
    Terrain: '#4F96D6', // #4F96D6 - Bleu
    Local: '#205F9D', // #205F9D - Bleu foncé
    'Bien Multiple': '#022060', // #022060 - Bleu très foncé
  };
  const shortType = getShortTypeName(propertyType);
  return colorMap[shortType as keyof typeof colorMap] || '#9CA3AF';
};

// Helper function to format date to French format
const formatFrenchDate = (dateString: string) => {
  if (!dateString) return 'N/A';

  // Try to parse the date
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if parsing fails
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// --- REACT COMPONENT ---
const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered, // Use the prop from the parent
  isMapHovered = false, // **NEW**: Default to false
}) => {
  const { address, type, rooms, surface, soldDate, price, pricePerSqm, terrain } = property;

  // Formatting values for display
  const priceFormatted = Number(price?.replace(/[^0-9]/g, '')).toLocaleString('fr-FR') + ' €';
  const pricePerSqmFormatted = hasValue(pricePerSqm) ? pricePerSqm : '';

  // Format property details
  const propertyDetails = formatPropertyDetails(rooms, surface, terrain);

  return (
    <div
      style={{
        background: isMapHovered ? '#f0f9ff' : '#fff', // Light blue background when map hovered
        padding: 24,
        fontFamily: `'Maven Pro', sans-serif`,
        borderRadius: 16,
        cursor: 'default', // Changé de 'pointer' à 'default'
        // 2. STYLING IS NOW DRIVEN BY THE `isHovered` PROP OR `isMapHovered`
        boxShadow: isHovered || isMapHovered ? '0 4px 20px rgba(36,28,131,0.18)' : '0 2px 12px rgba(36,28,131,0.08)',
        border: isHovered || isMapHovered ? '2px solid #4F46E5' : '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        transition: 'box-shadow 0.2s, border 0.2s',
      }}
      onClick={onClick}
      // 3. PASS THROUGH THE PARENT'S EVENT HANDLERS
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Container */}
      <div style={{ width: '100%' }}>
        {/* Row: Left and Right columns */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {/* Left Column */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 140px)' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: '#1a1a1a',
                marginBottom: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {(address || '').toUpperCase()}
            </div>
            <div style={{ color: getPropertyTypeColor(type), fontWeight: 900, fontSize: 16 }}>{getShortTypeName(type)}</div>
          </div>

          {/* Right Column: Price */}
          <div
            style={{
              border: '1px solid #e5e7eb',
              padding: '10px 14px',
              borderRadius: 12,
              textAlign: 'right',
              minWidth: 110,
              flexShrink: 0,
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(112, 105, 249, 0.04)',
            }}
          >
            <div style={{ color: '#241c83', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{priceFormatted}</div>
            {pricePerSqmFormatted && <div style={{ color: '#1a1a1a', fontSize: 14 }}>{pricePerSqmFormatted}</div>}
          </div>
        </div>

        {/* Description: Characteristics */}
        {(hasValue(rooms) || hasValue(terrain) || hasValue(surface)) && (
          <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
            {hasValue(rooms) && <span style={{ color: 'rgba(12, 12, 12, 0.75)' }}>Pièce </span>}
            {hasValue(rooms) && (
              <span style={{ fontFamily: 'Maven Pro', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {rooms}
              </span>
            )}
            {hasValue(rooms) && (hasValue(surface) || hasValue(terrain)) && <span style={{ marginLeft: '12px' }}></span>}
            {hasValue(surface) && <span style={{ color: 'rgba(12, 12, 12, 0.75)' }}>Surface </span>}
            {hasValue(surface) && (
              <span style={{ fontFamily: 'Maven Pro', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {surface}
              </span>
            )}
            {hasValue(surface) && hasValue(terrain) && <span style={{ marginLeft: '12px' }}></span>}
            {hasValue(terrain) && <span style={{ color: 'rgba(12, 12, 12, 0.75)' }}>Terrain </span>}
            {hasValue(terrain) && (
              <span style={{ fontFamily: 'Maven Pro', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {terrain}
              </span>
            )}
          </div>
        )}

        {/* Sold Date */}
        <div
          style={{
            border: '1px solid #e5e7eb',
            padding: '10px 8px',
            borderRadius: 12,
            fontSize: 14,
            color: '#444',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            display: 'inline-block',
            width: 'fit-content',
          }}
        >
          Vendu le <strong style={{ color: '#000' }}>{formatFrenchDate(soldDate)}</strong>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
