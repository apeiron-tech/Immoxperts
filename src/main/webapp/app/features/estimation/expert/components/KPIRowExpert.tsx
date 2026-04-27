import React from 'react';
import { FileText, ShieldCheck, Send, Eye } from 'lucide-react';
import KpiCardPrimitive from 'app/shared/ui/KpiCard';
import { Estimation } from '../../types';

interface Props {
  rapports: Estimation[];
}

const KPIRowExpert: React.FC<Props> = ({ rapports }) => {
  const enCours = rapports.filter(r => r.statut === 'brouillon').length;
  const finalises = rapports.filter(r => r.statut === 'finalisee').length;
  const envoyes = rapports.filter(r => r.statut === 'envoyee' || r.statut === 'ouverte').length;
  const ouverts = rapports.filter(r => r.statut === 'ouverte').length;

  return (
    <div className="grid grid-cols-4 gap-3">
      <KpiCardPrimitive
        label="En cours"
        value={enCours}
        icon={FileText}
        iconVariant="default"
        iconLayout="left"
        density="default"
        subtitle="brouillons en édition"
      />
      <KpiCardPrimitive
        label="Finalisés"
        value={finalises}
        icon={ShieldCheck}
        iconVariant="violet"
        iconLayout="left"
        density="default"
        subtitle="prêts à transmettre"
      />
      <KpiCardPrimitive
        label="Transmis"
        value={envoyes}
        icon={Send}
        iconVariant="blue"
        iconLayout="left"
        density="default"
        subtitle="rapports envoyés au donneur d'ordre"
      />
      <KpiCardPrimitive
        label="Consultés"
        value={ouverts}
        icon={Eye}
        iconVariant="emerald"
        iconLayout="left"
        density="default"
        subtitle={envoyes > 0 ? `${Math.round((ouverts / envoyes) * 100)} % d'ouverture` : 'aucune transmission'}
      />
    </div>
  );
};

export default KPIRowExpert;
