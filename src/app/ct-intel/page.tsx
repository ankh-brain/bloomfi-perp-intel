'use client';

import { PERP_KOLS, PERP_NARRATIVES, KOL } from '@/lib/ct-intel';

export default function CTIntelPage() {
  const categories = ['protocol', 'analyst', 'trader', 'media'] as const;
  const catLabels: Record<string, string> = { protocol: 'Protocol Accounts', analyst: 'Analysts & Data', trader: 'Traders & Alpha', media: 'Media', builder: 'Builders' };
  const catColors: Record<string, string> = { protocol: '#8b5cf6', analyst: '#22c55e', trader: '#eab308', media: '#3b82f6', builder: '#ec4899' };

  return (
    <>
      <h1 className="page-title">CT Intelligence</h1>
      <p className="page-sub">Crypto Twitter narratives, KOL tracking, and perp DEX sentiment</p>

      {/* Active Narratives */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Active Narratives</span>
          <span className="card-badge">what CT is talking about</span>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
            {PERP_NARRATIVES.map((n, i) => (
              <div key={i} className="opp">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5' }}>{n.title}</div>
                  <span className={`badge ${n.status === 'active' ? 'badge-high' : n.status === 'emerging' ? 'badge-medium' : 'badge-critical'}`}>
                    {n.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6, marginBottom: 10 }}>{n.description}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 3 }}>Signal</div>
                    <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{n.signal}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 3 }}>BloomFi Angle</div>
                    <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{n.bloomfiAngle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KOL Directory */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Perp DEX KOL Directory</span>
          <span className="card-badge">{PERP_KOLS.length} accounts tracked</span>
        </div>
        <div style={{ padding: 20 }}>
          {categories.map(cat => {
            const kols = PERP_KOLS.filter(k => k.category === cat);
            if (!kols.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: catColors[cat], textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${catColors[cat]}22` }}>
                  {catLabels[cat]} ({kols.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {kols.map(k => (
                    <a
                      key={k.handle}
                      href={`https://x.com/${k.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', background: '#111116', borderRadius: 8, padding: '12px 16px', transition: 'background 0.15s', textDecoration: 'none', color: 'inherit' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a26')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#111116')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>{k.name}</span>
                          <span style={{ fontSize: 11, color: '#4b5563', marginLeft: 8 }}>@{k.handle}</span>
                        </div>
                        <span style={{ fontSize: 10, color: '#4b5563' }}>{k.followers}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{k.focus}</div>
                      <div style={{ fontSize: 10, color: '#4b5563', marginTop: 3, fontStyle: 'italic' }}>{k.relevance}</div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Data Points */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Market Intelligence Snapshot</span>
          <span className="card-badge">from recent CT + web</span>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {[
              { fact: 'Monthly on-chain perp volume crossed $1 trillion for first time in Sept 2025', source: 'Chain Articles', impact: 'Market is massive and growing. BloomFi timing is right.' },
              { fact: 'Hyperliquid has 1.98M total users, $9.3B OI, $4.6T all-time volume', source: 'Hyperliquid API', impact: 'The benchmark. BloomFi needs to capture even 1% to be meaningful.' },
              { fact: 'Lighter volume dropped 70% post-airdrop (Dec 2025 TGE)', source: 'CryptoTimes', impact: 'Points-to-airdrop model is dead. Organic growth wins.' },
              { fact: 'LIT token dropped 11% on TGE day. Justin Sun bought $33M worth.', source: 'CryptoTimes', impact: 'Whale accumulation while retail sells = potential reversal, but risky narrative.' },
              { fact: 'Aster launched own L1 with privacy (stealth addresses) in March 2026', source: 'ARX Trade', impact: 'Privacy is a real differentiator for large traders. BloomFi should consider.' },
              { fact: 'Perp DEX sector now accounts for noticeable portion of global futures activity', source: 'CryptoTimes', impact: 'Institutional attention growing. BloomFi narrative should be ready for this audience.' },
              { fact: 'Hyperliquid fee model: 0.035% taker / 0.01% maker. Lighter: 0% retail.', source: 'PerpScout', impact: 'BloomFi 70/30 split is a third option: charge fees but share them. Unique positioning.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '10px 16px', background: '#111116', borderRadius: 6, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#e5e7eb', lineHeight: 1.5 }}>{item.fact}</div>
                  <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>Source: {item.source}</div>
                </div>
                <div style={{ fontSize: 11, color: '#a78bfa', lineHeight: 1.5, borderLeft: '1px solid #1e1e26', paddingLeft: 16 }}>
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}



