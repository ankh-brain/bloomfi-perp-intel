'use client';
import { PerpProtocol, formatUSD } from '@/lib/defillama';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Treemap } from 'recharts';

const COLORS = ['#7C3AED', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316'];

export function MarketShareCharts({ protocols }: { protocols: PerpProtocol[] }) {
  const top10 = protocols.slice(0, 10);
  
  // Chain distribution
  const chainMap = new Map<string, number>();
  for (const p of protocols) {
    for (const c of p.chains) {
      chainMap.set(c, (chainMap.get(c) || 0) + p.openInterest);
    }
  }
  const chainData = Array.from(chainMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value: value / 1e6 }));

  // Treemap data
  const treemapData = top10.map((p, i) => ({
    name: p.name.replace(' Perps', '').replace(' Trade', ''),
    size: p.openInterest,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Treemap */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Market Share Treemap</h3>
        <p className="text-xs text-gray-500 mb-4">Size proportional to open interest</p>
        <ResponsiveContainer width="100%" height={350}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#1a1a28"
            content={({ x, y, width, height, name, fill }: any) => (
              <g>
                <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} opacity={0.85} />
                {width > 60 && height > 30 && (
                  <text x={x + width/2} y={y + height/2} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>
                    {name}
                  </text>
                )}
              </g>
            )}
          />
        </ResponsiveContainer>
      </div>

      {/* Chain distribution */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Where Traders Are (Chain Distribution)</h3>
        <p className="text-xs text-gray-500 mb-4">Total OI by chain ($M)</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chainData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={95} />
            <Tooltip
              contentStyle={{ background: '#14141e', border: '1px solid #1a1a28', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: any) => [`$${Number(v).toFixed(1)}M`, 'OI']}
            />
            <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full table */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a28]">
          <h3 className="text-sm font-semibold text-white">All Protocols by Market Share</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a28]">
              <th className="text-left px-6 py-2 text-[10px] font-semibold text-gray-500 uppercase">#</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase">Protocol</th>
              <th className="text-right px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase">OI</th>
              <th className="text-right px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase">Share</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase">Chain</th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((p, i) => (
              <tr key={p.name} className="border-b border-[#131320] hover:bg-white/[0.02]">
                <td className="px-6 py-2 text-xs text-gray-500">{i+1}</td>
                <td className="px-4 py-2 text-white font-medium">{p.name}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-300">{formatUSD(p.openInterest)}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-400">{p.marketShare.toFixed(1)}%</td>
                <td className="px-4 py-2 text-xs text-gray-500">{p.chains.slice(0,2).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


