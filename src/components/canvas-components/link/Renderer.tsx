import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <a
      href={(props.href as string) || '#'}
      target={(props.target as string) || '_self'}
      style={{
        ...commonStyles,
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
      onClick={(e) => e.preventDefault()}
    >
      {(props.text as string) || 'Link'}
    </a>
  );
};
