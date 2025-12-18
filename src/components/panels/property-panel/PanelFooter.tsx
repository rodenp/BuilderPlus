import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Theme } from './theme';

interface PanelFooterProps {
  componentId: string;
  theme: Theme;
}

export const PanelFooter: React.FC<PanelFooterProps> = ({ componentId, theme }) => {
  return (
    <div
      style={{
        padding: '12px',
        borderTop: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: theme.textMuted,
        }}
      >
        <span>Component ID: {componentId}...</span>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            background: 'transparent',
            color: theme.textMuted,
            cursor: 'pointer',
          }}
        >
          <MoreHorizontal style={{ width: 12, height: 12 }} />
          More options
        </button>
      </div>
    </div>
  );
};
