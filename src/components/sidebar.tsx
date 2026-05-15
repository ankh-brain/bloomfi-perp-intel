'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, Target, Layers, Activity, GitCompare, Flower2 } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/market-share', label: 'Market Share', icon: TrendingUp },
  { href: '/open-interest', label: 'Open Interest', icon: Layers },
  { href: '/fees', label: 'Fees & Revenue', icon: Activity },
  { href: '/competitive', label: 'Competitive Intel', icon: GitCompare },
  { href: '/opportunity', label: 'Opportunity Map', icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1a1a2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Flower2 size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' }}>BloomFi Intel</div>
            <div style={{ fontSize: 9, color: '#3f3f46', textTransform: 'uppercase' as const, letterSpacing: '0.12em' }}>Perp DEX Analytics</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: 8 }}>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a2e', fontSize: 10, color: '#3f3f46', lineHeight: 1.6 }}>
        Data via DefiLlama<br/>
        Auto-refresh 5 min<br/>
        <span style={{ color: 'rgba(124,58,237,0.5)' }}>Ankh Labs</span>
      </div>
    </aside>
  );
}

