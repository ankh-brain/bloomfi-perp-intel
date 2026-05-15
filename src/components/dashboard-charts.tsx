'use client';

import { PerpProtocol, formatUSD } from '@/lib/defillama';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = ['#7C3AED', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316'];

export function DashboardCharts({ protocols }: { protocols: PerpProtocol[] }) {
  // Market share pie data
  const pieData = protocols.slice(0, 8).map((p, i) => ({
    name: p.name.replace(' Perps', '').replace(' Trade', ''),
    value: p.marketShare,
    oi: p.openInterest,
  }));
  const othersShare = protocols.slice(8).reduce((s, p) => s + p.marketShare, 0);
  if (othersShare > 0) pieData.push({ name: 'Others', value: othersShare, oi: 0 });

  // Fee comparison bar data
  const feeData = protocols
    .filter(p => p.fees24h > 0)
    .slice(0, 10)
    .map(p => ({
      name: p.name.replace(' Perps', '').replace(' Trade', '').replace(' Perpetual Exchange', ''),
      fees: p.fees24h,
      fees30d: p.fees30d,
    }));

  // OI bar data
  const oiData = protocols.slice(0, 10).map(p => ({
    name: p.name.replace(' Perps', '').replace(' Trade', ''),
    oi: p.openInterest / 1e6,
  }));

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Market Share Pie */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Market Share by OI</h3>
        <p className="text-xs text-gray-500 mb-4">Open interest distribution across protocols</p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#14141e', border: '1px solid #1a1a28', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: any) => `${Number(v).toFixed(1)}%`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {d.name} ({d.value.toFixed(1)}%)
            </div>
          ))}
        </div>
      </div>

      {/* OI Bar Chart */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Open Interest Comparison</h3>
        <p className="text-xs text-gray-500 mb-4">Top 10 protocols by current OI ($M)</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={oiData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
            <Tooltip
              contentStyle={{ background: '#14141e', border: '1px solid #1a1a28', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: any) => [`$${Number(v).toFixed(1)}M`, 'OI']}
            />
            <Bar dataKey="oi" radius={[0, 4, 4, 0]}>
              {oiData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fees Comparison */}
      <div className="bg-[#0f0f16] border border-[#1a1a28] rounded-xl p-6 col-span-2">
        <h3 className="text-sm font-semibold text-white mb-1">Fee Generation (24h)</h3>
        <p className="text-xs text-gray-500 mb-4">Who generates the most revenue</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={feeData} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
            <YAxis tickFormatter={(v) => `$${(v/1e6).toFixed(1)}M`} />
            <Tooltip
              contentStyle={{ background: '#14141e', border: '1px solid #1a1a28', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v: any) => [formatUSD(Number(v)), 'Fees 24h']}
            />
            <Bar dataKey="fees" fill="#7C3AED" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


