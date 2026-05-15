import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';

export const revalidate = 300;

const BLOOMFI_ANALYSIS = {
  positioning: "Trader-aligned yield — 70% of fees back to depositors",
  strengths: ["Self-funded (no VC sell pressure)", "Own L2 on OP Stack", "Fee transparency", "Community-owned token design"],
  gaps: ["No narrative established yet", "Pre-testnet — no live data", "No community yet", "Differentiators still being defined"],
  opportunities: [
    { gap: "No perp DEX owns 'trader-aligned yield'", evidence: "Hyperliquid keeps most fees. Lighter uses zero-fee model. Nobody shares 70% back.", priority: "Critical" },
    { gap: "VC-backed competitors have structural sell pressure", evidence: "Lighter (Robinhood-backed), dYdX (VC rounds), Aster (incentive-driven). BloomFi is self-funded.", priority: "High" },
    { gap: "Transparency is talked about but not proven on-chain", evidence: "Most DEXs show volumes but not fee distribution. BloomFi can show every fee split on-chain.", priority: "High" },
    { gap: "Community ownership narrative is unoccupied", evidence: "Hyperliquid has community loyalty but extractive model. BloomFi can combine both.", priority: "Medium" },
    { gap: "Mid-tier DEXs are losing market share", evidence: "dYdX dropped below 3%, Aster collapsed post-incentives. Market is consolidating to top 3.", priority: "Medium" },
  ],
  threats: [
    "Hyperliquid's dominance (50%+ OI) creates massive network effects",
    "Lighter's zero-fee model undercuts everyone on cost",
    "Late entry — community and liquidity take time to build",
    "Regulatory uncertainty around perp DEX token mechanisms",
  ],
};

export default async function OpportunityPage() {
  const market = await fetchMarketOverview();
  const hyper = market.protocols.find(p => p.name.toLowerCase().includes('hyperliquid'));
  const lighter = market.protocols.find(p => p.name.toLowerCase().includes('lighter'));

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">BloomFi Opportunity Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">Data-backed gap analysis for GTM strategy</p>
      </div>

      {/* Positioning */}
      <div className="bg-purple-600/5 border border-purple-600/20 rounded-xl p-6 mb-6">
        <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-2">BloomFi&apos;s Category Wedge</div>
        <div className="text-xl font-bold text-purple-300 mb-3">{BLOOMFI_ANALYSIS.positioning}</div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold text-green-400 mb-2">Structural Strengths</div>
            {BLOOMFI_ANALYSIS.strengths.map(s => (
              <div key={s} className="text-sm text-gray-300 py-1 pl-3 border-l border-green-500/30">{s}</div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 mb-2">Current Gaps to Close</div>
            {BLOOMFI_ANALYSIS.gaps.map(g => (
              <div key={g} className="text-sm text-gray-300 py-1 pl-3 border-l border-amber-500/30">{g}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Context */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Market Context (Live)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#14141e] rounded-lg p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Hyperliquid Dominance</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{hyper?.marketShare.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">OI: {formatUSD(hyper?.openInterest || 0)}</div>
          </div>
          <div className="bg-[#14141e] rounded-lg p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Lighter (Nearest Comp)</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{lighter?.marketShare.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">OI: {formatUSD(lighter?.openInterest || 0)}</div>
          </div>
          <div className="bg-[#14141e] rounded-lg p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Available Market</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{(100 - (hyper?.marketShare || 0)).toFixed(1)}%</div>
            <div className="text-xs text-gray-500">OI outside Hyperliquid</div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Identified Opportunities</h2>
        <div className="space-y-4">
          {BLOOMFI_ANALYSIS.opportunities.map((opp, i) => (
            <div key={i} className="border border-[#1a1a28] rounded-lg p-4 hover:border-purple-600/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-semibold text-white">{opp.gap}</div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                  opp.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                  opp.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>{opp.priority}</span>
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">{opp.evidence}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Threats */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Threats to Monitor</h2>
        <div className="space-y-2">
          {BLOOMFI_ANALYSIS.threats.map((t, i) => (
            <div key={i} className="text-sm text-gray-300 py-2 pl-3 border-l-2 border-red-500/30">{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

