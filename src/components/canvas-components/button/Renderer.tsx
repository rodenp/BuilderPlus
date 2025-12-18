import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  commonStyles,
}) => {
  const { props } = component;

  return (
    <button
      style={{
        display: 'inline-block',
        padding: commonStyles.paddingTop
          ? `${commonStyles.paddingTop} ${commonStyles.paddingRight} ${commonStyles.paddingBottom} ${commonStyles.paddingLeft}`
          : '12px 24px',
        backgroundColor: commonStyles.backgroundColor || '#2563eb',
        color: commonStyles.color || (props.textColor as string) || '#ffffff',
        border: commonStyles.borderWidth
          ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor || '#000'}`
          : 'none',
        borderRadius: commonStyles.borderRadius || '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
      }}
      onClick={(e) => {
        // In preview mode or live site, this would navigate.
        if (component.props.actionType === 'link' && component.props.url) {
          // Prevent navigation in editor?
          // Usually we want to verify it works but not navigate away.
          // window.open(component.props.url as string, '_blank');
        }
      }}
    >
      {(props.text as string) || 'Button'}
    </button>
  );
};
