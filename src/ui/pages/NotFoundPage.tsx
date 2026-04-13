import { Link } from 'react-router-dom';
import { PageHeader } from '@/ui/components/PageHeader';

export function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="404"
        title="Page not found."
        description="The intranet page you requested is not available in this demo."
      />
      <Link className="inline-block rounded bg-ink px-5 py-3 font-semibold text-white" to="/">
        Return to overview
      </Link>
    </div>
  );
}
