import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
  renderChild,
}) => {
  const children = component.children || [];
  const hasBorder = commonStyles.borderWidth && commonStyles.borderWidth !== '0px';

  return (
    <nav
      style={{
        ...commonStyles,
        display: commonStyles.display || 'flex',
        flexDirection: commonStyles.flexDirection || 'row',
        alignItems: commonStyles.alignItems || 'center',
        gap: commonStyles.gap || '16px',
        minHeight: '40px',
        paddingTop: commonStyles.paddingTop || '8px',
        paddingRight: commonStyles.paddingRight || '8px',
        paddingBottom: commonStyles.paddingBottom || '8px',
        paddingLeft: commonStyles.paddingLeft || '8px',
        backgroundColor: commonStyles.backgroundColor || 'transparent',
        border: hasBorder
          ? `${commonStyles.borderWidth} ${commonStyles.borderStyle || 'solid'} ${commonStyles.borderColor || '#000'}`
          : `1px dashed ${canvasTheme.text}20`,
        borderRadius: commonStyles.borderRadius || '4px',
      }}
    >
      {children.length > 0 ? (
        children.map((child) => (
          <React.Fragment key={child.id}>
            {renderChild ? renderChild(child) : (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: canvasTheme.link, textDecoration: 'none' }}
              >
                {(child.props.text as string) || 'Link'}
              </a>
            )}
          </React.Fragment>
        ))
      ) : (
        <span style={{ color: canvasTheme.text, opacity: 0.5, fontSize: '12px' }}>
          Menu (add links)
        </span>
      )}
    </nav>
  );
};
