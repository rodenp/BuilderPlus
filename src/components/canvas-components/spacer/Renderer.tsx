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
        height: commonStyles.height || (props.height as string) || '32px',
        backgroundColor: commonStyles.backgroundColor || `${canvasTheme.text}05`,
        borderRadius: commonStyles.borderRadius || '4px',
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
      }}
    />
  );
};
