import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SimulatorInput } from '../lib/calcInvest';

const SCHEMA_VERSION = 1;

type Encoded = { v: number; s: SimulatorInput };

function toBase64Url(s: string): string {
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return decodeURIComponent(escape(atob(b64 + pad)));
}

export function encodeState(state: SimulatorInput): string {
  const payload: Encoded = { v: SCHEMA_VERSION, s: state };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeState(token: string): SimulatorInput | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Encoded;
    if (!parsed || parsed.v !== SCHEMA_VERSION || !parsed.s) return null;
    return parsed.s;
  } catch {
    return null;
  }
}

export function useUrlSync(state: SimulatorInput, replaceAll: (next: SimulatorInput) => void) {
  const location = useLocation();
  const navigate = useNavigate();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    const params = new URLSearchParams(location.search);
    const token = params.get('s');
    if (token) {
      const decoded = decodeState(token);
      if (decoded) replaceAll(decoded);
    }
    hydrated.current = true;
  }, []);

  const buildShareUrl = () => {
    const token = encodeState(state);
    const url = new URL(window.location.href);
    url.searchParams.set('s', token);
    return url.toString();
  };

  // utilitaire optionnel : pousser le token courant en URL sans recharger.
  const writeToUrl = () => {
    const token = encodeState(state);
    const params = new URLSearchParams(location.search);
    params.set('s', token);
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  };

  return { buildShareUrl, writeToUrl };
}
