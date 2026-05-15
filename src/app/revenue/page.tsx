import { TOKEN_TERMINAL_DATA, formatRevenue } from '@/lib/tokenterminal';

export default function RevenuePage() {
  const sorted = [...TOKEN_TERMINAL_DATA].sort((a, b) => b.revenue30d - a.revenue30d);

  return (
    <>
      <h1 className="page-title">Revenue & Fundamentals</h1>
      <p className="page-sub">Protocol revenue, P/E ratios, and revenue efficiency &middot; Data via Token Terminal (May 2026)</p>

      {/* Market totals */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Total Market Revenue (30d)</div>
          <div className="kpi-val">{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0))}</div>
          <div className="kpi-sub">{sorted.length} protocols tracked</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">Hyperliquid Revenue (30d)</div>
          <div className="kpi-val accent">{formatRevenue(sorted[0]?.revenue30d || 0)}</div>
          <div className="kpi-sub">Annualized: {formatRevenue(sorted[0]?.annualizedRevenue || 0)}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Hyperliquid P/E</div>
          <div className="kpi-val">{sorted[0]?.peRatio.toFixed(1)}x</div>
          <div className="kpi-sub">FDV / annualized revenue</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Total Market FDV</div>
          <div className="kpi-val">{formatRevenue(sorted.reduce((s, p) => s + p.fdvMarketCap, 0))}</div>
          <div className="kpi-sub">all derivative protocols</div>
        </div>
      </div>

      {/* Revenue comparison table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Revenue Comparison</span>
          <span className="card-badge">sorted by 30d revenue</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Protocol</th>
                <th className="r">Fees (30d)</th>
                <th className="r">Revenue (30d)</th>
                <th className="r">Annualized Rev</th>
                <th className="r">Volume (30d)</th>
                <th className="r">FDV</th>
                <th className="r">P/E Ratio</th>
                <th className="r">Rev / $1B Vol</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.name}>
                  <td className="dim">{i + 1}</td>
                  <td className="bright">{p.name} <span className="dim" style={{ marginLeft: 4 }}>{p.ticker}</span></td>
                  <td className="r mono num">{formatRevenue(p.fees30d)}</td>
                  <td className="r mono bright">{formatRevenue(p.revenue30d)}</td>
                  <td className="r mono dim">{formatRevenue(p.annualizedRevenue)}</td>
                  <td className="r mono dim">{formatRevenue(p.volume30d)}</td>
                  <td className="r mono dim">{formatRevenue(p.fdvMarketCap)}</td>
                  <td className="r mono">
                    <span style={{ color: p.peRatio < 20 ? '#34d399' : p.peRatio < 50 ? '#fbbf24' : '#f87171' }}>
                      {p.peRatio.toFixed(1)}x
                    </span>
                  </td>
                  <td className="r mono dim">{formatRevenue(p.revenuePerBillion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BloomFi projection */}
      <div className="kpi accent" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>BloomFi Revenue Projection (70/30 Model)</div>
        <div className="g3">
          <div className="metric">
            <div className="metric-label">If BloomFi hits 1% market share</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f4f4f5', marginTop: 4 }}>~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.01)}/mo</div>
            <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
              Protocol keeps 30%: ~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.01 * 0.3)}/mo<br/>
              Depositors get 70%: ~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.01 * 0.7)}/mo
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">If BloomFi hits 5% market share</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', marginTop: 4 }}>~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.05)}/mo</div>
            <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
              Protocol keeps 30%: ~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.05 * 0.3)}/mo<br/>
              Depositors get 70%: ~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.05 * 0.7)}/mo
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">If BloomFi matches edgeX revenue</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#34d399', marginTop: 4 }}>{formatRevenue(12000000)}/mo</div>
            <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
              Protocol keeps 30%: {formatRevenue(12000000 * 0.3)}/mo<br/>
              Depositors get 70%: {formatRevenue(12000000 * 0.7)}/mo<br/>
              Depositor APY would depend on TVL
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card" style={{ padding: 20 }}>
        <div className="card-title" style={{ marginBottom: 8 }}>Key Takeaways</div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
          <strong style={{ color: '#e5e7eb' }}>Hyperliquid dominates revenue</strong> -- $48.4M/month with a 73x P/E ratio. Proves the market will pay for quality execution.<br/>
          <strong style={{ color: '#e5e7eb' }}>edgeX is the efficiency leader</strong> -- $12M/month revenue with only $1.4B FDV = 9.7x P/E. Best value in the space.<br/>
          <strong style={{ color: '#e5e7eb' }}>Lighter generates little revenue</strong> -- zero-fee model means $2.8M/month despite $70B volume. The sustainability question is real.<br/>
          <strong style={{ color: '#e5e7eb' }}>Revenue per $1B volume varies wildly</strong> -- from $40K (Lighter) to $450K (Jupiter Perps). Fee model matters more than volume.<br/><br/>
          <strong style={{ color: '#a78bfa' }}>For BloomFi:</strong> The 70/30 model means BloomFi retains 30% of fees for the protocol. 
          At Hyperliquid-like fee rates, reaching even 5% market share would generate ~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.05 * 0.3)}/month in protocol revenue 
          while returning ~{formatRevenue(sorted.reduce((s, p) => s + p.revenue30d, 0) * 0.05 * 0.7)}/month to depositors. 
          This is the core pitch: sustainable protocol economics + meaningful depositor yield.
        </div>
      </div>
    </>
  );
}

