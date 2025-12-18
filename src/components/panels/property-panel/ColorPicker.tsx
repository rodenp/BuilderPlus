import React from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { X } from 'lucide-react';
import type { Theme } from './theme';

interface ColorPickerProps {
  label: string;
  color: string | null;
  onChange: (color: string | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  theme: Theme;
  defaultColor?: string;
  clearable?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  onChange,
  isOpen,
  onToggle,
  theme,
  defaultColor,
  clearable = false,
}) => {
  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.textMuted,
    marginBottom: '6px',
    display: 'block',
  };

  const displayColor = color || defaultColor || '#cccccc';
  const isDefault = color === null;

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <button
          onClick={onToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            height: '36px',
            padding: '0 12px',
            backgroundColor: theme.bgSecondary,
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: `1px solid ${theme.borderSecondary}`,
                backgroundColor: displayColor,
                opacity: isDefault ? 0.6 : 1,
              }}
            />
            {clearable && color !== null && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: theme.bgTertiary,
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Clear color"
              >
                <X style={{ width: 8, height: 8, color: theme.textMuted }} />
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: '14px',
              fontFamily: 'monospace',
              color: isDefault ? theme.textMuted : theme.textSecondary,
              fontStyle: isDefault ? 'italic' : 'normal',
            }}
          >
            {isDefault ? (defaultColor || 'Inherited') : color}
          </span>
        </button>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              marginTop: '8px',
              padding: '12px',
              backgroundColor: theme.bg,
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              border: `1px solid ${theme.border}`,
            }}
          >
            <HexColorPicker color={displayColor} onChange={onChange} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <span style={{ fontSize: '12px', color: theme.textMuted }}>#</span>
              <HexColorInput
                color={displayColor}
                onChange={onChange}
                style={{
                  flex: 1,
                  height: '32px',
                  padding: '0 8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                }}
              />
            </div>
            {clearable && (
              <button
                onClick={() => {
                  onChange(null);
                  onToggle();
                }}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.textMuted,
                  cursor: 'pointer',
                }}
              >
                Reset to Default
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
