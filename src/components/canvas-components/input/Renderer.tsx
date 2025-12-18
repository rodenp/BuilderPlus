import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <div
      style={{
        ...commonStyles,
        width: commonStyles.width,
      }}
    >
      {(props.label as string) && (
        <label
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '14px',
            color: commonStyles.color || canvasTheme.text,
          }}
        >
          {props.label as string}
        </label>
      )}
      <input
        type={(props.type as string) || 'text'}
        placeholder={(props.placeholder as string) || 'Enter text...'}
        style={{
          width: '100%',
          padding: commonStyles.paddingTop
            ? `${commonStyles.paddingTop} ${commonStyles.paddingRight} ${commonStyles.paddingBottom} ${commonStyles.paddingLeft}`
            : '8px 12px',
          border: commonStyles.borderWidth
            ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor || '#000'}`
            : `1px solid ${canvasTheme.text}30`,
          borderRadius: commonStyles.borderRadius || '4px',
          fontSize: '14px',
          backgroundColor: commonStyles.backgroundColor || 'transparent',
          color: commonStyles.color || canvasTheme.text,
        }}
        readOnly
      />
    </div>
  );
};
