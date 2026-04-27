/**
 * Mensualité d'un crédit à amortissement constant (capital + intérêts uniquement).
 * Pas d'assurance — la formule du simulateur complet (calcInvest) la prend en compte.
 *
 * @param montantEmprunte capital emprunté en euros
 * @param tauxAnnuel taux nominal annuel en pourcentage (ex 3.8 pour 3,8 %)
 * @param dureeAnnees durée en années
 * @returns mensualité en euros (0 si montant <= 0)
 */
export function amortizationMonthly(montantEmprunte: number, tauxAnnuel: number, dureeAnnees: number): number {
  if (montantEmprunte <= 0) return 0;
  if (dureeAnnees <= 0) return montantEmprunte;

  const tauxMensuel = tauxAnnuel / 100 / 12;
  const dureeMois = dureeAnnees * 12;

  if (tauxMensuel === 0) {
    return montantEmprunte / dureeMois;
  }

  return (montantEmprunte * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -dureeMois));
}
