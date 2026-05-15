import { fetchVolumeHistory, fetchOIHistory } from '@/lib/extended';
import { VolumeChart } from '@/components/volume-chart';

export const revalidate = 600;

export default async function VolumeTrendsPage() {
  const [volumeData, oiData] = await Promise.all([
    fetchVolumeHistory(),
    fetchOIHistory(),
  ]);

  // Calculate stats
  const last7 = volumeData.slice(-7);
  const prev7 = volumeData.slice(-14, -7);
  const avg7d = last7.reduce((s, d) => s + d.volume, 0) / 7;
  const avgPrev7d = prev7.reduce((s, d) => s + d.volume, 0) / 7;
  const volumeChange = ((avg7d - avgPrev7d) / avgPrev7d) * 100;

  const latestOI = oiData[oiData.length - 1]?.oi || 0;
  const weekAgoOI = oiData[oiData.length - 8]?.oi || latestOI;
  const oiChange = ((latestOI - weekAgoOI) / weekAgoOI) * 100;

  const fmt = (n: number) => {
    if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
    return `$${n.toFixed(0)}`;
  };

  return (
    <>
      <h1 className="page-title">Volume & OI Trends</h1>
      <p className="page-sub">Historical DEX volume and open interest across all perp protocols</p>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Avg Daily Volume (7d)</div>
          <div className="kpi-val">{fmt(avg7d)}</div>
          <div className="kpi-sub">
            <span className={volumeChange >= 0 ? 'pos' : 'neg'}>{volumeChange >= 0 ? '+' : ''}{volumeChange.toFixed(1)}%</span> vs prev 7d
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Latest Daily Volume</div>
          <div className="kpi-val">{fmt(volumeData[volumeData.length - 1]?.volume || 0)}</div>
          <div className="kpi-sub">{new Date(volumeData[volumeData.length - 1]?.date || 0).toLocaleDateString()}</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">Current Total OI</div>
          <div className="kpi-val accent">{fmt(latestOI)}</div>
          <div className="kpi-sub">
            <span className={oiChange >= 0 ? 'pos' : 'neg'}>{oiChange >= 0 ? '+' : ''}{oiChange.toFixed(1)}%</span> vs 7d ago
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Data Points</div>
          <div className="kpi-val">{volumeData.length.toLocaleString()}</div>
          <div className="kpi-sub">days of history</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
        <VolumeChart data={volumeData} dataKey="volume" color="#8b5cf6" label="Daily DEX Volume" />
        <VolumeChart data={oiData} dataKey="oi" color="#22c55e" label="Total Open Interest" />
      </div>
    </>
  );
}

