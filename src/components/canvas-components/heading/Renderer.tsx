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
      return <h1 style={headingStyle} dangerouslySetInnerHTML={{ __html: text }} />;
    case 'h3':
      return <h3 style={headingStyle} dangerouslySetInnerHTML={{ __html: text }} />;
    case 'h4':
      return <h4 style={headingStyle} dangerouslySetInnerHTML={{ __html: text }} />;
    case 'h5':
      return <h5 style={headingStyle} dangerouslySetInnerHTML={{ __html: text }} />;
    case 'h6':
      return <h6 style={headingStyle} dangerouslySetInnerHTML={{ __html: text }} />;
    default:
      return <h2 style={headingStyle} dangerouslySetInnerHTML={{ __html: text }} />;
  }
};
