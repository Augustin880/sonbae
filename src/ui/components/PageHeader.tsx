type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-forest">{eyebrow}</p>
      ) : null}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-bold leading-tight text-ink md:text-5xl">{title}</h1>
        <p className="text-lg leading-8 text-ink/70">{description}</p>
      </div>
    </header>
  );
}
