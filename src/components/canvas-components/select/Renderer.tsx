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
        width: commonStyles.width,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
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
      <select
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
      >
        <option value="">{(props.placeholder as string) || 'Select an option'}</option>
        {((props.options as string[]) || ['Option 1', 'Option 2', 'Option 3']).map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};
