// Extended API functions for Tier 1 features

const BASE = 'https://api.llama.fi';

// Historical volume chart data from DefiLlama
export async function fetchVolumeHistory(): Promise<{date: number; volume: number}[]> {
  const res = await fetch(`${BASE}/overview/dexs?excludeTotalDataChartBreakdown=true&dataType=dailyVolume`, {
    next: { revalidate: 600 },
  });
  const data = await res.json();
  return (data.totalDataChart || []).map((p: [number, number]) => ({
    date: p[0] * 1000,
    volume: p[1],
  }));
}

// Historical OI chart data
export async function fetchOIHistory(): Promise<{date: number; oi: number}[]> {
  const res = await fetch(`${BASE}/overview/open-interest?excludeTotalDataChartBreakdown=true`, {
    next: { revalidate: 600 },
  });
  const data = await res.json();
  return (data.totalDataChart || []).map((p: [number, number]) => ({
    date: p[0] * 1000,
    oi: p[1],
  }));
}

// CoinGecko token data for DEX tokens
export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  mcap: number;
  fdv: number;
  volume24h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  ath: number;
  athDate: string;
  sparkline: number[];
}

const DEX_TOKEN_IDS = [
  'hyperliquid', 'dydx-chain', 'gmx', 'jupiter-exchange-solana',
  'drift-protocol', 'vertex-protocol', 'aevo-exchange',
  'kwenta', 'bluefin-2', 'orderly-network',
  'havven', 'apex-token-2', 'myx-finance',
];

export async function fetchDexTokens(): Promise<TokenData[]> {
  const ids = DEX_TOKEN_IDS.join(',');
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=7d,30d`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    symbol: (c.symbol || '').toUpperCase(),
    price: c.current_price || 0,
    mcap: c.market_cap || 0,
    fdv: c.fully_diluted_valuation || 0,
    volume24h: c.total_volume || 0,
    change24h: c.price_change_percentage_24h || 0,
    change7d: c.price_change_percentage_7d_in_currency || 0,
    change30d: c.price_change_percentage_30d_in_currency || 0,
    ath: c.ath || 0,
    athDate: c.ath_date || '',
    sparkline: c.sparkline_in_7d?.price || [],
  }));
}

// Hyperliquid per-market OI breakdown
export interface MarketOI {
  name: string;
  oiUsd: number;
  oiCoins: number;
  markPrice: number;
  funding: number;
  pctOfTotal: number;
}

export async function fetchHyperliquidOIBreakdown(): Promise<{markets: MarketOI[]; totalOI: number}> {
  const res = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) return { markets: [], totalOI: 0 };

  const meta = data[0];
  const ctxs = data[1];

  const markets = meta.universe.map((m: any, i: number) => {
    const c = ctxs[i] || {};
    const markPrice = parseFloat(c.markPx || '0');
    const oi = parseFloat(c.openInterest || '0');
    return {
      name: m.name,
      oiUsd: oi * markPrice,
      oiCoins: oi,
      markPrice,
      funding: parseFloat(c.funding || '0'),
    };
  }).filter((m: any) => m.oiUsd > 1000)
    .sort((a: any, b: any) => b.oiUsd - a.oiUsd);

  const totalOI = markets.reduce((s: number, m: any) => s + m.oiUsd, 0);
  return {
    markets: markets.map((m: any) => ({ ...m, pctOfTotal: (m.oiUsd / totalOI) * 100 })),
    totalOI,
  };
}

// Hyperliquid order book depth for top markets
export interface BookDepth {
  coin: string;
  bidDepth1pct: number; // USD within 1% of mid
  askDepth1pct: number;
  spread: number;
  midPrice: number;
}

export async function fetchOrderBookDepth(coins: string[]): Promise<BookDepth[]> {
  const results: BookDepth[] = [];
  for (const coin of coins.slice(0, 15)) {
    try {
      const res = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'l2Book', coin }),
        next: { revalidate: 30 },
      });
      const data = await res.json();
      const levels = data.levels || [];
      if (levels.length < 2) continue;

      const bids = levels[0] || [];
      const asks = levels[1] || [];
      if (!bids.length || !asks.length) continue;

      const bestBid = parseFloat(bids[0].px);
      const bestAsk = parseFloat(asks[0].px);
      const mid = (bestBid + bestAsk) / 2;
      const spread = ((bestAsk - bestBid) / mid) * 100;

      // Sum depth within 1% of mid
      const threshold = mid * 0.01;
      let bidDepth = 0;
      for (const b of bids) {
        const px = parseFloat(b.px);
        if (mid - px <= threshold) bidDepth += parseFloat(b.sz) * px;
      }
      let askDepth = 0;
      for (const a of asks) {
        const px = parseFloat(a.px);
        if (px - mid <= threshold) askDepth += parseFloat(a.sz) * px;
      }

      results.push({ coin, bidDepth1pct: bidDepth, askDepth1pct: askDepth, spread, midPrice: mid });
    } catch { /* skip failed markets */ }
  }
  return results;
}

// Hyperliquid global stats
export async function fetchHyperliquidStats(): Promise<{totalVolume: number; dailyVolume: number; users: number}> {
  const res = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'globalStats' }),
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return {
    totalVolume: data.totalVolume || 0,
    dailyVolume: data.dailyVolume || 0,
    users: data.nUsers || 0,
  };
}




// Staking info (manually maintained)
export const STAKING_INFO: Record<string, { stakingAPY: string; stakingBenefit: string; stakedPct: string }> = {
  HYPE: { stakingAPY: '~2.5%', stakingBenefit: 'Validator rewards, governance', stakedPct: '~30%' },
  DYDX: { stakingAPY: '~15%', stakingBenefit: 'Governance, safety module', stakedPct: '~22%' },
  GMX: { stakingAPY: '~5-8%', stakingBenefit: 'Fee sharing (30% of fees), esGMX rewards', stakedPct: '~80%' },
  JUP: { stakingAPY: '~4%', stakingBenefit: 'Governance, launchpad access', stakedPct: '~35%' },
  SNX: { stakingAPY: '~8-12%', stakingBenefit: 'Fee sharing, inflation rewards, required for minting', stakedPct: '~60%' },
  DRIFT: { stakingAPY: '~6%', stakingBenefit: 'Fee discounts, governance', stakedPct: '~25%' },
  VERTEX: { stakingAPY: '~5%', stakingBenefit: 'Fee discounts, vesting acceleration', stakedPct: '~40%' },
  APEX: { stakingAPY: '~10%', stakingBenefit: 'Fee discounts, governance, buyback', stakedPct: '~45%' },
  AEVO: { stakingAPY: '~3%', stakingBenefit: 'Fee discounts', stakedPct: '~15%' },
  KWENTA: { stakingAPY: '~12%', stakingBenefit: 'Fee sharing, inflation rewards', stakedPct: '~55%' },
  MYX: { stakingAPY: '~8%', stakingBenefit: 'Fee discounts, governance', stakedPct: '~30%' },
  ORDER: { stakingAPY: '~5%', stakingBenefit: 'Fee discounts', stakedPct: '~20%' },
};
