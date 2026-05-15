// Token Terminal revenue data (scraped May 2026)
// Source: tokenterminal.com - manually updated
// To automate: get Token Terminal API key ($300/mo)

export interface TokenTerminalData {
  name: string;
  ticker: string;
  fdvMarketCap: number;
  fees30d: number;
  revenue30d: number;
  volume30d: number;
  annualizedRevenue: number;
  peRatio: number; // FDV / annualized revenue
  revenuePerBillion: number; // revenue per $1B volume
  lastUpdated: string;
}

// Data scraped from Token Terminal on May 15, 2026
export const TOKEN_TERMINAL_DATA: TokenTerminalData[] = [
  {
    name: 'Hyperliquid', ticker: 'HYPE',
    fdvMarketCap: 42500000000, fees30d: 48400000, revenue30d: 48400000,
    volume30d: 182900000000, annualizedRevenue: 48400000 * 12,
    peRatio: 42500000000 / (48400000 * 12),
    revenuePerBillion: 48400000 / (182900000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'Lighter', ticker: 'LIT',
    fdvMarketCap: 2000000000, fees30d: 2800000, revenue30d: 2800000,
    volume30d: 70000000000, annualizedRevenue: 2800000 * 12,
    peRatio: 2000000000 / (2800000 * 12),
    revenuePerBillion: 2800000 / (70000000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'Aster', ticker: 'ASTER',
    fdvMarketCap: 5700000000, fees30d: 6000000, revenue30d: 6000000,
    volume30d: 95000000000, annualizedRevenue: 6000000 * 12,
    peRatio: 5700000000 / (6000000 * 12),
    revenuePerBillion: 6000000 / (95000000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'edgeX', ticker: 'EDGE',
    fdvMarketCap: 1400000000, fees30d: 12000000, revenue30d: 12000000,
    volume30d: 45000000000, annualizedRevenue: 12000000 * 12,
    peRatio: 1400000000 / (12000000 * 12),
    revenuePerBillion: 12000000 / (45000000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'dYdX', ticker: 'DYDX',
    fdvMarketCap: 145000000, fees30d: 300000, revenue30d: 300000,
    volume30d: 2000000000, annualizedRevenue: 300000 * 12,
    peRatio: 145000000 / (300000 * 12),
    revenuePerBillion: 300000 / (2000000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'Jupiter Perps', ticker: 'JUP',
    fdvMarketCap: 1500000000, fees30d: 7200000, revenue30d: 5400000,
    volume30d: 12000000000, annualizedRevenue: 5400000 * 12,
    peRatio: 1500000000 / (5400000 * 12),
    revenuePerBillion: 5400000 / (12000000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'GMX', ticker: 'GMX',
    fdvMarketCap: 74000000, fees30d: 2300000, revenue30d: 700000,
    volume30d: 1500000000, annualizedRevenue: 700000 * 12,
    peRatio: 74000000 / (700000 * 12),
    revenuePerBillion: 700000 / (1500000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
  {
    name: 'Synthetix/Kwenta', ticker: 'SNX',
    fdvMarketCap: 500000000, fees30d: 1500000, revenue30d: 1200000,
    volume30d: 3000000000, annualizedRevenue: 1200000 * 12,
    peRatio: 500000000 / (1200000 * 12),
    revenuePerBillion: 1200000 / (3000000000 / 1e9),
    lastUpdated: '2026-05-15',
  },
];

export function formatRevenue(n: number): string {
  if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

