import { fetchHyperliquidOIBreakdown } from '@/lib/extended';
import { formatUSD } from '@/lib/defillama';
import { OIBreakdownCharts } from '@/components/oi-breakdown-charts';

export const revalidate = 60;

export default async function MarketsPage() {
  const { markets, totalOI } = await fetchHyperliquidOIBreakdown();
  const top30 = markets.slice(0, 30);

  // Big 3 vs Alts analysis
  const BIG3 = new Set(['BTC', 'ETH', 'SOL']);
  const big3Markets = markets.filter(m => BIG3.has(m.name));
  const altMarkets = markets.filter(m => !BIG3.has(m.name));
  const big3OI = big3Markets.reduce((s, m) => s + m.oiUsd, 0);
  const altOI = altMarkets.reduce((s, m) => s + m.oiUsd, 0);
  const big3Pct = (big3OI / totalOI) * 100;
  const altPct = (altOI / totalOI) * 100;

  // Category breakdown
  const MEME = new Set(['DOGE', 'PEPE', '1000PEPE', 'WIF', 'BONK', '1000BONK', 'FLOKI', '1000FLOKI', 'SHIB', '1000SHIB', 'POPCAT', 'FARTCOIN', 'TRUMP', 'PENGU']);
  const DEFI = new Set(['AAVE', 'UNI', 'LINK', 'CRV', 'LDO', 'PENDLE', 'GMX', 'DYDX', 'JUP', 'HYPE', 'MKR', 'COMP', 'SNX']);
  const L1L2 = new Set(['AVAX', 'BNB', 'ADA', 'DOT', 'NEAR', 'SUI', 'APT', 'SEI', 'OP', 'ARB', 'TIA', 'TON', 'XRP', 'TRX', 'ICP', 'FIL']);

  const memeOI = markets.filter(m => MEME.has(m.name)).reduce((s, m) => s + m.oiUsd, 0);
  const defiOI = markets.filter(m => DEFI.has(m.name)).reduce((s, m) => s + m.oiUsd, 0);
  const l1l2OI = markets.filter(m => L1L2.has(m.name)).reduce((s, m) => s + m.oiUsd, 0);
  const otherOI = altOI - memeOI - defiOI - l1l2OI;

  return (
    <>
      <h1 className="page-title">Per-Market OI Breakdown</h1>
      <p className="page-sub">What traders actually trade on Hyperliquid &middot; {markets.length} active markets</p>

      {/* Big 3 vs Alts */}
      <div className="kpi-row">
        <div className="kpi accent">
          <div className="kpi-label">Big 3 (BTC + ETH + SOL)</div>
          <div className="kpi-val accent">{formatUSD(big3OI)}</div>
          <div className="kpi-sub">{big3Pct.toFixed(1)}% of total OI</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Altcoins</div>
          <div className="kpi-val">{formatUSD(altOI)}</div>
          <div className="kpi-sub">{altPct.toFixed(1)}% of total OI</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Total OI</div>
          <div className="kpi-val">{formatUSD(totalOI)}</div>
          <div className="kpi-sub">{markets.length} markets</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Depth Signal</div>
          <div className="kpi-val" style={{ fontSize: 16, color: big3Pct > 70 ? '#f87171' : big3Pct > 50 ? '#fbbf24' : '#34d399' }}>
            {big3Pct > 70 ? 'Concentrated' : big3Pct > 50 ? 'Moderate' : 'Diversified'}
          </div>
          <div className="kpi-sub">{big3Pct > 70 ? 'Heavily dependent on majors' : big3Pct > 50 ? 'Healthy mix' : 'Strong alt trading'}</div>
        </div>
      </div>

      {/* Big 3 individual breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Big 3 Breakdown</span>
          <span className="card-badge">BTC + ETH + SOL</span>
        </div>
        <div style={{ padding: 20 }}>
          <div className="g3">
            {big3Markets.map(m => (
              <div key={m.name} className="metric">
                <div className="metric-label">{m.name}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5', marginTop: 4 }}>{formatUSD(m.oiUsd)}</div>
                <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
                  {m.pctOfTotal.toFixed(1)}% of total &middot; {m.oiCoins.toLocaleString(undefined, { maximumFractionDigits: 1 })} coins &middot; ${m.markPrice.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">OI by Category</span>
          <span className="card-badge">where the volume is</span>
        </div>
        <div style={{ padding: 20 }}>
          <div className="g4">
            <div className="metric">
              <div className="metric-label">Memecoins</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24', marginTop: 4 }}>{formatUSD(memeOI)}</div>
              <div style={{ fontSize: 10, color: '#4b5563' }}>{(memeOI/totalOI*100).toFixed(1)}% of total</div>
            </div>
            <div className="metric">
              <div className="metric-label">DeFi Tokens</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#8b5cf6', marginTop: 4 }}>{formatUSD(defiOI)}</div>
              <div style={{ fontSize: 10, color: '#4b5563' }}>{(defiOI/totalOI*100).toFixed(1)}% of total</div>
            </div>
            <div className="metric">
              <div className="metric-label">L1/L2 Tokens</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e', marginTop: 4 }}>{formatUSD(l1l2OI)}</div>
              <div style={{ fontSize: 10, color: '#4b5563' }}>{(l1l2OI/totalOI*100).toFixed(1)}% of total</div>
            </div>
            <div className="metric">
              <div className="metric-label">Other (RWA, FX, etc)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#9ca3af', marginTop: 4 }}>{formatUSD(otherOI)}</div>
              <div style={{ fontSize: 10, color: '#4b5563' }}>{(otherOI/totalOI*100).toFixed(1)}% of total</div>
            </div>
          </div>
        </div>
      </div>

      <OIBreakdownCharts markets={top30} />

      {/* Full market table */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <span className="card-title">All Markets</span>
          <span className="card-badge">{markets.length} pairs</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Market</th>
                <th className="r">OI (USD)</th>
                <th className="r">% of Total</th>
                <th className="r">OI (Coins)</th>
                <th className="r">Mark Price</th>
                <th className="r">Funding</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {markets.slice(0, 60).map((m, i) => {
                const cat = BIG3.has(m.name) ? 'Big 3' : MEME.has(m.name) ? 'Meme' : DEFI.has(m.name) ? 'DeFi' : L1L2.has(m.name) ? 'L1/L2' : 'Other';
                const catColor = cat === 'Big 3' ? '#8b5cf6' : cat === 'Meme' ? '#fbbf24' : cat === 'DeFi' ? '#22c55e' : cat === 'L1/L2' ? '#3b82f6' : '#4b5563';
                return (
                  <tr key={m.name}>
                    <td className="dim">{i+1}</td>
                    <td className="bright">{m.name}-USD</td>
                    <td className="r mono num">{formatUSD(m.oiUsd)}</td>
                    <td className="r">
                      <span className="share-wrap">
                        <span className="share-bar"><div className="share-fill" style={{ width: `${Math.min(m.pctOfTotal * 2, 100)}%` }}/></span>
                        <span className="share-pct">{m.pctOfTotal.toFixed(1)}%</span>
                      </span>
                    </td>
                    <td className="r mono dim">{m.oiCoins.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="r mono dim">${m.markPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="r mono">
                      <span className={m.funding >= 0 ? 'pos' : 'neg'}>
                        {(m.funding * 100).toFixed(6)}%
                      </span>
                    </td>
                    <td><span style={{ fontSize: 10, color: catColor, fontWeight: 600 }}>{cat}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, padding: 20 }}>
        <div className="card-title" style={{ marginBottom: 8 }}>BloomFi Insight: Big 3 vs Alts</div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
          <strong style={{ color: '#e5e7eb' }}>Big 3 at {big3Pct.toFixed(0)}%</strong> shows Hyperliquid has deep liquidity in majors but also meaningful alt trading ({altPct.toFixed(0)}%).<br/>
          <strong style={{ color: '#fbbf24' }}>Memecoins at {(memeOI/totalOI*100).toFixed(1)}%</strong> -- significant OI in memes (PEPE, DOGE, WIF etc). These are high-fee, high-volume markets.<br/>
          <strong style={{ color: '#a78bfa' }}>For BloomFi:</strong> Launch with Big 3 for liquidity credibility. Add memecoins early for volume and fee generation. 
          The 70/30 model is most compelling for memecoin traders who pay the highest effective fees and funding rates.
        </div>
      </div>
    </>
  );
}

