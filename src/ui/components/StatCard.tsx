type StatCardProps = {
  label: string;
  value: string | number;
  tone?: 'forest' | 'coral' | 'gold';
};

const toneClass = {
  forest: 'border-forest/30 bg-forest/10 text-forest',
  coral: 'border-coral/30 bg-coral/10 text-coral',
  gold: 'border-gold/30 bg-gold/10 text-gold',
};

export function StatCard({ label, value, tone = 'forest' }: StatCardProps) {
  return (
    <div className={`rounded border p-5 ${toneClass[tone]}`}>
      <p className="text-sm font-medium text-ink/70">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
