import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className,
      wrapperClassName,
      id,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-dark/80"
          >
            {label}
            {required && <span className="text-emergency ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            required={required}
            className={cn(
              "input-field",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-emergency focus:ring-emergency/30 focus:border-emergency",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-emergency flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-dark/50">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  wrapperClassName,
  id,
  required,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark/80">
          {label}
          {required && <span className="text-emergency ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        required={required}
        className={cn(
          "input-field appearance-none cursor-pointer",
          error && "border-emergency focus:ring-emergency/30 focus:border-emergency",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-emergency flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-dark/50">{hint}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  wrapperClassName,
  id,
  required,
  ...props
}: TextareaProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark/80">
          {label}
          {required && <span className="text-emergency ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        required={required}
        className={cn(
          "input-field resize-none",
          error && "border-emergency focus:ring-emergency/30 focus:border-emergency",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-emergency flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-dark/50">{hint}</p>
      )}
    </div>
  );
}

export default Input;
