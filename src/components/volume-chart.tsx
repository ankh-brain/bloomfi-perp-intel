'use client';
import { formatUSD } from '@/lib/defillama';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TT: any = { background:'#18181b', border:'1px solid #27272a', borderRadius:6, fontSize:11, padding:'8px 12px', color:'#9ca3af' };

export function VolumeChart({ data, dataKey, color, label }: { data: any[]; dataKey: string; color: string; label: string }) {
  // Downsample to last 90 days
  const recent = data.slice(-90);

  return (
    <div className="chart-card">
      <div className="chart-title">{label}</div>
      <div className="chart-sub">Last 90 days</div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={recent}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month:'short', day:'numeric' })}
            tick={{ fontSize: 10 }}
            interval={Math.floor(recent.length / 8)}
          />
          <YAxis tickFormatter={(v) => `$${(v/1e9).toFixed(1)}B`} />
          <Tooltip
            contentStyle={TT}
            labelFormatter={(v) => new Date(v).toLocaleDateString('en', { month:'short', day:'numeric', year:'numeric' })}
            formatter={(v: any) => [formatUSD(Number(v)), label]}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad-${dataKey})`} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

