import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select...',
  className,
}) => {
  return (
    <div className={cn('ddb:flex ddb:flex-col ddb:gap-1.5', className)}>
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onChange}>
        <SelectPrimitive.Trigger
          className={cn(
            'ddb:flex ddb:items-center ddb:justify-between',
            'ddb:h-9 ddb:px-3 ddb:w-full',
            'ddb:text-sm ddb:text-surface-900 dark:ddb:text-surface-100',
            'ddb:bg-surface-100 dark:ddb:bg-surface-800',
            'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
            'ddb:rounded-md ddb:transition-colors',
            'hover:ddb:border-surface-300 dark:hover:ddb:border-surface-600',
            'focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="ddb:w-4 ddb:h-4 ddb:text-surface-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              'ddb:z-50 ddb:overflow-hidden',
              'ddb:bg-white dark:ddb:bg-surface-900',
              'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
              'ddb:rounded-md ddb:shadow-lg'
            )}
          >
            <SelectPrimitive.Viewport className="ddb:p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'ddb:relative ddb:flex ddb:items-center',
                    'ddb:h-8 ddb:px-8 ddb:text-sm',
                    'ddb:text-surface-900 dark:ddb:text-surface-100',
                    'ddb:rounded ddb:cursor-pointer',
                    'ddb:outline-none ddb:select-none',
                    'data-[highlighted]:ddb:bg-primary-500/10 data-[highlighted]:ddb:text-primary-600',
                    'dark:data-[highlighted]:ddb:text-primary-400'
                  )}
                >
                  <SelectPrimitive.ItemText className="ddb:flex ddb:items-center ddb:gap-2">
                    {option.icon}
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ddb:absolute ddb:left-2">
                    <Check className="ddb:w-4 ddb:h-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};
