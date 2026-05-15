import { getDuneQueryResults, DUNE_QUERIES } from '@/lib/dune';
import { fetchHyperliquidStats } from '@/lib/extended';
import { formatUSD } from '@/lib/defillama';

export const revalidate = 3600; // 1hr cache for Dune data

export default async function OnChainPage() {
  const [duneStats, duneUsers, hyperStats] = await Promise.all([
    getDuneQueryResults(DUNE_QUERIES.PERP_DEX_DAILY_STATS),
    getDuneQueryResults(DUNE_QUERIES.HYPERLIQUID_DAILY_USERS),
    fetchHyperliquidStats(),
  ]);

  const hasData = duneStats.rows.length > 0 || duneUsers.rows.length > 0;

  return (
    <>
      <h1 className="page-title">On-Chain Analytics</h1>
      <p className="page-sub">
        User growth, daily active traders, transaction data &middot; via Dune Analytics + Hyperliquid API
      </p>

      {/* Hyperliquid global stats - always available */}
      <div className="kpi-row">
        <div className="kpi accent">
          <div className="kpi-label">Hyperliquid Total Users</div>
          <div className="kpi-val accent">{hyperStats.users.toLocaleString()}</div>
          <div className="kpi-sub">all-time registered</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Hyperliquid Daily Volume</div>
          <div className="kpi-val">{formatUSD(hyperStats.dailyVolume)}</div>
          <div className="kpi-sub">24h trading volume</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Hyperliquid All-Time Volume</div>
          <div className="kpi-val">{formatUSD(hyperStats.totalVolume)}</div>
          <div className="kpi-sub">cumulative</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Dune Data Status</div>
          <div className="kpi-val">{hasData ? 'Live' : 'Loading'}</div>
          <div className="kpi-sub">{hasData ? `${duneStats.rows.length + duneUsers.rows.length} data points` : 'Queries executing...'}</div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Dune daily stats table */}
          {duneStats.rows.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-head">
                <span className="card-title">Daily Trading Stats (Dune)</span>
                <span className="card-badge">{duneStats.columns.join(', ')}</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      {duneStats.columns.map(col => (
                        <th key={col} className={col !== 'day' ? 'r' : ''}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {duneStats.rows.slice(0, 30).map((row, i) => (
                      <tr key={i}>
                        {duneStats.columns.map(col => (
                          <td key={col} className={col !== 'day' ? 'r mono num' : 'bright'}>
                            {col === 'day' ? new Date(row[col]).toLocaleDateString() :
                             typeof row[col] === 'number' && row[col] > 1000 ? row[col].toLocaleString() :
                             String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dune user stats */}
          {duneUsers.rows.length > 0 && (
            <div className="card">
              <div className="card-head">
                <span className="card-title">Hyperliquid Daily Active Users (Dune)</span>
                <span className="card-badge">{duneUsers.columns.join(', ')}</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      {duneUsers.columns.map(col => (
                        <th key={col} className={col !== 'day' ? 'r' : ''}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {duneUsers.rows.slice(0, 30).map((row, i) => (
                      <tr key={i}>
                        {duneUsers.columns.map(col => (
                          <td key={col} className={col !== 'day' ? 'r mono num' : 'bright'}>
                            {col === 'day' ? new Date(row[col]).toLocaleDateString() :
                             typeof row[col] === 'number' ? row[col].toLocaleString() :
                             String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ padding: 24 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Dune Queries Executing</div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
            Custom Dune queries have been created and are executing. First run takes 1-5 minutes. 
            Subsequent loads will use cached results (1hr cache).<br/><br/>
            <strong style={{ color: '#e5e7eb' }}>Queries created:</strong><br/>
            - Query 7505459: Perp DEX Daily Stats (volume, unique traders, trade count)<br/>
            - Query 7505462: Hyperliquid Daily Active Users<br/><br/>
            Refresh this page in a few minutes to see results.
          </div>
        </div>
      )}
    </>
  );
}


