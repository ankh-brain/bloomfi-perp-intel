import { fetchMarketOverview, formatUSD } from '@/lib/defillama';
import { MarketShareCharts } from '@/components/market-share-charts';

export const revalidate = 300;

export default async function MarketSharePage() {
  const market = await fetchMarketOverview();
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Market Share & Volume</h1>
        <p className="text-sm text-gray-500 mt-1">Who dominates and where the shifts are happening</p>
      </div>
      <MarketShareCharts protocols={market.protocols} />
    </div>
  );
}

