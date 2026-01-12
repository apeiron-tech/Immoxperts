import React from 'react';
import { FiHome, FiGrid } from 'react-icons/fi';
import { FaBuilding, FaLayerGroup } from 'react-icons/fa';

interface Property {
  id: number;
  address: string;
  city: string;
  numericPrice: number;
  numericSurface: number;
  price: string;
  pricePerSqm: string;
  type: string;
  surface: string;
  rooms: string | number;
  soldDate: string;
  terrain?: string; // Add terrain attribute
  rawData: {
    terrain: any;
    mutationType: string;
    department: string;
  };
}

interface PropertyCardClickProps {
  property: Property;
  onClick?: () => void;
  compact?: boolean;
}

const PropertyCardClick: React.FC<PropertyCardClickProps> = ({ property, onClick, compact }) => {
  const { address, city, price, pricePerSqm, type, surface, rooms, soldDate, terrain } = property;

  // Helper functions (same as in hover popup)
  const getPropertyTypeColor = (propertyType: string) => {
    // First normalize the type name
    const shortType = getShortTypeName(propertyType);

    const colors: { [key: string]: string } = {
      Appartement: '#504CC5', // #504CC5 - Violet
      Maison: '#7A72D5', // #7A72D5 - Violet clair
      Terrain: '#4F96D6', // #4F96D6 - Bleu
      Local: '#205F9D', // #205F9D - Bleu foncé
      'Bien Multiple': '#022060', // #022060 - Bleu très foncé
    };

    return colors[shortType] || '#9CA3AF';
  };

  const getShortTypeName = (propertyType: string) => {
    const shortNames: { [key: string]: string } = {
      'Local Commercial': 'Local',
      'Bien Multiple': 'Bien Multiple',
      Maison: 'Maison',
      Appartement: 'Appartement',
      Terrain: 'Terrain',
      // Legacy names for backward compatibility
      'Local industriel. commercial ou assimilé': 'Local',
    };
    return shortNames[propertyType] || propertyType;
  };

  const formatFrenchDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    // Handle different date formats
    let date: Date;

    // If it's already in DD/MM/YYYY format, parse it correctly
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    } else {
      // Try to parse as ISO date or other formats
      date = new Date(dateString);
    }

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

  // Build the details string, only showing non-zero values
  const details = [];
  if (rooms && rooms !== '' && rooms !== '0')
    details.push(
      `<span style="color: rgba(12, 12, 12, 0.75);">Pièces </span><span style="font-family: Inter; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${rooms}</span>`,
    );
  if (surface && surface !== '' && surface !== '0 m²')
    details.push(
      `<span style="color: rgba(12, 12, 12, 0.75);">Surface </span><span style="font-family: Inter; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${surface}</span>`,
    );
  if (terrain && terrain !== '' && terrain !== '0 m²')
    details.push(
      `<span style="color: rgba(12, 12, 12, 0.75);">Terrain </span><span style="font-family: Inter; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${terrain}</span>`,
    );

  const detailsText = details.length > 0 ? details.join('<span style="margin-left: 12px;"></span>') : '';

  return (
    <div
      style={{
        background: '#fff',
        padding: '1px',
        fontFamily: "'Inter', sans-serif",
        maxWidth: '450px',
        width: '100%',
        position: 'relative',
        borderRadius: '16px',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* Address */}
      <div
        style={{
          fontWeight: 700,
          fontSize: '16px',
          width: '75%',
          marginBottom: '10px',
          color: '#1a1a1a',
        }}
      >
        {address.toUpperCase()}, <span style={{ fontSize: '12px', color: '#6b7280' }}>{city}</span>
      </div>

      {/* Property Type */}
      <div style={{ color: getPropertyTypeColor(type), fontWeight: 900, fontSize: 16, marginBottom: 10 }}>{getShortTypeName(type)}</div>

      {/* Characteristics: pieces, terrain, surface */}
      {detailsText && <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: detailsText }} />}

      {/* Price Box */}
      <div
        style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          border: '1px solid #e5e7eb',
          padding: '10px 14px',
          borderRadius: '12px',
          textAlign: 'right',
          minWidth: '110px',
          backgroundColor: 'rgba(112, 105, 249, 0.04)',
        }}
      >
        <div
          style={{
            color: '#241c83',
            fontWeight: 800,
            fontSize: '18px',
          }}
        >
          {price}
        </div>
        <div
          style={{
            color: '#888',
            fontSize: '14px',
          }}
        >
          {pricePerSqm}
        </div>
      </div>

      {/* Sold Date */}
      <div
        style={{
          marginTop: '8px',
          display: 'inline-block',
          border: '1px solid #e5e7eb',
          padding: '10px 8px',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#444',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }}
      >
        Vendu le <strong style={{ color: '#000' }}>{formatFrenchDate(soldDate)}</strong>
      </div>
    </div>
  );
};

export default PropertyCardClick;
