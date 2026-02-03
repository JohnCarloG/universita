export default function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 disabled:bg-neutral-100 disabled:text-neutral-400 ${className}`}
      {...props}
    />
  );
}
