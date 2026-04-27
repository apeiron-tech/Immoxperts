// Freshness labels codifiés (cf docs/22_VEILLE.md §2.7)

const formatAbsolute = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const partOfDay = (hour: number): string => {
  if (hour < 12) return 'ce matin';
  if (hour < 18) return 'cet après-midi';
  return 'ce soir';
};

export const freshnessLabel = (isoOrDate: string | Date, now: Date = new Date()): string => {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffH < 4) return `il y a ${diffH}h`;

  // Same calendar day
  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (isSameDay) return partOfDay(d.getHours());

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (isYesterday) return 'hier';

  if (diffDays < 7) return `il y a ${diffDays}j`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)}s`;
  if (diffDays < 90) return `il y a ${Math.floor(diffDays / 30)}m`;
  return formatAbsolute(d);
};

export const absoluteLabel = (iso: string): string => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mn = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mn}`;
};

export const dateBucket = (
  iso: string,
  now: Date = new Date(),
): 'aujourdhui' | 'hier' | 'cette_semaine' | 'plus_ancien' => {
  const d = new Date(iso);
  const isSame = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (isSame(d, now)) return 'aujourdhui';
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (isSame(d, y)) return 'hier';
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays < 7) return 'cette_semaine';
  return 'plus_ancien';
};

export const BUCKET_LABELS: Record<ReturnType<typeof dateBucket>, string> = {
  aujourdhui: "Aujourd'hui",
  hier: 'Hier',
  cette_semaine: 'Cette semaine',
  plus_ancien: 'Plus ancien',
};
