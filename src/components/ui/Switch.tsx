import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  className,
}) => {
  return (
    <div className={cn('ddb:flex ddb:items-center ddb:justify-between ddb:gap-3', className)}>
      <div className="ddb:flex ddb:flex-col ddb:gap-0.5">
        {label && (
          <label className="ddb:text-sm ddb:font-medium ddb:text-surface-700 dark:ddb:text-surface-300">
            {label}
          </label>
        )}
        {description && (
          <span className="ddb:text-xs ddb:text-surface-500">
            {description}
          </span>
        )}
      </div>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          'ddb:w-10 ddb:h-6 ddb:rounded-full ddb:relative',
          'ddb:transition-colors ddb:duration-200',
          'focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50',
          checked
            ? 'ddb:bg-primary-500'
            : 'ddb:bg-surface-300 dark:ddb:bg-surface-600'
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'ddb:block ddb:w-5 ddb:h-5 ddb:rounded-full',
            'ddb:bg-white ddb:shadow-md',
            'ddb:transition-transform ddb:duration-200',
            checked ? 'ddb:translate-x-[18px]' : 'ddb:translate-x-0.5'
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
};
