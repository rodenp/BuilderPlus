import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const quoteBorderColor = commonStyles.quoteBorderColor || (props.borderColor as string) || `${canvasTheme.text}30`;
  const quoteBg = commonStyles.quoteBg || commonStyles.backgroundColor || `${canvasTheme.text}05`;

  return (
    <blockquote
      style={{
        ...commonStyles,
        margin: 0,
        marginTop: commonStyles.marginTop || '16px',
        marginBottom: commonStyles.marginBottom || '16px',
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft || '24px',
        borderLeft: `4px solid ${quoteBorderColor}`,
        backgroundColor: quoteBg,
        color: commonStyles.color || canvasTheme.text,
        fontStyle: (commonStyles.quoteFontStyle as any) || 'italic',
      }}
    >
      <p style={{ margin: 0 }}>{(props.text as string) || 'This is a quote.'}</p>
      {
        (props.citation as string) && (
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
        )
      }
    </blockquote >
  );
};
