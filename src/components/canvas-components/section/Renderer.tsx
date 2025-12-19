import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  canvasTheme,
  commonStyles,
}) => {
  return (
    <section
      style={{
        ...commonStyles,
        padding: commonStyles.paddingTop ? undefined : (commonStyles.sectionPadding || '40px 24px'),
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor || 'transparent',
        minHeight: '100px',
      }}
    >
      <span style={{ color: commonStyles.color || canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
        Section
      </span>
    </section>
  );
};
