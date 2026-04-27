import React, { useState } from 'react';
import { Search, Globe, Sparkles, Bell, ChevronDown } from 'lucide-react';

const ProHeader: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-4 gap-3 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-2xl relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un bien, une adresse, un propriétaire…"
          className="w-full h-9 pl-9 pr-16 border border-slate-200 rounded-md text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-propsight-400 focus:border-propsight-400"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="px-1.5 h-5 flex items-center rounded bg-slate-100 text-[11px] font-medium text-slate-500">⌘K</kbd>
        </div>
      </div>

      <div className="flex-1" />

      {/* Zone */}
      <button className="h-9 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[13px] text-slate-700 flex items-center gap-2 transition-colors">
        <Globe size={13} className="text-slate-400" />
        <span>Zone : <span className="font-medium">France</span></span>
        <ChevronDown size={13} className="text-slate-400" />
      </button>

      {/* Assistant IA */}
      <button className="h-9 px-3 rounded-md bg-gradient-to-r from-propsight-500 to-propsight-600 hover:from-propsight-600 hover:to-propsight-700 text-white text-[13px] font-medium flex items-center gap-1.5 transition-colors">
        <Sparkles size={13} />
        Assistant IA
      </button>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors">
        <Bell size={15} className="text-slate-600" />
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">3</span>
      </button>

      {/* User */}
      <button className="h-9 pl-1 pr-2.5 rounded-md hover:bg-slate-50 flex items-center gap-2 transition-colors">
        <img
          src="https://i.pravatar.cc/64?u=thomas"
          alt="Thomas Martin"
          className="w-7 h-7 rounded-md object-cover"
        />
        <div className="text-left leading-tight">
          <div className="text-[12px] font-medium text-slate-900">Thomas Martin</div>
          <div className="text-[11px] text-slate-500">Agence Demo</div>
        </div>
        <ChevronDown size={13} className="text-slate-400" />
      </button>
    </header>
  );
};

export default ProHeader;
