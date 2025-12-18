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
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: commonStyles.width,
        backgroundColor: commonStyles.backgroundColor,
      }}
    >
      <input
        type="checkbox"
        checked={(props.checked as boolean) || false}
        readOnly
        style={{ width: '16px', height: '16px' }}
      />
      <label style={{ color: commonStyles.color || canvasTheme.text, fontSize: '14px' }}>
        {(props.label as string) || 'Checkbox label'}
      </label>
    </div>
  );
};
