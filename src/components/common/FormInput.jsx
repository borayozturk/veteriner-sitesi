import { useState } from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  icon,
  helpText,
  autoComplete,
  rows = 4,
  maxLength,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2
    ${error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : isFocused
      ? 'border-emerald-500 ring-2 ring-emerald-200'
      : 'border-gray-300 hover:border-emerald-400'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${icon ? 'pl-12' : ''}
  `;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputElement = type === 'textarea' ? (
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      maxLength={maxLength}
      className={`${baseInputClasses} resize-none ${className}`}
      autoComplete={autoComplete}
      {...props}
    />
  ) : (
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      className={`${baseInputClasses} ${className}`}
      autoComplete={autoComplete}
      {...props}
    />
  );

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {inputElement}

        {maxLength && type === 'textarea' && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-start gap-1 text-red-600 text-sm animate-shake">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormInput;
