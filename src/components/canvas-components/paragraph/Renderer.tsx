import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <div
      style={{
        ...commonStyles,
        // fontSize: '14px', // Removed to follow inherited/prop styles
        // lineHeight: 1.6,  // Removed to follow inherited/prop styles
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
