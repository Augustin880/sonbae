import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRolesForDepartment } from '@/domain/businessRules';
import type { Department, IntranetDocument, JobRole } from '@/domain/entities';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card, CardHeader } from '@/ui/components/Card';
import { DataList } from '@/ui/components/DataList';
import { EmptyState } from '@/ui/components/EmptyState';
import { Tabs, type TabItem } from '@/ui/components/Tabs';
import { useAsync } from '@/ui/hooks/useAsync';
import { PageShell } from '@/ui/pages/PageShell';

type DepartmentPageData = {
  department: Department;
  roles: JobRole[];
  documents: IntranetDocument[];
};

const roleLevelLabel: Record<JobRole['level'], string> = {
  admin: 'Administration',
  coordinator: 'Coordination',
  lead: 'Responsable',
  teacher: 'Enseignement',
};

const documentCategoryLabel: Record<IntranetDocument['category'], string> = {
  calendar: 'Calendrier',
  charter: 'Charte',
  guide: 'Guide',
  institutional: 'Institutionnel',
  label: 'Label',
  legal: 'Juridique',
  policy: 'Politique',
  template: 'Modèle',
};

export function DepartmentPage() {
  const { departmentId } = useParams();
  const { contentRepository } = useAppServices();
  const state = useAsync(
    useCallback(async (): Promise<DepartmentPageData | null> => {
      if (!departmentId) {
        return null;
      }

      const [department, roles, documents] = await Promise.all([
        contentRepository.getDepartment(departmentId),
        contentRepository.getJobRoles(),
        contentRepository.getDocuments(),
      ]);

      return department
        ? { department, roles: getRolesForDepartment(department, roles), documents }
        : null;
    }, [contentRepository, departmentId]),
  );

  return (
    <AsyncBoundary state={state}>
      {(result) => {
        if (!result) {
          return (
            <PageShell
              description="Le département demandé n’est pas disponible dans le contenu du dépôt."
              eyebrow="Introuvable"
              title="Département introuvable"
            >
              <EmptyState
                description="Revenez à l’organigramme et choisissez un département listé."
                title="Aucune fiche département"
              />
            </PageShell>
          );
        }

        return <DepartmentDetail data={result} />;
      }}
    </AsyncBoundary>
  );
}

function DepartmentDetail({ data }: { data: DepartmentPageData }) {
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

  return (
    <PageShell
      actions={
        <>
          <Button variant="secondary">Télécharger le PDF (démo)</Button>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-ui border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
            to="/understand/structure"
          >
            Retour à l’organigramme
          </Link>
        </>
      }
      description={data.department.summary}
      eyebrow={`Département - ${data.department.lead}`}
      title={data.department.name}
    >
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card as="section">
            <CardHeader
              eyebrow="Vue du département"
              title="Responsabilités"
              description="Responsabilités principales chargées depuis le dépôt de contenu."
            />
            <ul className="mt-6 grid gap-3">
              {data.department.responsibilities.map((responsibility) => (
                <li
                  className="rounded-ui border border-line bg-canvas px-4 py-3 text-sm font-semibold leading-6 text-ink"
                  key={responsibility}
                >
                  {responsibility}
                </li>
              ))}
            </ul>
          </Card>

          <Card as="aside">
            <CardHeader
              eyebrow="Points de contact"
              title="Qui contacter"
              description="Utilisez ces contacts pour les questions et escalades propres au département."
            />
            <div className="mt-6">
              <DataList
                items={data.department.contactPoints.map((contact) => ({
                  label: contact.name,
                  value: contact.role,
                  meta: contact.email,
                }))}
              />
            </div>
          </Card>
        </section>

        <Card as="section">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <CardHeader
              eyebrow="Rôles"
              title="Rôles dans ce département"
              description="Ouvrir un rôle pour consulter sa présentation, ses missions et ses ressources."
            />
            <Badge tone="brand">{data.roles.length} rôles</Badge>
          </div>

          {data.roles.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.roles.map((role) => (
                <button
                  className="group min-h-52 rounded-ui border border-line bg-canvas p-5 text-left transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft hover:shadow-soft focus-visible:shadow-focus"
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-ui bg-surface text-sm font-black text-brand ring-1 ring-line">
                      {role.title
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <Badge tone="info">{roleLevelLabel[role.level]}</Badge>
                  </div>
                  <h2 className="mt-5 text-xl font-black text-ink group-hover:text-brand-dark">
                    {role.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">
                    {role.summary}
                  </p>
                  <p className="mt-5 text-sm font-bold text-brand">Ouvrir le détail du rôle</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                description="Associez des rôles à ce département dans le contenu du dépôt pour alimenter cette zone."
                title="Aucun rôle dans ce département"
              />
            </div>
          )}
        </Card>

        <RoleDrawer
          documents={data.documents}
          onClose={() => setSelectedRole(null)}
          role={selectedRole}
        />
      </div>
    </PageShell>
  );
}

function RoleDrawer({
  role,
  documents,
  onClose,
}: {
  role: JobRole | null;
  documents: IntranetDocument[];
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState('presentation');

  useEffect(() => {
    if (!role) {
      return undefined;
    }

    setActiveTab('presentation');

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, role]);

  const tabs = useMemo<TabItem[]>(() => {
    if (!role) {
      return [];
    }

    return [
      {
        id: 'presentation',
        label: 'Présentation',
        content: (
          <div className="space-y-4">
            <p className="leading-7 text-ink-muted">{role.summary}</p>
            <DataList
              items={[
                { label: 'Niveau', value: roleLevelLabel[role.level] },
                { label: 'Identifiant département', value: role.departmentId },
                { label: 'Outils', value: role.tools.join(', ') || 'Aucun outil listé' },
              ]}
            />
          </div>
        ),
      },
      {
        id: 'missions',
        label: 'Missions',
        content: (
          <ul className="grid gap-3">
            {role.responsibilities.map((responsibility) => (
              <li
                className="rounded-ui border border-line bg-canvas px-4 py-3 text-sm font-semibold leading-6 text-ink"
                key={responsibility}
              >
                {responsibility}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'documents',
        label: 'Documents / ressources',
        content: documents.length ? (
          <div className="grid gap-3">
            {documents.slice(0, 4).map((document) => (
              <article className="rounded-ui border border-line bg-canvas p-4" key={document.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-black text-ink">{document.title}</h3>
                  <Badge tone="brand">{documentCategoryLabel[document.category]}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{document.summary}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-subtle">
                  {document.owner} - Mis à jour {document.updatedAt}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Ajoutez des documents dans le dépôt pour afficher les ressources du rôle."
            title="Aucune ressource disponible"
          />
        ),
      },
    ];
  }, [documents, role]);

  if (!role) {
    return null;
  }

  return (
    <div
      aria-labelledby="role-drawer-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
    >
      <button
        aria-label="Fermer les détails du rôle"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-line bg-surface shadow-soft">
        <div className="border-b border-line p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="info">{roleLevelLabel[role.level]}</Badge>
              <h2 className="mt-3 text-2xl font-black text-ink" id="role-drawer-title">
                {role.title}
              </h2>
            </div>
            <Button onClick={onClose} size="sm" variant="ghost">
              Fermer
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs activeId={activeTab} items={tabs} onChange={setActiveTab} />
        </div>
      </aside>
    </div>
  );
}
