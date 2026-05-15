import { fetchMarketOverview, formatUSD } from '@/lib/defillama';

export const revalidate = 300;

const OPPS = [
  { gap: "No perp DEX owns \'trader-aligned yield\'", evidence: "Hyperliquid keeps most fees. Lighter uses zero-fee model. Nobody shares 70% back.", priority: "Critical" },
  { gap: "VC-backed competitors have structural sell pressure", evidence: "Lighter (Robinhood-backed), dYdX (VC rounds). BloomFi is self-funded.", priority: "High" },
  { gap: "Transparency is talked about but not proven on-chain", evidence: "Most DEXs show volumes but not fee distribution. BloomFi can show every split on-chain.", priority: "High" },
  { gap: "Community ownership narrative is unoccupied", evidence: "Hyperliquid has loyalty but extractive model. BloomFi can combine both.", priority: "Medium" },
  { gap: "Mid-tier DEXs are losing share", evidence: "dYdX below 3%, Aster collapsed post-incentives. Market consolidating to top 3.", priority: "Medium" },
];

const THREATS = [
  "Hyperliquid dominance (50%+ OI) creates massive network effects",
  "Lighter zero-fee model undercuts everyone on cost",
  "Late entry — community and liquidity take time to build",
  "Regulatory uncertainty around perp DEX token mechanisms",
];

export default async function OpportunityPage() {
  const market = await fetchMarketOverview();
  const hyper = market.protocols.find(p => p.name.toLowerCase().includes('hyperliquid'));
  const lighter = market.protocols.find(p => p.name.toLowerCase().includes('lighter'));

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fafafa' }}>BloomFi Opportunity Analysis</h1>
      <p style={{ fontSize: 12, color: '#52525b', marginTop: 4, marginBottom: 24 }}>Data-backed gap analysis for GTM strategy</p>

      {/* Positioning */}
      <div className="kpi-card accent" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 8 }}>BloomFi Category Wedge</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#c4b5fd', marginBottom: 16 }}>Trader-aligned yield — 70% of fees back to depositors</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#34d399', marginBottom: 8 }}>Structural Strengths</div>
            {["Self-funded (no VC sell pressure)", "Own L2 on OP Stack", "Fee transparency", "Community-owned token design"].map(s => (
              <div key={s} style={{ fontSize: 13, color: '#a1a1aa', padding: '4px 0 4px 12px', borderLeft: '2px solid rgba(52,211,153,0.3)' }}>{s}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#fbbf24', marginBottom: 8 }}>Gaps to Close</div>
            {["No narrative established yet", "Pre-testnet", "No community yet", "Differentiators still being defined"].map(g => (
              <div key={g} style={{ fontSize: 13, color: '#a1a1aa', padding: '4px 0 4px 12px', borderLeft: '2px solid rgba(251,191,36,0.3)' }}>{g}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Context */}
      <div className="data-table-wrap" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', marginBottom: 16 }}>Market Context (Live)</div>
        <div className="grid-3">
          <div className="comp-metric">
            <div className="comp-metric-label">Hyperliquid Dominance</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa', marginTop: 4 }}>{hyper?.marketShare.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: '#52525b' }}>OI: {formatUSD(hyper?.openInterest || 0)}</div>
          </div>
          <div className="comp-metric">
            <div className="comp-metric-label">Lighter (Nearest Comp)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#34d399', marginTop: 4 }}>{lighter?.marketShare.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: '#52525b' }}>OI: {formatUSD(lighter?.openInterest || 0)}</div>
          </div>
          <div className="comp-metric">
            <div className="comp-metric-label">Available Market</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa', marginTop: 4 }}>{(100 - (hyper?.marketShare || 0)).toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: '#52525b' }}>OI outside Hyperliquid</div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="data-table-wrap" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', marginBottom: 16 }}>Identified Opportunities</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
          {OPPS.map((opp, i) => (
            <div key={i} className="opp-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fafafa' }}>{opp.gap}</div>
                <span className={`badge badge-${opp.priority.toLowerCase()}`}>{opp.priority}</span>
              </div>
              <div style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6 }}>{opp.evidence}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Threats */}
      <div className="data-table-wrap" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', marginBottom: 16 }}>Threats to Monitor</div>
        {THREATS.map((t, i) => (
          <div key={i} style={{ fontSize: 13, color: '#a1a1aa', padding: '8px 0 8px 12px', borderLeft: '2px solid rgba(239,68,68,0.3)', marginBottom: 4 }}>{t}</div>
        ))}
      </div>
    </>
  );
}

