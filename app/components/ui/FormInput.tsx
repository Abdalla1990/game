interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}

export default function FormInput({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={id}
        className="block mb-1 font-semibold"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
