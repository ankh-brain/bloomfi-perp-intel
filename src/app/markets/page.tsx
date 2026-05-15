import { fetchHyperliquidOIBreakdown } from '@/lib/extended';
import { formatUSD } from '@/lib/defillama';
import { OIBreakdownCharts } from '@/components/oi-breakdown-charts';

export const revalidate = 60;

export default async function MarketsPage() {
  const { markets, totalOI } = await fetchHyperliquidOIBreakdown();
  const top30 = markets.slice(0, 30);
  const topConcentration = top30.slice(0, 5).reduce((s, m) => s + m.pctOfTotal, 0);

  return (
    <>
      <h1 className="page-title">Per-Market OI Breakdown</h1>
      <p className="page-sub">What traders actually trade on Hyperliquid &middot; {markets.length} active markets</p>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Total OI (All Markets)</div>
          <div className="kpi-val">{formatUSD(totalOI)}</div>
          <div className="kpi-sub">{markets.length} active markets</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">BTC OI</div>
          <div className="kpi-val accent">{formatUSD(markets.find(m => m.name === 'BTC')?.oiUsd || 0)}</div>
          <div className="kpi-sub">{markets.find(m => m.name === 'BTC')?.pctOfTotal.toFixed(1)}% of total</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">ETH OI</div>
          <div className="kpi-val">{formatUSD(markets.find(m => m.name === 'ETH')?.oiUsd || 0)}</div>
          <div className="kpi-sub">{markets.find(m => m.name === 'ETH')?.pctOfTotal.toFixed(1)}% of total</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Top 5 Concentration</div>
          <div className="kpi-val">{topConcentration.toFixed(1)}%</div>
          <div className="kpi-sub">of total OI in top 5 assets</div>
        </div>
      </div>

      <OIBreakdownCharts markets={top30} />

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
              </tr>
            </thead>
            <tbody>
              {markets.slice(0, 50).map((m, i) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

