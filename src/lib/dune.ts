// Dune API integration
// Queries created for BloomFi Intel:
// 7505459 - Perp DEX Daily Stats (volume, traders, trades)
// 7505462 - Hyperliquid Daily Users
// 3552118 - (third-party perp query, may or may not be accessible)

const DUNE_KEY = process.env.DUNE_API_KEY || 'GgMbc1b1xtJTTjvxvEp7lOw3cKKqxXRc';
const DUNE_BASE = 'https://api.dune.com/api/v1';

interface DuneResult {
  rows: Record<string, any>[];
  columns: string[];
  state: string;
}

// Get latest results for a query (uses cached results if available)
export async function getDuneQueryResults(queryId: number, limit = 100): Promise<DuneResult> {
  try {
    const res = await fetch(`${DUNE_BASE}/query/${queryId}/results?limit=${limit}`, {
      headers: { 'X-Dune-API-Key': DUNE_KEY },
      next: { revalidate: 3600 }, // cache 1hr since Dune data doesn't change frequently
    });
    const data = await res.json();
    
    if (data.error) {
      console.error(`Dune query ${queryId} error:`, data.error);
      return { rows: [], columns: [], state: 'error' };
    }

    return {
      rows: data.result?.rows || [],
      columns: data.result?.metadata?.column_names || [],
      state: data.state || 'unknown',
    };
  } catch (e) {
    console.error(`Dune fetch failed for query ${queryId}:`, e);
    return { rows: [], columns: [], state: 'error' };
  }
}

// Execute a query and wait for results (with timeout)
export async function executeDuneQuery(queryId: number, timeoutMs = 120000): Promise<DuneResult> {
  try {
    // Trigger execution
    const execRes = await fetch(`${DUNE_BASE}/query/${queryId}/execute`, {
      method: 'POST',
      headers: { 'X-Dune-API-Key': DUNE_KEY, 'Content-Type': 'application/json' },
    });
    const execData = await execRes.json();
    const execId = execData.execution_id;
    
    if (!execId) return { rows: [], columns: [], state: 'no_execution_id' };

    // Poll for completion
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      await new Promise(r => setTimeout(r, 5000)); // wait 5s between polls
      
      const statusRes = await fetch(`${DUNE_BASE}/execution/${execId}/results?limit=1000`, {
        headers: { 'X-Dune-API-Key': DUNE_KEY },
      });
      const statusData = await statusRes.json();
      
      if (statusData.is_execution_finished || statusData.state === 'QUERY_STATE_COMPLETED') {
        return {
          rows: statusData.result?.rows || [],
          columns: statusData.result?.metadata?.column_names || [],
          state: 'completed',
        };
      }
      
      if (statusData.state === 'QUERY_STATE_FAILED') {
        return { rows: [], columns: [], state: 'failed' };
      }
    }
    
    return { rows: [], columns: [], state: 'timeout' };
  } catch (e) {
    console.error(`Dune execution failed for query ${queryId}:`, e);
    return { rows: [], columns: [], state: 'error' };
  }
}

// Our custom query IDs
export const DUNE_QUERIES = {
  PERP_DEX_DAILY_STATS: 7505459,
  HYPERLIQUID_DAILY_USERS: 7505462,
};

