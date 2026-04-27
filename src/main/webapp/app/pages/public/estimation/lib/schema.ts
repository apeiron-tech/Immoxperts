import type { BanAddress } from 'app/shared/AddressAutocomplete';
import type { EstimationRequest } from './api';

export type EstimationFormValues = {
  address: BanAddress | null;
  propertyType: EstimationRequest['propertyType'];
  surface: number | string;
  rooms: number | string;
  condition: EstimationRequest['condition'];
};

export type EstimationFormErrors = Partial<Record<keyof EstimationFormValues, string>>;

export const CONDITIONS: { value: EstimationRequest['condition']; label: string }[] = [
  { value: 'neuf', label: 'Neuf ou récent' },
  { value: 'bon', label: 'Bon état' },
  { value: 'a-rafraichir', label: 'À rafraîchir' },
  { value: 'a-renover', label: 'À rénover' },
];

export const ROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '6+'] as const;

export function validateEstimation(values: EstimationFormValues): EstimationFormErrors {
  const errors: EstimationFormErrors = {};
  if (!values.address) errors.address = 'Sélectionnez une adresse dans la liste.';
  if (values.propertyType !== 'appartement' && values.propertyType !== 'maison') errors.propertyType = 'Choisissez un type de bien.';
  const surface = Number(values.surface);
  if (!Number.isFinite(surface) || surface < 9 || surface > 1000) errors.surface = 'Surface entre 9 et 1000 m².';
  const rooms = String(values.rooms);
  if (!ROOM_OPTIONS.includes(rooms as (typeof ROOM_OPTIONS)[number])) errors.rooms = 'Nombre de pièces requis.';
  if (!CONDITIONS.find(c => c.value === values.condition)) errors.condition = "État requis.";
  return errors;
}

export function toApiRequest(values: EstimationFormValues): EstimationRequest {
  if (!values.address) throw new Error('address_required');
  return {
    address: values.address,
    propertyType: values.propertyType,
    surface: Number(values.surface),
    rooms: values.rooms === '6+' ? 6 : Number(values.rooms),
    condition: values.condition,
  };
}
