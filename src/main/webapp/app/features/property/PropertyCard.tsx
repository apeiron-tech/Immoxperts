import React from 'react';

interface Property {
  address: string;
  city: string;
  price: string;
  pricePerSqm: string;
  type: string;
  surface: string;
  rooms: string | number;
  soldDate: string;
  terrain?: string;
}

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
  isMapHovered?: boolean;
}

const getShortTypeName = (typeBien: string) => {
  const names: Record<string, string> = {
    'Local Commercial': 'Local',
    'Bien Multiple': 'Bien Multiple',
    Maison: 'Maison',
    Appartement: 'Appartement',
    Terrain: 'Terrain',
    'Local industriel. commercial ou assimilé': 'Local',
  };
  return names[typeBien] || typeBien;
};

const hasValue = (value: any): boolean =>
  value && value !== 'N/A' && value !== '' && value !== null && value !== undefined;

const getPropertyTypeColor = (propertyType: string) => {
  const shortType = getShortTypeName(propertyType);
  const colorMap: Record<string, string> = {
    Appartement: '#504CC5',
    Maison: '#7A72D5',
    Terrain: '#4F96D6',
    Local: '#205F9D',
    'Bien Multiple': '#022060',
  };
  return colorMap[shortType] || '#9CA3AF';
};

const formatFrenchDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  isMapHovered = false,
}) => {
  const { address, type, rooms, surface, soldDate, price, pricePerSqm, terrain } = property;
  const priceFormatted = Number(price?.replace(/[^0-9]/g, '')).toLocaleString('fr-FR') + ' ?';
  const pricePerSqmFormatted = hasValue(pricePerSqm) ? pricePerSqm : '';

  return (
    <div
      style={{
        background: isMapHovered ? '#f0f9ff' : '#fff',
        padding: 24,
        fontFamily: `'Inter', sans-serif`,
        borderRadius: 16,
        cursor: 'default',
        boxShadow: isHovered || isMapHovered ? '0 4px 20px rgba(36,28,131,0.18)' : '0 2px 12px rgba(36,28,131,0.08)',
        border: isHovered || isMapHovered ? '2px solid #4F46E5' : '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        transition: 'box-shadow 0.2s, border 0.2s',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 140px)' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: '#1a1a1a',
                paddingTop: '8px',
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

        {(hasValue(rooms) || hasValue(terrain) || hasValue(surface)) && (
          <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
            {hasValue(rooms) && <span style={{ color: 'rgba(12, 12, 12, 0.75)' }}>Pièce </span>}
            {hasValue(rooms) && (
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {rooms}
              </span>
            )}
            {hasValue(rooms) && (hasValue(surface) || hasValue(terrain)) && <span style={{ marginLeft: '12px' }}></span>}
            {hasValue(surface) && <span style={{ color: 'rgba(12, 12, 12, 0.75)' }}>Surface </span>}
            {hasValue(surface) && (
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {surface}
              </span>
            )}
            {hasValue(surface) && hasValue(terrain) && <span style={{ marginLeft: '12px' }}></span>}
            {hasValue(terrain) && <span style={{ color: 'rgba(12, 12, 12, 0.75)' }}>Terrain </span>}
            {hasValue(terrain) && (
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%' }}>
                {terrain}
              </span>
            )}
          </div>
        )}

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
