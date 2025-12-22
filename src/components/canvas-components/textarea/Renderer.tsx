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
      <textarea
        placeholder={(props.placeholder as string) || 'Enter text...'}
        rows={(props.rows as number) || 4}
        style={{
          width: '100%',
          padding: commonStyles.paddingTop
            ? `${commonStyles.paddingTop} ${commonStyles.paddingRight} ${commonStyles.paddingBottom} ${commonStyles.paddingLeft}`
            : '8px 12px',
          border: commonStyles.borderWidth
            ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor}`
            : 'none',
          borderRadius: commonStyles.borderRadius || '4px',
          fontSize: '14px',
          backgroundColor: commonStyles.backgroundColor || 'transparent',
          color: commonStyles.color || canvasTheme.text,
          resize: 'vertical',
        }}
        readOnly
      />
    </div>
  );
};
