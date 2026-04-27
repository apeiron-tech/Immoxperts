import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, AlertTriangle, MapPin, Ruler, Home } from 'lucide-react';
import EstimationLeadForm from './EstimationLeadForm';
import type { EstimationResult as EstimationResultModel } from './lib/api';
import type { EstimationRequest } from './lib/api';

interface Props {
  result: EstimationResultModel;
  request: EstimationRequest;
  onReset: () => void;
}

const formatPrice = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`;

const CONDITION_LABEL: Record<EstimationRequest['condition'], string> = {
  neuf: 'Neuf ou récent',
  bon: 'Bon état',
  'a-rafraichir': 'À rafraîchir',
  'a-renover': 'À rénover',
};

const CONFIDENCE_PILL: Record<
  EstimationResultModel['confidence'],
  { label: string; classes: string; icon: React.ReactNode }
> = {
  high: {
    label: '✓ Fiabilité forte',
    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <BadgeCheck size={13} className="text-emerald-600" />,
  },
  medium: {
    label: '◆ Fiabilité moyenne',
    classes: 'bg-amber-50 text-amber-800 border border-amber-200',
    icon: <BadgeCheck size={13} className="text-amber-600" />,
  },
  low: {
    label: '⚠ Fiabilité limitée',
    classes: 'bg-slate-50 text-slate-700 border border-slate-300',
    icon: <AlertTriangle size={13} className="text-slate-500" />,
  },
};

const EstimationResult: React.FC<Props> = ({ result, request, onReset }) => {
  const conf = CONFIDENCE_PILL[result.confidence];

  return (
    <section id="resultat" className="bg-white border-t border-slate-200">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-10 lg:gap-14 items-start"
        >
          <div>
            <h2 className="text-[28px] md:text-[32px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]">
              Votre estimation
            </h2>

            <div className="mt-6 text-[36px] sm:text-[40px] md:text-[48px] font-semibold text-propsight-700 leading-tight tabular-nums">
              {formatPrice(result.priceLow)} — {formatPrice(result.priceHigh)}
            </div>
            <p className="mt-1 text-[15px] text-slate-600 tabular-nums">
              Soit {result.pricePerSqmLow.toLocaleString('fr-FR')} € — {result.pricePerSqmHigh.toLocaleString('fr-FR')} € / m²
            </p>

            <span className={`mt-3 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12.5px] font-medium ${conf.classes}`}>
              {conf.icon}
              {conf.label}
            </span>

            <ul className="mt-7 space-y-2.5 text-[14px] text-slate-700">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-slate-500 flex-shrink-0" />
                <span>{request.address.label}</span>
              </li>
              <li className="flex items-center gap-2">
                <Ruler size={15} className="text-slate-500 flex-shrink-0" />
                <span className="tabular-nums">
                  {request.surface} m² · {request.rooms} pièce{request.rooms > 1 ? 's' : ''}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Home size={15} className="text-slate-500 flex-shrink-0" />
                <span>
                  {request.propertyType === 'appartement' ? 'Appartement' : 'Maison'} · {CONDITION_LABEL[request.condition]}
                </span>
              </li>
            </ul>

            <p className="mt-7 text-[14px] text-slate-600 leading-[1.6]">
              Cette fourchette est calculée à partir des transactions immobilières réelles observées dans votre secteur au cours des 24 derniers
              mois, ajustées selon la surface et l&rsquo;état de votre bien. Elle ne remplace pas l&rsquo;avis d&rsquo;un professionnel.
            </p>
          </div>

          <div>
            <EstimationLeadForm estimationId={result.estimationId} />
            <button
              type="button"
              onClick={onReset}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 text-[14px] text-slate-600 hover:text-slate-900 hover:underline"
            >
              <ArrowLeft size={13} />
              Recommencer l&rsquo;estimation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EstimationResult;
