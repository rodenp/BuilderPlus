import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const dividerColor = commonStyles.dividerColor || (props.color as string) || `${canvasTheme.text}30`;

  return (
    <hr
      style={{
        ...commonStyles,
        border: 'none',
        borderTop: `${(props.thickness as string) || '1px'} ${(props.style as string) || 'solid'} ${dividerColor}`,
        marginTop: commonStyles.marginTop || '16px',
        marginBottom: commonStyles.marginBottom || '16px',
        width: commonStyles.width,
      }}
    />
  );
};
