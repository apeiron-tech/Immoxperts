export const formatEuros = (n: number | null | undefined, compact = false): string => {
  if (n == null) return '—';
  if (compact && n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')} M€`;
  if (compact && n >= 1_000) return `${Math.round(n / 1000)} k€`;
  return n.toLocaleString('fr-FR') + ' €';
};

export const formatEurosM2 = (n: number | null | undefined): string => {
  if (n == null) return '—';
  return `${n.toLocaleString('fr-FR')} €/m²`;
};

export const formatSurface = (n: number | null | undefined): string => {
  if (n == null) return '—';
  return `${n.toLocaleString('fr-FR')} m²`;
};

export const formatNumber = (n: number | null | undefined): string => {
  if (n == null) return '—';
  return n.toLocaleString('fr-FR');
};

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR');
};

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.toLocaleDateString('fr-FR')} ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
};

export const formatDateShort = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export const relativeTime = (iso: string): string => {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.floor((now - t) / 1000);
  if (diff < 60) return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
  return new Date(iso).toLocaleDateString('fr-FR');
};

export const statutMandatLabel = (s: string | null): string => {
  switch (s) {
    case 'mandat_exclusif': return 'Mandat exclusif';
    case 'mandat_simple': return 'Mandat simple';
    case 'sous_compromis': return 'Sous compromis';
    case 'estimation_en_cours': return 'Estimation en cours';
    case 'prospection': return 'Prospection';
    default: return '—';
  }
};

export const typeBienLabel = (t: string): string => {
  switch (t) {
    case 'appartement': return 'Appartement';
    case 'maison': return 'Maison';
    case 'local': return 'Local commercial';
    case 'terrain': return 'Terrain';
    case 'parking': return 'Parking';
    default: return t;
  }
};
