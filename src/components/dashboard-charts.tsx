'use client';

import { PerpProtocol, formatUSD } from '@/lib/defillama';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#06b6d4', '#a78bfa', '#14b8a6', '#f97316'];

const TT = { background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', fontSize: '11px', padding: '8px 12px' };

export function DashboardCharts({ protocols }: { protocols: PerpProtocol[] }) {
  const pieData = protocols.slice(0, 7).map((p) => ({
    name: p.name.replace(' Perps', '').replace(' Trade', '').replace(' Perpetual Exchange', ''),
    value: p.marketShare,
  }));
  const rest = protocols.slice(7).reduce((s, p) => s + p.marketShare, 0);
  if (rest > 0) pieData.push({ name: 'Others', value: rest });

  const oiData = protocols.slice(0, 10).map(p => ({
    name: p.name.replace(' Perps', '').replace(' Trade', '').replace(' Perpetual Exchange', ''),
    oi: p.openInterest / 1e6,
  }));

  const feeData = protocols.filter(p => p.fees24h > 1000).slice(0, 10).map(p => ({
    name: p.name.replace(' Perps', '').replace(' Trade', '').replace(' Perpetual Exchange', ''),
    fees: p.fees24h,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie */}
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-5">
        <div className="text-xs font-medium text-zinc-300 mb-0.5">Market Share</div>
        <div className="text-[10px] text-zinc-600 mb-4">by open interest</div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* OI Bar */}
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-5">
        <div className="text-xs font-medium text-zinc-300 mb-0.5">Open Interest</div>
        <div className="text-[10px] text-zinc-600 mb-4">top 10 ($M)</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={oiData} layout="vertical" margin={{ left: 70 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v >= 1000 ? `${(v/1000).toFixed(1)}B` : `${v.toFixed(0)}M`}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={65} />
            <Tooltip contentStyle={TT} formatter={(v: any) => [`$${Number(v).toFixed(0)}M`, 'OI']} />
            <Bar dataKey="oi" radius={[0, 3, 3, 0]}>
              {oiData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fees Bar */}
      {feeData.length > 0 && (
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-5 lg:col-span-2">
          <div className="text-xs font-medium text-zinc-300 mb-0.5">Fee Generation (24h)</div>
          <div className="text-[10px] text-zinc-600 mb-4">protocols with {">"} $1K daily fees</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" height={50} />
              <YAxis tickFormatter={(v) => `$${(v/1e3).toFixed(0)}K`} />
              <Tooltip contentStyle={TT} formatter={(v: any) => [formatUSD(Number(v)), 'Fees']} />
              <Bar dataKey="fees" fill="#8b5cf6" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

