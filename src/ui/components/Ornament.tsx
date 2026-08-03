interface OrnamentProps {
  className?: string;
}

/** Assinatura visual gastro — linha + losango dourado. */
export function Ornament({ className = '' }: OrnamentProps) {
  return (
    <div className={`ornament ${className}`.trim()} aria-hidden="true">
      <div className="ornament-line" />
      <div className="ornament-dot" />
      <div className="ornament-diamond" />
      <div className="ornament-dot" />
      <div className="ornament-line" />
    </div>
  );
}
