import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { users, getUserById } from '../../_mocks/users';
import AvatarUser from './AvatarUser';

interface Props {
  assigneeId?: string;
  onChange: (userId: string | undefined) => void;
  compact?: boolean;
}

const AssigneDropdown: React.FC<Props> = ({ assigneeId, onChange, compact }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const assignee = getUserById(assigneeId);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md px-1.5 py-1 transition-colors"
      >
        <AvatarUser user={assignee} size="xs" />
        {!compact && (
          <span className="truncate max-w-[80px]">{assignee ? assignee.prenom : 'Non assigné'}</span>
        )}
        <ChevronDown size={12} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-72 overflow-auto">
          <button
            onClick={() => {
              onChange(undefined);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            <span className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-400">—</span>
            Non assigné
            {!assigneeId && <Check size={12} className="ml-auto text-propsight-600" />}
          </button>
          <div className="my-1 h-px bg-slate-100" />
          {users.map(u => (
            <button
              key={u.user_id}
              onClick={() => {
                onChange(u.user_id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <AvatarUser user={u} size="xs" />
              <span className="truncate">
                {u.prenom} {u.nom}
              </span>
              {assigneeId === u.user_id && <Check size={12} className="ml-auto text-propsight-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssigneDropdown;
