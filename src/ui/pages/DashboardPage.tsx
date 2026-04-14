import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { SectionContent } from '@/domain/content';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card, CardHeader } from '@/ui/components/Card';
import { EmptyState } from '@/ui/components/EmptyState';
import { useAsync } from '@/ui/hooks/useAsync';
import { getNavigationItem } from '@/ui/navigation';

const clubPaths = [
  '/understand/presentation',
  '/understand/structure',
  '/understand/roles-deployment',
  '/understand/charters-labels',
  '/understand/governance-responsibilities',
  '/understand/institutional-legal-docs',
];

const basicPaths = ['/basics/operations-systems', '/basics/numbers-kpis', '/basics/calculator'];

const processSteps = [
  'Besoin identifié',
  'Responsable nommé',
  'Impact cartographié',
  'Pilote en cours',
  'Décision consignée',
  'Déploiement évalué',
];

function formatLastUpdated(sections: SectionContent[]) {
  const newest = sections
    .map((section) => Date.parse(section.lastUpdated))
    .filter((timestamp) => Number.isFinite(timestamp))
    .sort((left, right) => right - left)[0];

  if (!newest) {
    return 'Date de mise à jour indisponible';
  }

  return `Dernière mise à jour ${new Intl.DateTimeFormat('fr-BE', {
    dateStyle: 'medium',
  }).format(new Date(newest))}`;
}

function findSection(sections: SectionContent[], path: string) {
  return sections.find((section) => section.path === path);
}

