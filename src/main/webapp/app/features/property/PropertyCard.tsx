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
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { address, city, price, pricePerSqm, type, surface, rooms, soldDate } = property;
  // Helper to format the sold date in French style (DD/MM/YYYY)
  const formatFrenchDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Helper to get color for property type (advanced color map)
  const getPropertyTypeColor = (propertyType: string) => {
    const colorMap: Record<string, string> = {
      appartement: '#4F46E5',
      'local industriel commercial ou assimile': '#8B5CF6',
      terrain: '#60A5FA',
      'bien multiple': '#2563EB',
      maison: '#1E3A8A',
    };
    return colorMap[propertyType?.toLowerCase()?.trim()] || '#9CA3AF';
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
    <div className="bg-white rounded-xl shadow border p-2 cursor-pointer hover:shadow-lg transition-shadow">
      {/* Property Details */}
      <div className="flex items-start justify-between ">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {(address || '').toUpperCase()} – {city}
          </h2>
        </div>
        <div className="text-left text-top">
          <div className="text-x font-bold text-indigo-600">{price}</div>
          <div className="text-sm text-gray-500">{pricePerSqm}</div>
        </div>
      </div>

      {/* Grid Layout for Features */}
      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
        {/* Property Type, Rooms, Surface */}
        <div
          style={{
            fontSize: 15,
            width: '100%',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: getPropertyTypeColor(propertyTypeLabel), fontWeight: 900, fontSize: 15 }}>{propertyTypeLabel}</span>
          <span style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>
            {rooms} pièces - {surface || 'N/A'}
          </span>
        </div>

        {/* Price Box */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            border: '1px solid #e5e7eb',
            padding: '10px 14px',
            borderRadius: 12,
            textAlign: 'right',
            minWidth: 110,
            background: '#f8f8fc',
            boxShadow: '0 1px 4px rgba(36,28,131,0.04)',
          }}
        >
          <div style={{ color: '#241c83', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{priceFormatted}</div>
          <div style={{ color: '#888', fontSize: 14 }}>{pricePerSqmFormatted}</div>
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
    </div>
  );
};

export default PropertyCard;
// import React from 'react';
// import { FiHome, FiGrid } from 'react-icons/fi';
// import { FaBuilding, FaLayerGroup } from 'react-icons/fa';
// import logo from '../../content/assets/logo.png';

// interface Property {
//   address: string;
//   city: string;
//   price: string;
//   pricePerSqm: string;
//   type: string;
//   surface: string;
//   rooms: string | number;
//   soldDate: string;
// }

// interface PropertyCardProps {
//   property: Property;
//   onClick?: () => void;
// }

// const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
//   const { address, city, price, pricePerSqm, type, surface, rooms, soldDate } = property;

//   // Helper to format the sold date in French style (DD/MM/YYYY)
//   const formatFrenchDate = (dateString: string) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR');
//   };

//   // Helper to get color for property type (advanced color map)
//   const getPropertyTypeColor = (propertyType: string) => {
//     const colorMap: Record<string, string> = {
//       appartement: '#4F46E5',
//       'local industriel commercial ou assimile': '#8B5CF6',
//       terrain: '#60A5FA',
//       'bien multiple': '#2563EB',
//       maison: '#1E3A8A',
//     };
//     return colorMap[propertyType?.toLowerCase()?.trim()] || '#9CA3AF';
//   };

//   // Format property type label (capitalize each word)
//   const formatPropertyTypeLabel = (propertyType: string) => {
//     return propertyType
//       ?.toLowerCase()
//       ?.split(' ')
//       ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       ?.join(' ') || 'Type inconnu';
//   };

//   // Format price and price per sqm
//   const numericPrice = Number(price?.toString().replace(/[^\d]/g, ''));
//   const numericSurface = Number(surface?.toString().replace(/[^\d]/g, ''));
//   const priceFormatted = !isNaN(numericPrice) && numericPrice > 0 ? numericPrice.toLocaleString('fr-FR') + ' €' : price;
//   const pricePerSqmFormatted = !isNaN(numericPrice) && !isNaN(numericSurface) && numericSurface > 0
//     ? Math.round(numericPrice / numericSurface).toLocaleString('fr-FR') + ' €/m²'
//     : pricePerSqm || 'N/A';

//   const propertyTypeLabel = formatPropertyTypeLabel(type);

//   return (
//     <div
//       style={{
//         background: '#fff',
//         padding: 24,
//         fontFamily: `'Maven Pro', sans-serif`,
//         maxWidth: 480,
//         width: '100%',
//         position: 'relative',
//         borderRadius: 16,
//         cursor: onClick ? 'pointer' : undefined,
//         boxShadow: '0 2px 12px rgba(36,28,131,0.08)',
//         border: '1px solid #e5e7eb',
//         margin: 'auto',
//         boxSizing: 'border-box',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 18,
//         overflow: 'hidden',
//       }}
//       onClick={onClick}
//     >
//       {/* Address/Title */}
//       <div style={{
//         fontWeight: 800,
//         fontSize: 18,
//         width: '100%',
//         marginBottom: 0,
//         color: '#241c83',
//         letterSpacing: 0.5,
//         lineHeight: 1.2,
//         textShadow: '0 1px 0 #f3f3fa',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         whiteSpace: 'nowrap',
//       }}>
//         {(address || '').toUpperCase()} – {city}
//       </div>

//       {/* Property Type, Rooms, Surface */}
//       <div style={{
//         fontSize: 15,
//         width: '100%',
//         color: '#333',
//         display: 'flex',
//         alignItems: 'center',
//         gap: 12,
//         flexWrap: 'wrap',
//       }}>
//         <span style={{ color: getPropertyTypeColor(propertyTypeLabel), fontWeight: 900, fontSize: 15 }}>{propertyTypeLabel}</span>
//         <span style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>
//           {rooms || 'N/A'} pièces
//         </span>
//         <span style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>
//           {surface || 'N/A'} m²
//         </span>
//       </div>

//       {/* Price Box */}
//       <div
//         style={{
//           position: 'absolute',
//           top: 24,
//           right: 24,
//           border: '1px solid #e5e7eb',
//           padding: '10px 14px',
//           borderRadius: 12,
//           textAlign: 'right',
//           minWidth: 110,
//           background: '#f8f8fc',
//           boxShadow: '0 1px 4px rgba(36,28,131,0.04)',
//         }}
//       >
//         <div style={{ color: '#241c83', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{priceFormatted}</div>
//         <div style={{ color: '#888', fontSize: 14 }}>{pricePerSqmFormatted}</div>
//       </div>

//       {/* Sold Date */}
//       <div
//         style={{
//           marginTop: 8,
//           display: 'inline-block',
//           border: '1px solid #e5e7eb',
//           padding: '8px 14px',
//           borderRadius: 12,
//           fontSize: 14,
//           color: '#444',
//           background: '#fafbfc',
//           alignSelf: 'flex-start',
//         }}
//       >
//         Vendu le <strong style={{ color: '#000' }}>{formatFrenchDate(soldDate)}</strong>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;
