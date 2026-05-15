export const revalidate = 60;

export default function DepthPage() {
  return (
    <>
      <h1 className="page-title">Order Book Depth</h1>
      <p className="page-sub">Liquidity quality on Hyperliquid &middot; Coming soon &middot; Real-time order book analysis</p>
      
      <div className="kpi">
        <div className="kpi-label">Status</div>
        <div className="kpi-val">Under Development</div>
        <div className="kpi-sub">This page will show live order book depth, spread analysis, and liquidity comparisons across markets. Data source: Hyperliquid L2 Book API.</div>
      </div>
    </>
  );
}

