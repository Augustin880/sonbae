import { useCallback, useMemo, useState } from 'react';
import type { ContentBlock, SectionContent, TimelineStep } from '@/domain/content';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card, CardHeader } from '@/ui/components/Card';
import { DataList } from '@/ui/components/DataList';
import { EmptyState } from '@/ui/components/EmptyState';
import { useAsync } from '@/ui/hooks/useAsync';
import { PageShell } from '@/ui/pages/PageShell';

const statusTone: Record<TimelineStep['status'], 'brand' | 'signal' | 'success'> = {
  active: 'brand',
  completed: 'success',
  planned: 'signal',
};

function findBlockForStep(blocks: ContentBlock[], step: TimelineStep) {
  return blocks.find((block) => block.heading.toLowerCase() === step.label.toLowerCase());
}

export function ProcessesPage() {
  const { contentRepository } = useAppServices();
  const state = useAsync(
    useCallback(
      () => contentRepository.getSectionContent('/processes-evolutions'),
      [contentRepository],
    ),
  );

  return (
    <AsyncBoundary state={state}>
      {(content) => {
        if (!content) {
          return (
            <PageShell
              description="The process content is not available in the repository."
              eyebrow="Opérations"
              title="Processus et évolutions"
            >
              <EmptyState
                description="Ajoutez /processes-evolutions dans sectionContent.json pour alimenter cette page."
                title="Contenu du processus indisponible"
              />
            </PageShell>
          );
        }

        return <ProcessesContent content={content} />;
      }}
    </AsyncBoundary>
  );
}

function ProcessesContent({ content }: { content: SectionContent }) {
  const steps = content.timeline ?? [];
  const [selectedLabel, setSelectedLabel] = useState(steps[0]?.label ?? '');
  const selectedStep = steps.find((step) => step.label === selectedLabel) ?? steps[0] ?? null;
  const selectedBlock = selectedStep ? findBlockForStep(content.blocks, selectedStep) : null;

  const resourceItems = useMemo(
    () =>
      content.resources.map((resource) => ({
        label: resource.title,
        value: resource.description,
        meta: `${resource.owner} - ${resource.type}`,
      })),
    [content.resources],
  );

  return (
    <PageShell
      actions={
        <>
          <Button variant="secondary">Télécharger le schéma</Button>
          <Button>Demander une évolution</Button>
        </>
      }
      description={content.summary}
      eyebrow={`Opérations - Mis à jour ${content.lastUpdated}`}
      title={content.title}
    >
      {steps.length > 0 ? (
        <div className="space-y-8">
          <Card as="section" className="overflow-hidden">
            <CardHeader
              eyebrow="Cycle de vie"
              title="Frise du processus"
              description="Select a stage to review purpose, responsibilities, and next actions."
            />

            <div className="mt-8 overflow-x-auto pb-2">
              <ol className="grid min-w-[980px] grid-cols-6 gap-3" aria-label="Étapes du processus">
                {steps.map((step, index) => {
                  const isSelected = selectedStep?.label === step.label;

                  return (
                    <li key={step.label}>
                      <button
                        aria-current={isSelected ? 'step' : undefined}
                        className={[
                          'group flex h-full min-h-44 w-full flex-col rounded-ui border p-4 text-left transition focus-visible:shadow-focus',
                          isSelected
                            ? 'border-brand bg-brand-soft shadow-sm'
                            : 'border-line bg-canvas hover:border-brand hover:bg-brand-soft',
                        ].join(' ')}
                        onClick={() => setSelectedLabel(step.label)}
                        type="button"
                      >
                        <span className="flex size-9 items-center justify-center rounded-ui bg-surface text-sm font-black text-brand ring-1 ring-line">
                          {index + 1}
                        </span>
                        <span className="mt-4 text-base font-black text-ink group-hover:text-brand-dark">
                          {step.label}
                        </span>
                        <span className="mt-3">
                          <Badge tone={statusTone[step.status]}>{step.status}</Badge>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Card>

          {selectedStep ? (
            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card as="section">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <CardHeader
                    eyebrow="Étape sélectionnée"
                    title={selectedStep.label}
                    description={selectedStep.description}
                  />
                  <Badge tone={statusTone[selectedStep.status]}>{selectedStep.status}</Badge>
                </div>

                {selectedBlock ? (
                  <div className="mt-6 rounded-ui border border-line bg-canvas p-5">
                    <h2 className="text-lg font-black text-ink">{selectedBlock.heading}</h2>
                    <p className="mt-3 leading-7 text-ink-muted">{selectedBlock.body}</p>
                    {selectedBlock.bullets ? (
                      <ul className="mt-5 grid gap-3 md:grid-cols-3">
                        {selectedBlock.bullets.map((bullet) => (
                          <li
                            className="rounded-ui bg-surface px-4 py-3 text-sm font-bold text-ink ring-1 ring-line"
                            key={bullet}
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </Card>

              <Card as="aside">
                <CardHeader
                  eyebrow="Contenu du dépôt"
                  title="Ressources"
                  description="Reference materials and owners for process updates."
                />
                <div className="mt-6">
                  {resourceItems.length > 0 ? (
                    <DataList items={resourceItems} />
                  ) : (
                    <EmptyState
                      description="Attach process templates or guides in repository content."
                      title="Aucune ressource associée"
                    />
                  )}
                </div>
              </Card>
            </section>
          ) : null}
        </div>
      ) : (
        <EmptyState
          description="Ajoutez des étapes de frise au contenu du processus."
          title="Aucune frise de processus"
        />
      )}
    </PageShell>
  );
}
