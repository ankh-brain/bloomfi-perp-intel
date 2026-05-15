// CT Intelligence - curated KOL list and perp DEX narratives

export interface KOL {
  handle: string;
  name: string;
  category: 'trader' | 'analyst' | 'protocol' | 'media' | 'builder';
  followers: string;
  focus: string;
  relevance: string;
}

// Curated list of perp DEX KOLs and key accounts
export const PERP_KOLS: KOL[] = [
  // Protocol accounts
  { handle: 'HyperliquidX', name: 'Hyperliquid', category: 'protocol', followers: '500K+', focus: 'Protocol updates, new listings', relevance: 'Dominant player - watch for feature launches, fee changes' },
  { handle: 'Lighter_xyz', name: 'Lighter', category: 'protocol', followers: '200K+', focus: 'ZK proofs, zero fees, new markets', relevance: 'Direct competitor narrative - zero fees vs BloomFi 70/30' },
  { handle: 'AsterDEX', name: 'Aster', category: 'protocol', followers: '150K+', focus: 'CEX-like UX, multi-chain, stock perps', relevance: 'Watch for incentive program results and user retention' },
  { handle: 'daboraXBT', name: 'Dabora', category: 'protocol', followers: '100K+', focus: 'Aster ecosystem updates', relevance: 'Aster narrative and strategy shifts' },
  { handle: 'daboraXBT', name: 'dYdX', category: 'protocol', followers: '300K+', focus: 'Governance, institutional', relevance: 'Declining market share - cautionary tale' },
  { handle: 'JupiterExchange', name: 'Jupiter', category: 'protocol', followers: '400K+', focus: 'Solana perps, aggregation', relevance: 'Solana ecosystem perp activity' },
  { handle: 'GMX_IO', name: 'GMX', category: 'protocol', followers: '200K+', focus: 'Arbitrum perps, GLP model', relevance: 'OG perp DEX - declining but still relevant' },
  { handle: 'DriftProtocol', name: 'Drift', category: 'protocol', followers: '150K+', focus: 'Solana perps', relevance: 'Solana perp competition' },
  { handle: 'vertex_protocol', name: 'Vertex', category: 'protocol', followers: '100K+', focus: 'Cross-chain, CLOB', relevance: 'Hybrid model worth tracking' },

  // Key analysts / traders
  { handle: 'CryptoRank_io', name: 'CryptoRank', category: 'analyst', followers: '200K+', focus: 'Market data, rankings', relevance: 'Regularly publishes perp DEX market share data' },
  { handle: 'DefiLlama', name: 'DefiLlama', category: 'analyst', followers: '500K+', focus: 'DeFi data, TVL, volumes', relevance: 'Primary data source for perp metrics' },
  { handle: 'trevor_flipper', name: 'Trevor Flipper', category: 'trader', followers: '50K+', focus: 'Lighter analytics, whale tracking', relevance: 'Built lighter-research.vercel.app - deep Lighter data' },
  { handle: 'Route2FI', name: 'Route 2 FI', category: 'analyst', followers: '300K+', focus: 'DeFi strategies, yields', relevance: 'Perp DEX yield comparisons and strategies' },
  { handle: 'cryptohayes', name: 'Arthur Hayes', category: 'analyst', followers: '500K+', focus: 'Macro, perps, BitMEX founder', relevance: 'Perp market thought leader, macro impact on derivatives' },
  { handle: 'HsakaTrades', name: 'Hsaka', category: 'trader', followers: '400K+', focus: 'Derivatives trading', relevance: 'Active perp trader with market insights' },
  { handle: 'coaboraXBT', name: 'Coba', category: 'trader', followers: '200K+', focus: 'On-chain perp analysis', relevance: 'Perp DEX flow analysis and alpha' },

  // Media
  { handle: 'TheBlock__', name: 'The Block', category: 'media', followers: '500K+', focus: 'Crypto news', relevance: 'Breaking perp DEX news, funding rounds' },
  { handle: 'DLNewsInfo', name: 'DL News', category: 'media', followers: '100K+', focus: 'DeFi journalism', relevance: 'In-depth perp DEX coverage' },
];

// Key narratives being tracked
export const PERP_NARRATIVES = [
  {
    title: 'The Perp Wars Consolidation',
    status: 'active',
    description: 'Hyperliquid has decisively reclaimed dominance post-Lighter airdrop. Market is consolidating to top 3 players.',
    signal: 'Points-to-airdrop model is dying. Organic volume and structural moats win.',
    bloomfiAngle: 'BloomFi should avoid incentive-driven growth. The 70/30 fee split IS the incentive - permanent, not promotional.',
  },
  {
    title: 'Zero-Fee Model Sustainability',
    status: 'active',
    description: 'Lighter\'s zero-fee model drew massive initial volume but sustainability is questioned as post-airdrop volumes dropped 70%.',
    signal: 'Zero fees attract mercenary capital. Traders leave when incentives end.',
    bloomfiAngle: 'BloomFi charges fees but gives 70% back. This is more sustainable than zero fees and creates aligned depositors.',
  },
  {
    title: 'Privacy in Perp Trading',
    status: 'emerging',
    description: 'Aster Chain launched with stealth addresses. Large traders want privacy to avoid front-running and copy-trading.',
    signal: 'Growing demand for private execution among institutional traders.',
    bloomfiAngle: 'Consider privacy features as differentiator, but prioritize transparency narrative first.',
  },
  {
    title: 'Real-World Asset Perps',
    status: 'emerging',
    description: 'Lighter segmented LLP into crypto, FX, and RWA buckets. Stock perps gaining traction on Aster.',
    signal: 'Market expanding beyond crypto-native perpetuals into traditional assets.',
    bloomfiAngle: 'Opportunity to launch with RWA perps from day one, leapfrogging competitors who are bolting it on.',
  },
  {
    title: 'L1 vs L2 vs Off-Chain Debate',
    status: 'active',
    description: 'Hyperliquid (custom L1), Lighter (ZK-rollup), Aster (own L1 + off-chain). Each claims their architecture is best.',
    signal: 'No consensus on ideal architecture. Users care about UX, not infra.',
    bloomfiAngle: 'BloomFi on OP Stack (L2) - practical choice. Don\'t compete on infra narrative, compete on economics.',
  },
  {
    title: 'Post-Airdrop Token Economics',
    status: 'cautionary',
    description: 'LIT dropped 11% on TGE day. HYPE is the only perp DEX token holding value long-term ($11B mcap).',
    signal: 'Market punishes VC-backed tokens with sell pressure. Rewards community-first launches.',
    bloomfiAngle: 'Critical for BLOSM TGE strategy. Self-funded + no VC sell pressure is a genuine narrative advantage.',
  },
];

// Search queries to monitor
export const CT_SEARCH_QUERIES = [
  'perp DEX market share 2026',
  'Hyperliquid vs Lighter',
  'perpetual futures decentralized',
  'perp DEX fees comparison',
  'on-chain derivatives volume',
  'DeFi perpetuals growth',
  'perp DEX airdrop token',
];

