import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LeadsControls from './components/LeadsControls';
import KanbanBoard from './components/KanbanBoard';
import TableView from './components/TableView';
import LeadDrawer from './components/LeadDrawer';
import CreateLeadModal from './components/CreateLeadModal';
import { IntentionTab, Lead, ViewMode } from './types';
import { MOCK_LEADS, STAGES } from './_mocks/leads';

const matchTab = (lead: Lead, tab: IntentionTab): boolean => {
  if (tab === 'tous') return true;
  if (tab === 'vendeurs')   return lead.intention === 'vente';
  if (tab === 'acquereurs') return lead.intention === 'achat';
  if (tab === 'estim')      return lead.intention === 'estim';
  if (tab === 'locatif')    return lead.intention === 'locatif';
  return true;
};

const LeadsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([...MOCK_LEADS]);
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<IntentionTab>('tous');
  const [createOpen, setCreateOpen] = useState(false);

  const openLeadId = searchParams.get('lead');
  const openLead = useMemo(() => leads.find(l => l.lead_id === openLeadId) || null, [leads, openLeadId]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter(l => {
      if (!matchTab(l, tab)) return false;
      if (!q) return true;
      return (
        l.nom.toLowerCase().includes(q) ||
        l.adresse.toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.telephone || '').toLowerCase().includes(q)
      );
    });
  }, [leads, search, tab]);

  const countsByTab: Record<IntentionTab, number> = useMemo(() => ({
    tous:        leads.length,
    vendeurs:    leads.filter(l => l.intention === 'vente').length,
    acquereurs:  leads.filter(l => l.intention === 'achat').length,
    estim:       leads.filter(l => l.intention === 'estim').length,
    locatif:     leads.filter(l => l.intention === 'locatif').length,
  }), [leads]);

  const handleLeadClick = (lead: Lead) => {
    const next = new URLSearchParams(searchParams);
    next.set('lead', lead.lead_id);
    setSearchParams(next, { replace: true });
  };

  const handleCloseDrawer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('lead');
    setSearchParams(next, { replace: true });
  };

  const handleCreate = (partial: Partial<Lead>) => {
    setLeads(prev => [partial as Lead, ...prev]);
    setCreateOpen(false);
    if (partial.lead_id) {
      const next = new URLSearchParams(searchParams);
      next.set('lead', partial.lead_id);
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 bg-white border-b border-slate-200 flex-shrink-0">
        <h1 className="text-lg font-semibold text-slate-900 leading-tight">Leads</h1>
        <p className="text-xs text-slate-500 mt-0.5">Pipeline commercial unique, centralisant tous les leads du produit.</p>
      </div>

      <LeadsControls
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        intentionTab={tab}
        onIntentionTabChange={setTab}
        onCreateLead={() => setCreateOpen(true)}
        countsByTab={countsByTab}
      />

      {view === 'kanban' ? (
        <KanbanBoard stages={STAGES} leads={filtered} onLeadClick={handleLeadClick} />
      ) : (
        <TableView leads={filtered} onLeadClick={handleLeadClick} />
      )}

      <LeadDrawer lead={openLead} onClose={handleCloseDrawer} />
      <CreateLeadModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />
    </div>
  );
};

export default LeadsPage;
