'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, Target, Layers, Activity, GitCompare, Flower2, ArrowLeftRight, LineChart, BookOpen, Coins, DollarSign, Users } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/volume-trends', label: 'Volume & OI Trends', icon: LineChart },
  { href: '/markets', label: 'Per-Market OI', icon: Layers },
  { href: '/depth', label: 'Order Book Depth', icon: BookOpen },
  { href: '/funding', label: 'Funding Rates', icon: ArrowLeftRight },
  { href: '/fee-economics', label: 'Fee Economics', icon: DollarSign },
  { href: '/valuations', label: 'Token Valuations', icon: Coins },
  { href: '/market-share', label: 'Market Share', icon: TrendingUp },
  { href: '/competitive', label: 'Competitive Intel', icon: GitCompare },
  { href: '/opportunity', label: 'Opportunity Map', icon: Target },
  { href: '/on-chain', label: 'On-Chain Data', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-brand-row">
          <div className="sb-logo"><Flower2 size={14} color="#fff" /></div>
          <div>
            <div className="sb-name">BloomFi Intel</div>
            <div className="sb-sub">Perp DEX Analytics</div>
          </div>
        </div>
      </div>
      <nav className="sb-nav">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`sb-link${pathname === href ? ' active' : ''}`}>
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sb-footer">
        Data: DefiLlama, Hyperliquid, dYdX, CoinGecko<br/>
        Auto-refresh 1-5 min<br/><span>Ankh Labs</span>
      </div>
    </aside>
  );
}



