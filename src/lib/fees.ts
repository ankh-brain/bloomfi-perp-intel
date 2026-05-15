// Fee structures for all major perp DEXs
export interface PlatformFees {
  name: string;
  makerFee: number; // in bps
  takerFee: number; // in bps
  model: 'orderbook' | 'oracle' | 'hybrid';
  notes: string;
  feeOnClose: boolean;
  additionalFees: string;
  stakingDiscount: string;
}

export const PLATFORM_FEES: PlatformFees[] = [
  { name: 'Hyperliquid', makerFee: 1.5, takerFee: 4.5, model: 'orderbook', notes: 'Volume-tiered. HYPE staking gives up to 40% discount.', feeOnClose: true, additionalFees: 'Funding rate only', stakingDiscount: 'Up to 40% with HYPE staking' },
  { name: 'Lighter', makerFee: 0, takerFee: 0, model: 'orderbook', notes: 'Zero fees for standard accounts. Premium: 0.2 bps maker, 2 bps taker for low latency.', feeOnClose: true, additionalFees: 'Premium tier optional (lower latency)', stakingDiscount: 'N/A (already zero)' },
  { name: 'Aster', makerFee: 0, takerFee: 4, model: 'orderbook', notes: 'Maker rebates available. Competitive with Hyperliquid.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'Fee tiers with volume' },
  { name: 'dYdX', makerFee: 2, takerFee: 5, model: 'orderbook', notes: 'Volume-tiered. Higher base than Hyperliquid.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'Fee reduction with DYDX staking' },
  { name: 'Jupiter Perps', makerFee: 6, takerFee: 6, model: 'oracle', notes: 'Flat 0.06% open/close. No maker/taker distinction. Oracle-priced = zero slippage.', feeOnClose: true, additionalFees: 'Borrow fee (hourly), price impact fee', stakingDiscount: 'None' },
  { name: 'GMX V2', makerFee: 5, takerFee: 7, model: 'oracle', notes: 'Oracle-priced. 0.05-0.07% depending on market impact.', feeOnClose: true, additionalFees: 'Borrow fee, price impact', stakingDiscount: 'None (but GMX stakers earn 30% of fees)' },
  { name: 'Drift', makerFee: 0, takerFee: 10, model: 'hybrid', notes: 'Dynamic fees. Maker often gets rebates.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'DRIFT staking for discounts' },
  { name: 'Vertex', makerFee: 0, takerFee: 2, model: 'orderbook', notes: 'Lowest non-zero taker fee among CLOB DEXs.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'VRTX staking for discounts' },
  { name: 'Avantis', makerFee: 6, takerFee: 6, model: 'oracle', notes: 'Oracle-based like Jupiter. Flat fee model.', feeOnClose: true, additionalFees: 'Borrow fee, rollover fee', stakingDiscount: 'None' },
  { name: 'Apex Protocol', makerFee: 1, takerFee: 5, model: 'orderbook', notes: 'StarkEx-based. Volume-tiered discounts.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'APEX staking for tier upgrades' },
  { name: 'Synthetix/Kwenta', makerFee: 2, takerFee: 6, model: 'oracle', notes: 'Oracle-priced via Pyth. Dynamic fees based on skew.', feeOnClose: true, additionalFees: 'Dynamic funding (skew-based)', stakingDiscount: 'SNX staking required for minting' },
  { name: 'MYX Finance', makerFee: 0, takerFee: 5, model: 'hybrid', notes: 'Zero maker fees. Competitive taker rates.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'MYX staking for discounts' },
  { name: 'Orderly', makerFee: 1, takerFee: 3, model: 'orderbook', notes: 'Infrastructure layer. White-label friendly.', feeOnClose: true, additionalFees: 'Funding rate', stakingDiscount: 'ORDER staking for discounts' },
  { name: 'BloomFi (proposed)', makerFee: 2, takerFee: 5, model: 'orderbook', notes: '70% of all fees returned to depositors. Net cost to ecosystem is much lower.', feeOnClose: true, additionalFees: 'Funding rate. 70/30 fee split.', stakingDiscount: 'TBD (BLOSM token)' },
];

// Calculate cost of a $100K position
export function calcPositionCost(fees: PlatformFees, positionSize: number): { openCost: number; closeCost: number; roundTrip: number; roundTripPct: number } {
  const openCost = positionSize * (fees.takerFee / 10000);
  const closeCost = fees.feeOnClose ? positionSize * (fees.takerFee / 10000) : 0;
  const roundTrip = openCost + closeCost;
  return { openCost, closeCost, roundTrip, roundTripPct: (roundTrip / positionSize) * 100 };
}

