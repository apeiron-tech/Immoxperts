export interface Property {
  id: string;
  address: string;
  city: string;
  price: string;
  surface: string;
  type: string;
  soldDate: string;
  pricePerSqm: string;
}

export const properties: Property[] = [
  {
    id: '1',
    address: '123 Rue de Paris',
    city: 'Paris',
    price: '450 000 €',
    surface: '85 m²',
    type: 'Appartement',
    soldDate: '15/03/2024',
    pricePerSqm: '5 294 €/m²',
  },
  {
    id: '2',
    address: '45 Avenue des Champs-Élysées',
    city: 'Paris',
    price: '1 200 000 €',
    surface: '120 m²',
    type: 'Appartement',
    soldDate: '10/03/2024',
    pricePerSqm: '10 000 €/m²',
  },
];
