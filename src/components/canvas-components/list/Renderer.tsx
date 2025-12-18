import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
  renderChild,
}) => {
  const { props } = component;
  const listType = (props.listType as string) || 'unordered';
  const Tag = listType === 'ordered' ? 'ol' : 'ul';
  const children = component.children || [];

  return (
    <Tag
      style={{
        ...commonStyles,
        margin: 0,
        paddingLeft: commonStyles.paddingLeft || '24px',
        listStyleType: listType === 'ordered' ? 'decimal' : 'disc',
      }}
    >
      {children.length > 0 ? (
        children.map((child) => (
          <li key={child.id} style={{ marginBottom: '4px' }}>
            {renderChild ? renderChild(child) : (child.props.text as string) || 'Item'}
          </li>
        ))
      ) : (
        <>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </>
      )}
    </Tag>
  );
};
