import { fetchDexTokens } from '@/lib/extended';
import { formatUSD } from '@/lib/defillama';

export const revalidate = 300;

export default async function ValuationsPage() {
  const tokens = await fetchDexTokens();

  return (
    <>
      <h1 className="page-title">DEX Token Valuations</h1>
      <p className="page-sub">Market cap, FDV, and P/E metrics for perp DEX tokens</p>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Token Comparison</span>
          <span className="card-badge">via CoinGecko</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Token</th>
                <th className="r">Price</th>
                <th className="r">Market Cap</th>
                <th className="r">FDV</th>
                <th className="r">Mcap/FDV</th>
                <th className="r">Volume 24h</th>
                <th className="r">24h</th>
                <th className="r">7d</th>
                <th className="r">ATH</th>
                <th className="r">From ATH</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => {
                const mcapFdv = t.fdv > 0 ? (t.mcap / t.fdv) * 100 : 0;
                const fromAth = t.ath > 0 ? ((t.price - t.ath) / t.ath) * 100 : 0;
                return (
                  <tr key={t.id}>
                    <td>
                      <span className="bright">{t.symbol}</span>
                      <span className="dim" style={{ marginLeft: 8 }}>{t.name}</span>
                    </td>
                    <td className="r mono num">${t.price < 1 ? t.price.toFixed(4) : t.price.toFixed(2)}</td>
                    <td className="r mono num">{formatUSD(t.mcap)}</td>
                    <td className="r mono dim">{formatUSD(t.fdv)}</td>
                    <td className="r mono">
                      <span style={{ color: mcapFdv > 50 ? '#34d399' : mcapFdv > 20 ? '#fbbf24' : '#f87171' }}>
                        {mcapFdv.toFixed(0)}%
                      </span>
                    </td>
                    <td className="r mono dim">{formatUSD(t.volume24h)}</td>
                    <td className="r mono">
                      <span className={t.change24h >= 0 ? 'pos' : 'neg'}>
                        {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
                      </span>
                    </td>
                    <td className="r mono">
                      <span className={t.change7d >= 0 ? 'pos' : 'neg'}>
                        {t.change7d >= 0 ? '+' : ''}{t.change7d.toFixed(1)}%
                      </span>
                    </td>
                    <td className="r mono dim">${t.ath < 1 ? t.ath.toFixed(4) : t.ath.toFixed(2)}</td>
                    <td className="r mono neg">{fromAth.toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, padding: 20 }}>
        <div className="card-title" style={{ marginBottom: 8 }}>What This Tells BloomFi</div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
          <strong style={{ color: '#e5e7eb' }}>Mcap/FDV Ratio</strong> = how much of the token supply is circulating. Low ratio = lots of unlocks ahead (sell pressure risk).<br/>
          <strong style={{ color: '#e5e7eb' }}>From ATH</strong> = how far below all-time high. Deep discounts in competitors = market questioning their models.<br/>
          <strong style={{ color: '#a78bfa' }}>BloomFi insight:</strong> HYPE trades at ${tokens.find(t => t.symbol === 'HYPE')?.mcap ? formatUSD(tokens.find(t => t.symbol === 'HYPE')!.mcap) : '?'} mcap — 
          proving perp DEX tokens can command massive valuations. But most others (DYDX, GMX) are down 80%+ from ATH. 
          The market rewards dominance and penalizes everything else. BloomFi&apos;s TGE timing and positioning must account for this.
        </div>
      </div>
    </>
  );
}

