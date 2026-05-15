import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';

export const revalidate = 300;

const COMPETITOR_PROFILES: Record<string, { narrative: string; weakness: string; moat: string; bloomfiAngle: string }> = {
  'Hyperliquid Perps': {
    narrative: 'Speed, depth, infrastructure dominance',
    weakness: 'Extractive fee model. No community ownership. Centralization concerns.',
    moat: 'Network effects (50%+ market share), deepest liquidity, sub-second execution',
    bloomfiAngle: 'Cannot compete on speed. Compete on alignment — "your fees work for you, not against you"',
  },
  'Lighter Perps': {
    narrative: 'Trust, verifiable fairness, TradFi bridge',
    weakness: 'VC-backed (Robinhood). Zero-fee model needs enormous scale. Low liquidity.',
    moat: 'ZK-rollup verifiability, institutional backing, Telegram integration',
    bloomfiAngle: 'Both claim fairness, but Lighter is VC-backed. BloomFi is self-funded — structurally different trust model.',
  },
  'Aster Perps': {
    narrative: 'Accessibility, onboarding at scale, CEX-like UX',
    weakness: 'Volume collapsed when incentives ended. Mercenary users. No retention story.',
    moat: 'CEX-like UX, multi-chain, aggressive incentive programmes',
    bloomfiAngle: 'Cautionary tale: incentives without structural alignment creates churn. BloomFi\'s 70/30 is permanent, not promotional.',
  },
  'dYdX V4': {
    narrative: 'Legacy credibility, governance, institutional grade',
    weakness: 'Below 3% share. Volume migrated away. Slow iteration. Complex governance.',
    moat: 'Own Cosmos chain, brand recognition, regulatory preparedness',
    bloomfiAngle: 'dYdX proved own-chain model works. BloomFi takes it further with OP Stack + fee alignment.',
  },
  'Drift Trade': {
    narrative: 'Solana-native perps, integrated DeFi',
    weakness: 'Solana-locked. Smaller OI. Competing against Jupiter on same chain.',
    moat: 'Deep Solana integration, staked SOL products',
    bloomfiAngle: 'Different chain play. BloomFi on OP Stack avoids Solana congestion and Jupiter competition.',
  },
  'GMX V2 Perps': {
    narrative: 'OG DeFi perps, Arbitrum pioneer',
    weakness: 'Declining volumes. V1 to V2 migration friction. Competitive pressure from newer protocols.',
    moat: 'Brand recognition, battle-tested contracts, GLP model',
    bloomfiAngle: 'GMX pioneered LP-backed perps but fee model benefits LPs over traders. BloomFi flips this.',
  },
};

export default async function CompetitivePage() {
  const market = await fetchMarketOverview();

  const competitors = Object.keys(COMPETITOR_PROFILES)
    .map(name => {
      const proto = market.protocols.find(p => p.name === name);
      return { name, proto, profile: COMPETITOR_PROFILES[name] };
    })
    .filter(c => c.proto);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Competitive Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">Head-to-head analysis with live market data</p>
      </div>

      <div className="space-y-4">
        {competitors.map(({ name, proto, profile }) => (
          <div key={name} className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6 hover:border-purple-600/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{name.replace(' Perps', '').replace(' Trade', '')}</h3>
                <div className="text-xs text-gray-500 mt-1">{proto?.chains.join(', ')}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white">{formatUSD(proto?.openInterest || 0)} OI</div>
                <div className="text-xs text-gray-500">{proto?.marketShare.toFixed(1)}% market share</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
              <div className="bg-[#14141e] rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase mb-1">Fees 24h</div>
                <div className="font-mono text-gray-200">{formatUSD(proto?.fees24h || 0, 2)}</div>
              </div>
              <div className="bg-[#14141e] rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase mb-1">Fees 30d</div>
                <div className="font-mono text-gray-200">{formatUSD(proto?.fees30d || 0)}</div>
              </div>
              <div className="bg-[#14141e] rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase mb-1">OI Change 24h</div>
                <div className={`font-mono ${(proto?.change1d || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPct(proto?.change1d || 0)}
                </div>
              </div>
              <div className="bg-[#14141e] rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase mb-1">OI Change 7d</div>
                <div className={`font-mono ${(proto?.change7d || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPct(proto?.change7d || 0)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] font-semibold text-pink-400 uppercase tracking-wider mb-1">They Own (Narratively)</div>
                <div className="text-gray-300 leading-relaxed">{profile.narrative}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1">Their Weakness</div>
                <div className="text-gray-300 leading-relaxed">{profile.weakness}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">Their Moat</div>
                <div className="text-gray-300 leading-relaxed">{profile.moat}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-1">BloomFi Angle</div>
                <div className="text-gray-300 leading-relaxed">{profile.bloomfiAngle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

