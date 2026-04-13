type LoadingSkeletonProps = {
  lines?: number;
};

export function LoadingSkeleton({ lines = 4 }: LoadingSkeletonProps) {
  return (
    <div
      aria-label="Chargement"
      className="rounded-ui border border-line bg-surface p-6"
      role="status"
    >
      <div className="h-5 w-1/3 animate-pulse rounded-smui bg-line" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            className="h-4 animate-pulse rounded-smui bg-line"
            key={index}
            style={{ width: `${92 - index * 9}%` }}
          />
        ))}
      </div>
    </div>
  );
}
