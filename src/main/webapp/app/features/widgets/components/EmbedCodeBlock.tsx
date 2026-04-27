import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  code: string;
  language?: string;
  label?: string;
}

const EmbedCodeBlock: React.FC<Props> = ({ code, language = 'html', label = 'Code embed' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {
      /* noop */
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="uppercase font-semibold tracking-wide text-slate-600">{language}</span>
          <span>· {label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-white text-slate-600 border border-transparent hover:border-slate-200"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-500" /> Copié
            </>
          ) : (
            <>
              <Copy size={12} /> Copier
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs leading-relaxed font-mono bg-slate-900 text-slate-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default EmbedCodeBlock;
