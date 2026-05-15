// Hyperliquid public API - no auth needed
export interface HyperMarket {
  name: string;
  funding: number;
  openInterest: number;
  markPrice: number;
  oiValue: number; // OI in USD
}

export async function fetchHyperliquidMarkets(): Promise<HyperMarket[]> {
  const res = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) return [];
  
  const meta = data[0];
  const ctxs = data[1];
  
  return meta.universe.map((m: any, i: number) => {
    const c = ctxs[i] || {};
    const markPrice = parseFloat(c.markPx || '0');
    const oi = parseFloat(c.openInterest || '0');
    return {
      name: m.name,
      funding: parseFloat(c.funding || '0'),
      openInterest: oi,
      markPrice,
      oiValue: oi * markPrice,
    };
  }).filter((m: HyperMarket) => m.oiValue > 0)
    .sort((a: HyperMarket, b: HyperMarket) => b.oiValue - a.oiValue);
}

// dYdX public API
export interface DydxMarket {
  ticker: string;
  funding: number;
  openInterest: number;
  markPrice: number;
  oiValue: number;
}

export async function fetchDydxMarkets(): Promise<DydxMarket[]> {
  const res = await fetch('https://indexer.dydx.trade/v4/perpetualMarkets', {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const markets = data.markets || {};
  
  return Object.entries(markets).map(([ticker, m]: [string, any]) => {
    const oi = parseFloat(m.openInterest || '0');
    const price = parseFloat(m.oraclePrice || '0');
    return {
      ticker,
      funding: parseFloat(m.nextFundingRate || '0'),
      openInterest: oi,
      markPrice: price,
      oiValue: oi * price,
    };
  }).filter(m => m.oiValue > 1000)
    .sort((a, b) => b.oiValue - a.oiValue);
}

export function fundingToAnnual(hourlyRate: number): number {
  return hourlyRate * 8760 * 100; // hourly * hours/year * 100 for percentage
}

export function fundingTo8h(hourlyRate: number): number {
  return hourlyRate * 100; // just convert to percentage
}

