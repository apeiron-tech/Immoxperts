export interface FilterState {
  propertyTypes: {
    maison: boolean;
    terrain: boolean;
    appartement: boolean;
    biensMultiples: boolean;
    localCommercial: boolean;
  };
  roomCounts: {
    studio: boolean;
    deuxPieces: boolean;
    troisPieces: boolean;
    quatrePieces: boolean;
    cinqPiecesPlus: boolean;
  };
  priceRange: [number, number];
  surfaceRange: [number, number];
  terrainRange: [number, number];
  pricePerSqmRange: [number, number];
  dateRange: [number, number];
}
