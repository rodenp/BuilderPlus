import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <div
      style={{
        // fontSize: '14px', // Removed to follow inherited/prop styles
        // lineHeight: 1.6,  // Removed to follow inherited/prop styles
        color: commonStyles.color || canvasTheme.text,
        margin: 0,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor,
        width: commonStyles.width,
        height: commonStyles.height, // Must be set for overflow to work
        maxHeight: (props.maxHeight as string) || undefined,
        overflowY: (props.overflow as any) || 'auto',
        display: commonStyles.display || 'block', // Ensure block display
      }}
      dangerouslySetInnerHTML={{ __html: (props.text as string) || 'This is a paragraph of text.' }}
    />
  );
};
