import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const hasBorder = commonStyles.borderWidth && commonStyles.borderWidth !== '0px';

  return (
    <div
      style={{
        padding: commonStyles.paddingTop ? undefined : ((props.padding as string) || '16px'),
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor || 'transparent',
        border: hasBorder
          ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor || '#000'}`
          : `1px dashed ${canvasTheme.text}30`,
        borderRadius: commonStyles.borderRadius || '4px',
        // minHeight: 'auto', // REMOVED per user request
        width: commonStyles.width,
        height: commonStyles.height,
        overflow: (props.overflow as any) || 'visible', // Default to visible for containers
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
        Container
      </span>
    </div>
  );
};
