import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { canRoleApproveDocuments } from '@/domain/businessRules';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { PageHeader } from '@/ui/components/PageHeader';
import { useAsync } from '@/ui/hooks/useAsync';

export function JobRolePage() {
  const { roleId } = useParams();
  const { contentRepository } = useAppServices();
  const state = useAsync(
    useCallback(
      async () => (roleId ? contentRepository.getJobRole(roleId) : null),
      [contentRepository, roleId],
    ),
  );

  return (
    <AsyncBoundary state={state}>
      {(role) => {
        if (!role) {
          return (
            <PageHeader
              eyebrow="Introuvable"
              title="Rôle introuvable."
              description="The requested staff role is not available in the demo content."
            />
          );
        }

        return (
          <div className="space-y-8">
            <PageHeader eyebrow={role.level} title={role.title} description={role.summary} />

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded border border-ink/10 bg-white p-6 lg:col-span-2">
                <h2 className="text-2xl font-bold text-ink">Responsabilités</h2>
                <ul className="mt-5 grid gap-3 md:grid-cols-2">
                  {role.responsibilities.map((responsibility) => (
                    <li key={responsibility} className="rounded bg-paper p-4 text-ink">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="rounded border border-ink/10 bg-white p-6">
                <h2 className="text-2xl font-bold text-ink">Outils</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.tools.map((tool) => (
                    <span key={tool} className="rounded bg-sky px-3 py-2 text-sm font-semibold">
                      {tool}
                    </span>
                  ))}
                </div>
                <p className="mt-6 rounded bg-forest/10 p-4 text-sm font-semibold text-forest">
                  {canRoleApproveDocuments(role)
                    ? 'Validation documentaire activée'
                    : 'Validation documentaire transmise au responsable de département'}
                </p>
                <Link
                  className="mt-5 inline-block font-semibold text-forest hover:underline"
                  to="/departments"
                >
                  Retour aux départements
                </Link>
              </aside>
            </section>
          </div>
        );
      }}
    </AsyncBoundary>
  );
}
