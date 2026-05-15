'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, Target, Layers, Activity, GitCompare, Flower2, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 w-56 bg-zinc-950 border-r border-zinc-800/50 flex flex-col z-50 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-4 py-5 border-b border-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Flower2 size={14} className="text-white" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-zinc-100 tracking-tight leading-tight">BloomFi Intel</div>
              <div className="text-[9px] text-zinc-600 uppercase tracking-[0.15em] leading-tight">Perp DEX Analytics</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2 px-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all my-0.5 ${
                  active
                    ? 'bg-violet-600/10 text-violet-400'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                }`}
              >
                <Icon size={15} className={active ? 'text-violet-400' : 'text-zinc-600'} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-zinc-800/50">
          <div className="text-[10px] text-zinc-700 leading-relaxed">
            Data via DefiLlama<br/>
            Auto-refresh 5 min<br/>
            <span className="text-violet-600/60">Ankh Labs</span>
          </div>
        </div>
      </aside>
    </>
  );
}

