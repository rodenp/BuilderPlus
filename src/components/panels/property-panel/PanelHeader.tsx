import React from 'react';
import { MousePointer, Layers, Copy, Trash2 } from 'lucide-react';
import type { Theme } from './theme';

interface PanelHeaderProps {
  componentName: string;
  componentType: string;
  theme: Theme;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  componentName,
  componentType,
  theme,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: theme.primaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MousePointer style={{ width: 16, height: 16, color: theme.primaryText }} />
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>
            {componentName}
          </h3>
          <p
            style={{
              fontSize: '10px',
              color: theme.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            {componentType}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: theme.textMuted,
            cursor: 'pointer',
          }}
          title="Layers"
        >
          <Layers style={{ width: 16, height: 16 }} />
        </button>
        <button
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: theme.textMuted,
            cursor: 'pointer',
          }}
          title="Duplicate"
        >
          <Copy style={{ width: 16, height: 16 }} />
        </button>
        <button
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: theme.textMuted,
            cursor: 'pointer',
          }}
          title="Delete"
        >
          <Trash2 style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
};
