import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Settings2, Plus } from 'lucide-react';
import type { WidgetInstance } from '../../types';

interface Props {
  widget: WidgetInstance;
}

type FieldRow = { id: string; label: string; type: string; visible: boolean; required: boolean };

const SELLER_FIELDS: Record<string, FieldRow[]> = {
  Adresse: [{ id: 'address', label: 'Adresse', type: 'Autocomplete BAN', visible: true, required: true }],
  Bien: [
    { id: 'property_type', label: 'Type de bien', type: 'Radio cards', visible: true, required: true },
    { id: 'surface', label: 'Surface (m²)', type: 'Number', visible: true, required: true },
    { id: 'rooms', label: 'Pièces', type: 'Number', visible: true, required: true },
    { id: 'bedrooms', label: 'Chambres', type: 'Number', visible: true, required: false },
    { id: 'floor', label: 'Étage', type: 'Select', visible: true, required: false },
    { id: 'land', label: 'Terrain (m²)', type: 'Number', visible: false, required: false },
  ],
  Détails: [
    { id: 'year_built', label: 'Année de construction', type: 'Select décennies', visible: true, required: false },
    { id: 'condition', label: 'État général', type: 'Select', visible: true, required: false },
    { id: 'dpe', label: 'DPE', type: 'Select A→G', visible: true, required: false },
    { id: 'equipment', label: 'Équipements', type: 'Chips multiselect', visible: true, required: false },
    { id: 'occupation', label: 'Occupation', type: 'Select', visible: false, required: false },
  ],
  Contact: [
    { id: 'first_name', label: 'Prénom', type: 'Text', visible: true, required: true },
    { id: 'last_name', label: 'Nom', type: 'Text', visible: true, required: true },
    { id: 'email', label: 'Email', type: 'Email', visible: true, required: true },
    { id: 'phone', label: 'Téléphone', type: 'Tel FR', visible: true, required: true },
    { id: 'project', label: 'Projet (vendre / estimer)', type: 'Select', visible: true, required: false },
    { id: 'timeline', label: 'Délai', type: 'Select', visible: true, required: false },
    { id: 'contact_preference', label: 'Préférence contact', type: 'Select', visible: true, required: false },
    { id: 'consent', label: 'Consentement RGPD', type: 'Checkbox', visible: true, required: true },
  ],
};

const INVESTOR_FIELDS: Record<string, FieldRow[]> = {
  Projet: [
    { id: 'goal', label: 'Objectif principal', type: 'Radio cards', visible: true, required: true },
    { id: 'horizon', label: 'Horizon', type: 'Select', visible: true, required: false },
    { id: 'support_level', label: "Niveau d'accompagnement", type: 'Select', visible: true, required: false },
    { id: 'style', label: "Style d'investissement", type: 'Select', visible: false, required: false },
  ],
  Budget: [
    { id: 'budget', label: 'Budget total (€)', type: 'Number', visible: true, required: true },
    { id: 'down_payment', label: 'Apport (€)', type: 'Number', visible: true, required: false },
    { id: 'financing', label: 'Mode de financement', type: 'Select', visible: true, required: false },
    { id: 'target_yield', label: 'Rendement visé (%)', type: 'Number', visible: true, required: false },
    { id: 'monthly_effort', label: 'Effort mensuel max', type: 'Number', visible: true, required: false },
  ],
  'Zone & type': [
    { id: 'zones', label: 'Zones recherchées', type: 'Chips villes', visible: true, required: true },
    { id: 'property_types', label: 'Type de bien', type: 'Chips', visible: true, required: false },
    { id: 'works', label: 'Travaux acceptés', type: 'Toggle', visible: true, required: false },
    { id: 'rental_type', label: 'Type de location', type: 'Chips', visible: true, required: false },
    { id: 'recommendations', label: 'Ouvert aux recommandations', type: 'Checkbox', visible: false, required: false },
  ],
  Contact: [
    { id: 'first_name', label: 'Prénom', type: 'Text', visible: true, required: true },
    { id: 'last_name', label: 'Nom', type: 'Text', visible: true, required: true },
    { id: 'email', label: 'Email', type: 'Email', visible: true, required: true },
    { id: 'phone', label: 'Téléphone', type: 'Tel FR', visible: true, required: true },
    { id: 'availability', label: 'Disponibilité', type: 'Select', visible: true, required: false },
    { id: 'consent', label: 'Consentement RGPD', type: 'Checkbox', visible: true, required: true },
  ],
};

const FormTab: React.FC<Props> = ({ widget }) => {
  const fieldsMap = useMemo(
    () => (widget.type === 'estimation_vendeur' ? SELLER_FIELDS : INVESTOR_FIELDS),
    [widget.type],
  );
  const [openStep, setOpenStep] = useState<string | null>(Object.keys(fieldsMap)[0]);
  const [fields, setFields] = useState(fieldsMap);

  const toggle = (stepKey: string, id: string, key: 'visible' | 'required') => {
    setFields(prev => ({
      ...prev,
      [stepKey]: prev[stepKey].map(f => (f.id === id ? { ...f, [key]: !f[key] } : f)),
    }));
  };

  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([stepName, rows]) => {
        const visibleCount = rows.filter(r => r.visible).length;
        const requiredCount = rows.filter(r => r.required).length;
        const isOpen = openStep === stepName;
        return (
          <div key={stepName} className="bg-white border border-slate-200 rounded-md">
            <button
              onClick={() => setOpenStep(isOpen ? null : stepName)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60"
            >
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-sm font-semibold text-slate-900">Étape — {stepName}</span>
              </div>
              <span className="text-xs text-slate-500">
                {visibleCount} champs visibles · {requiredCount} obligatoires
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {rows.map(row => (
                  <div key={row.id} className="flex items-center gap-3 px-5 py-2.5">
                    <GripVertical size={13} className="text-slate-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900 truncate">{row.label}</div>
                      <div className="text-[11px] text-slate-500">{row.type}</div>
                    </div>
                    <ToggleCompact
                      label="Visible"
                      checked={row.visible}
                      onChange={() => toggle(stepName, row.id, 'visible')}
                    />
                    <ToggleCompact
                      label="Obligatoire"
                      checked={row.required}
                      onChange={() => toggle(stepName, row.id, 'required')}
                      disabled={row.id === 'consent'}
                    />
                    <button className="w-7 h-7 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center">
                      <Settings2 size={13} />
                    </button>
                  </div>
                ))}
                <div className="px-5 py-3">
                  <button
                    disabled
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 border border-dashed border-slate-300 rounded-md px-3 py-1.5"
                  >
                    <Plus size={12} />
                    Ajouter un champ personnalisé
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ToggleCompact: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => (
  <button
    onClick={disabled ? undefined : onChange}
    disabled={disabled}
    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border transition-colors ${
      checked
        ? 'bg-propsight-50 border-propsight-200 text-propsight-700'
        : 'bg-white border-slate-200 text-slate-500'
    } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-propsight-100'}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${checked ? 'bg-propsight-500' : 'bg-slate-300'}`}
    />
    {label}
  </button>
);

export default FormTab;
