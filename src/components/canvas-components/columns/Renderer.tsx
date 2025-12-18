import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const columns = (props.columns as number) || 2;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: (props.gap as string) || '16px',
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
    >
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          style={{
            minHeight: '60px',
            border: `1px dashed ${canvasTheme.text}30`,
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
            Column {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};
