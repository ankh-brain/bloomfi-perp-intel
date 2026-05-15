'use client';
import { MarketOI } from '@/lib/extended';
import { formatUSD } from '@/lib/defillama';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Treemap } from 'recharts';

const C = ['#8b5cf6','#6366f1','#22c55e','#eab308','#ef4444','#ec4899','#06b6d4','#a78bfa','#14b8a6','#f97316','#f43f5e','#84cc16'];
const TT: any = { background:'#18181b', border:'1px solid #27272a', borderRadius:6, fontSize:11, padding:'8px 12px', color:'#9ca3af' };

export function OIBreakdownCharts({ markets }: { markets: MarketOI[] }) {
  const top10 = markets.slice(0, 10);
  const treemap = top10.map((m, i) => ({ name: m.name, size: m.oiUsd, fill: C[i % C.length] }));
  const barData = top10.map(m => ({ name: m.name, oi: m.oiUsd / 1e6 }));

  return (
    <div className="g2">
      <div className="chart-card">
        <div className="chart-title">OI Treemap</div>
        <div className="chart-sub">Size proportional to open interest</div>
        <ResponsiveContainer width="100%" height={280}>
          <Treemap data={treemap} dataKey="size" aspectRatio={4/3} stroke="#1e1e26"
            content={({ x, y, width, height, name, fill }: any) => (
              <g>
                <rect x={x} y={y} width={width} height={height} fill={fill} rx={3} opacity={0.85}/>
                {width > 50 && height > 25 && <text x={x+width/2} y={y+height/2} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{name}</text>}
              </g>
            )}
          />
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="chart-title">Top 10 Markets by OI</div>
        <div className="chart-sub">USD millions</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
            <XAxis type="number" tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+'B' : v.toFixed(0)+'M'}`}/>
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={45}/>
            <Tooltip contentStyle={TT} formatter={(v: any) => [`$${Number(v).toFixed(1)}M`, 'OI']}/>
            <Bar dataKey="oi" radius={[0,3,3,0]}>{barData.map((_,i)=><Cell key={i} fill={C[i%C.length]} opacity={0.8}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

