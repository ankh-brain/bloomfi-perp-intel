import { fetchMarketOverview, formatUSD } from '@/lib/defillama';
import { fetchHyperliquidStats } from '@/lib/extended';

export const revalidate = 300;

export default async function FeeEconomicsPage() {
  const [market, hyperStats] = await Promise.all([
    fetchMarketOverview(),
    fetchHyperliquidStats(),
  ]);

  // Calculate fee economics for protocols with meaningful data
  const protocols = market.protocols
    .filter(p => p.fees24h > 100 && p.openInterest > 100000)
    .map(p => ({
      ...p,
      feeRate: p.fees24h / (p.openInterest || 1) * 100, // daily fee as % of OI
      annualizedFeeRate: (p.fees24h * 365) / (p.openInterest || 1) * 100,
      fees30dAnnualized: p.fees30d * 12,
    }))
    .sort((a, b) => b.fees24h - a.fees24h);

  const totalDailyFees = protocols.reduce((s, p) => s + p.fees24h, 0);
  const hyperFees = protocols.find(p => p.name.toLowerCase().includes('hyperliquid'));
  const hyperFeePct = hyperFees ? (hyperFees.fees24h / totalDailyFees * 100) : 0;

  return (
    <>
      <h1 className="page-title">Fee Economics Deep Dive</h1>
      <p className="page-sub">Who extracts what &middot; Revenue models compared &middot; BloomFi&apos;s 70/30 in context</p>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Total Daily Fees</div>
          <div className="kpi-val">{formatUSD(totalDailyFees)}</div>
          <div className="kpi-sub">across {protocols.length} protocols</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">Hyperliquid Fee Dominance</div>
          <div className="kpi-val accent">{hyperFeePct.toFixed(1)}%</div>
          <div className="kpi-sub">{formatUSD(hyperFees?.fees24h || 0)} / day</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Hyperliquid Daily Volume</div>
          <div className="kpi-val">{formatUSD(hyperStats.dailyVolume)}</div>
          <div className="kpi-sub">{hyperStats.users.toLocaleString()} total users</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Hyper Fee/Volume Ratio</div>
          <div className="kpi-val">{hyperStats.dailyVolume > 0 ? ((hyperFees?.fees24h || 0) / hyperStats.dailyVolume * 100).toFixed(3) : '0'}%</div>
          <div className="kpi-sub">effective take rate</div>
        </div>
      </div>

      {/* BloomFi comparison card */}
      <div className="kpi accent" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>BloomFi 70/30 Model in Context</div>
        <div className="g3">
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', marginBottom: 4 }}>Hyperliquid (current)</div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              Generates {formatUSD(hyperFees?.fees24h || 0)}/day in fees. Protocol keeps majority. 
              Annualized: ~{formatUSD((hyperFees?.fees24h || 0) * 365)}. Users see none of this.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 4 }}>BloomFi (70/30 model)</div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              At equivalent volume, 70% goes to depositors = ~{formatUSD((hyperFees?.fees24h || 0) * 0.7 * 365)}/yr back to users.
              Protocol retains 30% = ~{formatUSD((hyperFees?.fees24h || 0) * 0.3 * 365)}/yr.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginBottom: 4 }}>User value difference</div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              On Hyperliquid: traders pay fees, get nothing back.<br/>
              On BloomFi: depositors earn {formatUSD((hyperFees?.fees24h || 0) * 0.7)}/day from the same activity.
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Fee Economics by Protocol</span>
          <span className="card-badge">sorted by daily fees</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Protocol</th>
                <th className="r">Fees 24h</th>
                <th className="r">Fees 30d</th>
                <th className="r">Annualized</th>
                <th className="r">OI</th>
                <th className="r">Fee/OI (daily)</th>
                <th className="r">Fee/OI (annual)</th>
              </tr>
            </thead>
            <tbody>
              {protocols.slice(0, 25).map((p, i) => (
                <tr key={p.name}>
                  <td className="dim">{i + 1}</td>
                  <td className="bright">{p.name.replace(' Perps','').replace(' Perpetual Exchange','')}</td>
                  <td className="r mono num">{formatUSD(p.fees24h, 2)}</td>
                  <td className="r mono dim">{formatUSD(p.fees30d)}</td>
                  <td className="r mono dim">{formatUSD(p.fees30dAnnualized)}</td>
                  <td className="r mono dim">{formatUSD(p.openInterest)}</td>
                  <td className="r mono">
                    <span style={{ color: p.feeRate > 0.05 ? '#f87171' : p.feeRate > 0.02 ? '#fbbf24' : '#34d399' }}>
                      {p.feeRate.toFixed(4)}%
                    </span>
                  </td>
                  <td className="r mono dim">{p.annualizedFeeRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

