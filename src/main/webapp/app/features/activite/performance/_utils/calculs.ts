import { Hypotheses } from '../types';

export interface MarcheCalcs {
  marcheAdressable: number;
  potentielCible: number;
  ecartAuPotentiel: number;
}

export const computeMarche = (
  volumeDvf: number,
  hypotheses: Hypotheses,
  partCapteeActuelle: number,
): MarcheCalcs => {
  const marcheAdressable = Math.round(volumeDvf * hypotheses.panierMoyen * (hypotheses.commissionMoyenne / 100));
  const potentielCible = Math.round(marcheAdressable * (hypotheses.partCaptableCible / 100));
  const caCapteActuel = Math.round(marcheAdressable * (partCapteeActuelle / 100));
  const ecartAuPotentiel = Math.max(0, potentielCible - caCapteActuel);
  return { marcheAdressable, potentielCible, ecartAuPotentiel };
};

export const formatEur = (n: number): string => `${n.toLocaleString('fr-FR')} €`;

export const formatEurCompact = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')} M€`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')} k€`;
  return `${n} €`;
};
