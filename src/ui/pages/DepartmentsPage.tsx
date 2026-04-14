import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { PageHeader } from '@/ui/components/PageHeader';
import { useAsync } from '@/ui/hooks/useAsync';

export function DepartmentsPage() {
  const { contentRepository } = useAppServices();
  const state = useAsync(
    useCallback(() => contentRepository.getDepartments(), [contentRepository]),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Départements"
        title="Équipes, responsables et priorités en cours."
        description="Ouvrez un département pour consulter ses axes de travail et les responsabilités associées."
      />

      <AsyncBoundary state={state}>
        {(departments) => (
          <section className="grid gap-5 md:grid-cols-2">
            {departments.map((department) => (
              <Link
                key={department.id}
                to={`/departments/${department.id}`}
                className="rounded border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-forest/40"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-forest">
                  {department.lead}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-ink">{department.name}</h2>
                <p className="mt-3 leading-7 text-ink/70">{department.summary}</p>
              </Link>
            ))}
          </section>
        )}
      </AsyncBoundary>
    </div>
  );
}
