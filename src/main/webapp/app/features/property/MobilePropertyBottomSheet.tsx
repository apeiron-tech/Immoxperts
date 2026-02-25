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
  noMutation?: boolean;
  noMutationMessage?: string;
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
      <div className="relative" style={{ fontFamily: "'Inter', sans-serif", padding: '16px 0px 0px 0px' }}>
        {/* Close Button */}
        <div className="absolute -top-4 right-2">
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
          {/* Address and Price on same line */}
          <div className="flex justify-between items-start gap-2 pr-2">
            {/* Left side - Address and Property Type */}
            <div style={{ flex: '1', minWidth: 0, maxWidth: 'calc(100% - 120px)', padding: '0px 16px 0px 16px' }}>
              {/* Address */}
              <div
                className="pt-2"
                style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  color: '#1a1a1a',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {property.address.toUpperCase()}
              </div>

              {/* Property Type */}
              {!property.noMutation && <div style={{ color: '#241c83', fontWeight: '900', fontSize: '16px' }}>{property.type}</div>}
            </div>

            {/* Price Box - Desktop Style (hide for no-mutation addresses) */}
            {!property.noMutation && (
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  padding: '6px 10px',
                  borderRadius: '12px',
                  textAlign: 'right',
                  minWidth: '110px',
                  flexShrink: 0,
                  backgroundColor: 'rgba(112, 105, 249, 0.04)',
                }}
              >
                <div style={{ color: '#241c83', fontWeight: '800', fontSize: '18px' }}>{property.price}</div>
                <div style={{ color: '#888', fontSize: '14px' }}>{property.pricePerSqm}</div>
              </div>
            )}
          </div>

          {/* Characteristics and Sold Date */}
          <div style={{ padding: '0px 16px 16px 16px' }}>
            {/* Characteristics: pieces, terrain, surface */}
            {!property.noMutation &&
              (() => {
                const eAcute = '&#' + String.fromCharCode(50, 51, 50) + ';';
                const pieceLabel = 'Pi' + eAcute + 'ce ';
                const details = [];
                if (property.rooms && property.rooms !== '' && property.rooms !== '0') {
                  details.push(
                    `<span style="color: rgba(12, 12, 12, 0.75);">${pieceLabel}</span><span style="font-family: Inter; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${property.rooms}</span>`,
                  );
                }
                if (property.surface && property.surface !== '' && property.surface !== '0 m²') {
                  details.push(
                    `<span style="color: rgba(12, 12, 12, 0.75);">Surface </span><span style="font-family: Inter; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${property.surface}</span>`,
                  );
                }
                if (property.terrain && property.terrain !== '' && property.terrain !== '0 m²') {
                  details.push(
                    `<span style="color: rgba(12, 12, 12, 0.75);">Terrain </span><span style="font-family: Inter; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${property.terrain}</span>`,
                  );
                }
                const detailsText = details.length > 0 ? details.join('<span style="margin-left: 12px;"></span>') : '';
                return detailsText ? (
                  <div style={{ fontSize: '16px', color: '#333', marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: detailsText }} />
                ) : null;
              })()}

            {/* Sold Date - Desktop Style */}
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
              {property.noMutation ? (
                <span style={{ color: '#6b7280', fontWeight: 600 }}>
                  {property.noMutationMessage || 'Aucune vente identifiée à cette adresse'}
                </span>
              ) : (
                <>
                  Vendu le <strong style={{ color: '#000' }}>{property.soldDate}</strong>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        {totalCount > 1 && (
          <div className="flex justify-center gap-2 text-base py-1 px-2 bg-gray-50 border-t border-t-gray-200">
            <button
              disabled={currentIndex === 0}
              onClick={onPrevious}
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: currentIndex === 0 ? '#f9fafb' : 'white',
                color: currentIndex === 0 ? '#9ca3af' : '#666',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => {
                if (currentIndex !== 0) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={e => {
                if (currentIndex !== 0) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 320 512">
                <path d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z" />
              </svg>
            </button>
            <span
              style={{
                fontSize: '14px',
                color: '#3b82f6',
                fontWeight: 500,
                padding: '0 12px',
                fontFamily: 'Inter',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {currentIndex + 1}/{totalCount}
            </span>
            <button
              disabled={currentIndex === totalCount - 1}
              onClick={onNext}
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: currentIndex === totalCount - 1 ? '#f9fafb' : 'white',
                color: currentIndex === totalCount - 1 ? '#9ca3af' : '#666',
                cursor: currentIndex === totalCount - 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => {
                if (currentIndex !== totalCount - 1) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={e => {
                if (currentIndex !== totalCount - 1) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 320 512">
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
