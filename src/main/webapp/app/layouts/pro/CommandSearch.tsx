import React, { useEffect, useMemo } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useCommandSearchStore } from 'app/shared/stores/commandSearchStore';
import { proNavigation, proSettingsNav } from 'app/config/proNavigation';

interface Entry {
  label: string;
  to: string;
  group: string;
}

const buildEntries = (): Entry[] => {
  const entries: Entry[] = [];
  for (const section of proNavigation) {
    if (section.children) {
      for (const child of section.children) {
        entries.push({ label: child.label, to: child.to, group: section.label });
      }
    } else {
      entries.push({ label: section.label, to: section.to, group: 'Navigation' });
    }
  }
  entries.push({ label: proSettingsNav.label, to: proSettingsNav.to, group: 'Navigation' });
  return entries;
};

const CommandSearch: React.FC = () => {
  const { isOpen, toggle, close } = useCommandSearchStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, toggle, close]);

  const entries = useMemo(buildEntries, []);
  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const list = map.get(e.group) ?? [];
      list.push(e);
      map.set(e.group, list);
    }
    return Array.from(map.entries());
  }, [entries]);

  if (!isOpen) return null;

  const go = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <div
      role="dialog"
      onClick={close}
      className="fixed inset-0 z-[100] bg-neutral-900/40 flex items-start justify-center pt-[14vh]"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-[560px] max-w-[calc(100vw-2rem)] bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden"
      >
        <Command label="Command Menu">
          <Command.Input
            autoFocus
            placeholder="Rechercher une page, un bien, un lead…"
            className="w-full h-12 px-4 border-b border-neutral-200 text-sm outline-none"
          />
          <Command.List className="max-h-[60vh] overflow-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-neutral-500">
              Aucun résultat.
            </Command.Empty>
            {grouped.map(([group, items]) => (
              <Command.Group key={group} heading={group} className="mb-1">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase px-2 py-1">{group}</div>
                {items.map(e => (
                  <Command.Item
                    key={e.to}
                    value={`${e.group} ${e.label}`}
                    onSelect={() => go(e.to)}
                    className="px-2 py-1.5 rounded text-sm text-neutral-700 cursor-pointer data-[selected=true]:bg-propsight-50 data-[selected=true]:text-propsight-700"
                  >
                    {e.label}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
};

export default CommandSearch;
