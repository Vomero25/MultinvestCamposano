
export interface SimulationState {
  initialPremium: number;
  gestioneSeparataWeight: number; // Percentage (0-100)
  lineaGestitaWeight: number; // Percentage (0-100)
  expectedReturnGS: number; // Annual %
  expectedReturnLG: number; // Annual %
  applyCampaignBonus: boolean;
  applySacrificeBonus: boolean;
  years: number;
}

export interface CalculationResult {
  totalInitialInvestment: number;
  bonusAmount: number;
  projectedValueGS: number;
  projectedValueLG: number;
  totalProjectedValue: number;
  totalNetReturn: number;
  annualNetReturn: number;
  costsTotal: number;
}

export enum ProductTab {
  OVERVIEW = 'Home',
  SIMULATOR = 'Simulatore Bonus',
  PROTECTION = 'Tutela e Casi Reali',
  TECHNICAL_SHEET = 'Caratteristiche Prodotto',
  FULL_SHEET = 'Scheda Tecnica Completa',
  COSTS = 'Costi e Penali'
}
