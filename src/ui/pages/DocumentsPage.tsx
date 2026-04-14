import { useCallback } from 'react';
import { sortDocumentsByRecentUpdate } from '@/domain/businessRules';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { PageHeader } from '@/ui/components/PageHeader';
import { useAsync } from '@/ui/hooks/useAsync';

const documentCategoryLabel = {
  calendar: 'Calendrier',
  charter: 'Charte',
  guide: 'Guide',
  institutional: 'Institutionnel',
  label: 'Label',
  legal: 'Juridique',
  policy: 'Politique',
  template: 'Modèle',
};

export function DocumentsPage() {
  const { contentRepository } = useAppServices();
  const state = useAsync(
    useCallback(
      async () => sortDocumentsByRecentUpdate(await contentRepository.getDocuments()),
      [contentRepository],
    ),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Documents"
        title="Politiques, modèles, guides et calendriers."
        description="Utilisez la bibliothèque statique pour consulter les documents de référence."
      />

      <AsyncBoundary state={state}>
        {(documents) => (
          <section className="divide-y divide-ink/10 rounded border border-ink/10 bg-white">
            {documents.map((document) => (
              <article key={document.id} className="grid gap-4 p-6 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-forest">
                    {documentCategoryLabel[document.category]}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-ink">{document.title}</h2>
                  <p className="mt-2 leading-7 text-ink/70">{document.summary}</p>
                  <p className="mt-3 text-sm text-ink/60">
                    {document.owner} - Mis à jour {document.updatedAt}
                  </p>
                </div>
                <a
                  className="h-fit rounded bg-ink px-4 py-2 text-center text-sm font-semibold text-white hover:bg-forest"
                  href={document.href}
                >
                  Ouvrir
                </a>
              </article>
            ))}
          </section>
        )}
      </AsyncBoundary>
    </div>
  );
}
