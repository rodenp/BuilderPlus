import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <hr
      style={{
        border: 'none',
        borderTop: `${(props.thickness as string) || '1px'} solid ${(props.color as string) || canvasTheme.text + '30'}`,
        marginTop: commonStyles.marginTop || '16px',
        marginBottom: commonStyles.marginBottom || '16px',
        marginLeft: commonStyles.marginLeft,
        marginRight: commonStyles.marginRight,
        width: commonStyles.width,
      }}
    />
  );
};
