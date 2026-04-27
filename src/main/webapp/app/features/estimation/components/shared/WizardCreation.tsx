import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Building2, Home, Trees, ParkingCircle, Plus, Trash2 } from 'lucide-react';
import { EstimationFormData, TypeBien, EtatBien, DpeGes, ClientInfo } from '../../types';
import { DPESelector } from './DPESelector';
import { computeAvm } from '../../utils/avmEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { bien: Partial<EstimationFormData>; client: ClientInfo | null }) => void;
  initialData?: Partial<EstimationFormData>;
  initialClient?: ClientInfo | null;
  titre?: string;
  submitLabel?: string;
}

const ETATS: { value: EtatBien; label: string }[] = [
  { value: 'neuf', label: 'Neuf / VEFA' },
  { value: 'refait_a_neuf', label: 'Refait à neuf' },
  { value: 'bon', label: 'Bon état' },
  { value: 'a_rafraichir', label: 'À rafraîchir' },
  { value: 'a_renover', label: 'À rénover' },
  { value: 'a_restructurer', label: 'À restructurer' },
];

const CARACTERISTIQUES = [
  'balcon', 'terrasse', 'parking', 'cave', 'ascenseur', 'gardien', 'piscine', 'jardin', 'vue', 'calme', 'cheminée', 'fibre',
];

const TYPE_ICONS: Record<TypeBien, React.ReactNode> = {
  appartement: <Building2 size={22} />,
  maison: <Home size={22} />,
  terrain: <Trees size={22} />,
  parking: <ParkingCircle size={22} />,
};

const TYPE_LABELS: Record<TypeBien, string> = {
  appartement: 'Appartement',
  maison: 'Maison',
  terrain: 'Terrain',
  parking: 'Parking',
};

const defaultBien: Partial<EstimationFormData> = {
  adresse: '',
  ville: '',
  code_postal: '',
  lat: 0,
  lon: 0,
  type_bien: 'appartement',
  surface: 0,
  nb_pieces: 0,
  nb_chambres: 0,
  etage: 0,
  nb_etages: 0,
  surface_terrain: 0,
  annee_construction: 0,
  dpe: 'D',
  ges: 'D',
  etat: 'bon',
  exposition: '',
  caracteristiques: [],
  description: '',
  points_forts: [],
  points_defendre: [],
  charges_mensuelles: 0,
  taxe_fonciere: 0,
};

const defaultClient: ClientInfo = {
  civilite: '',
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
};

