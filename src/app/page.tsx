import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';
import { DashboardCharts } from '@/components/dashboard-charts';

export const revalidate = 300;

export default async function Dashboard() {
  const market = await fetchMarketOverview();
  const top20 = market.protocols.slice(0, 20);
  const top5share = top20.slice(0, 5).reduce((s, p) => s + p.marketShare, 0);

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em' }}>
        Perp DEX Market Overview
      </h1>
      <p style={{ fontSize: 12, color: '#52525b', marginTop: 4, marginBottom: 24 }}>
        {market.protocols.length} protocols &middot; Live via DefiLlama &middot; Updated {new Date(market.lastUpdated).toLocaleTimeString()}
      </p>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label">Total Open Interest</div>
          <div className="kpi-value">{formatUSD(market.totalOI)}</div>
          <div className="kpi-sub">{market.protocols.length} protocols</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Fees (24h)</div>
          <div className="kpi-value">{formatUSD(market.totalFees24h)}</div>
          <div className="kpi-sub">30d: {formatUSD(market.totalFees30d)}</div>
        </div>
        <div className="kpi-card accent">
          <div className="kpi-label">Hyperliquid Share</div>
          <div className="kpi-value accent">{top20[0]?.marketShare.toFixed(1)}%</div>
          <div className="kpi-sub">OI: {formatUSD(top20[0]?.openInterest || 0)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Top 5 Concentration</div>
          <div className="kpi-value">{top5share.toFixed(1)}%</div>
          <div className="kpi-sub">of total open interest</div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="data-table-wrap" style={{ marginBottom: 24 }}>
        <div className="data-table-header">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>Protocol Rankings</span>
          <span style={{ fontSize: 9, color: '#3f3f46', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>by open interest</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Protocol</th>
                <th className="right">Open Interest</th>
                <th className="right">Share</th>
                <th className="right">Fees 24h</th>
                <th className="right">Fees 30d</th>
                <th className="right">24h</th>
                <th>Chain</th>
              </tr>
            </thead>
            <tbody>
              {top20.map((p, i) => (
                <tr key={p.name}>
                  <td className="dim">{i + 1}</td>
                  <td className="bright">{p.name.replace(' Perps','').replace(' Perpetual Exchange','')}</td>
                  <td className="right mono bright">{formatUSD(p.openInterest)}</td>
                  <td className="right">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className="share-bar">
                        <div className="share-fill" style={{ width: `${Math.min(p.marketShare, 100)}%` }} />
                      </span>
                      <span className="mono dim">{p.marketShare.toFixed(1)}%</span>
                    </span>
                  </td>
                  <td className="right mono dim">{p.fees24h > 0 ? formatUSD(p.fees24h, 2) : <span className="muted">-</span>}</td>
                  <td className="right mono dim">{p.fees30d > 0 ? formatUSD(p.fees30d) : <span className="muted">-</span>}</td>
                  <td className="right">
                    <span className={`mono ${p.change1d > 0 ? 'positive' : p.change1d < 0 ? 'negative' : 'muted'}`} style={{ fontSize: 12 }}>
                      {p.change1d !== 0 ? formatPct(p.change1d) : '-'}
                    </span>
                  </td>
                  <td className="dim">{p.chains[0] || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts protocols={top20} />
    </>
  );
}

