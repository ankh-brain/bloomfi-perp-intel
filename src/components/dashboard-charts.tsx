'use client';

import { PerpProtocol, formatUSD } from '@/lib/defillama';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#06b6d4', '#a78bfa', '#14b8a6', '#f97316'];
const TT = { background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', fontSize: '11px', padding: '8px 12px', color: '#a1a1aa' };

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

  const feeData = protocols.filter(p => p.fees24h > 1000).slice(0, 12).map(p => ({
    name: p.name.replace(' Perps', '').replace(' Trade', '').replace(' Perpetual Exchange', ''),
    fees: p.fees24h,
  }));

  return (
    <div className="grid-2">
      <div className="chart-card">
        <div className="chart-title">Market Share</div>
        <div className="chart-sub">by open interest</div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px 14px', marginTop: 8 }}>
          {pieData.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#52525b' }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-title">Open Interest</div>
        <div className="chart-sub">top 10 ($M)</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={oiData} layout="vertical" margin={{ left: 70 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}B` : `${v.toFixed(0)}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={65} />
            <Tooltip contentStyle={TT} formatter={(v: any) => [`$${Number(v).toFixed(0)}M`, 'OI']} />
            <Bar dataKey="oi" radius={[0, 3, 3, 0]}>
              {oiData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {feeData.length > 0 && (
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-title">Fee Generation (24h)</div>
          <div className="chart-sub">protocols generating &gt; $1K daily</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={50} />
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

