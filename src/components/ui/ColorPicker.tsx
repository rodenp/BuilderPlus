import React, { useState, useCallback } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '../../utils/cn';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showAlpha?: boolean;
  presetColors?: string[];
  className?: string;
}

const defaultPresets = [
  '#000000', '#ffffff', '#f87171', '#fb923c', '#fbbf24', '#a3e635',
  '#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#9ca3af',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presetColors = defaultPresets,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = useCallback((color: string) => {
    onChange(color);
  }, [onChange]);

  return (
    <div className={cn('ddb:flex ddb:flex-col ddb:gap-1.5', className)}>
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'ddb:flex ddb:items-center ddb:gap-2 ddb:h-9 ddb:px-3',
              'ddb:bg-surface-100 dark:ddb:bg-surface-800',
              'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
              'ddb:rounded-md ddb:transition-colors',
              'hover:ddb:border-surface-300 dark:hover:ddb:border-surface-600',
              'focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
            )}
          >
            <div
              className="ddb:w-5 ddb:h-5 ddb:rounded ddb:border ddb:border-surface-300 dark:ddb:border-surface-600"
              style={{ backgroundColor: value || '#ffffff' }}
            />
            <span className="ddb:text-sm ddb:font-mono ddb:text-surface-700 dark:ddb:text-surface-300">
              {value || 'transparent'}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              'ddb:z-50 ddb:p-3 ddb:rounded-lg ddb:shadow-xl',
              'ddb:bg-white dark:ddb:bg-surface-900',
              'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700'
            )}
            sideOffset={5}
          >
            <div className="ddb:flex ddb:flex-col ddb:gap-3">
              <HexColorPicker color={value} onChange={onChange} />
              <div className="ddb:flex ddb:items-center ddb:gap-2">
                <span className="ddb:text-xs ddb:text-surface-500">#</span>
                <HexColorInput
                  color={value}
                  onChange={onChange}
                  className={cn(
                    'ddb:flex-1 ddb:h-8 ddb:px-2',
                    'ddb:text-sm ddb:font-mono ddb:uppercase',
                    'ddb:bg-surface-100 dark:ddb:bg-surface-800',
                    'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
                    'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
                  )}
                />
              </div>
              <div className="ddb:grid ddb:grid-cols-6 ddb:gap-1.5">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      'ddb:w-6 ddb:h-6 ddb:rounded ddb:border',
                      'ddb:transition-transform hover:ddb:scale-110',
                      value === color
                        ? 'ddb:border-primary-500 ddb:ring-2 ddb:ring-primary-500/30'
                        : 'ddb:border-surface-300 dark:ddb:border-surface-600'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetClick(color)}
                  />
                ))}
              </div>
              <button
                className={cn(
                  'ddb:text-xs ddb:text-surface-500 hover:ddb:text-surface-700',
                  'dark:hover:ddb:text-surface-300'
                )}
                onClick={() => onChange('')}
              >
                Clear color
              </button>
            </div>
            <Popover.Arrow className="ddb:fill-white dark:ddb:fill-surface-900" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
