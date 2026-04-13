import { useCallback, useMemo, useState } from 'react';
import type { ContentResource, SectionContent, TimelineStep } from '@/domain/content';
import type { DocumentCategory, IntranetDocument } from '@/domain/entities';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card, CardHeader } from '@/ui/components/Card';
import { DataList } from '@/ui/components/DataList';
import { EmptyState } from '@/ui/components/EmptyState';
import { SearchInput } from '@/ui/components/SearchInput';
import { Tabs, type TabItem } from '@/ui/components/Tabs';
import { useAsync } from '@/ui/hooks/useAsync';
import { getNavigationItem } from '@/ui/navigation';
import { PageShell } from '@/ui/pages/PageShell';

type SectionPageProps = {
  path: string;
  category: string;
};

const resourceTone: Record<
  ContentResource['type'],
  'neutral' | 'brand' | 'accent' | 'signal' | 'info' | 'success'
> = {
  contact: 'info',
  document: 'brand',
  metric: 'signal',
  policy: 'accent',
  process: 'success',
  system: 'neutral',
};

const timelineTone: Record<TimelineStep['status'], 'success' | 'brand' | 'signal'> = {
  active: 'brand',
  completed: 'success',
  planned: 'signal',
};

export function IntranetSectionPage({ path, category }: SectionPageProps) {
  const { contentRepository } = useAppServices();
  const item = getNavigationItem(path);
  const state = useAsync(
    useCallback(async () => {
      const [content, documents] = await Promise.all([
        contentRepository.getSectionContent(path),
        contentRepository.getDocuments(),
      ]);

      return { content, documents };
    }, [contentRepository, path]),
  );

  return (
    <AsyncBoundary state={state}>
      {({ content, documents }) => {
        if (!content) {
          return (
            <PageShell
              description="Aucun contenu de démo n’a encore été publié pour cette rubrique."
              eyebrow={category}
              title={item?.label ?? 'Rubrique intranet'}
            >
              <EmptyState
                description="Ajoutez une entrée correspondante dans sectionContent.json et exposez-la via le dépôt."
                title="Contenu introuvable"
              />
            </PageShell>
          );
        }

        if (
          path === '/understand/charters-labels' ||
          path === '/understand/institutional-legal-docs'
        ) {
          return (
            <DocumentsExperience category={category} content={content} documents={documents} />
          );
        }

        return <SectionContentView category={category} content={content} />;
      }}
    </AsyncBoundary>
  );
}

