import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';

export const revalidate = 300;

const PROFILES: Record<string, { narrative: string; weakness: string; moat: string; angle: string }> = {
  'Hyperliquid Perps': {
    narrative: 'Speed, depth, infrastructure dominance',
    weakness: 'Extractive fee model. No community ownership. Centralization concerns.',
    moat: 'Network effects (50%+ share), deepest liquidity, sub-second execution',
    angle: 'Cannot compete on speed. Compete on alignment — your fees work for you.',
  },
  'Lighter Perps': {
    narrative: 'Trust, verifiable fairness, TradFi bridge',
    weakness: 'VC-backed (Robinhood). Zero-fee model needs enormous scale.',
    moat: 'ZK-rollup verifiability, institutional backing',
    angle: 'Both claim fairness, but Lighter is VC-backed. BloomFi is self-funded.',
  },
  'Aster Perps': {
    narrative: 'Accessibility, onboarding at scale',
    weakness: 'Volume collapsed post-incentives. Mercenary users.',
    moat: 'CEX-like UX, multi-chain, aggressive incentives',
    angle: 'Cautionary tale: incentives without alignment creates churn.',
  },
  'dYdX V4': {
    narrative: 'Legacy credibility, governance',
    weakness: 'Below 3% share. Volume migrated away. Slow iteration.',
    moat: 'Own Cosmos chain, brand recognition',
    angle: 'Proved own-chain works. BloomFi takes it further with OP Stack + fee alignment.',
  },
  'Drift Trade': {
    narrative: 'Solana-native perps, integrated DeFi',
    weakness: 'Solana-locked. Competing against Jupiter on same chain.',
    moat: 'Deep Solana integration, staked SOL products',
    angle: 'BloomFi on OP Stack avoids Solana congestion and Jupiter competition.',
  },
  'GMX V2 Perps': {
    narrative: 'OG DeFi perps, Arbitrum pioneer',
    weakness: 'Declining volumes. V1 to V2 migration friction.',
    moat: 'Brand recognition, battle-tested contracts',
    angle: 'GMX benefits LPs over traders. BloomFi flips this.',
  },
};

export default async function CompetitivePage() {
  const market = await fetchMarketOverview();

  const competitors = Object.keys(PROFILES).map(name => {
    const proto = market.protocols.find(p => p.name === name);
    return { name, proto, profile: PROFILES[name] };
  }).filter(c => c.proto);

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em' }}>Competitive Intelligence</h1>
      <p style={{ fontSize: 12, color: '#52525b', marginTop: 4, marginBottom: 24 }}>Head-to-head analysis with live market data</p>

      {competitors.map(({ name, proto, profile }) => (
        <div key={name} className="comp-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fafafa' }}>{name.replace(' Perps','').replace(' Trade','')}</div>
              <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>{proto?.chains.join(', ')}</div>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: 14, fontFamily: 'monospace', color: '#fafafa' }}>{formatUSD(proto?.openInterest || 0)} OI</div>
              <div style={{ fontSize: 11, color: '#52525b' }}>{proto?.marketShare.toFixed(1)}% market share</div>
            </div>
          </div>

          <div className="grid-2-4" style={{ marginBottom: 16 }}>
            <div className="comp-metric">
              <div className="comp-metric-label">Fees 24h</div>
              <div style={{ fontFamily: 'monospace', color: '#d4d4d8', fontSize: 13 }}>{formatUSD(proto?.fees24h || 0, 2)}</div>
            </div>
            <div className="comp-metric">
              <div className="comp-metric-label">Fees 30d</div>
              <div style={{ fontFamily: 'monospace', color: '#d4d4d8', fontSize: 13 }}>{formatUSD(proto?.fees30d || 0)}</div>
            </div>
            <div className="comp-metric">
              <div className="comp-metric-label">OI 24h</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13 }} className={(proto?.change1d || 0) >= 0 ? 'positive' : 'negative'}>{formatPct(proto?.change1d || 0)}</div>
            </div>
            <div className="comp-metric">
              <div className="comp-metric-label">OI 7d</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13 }} className={(proto?.change7d || 0) >= 0 ? 'positive' : 'negative'}>{formatPct(proto?.change7d || 0)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 }}>They Own</div>
              <div style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{profile.narrative}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#f87171', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 }}>Weakness</div>
              <div style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{profile.weakness}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 }}>Moat</div>
              <div style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{profile.moat}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 }}>BloomFi Angle</div>
              <div style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{profile.angle}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

