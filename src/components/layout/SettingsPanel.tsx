import React from 'react';
import { X } from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';

export type PanelPosition = 'left' | 'right';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  panelPosition: PanelPosition;
  onPanelPositionChange: (position: PanelPosition) => void;
  theme: Theme;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  panelPosition,
  onPanelPositionChange,
  theme,
}) => {
  if (!isOpen) return null;

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.textMuted,
    marginBottom: '8px',
    display: 'block',
  };

  const optionButtonStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    borderRadius: '8px',
    border: `2px solid ${isActive ? theme.primary : theme.border}`,
    backgroundColor: isActive ? theme.primaryBg : theme.bgSecondary,
    color: isActive ? theme.primaryText : theme.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.15s',
    flex: 1,
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          maxWidth: '90vw',
          backgroundColor: theme.bg,
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 101,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, margin: 0 }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.textMuted,
              cursor: 'pointer',
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Panel Position */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Panel Position</label>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '12px' }}>
              Choose where the property panel and side menu appear
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => onPanelPositionChange('left')}
                style={optionButtonStyle(panelPosition === 'left')}
              >
                <div
                  style={{
                    width: '80px',
                    height: '50px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    overflow: 'hidden',
                  }}
                >
                  {/* Left layout: SideMenu | PropertyPanel | Canvas */}
                  <div
                    style={{
                      width: '8%',
                      backgroundColor: panelPosition === 'left' ? theme.primaryBg : theme.bgSecondary,
                    }}
                  />
                  <div
                    style={{
                      width: '25%',
                      backgroundColor: panelPosition === 'left' ? theme.primary : theme.bgTertiary,
                    }}
                  />
                  <div style={{ flex: 1, backgroundColor: theme.bg }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Left</span>
              </button>

              <button
                onClick={() => onPanelPositionChange('right')}
                style={optionButtonStyle(panelPosition === 'right')}
              >
                <div
                  style={{
                    width: '80px',
                    height: '50px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    overflow: 'hidden',
                  }}
                >
                  {/* Right layout: Canvas | PropertyPanel | SideMenu */}
                  <div style={{ flex: 1, backgroundColor: theme.bg }} />
                  <div
                    style={{
                      width: '25%',
                      backgroundColor: panelPosition === 'right' ? theme.primary : theme.bgTertiary,
                    }}
                  />
                  <div
                    style={{
                      width: '8%',
                      backgroundColor: panelPosition === 'right' ? theme.primaryBg : theme.bgSecondary,
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
