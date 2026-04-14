import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Department, JobRole } from '@/domain/entities';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card, CardHeader } from '@/ui/components/Card';
import { EmptyState } from '@/ui/components/EmptyState';
import { useAsync } from '@/ui/hooks/useAsync';
import { PageShell } from '@/ui/pages/PageShell';

type StructureData = {
  departments: Department[];
  roles: JobRole[];
  lastUpdated: string;
  summary: string;
};

const roleLevelLabel: Record<JobRole['level'], string> = {
  admin: 'Administration',
  coordinator: 'Coordination',
  lead: 'Responsable',
  teacher: 'Enseignement',
};

function getInitials(value: string) {
  return value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getRolesForDepartment(department: Department, roles: JobRole[]) {
  const roleIds = new Set(department.roleIds);
  return roles.filter((role) => roleIds.has(role.id) || role.departmentId === department.id);
}

export function StructurePage() {
  const { contentRepository } = useAppServices();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const departmentRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const state = useAsync(
    useCallback(async (): Promise<StructureData> => {
      const [departments, roles, section] = await Promise.all([
        contentRepository.getDepartments(),
        contentRepository.getJobRoles(),
        contentRepository.getSectionContent('/understand/structure'),
      ]);

      return {
        departments,
        roles,
        lastUpdated: section?.lastUpdated ?? 'Indisponible',
        summary:
          section?.summary ??
          'L’organisation regroupe des départements pédagogiques et des fonctions de support opérationnel.',
      };
    }, [contentRepository]),
  );

  return (
    <AsyncBoundary state={state}>
      {(data) => (
        <StructureContent
          data={data}
          departmentRefs={departmentRefs}
          onSelectDepartment={setSelectedDepartmentId}
          selectedDepartmentId={selectedDepartmentId}
        />
      )}
    </AsyncBoundary>
  );
}

function StructureContent({
  data,
  departmentRefs,
  onSelectDepartment,
  selectedDepartmentId,
}: {
  data: StructureData;
  departmentRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  onSelectDepartment: (departmentId: string | null) => void;
  selectedDepartmentId: string | null;
}) {
  const selectedDepartment =
    data.departments.find((department) => department.id === selectedDepartmentId) ?? null;
  const selectedRoles = selectedDepartment
    ? getRolesForDepartment(selectedDepartment, data.roles)
    : [];

  const departmentColumns = useMemo(
    () =>
      data.departments.map((department, index) => ({
        department,
        index,
        roles: getRolesForDepartment(department, data.roles),
      })),
    [data.departments, data.roles],
  );

  function focusDepartment(index: number) {
    departmentRefs.current[index]?.focus();
  }

  function handleDepartmentKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = data.departments.length - 1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusDepartment(index === lastIndex ? 0 : index + 1);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusDepartment(index === 0 ? lastIndex : index - 1);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusDepartment(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusDepartment(lastIndex);
    }
  }

  return (
    <PageShell
      description={data.summary}
      eyebrow={`Comprendre le club - Mis à jour ${data.lastUpdated}`}
      title="Structure"
    >
      <div className="space-y-8">
        <Card as="section" className="overflow-hidden">
          <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
            <CardHeader
              eyebrow="Organigramme interactif"
              title="Direction et départements"
              description="Sélectionnez un département pour consulter son responsable, ses priorités et ses rôles."
            />
            <Badge tone="info">Clavier : flèches, début, fin</Badge>
          </div>

          {data.departments.length > 0 ? (
            <div className="mt-8">
              <div className="mx-auto max-w-sm rounded-ui border border-brand/30 bg-brand-soft p-5 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-ui bg-brand text-sm font-black text-white">
                  DIR
                </div>
                <h2 className="mt-4 text-xl font-black text-ink">Direction</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Direction générale, directions et responsables des décisions transversales.
                </p>
              </div>

              <div className="mx-auto h-10 w-px bg-line" aria-hidden="true" />
              <div className="h-px bg-line" aria-hidden="true" />

              <div
                aria-label="Départements"
                className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
                role="list"
              >
                {departmentColumns.map(({ department, index, roles }) => {
                  const isSelected = selectedDepartmentId === department.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={[
                        'group min-h-64 rounded-ui border bg-surface p-5 text-left shadow-sm transition focus-visible:shadow-focus',
                        isSelected
                          ? 'border-brand bg-brand-soft'
                          : 'border-line hover:-translate-y-0.5 hover:border-brand hover:shadow-soft',
                      ].join(' ')}
                      key={department.id}
                      onClick={() => onSelectDepartment(department.id)}
                      onKeyDown={(event) => handleDepartmentKeyDown(event, index)}
                      ref={(node) => {
                        departmentRefs.current[index] = node;
                      }}
                      role="listitem"
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-ui bg-canvas text-sm font-black text-brand ring-1 ring-line">
                          {getInitials(department.name)}
                        </div>
                        <span className="rounded-smui bg-info-soft px-2.5 py-1 text-xs font-black text-info">
                          DEP
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-black text-ink group-hover:text-brand-dark">
                        {department.name}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-ink-muted">
                        Responsable : {department.lead}
                      </p>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">
                        {department.summary}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Badge tone="brand">{roles.length} rôles</Badge>
                        <Badge tone="signal">{department.priorities.length} priorités</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                description="Ajoutez des départements au dépôt de contenu pour alimenter l’organigramme."
                title="Aucun département disponible"
              />
            </div>
          )}
        </Card>

        <DepartmentDrawer
          department={selectedDepartment}
          onClose={() => onSelectDepartment(null)}
          roles={selectedRoles}
        />
      </div>
    </PageShell>
  );
}

function DepartmentDrawer({
  department,
  roles,
  onClose,
}: {
  department: Department | null;
  roles: JobRole[];
  onClose: () => void;
}) {
  useEffect(() => {
    if (!department) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [department, onClose]);

  if (!department) {
    return null;
  }

  return (
    <div
      aria-labelledby="department-drawer-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
    >
      <button
        aria-label="Fermer les détails du département"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-line bg-surface shadow-soft">
        <div className="border-b border-line p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex size-14 items-center justify-center rounded-ui bg-brand text-sm font-black text-white">
                {getInitials(department.name)}
              </div>
              <h2 className="mt-4 text-2xl font-black text-ink" id="department-drawer-title">
                {department.name}
              </h2>
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                Responsable : {department.lead}
              </p>
            </div>
            <Button onClick={onClose} size="sm" variant="ghost">
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-brand">
              Vue d’ensemble
            </h3>
            <p className="mt-3 leading-7 text-ink-muted">{department.summary}</p>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-brand">Priorités</h3>
            <ul className="mt-3 grid gap-2">
              {department.priorities.map((priority) => (
                <li
                  className="rounded-ui bg-canvas px-4 py-3 text-sm font-semibold text-ink"
                  key={priority}
                >
                  {priority}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-brand">Rôles</h3>
            {roles.length > 0 ? (
              <div className="mt-3 space-y-3">
                {roles.map((role) => (
                  <article className="rounded-ui border border-line bg-canvas p-4" key={role.id}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="font-black text-ink">{role.title}</h4>
                      <Badge tone="brand">{roleLevelLabel[role.level]}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">{role.summary}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                description="Des fiches de rôle peuvent être associées à ce département via le dépôt de contenu."
                title="Aucun rôle listé"
              />
            )}
          </section>
        </div>

        <div className="mt-auto border-t border-line p-6">
          <Link
            className="inline-flex min-h-11 w-full items-center justify-center rounded-ui bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
            to={`/departments/${department.id}`}
          >
            Ouvrir la fiche du département
          </Link>
        </div>
      </aside>
    </div>
  );
}
