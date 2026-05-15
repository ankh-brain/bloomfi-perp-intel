import { fetchHyperliquidMarkets, fetchDydxMarkets } from '@/lib/protocols';
import { formatUSD } from '@/lib/defillama';

export const revalidate = 60; // refresh every minute for funding

export default async function FundingPage() {
  const [hyperMarkets, dydxMarkets] = await Promise.all([
    fetchHyperliquidMarkets(),
    fetchDydxMarkets(),
  ]);

  // Build comparison for top assets
  const topAssets = ['BTC', 'ETH', 'SOL', 'AVAX', 'BNB', 'DOGE', 'ARB', 'OP', 'SUI', 'LINK', 'AAVE', 'UNI', 'PEPE', 'WIF', 'TIA', 'JUP', 'HYPE', 'PENDLE', 'XRP', 'LTC'];
  
  const comparison = topAssets.map(asset => {
    const hyper = hyperMarkets.find(m => m.name === asset || m.name === `${asset}`);
    const dydx = dydxMarkets.find(m => m.ticker.startsWith(`${asset}-`));
    if (!hyper && !dydx) return null;
    return {
      asset,
      hyperFunding: hyper ? hyper.funding * 100 : null, // to percentage
      hyperOI: hyper ? hyper.oiValue : null,
      dydxFunding: dydx ? dydx.funding * 100 : null,
      dydxOI: dydx ? dydx.oiValue : null,
    };
  }).filter(Boolean) as any[];

  return (
    <>
      <h1 className="page-title">Funding Rates</h1>
      <p className="page-sub">Cross-DEX funding rate comparison &middot; Live data from protocol APIs</p>

      {/* Summary cards */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Hyperliquid Markets</div>
          <div className="kpi-val">{hyperMarkets.length}</div>
          <div className="kpi-sub">active perp pairs</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">dYdX Markets</div>
          <div className="kpi-val">{dydxMarkets.length}</div>
          <div className="kpi-sub">active perp pairs</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">BTC Funding (Hyper)</div>
          <div className="kpi-val accent">
            {hyperMarkets.find(m => m.name === 'BTC')
              ? `${(hyperMarkets.find(m => m.name === 'BTC')!.funding * 100).toFixed(6)}%`
              : '-'}
          </div>
          <div className="kpi-sub">per hour</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">ETH Funding (Hyper)</div>
          <div className="kpi-val">
            {hyperMarkets.find(m => m.name === 'ETH')
              ? `${(hyperMarkets.find(m => m.name === 'ETH')!.funding * 100).toFixed(6)}%`
              : '-'}
          </div>
          <div className="kpi-sub">per hour</div>
        </div>
      </div>

      {/* Cross-DEX comparison */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <span className="card-title">Cross-DEX Funding Rate Comparison</span>
          <span className="card-badge">Hyperliquid vs dYdX</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="r">Hyperliquid Funding</th>
                <th className="r">Hyperliquid OI</th>
                <th className="r">dYdX Funding</th>
                <th className="r">dYdX OI</th>
                <th className="r">Spread</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c: any) => {
                const spread = c.hyperFunding !== null && c.dydxFunding !== null
                  ? Math.abs(c.hyperFunding - c.dydxFunding)
                  : null;
                return (
                  <tr key={c.asset}>
                    <td className="bright">{c.asset}</td>
                    <td className="r mono">
                      {c.hyperFunding !== null ? (
                        <span className={c.hyperFunding >= 0 ? 'pos' : 'neg'}>
                          {c.hyperFunding >= 0 ? '+' : ''}{c.hyperFunding.toFixed(6)}%
                        </span>
                      ) : <span className="mute">&mdash;</span>}
                    </td>
                    <td className="r mono dim">{c.hyperOI ? formatUSD(c.hyperOI) : <span className="mute">&mdash;</span>}</td>
                    <td className="r mono">
                      {c.dydxFunding !== null ? (
                        <span className={c.dydxFunding >= 0 ? 'pos' : 'neg'}>
                          {c.dydxFunding >= 0 ? '+' : ''}{c.dydxFunding.toFixed(6)}%
                        </span>
                      ) : <span className="mute">&mdash;</span>}
                    </td>
                    <td className="r mono dim">{c.dydxOI ? formatUSD(c.dydxOI) : <span className="mute">&mdash;</span>}</td>
                    <td className="r mono dim">{spread !== null ? `${spread.toFixed(6)}%` : <span className="mute">&mdash;</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hyperliquid full markets */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <span className="card-title">Hyperliquid — All Markets</span>
          <span className="card-badge">{hyperMarkets.length} pairs &middot; sorted by OI</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Market</th>
                <th className="r">Funding Rate</th>
                <th className="r">Annualized</th>
                <th className="r">Mark Price</th>
                <th className="r">Open Interest (USD)</th>
              </tr>
            </thead>
            <tbody>
              {hyperMarkets.slice(0, 50).map((m, i) => {
                const fundingPct = m.funding * 100;
                const annualized = m.funding * 8760 * 100;
                return (
                  <tr key={m.name}>
                    <td className="dim">{i + 1}</td>
                    <td className="bright">{m.name}-USD</td>
                    <td className="r mono">
                      <span className={fundingPct >= 0 ? 'pos' : 'neg'}>
                        {fundingPct >= 0 ? '+' : ''}{fundingPct.toFixed(6)}%
                      </span>
                    </td>
                    <td className="r mono">
                      <span className={annualized >= 0 ? 'pos' : 'neg'}>
                        {annualized >= 0 ? '+' : ''}{annualized.toFixed(2)}%
                      </span>
                    </td>
                    <td className="r mono num">${m.markPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="r mono num">{formatUSD(m.oiValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* dYdX full markets */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">dYdX — All Markets</span>
          <span className="card-badge">{dydxMarkets.length} pairs &middot; sorted by OI</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Market</th>
                <th className="r">Funding Rate</th>
                <th className="r">Annualized</th>
                <th className="r">Mark Price</th>
                <th className="r">Open Interest (USD)</th>
              </tr>
            </thead>
            <tbody>
              {dydxMarkets.slice(0, 50).map((m, i) => {
                const fundingPct = m.funding * 100;
                const annualized = m.funding * 8760 * 100;
                return (
                  <tr key={m.ticker}>
                    <td className="dim">{i + 1}</td>
                    <td className="bright">{m.ticker}</td>
                    <td className="r mono">
                      <span className={fundingPct >= 0 ? 'pos' : 'neg'}>
                        {fundingPct >= 0 ? '+' : ''}{fundingPct.toFixed(6)}%
                      </span>
                    </td>
                    <td className="r mono">
                      <span className={annualized >= 0 ? 'pos' : 'neg'}>
                        {annualized >= 0 ? '+' : ''}{annualized.toFixed(2)}%
                      </span>
                    </td>
                    <td className="r mono num">${m.markPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="r mono num">{formatUSD(m.oiValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

