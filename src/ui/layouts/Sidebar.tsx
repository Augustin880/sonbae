import { NavLink } from 'react-router-dom';
import { Badge } from '@/ui/components/Badge';
import { navigationGroups } from '@/ui/navigation';

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full flex-col bg-ink text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-ui bg-brand text-lg font-black">
            S
          </div>
          <div>
            <p className="text-base font-bold">Sonbae</p>
            <p className="text-xs text-white/65">Intranet équipe</p>
          </div>
        </div>
      </div>

      <nav aria-label="Navigation principale" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {navigationGroups.map((group) => (
            <section key={group.label}>
              <h2 className="px-3 text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                {group.label}
              </h2>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    className={({ isActive }) =>
                      [
                        'flex min-h-10 items-center justify-between gap-3 rounded-ui px-3 py-2 text-sm font-semibold transition',
                        isActive
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-white/75 hover:bg-white/10 hover:text-white',
                      ].join(' ')
                    }
                    end={item.path === '/'}
                    key={item.path}
                    onClick={onNavigate}
                    to={item.path}
                  >
                    <span>{item.label}</span>
                    {item.badge ? <Badge tone="signal">{item.badge}</Badge> : null}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}
