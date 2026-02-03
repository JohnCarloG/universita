export default function FormField({
  id,
  label,
  children,
  helpText,
  errorText
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-neutral-700">
          {label}
        </label>
      )}
      {children}
      {helpText && !errorText && (
        <p className="text-xs text-neutral-500">{helpText}</p>
      )}
      {errorText && (
        <p className="text-xs font-semibold text-red-600" role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
}
