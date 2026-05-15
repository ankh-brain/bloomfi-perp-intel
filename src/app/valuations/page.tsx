import { fetchDexTokens, STAKING_INFO } from '@/lib/extended';
import { formatUSD } from '@/lib/defillama';

export const revalidate = 300;

export default async function ValuationsPage() {
  const tokens = await fetchDexTokens();

  return (
    <>
      <h1 className="page-title">DEX Token Valuations</h1>
      <p className="page-sub">Market cap, FDV, staking economics, and performance for perp DEX tokens</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Token Comparison</span>
          <span className="card-badge">via CoinGecko + manual staking data</span>
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
                <th className="r">24h</th>
                <th className="r">7d</th>
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
                    <td className="r mono neg">{fromAth.toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staking Economics */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <span className="card-title">Staking Economics</span>
          <span className="card-badge">staking APY, benefits, and participation</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Token</th>
                <th className="r">Staking APY</th>
                <th className="r">% Staked</th>
                <th>Staking Benefits</th>
                <th className="r">Price</th>
                <th className="r">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(STAKING_INFO).map(([symbol, info]) => {
                const token = tokens.find(t => t.symbol === symbol);
                return (
                  <tr key={symbol}>
                    <td className="bright">{symbol}</td>
                    <td className="r mono pos">{info.stakingAPY}</td>
                    <td className="r mono num">{info.stakedPct}</td>
                    <td className="dim" style={{ fontSize: 12, maxWidth: 300, whiteSpace: 'normal' as const }}>{info.stakingBenefit}</td>
                    <td className="r mono dim">{token ? `$${token.price < 1 ? token.price.toFixed(4) : token.price.toFixed(2)}` : '-'}</td>
                    <td className="r mono dim">{token ? formatUSD(token.mcap) : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="card-title" style={{ marginBottom: 8 }}>BloomFi Staking Strategy Implications</div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
          <strong style={{ color: '#e5e7eb' }}>GMX model (80% staked)</strong> = highest staking participation because stakers get 30% of all platform fees. Creates strong token sink.<br/>
          <strong style={{ color: '#e5e7eb' }}>SNX model (60% staked)</strong> = staking is required to mint synthetic assets. Creates forced demand for the token.<br/>
          <strong style={{ color: '#e5e7eb' }}>HYPE model (30% staked)</strong> = lower staking but massive market cap. Dominated by community belief, not staking utility.<br/>
          <strong style={{ color: '#e5e7eb' }}>Fee discount model</strong> (DRIFT, VERTEX, APEX) = staking gives trading fee discounts. Lower participation but clearer utility.<br/><br/>
          <strong style={{ color: '#a78bfa' }}>BloomFi BLOSM consideration:</strong> With 70% of fees going to depositors, BLOSM staking could unlock additional yield boosts or governance rights over fee parameters. The key question: does staking the token give you a higher share of the 70%, or additional protocol revenue from the 30%?
        </div>
      </div>
    </>
  );
}

