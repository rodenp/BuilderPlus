import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { Theme } from './theme';

interface SpacingInputProps {
  value: string;
  onChange: (value: string) => void;
  bgColor: string;
  borderColor: string;
  theme: Theme;
}

// Helper to increment/decrement numeric values
export const adjustValue = (currentValue: string, delta: number): string => {
  const num = parseInt(currentValue) || 0;
  return String(Math.max(0, num + delta));
};

export const SpacingInput: React.FC<SpacingInputProps> = ({
  value,
  onChange,
  bgColor,
  borderColor,
  theme,
}) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height: '28px',
        paddingLeft: '4px',
        paddingRight: '20px',
        textAlign: 'center',
        fontSize: '12px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        color: theme.text,
        outline: 'none',
      }}
      placeholder="0"
    />
    <div
      style={{
        position: 'absolute',
        right: '2px',
        top: '2px',
        bottom: '2px',
        display: 'flex',
        flexDirection: 'column',
        width: '16px',
      }}
    >
      <button
        onClick={() => onChange(adjustValue(value, 1))}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '2px 2px 0 0',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: theme.bgTertiary,
          color: theme.text,
        }}
        type="button"
      >
        <ChevronUp style={{ width: 12, height: 12 }} />
      </button>
      <button
        onClick={() => onChange(adjustValue(value, -1))}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 0 2px 2px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: theme.bgTertiary,
          color: theme.text,
        }}
        type="button"
      >
        <ChevronDown style={{ width: 12, height: 12 }} />
      </button>
    </div>
  </div>
);
