import { fetchMarketOverview, formatUSD } from '@/lib/defillama';
import { fetchHyperliquidStats } from '@/lib/extended';
import { PLATFORM_FEES, calcPositionCost } from '@/lib/fees';

export const revalidate = 300;

export default async function FeeEconomicsPage() {
  const [market, hyperStats] = await Promise.all([
    fetchMarketOverview(),
    fetchHyperliquidStats(),
  ]);

  const protocols = market.protocols
    .filter(p => p.fees24h > 100 && p.openInterest > 100000)
    .sort((a, b) => b.fees24h - a.fees24h);

  const totalDailyFees = protocols.reduce((s, p) => s + p.fees24h, 0);
  const hyperFees = protocols.find(p => p.name.toLowerCase().includes('hyperliquid'));

  // Position cost calculations
  const positionSize = 100000;
  const costs = PLATFORM_FEES.map(f => ({
    ...f,
    cost: calcPositionCost(f, positionSize),
  })).sort((a, b) => a.cost.roundTrip - b.cost.roundTrip);

  return (
    <>
      <h1 className="page-title">Fee Economics Deep Dive</h1>
      <p className="page-sub">Fee structures, cost comparison, and revenue analysis</p>

      {/* Position cost calculator */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Cost of a ${(positionSize/1000).toFixed(0)}K Position (Round-Trip)</span>
          <span className="card-badge">open + close as taker</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Platform</th>
                <th className="r">Maker Fee</th>
                <th className="r">Taker Fee</th>
                <th className="r">Open Cost</th>
                <th className="r">Close Cost</th>
                <th className="r">Round-Trip</th>
                <th className="r">% of Position</th>
                <th>Model</th>
                <th>Staking Discount</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((c, i) => {
                const isBloomfi = c.name.includes('BloomFi');
                return (
                  <tr key={c.name} style={isBloomfi ? { background: 'rgba(124,58,237,0.05)' } : undefined}>
                    <td className="dim">{i + 1}</td>
                    <td className="bright" style={isBloomfi ? { color: '#a78bfa' } : undefined}>{c.name}</td>
                    <td className="r mono dim">{c.makerFee === 0 ? <span className="pos">0 bps</span> : `${c.makerFee} bps`}</td>
                    <td className="r mono dim">{c.takerFee === 0 ? <span className="pos">0 bps</span> : `${c.takerFee} bps`}</td>
                    <td className="r mono num">${c.cost.openCost.toFixed(2)}</td>
                    <td className="r mono num">${c.cost.closeCost.toFixed(2)}</td>
                    <td className="r mono bright" style={{ color: c.cost.roundTrip === 0 ? '#34d399' : c.cost.roundTrip > 100 ? '#f87171' : '#e5e7eb' }}>
                      ${c.cost.roundTrip.toFixed(2)}
                    </td>
                    <td className="r mono" style={{ color: c.cost.roundTripPct === 0 ? '#34d399' : c.cost.roundTripPct > 0.1 ? '#f87171' : '#9ca3af' }}>
                      {c.cost.roundTripPct.toFixed(3)}%
                    </td>
                    <td className="dim" style={{ fontSize: 10 }}>{c.model}</td>
                    <td className="dim" style={{ fontSize: 10, maxWidth: 150, whiteSpace: 'normal' as const }}>{c.stakingDiscount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BloomFi fee analysis */}
      <div className="kpi accent" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>BloomFi Fee Reality Check</div>
        <div className="g3">
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f87171', marginBottom: 4 }}>The Problem</div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              BloomFi proposed fees (2/5 bps) are <strong style={{ color: '#f87171' }}>higher than Lighter (0/0), Vertex (0/2), and Aster (0/4)</strong>.
              On a $100K position, traders pay ${calcPositionCost(PLATFORM_FEES.find(f => f.name.includes('BloomFi'))!, positionSize).roundTrip.toFixed(2)} round-trip vs $0 on Lighter.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 4 }}>The Counter-Argument</div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              70% of fees go back to depositors. If you deposit AND trade, your net cost is much lower.
              But this only works if depositors are also traders -- otherwise active traders subsidize passive depositors.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginBottom: 4 }}>The Recommendation</div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              Consider: lower base fees (1/3 bps) + fee sharing. Or match Lighter at zero for a launch period.
              The 70/30 model is the differentiator -- but only if base fees are competitive first.
            </div>
          </div>
        </div>
      </div>

      {/* Daily fees and monthly revenue */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Daily Fees & Monthly Revenue</span>
          <span className="card-badge">live data from DefiLlama</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Protocol</th>
                <th className="r">Daily Fees</th>
                <th className="r">Monthly Fees (30d)</th>
                <th className="r">Annualized</th>
                <th className="r">OI</th>
                <th className="r">Fee/OI Ratio</th>
              </tr>
            </thead>
            <tbody>
              {protocols.slice(0, 20).map((p, i) => (
                <tr key={p.name}>
                  <td className="dim">{i + 1}</td>
                  <td className="bright">{p.name.replace(' Perps','').replace(' Perpetual Exchange','').replace(' (incl. tradeXYZ)','')}</td>
                  <td className="r mono num">{formatUSD(p.fees24h, 2)}</td>
                  <td className="r mono num">{formatUSD(p.fees30d)}</td>
                  <td className="r mono dim">{formatUSD(p.fees30d * 12)}</td>
                  <td className="r mono dim">{formatUSD(p.openInterest)}</td>
                  <td className="r mono dim">{p.openInterest > 0 ? `${(p.fees24h / p.openInterest * 100).toFixed(4)}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full fee structure comparison */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Full Fee Structure Comparison</span>
          <span className="card-badge">all platforms</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Platform</th>
                <th className="r">Maker</th>
                <th className="r">Taker</th>
                <th>Model</th>
                <th>Additional Fees</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_FEES.map(f => (
                <tr key={f.name} style={f.name.includes('BloomFi') ? { background: 'rgba(124,58,237,0.05)' } : undefined}>
                  <td className="bright" style={f.name.includes('BloomFi') ? { color: '#a78bfa' } : undefined}>{f.name}</td>
                  <td className="r mono">{f.makerFee === 0 ? <span className="pos">0%</span> : `${(f.makerFee/100).toFixed(3)}%`}</td>
                  <td className="r mono">{f.takerFee === 0 ? <span className="pos">0%</span> : `${(f.takerFee/100).toFixed(3)}%`}</td>
                  <td className="dim" style={{ fontSize: 11 }}>{f.model}</td>
                  <td className="dim" style={{ fontSize: 11, maxWidth: 200, whiteSpace: 'normal' as const }}>{f.additionalFees}</td>
                  <td className="dim" style={{ fontSize: 11, maxWidth: 250, whiteSpace: 'normal' as const }}>{f.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

