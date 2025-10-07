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
    const colors: { [key: string]: string } = {
      Appartement: '#6929CF',
      Maison: '#121852',
      Terrain: '#2971CF',
      Local: '#862CC7',
      'Bien Multiple': '#381EB0',
    };
    const shortType = getShortTypeName(propertyType);
    return colors[shortType] || '#9CA3AF';
  };

  const getShortTypeName = (propertyType: string) => {
    const shortNames: { [key: string]: string } = {
      Appartement: 'Appartement',
      Maison: 'Maison',
      Terrain: 'Terrain',
      'Local Commercial': 'Local',
      'Bien Multiple': 'Bien Multiple',
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
  if (rooms && rooms !== '' && rooms !== '0') details.push(`pieces: ${rooms}`);
  if (terrain && terrain !== '' && terrain !== '0 m²') details.push(`Terrain ${terrain}`);
  if (surface && surface !== '' && surface !== '0 m²') details.push(`surface ${surface}`);

  const detailsText = details.length > 0 ? details.join(', ') : '';

  return (
    <div
      style={{
        background: '#fff',
        padding: '1px',
        fontFamily: "'Maven Pro', sans-serif",
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
      {detailsText && <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>{detailsText}</div>}

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
        }}
      >
        Vendu le <strong style={{ color: '#000' }}>{formatFrenchDate(soldDate)}</strong>
      </div>
    </div>
  );
};

export default PropertyCardClick;
