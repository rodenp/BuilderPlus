import React from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { X } from 'lucide-react';
import type { Theme } from './theme';

interface ColorPickerProps {
  label: string;
  color: string | null | undefined; // Allow undefined for "default" state
  onChange: (color: string | null | undefined) => void; // Allow undefined for "default" state
  isOpen: boolean;
  onToggle: () => void;
  theme: Theme;
  defaultColor?: string; // Component-specific default (e.g. Blue)
  themeDefault?: string; // Pure theme-inherited color (e.g. Black/White)
  inheritedValue?: string; // Value from parent/theme when everything is cleared
  clearable?: boolean;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  onChange,
  isOpen,
  onToggle,
  theme,
  defaultColor,
  themeDefault,
  inheritedValue, // Destructured inheritedValue
  clearable = false,
  disabled = false,
}) => {
  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.textMuted,
    marginBottom: '6px',
    display: 'block',
    opacity: disabled ? 0.6 : 1
  };

  // Priority: User selection > Component Default > Theme Default > Fallback
  // State distinction:
  // - Manual: color is a hex string
  // - Default: color is undefined
  // - Inherited: color is null

  const displayColor = (() => {
    // 1. Manual override takes precedence
    if (color !== null && color !== undefined) return color;
    // 2. Explicit null means "bypass component defaults and inherit from parent/context"
    if (color === null) return inheritedValue || themeDefault || '#cccccc';
    // 3. undefined means "use component default"
    return defaultColor || inheritedValue || themeDefault || '#cccccc';
  })().toUpperCase();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (color !== null && color !== undefined) {
      // Step 1: Clear manual to Default (undefined) or straight to Inherited (null) if no defaultColor
      if (defaultColor !== undefined) {
        onChange(undefined);
      } else {
        onChange(null);
      }
    } else if (color === undefined) {
      // Step 2: Clear Default to Inherited (null)
      onChange(null);
    }
  };

  const hasValueToClear = (() => {
    // If no value is set, nothing to clear
    if (color === null || color === undefined) return false;

    // Normalize colors for comparison (trim and lowercase)
    const normalizedColor = color.trim().toLowerCase();
    const normalizedDefault = defaultColor?.trim().toLowerCase();
    const normalizedTheme = themeDefault?.trim().toLowerCase();

    // Only set "clearable" if it's different from ALL available defaults
    const isDefault = normalizedColor === normalizedDefault;
    const isTheme = normalizedColor === normalizedTheme;

    return !isDefault && !isTheme;
  })();

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => !disabled && onToggle()}
          disabled={disabled}
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
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1
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
              }}
            />
            {clearable && hasValueToClear && !disabled && (
              <div
                onClick={handleClear}
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
              color: (color === null || color === undefined) ? theme.textSecondary : theme.text,
            }}
          >
            {displayColor}
          </span>
        </button>
        {isOpen && !disabled && (
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
            <HexColorPicker color={displayColor} onChange={(c) => onChange(c)} />
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
                onChange={(c) => onChange(c)}
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
          </div>
        )}
      </div>
    </div>
  );
};
