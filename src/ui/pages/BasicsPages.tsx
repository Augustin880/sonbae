import { useCallback, useState } from 'react';
import type { BasicsPageContent, CalculatorFieldConfig } from '@/domain/basics';
import { calculateRevenueEstimate } from '@/domain/calculator';
import { useAppServices } from '@/services/AppProvider';
import { AsyncBoundary } from '@/ui/components/AsyncBoundary';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card, CardHeader } from '@/ui/components/Card';
import { EmptyState } from '@/ui/components/EmptyState';
import { useAsync } from '@/ui/hooks/useAsync';
import { PageShell } from '@/ui/pages/PageShell';

type BasicsPageProps = {
  path: string;
  kind: 'operations' | 'kpis' | 'calculator';
};

const currencyFormatter = new Intl.NumberFormat('en', {
  currency: 'EUR',
  maximumFractionDigits: 0,
  style: 'currency',
});

export function BasicsPage({ path, kind }: BasicsPageProps) {
  const { contentRepository } = useAppServices();
  const state = useAsync(
    useCallback(() => contentRepository.getBasicsPageContent(path), [contentRepository, path]),
  );

  return (
    <AsyncBoundary state={state}>
      {(content) => {
        if (!content) {
          return (
            <PageShell
              description="La page demandée n’est pas disponible dans le dépôt."
              eyebrow="Bases"
              title="Bases content unavailable"
            >
              <EmptyState
                description="Ajoutez une entrée correspondante dans basicsContent.json pour alimenter cette page."
                title="Aucun contenu de base"
              />
            </PageShell>
          );
        }

        if (kind === 'kpis') {
          return <NumbersKpisPage content={content} />;
        }

        if (kind === 'calculator') {
          return <CalculatorPage content={content} />;
        }

        return <OperationsSystemsPage content={content} />;
      }}
    </AsyncBoundary>
  );
}

function BasicsShell({
  content,
  children,
}: {
  content: BasicsPageContent;
  children: React.ReactNode;
}) {
  return (
    <PageShell
      actions={
        <>
          <Button variant="secondary">Exporter</Button>
          <Button>Demander une mise à jour</Button>
        </>
      }
      description={content.summary}
      eyebrow={`Bases - Mis à jour ${content.lastUpdated}`}
      title={content.title}
    >
      {children}
    </PageShell>
  );
}

