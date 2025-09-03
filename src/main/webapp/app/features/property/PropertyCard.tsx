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
    details.push(`${rooms} pièces`);
  }

  if (hasValue(surface)) {
    details.push(surface);
  }

  if (hasValue(terrain)) {
    details.push(`Terrain: ${terrain}`);
  }

  return details.length > 0 ? details.join(' - ') : '';
};

const getPropertyTypeColor = (propertyType: string) => {
  const colorMap = {
    Appartement: '#6929CF',
    Maison: '#121852',
    Terrain: '#2971CF',
    Local: '#862CC7',
    'Bien Multiple': '#381EB0',
  };
  const shortType = getShortTypeName(propertyType);
  return colorMap[shortType as keyof typeof colorMap] || '#9CA3AF';
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
        cursor: 'pointer',
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
      {/* LEFT COLUMN */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {(address || '').toUpperCase()}
        </div>
        <div style={{ fontSize: 15, color: '#333', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <span style={{ color: getPropertyTypeColor(type), fontWeight: 900, fontSize: 15 }}>{getShortTypeName(type)}</span>
          {propertyDetails && <span style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>{propertyDetails}</span>}
        </div>
        <div
          style={{
            marginTop: 8,
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
          flexShrink: 0,
          alignSelf: 'flex-start',
        }}
      >
        <div style={{ color: '#241c83', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{priceFormatted}</div>
        {pricePerSqmFormatted && <div style={{ color: '#888', fontSize: 14 }}>{pricePerSqmFormatted}</div>}
      </div>
    </div>
  );
};

export default PropertyCard;
