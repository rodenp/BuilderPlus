import React from 'react';
import type { CanvasComponentProps } from '../types';

export const Renderer: React.FC<CanvasComponentProps> = ({
  component,
  canvasTheme,
  commonStyles,
}) => {
  const { props } = component;
  const items = (props.items as string[]) || ['Home', 'Category', 'Page'];
  const separator = (props.separator as string) || '/';

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: commonStyles.width,
        marginTop: commonStyles.marginTop,
        marginRight: commonStyles.marginRight,
        marginBottom: commonStyles.marginBottom,
        marginLeft: commonStyles.marginLeft,
        paddingTop: commonStyles.paddingTop,
        paddingRight: commonStyles.paddingRight,
        paddingBottom: commonStyles.paddingBottom,
        paddingLeft: commonStyles.paddingLeft,
        backgroundColor: commonStyles.backgroundColor,
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              color: index === items.length - 1
                ? (commonStyles.color || canvasTheme.text)
                : canvasTheme.link,
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            {item}
          </a>
          {index < items.length - 1 && (
            <span style={{ color: canvasTheme.text, opacity: 0.5 }}>{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
