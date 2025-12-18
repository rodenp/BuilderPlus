import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;
  const level = (props.level as string) || 'h2';

  const fontSizes: Record<string, string> = {
    h1: '36px',
    h2: '30px',
    h3: '24px',
    h4: '20px',
    h5: '18px',
    h6: '16px',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: fontSizes[level] || '24px',
    fontWeight: 600,
    margin: 0,
    ...commonStyles
  };

  const text = (props.text as string) || 'Heading';

  // Render the appropriate heading level
  switch (level) {
    case 'h1':
      return <h1 style={headingStyle}>{text}</h1>;
    case 'h3':
      return <h3 style={headingStyle}>{text}</h3>;
    case 'h4':
      return <h4 style={headingStyle}>{text}</h4>;
    case 'h5':
      return <h5 style={headingStyle}>{text}</h5>;
    case 'h6':
      return <h6 style={headingStyle}>{text}</h6>;
    default:
      return <h2 style={headingStyle}>{text}</h2>;
  }
};
