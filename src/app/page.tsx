import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';
import { DashboardCharts } from '@/components/dashboard-charts';

export const revalidate = 300; // ISR: regenerate every 5 min

export default async function Dashboard() {
  const market = await fetchMarketOverview();
  const top15 = market.protocols.slice(0, 20);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Perp DEX Market Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Live data from DefiLlama &middot; {market.protocols.length} protocols tracked &middot; Updated {new Date(market.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Total Open Interest"
          value={formatUSD(market.totalOI)}
          sub={`${market.protocols.length} protocols`}
        />
        <KPICard
          label="Total Fees (24h)"
          value={formatUSD(market.totalFees24h)}
          sub={`30d: ${formatUSD(market.totalFees30d)}`}
        />
        <KPICard
          label="Hyperliquid Dominance"
          value={`${top15[0]?.marketShare.toFixed(1)}%`}
          sub={`OI: ${formatUSD(top15[0]?.openInterest || 0)}`}
          highlight
        />
        <KPICard
          label="Top 5 Concentration"
          value={`${top15.slice(0, 5).reduce((s, p) => s + p.marketShare, 0).toFixed(1)}%`}
          sub="of total open interest"
        />
      </div>

      {/* Rankings Table */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#1a1a28] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Protocol Rankings</h2>
            <p className="text-xs text-gray-500">Sorted by open interest</p>
          </div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">Live Data</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a28]">
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Protocol</th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Open Interest</th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Market Share</th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fees (24h)</th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fees (30d)</th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">24h Change</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Chains</th>
              </tr>
            </thead>
            <tbody>
              {top15.map((p, i) => (
                <tr key={p.name} className="border-b border-[#131320] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 text-xs text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">{p.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-white">{formatUSD(p.openInterest)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-[#1a1a28] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${Math.min(p.marketShare, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-mono w-12 text-right">{p.marketShare.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-300">{formatUSD(p.fees24h, 2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-300">{formatUSD(p.fees30d)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-mono ${p.change1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPct(p.change1d)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.chains.slice(0, 2).map(c => (
                        <span key={c} className="text-[10px] px-1.5 py-0.5 bg-[#1a1a28] text-gray-400 rounded">{c}</span>
                      ))}
                      {p.chains.length > 2 && (
                        <span className="text-[10px] text-gray-500">+{p.chains.length - 2}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts protocols={top15} />
    </div>
  );
}

function KPICard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-purple-600/5 border-purple-600/20' : 'bg-[#0f0f16] border-[#1a1a28]'}`}>
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-bold tracking-tight ${highlight ? 'text-purple-400' : 'text-white'}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

