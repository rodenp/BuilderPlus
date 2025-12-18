import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  canvasTheme,
  commonStyles,
}) => {
  return (
    <section
      style={{
        padding: commonStyles.paddingTop ? undefined : '40px 24px',
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor || 'transparent',
        minHeight: '100px',
        width: commonStyles.width,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        borderWidth: commonStyles.borderWidth,
        borderStyle: commonStyles.borderStyle as React.CSSProperties['borderStyle'],
        borderColor: commonStyles.borderColor,
        borderRadius: commonStyles.borderRadius,
        display: commonStyles.display,
        flexDirection: commonStyles.flexDirection,
        flexWrap: commonStyles.flexWrap,
        justifyContent: commonStyles.justifyContent,
        alignItems: commonStyles.alignItems,
        gap: commonStyles.gap,
      }}
    >
      <span style={{ color: commonStyles.color || canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
        Section
      </span>
    </section>
  );
};
