import { Link } from 'react-router-dom';
import { PageHeader } from '@/ui/components/PageHeader';

export function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="404"
        title="Page introuvable."
        description="La page intranet demandée n’est pas disponible dans cette démo."
      />
      <Link className="inline-block rounded bg-ink px-5 py-3 font-semibold text-white" to="/">
        Retour au tableau de bord
      </Link>
    </div>
  );
}
