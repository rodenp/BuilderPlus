import React from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FlexValues {
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap: string;
}

interface FlexControlProps {
  value: FlexValues;
  onChange: (value: FlexValues) => void;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

const directionOptions = [
  { value: 'row', icon: ArrowRight, label: 'Row' },
  { value: 'row-reverse', icon: ArrowLeft, label: 'Row Reverse' },
  { value: 'column', icon: ArrowDown, label: 'Column' },
  { value: 'column-reverse', icon: ArrowUp, label: 'Column Reverse' },
];

const justifyOptions = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'space-between', label: 'Between' },
  { value: 'space-around', label: 'Around' },
  { value: 'space-evenly', label: 'Evenly' },
];

const alignOptions = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'stretch', label: 'Stretch' },
  { value: 'baseline', label: 'Baseline' },
];

const wrapOptions = [
  { value: 'nowrap', label: 'No Wrap' },
  { value: 'wrap', label: 'Wrap' },
  { value: 'wrap-reverse', label: 'Wrap Reverse' },
];

export const FlexControl: React.FC<FlexControlProps> = ({
  value,
  onChange,
  orientation: _orientation = 'horizontal',
  label,
  className,
}) => {
  const isVertical = value.direction === 'column' || value.direction === 'column-reverse';

  return (
    <div className={cn('ddb:flex ddb:flex-col ddb:gap-3', className)}>
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}

      {/* Direction */}
      <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
        <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
          Direction
        </span>
        <div className="ddb:flex ddb:gap-1">
          {directionOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ ...value, direction: opt.value as FlexValues['direction'] })}
                className={cn(
                  'ddb:flex-1 ddb:h-8 ddb:flex ddb:items-center ddb:justify-center',
                  'ddb:rounded ddb:transition-colors',
                  value.direction === opt.value
                    ? 'ddb:bg-primary-500 ddb:text-white'
                    : 'ddb:bg-surface-100 dark:ddb:bg-surface-800 ddb:text-surface-600 dark:ddb:text-surface-400 hover:ddb:bg-surface-200 dark:hover:ddb:bg-surface-700'
                )}
                title={opt.label}
              >
                <Icon className="ddb:w-4 ddb:h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Flex Preview */}
      <div className="ddb:relative ddb:p-4 ddb:bg-surface-100 dark:ddb:bg-surface-800 ddb:rounded-lg ddb:border ddb:border-surface-200 dark:ddb:border-surface-700">
        <div
          className={cn(
            'ddb:flex ddb:gap-1 ddb:min-h-[60px]',
            value.direction === 'row' && 'ddb:flex-row',
            value.direction === 'row-reverse' && 'ddb:flex-row-reverse',
            value.direction === 'column' && 'ddb:flex-col',
            value.direction === 'column-reverse' && 'ddb:flex-col-reverse',
            value.justify === 'flex-start' && 'ddb:justify-start',
            value.justify === 'center' && 'ddb:justify-center',
            value.justify === 'flex-end' && 'ddb:justify-end',
            value.justify === 'space-between' && 'ddb:justify-between',
            value.justify === 'space-around' && 'ddb:justify-around',
            value.justify === 'space-evenly' && 'ddb:justify-evenly',
            value.align === 'flex-start' && 'ddb:items-start',
            value.align === 'center' && 'ddb:items-center',
            value.align === 'flex-end' && 'ddb:items-end',
            value.align === 'stretch' && 'ddb:items-stretch',
            value.align === 'baseline' && 'ddb:items-baseline',
            value.wrap === 'wrap' && 'ddb:flex-wrap',
            value.wrap === 'wrap-reverse' && 'ddb:flex-wrap-reverse',
            value.wrap === 'nowrap' && 'ddb:flex-nowrap'
          )}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'ddb:bg-primary-400 ddb:rounded ddb:opacity-60',
                isVertical ? 'ddb:h-3 ddb:w-8' : 'ddb:w-3 ddb:h-8'
              )}
            />
          ))}
        </div>
      </div>

      {/* Justify Content */}
      <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
        <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
          Justify Content
        </span>
        <div className="ddb:grid ddb:grid-cols-3 ddb:gap-1">
          {justifyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...value, justify: opt.value as FlexValues['justify'] })}
              className={cn(
                'ddb:h-7 ddb:px-2 ddb:text-[10px]',
                'ddb:rounded ddb:transition-colors',
                value.justify === opt.value
                  ? 'ddb:bg-primary-500 ddb:text-white'
                  : 'ddb:bg-surface-100 dark:ddb:bg-surface-800 ddb:text-surface-600 dark:ddb:text-surface-400 hover:ddb:bg-surface-200 dark:hover:ddb:bg-surface-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Align Items */}
      <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
        <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
          Align Items
        </span>
        <div className="ddb:grid ddb:grid-cols-3 ddb:gap-1">
          {alignOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...value, align: opt.value as FlexValues['align'] })}
              className={cn(
                'ddb:h-7 ddb:px-2 ddb:text-[10px]',
                'ddb:rounded ddb:transition-colors',
                value.align === opt.value
                  ? 'ddb:bg-primary-500 ddb:text-white'
                  : 'ddb:bg-surface-100 dark:ddb:bg-surface-800 ddb:text-surface-600 dark:ddb:text-surface-400 hover:ddb:bg-surface-200 dark:hover:ddb:bg-surface-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wrap */}
      <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
        <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
          Flex Wrap
        </span>
        <div className="ddb:grid ddb:grid-cols-3 ddb:gap-1">
          {wrapOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...value, wrap: opt.value as FlexValues['wrap'] })}
              className={cn(
                'ddb:h-7 ddb:px-2 ddb:text-[10px]',
                'ddb:rounded ddb:transition-colors',
                value.wrap === opt.value
                  ? 'ddb:bg-primary-500 ddb:text-white'
                  : 'ddb:bg-surface-100 dark:ddb:bg-surface-800 ddb:text-surface-600 dark:ddb:text-surface-400 hover:ddb:bg-surface-200 dark:hover:ddb:bg-surface-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gap */}
      <div className="ddb:flex ddb:flex-col ddb:gap-1.5">
        <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
          Gap
        </span>
        <input
          type="text"
          value={value.gap}
          onChange={(e) => onChange({ ...value, gap: e.target.value })}
          placeholder="0px"
          className={cn(
            'ddb:w-full ddb:h-8 ddb:px-3 ddb:text-sm',
            'ddb:bg-surface-100 dark:ddb:bg-surface-800',
            'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
            'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
          )}
        />
      </div>
    </div>
  );
};
