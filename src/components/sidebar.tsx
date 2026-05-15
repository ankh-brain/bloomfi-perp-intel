'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, Target, Layers, Activity, GitCompare, Flower2 } from 'lucide-react';

const nav = [
  { href: '/', label: 'Dashboard', icon: BarChart3, desc: 'Market overview' },
  { href: '/market-share', label: 'Market Share', icon: TrendingUp, desc: 'Volume & dominance' },
  { href: '/open-interest', label: 'Open Interest', icon: Layers, desc: 'OI trends & breakdown' },
  { href: '/fees', label: 'Fees & Revenue', icon: Activity, desc: 'Protocol economics' },
  { href: '/competitive', label: 'Competitive Intel', icon: GitCompare, desc: 'Head-to-head comparison' },
  { href: '/opportunity', label: 'BloomFi Opportunity', icon: Target, desc: 'Gap analysis & strategy' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#0a0a12] border-r border-[#1a1a28] flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 border-b border-[#1a1a28]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <Flower2 size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">BloomFi Intel</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Perp DEX Analytics</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-1">
        {nav.map(({ href, label, icon: Icon, desc }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={16} className={active ? 'text-purple-400' : 'text-gray-500'} />
              <div>
                <div className="font-medium">{label}</div>
                <div className={`text-[10px] ${active ? 'text-purple-400/60' : 'text-gray-600'}`}>{desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1a1a28]">
        <div className="text-[10px] text-gray-600 leading-relaxed">
          Data: DefiLlama (free API)<br/>
          Refreshes every 5 min<br/>
          Built by <span className="text-purple-400/60">Ankh Labs</span>
        </div>
      </div>
    </aside>
  );
}

