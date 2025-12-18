import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <span
      style={{
        ...commonStyles,
        color: commonStyles.color,
      }}
    >
      {(props.text as string) || 'Text'}
    </span>
  );
};
