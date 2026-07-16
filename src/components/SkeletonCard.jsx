export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="sk-badge" />
      <div className="sk-title" />
      <div className="sk-meta" />
      <div className="sk-line" />
      <div className="sk-line short" />
    </div>
  );
}
