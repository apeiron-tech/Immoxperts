import React, { isValidElement } from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

/**
 * KpiCard — primitive partagée pour TOUS les KPI Pro.
 *
 * Charte (docs/01_DESIGN_SYSTEM.md + AUDIT_DESIGN_PROPSIGHT.md) :
 * - Surface : bg-white, border-slate-200, rounded-lg
 * - Aucune ombre par défaut, hover:shadow-sm si interactif
 * - Trend up = text-green-600 (#16A34A) ; trend down = text-red-600 (#DC2626)
 * - tabular-nums sur les valeurs
 * - Lucide uniquement, icône w-3.5 h-3.5 dans badge w-6/w-7/w-8 selon densité
 *
 * Densités :
 *  - comfort : p-4, value text-2xl     (KPI vedette / hero)
 *  - default : p-3, value text-xl      (Pro standard)
 *  - compact : px-3 py-2, value text-lg (lignes denses)
 *  - mini    : px-2 py-1.5, value text-sm (sparkline rows)
 */

export type KpiTrendDirection = 'up' | 'down' | 'flat';
export type KpiDensity = 'comfort' | 'default' | 'compact' | 'mini';
export type KpiIconVariant =
  | 'default'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'blue'
  | 'sky';
export type KpiIconLayout = 'topRight' | 'left';

export interface KpiTrend {
  value: string;
  direction: KpiTrendDirection;
  /** badge = pill colorée, inline = texte + icône (default) */
  style?: 'inline' | 'badge';
}

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  /** texte secondaire à côté du delta (ex: "vs M-1") */
  trendCompare?: string;
  trend?: KpiTrend;
  icon?: LucideIcon | React.ReactNode;
  iconVariant?: KpiIconVariant;
  /** Override des classes du conteneur d'icône (prend le pas sur iconVariant) */
  iconWrapperClassName?: string;
  iconLayout?: KpiIconLayout;
  density?: KpiDensity;
  /** sélectionné (filtre actif) */
  active?: boolean;
  /** mis en avant (sans état actif) */
  highlight?: boolean;
  /** override couleur de la valeur (KpiBar accent) */
  valueClassName?: string;
  /** contenu à droite (sparkline, ConfidenceDots, etc.) */
  rightSlot?: React.ReactNode;
  /** suffixe optionnel à côté de la valeur (ex: pictogramme info) */
  labelSuffix?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}

const ICON_VARIANT_BG: Record<KpiIconVariant, string> = {
  default: 'bg-slate-100 text-slate-600',
  violet: 'bg-propsight-50 text-propsight-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  sky: 'bg-sky-50 text-sky-600',
};

const TREND_COLOR: Record<KpiTrendDirection, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  flat: 'text-slate-500',
};

const TREND_BADGE: Record<KpiTrendDirection, string> = {
  up: 'bg-green-50 text-green-700',
  down: 'bg-red-50 text-red-700',
  flat: 'bg-slate-100 text-slate-600',
};

const TREND_ICON: Record<KpiTrendDirection, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const DENSITY = {
  comfort: {
    padding: 'p-4',
    label: 'text-xs',
    value: 'text-2xl',
    subtitle: 'text-xs',
    iconBox: 'h-9 w-9',
    iconSize: 16,
    deltaSize: 11,
    deltaText: 'text-xs',
    gap: 'gap-2',
  },
  default: {
    padding: 'p-3',
    label: 'text-xs',
    value: 'text-xl',
    subtitle: 'text-[11px]',
    iconBox: 'h-8 w-8',
    iconSize: 14,
    deltaSize: 11,
    deltaText: 'text-[11px]',
    gap: 'gap-2',
  },
  compact: {
    padding: 'px-3 py-2',
    label: 'text-[11px]',
    value: 'text-lg',
    subtitle: 'text-[10.5px]',
    iconBox: 'h-7 w-7',
    iconSize: 12,
    deltaSize: 10,
    deltaText: 'text-[10.5px]',
    gap: 'gap-2',
  },
  mini: {
    padding: 'px-2 py-1.5',
    label: 'text-[10px]',
    value: 'text-sm',
    subtitle: 'text-[9.5px]',
    iconBox: 'h-6 w-6',
    iconSize: 11,
    deltaSize: 9,
    deltaText: 'text-[9.5px]',
    gap: 'gap-1.5',
  },
} as const;

