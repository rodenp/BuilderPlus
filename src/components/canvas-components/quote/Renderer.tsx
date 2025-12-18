import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <blockquote
      style={{
        margin: 0,
        marginTop: commonStyles.marginTop || '16px',
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom || '16px',
        marginLeft: commonStyles.marginLeft,
        paddingTop: commonStyles.paddingTop || '12px',
        paddingRight: commonStyles.paddingRight || '20px',
        paddingBottom: commonStyles.paddingBottom || '12px',
        paddingLeft: commonStyles.paddingLeft || '20px',
        borderLeft: `4px solid ${(props.borderColor as string) || canvasTheme.text + '30'}`,
        backgroundColor: commonStyles.backgroundColor || `${canvasTheme.text}05`,
        color: commonStyles.color || canvasTheme.text,
        fontStyle: 'italic',
        width: commonStyles.width,
      }}
    >
      <p style={{ margin: 0 }}>{(props.text as string) || 'This is a quote.'}</p>
      {(props.citation as string) && (
        <cite
          style={{
            display: 'block',
            marginTop: '8px',
            fontSize: '14px',
            opacity: 0.7,
            fontStyle: 'normal',
          }}
        >
          — {props.citation as string}
        </cite>
      )}
    </blockquote>
  );
};
