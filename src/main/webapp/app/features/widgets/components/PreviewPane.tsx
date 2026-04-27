import React from 'react';
import { Monitor, Smartphone, ExternalLink } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  device: 'desktop' | 'mobile';
  onDeviceChange: (d: 'desktop' | 'mobile') => void;
  title?: string;
  footerNote?: string;
  extraToolbar?: React.ReactNode;
}

const PreviewPane: React.FC<Props> = ({ children, device, onDeviceChange, title = 'Aperçu', footerNote, extraToolbar }) => {
  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-md overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <div className="flex items-center gap-2">
          {extraToolbar}
          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
            <button
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                device === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => onDeviceChange('desktop')}
            >
              <Monitor size={12} /> Bureau
            </button>
            <button
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                device === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => onDeviceChange('mobile')}
            >
              <Smartphone size={12} /> Mobile
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6 overflow-auto">
        <div
          className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden transition-all"
          style={{ width: device === 'mobile' ? 360 : '100%', maxWidth: device === 'mobile' ? 360 : 720 }}
        >
          {children}
        </div>
      </div>
      {footerNote && (
        <div className="px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>{footerNote}</span>
          <a href="#" className="inline-flex items-center gap-1 text-propsight-600 hover:text-propsight-700 font-medium">
            Voir en conditions réelles <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
};

export default PreviewPane;