function OperationsSystemsPage({ content }: { content: BasicsPageContent }) {
  return (
    <BasicsShell content={content}>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card as="section">
          <CardHeader
            eyebrow="Consignes"
            title="Règles de fonctionnement"
            description="Consignes statiques chargées depuis le dépôt."
          />
          <div className="mt-6 space-y-4">
            {content.guidelines.map((guideline) => (
              <article
                className="rounded-ui border border-line bg-canvas p-5"
                key={guideline.title}
              >
                <h2 className="font-black text-ink">{guideline.title}</h2>
                <p className="mt-2 leading-7 text-ink-muted">{guideline.description}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card as="aside">
          <CardHeader
            eyebrow="Liens"
            title="Systèmes et raccourcis"
            description="Ces liens de démo pourront être pilotés par le serveur plus tard."
          />
          <div className="mt-6 space-y-3">
            {content.links.map((link) => (
              <a
                className="block rounded-ui border border-line bg-canvas p-4 transition hover:border-brand hover:bg-brand-soft"
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                <p className="font-black text-ink">{link.label}</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{link.description}</p>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </BasicsShell>
  );
}

function NumbersKpisPage({ content }: { content: BasicsPageContent }) {
  return (
    <BasicsShell content={content}>
      <div className="space-y-6">
        {content.kpis && content.kpis.length > 0 ? (
          <section
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            aria-label="KPI placeholders"
          >
            {content.kpis.map((kpi) => (
              <Card as="article" className="min-h-56" key={kpi.label}>
                <div className="flex items-start justify-between gap-3">
                  <Badge tone="info">Démo</Badge>
                  <Badge tone={kpi.trend.startsWith('+') ? 'success' : 'signal'}>{kpi.trend}</Badge>
                </div>
                <p className="mt-5 text-sm font-bold text-ink-muted">{kpi.label}</p>
                <p className="mt-2 text-4xl font-black text-ink">{kpi.value}</p>
                <p className="mt-4 text-sm leading-6 text-ink-muted">{kpi.description}</p>
              </Card>
            ))}
          </section>
        ) : (
          <EmptyState
            description="Ajoutez des KPI dans basicsContent.json pour alimenter les cartes."
            title="Aucun KPI disponible"
          />
        )}

        <Card as="section">
          <CardHeader
            title="Définitions et références"
            description="Liens loaded from repository content."
          />
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {content.links.map((link) => (
              <a
                className="rounded-ui border border-line bg-canvas p-4 font-bold text-brand hover:border-brand"
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </BasicsShell>
  );
}

function NumberField({
  field,
  value,
  onChange,
}: {
  field: CalculatorFieldConfig;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-ui border border-line bg-canvas p-4">
      <span className="font-black text-ink">{field.label}</span>
      <span className="mt-1 block text-sm leading-6 text-ink-muted">{field.helper}</span>
      <input
        className="mt-4 min-h-11 w-full rounded-ui border border-line bg-surface px-3 py-2 text-ink focus:border-brand focus:shadow-focus"
        max={field.max}
        min={field.min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={field.step}
        type="number"
        value={value}
      />
    </label>
  );
}

function CalculatorPage({ content }: { content: BasicsPageContent }) {
  const calculator = content.calculator;
  const [memberCount, setMemberCount] = useState(calculator?.fields.memberCount.defaultValue ?? 0);
  const [monthlyFee, setMonthlyFee] = useState(calculator?.fields.monthlyFee.defaultValue ?? 0);
  const [attendanceRatePercent, setAttendanceRatePercent] = useState(
    calculator?.fields.attendanceRatePercent.defaultValue ?? 0,
  );
  const estimate = calculateRevenueEstimate({
    attendanceRatePercent,
    memberCount,
    monthlyFee,
  });

  return (
    <BasicsShell content={content}>
      {calculator ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <Card as="section">
            <CardHeader
              eyebrow="Estimation de revenus"
              title="Calculateur mensuel"
              description="Constants, labels, ranges, and helper copy are loaded from repository content."
            />
            <div className="mt-6 grid gap-4">
              <NumberField
                field={calculator.fields.memberCount}
                onChange={setMemberCount}
                value={memberCount}
              />
              <NumberField
                field={calculator.fields.monthlyFee}
                onChange={setMonthlyFee}
                value={monthlyFee}
              />
              <NumberField
                field={calculator.fields.attendanceRatePercent}
                onChange={setAttendanceRatePercent}
                value={attendanceRatePercent}
              />
            </div>
          </Card>

          <Card as="aside">
            <CardHeader
              eyebrow="Estimation"
              title="Résultats mensuels"
              description="Pure domain logic calculates these values from the form inputs."
            />
            <div className="mt-6 grid gap-4">
              <div className="rounded-ui bg-brand-soft p-5">
                <p className="text-sm font-bold text-brand-dark">Revenu mensuel brut</p>
                <p className="mt-2 text-4xl font-black text-ink">
                  {currencyFormatter.format(estimate.grossMonthlyRevenue)}
                </p>
              </div>
              <div className="rounded-ui bg-canvas p-5">
                <p className="text-sm font-bold text-ink-muted">Revenu ajusté à la présence</p>
                <p className="mt-2 text-3xl font-black text-ink">
                  {currencyFormatter.format(estimate.attendanceAdjustedRevenue)}
                </p>
              </div>
              <div className="rounded-ui bg-canvas p-5">
                <p className="text-sm font-bold text-ink-muted">Membres actifs estimés</p>
                <p className="mt-2 text-3xl font-black text-ink">
                  {estimate.expectedActiveMembers}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState
          description="Add calculator configuration to basicsContent.json to activate this form."
          title="Calculateur indisponible"
        />
      )}
    </BasicsShell>
  );
}
