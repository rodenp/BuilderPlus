import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;
  const level = (props.level as string) || 'h2';

  // Use themeable font sizes if available, otherwise fallback to standard values
  // Prioritize level-specific size (h1FontSize) > generic heading size > generic font size > default
  const fontSize = commonStyles[`${level}FontSize` as string] ||
    commonStyles.headingFontSize ||
    commonStyles.fontSize ||
    '24px';

  // Resolve color: level-specific > heading color > generic color
  const color = commonStyles[`${level}Color` as string] ||
    commonStyles.headingColor ||
    commonStyles.color;

  const headingStyle: React.CSSProperties = {
    ...commonStyles,
    fontSize: fontSize,
    fontWeight: commonStyles[`${level}FontWeight` as string] || commonStyles.headingFontWeight || 600,
    lineHeight: commonStyles[`${level}LineHeight` as string] || commonStyles.lineHeight || 1.2,
    color: color,
    margin: 0,
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