const renderIcon = (
  icon: LucideIcon | React.ReactNode | undefined,
  size: number,
): React.ReactNode => {
  if (!icon) return null;
  // Élément déjà construit (ex: <Building2 size={16} />) — on le rend tel quel.
  if (isValidElement(icon)) return icon;
  // Sinon : référence de composant (fonction ou forwardRef Lucide) — on l'instancie.
  const Icon = icon as React.ComponentType<{ size?: number }>;
  return <Icon size={size} />;
};

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtitle,
  trend,
  trendCompare,
  icon,
  iconVariant = 'default',
  iconWrapperClassName,
  iconLayout = 'topRight',
  density = 'default',
  active = false,
  highlight = false,
  valueClassName,
  rightSlot,
  labelSuffix,
  onClick,
  className = '',
  title,
}) => {
  const d = DENSITY[density];
  const interactive = typeof onClick === 'function';

  const borderCls = active
    ? 'border-propsight-400 ring-1 ring-propsight-200'
    : highlight
      ? 'border-propsight-200 bg-propsight-50/30'
      : 'border-slate-200';

  const hoverCls = interactive
    ? active
      ? 'cursor-pointer'
      : 'hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer'
    : '';

  const baseCls = `bg-white border ${borderCls} rounded-lg ${d.padding} text-left ${hoverCls} ${className}`;

  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  const trendStyle = trend?.style ?? 'inline';

  const iconNode = renderIcon(icon, d.iconSize);

  // Layout LEFT — icône à gauche, contenu à droite
  if (iconLayout === 'left' && iconNode) {
    return (
      <Wrapper interactive={interactive} onClick={onClick} className={baseCls} title={title}>
        <div className={`flex items-center ${d.gap}`}>
          <div
            className={`flex-shrink-0 ${d.iconBox} rounded-md flex items-center justify-center ${
              iconWrapperClassName ?? ICON_VARIANT_BG[iconVariant]
            }`}
          >
            {iconNode}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className={`${d.label} font-medium text-slate-500 truncate`}>{label}</span>
              {labelSuffix}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className={`font-semibold tabular-nums leading-none truncate ${
                  valueClassName ?? 'text-slate-900'
                } ${d.value}`}
              >
                {value}
              </span>
              {trend && trendStyle === 'inline' && TrendIcon && (
                <span
                  className={`inline-flex items-center gap-0.5 ${d.deltaText} font-medium ${TREND_COLOR[trend.direction]}`}
                >
                  <TrendIcon size={d.deltaSize} />
                  {trend.value}
                </span>
              )}
              {trend && trendStyle === 'badge' && TrendIcon && (
                <span
                  className={`inline-flex items-center gap-0.5 ${d.deltaText} font-medium px-1 py-0.5 rounded ${TREND_BADGE[trend.direction]}`}
                >
                  <TrendIcon size={d.deltaSize} />
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && <div className={`${d.subtitle} text-slate-400 truncate mt-0.5`}>{subtitle}</div>}
            {trendCompare && !subtitle && (
              <div className={`${d.subtitle} text-slate-400 truncate mt-0.5`}>{trendCompare}</div>
            )}
          </div>
          {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
        </div>
      </Wrapper>
    );
  }

  // Layout TOP-RIGHT (default) — label + icône en haut, valeur dessous
  return (
    <Wrapper interactive={interactive} onClick={onClick} className={baseCls} title={title}>
      <div className="flex items-start justify-between gap-2">
        <span className={`${d.label} font-medium text-slate-500 truncate inline-flex items-center gap-1`}>
          {label}
          {labelSuffix}
        </span>
        {iconNode && (
          <span
            className={`flex-shrink-0 ${d.iconBox} rounded-md flex items-center justify-center ${
              iconWrapperClassName ?? ICON_VARIANT_BG[iconVariant]
            }`}
          >
            {iconNode}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 flex-wrap mt-1">
        <span
          className={`font-semibold tabular-nums leading-none ${valueClassName ?? 'text-slate-900'} ${d.value}`}
        >
          {value}
        </span>
        {trend && trendStyle === 'inline' && TrendIcon && (
          <span
            className={`inline-flex items-center gap-0.5 ${d.deltaText} font-medium ${TREND_COLOR[trend.direction]}`}
          >
            <TrendIcon size={d.deltaSize} />
            {trend.value}
          </span>
        )}
        {trend && trendStyle === 'badge' && TrendIcon && (
          <span
            className={`inline-flex items-center gap-0.5 ${d.deltaText} font-medium px-1 py-0.5 rounded ${TREND_BADGE[trend.direction]}`}
          >
            <TrendIcon size={d.deltaSize} />
            {trend.value}
          </span>
        )}
        {trendCompare && (
          <span className={`${d.deltaText} text-slate-400 truncate`}>{trendCompare}</span>
        )}
      </div>
      {subtitle && <div className={`${d.subtitle} text-slate-400 truncate mt-1`}>{subtitle}</div>}
      {rightSlot && <div className="mt-1.5">{rightSlot}</div>}
    </Wrapper>
  );
};

interface WrapperProps {
  interactive: boolean;
  onClick?: () => void;
  className: string;
  title?: string;
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ interactive, onClick, className, title, children }) =>
  interactive ? (
    <button type="button" onClick={onClick} title={title} className={className}>
      {children}
    </button>
  ) : (
    <div className={className} title={title}>
      {children}
    </div>
  );

export default KpiCard;
