import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  canvasTheme,
  commonStyles,
}) => {
  const hasBorder = commonStyles.borderWidth && commonStyles.borderWidth !== '0px';

  return (
    <div
      style={{
        padding: commonStyles.paddingTop ? undefined : '20px',
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor || '#ffffff',
        border: hasBorder
          ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor || '#e5e7eb'}`
          : `1px solid ${canvasTheme.text}20`,
        borderRadius: commonStyles.borderRadius || commonStyles.cardBorderRadius || '8px',
        boxShadow: commonStyles.cardShadow || '0 1px 3px rgba(0,0,0,0.1)',
        minHeight: '80px',
        width: commonStyles.width,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        display: commonStyles.display,
        flexDirection: commonStyles.flexDirection,
        flexWrap: commonStyles.flexWrap,
        justifyContent: commonStyles.justifyContent,
        alignItems: commonStyles.alignItems,
        gap: commonStyles.gap,
      }}
    >
      <span style={{ color: commonStyles.color || canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
        Card
      </span>
    </div>
  );
};
