import React from 'react';
import { Search, Sparkles, Moon, Sun } from 'lucide-react';
import { useCommandSearchStore } from 'app/shared/stores/commandSearchStore';
import { useAIDrawerStore } from 'app/shared/stores/aiDrawerStore';
import { useThemeStore } from 'app/shared/stores/themeStore';
import ZoneSelector from './ZoneSelector';
import NotificationPopover from './NotificationPopover';
import UserMenu from './UserMenu';

const HeaderPro: React.FC = () => {
  const openCommand = useCommandSearchStore(s => s.open);
  const openAI = useAIDrawerStore(s => s.open);
  const theme = useThemeStore(s => s.theme);
  const toggleTheme = useThemeStore(s => s.toggle);

  return (
    <header className="h-13 min-h-[52px] border-b border-neutral-200 bg-white flex items-center px-4 gap-3 flex-shrink-0">
      <button
        type="button"
        onClick={() => openCommand()}
        className="flex-1 max-w-xl h-9 pl-3 pr-2 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center gap-2 text-[13px] text-neutral-400 transition-colors"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Rechercher un bien, un lead, une page…</span>
        <kbd className="px-1.5 h-5 flex items-center rounded bg-neutral-100 text-[11px] font-medium text-neutral-500">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      <ZoneSelector />

      <button
        type="button"
        onClick={() => openAI()}
        className="h-9 px-3 rounded-md bg-propsight-500 hover:bg-propsight-600 text-white text-[13px] font-medium flex items-center gap-1.5 transition-colors"
      >
        <Sparkles size={13} />
        Assistant IA
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        className="h-9 w-9 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 flex items-center justify-center transition-colors"
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <NotificationPopover />
      <UserMenu />
    </header>
  );
};

export default HeaderPro;
