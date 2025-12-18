import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Theme } from './theme';

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  theme: Theme;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  icon,
  title,
  badge,
  isExpanded,
  onToggle,
  theme,
  children,
}) => {
  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    cursor: 'pointer',
  };

  return (
    <div style={{ borderBottom: `1px solid ${theme.border}` }}>
      <div style={sectionHeaderStyle} onClick={() => onToggle(id)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ fontSize: '14px', fontWeight: 500, color: theme.textSecondary }}>
            {title}
          </span>
          {badge && (
            <span
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 500,
                borderRadius: '4px',
                backgroundColor: theme.bgTertiary,
                color: theme.textMuted,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown style={{ width: 16, height: 16, color: theme.textMuted }} />
        ) : (
          <ChevronRight style={{ width: 16, height: 16, color: theme.textMuted }} />
        )}
      </div>
      {isExpanded && (
        <div
          style={{
            paddingBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
