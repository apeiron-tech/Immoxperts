export type ZonePinel = 'A_bis' | 'A' | 'B1' | 'B2' | 'C';

export interface EncadrementLoyers {
  zone_tendue: true;
  commune: string;
  loyer_reference_m2: number;
  loyer_minore_m2: number;
  loyer_majore_m2: number;
}

export interface ReglementationsData {
  adresse: string;
  code_postal: string;
  ville: string;
  encadrement: EncadrementLoyers | { zone_tendue: false };
  permis_louer: boolean;
  pinel: { zone: ZonePinel; plafond_m2: number | null } | null;
  logement_decent: {
    surface_ok: boolean;
    dpe_ok: boolean;
    equipements_ok: boolean;
  };
}

// Mock arrêtés préfectoraux — valeurs plausibles (€/m² charges comprises)
const ENCADREMENT_PAR_CP: Record<string, Omit<EncadrementLoyers, 'zone_tendue' | 'commune'> & { commune: string }> = {
  // Paris — valeurs 2024 simplifiées, ordre de grandeur réaliste
  '75001': { commune: 'Paris', loyer_reference_m2: 29.1, loyer_minore_m2: 23.3, loyer_majore_m2: 34.9 },
  '75002': { commune: 'Paris', loyer_reference_m2: 28.5, loyer_minore_m2: 22.8, loyer_majore_m2: 34.2 },
  '75003': { commune: 'Paris', loyer_reference_m2: 28.0, loyer_minore_m2: 22.4, loyer_majore_m2: 33.6 },
  '75004': { commune: 'Paris', loyer_reference_m2: 28.8, loyer_minore_m2: 23.0, loyer_majore_m2: 34.6 },
  '75005': { commune: 'Paris', loyer_reference_m2: 27.6, loyer_minore_m2: 22.1, loyer_majore_m2: 33.1 },
  '75006': { commune: 'Paris', loyer_reference_m2: 29.7, loyer_minore_m2: 23.8, loyer_majore_m2: 35.6 },
  '75007': { commune: 'Paris', loyer_reference_m2: 29.0, loyer_minore_m2: 23.2, loyer_majore_m2: 34.8 },
  '75008': { commune: 'Paris', loyer_reference_m2: 28.3, loyer_minore_m2: 22.6, loyer_majore_m2: 34.0 },
  '75009': { commune: 'Paris', loyer_reference_m2: 26.9, loyer_minore_m2: 21.5, loyer_majore_m2: 32.3 },
  '75010': { commune: 'Paris', loyer_reference_m2: 25.1, loyer_minore_m2: 20.1, loyer_majore_m2: 30.1 },
  '75011': { commune: 'Paris', loyer_reference_m2: 26.2, loyer_minore_m2: 21.0, loyer_majore_m2: 31.4 },
  '75012': { commune: 'Paris', loyer_reference_m2: 25.0, loyer_minore_m2: 20.0, loyer_majore_m2: 30.0 },
  '75013': { commune: 'Paris', loyer_reference_m2: 24.8, loyer_minore_m2: 19.8, loyer_majore_m2: 29.8 },
  '75014': { commune: 'Paris', loyer_reference_m2: 26.1, loyer_minore_m2: 20.9, loyer_majore_m2: 31.3 },
  '75015': { commune: 'Paris', loyer_reference_m2: 26.4, loyer_minore_m2: 21.1, loyer_majore_m2: 31.7 },
  '75016': { commune: 'Paris', loyer_reference_m2: 27.9, loyer_minore_m2: 22.3, loyer_majore_m2: 33.5 },
  '75017': { commune: 'Paris', loyer_reference_m2: 26.7, loyer_minore_m2: 21.4, loyer_majore_m2: 32.0 },
  '75018': { commune: 'Paris', loyer_reference_m2: 24.2, loyer_minore_m2: 19.4, loyer_majore_m2: 29.0 },
  '75019': { commune: 'Paris', loyer_reference_m2: 22.9, loyer_minore_m2: 18.3, loyer_majore_m2: 27.5 },
  '75020': { commune: 'Paris', loyer_reference_m2: 24.0, loyer_minore_m2: 19.2, loyer_majore_m2: 28.8 },
  // Lille (59000)
  '59000': { commune: 'Lille', loyer_reference_m2: 13.8, loyer_minore_m2: 11.0, loyer_majore_m2: 16.6 },
  '59800': { commune: 'Lille', loyer_reference_m2: 13.5, loyer_minore_m2: 10.8, loyer_majore_m2: 16.2 },
  // Lyon (69001-69009) — encadrement actif depuis 2021
  '69001': { commune: 'Lyon', loyer_reference_m2: 14.2, loyer_minore_m2: 11.4, loyer_majore_m2: 17.0 },
  '69002': { commune: 'Lyon', loyer_reference_m2: 14.5, loyer_minore_m2: 11.6, loyer_majore_m2: 17.4 },
  '69003': { commune: 'Lyon', loyer_reference_m2: 14.0, loyer_minore_m2: 11.2, loyer_majore_m2: 16.8 },
  '69004': { commune: 'Lyon', loyer_reference_m2: 13.8, loyer_minore_m2: 11.0, loyer_majore_m2: 16.6 },
  '69005': { commune: 'Lyon', loyer_reference_m2: 13.5, loyer_minore_m2: 10.8, loyer_majore_m2: 16.2 },
  '69006': { commune: 'Lyon', loyer_reference_m2: 14.8, loyer_minore_m2: 11.8, loyer_majore_m2: 17.8 },
  '69007': { commune: 'Lyon', loyer_reference_m2: 13.6, loyer_minore_m2: 10.9, loyer_majore_m2: 16.3 },
  '69008': { commune: 'Lyon', loyer_reference_m2: 13.4, loyer_minore_m2: 10.7, loyer_majore_m2: 16.1 },
  '69009': { commune: 'Lyon', loyer_reference_m2: 13.2, loyer_minore_m2: 10.6, loyer_majore_m2: 15.8 },
  // Bordeaux (33000, 33300)
  '33000': { commune: 'Bordeaux', loyer_reference_m2: 13.6, loyer_minore_m2: 10.9, loyer_majore_m2: 16.3 },
  '33300': { commune: 'Bordeaux', loyer_reference_m2: 13.2, loyer_minore_m2: 10.6, loyer_majore_m2: 15.8 },
  '33200': { commune: 'Bordeaux', loyer_reference_m2: 13.0, loyer_minore_m2: 10.4, loyer_majore_m2: 15.6 },
};

