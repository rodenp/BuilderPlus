import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
  renderChild,
}) => {
  const { props } = component;
  const listStyle = (props.listStyle as string) || 'disc';
  const Tag = listStyle === 'decimal' ? 'ol' : 'ul';
  const children = component.children || [];
  const items = Array.isArray(props.items) ? props.items : (typeof props.items === 'string' ? (props.items as string).split('\n') : []);
  const spacing = commonStyles.listItemSpacing || '4px';

  return (
    <Tag
      style={{
        ...commonStyles,
        margin: 0,
        paddingLeft: commonStyles.paddingLeft || '24px',
        listStyleType: listStyle,
        color: commonStyles.color || canvasTheme.text,
      }}
    >
      {children.length > 0 ? (
        children.map((child) => (
          <li key={child.id} style={{ marginBottom: spacing }}>
            {renderChild ? renderChild(child) : (child.props.text as string) || 'Item'}
          </li>
        ))
      ) : items.length > 0 ? (
        items.map((item, i) => (
          <li key={i} style={{ marginBottom: spacing }}>{item}</li>
        ))
      ) : (
        <>
          <li style={{ marginBottom: spacing }}>Item 1</li>
          <li style={{ marginBottom: spacing }}>Item 2</li>
          <li style={{ marginBottom: spacing }}>Item 3</li>
        </>
      )}
    </Tag>
  );
};
