import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <a
      href={(props.href as string) || '#'}
      target={(props.target as string) || '_self'}
      style={{
        color: commonStyles.color || canvasTheme.link,
        textDecoration: 'underline',
        cursor: 'pointer',
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
      }}
      onClick={(e) => e.preventDefault()}
    >
      {(props.text as string) || 'Link'}
    </a>
  );
};
