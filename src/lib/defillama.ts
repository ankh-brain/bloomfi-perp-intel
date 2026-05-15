// DefiLlama API integration for perp DEX data
// All endpoints are free, no API key needed

const BASE = 'https://api.llama.fi';

export interface PerpProtocol {
  name: string;
  slug: string;
  openInterest: number;
  fees24h: number;
  fees30d: number;
  volume24h: number;
  volume30d: number;
  chains: string[];
  change1d: number;
  change7d: number;
  change30d: number;
  marketShare: number;
  category: string;
}

export interface MarketOverview {
  totalOI: number;
  totalFees24h: number;
  totalFees30d: number;
  totalVolume24h: number;
  protocols: PerpProtocol[];
  lastUpdated: string;
}

// Key perp DEX protocols we track
const PERP_NAMES = new Set([
  'hyperliquid perps', 'lighter perps', 'aster perps', 'dydx v4',
  'drift trade', 'gmx v2 perps', 'vertex perps', 'bluefin pro',
  'orderly perps', 'jupiter perpetual exchange', 'aevo',
  'kwenta', 'apex omni', 'rabbitx', 'edgex perps',
  'grvt perps', 'variational', 'tradexyz', 'extended',
  'nado perps', 'paradex', 'gmtrade', 'boros',
  'standx perps', 'pacifica', 'ethereal',
]);

function isPerp(name: string): boolean {
  const lower = name.toLowerCase();
  return PERP_NAMES.has(lower) || lower.includes('perp');
}

export async function fetchOpenInterest(): Promise<Record<string, any>[]> {
  const res = await fetch(`${BASE}/overview/open-interest?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`, {
    next: { revalidate: 300 } // 5 min cache
  });
  const data = await res.json();
  return data.protocols || [];
}

export async function fetchFees(): Promise<Record<string, any>[]> {
  const res = await fetch(`${BASE}/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`, {
    next: { revalidate: 300 }
  });
  const data = await res.json();
  return data.protocols || [];
}

export async function fetchDexVolumes(): Promise<Record<string, any>[]> {
  const res = await fetch(`${BASE}/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`, {
    next: { revalidate: 300 }
  });
  const data = await res.json();
  return data.protocols || [];
}

export async function fetchProtocolTVL(slug: string): Promise<number> {
  try {
    const res = await fetch(`${BASE}/tvl/${slug}`, { next: { revalidate: 300 } });
    const tvl = await res.json();
    return typeof tvl === 'number' ? tvl : 0;
  } catch { return 0; }
}

export async function fetchMarketOverview(): Promise<MarketOverview> {
  const [oiData, feesData, volData] = await Promise.all([
    fetchOpenInterest(),
    fetchFees(),
    fetchDexVolumes(),
  ]);

  // Build lookup maps
  const feeMap = new Map<string, any>();
  for (const p of feesData) {
    const name = p.name?.toLowerCase();
    if (name) feeMap.set(name, p);
  }

  const volMap = new Map<string, any>();
  for (const p of volData) {
    const name = p.name?.toLowerCase();
    if (name) volMap.set(name, p);
  }

  // Merge data with OI as primary
  const totalOI = oiData.reduce((sum, p) => sum + (p.total24h || 0), 0);
  
  const protocols: PerpProtocol[] = oiData
    .filter(p => p.total24h > 0)
    .map(p => {
      const name = p.name || '';
      const lower = name.toLowerCase();
      const fees = feeMap.get(lower) || {};
      
      // Try to find volume - derivatives protocols often have separate names
      let vol = volMap.get(lower) || {};
      // Try without "perps" suffix
      if (!vol.total24h) {
        const spotName = lower.replace(' perps', ' spot').replace(' perps', '');
        vol = volMap.get(spotName) || {};
      }

      return {
        name: p.name,
        slug: p.module || p.name.toLowerCase().replace(/\s+/g, '-'),
        openInterest: p.total24h || 0,
        fees24h: fees.total24h || 0,
        fees30d: fees.total30d || 0,
        volume24h: vol.total24h || 0,
        volume30d: vol.total30d || 0,
        chains: p.chains || [],
        change1d: p.change_1d || 0,
        change7d: p.change_7d || 0,
        change30d: p.change_1m || 0,
        marketShare: totalOI > 0 ? (p.total24h || 0) / totalOI * 100 : 0,
        category: p.category || 'Derivatives',
      };
    })
    .sort((a, b) => b.openInterest - a.openInterest);

  const totalFees24h = protocols.reduce((s, p) => s + p.fees24h, 0);
  const totalFees30d = protocols.reduce((s, p) => s + p.fees30d, 0);
  const totalVolume24h = protocols.reduce((s, p) => s + p.volume24h, 0);

  return {
    totalOI,
    totalFees24h,
    totalFees30d,
    totalVolume24h,
    protocols,
    lastUpdated: new Date().toISOString(),
  };
}

// Historical OI data for charts
export async function fetchOIHistory(): Promise<any> {
  const res = await fetch(`${BASE}/overview/open-interest?excludeTotalDataChartBreakdown=true`, {
    next: { revalidate: 600 }
  });
  return res.json();
}

// Historical fee data  
export async function fetchFeeHistory(protocol: string): Promise<any> {
  const res = await fetch(`${BASE}/summary/fees/${protocol}`, {
    next: { revalidate: 600 }
  });
  return res.json();
}

// Yield/funding rates for perps
export async function fetchPerpYields(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE}/pools`, { next: { revalidate: 600 } });
    const data = await res.json();
    // Filter for perp-related pools
    return (data.data || []).filter((p: any) => 
      p.project?.toLowerCase().includes('perp') || 
      p.category?.toLowerCase().includes('perp') ||
      p.pool?.toLowerCase().includes('perp')
    );
  } catch { return []; }
}

export function formatUSD(value: number, decimals = 1): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`;
  return `$${value.toFixed(decimals)}`;
}

export function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

