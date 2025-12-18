import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  canvasTheme,
  commonStyles,
}) => {
  const hasBorder = commonStyles.borderWidth && commonStyles.borderWidth !== '0px';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        padding: commonStyles.paddingTop ? undefined : '20px',
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor || 'transparent',
        border: hasBorder
          ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor || '#000'}`
          : `1px dashed ${canvasTheme.text}30`,
        borderRadius: commonStyles.borderRadius || '4px',
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
        Form container
      </span>
    </form>
  );
};
