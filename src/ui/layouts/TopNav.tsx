import { useState } from 'react';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { SearchInput } from '@/ui/components/SearchInput';

type TopNavProps = {
  onOuvrirSidebar: () => void;
};

export function TopNav({ onOuvrirSidebar }: TopNavProps) {
  const [userMenuOuvrir, setUserMenuOuvrir] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-4 px-4 lg:px-8">
        <Button className="lg:hidden" onClick={onOuvrirSidebar} size="sm" variant="secondary">
          Menu
        </Button>

        <div className="hidden min-w-0 lg:block">
          <p className="text-sm font-bold text-ink">Intranet Sonbae</p>
          <p className="text-xs text-ink-muted">Espace interne de l’équipe</p>
        </div>

        <SearchInput
          className="max-w-2xl flex-1"
          label="Rechercher dans l’intranet"
          placeholder="Documents, contacts, processus..."
        />

        <div className="hidden items-center gap-2 md:flex">
          <Badge tone="success">Démo</Badge>
          <Badge tone="info">Statique</Badge>
        </div>

        <div className="relative">
          <button
            aria-expanded={userMenuOuvrir}
            aria-haspopup="menu"
            className="flex min-h-11 items-center gap-3 rounded-ui border border-line bg-surface px-3 py-2 text-left transition hover:border-brand"
            onClick={() => setUserMenuOuvrir((open) => !open)}
            type="button"
          >
            <span className="flex size-8 items-center justify-center rounded-ui bg-brand text-sm font-bold text-white">
              AK
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-bold text-ink">Avery Kim</span>
              <span className="block text-xs text-ink-muted">Responsable de département</span>
            </span>
          </button>

          {userMenuOuvrir ? (
            <div
              className="absolute right-0 mt-2 w-56 rounded-ui border border-line bg-surface p-2 shadow-soft"
              role="menu"
            >
              <button
                className="w-full rounded-smui px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-canvas"
                role="menuitem"
                type="button"
              >
                Paramètres du profil
              </button>
              <button
                className="w-full rounded-smui px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-canvas"
                role="menuitem"
                type="button"
              >
                Préférences de notification
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
