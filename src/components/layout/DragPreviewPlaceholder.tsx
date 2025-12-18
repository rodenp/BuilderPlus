import React from 'react';
import { Plus } from 'lucide-react';
import type { Theme } from '../panels/property-panel/theme';

interface DragPreviewPlaceholderProps {
  componentType: string;
  theme: Theme;
  height?: string;
}

export const DragPreviewPlaceholder: React.FC<DragPreviewPlaceholderProps> = ({
  componentType,
  theme,
  height = '60px',
}) => {
  return (
    <div
      style={{
        height,
        width: '100%',
        border: `2px dashed ${theme.primary}`,
        borderRadius: '8px',
        backgroundColor: `${theme.primary}08`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '8px 0',
        position: 'relative',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      {/* Animated background pulse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '6px',
          background: `linear-gradient(45deg, transparent, ${theme.primary}15, transparent)`,
          animation: 'slide 2s ease-in-out infinite',
        }}
      />
      
      {/* Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: theme.primary,
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: theme.primary,
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus style={{ width: 14, height: 14, color: 'white' }} />
        </div>
        Add {componentType} here
      </div>
      
      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};