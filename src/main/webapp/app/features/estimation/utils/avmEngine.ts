import { EstimationFormData, AvmResult } from '../types';

function getPrixM2Base(ville: string, codePostal: string): number {
  const cp = codePostal.slice(0, 2);
  if (cp === '75') {
    const arr = parseInt(codePostal.slice(3), 10) || 1;
    const base = 10000;
    const mod = [1.15, 1.20, 1.18, 1.05, 1.00, 1.08, 1.12, 1.25, 1.30, 1.28, 0.95, 0.92, 0.90, 0.88, 0.95, 0.92, 0.95, 0.90, 0.88, 0.85];
    return Math.round(base * (mod[arr - 1] || 1.0));
  }
  if (cp === '69') return 5200;
  if (cp === '33') return 4800;
  if (cp === '13') return 4200;
  if (cp === '31') return 4400;
  if (cp === '59') return 3800;
  if (cp === '92' || cp === '93' || cp === '94') return 7500;
  return 3500;
}

export function computeAvm(data: Partial<EstimationFormData>): AvmResult | null {
  if (!data.surface || !data.nb_pieces || !data.type_bien) return null;

  const surface = data.surface || 0;
  const ville = data.ville || '';
  const codePostal = data.code_postal || '75001';

  let prixM2 = getPrixM2Base(ville, codePostal);
  const ajustements: AvmResult['ajustements'] = [];

  if (data.etat === 'refait_a_neuf') {
    prixM2 = Math.round(prixM2 * 1.08);
    ajustements.push({ libelle: 'Refait à neuf', delta_pct: 8.1, delta_m2: Math.round(prixM2 * 0.081), positif: true });
  } else if (data.etat === 'neuf') {
    prixM2 = Math.round(prixM2 * 1.12);
    ajustements.push({ libelle: 'Bien neuf', delta_pct: 12, delta_m2: Math.round(prixM2 * 0.12), positif: true });
  } else if (data.etat === 'a_rafraichir') {
    prixM2 = Math.round(prixM2 * 0.95);
    ajustements.push({ libelle: 'À rafraîchir', delta_pct: 5, delta_m2: -Math.round(prixM2 * 0.05), positif: false });
  } else if (data.etat === 'a_renover') {
    prixM2 = Math.round(prixM2 * 0.85);
    ajustements.push({ libelle: 'À rénover', delta_pct: 15, delta_m2: -Math.round(prixM2 * 0.15), positif: false });
  } else if (data.etat === 'a_restructurer') {
    prixM2 = Math.round(prixM2 * 0.72);
    ajustements.push({ libelle: 'À restructurer', delta_pct: 28, delta_m2: -Math.round(prixM2 * 0.28), positif: false });
  }

  if (data.dpe === 'A' || data.dpe === 'B') {
    prixM2 = Math.round(prixM2 * 1.03);
    ajustements.push({ libelle: `DPE ${data.dpe} — Excellent`, delta_pct: 3, delta_m2: Math.round(prixM2 * 0.03), positif: true });
  } else if (data.dpe === 'E') {
    prixM2 = Math.round(prixM2 * 0.98);
    ajustements.push({ libelle: 'DPE E', delta_pct: 2, delta_m2: -Math.round(prixM2 * 0.02), positif: false });
  } else if (data.dpe === 'F') {
    prixM2 = Math.round(prixM2 * 0.93);
    ajustements.push({ libelle: 'DPE F — Passoire', delta_pct: 7, delta_m2: -Math.round(prixM2 * 0.07), positif: false });
  } else if (data.dpe === 'G') {
    prixM2 = Math.round(prixM2 * 0.88);
    ajustements.push({ libelle: 'DPE G — Passoire', delta_pct: 12, delta_m2: -Math.round(prixM2 * 0.12), positif: false });
  }

  const carac = data.caracteristiques || [];
  if (carac.includes('balcon')) { prixM2 = Math.round(prixM2 * 1.015); ajustements.push({ libelle: 'Balcon', delta_pct: 1.5, delta_m2: Math.round(prixM2 * 0.015), positif: true }); }
  if (carac.includes('terrasse')) { prixM2 = Math.round(prixM2 * 1.03); ajustements.push({ libelle: 'Terrasse', delta_pct: 3, delta_m2: Math.round(prixM2 * 0.03), positif: true }); }
  if (carac.includes('parking')) { prixM2 = Math.round(prixM2 * 1.02); ajustements.push({ libelle: 'Parking', delta_pct: 2, delta_m2: Math.round(prixM2 * 0.02), positif: true }); }
  if (carac.includes('piscine')) { prixM2 = Math.round(prixM2 * 1.05); ajustements.push({ libelle: 'Piscine', delta_pct: 5, delta_m2: Math.round(prixM2 * 0.05), positif: true }); }

  if (data.annee_construction && data.annee_construction < 1950) {
    prixM2 = Math.round(prixM2 * 0.98);
    ajustements.push({ libelle: `Construction ${data.annee_construction}`, delta_pct: 2, delta_m2: -Math.round(prixM2 * 0.02), positif: false });
  } else if (data.annee_construction && data.annee_construction > 2010) {
    prixM2 = Math.round(prixM2 * 1.04);
    ajustements.push({ libelle: 'Construction récente', delta_pct: 4, delta_m2: Math.round(prixM2 * 0.04), positif: true });
  }

  if (data.etage && data.etage > 3 && carac.includes('ascenseur')) {
    prixM2 = Math.round(prixM2 * 1.02);
    ajustements.push({ libelle: 'Étage élevé + ascenseur', delta_pct: 2, delta_m2: Math.round(prixM2 * 0.02), positif: true });
  }

  const champsRemplis = [data.adresse, data.type_bien, data.surface, data.nb_pieces, data.etat, data.dpe].filter(Boolean).length;
  const confiance = Math.max(0.45, Math.min(0.92, 0.45 + champsRemplis * 0.08));
  const confiance_label: 'faible' | 'bon' | 'fort' = confiance >= 0.75 ? 'fort' : confiance >= 0.55 ? 'bon' : 'faible';

  const prix = Math.round(prixM2 * surface);
  const loyer = Math.round(prix * 0.0035);

  const comparables: AvmResult['comparables'] = Array.from({ length: 5 }, (_, i) => ({
    id: `comp_gen_${i}`,
    adresse: `${10 + i * 3} rue ${['du Hameau', 'Blomet', 'Lecourbe', 'Félix Faure', 'Péclet'][i]}`,
    type: i % 2 === 0 ? 'dvf' : ('annonce' as 'dvf' | 'annonce'),
    surface: Math.round(surface * (0.9 + i * 0.06)),
    nb_pieces: data.nb_pieces || 2,
    etage: Math.max(0, (data.etage || 1) + (i % 3 - 1)),
    dpe: data.dpe || 'D',
    prix: Math.round(prix * (0.92 + i * 0.04)),
    prix_m2: Math.round(prixM2 * (0.92 + i * 0.04)),
    date: new Date(2024, i * 2, 15).toISOString().split('T')[0],
    score_similarite: Math.round((0.95 - i * 0.05) * 100) / 100,
    photo_url: `https://picsum.photos/seed/gencomp${i}/400/300`,
  }));

  const prixM2Base = getPrixM2Base(ville, codePostal);

  return {
    prix: {
      estimation: prix,
      fourchette_basse: Math.round(prix * 0.94),
      fourchette_haute: Math.round(prix * 1.06),
      prix_m2: prixM2,
      confiance,
      confiance_label,
    },
    loyer: {
      estimation: loyer,
      fourchette_basse: Math.round(loyer * 0.92),
      fourchette_haute: Math.round(loyer * 1.12),
      loyer_m2: Math.round(prixM2 * 0.0035 * 10) / 10,
      rendement_brut: Math.round((loyer * 12 / prix) * 1000) / 10,
    },
    ajustements: ajustements.slice(0, 6),
    comparables,
    marche_reference: {
      prix_m2_bas: Math.round(prixM2Base * 0.85),
      prix_m2_median: prixM2Base,
      prix_m2_haut: Math.round(prixM2Base * 1.15),
      ecart_vs_marche_pct: Math.round(((prixM2 - prixM2Base) / prixM2Base) * 1000) / 10,
    },
  };
}

