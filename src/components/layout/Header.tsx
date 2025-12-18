import React from 'react';
import { Sun, Moon, Eye, Edit3, Undo, Redo, Settings, ChevronLeft } from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';
import type { AppMode } from '../../types';

interface HeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onSettingsClick: () => void;
  onPreviewClick: () => void;
  onBack?: () => void;
  theme: Theme;
  mode: AppMode;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onDarkModeToggle,
  onSettingsClick,
  onPreviewClick,
  onBack,
  theme,
  mode,
}) => {
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: theme.textMuted,
    cursor: 'pointer',
    transition: 'all 0.15s',
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        padding: '0 16px',
        backgroundColor: theme.bg,
      }}
    >
      {/* Left section - Back & Undo/Redo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              ...buttonStyle,
              color: theme.text,
              padding: '8px 12px 8px 8px',
              gap: '4px',
              backgroundColor: theme.bgSecondary,
            }}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Projects</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button style={buttonStyle} title="Undo">
            <Undo style={{ width: 18, height: 18 }} />
          </button>
          <button style={buttonStyle} title="Redo">
            <Redo style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Right section - Preview, Settings, Dark Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={onPreviewClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mode === 'edit' ? theme.primaryBg : theme.bgSecondary,
              color: mode === 'edit' ? theme.primaryText : theme.text,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
            title={mode === 'edit' ? 'Preview Mode' : 'Edit Mode'}
          >
            {mode === 'edit' ? (
              <>
                <Eye style={{ width: 16, height: 16 }} />
                Preview
              </>
            ) : (
              <>
                <Edit3 style={{ width: 16, height: 16 }} />
                Edit
              </>
            )}
          </button>
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: theme.border,
              margin: '0 8px',
            }}
          />
          <button
            onClick={onSettingsClick}
            style={buttonStyle}
            title="Settings"
          >
            <Settings style={{ width: 18, height: 18 }} />
          </button>
          <button
            onClick={onDarkModeToggle}
            style={{
              ...buttonStyle,
              backgroundColor: theme.bgSecondary,
              color: isDarkMode ? '#facc15' : theme.textMuted,
            }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun style={{ width: 18, height: 18 }} />
            ) : (
              <Moon style={{ width: 18, height: 18 }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
