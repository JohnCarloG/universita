export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-neutral-200 bg-white p-6 shadow-soft ${className}`}>
      {children}
    </div>
  );
}
