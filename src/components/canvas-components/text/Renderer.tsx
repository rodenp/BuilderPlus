import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;

  const textStyle: React.CSSProperties = {
    ...commonStyles,
    fontSize: commonStyles.fontSize || '16px',
    fontWeight: commonStyles.fontWeight || 400,
    lineHeight: commonStyles.lineHeight || 1.5,
    color: commonStyles.color,
    margin: 0,
    display: 'block',
    width: '100%',
  };

  const text = (props.text as string) || 'Text';

  return (
    <div
      style={textStyle}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
