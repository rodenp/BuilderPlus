import React, { useState } from 'react';
import { Link2, Link2Off } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SpacingValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface SpacingControlProps {
  value: SpacingValues;
  onChange: (value: SpacingValues) => void;
  label?: string;
  type?: 'margin' | 'padding';
  className?: string;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  value,
  onChange,
  label,
  type = 'padding',
  className,
}) => {
  const [linked, setLinked] = useState(
    value.top === value.right && value.right === value.bottom && value.bottom === value.left
  );

  const handleChange = (side: keyof SpacingValues, newValue: string) => {
    if (linked) {
      onChange({
        top: newValue,
        right: newValue,
        bottom: newValue,
        left: newValue,
      });
    } else {
      onChange({
        ...value,
        [side]: newValue,
      });
    }
  };

  return (
    <div className={cn('ddb:flex ddb:flex-col ddb:gap-2', className)}>
      {label && (
        <label className="ddb:text-xs ddb:font-medium ddb:text-surface-600 dark:ddb:text-surface-400">
          {label}
        </label>
      )}
      <div className="ddb:relative ddb:p-3 ddb:bg-surface-50 dark:ddb:bg-surface-800/50 ddb:rounded-lg ddb:border ddb:border-surface-200 dark:ddb:border-surface-700">
        {/* Link toggle button */}
        <button
          onClick={() => setLinked(!linked)}
          className={cn(
            'ddb:absolute ddb:top-1/2 ddb:left-1/2 -ddb:translate-x-1/2 -ddb:translate-y-1/2',
            'ddb:w-8 ddb:h-8 ddb:flex ddb:items-center ddb:justify-center',
            'ddb:rounded-full ddb:transition-colors',
            linked
              ? 'ddb:bg-primary-100 dark:ddb:bg-primary-900/30 ddb:text-primary-600 dark:ddb:text-primary-400'
              : 'ddb:bg-surface-200 dark:ddb:bg-surface-700 ddb:text-surface-500'
          )}
          title={linked ? 'Unlink values' : 'Link values'}
        >
          {linked ? <Link2 className="ddb:w-4 ddb:h-4" /> : <Link2Off className="ddb:w-4 ddb:h-4" />}
        </button>

        {/* Visual box model representation */}
        <div className="ddb:grid ddb:grid-cols-3 ddb:gap-2">
          {/* Top */}
          <div className="ddb:col-start-2">
            <input
              type="text"
              value={value.top}
              onChange={(e) => handleChange('top', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-8 ddb:px-2 ddb:text-center ddb:text-sm',
                'ddb:bg-white dark:ddb:bg-surface-900',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-600',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>

          {/* Left, Center label, Right */}
          <div className="ddb:col-start-1">
            <input
              type="text"
              value={value.left}
              onChange={(e) => handleChange('left', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-8 ddb:px-2 ddb:text-center ddb:text-sm',
                'ddb:bg-white dark:ddb:bg-surface-900',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-600',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>
          <div className="ddb:flex ddb:items-center ddb:justify-center">
            <span className="ddb:text-[10px] ddb:uppercase ddb:tracking-wider ddb:text-surface-400">
              {type}
            </span>
          </div>
          <div className="ddb:col-start-3">
            <input
              type="text"
              value={value.right}
              onChange={(e) => handleChange('right', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-8 ddb:px-2 ddb:text-center ddb:text-sm',
                'ddb:bg-white dark:ddb:bg-surface-900',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-600',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>

          {/* Bottom */}
          <div className="ddb:col-start-2">
            <input
              type="text"
              value={value.bottom}
              onChange={(e) => handleChange('bottom', e.target.value)}
              placeholder="0"
              className={cn(
                'ddb:w-full ddb:h-8 ddb:px-2 ddb:text-center ddb:text-sm',
                'ddb:bg-white dark:ddb:bg-surface-900',
                'ddb:border ddb:border-surface-200 dark:ddb:border-surface-600',
                'ddb:rounded focus:ddb:outline-none focus:ddb:ring-2 focus:ddb:ring-primary-500/50'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