export function computeSolvabilite(
  prix: number,
  ville: string,
): { part_eligible: number; benchmark: number; revenu_necessaire: number; repartition: { personne_seule: number; couple: number; famille: number; monoparental: number } } {
  const distributions: Record<string, number[]> = {
    Paris: [1400, 1800, 2200, 2600, 3000, 3500, 4200, 5200, 7000],
    Lyon: [1200, 1550, 1900, 2250, 2600, 3100, 3700, 4600, 6200],
    Bordeaux: [1150, 1500, 1850, 2200, 2550, 3000, 3600, 4400, 5900],
  };
  const dist = distributions[ville] || [1050, 1350, 1650, 1950, 2250, 2650, 3100, 3800, 5000];

  const mensualite = (prix * 0.9) / 300;
  const revenu_necessaire = Math.round((mensualite / 0.33) * 1.15);

  let decile = 9;
  for (let i = 0; i < dist.length; i++) {
    if (revenu_necessaire <= dist[i]) {
      decile = i;
      break;
    }
  }
  const part_eligible = Math.round((1 - decile / 9) * 100) / 100;
  const benchmarkRaw = part_eligible + (0.07 - 0.05);
  const benchmark = Math.max(0.05, Math.min(0.6, Math.round(benchmarkRaw * 100) / 100));

  return {
    part_eligible,
    benchmark,
    revenu_necessaire,
    repartition: {
      personne_seule: Math.min(1, Math.round(part_eligible * 0.6 * 100) / 100),
      couple: Math.min(1, Math.round(part_eligible * 1.7 * 100) / 100),
      famille: Math.min(1, Math.round(part_eligible * 0.45 * 100) / 100),
      monoparental: Math.min(1, Math.round(part_eligible * 0.25 * 100) / 100),
    },
  };
}
