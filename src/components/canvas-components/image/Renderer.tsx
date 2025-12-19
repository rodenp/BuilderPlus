import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const placeholderPadding = commonStyles.mediaPlaceholderPadding || '40px';

  return (
    <div
      style={{
        ...commonStyles,
        backgroundColor: commonStyles.backgroundColor || `${canvasTheme.text}10`,
        borderRadius: commonStyles.borderRadius || '8px',
        padding: commonStyles.paddingTop ? undefined : placeholderPadding,
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        textAlign: 'center',
        color: commonStyles.color || canvasTheme.text,
      }}
    >
      {(props.src as string) ? (
        <img
          key={`img-${component.id}`}
          src={props.src as string}
          alt={(props.alt as string) || 'Image'}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      ) : (
        <span key={`img-placeholder-${component.id}`} style={{ opacity: 0.5 }}>Image placeholder</span>
      )}
    </div>
  );
};
