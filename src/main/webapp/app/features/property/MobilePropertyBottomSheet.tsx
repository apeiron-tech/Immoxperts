import React from 'react';

interface PropertyData {
  address: string;
  city: string;
  price: string;
  pricePerSqm: string;
  type: string;
  rooms: string | number;
  surface: string;
  terrain: string;
  soldDate: string;
}

interface MobilePropertyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyData | null;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

const MobilePropertyBottomSheet: React.FC<MobilePropertyBottomSheetProps> = ({
  isOpen,
  onClose,
  property,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
}) => {
  if (!isOpen || !property) return null;

  return (
    <div className="md:hidden fixed bottom-0 z-[9500] w-full bg-white shadow-2xl">
      <div className="relative" style={{ fontFamily: "'Maven Pro', sans-serif", padding: '16px 0px 0px 0px' }}>
        {/* Close Button */}
        <div className="absolute -top-2 right-2">
          <div className="cursor-pointer flex items-center" onClick={onClose}>
            <svg
              className="rounded-full w-8 h-8 bg-gray-400/50 hover:bg-gray-600/50 text-white p-2"
              fill="currentColor"
              viewBox="0 0 384 512"
            >
              <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z" />
            </svg>
          </div>
        </div>

        {/* Main Content - Desktop Hover Popup Style */}
        <div className="flex flex-col gap-3">
          {/* Address, Type, Rooms and Price on same line */}
          <div className="flex justify-between items-start gap-4">
            {/* Left side - Address, Type, Rooms */}
            <div style={{ flex: '1', padding: '0px 16px 16px 16px' }}>
              {/* Address */}
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a', marginBottom: '4px' }}>
                {property.address.toUpperCase()}
              </div>

              {/* Type, Rooms, Surface, Terrain */}
              <div style={{ fontSize: '14px', color: '#333' }}>
                <span style={{ color: '#241c83', fontWeight: '900' }}>{property.type}</span>
                {property.rooms && property.rooms !== '' && property.rooms !== '0' && (
                  <span style={{ marginLeft: '8px', color: '#666' }}>• {property.rooms} pièces</span>
                )}
                {property.surface && property.surface !== '' && property.surface !== '0 m²' && (
                  <span style={{ marginLeft: '8px', color: '#666' }}>• surface {property.surface}</span>
                )}
                {property.terrain && property.terrain !== '' && property.terrain !== '0 m²' && (
                  <span style={{ marginLeft: '8px', color: '#666' }}>• Terrain {property.terrain.replace('m²', '')} m²</span>
                )}
              </div>

              {/* Sold Date - Desktop Style */}
              <div
                style={{
                  marginTop: '16px',
                  display: 'inline-block',
                  border: '1px solid #e5e7eb',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#444',
                }}
              >
                Vendu le <strong style={{ color: '#000' }}>{property.soldDate}</strong>
              </div>
            </div>

            {/* Price Box - Desktop Style */}
            <div
              style={{
                border: '1px solid #e5e7eb',
                padding: '10px 14px',
                borderRadius: '12px',
                textAlign: 'right',
                minWidth: '110px',
                flexShrink: 0,
              }}
            >
              <div style={{ color: '#241c83', fontWeight: '800', fontSize: '18px' }}>{property.price}</div>
              <div style={{ color: '#888', fontSize: '14px' }}>{property.pricePerSqm}</div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        {totalCount > 1 && (
          <div className="flex justify-center gap-8 text-base py-1 px-2 bg-gray-50 border-t border-t-gray-200">
            <button
              disabled={currentIndex === 0}
              onClick={onPrevious}
              className="cursor-pointer w-6 text-center disabled:cursor-not-allowed"
            >
              <svg
                className={`w-4 h-4 ${currentIndex === 0 ? 'text-gray-400' : 'text-blue-500'}`}
                fill="currentColor"
                viewBox="0 0 320 512"
              >
                <path d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z" />
              </svg>
            </button>
            <p className="text-blue-500">
              {currentIndex + 1}/{totalCount}
            </p>
            <button
              disabled={currentIndex === totalCount - 1}
              onClick={onNext}
              className="cursor-pointer w-6 text-center disabled:cursor-not-allowed"
            >
              <svg
                className={`w-4 h-4 ${currentIndex === totalCount - 1 ? 'text-gray-400' : 'text-blue-500'}`}
                fill="currentColor"
                viewBox="0 0 320 512"
              >
                <path d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePropertyBottomSheet;
