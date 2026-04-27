export const fmtEuro = (n: number, withSign = false): string => {
  const sign = n > 0 && withSign ? '+' : '';
  return sign + n.toLocaleString('fr-FR') + ' €';
};

export const fmtEuroM2 = (n: number): string => n.toLocaleString('fr-FR') + ' €/m²';

export const fmtPct = (n: number, digits = 1): string => {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(digits)} %`;
};

export const fmtInt = (n: number): string => n.toLocaleString('fr-FR');

export const fmtSurface = (n: number): string => `${n} m²`;

export const fmtDelta = (n: number, unit: 'abs' | 'pct' = 'abs'): string => {
  if (unit === 'pct') return fmtPct(n);
  const sign = n > 0 ? '+' : '';
  return `${sign}${fmtInt(n)}`;
};
