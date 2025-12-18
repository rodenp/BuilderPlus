import React from 'react';

interface DropIndicatorProps {
  position: 'before' | 'after';
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
        borderRadius: '2px',
        zIndex: 100,
        pointerEvents: 'none',
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
        animation: 'dropIndicatorPulse 1s ease-in-out infinite',
        ...(position === 'before' ? { top: '-2px' } : { bottom: '-2px' }),
      }}
    />
  );
};
