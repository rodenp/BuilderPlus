import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  suffix,
  error,
  className,
  ...props
}) => {
  return (
    <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}
      <div className="ddb:relative">
        <input
          className={cn(
            'ddb:w-full ddb:h-9 ddb:px-3',
            'ddb:text-sm ddb:text-surface-900 dark:ddb:text-surface-100',
            'ddb:bg-surface-100 dark:ddb:bg-surface-800',
            'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
            'ddb:rounded-md ddb:transition-colors',
            'placeholder:ddb:text-surface-400 dark:placeholder:ddb:text-surface-500',
            'hover:ddb:border-surface-300 dark:hover:ddb:border-surface-600',
            'focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50 focus:ddb:border-primary-500',
            error && 'ddb:border-red-500 focus:ddb:ring-red-500/50',
            suffix && 'ddb:pr-10',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="ddb:absolute ddb:right-3 ddb:top-1/2 -ddb:translate-y-1/2 ddb:text-xs ddb:text-surface-400">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span className="ddb:text-xs ddb:text-red-500">{error}</span>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'ddb:w-full ddb:min-h-[80px] ddb:px-3 ddb:py-2',
          'ddb:text-sm ddb:text-surface-900 dark:ddb:text-surface-100',
          'ddb:bg-surface-100 dark:ddb:bg-surface-800',
          'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
          'ddb:rounded-md ddb:transition-colors ddb:resize-y',
          'placeholder:ddb:text-surface-400 dark:placeholder:ddb:text-surface-500',
          'hover:ddb:border-surface-300 dark:hover:ddb:border-surface-600',
          'focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50 focus:ddb:border-primary-500',
          error && 'ddb:border-red-500 focus:ddb:ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <span className="ddb:text-xs ddb:text-red-500">{error}</span>
      )}
    </div>
  );
};
