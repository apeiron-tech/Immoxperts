import React from 'react';
import { Construction } from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';

interface Props {
  title: string;
  description: string;
}

const StudioPlaceholderPage: React.FC<Props> = ({ title, description }) => (
  <StudioLayout title={title} breadcrumbCurrent={title}>
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 items-center justify-center mb-3">
          <Construction size={22} />
        </div>
        <h2 className="text-[16px] font-semibold text-neutral-900 mb-1">{title}</h2>
        <p className="text-[13px] text-neutral-600 leading-relaxed">{description}</p>
        <div className="mt-3 text-[11px] text-neutral-400">Spec V1 — implémentation à venir.</div>
      </div>
    </div>
  </StudioLayout>
);

export default StudioPlaceholderPage;