const WizardCreation: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, initialClient, titre, submitLabel }) => {
  const [step, setStep] = useState(1);
  const [bien, setBien] = useState<Partial<EstimationFormData>>({ ...defaultBien, ...initialData });
  const [client, setClient] = useState<ClientInfo>({ ...defaultClient, ...(initialClient || {}) });
  const [noClient, setNoClient] = useState(false);
  const [newPointFort, setNewPointFort] = useState('');
  const [newPointDefendre, setNewPointDefendre] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBien({ ...defaultBien, ...initialData });
      setClient({ ...defaultClient, ...(initialClient || {}) });
      setNoClient(false);
    }
  }, [isOpen]);

  const updateBien = (field: keyof EstimationFormData, value: unknown) => {
    setBien(prev => ({ ...prev, [field]: value }));
  };

  const toggleCarac = (c: string) => {
    const current = bien.caracteristiques || [];
    if (current.includes(c)) {
      updateBien('caracteristiques', current.filter(x => x !== c));
    } else {
      updateBien('caracteristiques', [...current, c]);
    }
  };

  const addPointFort = () => {
    if (newPointFort.trim()) {
      updateBien('points_forts', [...(bien.points_forts || []), newPointFort.trim()]);
      setNewPointFort('');
    }
  };

  const addPointDefendre = () => {
    if (newPointDefendre.trim()) {
      updateBien('points_defendre', [...(bien.points_defendre || []), newPointDefendre.trim()]);
      setNewPointDefendre('');
    }
  };

  const removePointFort = (idx: number) => {
    updateBien('points_forts', (bien.points_forts || []).filter((_, i) => i !== idx));
  };

  const removePointDefendre = (idx: number) => {
    updateBien('points_defendre', (bien.points_defendre || []).filter((_, i) => i !== idx));
  };

  const avm = computeAvm(bien);
  const confidenceColor = avm?.prix.confiance_label === 'fort' ? 'text-green-600' : avm?.prix.confiance_label === 'bon' ? 'text-orange-500' : 'text-red-500';
  const confidenceDots = avm ? Math.round(avm.prix.confiance * 5) : 0;

  const handleSubmit = () => {
    console.warn('[WizardCreation] Soumission', { bien, client: noClient ? null : client });
    onSubmit({ bien, client: noClient ? null : client });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-md shadow-sm w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-900">{titre || 'Nouvelle estimation rapide'}</h2>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? 'w-6 bg-propsight-600' : s < step ? 'w-6 bg-propsight-300' : 'w-6 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Client</p>
                <label className="flex items-center gap-2 text-sm text-slate-600 mb-3 cursor-pointer">
                  <input type="checkbox" checked={noClient} onChange={e => setNoClient(e.target.checked)} className="rounded" />
                  Sans client (estimation interne)
                </label>
                {!noClient && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Civilité</label>
                      <select
                        value={client.civilite}
                        onChange={e => setClient(prev => ({ ...prev, civilite: e.target.value as ClientInfo['civilite'] }))}
                        className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-propsight-400"
                      >
                        <option value="">—</option>
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Nom</label>
                      <input
                        type="text"
                        value={client.nom}
                        onChange={e => setClient(prev => ({ ...prev, nom: e.target.value }))}
                        placeholder="Dupont"
                        className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Prénom</label>
                      <input
                        type="text"
                        value={client.prenom}
                        onChange={e => setClient(prev => ({ ...prev, prenom: e.target.value }))}
                        placeholder="Marie"
                        className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Téléphone</label>
                      <input
                        type="tel"
                        value={client.telephone}
                        onChange={e => setClient(prev => ({ ...prev, telephone: e.target.value }))}
                        placeholder="06 12 34 56 78"
                        className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-slate-500 block mb-1">Email</label>
                      <input
                        type="email"
                        value={client.email}
                        onChange={e => setClient(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="marie.dupont@email.fr"
                        className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Localisation</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3">
                    <label className="text-xs text-slate-500 block mb-1">Adresse</label>
                    <input
                      type="text"
                      value={bien.adresse || ''}
                      onChange={e => updateBien('adresse', e.target.value)}
                      placeholder="12 rue du Hameau"
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 block mb-1">Ville</label>
                    <input
                      type="text"
                      value={bien.ville || ''}
                      onChange={e => updateBien('ville', e.target.value)}
                      placeholder="Paris"
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Code postal</label>
                    <input
                      type="text"
                      value={bien.code_postal || ''}
                      onChange={e => updateBien('code_postal', e.target.value)}
                      placeholder="75015"
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Type de bien</p>
                <div className="grid grid-cols-4 gap-2">
                  {(['appartement', 'maison', 'terrain', 'parking'] as TypeBien[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateBien('type_bien', type)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-md border text-xs font-medium transition-all ${
                        bien.type_bien === type
                          ? 'border-propsight-400 bg-propsight-50 text-propsight-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {TYPE_ICONS[type]}
                      {TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Caractéristiques</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Surface (m²)</label>
                    <input
                      type="number"
                      value={bien.surface || ''}
                      onChange={e => updateBien('surface', Number(e.target.value))}
                      min={0}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Pièces</label>
                    <input
                      type="number"
                      value={bien.nb_pieces || ''}
                      onChange={e => updateBien('nb_pieces', Number(e.target.value))}
                      min={0}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Chambres</label>
                    <input
                      type="number"
                      value={bien.nb_chambres || ''}
                      onChange={e => updateBien('nb_chambres', Number(e.target.value))}
                      min={0}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Étage</label>
                    <input
                      type="number"
                      value={bien.etage ?? ''}
                      onChange={e => updateBien('etage', Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Nb étages (imm.)</label>
                    <input
                      type="number"
                      value={bien.nb_etages || ''}
                      onChange={e => updateBien('nb_etages', Number(e.target.value))}
                      min={0}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                    />
                  </div>
                  {bien.type_bien === 'maison' && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Surface terrain (m²)</label>
                      <input
                        type="number"
                        value={bien.surface_terrain || ''}
                        onChange={e => updateBien('surface_terrain', Number(e.target.value))}
                        min={0}
                        className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Équipements</p>
                <div className="flex flex-wrap gap-2">
                  {CARACTERISTIQUES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCarac(c)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all capitalize ${
                        (bien.caracteristiques || []).includes(c)
                          ? 'border-propsight-400 bg-propsight-50 text-propsight-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <DPESelector
                  value={bien.dpe || 'D'}
                  onChange={v => updateBien('dpe', v)}
                  label="DPE"
                />
                <DPESelector
                  value={bien.ges || 'D'}
                  onChange={v => updateBien('ges', v)}
                  label="GES"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">État général</label>
                <select
                  value={bien.etat || 'bon'}
                  onChange={e => updateBien('etat', e.target.value as EtatBien)}
                  className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-propsight-400"
                >
                  {ETATS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Année de construction</label>
                <input
                  type="number"
                  value={bien.annee_construction || ''}
                  onChange={e => updateBien('annee_construction', Number(e.target.value))}
                  placeholder="1985"
                  min={1800}
                  max={2026}
                  className="w-48 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Exposition</label>
                  <select
                    value={bien.exposition || ''}
                    onChange={e => updateBien('exposition', e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-propsight-400"
                  >
                    <option value="">Non renseigné</option>
                    <option>Nord</option>
                    <option>Sud</option>
                    <option>Est</option>
                    <option>Ouest</option>
                    <option>Sud-Est</option>
                    <option>Sud-Ouest</option>
                    <option>Nord-Est</option>
                    <option>Nord-Ouest</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Charges mensuelles (€)</label>
                  <input
                    type="number"
                    value={bien.charges_mensuelles || ''}
                    onChange={e => updateBien('charges_mensuelles', Number(e.target.value))}
                    min={0}
                    className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Taxe foncière (€/an)</label>
                  <input
                    type="number"
                    value={bien.taxe_fonciere || ''}
                    onChange={e => updateBien('taxe_fonciere', Number(e.target.value))}
                    min={0}
                    className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Description</label>
                <textarea
                  value={bien.description || ''}
                  onChange={e => updateBien('description', e.target.value)}
                  rows={4}
                  placeholder="Décrivez le bien en quelques phrases..."
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-2">Points forts</label>
                <div className="space-y-1 mb-2">
                  {(bien.points_forts || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex-1 text-sm text-slate-700 bg-green-50 border border-green-200 rounded px-2 py-1">{p}</span>
                      <button onClick={() => removePointFort(i)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPointFort}
                    onChange={e => setNewPointFort(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPointFort()}
                    placeholder="ex : Vue dégagée"
                    className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                  />
                  <button
                    type="button"
                    onClick={addPointFort}
                    className="px-3 py-1.5 bg-propsight-600 text-white rounded-md text-sm hover:bg-propsight-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-2">Points à défendre</label>
                <div className="space-y-1 mb-2">
                  {(bien.points_defendre || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex-1 text-sm text-slate-700 bg-orange-50 border border-orange-200 rounded px-2 py-1">{p}</span>
                      <button onClick={() => removePointDefendre(i)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPointDefendre}
                    onChange={e => setNewPointDefendre(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPointDefendre()}
                    placeholder="ex : DPE F à mentionner"
                    className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-propsight-400"
                  />
                  <button
                    type="button"
                    onClick={addPointDefendre}
                    className="px-3 py-1.5 bg-propsight-600 text-white rounded-md text-sm hover:bg-propsight-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with live AVM */}
        <div className="border-t border-slate-200 px-6 py-4">
          {avm && (
            <div className="flex items-center gap-4 mb-3 py-2 px-3 bg-slate-50 rounded-md border border-slate-200">
              <div className="flex-1">
                <p className="text-xs text-slate-500">Estimation AVM live</p>
                <p className="text-base font-semibold text-slate-900">{avm.prix.estimation.toLocaleString('fr-FR')} €</p>
                <p className="text-xs text-slate-400">{avm.prix.prix_m2.toLocaleString('fr-FR')} €/m²</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Fiabilité</p>
                <div className={`flex gap-0.5 ${confidenceColor}`}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= confidenceDots ? 'bg-current' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <p className={`text-xs mt-0.5 capitalize ${confidenceColor}`}>{avm.prix.confiance_label}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={14} />
                  Précédent
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {step < 3 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 transition-colors"
                >
                  Passer cette étape
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm bg-propsight-600 text-white rounded-md hover:bg-propsight-700 transition-colors"
                >
                  Suivant
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-1.5 text-sm bg-propsight-600 text-white rounded-md hover:bg-propsight-700 transition-colors font-medium"
                >
                  {submitLabel || "Créer l'estimation"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardCreation;
