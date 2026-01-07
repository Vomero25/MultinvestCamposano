
export const ZURICH_COLORS = {
  primary: '#003399', // Zurich Blue
  secondary: '#0099CC', // Zurich Light Blue
  accent: '#FFCC00', // Gold accent
  success: '#10B981',
  danger: '#EF4444',
  text: '#1e293b'
};

export const CAMPAIGN_DATES = "16/12/2025 - 28/02/2026";

// Added missing SACRIFICE_BONUS_RATE constant to fix the import error in App.tsx
export const SACRIFICE_BONUS_RATE = 1.0;

export const PRODUCT_SPECS = {
  MAX_GS_PERCENT: 90, // Campagna Dec 2025
  MAX_GS_AMOUNT: 1000000, // 1 milione di Euro
  EMISSION_FEE_THRESHOLD: 20000,
  EMISSION_FEE_AMOUNT: 75,
  CERTIFIED_GS_RETURN: 2.87, // Settembre 2025
};

export interface PenaltyClass {
  y1: number; y2: number; y3: number; y4: number; y5: number; y6: number;
}

export interface CPPClass {
  id: 'A' | 'B' | 'C';
  label: string;
  minInitial: number;
  bonusInitial: number; // 1% Campaign
  gsBonusY1: number; // 0.5% GS only
  gsBonusY2: number; // 1.0% GS only
  gsFee: number;
  lgFee5Y: number; // First 5 years
  lgFeeAfter5Y: number; // After 5 years
  insCost5Y: number; // First 5 years (<= 70y)
  insCostAfter5Y: number;
  penalties: PenaltyClass;
  canSacrifice: boolean;
}

export const CPP_CLASSES: CPPClass[] = [
  {
    id: 'A',
    label: 'CPP A',
    minInitial: 15000,
    bonusInitial: 1.0,
    gsBonusY1: 0.5,
    gsBonusY2: 1.0,
    gsFee: 1.50,
    lgFee5Y: 2.95,
    lgFeeAfter5Y: 2.15,
    insCost5Y: 0.15,
    insCostAfter5Y: 0.05,
    penalties: { y1: 4.0, y2: 3.5, y3: 2.75, y4: 1.5, y5: 1.0, y6: 0 },
    canSacrifice: true
  },
  {
    id: 'B',
    label: 'CPP B',
    minInitial: 15000,
    bonusInitial: 1.0,
    gsBonusY1: 0.5,
    gsBonusY2: 1.0,
    gsFee: 1.10,
    lgFee5Y: 2.15,
    lgFeeAfter5Y: 2.15,
    insCost5Y: 0.15,
    insCostAfter5Y: 0.05,
    penalties: { y1: 2.5, y2: 2.0, y3: 1.5, y4: 1.0, y5: 0.5, y6: 0 },
    canSacrifice: false
  },
  {
    id: 'C',
    label: 'CPP C',
    minInitial: 250000,
    bonusInitial: 1.0,
    gsBonusY1: 0.5,
    gsBonusY2: 1.0,
    gsFee: 0.90,
    lgFee5Y: 1.70,
    lgFeeAfter5Y: 1.70,
    insCost5Y: 0.15,
    insCostAfter5Y: 0.05,
    penalties: { y1: 2.0, y2: 1.5, y3: 1.0, y4: 0.7, y5: 0.5, y6: 0 },
    canSacrifice: false
  }
];
