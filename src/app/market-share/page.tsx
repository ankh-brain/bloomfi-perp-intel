import { fetchMarketOverview, formatUSD } from '@/lib/defillama';
import { MarketShareCharts } from '@/components/market-share-charts';

export const revalidate = 300;

export default async function MarketSharePage() {
  const market = await fetchMarketOverview();
  return (
    <>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fafafa' }}>Market Share & Volume</h1>
      <p style={{ fontSize: 12, color: '#52525b', marginTop: 4, marginBottom: 24 }}>Who dominates and where the shifts are</p>
      <MarketShareCharts protocols={market.protocols} />
    </>
  );
}

