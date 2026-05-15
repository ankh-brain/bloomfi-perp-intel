import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';
import { DashboardCharts } from '@/components/dashboard-charts';

export const revalidate = 300;

export default async function Dashboard() {
  const market = await fetchMarketOverview();
  const top20 = market.protocols.slice(0, 20);
  const top5share = top20.slice(0, 5).reduce((s, p) => s + p.marketShare, 0);

  return (
    <>
      <h1 className="page-title">Perp DEX Market Overview</h1>
      <p className="page-sub">
        {market.protocols.length} protocols &middot; Live via DefiLlama &middot; {new Date(market.lastUpdated).toLocaleTimeString()}
      </p>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Total Open Interest</div>
          <div className="kpi-val">{formatUSD(market.totalOI)}</div>
          <div className="kpi-sub">{market.protocols.length} protocols</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Fees (24h)</div>
          <div className="kpi-val">{formatUSD(market.totalFees24h)}</div>
          <div className="kpi-sub">30d: {formatUSD(market.totalFees30d)}</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">Hyperliquid Share</div>
          <div className="kpi-val accent">{top20[0]?.marketShare.toFixed(1)}%</div>
          <div className="kpi-sub">OI: {formatUSD(top20[0]?.openInterest || 0)}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Top 5 Concentration</div>
          <div className="kpi-val">{top5share.toFixed(1)}%</div>
          <div className="kpi-sub">of total open interest</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <span className="card-title">Protocol Rankings</span>
          <span className="card-badge">by open interest</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Protocol</th>
                <th className="r">Open Interest</th>
                <th className="r">Share</th>
                <th className="r">Fees 24h</th>
                <th className="r">Fees 30d</th>
                <th className="r">24h</th>
                <th>Chain</th>
              </tr>
            </thead>
            <tbody>
              {top20.map((p, i) => (
                <tr key={p.name}>
                  <td className="dim">{i + 1}</td>
                  <td className="bright">{p.name.replace(' Perps','').replace(' Perpetual Exchange','')}</td>
                  <td className="r mono num">{formatUSD(p.openInterest)}</td>
                  <td className="r">
                    <span className="share-wrap">
                      <span className="share-bar"><div className="share-fill" style={{ width: `${Math.min(p.marketShare, 100)}%` }} /></span>
                      <span className="share-pct">{p.marketShare.toFixed(1)}%</span>
                    </span>
                  </td>
                  <td className="r mono dim">{p.fees24h > 0 ? formatUSD(p.fees24h, 2) : <span className="mute">&mdash;</span>}</td>
                  <td className="r mono dim">{p.fees30d > 0 ? formatUSD(p.fees30d) : <span className="mute">&mdash;</span>}</td>
                  <td className="r">
                    <span className={`mono ${p.change1d > 0 ? 'pos' : p.change1d < 0 ? 'neg' : 'mute'}`} style={{ fontSize: 12 }}>
                      {p.change1d !== 0 ? formatPct(p.change1d) : '\u2014'}
                    </span>
                  </td>
                  <td className="dim">{p.chains[0] || '\u2014'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DashboardCharts protocols={top20} />
    </>
  );
}

