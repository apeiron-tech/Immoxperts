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
    <div className="md:hidden fixed bottom-0 z-20 w-full bg-white">
      <div className="text-sm relative font-sans">
        {/* Close Button */}
        <div className="md:hidden absolute -top-2 right-0">
          <div className="cursor-pointer flex items-center" onClick={onClose}>
            <svg
              className="rounded-full w-3 h-3 bg-gray-400/50 hover:bg-gray-600/50 text-white p-1"
              fill="currentColor"
              viewBox="0 0 384 512"
            >
              <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z" />
            </svg>
          </div>
        </div>

        {/* Property Content */}
        <div className="flex flex-col gap-2 p-3">
          <div className="flex justify-between gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex gap-1 align-top">
                <p className="text-gray-700 font-bold truncate">{property.address}</p>
              </div>
              <p className="flex items-center text-sm text-gray-400">
                <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M64 32C46.3 32 32 46.3 32 64V448c0 17.7 14.3 32 32 32h64V416c0-35.3 28.7-64 64-64s64 28.7 64 64v64h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H64zM224 416c0-17.7-14.3-32-32-32s-32 14.3-32 32v64h64V416zm-96 96H64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H256 224 160 128zM64 120c0-13.3 10.7-24 24-24h48c13.3 0 24 10.7 24 24v48c0 13.3-10.7 24-24 24H88c-13.3 0-24-10.7-24-24V120zm32 8v32h32V128H96zM248 96h48c13.3 0 24 10.7 24 24v48c0 13.3-10.7 24-24 24H248c-13.3 0-24-10.7-24-24V120c0-13.3 10.7-24 24-24zm8 64h32V128H256v32zM64 248c0-13.3 10.7-24 24-24h48c13.3 0 24 10.7 24 24v48c0 13.3-10.7 24-24 24H88c-13.3 0-24-10.7-24-24V248zm32 8v32h32V256H96zm152-32h48c13.3 0 24 10.7 24 24v48c0 13.3-10.7 24-24 24H248c-13.3 0-24-10.7-24-24V248c0-13.3 10.7-24 24-24zm8 64h32V256H256v32z" />
                </svg>
                <span>{property.type}</span>
              </p>
            </div>
            <div>
              <p className="text-blue-500 font-bold whitespace-nowrap">
                <span>{property.price}</span>
              </p>
              <p className="text-gray-400 text-xs text-right">
                <span>{property.pricePerSqm}</span>
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex gap-5">
            {/* Pièces - Only show if has value */}
            {property.rooms && property.rooms !== '' && property.rooms !== '0' && (
              <div>
                <p className="text-gray-400 text-xs">Pièces</p>
                <div className="flex items-center">
                  <svg className="mr-1 text-gray-400 text-sm w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M48 64c-8.8 0-16 7.2-16 16V240c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H48zM0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48V240c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM304 256c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H304zm-48 16c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V272zM144 352H48c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16zM48 320h96c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48zM304 64c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H304zM256 80c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80z" />
                  </svg>
                  <span className="font-semibold text-gray-700 text-sm">{property.rooms}</span>
                  <span className="ml-0.5 text-gray-400 text-xs"></span>
                </div>
              </div>
            )}

            {/* Surface - Only show if has value */}
            {property.surface && property.surface !== '' && property.surface !== '0 m²' && (
              <div>
                <p className="text-gray-400 text-xs">Surface</p>
                <div className="flex items-center">
                  <svg className="mr-1 text-gray-400 text-sm w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M192 192V128l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l64 0 0-32c0-17.7-14.3-32-32-32L64 32C46.3 32 32 46.3 32 64l0 288 0 96c0 1.1 .1 2.2 .2 3.3C33.8 467.4 47.5 480 64 480h96l288 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32H416v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V320H320v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V320H224v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V320H128c-8.8 0-16-7.2-16-16s7.2-16 16-16h64V224l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16h64zm64 96H448c35.3 0 64 28.7 64 64v96c0 35.3-28.7 64-64 64l-288 0H64C30.9 512 3.6 486.8 .3 454.5c-.2-2.2-.3-4.3-.3-6.5V352 64C0 28.7 28.7 0 64 0h96c35.3 0 64 28.7 64 64l0 192v32h32z" />
                  </svg>
                  <span className="font-semibold text-gray-700 text-sm">{property.surface.replace('m²', '')}</span>
                  <span className="ml-0.5 text-gray-400 text-xs">m²</span>
                </div>
              </div>
            )}

            {/* Terrain - Only show if has value */}
            {property.terrain && property.terrain !== '' && property.terrain !== '0 m²' && (
              <div>
                <p className="text-gray-400 text-xs">Terrain</p>
                <div className="flex items-center">
                  <svg className="mr-1 text-gray-400 text-sm w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M64 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm0-96c29.8 0 54.9 20.4 62 48H322c7.1-27.6 32.2-48 62-48c35.3 0 64 28.7 64 64c0 29.8-20.4 54.9-48 62V354c27.6 7.1 48 32.2 48 62c0 35.3-28.7 64-64 64c-29.8 0-54.9-20.4-62-48H126c-7.1 27.6-32.2 48-62 48c-35.3 0-64-28.7-64-64c0-29.8 20.4-54.9 48-62V158C20.4 150.9 0 125.8 0 96C0 60.7 28.7 32 64 32zm62 368H322c5.8-22.5 23.5-40.2 46-46V158c-22.5-5.8-40.2-23.5-46-46H126c-5.8 22.5-23.5 40.2-46 46V354c22.5 5.8 40.2 23.5 46 46zM96 416a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm256 0a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm32-288a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
                  </svg>
                  <span className="font-semibold text-gray-700 text-sm">{property.terrain.replace('m²', '')}</span>
                  <span className="ml-0.5 text-gray-400 text-xs">m²</span>
                </div>
              </div>
            )}

            {/* Vendu le - Always show */}
            <div>
              <p className="text-gray-400 text-xs">Vendu le</p>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 text-sm">{property.soldDate}</span>
                <span className="ml-0.5 text-gray-400 text-xs"></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-1">
            <div>
              <button
                type="button"
                className="whitespace-nowrap border shadow-sm focus:outline-none disabled:cursor-not-allowed duration-300 text-center relative justify-between text-xs font-medium rounded px-2 py-1.5 bg-white hover:bg-gray-50 text-gray-600 disabled:bg-gray-50 disabled:text-gray-300"
              >
                + Détails
              </button>
            </div>
            <button className="whitespace-nowrap border shadow-sm focus:outline-none disabled:cursor-not-allowed duration-300 text-center relative justify-between text-xs font-medium rounded px-2 py-1.5 text-white border-transparent bg-blue-500 hover:bg-blue-600 disabled:bg-blue-200 inline-block">
              Analyser ce bien
            </button>
          </div>
        </div>

        {/* Navigation Footer */}
        {totalCount > 1 && (
          <div className="flex justify-center gap-8 text-base p-2 bg-gray-50 border-t border-t-gray-200">
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