// Permis de louer — mock, quelques communes ALUR
const PERMIS_LOUER_CP = new Set<string>(['93100', '93200', '59100', '62300']);

// Zonage Pinel — mock large
function zonagePinel(cp: string): { zone: ZonePinel; plafond_m2: number } | null {
  if (/^75/.test(cp) || cp === '92200' || cp === '92100') return { zone: 'A_bis', plafond_m2: 18.25 };
  if (/^69(001|002|003|006|007)$/.test(cp) || /^33/.test(cp) || /^59000$/.test(cp)) return { zone: 'A', plafond_m2: 13.56 };
  if (/^69(004|005|008|009)$/.test(cp) || /^59800$/.test(cp)) return { zone: 'B1', plafond_m2: 10.93 };
  if (/^(31|33300|34|35|44|59|62)/.test(cp)) return { zone: 'B2', plafond_m2: 9.50 };
  return null;
}

export function getReglementations(codePostal: string, surface: number, dpe: string): ReglementationsData {
  const entry = ENCADREMENT_PAR_CP[codePostal];
  const encadrement = entry
    ? {
        zone_tendue: true as const,
        commune: entry.commune,
        loyer_reference_m2: entry.loyer_reference_m2,
        loyer_minore_m2: entry.loyer_minore_m2,
        loyer_majore_m2: entry.loyer_majore_m2,
      }
    : { zone_tendue: false as const };

  const pinel = zonagePinel(codePostal);

  return {
    adresse: '',
    code_postal: codePostal,
    ville: entry?.commune || '',
    encadrement,
    permis_louer: PERMIS_LOUER_CP.has(codePostal),
    pinel,
    logement_decent: {
      surface_ok: surface >= 9,
      dpe_ok: dpe !== 'F' && dpe !== 'G',
      equipements_ok: true,
    },
  };
}

export function isZoneTendue(codePostal: string): boolean {
  return Boolean(ENCADREMENT_PAR_CP[codePostal]);
}
