import React, { useState } from 'react';
import { Link2, Link2Off } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Select } from './Select';
import { ColorPicker } from './ColorPicker';

interface BorderValues {
  width: string;
  style: string;
  color: string;
  radius: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
}

interface BorderControlProps {
  value: BorderValues;
  onChange: (value: BorderValues) => void;
  label?: string;
  className?: string;
}

const borderStyleOptions = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'groove', label: 'Groove' },
  { value: 'ridge', label: 'Ridge' },
  { value: 'inset', label: 'Inset' },
  { value: 'outset', label: 'Outset' },
];

export const BorderControl: React.FC<BorderControlProps> = ({
  value,
  onChange,
  label,
  className,
}) => {
  const [radiusLinked, setRadiusLinked] = useState(
    value.radius.topLeft === value.radius.topRight &&
    value.radius.topRight === value.radius.bottomRight &&
    value.radius.bottomRight === value.radius.bottomLeft
  );

  const handleRadiusChange = (corner: keyof BorderValues['radius'], newValue: string) => {
    if (radiusLinked) {
      onChange({
        ...value,
        radius: {
          topLeft: newValue,
          topRight: newValue,
          bottomLeft: newValue,
          bottomRight: newValue,
        },
      });
    } else {
      onChange({
        ...value,
        radius: {
          ...value.radius,
          [corner]: newValue,
        },
      });
    }
  };

  return (
    <div className={cn('ddb:flex ddb:flex-col ddb:gap-3', className)}>
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}

      {/* Border Width, Style, Color */}
      <div className="ddb:grid ddb:grid-cols-3 ddb:gap-2">
        <div className="ddb:flex ddb:flex-col ddb:gap-1">
          <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
            Width
          </span>
          <input
            type="text"
            value={value.width}
            onChange={(e) => onChange({ ...value, width: e.target.value })}
            placeholder="0px"
            className={cn(
              'ddb:w-full ddb:h-8 ddb:px-2 ddb:text-sm',
              'ddb:bg-surface-100 dark:ddb:bg-surface-800',
              'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
              'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
            )}
          />
        </div>
        <div className="ddb:flex ddb:flex-col ddb:gap-1">
          <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
            Style
          </span>
          <Select
            value={value.style}
            onChange={(style) => onChange({ ...value, style })}
            options={borderStyleOptions}
          />
        </div>
        <div className="ddb:flex ddb:flex-col ddb:gap-1">
          <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
            Color
          </span>
          <ColorPicker
            value={value.color}
            onChange={(color) => onChange({ ...value, color })}
          />
        </div>
      </div>

      {/* Border Radius */}
      <div className="ddb:flex ddb:flex-col ddb:gap-2">
        <div className="ddb:flex ddb:items-center ddb:justify-between">
          <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
            Radius
          </span>
          <button
            onClick={() => setRadiusLinked(!radiusLinked)}
            className={cn(
              'ddb:flex ddb:items-center ddb:gap-1 ddb:px-2 ddb:py-1',
              'ddb:text-xs ddb:rounded ddb:transition-colors',
              radiusLinked
                ? 'ddb:bg-primary-100 dark:ddb:bg-primary-900/30 ddb:text-primary-600 dark:ddb:text-primary-400'
                : 'ddb:bg-surface-200 dark:ddb:bg-surface-700 ddb:text-surface-500'
            )}
          >
            {radiusLinked ? <Link2 className="ddb:w-3 ddb:h-3" /> : <Link2Off className="ddb:w-3 ddb:h-3" />}
            <span>{radiusLinked ? 'Linked' : 'Individual'}</span>
          </button>
        </div>
        <div className="ddb:grid ddb:grid-cols-4 ddb:gap-2">
          <div className="ddb:flex ddb:flex-col ddb:items-center ddb:gap-1">
            <div className="ddb:w-4 ddb:h-4 ddb:border-t-2 ddb:border-l-2 ddb:border-surface-400 ddb:rounded-tl" />
            <input
              type="text"
              value={value.radius.topLeft}
              onChange={(e) => handleRadiusChange('topLeft', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-7 ddb:px-1 ddb:text-center ddb:text-xs',
                'ddb:bg-surface-100 dark:ddb:bg-surface-800',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>
          <div className="ddb:flex ddb:flex-col ddb:items-center ddb:gap-1">
            <div className="ddb:w-4 ddb:h-4 ddb:border-t-2 ddb:border-r-2 ddb:border-surface-400 ddb:rounded-tr" />
            <input
              type="text"
              value={value.radius.topRight}
              onChange={(e) => handleRadiusChange('topRight', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-7 ddb:px-1 ddb:text-center ddb:text-xs',
                'ddb:bg-surface-100 dark:ddb:bg-surface-800',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>
          <div className="ddb:flex ddb:flex-col ddb:items-center ddb:gap-1">
            <div className="ddb:w-4 ddb:h-4 ddb:border-b-2 ddb:border-l-2 ddb:border-surface-400 ddb:rounded-bl" />
            <input
              type="text"
              value={value.radius.bottomLeft}
              onChange={(e) => handleRadiusChange('bottomLeft', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-7 ddb:px-1 ddb:text-center ddb:text-xs',
                'ddb:bg-surface-100 dark:ddb:bg-surface-800',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>
          <div className="ddb:flex ddb:flex-col ddb:items-center ddb:gap-1">
            <div className="ddb:w-4 ddb:h-4 ddb:border-b-2 ddb:border-r-2 ddb:border-surface-400 ddb:rounded-br" />
            <input
              type="text"
              value={value.radius.bottomRight}
              onChange={(e) => handleRadiusChange('bottomRight', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-7 ddb:px-1 ddb:text-center ddb:text-xs',
                'ddb:bg-surface-100 dark:ddb:bg-surface-800',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-700',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
