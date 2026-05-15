'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, Target, Layers, Activity, GitCompare, Flower2, ArrowLeftRight } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/market-share', label: 'Market Share', icon: TrendingUp },
  { href: '/open-interest', label: 'Open Interest', icon: Layers },
  { href: '/fees', label: 'Fees & Revenue', icon: Activity },
  { href: '/funding', label: 'Funding Rates', icon: ArrowLeftRight },
  { href: '/competitive', label: 'Competitive Intel', icon: GitCompare },
  { href: '/opportunity', label: 'Opportunity Map', icon: Target },
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
        Data via DefiLlama<br/>Auto-refresh 5 min<br/><span>Ankh Labs</span>
      </div>
    </aside>
  );
}