function DocumentsExperience({
  category,
  content,
  documents,
}: {
  category: string;
  content: SectionContent;
  documents: IntranetDocument[];
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const sectionDocuments = useMemo(
    () => documents.filter((document) => document.sectionPaths.includes(content.path)),
    [content.path, documents],
  );
  const categories = useMemo(
    () => Array.from(new Set(sectionDocuments.map((document) => document.category))).sort(),
    [sectionDocuments],
  );
  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sectionDocuments.filter((document) => {
      const matchesCategory = selectedCategory === 'all' || document.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [document.title, document.summary, document.owner, document.category]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, sectionDocuments, selectedCategory]);

  return (
    <PageShell
      actions={
        <>
          <Button variant="secondary">Exporter la liste</Button>
          <Button>Demander une mise à jour</Button>
        </>
      }
      description={content.summary}
      eyebrow={`${category} - Mis à jour ${content.lastUpdated}`}
      title={content.title}
    >
      <div className="space-y-6">
        <Card as="section">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <CardHeader
              eyebrow="Bibliothèque de documents"
              title="Rechercher et filtrer les documents"
              description="Les liens de démo utilisent des PDF factices ou des URL externes, modélisés dans le dépôt."
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_14rem] lg:w-[34rem]">
              <SearchInput
                label="Rechercher des documents"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Titre, responsable, mot-clé..."
                value={query}
              />
              <label className="block">
                <span className="sr-only">Filtrer par type de document</span>
                <select
                  className="min-h-11 w-full rounded-ui border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink shadow-sm focus:border-brand focus:shadow-focus"
                  onChange={(event) =>
                    setSelectedCategory(event.target.value as DocumentCategory | 'all')
                  }
                  value={selectedCategory}
                >
                  <option value="all">Tous les types</option>
                  {categories.map((documentCategory) => (
                    <option key={documentCategory} value={documentCategory}>
                      {documentCategory}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </Card>

        {filteredDocuments.length > 0 ? (
          <section
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            aria-label={`${content.title} documents`}
          >
            {filteredDocuments.map((document) => (
              <Card as="article" className="flex min-h-72 flex-col" key={document.id}>
                <div className="flex items-start justify-between gap-3">
                  <Badge tone="brand">{document.category}</Badge>
                  <Badge tone={document.linkType === 'external' ? 'info' : 'neutral'}>
                    {document.linkType === 'external' ? 'Externe' : 'PDF'}
                  </Badge>
                </div>
                <h2 className="mt-5 text-xl font-black text-ink">{document.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{document.summary}</p>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-subtle">
                    {document.owner} - Dernière mise à jour {document.updatedAt}
                  </p>
                  <a
                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-ui bg-brand px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-dark"
                    href={document.href}
                    rel="noreferrer"
                    target={document.linkType === 'external' ? '_blank' : undefined}
                  >
                    Voir
                  </a>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <EmptyState
            actionLabel="Réinitialiser les filtres"
            description="Aucun document ne correspond au type et au mot-clé sélectionnés."
            onAction={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            title="Aucun document trouvé"
          />
        )}
      </div>
    </PageShell>
  );
}

function SectionContentView({ category, content }: { category: string; content: SectionContent }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        id: 'overview',
        label: 'Vue d’ensemble',
        content: (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card as="section">
              <CardHeader
                eyebrow={category}
                title="Working content"
                description="Publié demo content loaded through the repository boundary."
              />
              <div className="mt-6 space-y-5">
                {content.blocks.map((block) => (
                  <article
                    className="rounded-ui border border-line bg-canvas p-5"
                    key={block.heading}
                  >
                    <h2 className="text-lg font-bold text-ink">{block.heading}</h2>
                    <p className="mt-3 leading-7 text-ink-muted">{block.body}</p>
                    {block.bullets ? (
                      <ul className="mt-4 grid gap-2 md:grid-cols-2">
                        {block.bullets.map((bullet) => (
                          <li
                            className="rounded-smui bg-surface px-3 py-2 text-sm font-semibold text-ink"
                            key={bullet}
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </Card>

            <Card as="aside">
              <CardHeader
                title="Statut du contenu"
                description="Repository metadata for this section."
              />
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge tone="success">Publié</Badge>
                <Badge tone="brand">Depuis le dépôt</Badge>
                <Badge tone="info">Démo statique</Badge>
              </div>
              <div className="mt-6">
                <DataList
                  items={[
                    {
                      label: 'Dernière mise à jour',
                      value: content.lastUpdated,
                      meta: 'Shown from JSON content',
                    },
                    { label: 'Ressources', value: content.resources.length },
                    { label: 'Points de contact', value: content.contacts?.length ?? 0 },
                    { label: 'Frise steps', value: content.timeline?.length ?? 0 },
                  ]}
                />
              </div>
            </Card>
          </div>
        ),
      },
      {
        id: 'resources',
        label: 'Ressources',
        content: (
          <Card as="section">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardHeader
                title="Index des ressources"
                description="Documents, règles, systèmes et responsables de cette rubrique."
              />
              <SearchInput
                className="w-full md:w-80"
                label="Rechercher des ressources"
                placeholder="Filtrer les ressources..."
              />
            </div>
            <div className="mt-6">
              {content.resources.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {content.resources.map((resource) => (
                    <article
                      className="rounded-ui border border-line bg-canvas p-5"
                      key={resource.title}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-bold text-ink">{resource.title}</h2>
                        <Badge tone={resourceTone[resource.type]}>{resource.type}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-ink-muted">
                        {resource.description}
                      </p>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-ink-subtle">
                        Responsable : {resource.owner}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="This section is intentionally reserved for future documents or linked systems."
                  title="Aucune ressource publiée"
                />
              )}
            </div>
          </Card>
        ),
      },
      {
        id: 'activity',
        label: 'Activity',
        content: (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <Card as="section">
              <CardHeader
                title="Frise"
                description="Current process stage or planned content evolution."
              />
              <div className="mt-6 space-y-3">
                {content.timeline && content.timeline.length > 0 ? (
                  content.timeline.map((step) => (
                    <div className="rounded-ui border border-line bg-canvas p-4" key={step.label}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-bold text-ink">{step.label}</p>
                        <Badge tone={timelineTone[step.status]}>{step.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-ink-muted">{step.description}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    description="Frise steps can be added to the content JSON when this page tracks a process."
                    title="Aucune frise pour cette rubrique"
                  />
                )}
              </div>
            </Card>

            <Card as="aside">
              <CardHeader
                title="Contacts et KPI"
                description="Named responsibilities and measurement placeholders."
              />
              <div className="mt-6 space-y-6">
                {content.contacts && content.contacts.length > 0 ? (
                  <DataList
                    items={content.contacts.map((contact) => ({
                      label: contact.name,
                      value: contact.responsibility,
                      meta: contact.email,
                    }))}
                  />
                ) : null}

                {content.kpis && content.kpis.length > 0 ? (
                  <div className="grid gap-3">
                    {content.kpis.map((kpi) => (
                      <div className="rounded-ui bg-canvas p-4" key={kpi.title}>
                        <p className="font-bold text-ink">{kpi.title}</p>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">{kpi.description}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {!content.contacts?.length && !content.kpis?.length ? (
                  <EmptyState
                    description="Ajoutez des contacts ou KPI au contenu de la rubrique si nécessaire."
                    title="Aucun contact ni KPI"
                  />
                ) : null}
              </div>
            </Card>
          </div>
        ),
      },
    ],
    [category, content],
  );

  return (
    <PageShell
      actions={
        <>
          <Button variant="secondary">Exporter</Button>
          <Button>Demander une mise à jour</Button>
        </>
      }
      description={content.summary}
      eyebrow={`${category} - Mis à jour ${content.lastUpdated}`}
      title={content.title}
    >
      <Tabs activeId={activeTab} items={tabs} onChange={setActiveTab} />
    </PageShell>
  );
}
