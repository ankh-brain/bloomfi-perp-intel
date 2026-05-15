import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';

export const revalidate = 300;

export default async function Page() {
  const market = await fetchMarketOverview();
  const sorted = [...market.protocols].sort((a, b) => b.openInterest - a.openInterest).filter(p => p.openInterest > 0);

  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fafafa' }}>Open Interest</h1>
      <p style={{ fontSize: 12, color: '#52525b', marginTop: 4, marginBottom: 24 }}>OI trends and breakdown</p>

      <div className="data-table-wrap">
        <div style={{ overflowX: 'auto' as const }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Protocol</th>
                <th className="right">Open Interest</th>
                <th className="right">Market Share</th>
                <th className="right">24h Change</th>
                <th>Chain</th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 30).map((p, i) => (
                <tr key={p.name}>
                  <td className="dim">{i+1}</td>
                  <td className="bright">{p.name}</td>
                  <td className="right mono bright">{formatUSD(p.openInterest)}</td>
                  <td className="right mono dim">{formatUSD(p.openInterest)}</td>
                  <td className="right">
                    <span className={p.change1d >= 0 ? 'positive' : 'negative'} style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {formatPct(p.change1d)}
                    </span>
                  </td>
                  <td className="dim">{p.chains.slice(0,2).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

