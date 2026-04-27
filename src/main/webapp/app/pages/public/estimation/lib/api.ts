import type { BanAddress } from 'app/shared/AddressAutocomplete';

export type Confidence = 'high' | 'medium' | 'low';

export type EstimationRequest = {
  address: BanAddress;
  propertyType: 'appartement' | 'maison';
  surface: number;
  rooms: number;
  condition: 'neuf' | 'bon' | 'a-rafraichir' | 'a-renover';
};

export type EstimationResult = {
  estimationId?: string;
  priceLow: number;
  priceHigh: number;
  pricePerSqmLow: number;
  pricePerSqmHigh: number;
  confidence: Confidence;
  comparableCount: number;
  radiusMeters: number;
  sampleWindowMonths: number;
  methodology: string;
};

export type EstimationApiError = {
  error: 'insufficient_data' | 'rate_limited' | 'server_error';
  message: string;
};

export async function postEstimation(payload: EstimationRequest): Promise<EstimationResult> {
  const res = await fetch('/api/public/estimation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 422) {
    const body = (await res.json().catch(() => null)) as EstimationApiError | null;
    throw Object.assign(new Error('insufficient_data'), { kind: 'insufficient_data', message: body?.message ?? '' });
  }
  if (!res.ok) {
    throw Object.assign(new Error('server_error'), { kind: 'server_error' });
  }
  return res.json() as Promise<EstimationResult>;
}

export type EstimationLeadPayload = {
  estimationId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  consent: boolean;
};

export async function postEstimationLead(payload: EstimationLeadPayload): Promise<void> {
  const res = await fetch('/api/public/estimation/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('lead_failed');
}
