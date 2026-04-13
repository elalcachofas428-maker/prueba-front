export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', style = {} }) {
  return <div className="skeleton" style={{ width, height, borderRadius, ...style }} />;
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height="16px" width="60%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="12px" width={i === lines - 1 ? '40%' : '100%'} />
      ))}
    </div>
  );
}
