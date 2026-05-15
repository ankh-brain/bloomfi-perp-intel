import { fetchMarketOverview, formatUSD, formatPct } from '@/lib/defillama';
import { DashboardCharts } from '@/components/dashboard-charts';

export const revalidate = 300;

export default async function Dashboard() {
  const market = await fetchMarketOverview();
  const top20 = market.protocols.slice(0, 20);
  const top5share = top20.slice(0, 5).reduce((s, p) => s + p.marketShare, 0);

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Perp DEX Market Overview</h1>
        <p className="text-xs text-zinc-600 mt-1">
          {market.protocols.length} protocols &middot; Live via DefiLlama &middot; {new Date(market.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPI label="Total Open Interest" value={formatUSD(market.totalOI)} delta={`${market.protocols.length} protocols`} />
        <KPI label="Fees (24h)" value={formatUSD(market.totalFees24h)} delta={`30d: ${formatUSD(market.totalFees30d)}`} />
        <KPI label="Hyperliquid Share" value={`${top20[0]?.marketShare.toFixed(1)}%`} delta={`OI: ${formatUSD(top20[0]?.openInterest || 0)}`} accent />
        <KPI label="Top 5 Concentration" value={`${top5share.toFixed(1)}%`} delta="of total open interest" />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-800/60 overflow-hidden bg-zinc-950/50 mb-6">
        <div className="px-4 py-3 border-b border-zinc-800/40 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-300">Protocol Rankings</span>
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest">by open interest</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/40">
                {['#','Protocol','Open Interest','Share','Fees 24h','Fees 30d','24h','Chain'].map(h => (
                  <th key={h} className={`px-4 py-2.5 text-[10px] font-medium text-zinc-600 uppercase tracking-wider ${h === '#' ? 'text-left w-10' : h === 'Protocol' || h === 'Chain' ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {top20.map((p, i) => (
                <tr key={p.name} className="border-b border-zinc-800/20 hover:bg-zinc-800/10 transition-colors">
                  <td className="px-4 py-2.5 text-zinc-600 text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5 text-zinc-200 font-medium whitespace-nowrap">{p.name.replace(' Perps','').replace(' Perpetual Exchange','')}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-200">{formatUSD(p.openInterest)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-14 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500/70 rounded-full" style={{ width: `${Math.min(p.marketShare, 100)}%` }} />
                      </div>
                      <span className="text-xs text-zinc-500 font-mono w-10 text-right">{p.marketShare.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-400 text-xs">{p.fees24h > 0 ? formatUSD(p.fees24h, 2) : <span className="text-zinc-700">-</span>}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-400 text-xs">{p.fees30d > 0 ? formatUSD(p.fees30d) : <span className="text-zinc-700">-</span>}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`text-xs font-mono ${p.change1d > 0 ? 'text-emerald-500' : p.change1d < 0 ? 'text-red-400' : 'text-zinc-600'}`}>
                      {p.change1d !== 0 ? formatPct(p.change1d) : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[10px] text-zinc-600">{p.chains[0] || '-'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts protocols={top20} />
    </div>
  );
}

function KPI({ label, value, delta, accent }: { label: string; value: string; delta: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg px-4 py-3.5 border ${accent ? 'bg-violet-600/[0.04] border-violet-600/15' : 'bg-zinc-950/50 border-zinc-800/50'}`}>
      <div className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-semibold mt-1 tracking-tight ${accent ? 'text-violet-400' : 'text-zinc-100'}`}>{value}</div>
      <div className="text-[11px] text-zinc-600 mt-0.5">{delta}</div>
    </div>
  );
}

