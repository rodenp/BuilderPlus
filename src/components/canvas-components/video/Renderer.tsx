import React from 'react';
import type { CanvasComponentProps } from '../types';
import { convertToEmbedUrl, isVideoPlatformUrl } from '../../../types/media';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <div
      style={{
        backgroundColor: commonStyles.backgroundColor || `${canvasTheme.text}10`,
        borderRadius: commonStyles.borderRadius || '8px',
        padding: commonStyles.paddingTop ? undefined : '40px',
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        textAlign: 'center',
        color: commonStyles.color || canvasTheme.text,
        width: commonStyles.width,
        height: commonStyles.height,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        borderWidth: commonStyles.borderWidth,
        borderStyle: commonStyles.borderStyle as React.CSSProperties['borderStyle'],
        borderColor: commonStyles.borderColor,
      }}
    >
      {(props.src as string) ? (
        isVideoPlatformUrl(props.src as string) ? (
          <iframe
            key={`video-iframe-${component.id}`}
            src={convertToEmbedUrl(props.src as string)}
            style={{ 
              maxWidth: '100%', 
              width: '100%',
              height: '315px',
              border: 'none',
              borderRadius: 'inherit'
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={`video-${component.id}`}
            poster={(props.poster as string) || undefined}
            controls={(props.controls as boolean) !== false}
            autoPlay={(props.autoplay as boolean) || false}
            muted={(props.muted as boolean) || false}
            loop={(props.loop as boolean) || false}
            playsInline
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            <source src={props.src as string} type="video/mp4" />
          </video>
        )
      ) : (
        <span key={`video-placeholder-${component.id}`} style={{ opacity: 0.5 }}>Video placeholder</span>
      )}
    </div>
  );
};