export function DashboardPage() {
  const { contentRepository, analytics } = useAppServices();
  const state = useAsync(
    useCallback(async () => {
      const sections = await contentRepository.getSectionContents();

      analytics.track({ name: 'dashboard_viewed' });
      return { sections };
    }, [analytics, contentRepository]),
  );

  return (
    <AsyncBoundary state={state}>
      {({ sections }) => {
        const clubSections = clubPaths
          .map((path) => findSection(sections, path))
          .filter((section): section is SectionContent => Boolean(section));
        const basics = basicPaths
          .map((path) => findSection(sections, path))
          .filter((section): section is SectionContent => Boolean(section));
        const functionalRelays = findSection(sections, '/functional-relays');
        const processes = findSection(sections, '/processes-evolutions');

        return (
          <div className="space-y-10">
            <header className="rounded-ui border border-line bg-surface p-8 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-eyebrow uppercase tracking-[0.14em] text-brand">
                    Tableau de bord
                  </p>
                  <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-display">
                    Tableau de bord
                  </h1>
                  <p className="mt-4 text-lg leading-8 text-ink-muted">
                    Bon retour, Avery. Retrouvez le contexte du club, les relais, les processus et
                    les bases opérationnelles utiles à l’équipe.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <Badge tone="success">{formatLastUpdated(sections)}</Badge>
                  <Button variant="secondary">Ouvrir le briefing équipe</Button>
                </div>
              </div>
            </header>

            <section className="space-y-5" aria-labelledby="understand-club-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-eyebrow uppercase tracking-[0.14em] text-brand">Orientation</p>
                  <h2 className="mt-1 text-2xl font-black text-ink" id="understand-club-title">
                    Comprendre le club
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-ink-muted">
                  Six pages essentielles pour la structure, les responsabilités, les standards et
                  les références institutionnelles.
                </p>
              </div>

              {clubSections.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {clubSections.map((section, index) => {
                    const navItem = getNavigationItem(section.path);

                    return (
                      <Link
                        className="group rounded-ui border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-soft"
                        key={section.path}
                        to={section.path}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-ui bg-brand-soft text-sm font-black text-brand-dark">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <Badge tone="brand">{section.lastUpdated}</Badge>
                        </div>
                        <h3 className="mt-5 text-lg font-black text-ink group-hover:text-brand-dark">
                          {section.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">
                          {navItem?.description ?? section.summary}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  description="Publiez les six entrées Comprendre le club dans sectionContent.json pour alimenter cette zone."
                  title="Aucun contenu de présentation"
                />
              )}
            </section>

            <section aria-labelledby="functional-relays-title">
              {functionalRelays ? (
                <Card as="section" className="overflow-hidden border-brand/20 bg-brand-soft p-0">
                  <div className="grid gap-0 lg:grid-cols-[1fr_20rem]">
                    <div className="p-8">
                      <Badge tone="brand">Coordination</Badge>
                      <h2
                        className="mt-4 text-3xl font-black text-ink"
                        id="functional-relays-title"
                      >
                        Relais fonctionnels
                      </h2>
                      <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-muted">
                        {functionalRelays.summary}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button>Ouvrir l’annuaire des relais</Button>
                        <Button variant="secondary">Demander de l’aide</Button>
                      </div>
                    </div>
                    <div className="border-t border-brand/20 bg-surface p-6 lg:border-l lg:border-t-0">
                      <CardHeader
                        title="Points de contact"
                        description="Utilisez le bon relais pour débloquer les sujets entre équipes."
                      />
                      <div className="mt-5 space-y-3">
                        {(functionalRelays.contacts ?? []).slice(0, 2).map((contact) => (
                          <div className="rounded-ui bg-canvas p-4" key={contact.email}>
                            <p className="font-bold text-ink">{contact.name}</p>
                            <p className="mt-1 text-sm leading-6 text-ink-muted">
                              {contact.responsibility}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <EmptyState
                  description="Ajoutez le contenu des relais fonctionnels dans sectionContent.json pour activer ce panneau."
                  title="Relais fonctionnels indisponibles"
                />
              )}
            </section>

            <section className="space-y-5" aria-labelledby="processes-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-eyebrow uppercase tracking-[0.14em] text-brand">
                    Flux de changement
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-ink" id="processes-title">
                    Processus et évolutions
                  </h2>
                </div>
                <Link className="font-bold text-brand hover:underline" to="/processes-evolutions">
                  Voir la bibliothèque des processus
                </Link>
              </div>

              {processes ? (
                <div className="overflow-x-auto rounded-ui border border-line bg-surface p-5 shadow-sm">
                  <ol className="grid min-w-[920px] grid-cols-6 gap-3">
                    {processSteps.map((step, index) => (
                      <li key={step}>
                        <Link
                          className="group flex h-full flex-col rounded-ui border border-line bg-canvas p-4 transition hover:border-brand hover:bg-brand-soft"
                          to="/processes-evolutions"
                        >
                          <span className="flex size-9 items-center justify-center rounded-ui bg-surface text-sm font-black text-brand ring-1 ring-line">
                            {index + 1}
                          </span>
                          <span className="mt-4 font-black text-ink group-hover:text-brand-dark">
                            {step}
                          </span>
                          <span className="mt-2 text-sm leading-6 text-ink-muted">
                            {processes.timeline?.[index]?.description ??
                              'Ouvrez la page du processus pour consulter les détails et le responsable.'}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <EmptyState
                  description="Ajoutez du contenu processus pour afficher la frise en six étapes."
                  title="Frise des processus indisponible"
                />
              )}
            </section>

            <section className="space-y-5" aria-labelledby="basics-title">
              <div>
                <p className="text-eyebrow uppercase tracking-[0.14em] text-brand">
                  Références clés
                </p>
                <h2 className="mt-1 text-2xl font-black text-ink" id="basics-title">
                  Bases
                </h2>
              </div>

              {basics.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {basics.map((section) => (
                    <Link
                      className="rounded-ui border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-soft"
                      key={section.path}
                      to={section.path}
                    >
                      <Badge tone="info">{section.lastUpdated}</Badge>
                      <h3 className="mt-5 text-xl font-black text-ink">{section.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-ink-muted">{section.summary}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="Ajoutez les contenus Opérations et systèmes, Chiffres et KPI, et Calculateur au dépôt."
                  title="Contenu de base indisponible"
                />
              )}
            </section>
          </div>
        );
      }}
    </AsyncBoundary>
  );
}
