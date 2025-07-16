import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading,
  className,
  fullWidth,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded font-semibold transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:bg-gray-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-red-50",
    link: "text-blue-600 hover:underline bg-transparent"
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
