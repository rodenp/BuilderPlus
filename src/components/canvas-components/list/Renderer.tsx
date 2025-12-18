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
        margin: 0,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft || '24px',
        backgroundColor: commonStyles.backgroundColor,
        color: commonStyles.color || canvasTheme.text,
        width: commonStyles.width,
        listStyleType: listType === 'ordered' ? 'decimal' : 'disc',
        display: commonStyles.display,
        flexDirection: commonStyles.flexDirection,
        flexWrap: commonStyles.flexWrap,
        justifyContent: commonStyles.justifyContent,
        alignItems: commonStyles.alignItems,
        gap: commonStyles.gap,
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
