import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;

  // Resolve color: paragraph color > generic color
  const color = commonStyles.paragraphColor || commonStyles.color;

  return (
    <div
      style={{
        ...commonStyles,
        fontSize: commonStyles.paragraphFontSize || commonStyles.fontSize || '14px',
        lineHeight: commonStyles.paragraphLineHeight || commonStyles.lineHeight || 1.6,
        color: color,
        margin: 0,
        height: commonStyles.height, // Must be set for overflow to work
        maxHeight: (props.maxHeight as string) || undefined,
        overflowY: (props.overflow as any) || 'auto',
        display: commonStyles.display || 'block', // Ensure block display
      }}
      dangerouslySetInnerHTML={{ __html: (props.text as string) || 'Text' }}
    />
  );
};
