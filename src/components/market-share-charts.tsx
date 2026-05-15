'use client';
import { PerpProtocol, formatUSD } from '@/lib/defillama';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Treemap } from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#06b6d4', '#a78bfa', '#14b8a6', '#f97316'];
const TT = { background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', fontSize: '11px', padding: '8px 12px', color: '#a1a1aa' };

export function MarketShareCharts({ protocols }: { protocols: PerpProtocol[] }) {
  const top10 = protocols.slice(0, 10);

  const chainMap = new Map<string, number>();
  for (const p of protocols) {
    for (const c of p.chains) chainMap.set(c, (chainMap.get(c) || 0) + p.openInterest);
  }
  const chainData = Array.from(chainMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, value]) => ({ name, value: value / 1e6 }));

  const treemapData = top10.map((p, i) => ({
    name: p.name.replace(' Perps', '').replace(' Trade', ''),
    size: p.openInterest,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
      <div className="chart-card">
        <div className="chart-title">Market Share Treemap</div>
        <div className="chart-sub">Size proportional to open interest</div>
        <ResponsiveContainer width="100%" height={350}>
          <Treemap data={treemapData} dataKey="size" aspectRatio={4/3} stroke="#1a1a2e"
            content={({ x, y, width, height, name, fill }: any) => (
              <g>
                <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} opacity={0.85} />
                {width > 60 && height > 30 && (
                  <text x={x + width/2} y={y + height/2} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{name}</text>
                )}
              </g>
            )}
          />
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="chart-title">Where Traders Are (Chain Distribution)</div>
        <div className="chart-sub">Total OI by chain ($M)</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chainData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={95} />
            <Tooltip contentStyle={TT} formatter={(v: any) => [`$${Number(v).toFixed(1)}M`, 'OI']} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="data-table-wrap">
        <div className="data-table-header">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>All Protocols by Market Share</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Protocol</th>
              <th className="right">OI</th>
              <th className="right">Share</th>
              <th>Chain</th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((p, i) => (
              <tr key={p.name}>
                <td className="dim">{i+1}</td>
                <td className="bright">{p.name}</td>
                <td className="right mono bright">{formatUSD(p.openInterest)}</td>
                <td className="right mono dim">{p.marketShare.toFixed(1)}%</td>
                <td className="dim">{p.chains.slice(0,2).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

