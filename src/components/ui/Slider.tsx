import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
  showValue?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix = '',
  showValue = true,
  className,
}) => {
  return (
    <div className={cn('ddb:flex ddb:flex-col ddb:gap-2', className)}>
      {(label || showValue) && (
        <div className="ddb:flex ddb:items-center ddb:justify-between">
          {label && (
            <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
              {label}
            </label>
          )}
          {showValue && (
            <span className="ddb:text-xs ddb:font-mono ddb:text-surface-500">
              {value}{suffix}
            </span>
          )}
        </div>
      )}
      <SliderPrimitive.Root
        className="ddb:relative ddb:flex ddb:items-center ddb:select-none ddb:touch-none ddb:w-full ddb:h-5"
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
      >
        <SliderPrimitive.Track
          className={cn(
            'ddb:relative ddb:grow ddb:h-1.5 ddb:rounded-full',
            'ddb:bg-surface-200 dark:ddb:bg-surface-700'
          )}
        >
          <SliderPrimitive.Range
            className={cn(
              'ddb:absolute ddb:h-full ddb:rounded-full',
              'ddb:bg-primary-500'
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            'ddb:block ddb:w-4 ddb:h-4 ddb:rounded-full',
            'ddb:bg-white ddb:border-2 ddb:border-primary-500',
            'ddb:shadow-md ddb:transition-colors',
            'focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/30',
            'hover:ddb:border-primary-600'
          )}
        />
      </SliderPrimitive.Root>
    </div>
  );
};
