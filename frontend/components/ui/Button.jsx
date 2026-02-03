export default function Button({
  children,
  variant = 'solid',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = ''
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50';
  const variants = {
    solid: 'bg-primary text-white hover:bg-neutral-800 disabled:bg-neutral-400',
    ghost: 'bg-transparent text-primary hover:bg-neutral-100'
  };
  const sizes = {
    md: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-sm'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-80' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
