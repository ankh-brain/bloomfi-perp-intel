import { fetchMarketOverview, formatUSD } from '@/lib/defillama';

export const revalidate = 300;

export default async function Page() {
  const market = await fetchMarketOverview();
  const sorted = market.protocols.sort((a, b) => b.fees24h - a.fees24h);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Fees & Revenue</h1>
        <p className="text-sm text-gray-500 mt-1">Protocol economics and fee generation</p>
      </div>
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a28]">
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-gray-500 uppercase">#</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Protocol</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Fees 24h</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Fees 30d</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">24h Change</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Chain</th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 30).map((p, i) => (
              <tr key={p.name} className="border-b border-[#131320] hover:bg-white/[0.02]">
                <td className="px-6 py-2.5 text-xs text-gray-500">{i+1}</td>
                <td className="px-4 py-2.5 text-white font-medium">{p.name}</td>
                <td className="px-4 py-2.5 text-right font-mono text-gray-200">{formatUSD(p.fees24h)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-gray-400">{formatUSD(p.fees30d)}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`text-xs font-mono ${p.change1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {p.change1d >= 0 ? '+' : ''}{p.change1d.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-500">{p.chains.slice(0,2).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

